import { z } from 'zod';

export const CashGetBalanceSchema = z.object({
  account: z.number().describe('The account number to fetch the balance for'),
});

export const SendTransactionSchema = z.object({
  toAddress: z
    .string()
    .describe('The recipient account or destination address'),
  amount: z.string().describe('The amount to send'),
  account: z.number().describe('The account number to send from'),
});

export const DepositCashSchema = z.object({
  amount: z.string().describe('The amount to deposit'),
  account: z.number().describe('The account number to deposit to'),
  tokenAddress: z.string().describe('The token address to deposit'),
  chainId: z.number().describe('The chain ID where the token is located'),
});

export const WithdrawCashSchema = z.object({
  amount: z.string().describe('The amount to withdraw'),
  account: z.number().describe('The account number to withdraw from'),
  tokenAddress: z.string().describe('The token address to withdraw'),
  chainId: z
    .number()
    .describe('The chain ID where the token should be withdrawn to'),
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
