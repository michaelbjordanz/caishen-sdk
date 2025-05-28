import { ApiClient } from '../api';
import {
  BalanceResponse, CashGetBalanceParams,
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
  const authToken = params.authToken || this.userToken || this.agentToken;
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
  const authToken = params.authToken || this.userToken || this.agentToken;
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
  const authToken = params.authToken || this.userToken || this.agentToken;
  const response = await ApiClient.post('/cash/withdraw', params, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return response.data;
}

export async function getBalance(
  this: CaishenSDK,
  params: CashGetBalanceParams,
): Promise<BalanceResponse> {
  const authToken = params.authToken || this.userToken || this.agentToken;
  const response = await ApiClient.get('/cash/balance', {
    params,
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
