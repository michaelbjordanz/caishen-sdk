import { z } from 'zod';

export const CryptoSendSchema = z.object({
  address: z.string(),
  chainType: z.string(),
  chainId: z.number().optional(),
  publicKey: z.string().optional(),
  account: z.number().optional(),
  toAddress: z.string(),
  amount: z.string(),
  token: z.string().optional(),
  memo: z.string().optional(),
});

export const CryptoGetBalanceSchema = z.object({
  address: z.string(),
  chainType: z.string(),
  chainId: z.number().optional(),
  publicKey: z.string().optional(),
  account: z.number().optional(),
  token: z.string().optional(),
});

export const CryptoSwapSchema = z.object({
  address: z.string(),
  chainType: z.string(),
  confirmationCode: z.string(),
});

export const CryptoGetSwapRouteSchema = z.object({
  account: z.number(),
  amount: z.string(),
  fromAddress: z.string(),
  fromChainType: z.string(),
  fromChainId: z.number().optional(),
  toAddress: z.string(),
  toChainType: z.string(),
  toChainId: z.number().optional(),
});

export type CryptoSendParams = z.infer<typeof CryptoSendSchema>;
export type CryptoGetBalanceParams = z.infer<typeof CryptoGetBalanceSchema>;
export type CryptoSwapParams = z.infer<typeof CryptoSwapSchema>;
export type CryptoGetSwapRouteParams = z.infer<typeof CryptoGetSwapRouteSchema>;
