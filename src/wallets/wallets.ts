import axios from 'axios';
import { Keypair } from '@solana/web3.js';
const crypto = require('crypto');
import * as bs58 from 'bs58';
const nacl = require('tweetnacl');
import * as bitcoin from 'bitcoinjs-lib';
import type { ECPairAPI } from 'ecpair';
import ECPairFactory from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Wallet, ethers } from 'ethers';
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
const TonWeb = require('tonweb');
import Chains from '../constants/chains';
import { SUPPORTED_CHAINS, BASE_URL } from '../constants';
import PublicRpcEndpoints from '../constants/public-rpc-endpoints';
import ChainIds from '../constants/chain-ids';

import * as CASH from '../cash';
import * as CRYPTO from '../crypto';

const MODULES: Record<string, any> = {
  CASH,
  CRYPTO
};

export class CaishenSDK {
  
  private projectKey: string;
  private agentToken: string | null = null;
  private userToken: string | null = null;
  private connectedAs: 'agent' | 'user' | null = null;

  constructor({ projectKey }: { projectKey: string }) {
    if (!projectKey) {
      throw new Error('Project key is required');
    }
    this.projectKey = projectKey;

    // init all util modules
    this.initializeModules();
  }

  private initializeModules() {
    for (const chain of SUPPORTED_CHAINS) {
      const chainKey = chain.toUpperCase();
      if (MODULES[chainKey]) {
        (this as any)[chain.toLowerCase()] = this.bindModule(MODULES[chainKey]);
      }
    }
  }

  private bindModule(module: any) {
    const boundModule: any = {};
    for (const key of Object.keys(module)) {
      if (typeof module[key] === "function") {
        boundModule[key] = module[key].bind(this); // Bind SDK context to the function
      }
    }
    return boundModule;
  }

  async connectAsAgent({
    agentId,
    userId,
  }: {
    agentId?: string;
    userId?: string;
  }): Promise<string> {
    if (this.connectedAs) {
      throw new Error('Already connected as a user or agent. Create a new instance to connect again.');
    }
    try {
      const response = await axios.post<{ agentToken: string }>(
        `${BASE_URL}/auth/agents/connect`,
        { agentId, userId },
        { headers: { projectKey: this.projectKey } }
      );
      this.agentToken = response.data.agentToken;
      this.connectedAs = 'agent';
      return this.agentToken;
    } catch (error: any) {
      throw new Error(`Agent authentication failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async connectAsUser({
    provider, 
    token
  }: {
    provider: string;
    token: string;
  }): Promise<string> {
    if (this.connectedAs) {
      throw new Error('Already connected as a user or agent. Create a new instance to connect again.');
    }
    try {
      const response = await axios.post<{ userToken: string }>(
        `${BASE_URL}/auth/users/connect`,
        { provider, token },
        { headers: { projectKey: this.projectKey } }
      );
      this.userToken = response.data.userToken;
      this.connectedAs = 'user';
      return this.userToken;
    } catch (error: any) {
      throw new Error(`User authentication failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async getWalletRaw({
    chainType, 
    account
  }: {
    chainType: string;
    account: number;
  }): Promise<any> {
    if (!chainType || account === undefined) {
      throw new Error('chainType and account number are required');
    }
    const authToken = this.agentToken || this.userToken;
    if (!authToken) {
      throw new Error('Authenticate as an agent or user before fetching wallets');
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/api/wallets`,
        {
          params: { chainType, account },
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get wallet: ${error.response?.data?.message || error.message}`);
    }
  }

  async getWalletSigner({
    chainType, 
    account, 
    rpc
  }: {
    chainType: string;
    account: number;
    rpc?: string;
  }): Promise<any> {
    try {
      const wallet = await this.getWalletRaw({ chainType, account });
      if (!wallet || !wallet.privateKey) {
        throw new Error('Invalid wallet data');
      }
      const signer = await this._generateSigner({
        chainType,
        privateKey: wallet.privateKey,
        rpc,
      });
      return signer;
    } catch (error: any) {
      throw new Error(`Failed to get wallet signer: ${error.response?.data?.message || error.message}`);
    }
  }

  async getSupportedChainTypes() {
    try {
      const authToken = this.agentToken || this.userToken;
      if (!authToken) {
        throw new Error('Authenticate as an agent or user before fetching wallets');
      }
      const response = await axios.get(
        `${BASE_URL}/api/wallets/supported`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return response.data;
    } catch (err) {
      throw new Error('Failed to get supported chain types')
    }
  }

  async getRPC(chainId: ChainIds) {
    if (!PublicRpcEndpoints[chainId]) {
      throw new Error(`RPC for ${chainId} not supported`);
    }
    return PublicRpcEndpoints[chainId];
  }

  private async _generateSigner({
    chainType,
    privateKey,
    rpc,
  }: {
    chainType: string;
    privateKey: string;
    rpc?: string;
  }) {
    switch (chainType) {
      case 'SOLANA': {
        const privateKeyBytes = Buffer.from(privateKey, 'hex');
        const keypair = Keypair.fromSecretKey(privateKeyBytes);
        return keypair;
      }
      case 'BITCOIN': {
        return this.generateBitcoinWallet(privateKey);
      }
      case 'SUI': {
        const keypair = Ed25519Keypair.fromSecretKey(privateKey);
        return keypair;
      }
      case 'ETHEREUM': {
        return this.generateETHWallet(privateKey, rpc);
      }
      case 'APTOS': {
        // Remove the '0x' prefix if it exists
        const cleanedPrivateKey = privateKey.startsWith('0x')
          ? privateKey.slice(2)
          : privateKey;
        // Convert the private key string back into a Buffer
        const privateKeyBuffer: any = Buffer.from(cleanedPrivateKey, 'hex');
        const _p = new Ed25519PrivateKey(privateKeyBuffer);
        const account = await Account.fromPrivateKey({ privateKey: _p });
        return account;
      }
      case 'TON': {
        // Initialize TonWeb instance
        const tonweb = new TonWeb();
        // Convert the private key from hex to a Uint8Array
        const privateKeyBytes = tonweb.utils.hexToBytes(privateKey);
        // Extract the seed from the first 32 bytes of the private key
        const seed = privateKeyBytes.slice(0, 32);
        // Recreate the key pair using the seed
        const keyPair = (tonweb.utils as any).keyPairFromSeed(seed);
        return keyPair;
      }
      case 'XRP': {
        const { deriveKeypair } = require('ripple-keypairs');
        return deriveKeypair(privateKey);
      }
      case 'NEAR': {
        const { KeyPair } = require('near-api-js');
        return KeyPair.fromString(privateKey);
      }
      case 'TRON': {
        const TronWeb = require('tronweb');
        const tronWeb = new TronWeb({
          fullHost: 'https://api.trongrid.io',
        });
        return tronWeb.address.fromPrivateKey(privateKey);
      }
      case 'CARDANO': {
        const CardanoWasm = require('@emurgo/cardano-serialization-lib-nodejs');
        const entropy = Buffer.from(privateKey, 'hex');
        const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(entropy, Buffer.alloc(0));
        const accountKey = rootKey.derive(1852 | 0x80000000).derive(1815 | 0x80000000).derive(0 | 0x80000000);
        const privateKeyHex = Buffer.from(accountKey.as_bytes()).toString('hex');
        const publicKeyHex = Buffer.from(accountKey.to_public().as_bytes()).toString('hex');
        return { publicKey: publicKeyHex, privateKey: privateKeyHex };
      }
      default:
        return;
    }
  }

  private generateETHWallet(pk: string, rpc?: string) {
    const defaultProvider = new ethers.providers.JsonRpcProvider(
      rpc ?? Chains[1].publicRpc,
    );
    return new Wallet(pk, defaultProvider);
  }

  private generateBitcoinWallet(privateKeyWIF: string) {
    try {
      // Create an instance of ECPair using tiny-secp256k1
      const ECPair: ECPairAPI = ECPairFactory(tinysecp);

      // Select the Bitcoin network
      const network = bitcoin.networks.bitcoin; // Change to `bitcoin.networks.testnet` if needed

      // Load the private key using WIF (Wallet Import Format)
      const keyPair: any = ECPair.fromWIF(privateKeyWIF, network);

      // Generate the P2WPKH (SegWit) address
      const { address }: any = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network });

      return {
        keyPair,  // ECPair object to sign transactions
        address,  // SegWit Bitcoin address
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate Bitcoin wallet: ${error.message}`);
      }
      throw new Error('Failed to generate Bitcoin wallet: Unknown error occurred');
    }
  }

}

export default CaishenSDK;
