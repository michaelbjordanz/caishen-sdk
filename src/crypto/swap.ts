import axios from 'axios';
import { BASE_URL, ChainType } from '../constants';

import type { CaishenSDK } from '../caishen';
import {
  BaseRequest,
  ExecuteSwapPayload,
  GetSwapPayload,
  RouteExecutedResponse,
  RouteOutput,
  WalletAccount,
} from '../types';

export async function swap(
  this: CaishenSDK,
  request: BaseRequest<
    Pick<WalletAccount, 'account' | 'chainType'>,
    ExecuteSwapPayload
  >
): Promise<RouteExecutedResponse> {
  const {
    wallet,
    payload,
    authToken = this.userToken || this.agentToken,
  } = request;

  if (!authToken) {
    throw new Error('Authentication token required. Connect as user/agent first or pass authorization token separately.');
  }

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
}

export async function getSwapRoute(
  this: CaishenSDK,
  request: BaseRequest<
    Pick<WalletAccount, 'account'>,
    GetSwapPayload
  >
): Promise<RouteOutput> {
  const {
    wallet,
    payload,
  } = request
  const authToken = this.userToken || this.agentToken;

  if (!authToken) {
    throw new Error('Authentication required. Connect as user or agent first.');
  }

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
}
