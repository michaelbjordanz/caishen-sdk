import { ChainType } from '../constants';
import { Token } from '../cash/schema';
import { Method } from 'axios';

export type BaseRequest<Wallet, Payload> = {
  wallet: Wallet;
  payload: Payload;
  /**
   * Optionally, you may specify another authorization token on the fly in order to access Caishen API.
   */
  authToken?: string;
}

export interface GetBalancePayload {
  /**
   * If not specified, native token will be used.
   */
  token?: string;
}

export interface InitCaishenSDK {
  projectKey: string;
}

export interface ConnectAsAgentPayload {
  agentId?: string;
  userId?: string;
}

export interface ConnectAsUserPayload {
  provider?: string | 'custom';
  token: string;
}

export type IssueAuthTokenPayload =
  | ConnectAsUserPayload & { connectAs: 'user' }
  | ConnectAsAgentPayload & { connectAs: 'agent' }

export interface SendTransactionPayload {
  /**
   * If not specified, native token will be used.
   */
  token?: string;
  amount: string;
  toAddress: string;
  memo?: number;
}

export interface SignPayload {
  /**
   * Either serialized transaction or any transaction data to issue signature.
   */
  transactionData: string
}

export interface SignAndSendPayload {
  /**
   * Serialized transaction (e.g. with [serializeTransaction]{@link https://viem.sh/docs/utilities/serializeTransaction.html}) - Hex
   */
  serializedTransaction: string;
}

type TokenWithPrice = Token & {
  priceUSD: string;
};

export interface RouteOutput {
  id: string;

  fromChainId: number;
  fromAmountUSD: string;
  fromAmount: string;
  fromToken: TokenWithPrice;
  fromAddress?: string;

  toChainId: number;
  toAmountUSD: string;
  toAmount: string;
  toAmountMin: string;
  toToken: TokenWithPrice;
  toAddress?: string;

  confirmationCode: string;
}

export interface RouteExecutedResponse {
  transactionStatus: string;
  transactionHash: string | null;
  fees: string | null;
  error: string | null;
}

export interface WalletAccount {
  account: number;
  chainType: string;
  chainId?: number;
  rpc?: string;
}

export interface WalletInfo {
  account: number;
  address: string;
  chainType: string;
  publicKey: string;
  privateKey?: string;
}

export interface ExecuteSwapPayload {
  confirmationCode: string;
}

export interface GetSwapPayload {
  amount: string;
  from: {
    tokenAddress: string;
    chainType: ChainType;
    chainId?: number;
  };
  to: {
    tokenAddress: string;
    chainType: ChainType;
    chainId?: number;
  };
}

export interface InvokeTool {
  tool: string;
  method: Method;
  route: string;
  query?: Record<string, any>;
  headers?: Record<string, string>;
  body?: Record<string, any>;
}