import axios from 'axios';
import { BASE_URL, ChainType, IWalletAccount } from '../constants';
import { Token } from '../cash/schema';

import type { CaishenSDK } from '../caishen';

export type TokenWithPrice = Token & {
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

export async function swap(
  this: CaishenSDK,
  {
    wallet,
    payload,
  }: {
    wallet: Pick<IWalletAccount, 'account' | 'chainType'>;
    payload: {
      confirmationCode: string;
    };
  },
): Promise<RouteExecutedResponse> {
  const authToken = this.userToken || this.agentToken;

  if (!authToken) {
    throw new Error('Authentication required. Connect as user or agent first.');
  }

  try {
    const url = `${BASE_URL}/api/crypto/swap`;
    const { data: routeOutput } = await axios.post<RouteExecutedResponse>(
      url,
      {
        wallet,
        payload,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    return routeOutput;
  } catch (error) {
    throw new Error(
      `Failed to execute the swap route: ${error.response?.data?.message || error.message}`,
    );
  }
}

export async function getSwapRoute(
  this: CaishenSDK,
  {
    wallet,
    payload,
  }: {
    wallet: Pick<IWalletAccount, 'account'>;
    payload: {
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
    };
  },
): Promise<RouteOutput> {
  const authToken = this.userToken || this.agentToken;

  if (!authToken) {
    throw new Error('Authentication required. Connect as user or agent first.');
  }

  try {
    const url = `${BASE_URL}/api/crypto/swap-route`;
    const { data: routeOutput } = await axios.post<RouteOutput>(
      url,
      {
        wallet,
        payload,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    return routeOutput;
  } catch (error) {
    throw new Error(
      `Failed to get route to execute: ${error.response?.data?.message || error.message}`,
    );
  }
}
