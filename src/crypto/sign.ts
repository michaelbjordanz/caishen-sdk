import axios from 'axios';

import { BASE_URL, IWalletAccount } from '../constants';
import type { CaishenSDK } from '../caishen';

/*
  if payload?.token is undefined or null, send gas token.
  Otherwise - send tokens
*/
export async function signAndSend(
  this: CaishenSDK,
  {
    wallet,
    payload,
  }: {
    wallet: IWalletAccount;
    payload: {
      /**
       * Serialized transaction (e.g. with [serializeTransaction]{@link https://viem.sh/docs/utilities/serializeTransaction.html}) - Hex
       */
      serializedTransaction: string;
    };
  },
): Promise<string> {
  if (!this.userToken && !this.agentToken) {
    throw new Error('Authentication required. Connect as user or agent first.');
  }

  try {
    const authToken = this.userToken || this.agentToken;
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
  } catch (error: any) {
    throw new Error(
      `Failed to sign and send transaction: ${error.response?.data?.message || error.message}`,
    );
  }
}
