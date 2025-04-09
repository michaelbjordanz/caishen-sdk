import { BASE_URL, SUPPORTED_CHAINS } from "../constants";
import ChainIds from "../constants/chain-ids";
import PublicRpcEndpoints from "../constants/public-rpc-endpoints";
import axios from 'axios';

export async function getWallet(this: any, {
  chainType,
  account,
}: {
  chainType: string;
  account: number;
}): Promise<any> {
  if (!chainType || account === undefined) {
    throw new Error("chainType and account number are required");
  }
  const authToken = this.agentToken || this.userToken;
  if (!authToken) {
    throw new Error(
      "Authenticate as an agent or user before fetching wallets"
    );
  }
  try {
    const response = await axios.get(`${BASE_URL}/api/wallets`, {
      params: { chainType, account },
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Failed to get wallet: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function getSupportedChainTypes(this: any) {
  try {
    const authToken = this.agentToken || this.userToken;
    if (!authToken) {
      throw new Error(
        "Authenticate as an agent or user before fetching wallets"
      );
    }
    const response = await axios.get(`${BASE_URL}/api/wallets/supported`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (err) {
    throw new Error("Failed to get supported chain types");
  }
}

export async function getRPC(chainId: ChainIds) {
  if (!PublicRpcEndpoints[chainId]) {
    throw new Error(`RPC for ${chainId} not supported`);
  }
  return PublicRpcEndpoints[chainId];
}