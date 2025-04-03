import ChainIds from './chain-ids'

export const SUPPORTED_CHAINS = [
	'BITCOIN',
	'ETHEREUM',
	'SOLANA',
	'SUI',
  'APTOS',
  'TON',
  'NEAR',
  'TRON',
  'XRP',
  'CARDANO',
  'COSMOS'
]

export const BASE_URL = 'https://build.caishen.xyz';

export enum ChainType {
  BITCOIN = 'BITCOIN',
  SOLANA = 'SOLANA',
  ETHEREUM = 'ETHEREUM',
  SUI = 'SUI',
  APTOS = 'APTOS',
  TON = 'TON',
  NEAR = 'NEAR',
  TRON = 'TRON',
  XRP = 'XRP',
  CARDANO = 'CARDANO',
  COSMOS = 'COSMOS'
}

export interface IWalletAccount {
  chainType: string; 
  account: number;
  chainId?: ChainIds
  rpc?: string;
}

export interface BalanceOption {
  account: string;
  chainType: number;
  chainId: ChainIds;
  walletAddress?: string;
  tokenAddress: string;
}

export interface TransferOption {
  account: string;
  chainType: number;
  rpc?: string;
  token?: string;
  amount: string;
  toAddress: string;
}