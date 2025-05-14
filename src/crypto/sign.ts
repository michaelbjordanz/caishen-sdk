import axios from 'axios';

import { BASE_URL } from '../constants';
import type { CaishenSDK } from '../caishen';
import { BaseRequest, SignAndSendPayload, WalletAccount } from '../types';

/**
 * Signs prepared transaction and broadcasts it to a network.
 * @param request
 */
export async function signAndSend(
  this: CaishenSDK,
  request: BaseRequest<WalletAccount, SignAndSendPayload>,
): Promise<string> {
  const {
    wallet,
    payload,
    authToken = this.userToken || this.agentToken,
  } = request;

  if (!authToken) {
    throw new Error('Authentication token required. Connect as user/agent first or pass authorization token separately.');
  }

  const url = `${BASE_URL}/api/crypto/signAndSend`;
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
