import axios from 'axios';
import { BASE_URL } from '../constants';

export async function send(this: any, {
  wallet,
  payload
}: {
  wallet: { chainType: string; account: number; rpc?: string; },
  payload: { token?: string, amount: string; toAddress: string; }
}) {
  if (!this.userToken && !this.agentToken) {
    throw new Error('Authentication required. Connect as user or agent first.');
  }

  try {
    const authToken = this.userToken || this.agentToken;
    const response = await axios.post(
      `${BASE_URL}/api/crypto/send`,
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