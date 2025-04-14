import { ApiClient } from '../api';
import {
  BalanceResponse,
  DepositCashParams,
  SendTransactionParams,
  Token,
  TransactionResponse,
  WithdrawCashParams,
} from './schema';

export async function send(
  this: any,
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
  this: any,
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
  this: any,
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
  this: any,
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

export async function getSupportedTokens(this: any): Promise<Token[]> {
  const authToken = this.userToken || this.agentToken;
  const response = await ApiClient.get('/cash/tokens', {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return response.data;
}
