import { z } from 'zod';

export const CashGetBalanceSchema = z.object({
  account: z.number(),
});

export const SendTransactionSchema = z.object({
  toAddress: z.string(),
  amount: z.string(),
  account: z.number(),
});

export const DepositCashSchema = z.object({
  amount: z.string(),
  account: z.number(),
  tokenAddress: z.string(),
  chainId: z.number(),
});

export const WithdrawCashSchema = z.object({
  amount: z.string(),
  account: z.number(),
  tokenAddress: z.string(),
  chainId: z.number(),
});

export const TokenSchema = z.object({
  address: z.string(),
  chainId: z.number(),
  decimals: z.number(),
  name: z.string(),
  symbol: z.string(),
});

export const BalanceResponseSchema = z.object({
  success: z.boolean(),
  balance: z.string(),
  balanceRaw: z.string(),
});

export const TransactionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  txHash: z.string().optional(),
  isSuccess: z.boolean().optional(),
});

export type CashGetBalanceParams = z.infer<typeof CashGetBalanceSchema>;
export type SendTransactionParams = z.infer<typeof SendTransactionSchema>;
export type DepositCashParams = z.infer<typeof DepositCashSchema>;
export type WithdrawCashParams = z.infer<typeof WithdrawCashSchema>;
export type Token = z.infer<typeof TokenSchema>;
export type BalanceResponse = z.infer<typeof BalanceResponseSchema>;
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;
