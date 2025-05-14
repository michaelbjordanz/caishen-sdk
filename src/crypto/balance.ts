import axios from 'axios';

import type { CaishenSDK } from '../caishen';
import { BaseRequest, WalletAccount, GetBalancePayload } from '../types';
import { BASE_URL } from '../constants';

/**
 * Gets token balance.
 * @param request
 */
export async function getBalance(
  this: CaishenSDK,
  request: BaseRequest<
    WalletAccount,
    GetBalancePayload | undefined
  >,
): Promise<bigint> {
  const {
    wallet,
    payload = {},
    authToken = this.userToken || this.agentToken,
  } = request;

  if (!authToken) {
    throw new Error('Authentication token required. Connect as user/agent first or pass authorization token separately.');
  }

  const url = `${BASE_URL}/api/crypto/balance`;
  const response = await axios.get(url, {
    params: {
      ...wallet,
      tokenAddress: payload.token,
    },
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return BigInt(response.data);
}
