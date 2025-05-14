import { BASE_URL } from '../constants';
import ChainIds from '../constants/chain-ids';
import PublicRpcEndpoints from '../constants/public-rpc-endpoints';
import axios from 'axios';

import type { CaishenSDK } from '../caishen';
import { WalletAccount, WalletInfo } from '../types';

export async function getWallet(
  this: CaishenSDK,
  walletAccount: Pick<WalletAccount, 'chainId' | 'chainType'> & {
    account: number | number[];
    authToken?: string;
  },
): Promise<WalletInfo | WalletInfo[]> {
  const {
    chainType,
    chainId,
    account,
    authToken = this.agentToken || this.userToken
  } = walletAccount

  if (!chainType || account === undefined) {
    throw new Error('chainType and account number are required');
  }

  if (!authToken) {
    throw new Error('Authentication token required. Connect as user/agent first or pass authorization token separately.');
  }

  const response = await axios.get(`${BASE_URL}/api/crypto/wallets`, {
    params: { chainType, account, chainId },
    headers: { Authorization: `Bearer ${authToken}` },
  });

  return response.data;
}

export async function getSupportedChainTypes(
  this: CaishenSDK,
  authToken?: string
): Promise<string[]> {
  const _authToken = authToken || this.agentToken || this.userToken;

  if (!_authToken) {
    throw new Error('Authentication token required. Connect as user/agent first or pass authorization token separately.');
  }

  const response = await axios.get(
    `${BASE_URL}/api/crypto/wallets/supported`,
    {
      headers: { Authorization: `Bearer ${_authToken}` },
    },
  );

  return response.data;
}

export async function getRPC(chainId: ChainIds) {
  if (!PublicRpcEndpoints[chainId]) {
    throw new Error(`RPC for ${chainId} not supported`);
  }

  return PublicRpcEndpoints[chainId];
}
