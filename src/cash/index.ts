import { ApiClient } from "../api";
import {
  BalanceResponse,
  DepositCashParams,
  SendTransactionParams,
  Token,
  TransactionResponse,
  WithdrawCashParams,
} from "./schema";

export async function send(
  params: SendTransactionParams
): Promise<TransactionResponse> {
  const response = await ApiClient.post("/cash/send", params);
  return response.data;
}

export async function deposit(
  params: DepositCashParams
): Promise<TransactionResponse> {
  const response = await ApiClient.post("/cash/deposit", params);
  return response.data;
}

export async function withdraw(
  params: WithdrawCashParams
): Promise<TransactionResponse> {
  const response = await ApiClient.post("/cash/withdraw", params);
  return response.data;
}

export async function getBalance({
  account,
}: {
  account: number;
}): Promise<BalanceResponse> {
  const response = await ApiClient.get("/cash/balance", {
    params: {
      account,
    },
  });
  return response.data;
}

export async function getSupportedTokens(): Promise<Token[]> {
  const response = await ApiClient.get("/cash/tokens");
  return response.data;
}
