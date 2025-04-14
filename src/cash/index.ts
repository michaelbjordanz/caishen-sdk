import { ApiClient } from '../api';
import {
  BalanceResponse,
  DepositCashParams,
  SendTransactionParams,
  Token,
  TransactionResponse,
  WithdrawCashParams,
} from './schema';

import type { CaishenSDK } from '../caishen';

export async function send(
  this: CaishenSDK,
  params: SendTransactionParams,
): Promise<TransactionResponse> {
  const authToken = this.userToken || this.agentToken;
  const response = await ApiClient.post('/cash/send', params, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return response.data;
}

export async function deposit(
  this: CaishenSDK,
  params: DepositCashParams,
): Promise<TransactionResponse> {
  const authToken = this.userToken || this.agentToken;
  const response = await ApiClient.post('/cash/deposit', params, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return response.data;
}

export async function withdraw(
  this: CaishenSDK,
  params: WithdrawCashParams,
): Promise<TransactionResponse> {
  const authToken = this.userToken || this.agentToken;
  const response = await ApiClient.post('/cash/withdraw', params, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return response.data;
}

export async function getBalance(
  this: CaishenSDK,
  {
    account,
  }: {
    account: number;
  },
): Promise<BalanceResponse> {
  const authToken = this.userToken || this.agentToken;
  const response = await ApiClient.get('/cash/balance', {
    params: {
      account,
    },
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return response.data;
}

export async function getSupportedTokens(this: CaishenSDK): Promise<Token[]> {
  const authToken = this.userToken || this.agentToken;
  const response = await ApiClient.get('/cash/tokens', {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return response.data;
}
