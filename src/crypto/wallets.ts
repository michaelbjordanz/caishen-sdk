import { BASE_URL } from '../constants';
import ChainIds from '../constants/chain-ids';
import PublicRpcEndpoints from '../constants/public-rpc-endpoints';
import axios from 'axios';

import type { CaishenSDK } from '../caishen';

export async function getWallet(
  this: CaishenSDK,
  {
    chainType,
    chainId,
    account,
  }: {
    chainType: string;
    chainId?: number;
    account: number;
  },
): Promise<{
  account: number;
  address: string;
  chainType: string;
  publicKey: string;
  privateKey?: string;
}> {
  if (!chainType || account === undefined) {
    throw new Error('chainType and account number are required');
  }
  const authToken = this.agentToken || this.userToken;
  if (!authToken) {
    throw new Error('Authenticate as an agent or user before fetching wallets');
  }
  try {
    const response = await axios.get(`${BASE_URL}/api/crypto/wallets`, {
      params: { chainType, account, chainId },
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Failed to get wallet: ${error.response?.data?.message || error.message}`,
    );
  }
}

export async function getSupportedChainTypes(
  this: CaishenSDK,
): Promise<string[]> {
  try {
    const authToken = this.agentToken || this.userToken;
    if (!authToken) {
      throw new Error(
        'Authenticate as an agent or user before fetching wallets',
      );
    }
    const response = await axios.get(
      `${BASE_URL}/api/crypto/wallets/supported`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );
    return response.data;
  } catch (err) {
    throw new Error('Failed to get supported chain types');
  }
}

export async function getRPC(chainId: ChainIds) {
  if (!PublicRpcEndpoints[chainId]) {
    throw new Error(`RPC for ${chainId} not supported`);
  }
  return PublicRpcEndpoints[chainId];
}
