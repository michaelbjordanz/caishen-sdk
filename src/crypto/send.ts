import axios from 'axios';

import { BASE_URL } from '../constants';
import type { CaishenSDK } from '../caishen';
import { BaseRequest, SendTransactionPayload, WalletAccount } from '../types';

/**
 * Execute basic token transfer.
 * @param request
 */
export async function send(
  this: CaishenSDK,
  request: BaseRequest<WalletAccount, SendTransactionPayload>
): Promise<string> {
  const {
    wallet,
    payload,
    authToken = this.userToken || this.agentToken,
  } = request;

  if (!authToken) {
    throw new Error('Authentication token required. Connect as user/agent first or pass authorization token separately.');
  }

  const url = `${BASE_URL}/api/crypto/send`;
  const response = await axios.post(
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

  return response.data;
}

