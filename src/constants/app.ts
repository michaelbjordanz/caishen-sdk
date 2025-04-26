import ChainIds from './chain-ids';

export const BASE_URL = 'https://build.caishen.tech';

export enum ChainType {
  BITCOIN = 'BITCOIN',
  LITECOIN = 'LITECOIN',
  DASHCOIN = 'DASHCOIN',
  DOGECOIN = 'DOGECOIN',
  SOLANA = 'SOLANA',
  ETHEREUM = 'ETHEREUM',
  SUI = 'SUI',
  APTOS = 'APTOS',
  TON = 'TON',
  NEAR = 'NEAR',
  TRON = 'TRON',
  XRP = 'XRP',
  CARDANO = 'CARDANO',
  COSMOS = 'COSMOS',
}

export interface IWalletAccount {
  account: number;
  chainType: string;
  chainId?: ChainIds;
  rpc?: string;
}
