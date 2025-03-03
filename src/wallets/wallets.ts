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

import * as SOLANA from '../utils/solana';
import * as ETHEREUM from '../utils/ethereum';
import * as BITCOIN from '../utils/bitcoin';
import * as SUI from '../utils/sui';
import * as APTOS from '../utils/aptos';
import * as TON from '../utils/ton';
import * as NEAR from '../utils/near';
import * as TRON from '../utils/tron';
import * as XRP from '../utils/xrp';
import * as CARDANO from '../utils/cardano';


const BASE_URL = 'https://build.caishen.xyz';

export class CaishenSDK {
  
  private projectKey: string;
  private agentToken: string | null = null;
  private userToken: string | null = null;
  private connectedAs: 'agent' | 'user' | null = null;

  constructor(projectKey: string) {
    if (!projectKey) {
      throw new Error('Project key is required');
    }
    this.projectKey = projectKey;
  }

  async connectAsAgent(agentId?: string, userId?: string): Promise<string> {
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

  async connectAsUser(provider: string, token: string): Promise<string> {
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

  async getWallet(chainType: string, account: number): Promise<any> {
    if (!chainType || account === undefined) {
      throw new Error('chainType and account number are required');
    }
    const authToken = this.agentToken || this.userToken;
    if (!authToken) {
      throw new Error('Authenticate as an agent or user before fetching wallets');
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/wallets`,
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

  async getWalletSigner(chainType: string, account: number, chainId?: string): Promise<any> {
    try {
      const wallet = await this.getWallet(chainType, account);
      if (!wallet || !wallet.privateKey) {
        throw new Error('Invalid wallet data');
      }
      const signer = await this._generateSigner({
        chainType,
        privateKey: wallet.privateKey,
        chainId,
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
        `${BASE_URL}/wallets/supported`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return response.data;
    } catch (err) {
      throw new Error('Failed to get supported chain types')
    }
  }

  private async _generateSigner({
    chainType,
    privateKey,
    chainId,
  }: {
    chainType: string;
    privateKey: string;
    chainId?: any;
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
        return this.generateETHWallet(privateKey, chainId);
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

  private generateETHWallet(pk: string, chainId?: number) {
    const evmChain = Chains[chainId ?? 1];

    if (!evmChain) {
      throw new Error(`Not evm chain id = ${chainId}`);
    }

    const defaultProvider = new ethers.providers.JsonRpcProvider(
      Chains[chainId ?? 1].publicRpc,
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

  static solana() {
    return {
      swap: (signer: any) => SOLANA.swap(signer),
      send: (signer: any) => SOLANA.send(signer),
    };
  }

  static ethereum() {
    return {
      swap: (signer: any) => ETHEREUM.swap(signer),
      send: (signer: any) => ETHEREUM.send(signer),
    };
  }

  static bitcoin() {
    return {
      swap: (signer: any) => BITCOIN.swap(signer),
      send: (signer: any) => BITCOIN.send(signer),
    };
  }

  static sui() {
    return {
      swap: (signer: any) => SUI.swap(signer),
      send: (signer: any) => SUI.send(signer),
    };
  }

  static aptos() {
    return {
      swap: (signer: any) => APTOS.swap(signer),
      send: (signer: any) => APTOS.send(signer),
    };
  }

  static ton() {
    return {
      swap: (signer: any) => TON.swap(signer),
      send: (signer: any) => TON.send(signer),
    };
  }

  static near() {
    return {
      swap: (signer: any) => NEAR.swap(signer),
      send: (signer: any) => NEAR.send(signer),
    };
  }

  static tron() {
    return {
      swap: (signer: any) => TRON.swap(signer),
      send: (signer: any) => TRON.send(signer),
    };
  }

  static xrp() {
    return {
      swap: (signer: any) => XRP.swap(signer),
      send: (signer: any) => XRP.send(signer),
    };
  }

  static cardano() {
    return {
      swap: (signer: any) => CARDANO.swap(signer),
      send: (signer: any) => CARDANO.send(signer),
    };
  }


}

export default CaishenSDK;
