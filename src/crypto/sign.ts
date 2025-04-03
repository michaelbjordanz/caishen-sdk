import axios from 'axios';
import { BASE_URL, IWalletAccount } from '../constants';

/*
  if payload?.token is undefined or null, send gas token.
  Otherise - send tokens
*/
export async function signAndSend(this: any, {
  wallet,
  payload
}: {
  wallet: IWalletAccount,
  payload: { token?: string, amount: string; toAddress: string; }
}) {
  if (!this.userToken && !this.agentToken) {
    throw new Error('Authentication required. Connect as user or agent first.');
  }

  try {
    const authToken = this.userToken || this.agentToken;
    const url = `${BASE_URL}/api/crypto/send`;
    const response = await axios.post(
      url,
      {
        wallet,
        payload
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to send transaction: ${error.response?.data?.message || error.message}`);
  }
}
