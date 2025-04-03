import { CaishenSDK } from '../caishen'
import axios from "axios";
import { 
  BASE_URL,
  BalanceOption,
  TransferOption
 } from "../constants";


export async function get_balance(
  authorize_token: any, 
  info: BalanceOption,
  ): Promise<any> 
{
  try {
    const response = await axios.get<{ agentToken: string }>(
      `${BASE_URL}/api/crypto/balance`,
      { 
        params: {
          account: info.account,
          chainType: info.chainType,
          chainId: info.chainId,
          tokenAddress: info.tokenAddress,
        },
        headers: { Authorization: `Bearer ${authorize_token}` } 
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
        `Agent authentication failed: ${
        error.response?.data?.message || error.message
        }`
    );
  }
}

export async function get_balance_other(
  authorize_token: any, 
  info: BalanceOption,
  ): Promise<any> 
{
  try {
    const response = await axios.get<{ agentToken: string }>(
      `${BASE_URL}/api/crypto/balance_other`,
      { 
        params: {
          account: info.account,
          chainType: info.chainType,
          chainId: info.chainId,
          walletAddrss: info.walletAddress,
          tokenAddress: info.tokenAddress,
        },
        headers: { Authorization: `Bearer ${authorize_token}` } 
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
        `Agent authentication failed: ${
        error.response?.data?.message || error.message
        }`
    );
  }
}

export async function transfer(
    authorize_token: any,
    info: TransferOption,
  ): Promise<string> {
    try {
      const response = await axios.post<{ transaction: string }>(
        `${BASE_URL}/api/crypto/balance_other`,
        {
          wallet: {
            account: info.account,
            chainType: info.chainType,
            rpc: info.rpc,
          },
          payload: {
            token: info.token,
            amount: info.amount,
            toAddress: info.toAddress,
          }
        },
        { 
          headers: { Authorization: `Bearer ${authorize_token}` } 
        }
      );
      return response.data.transaction;
    } catch (error: any) {
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }
  