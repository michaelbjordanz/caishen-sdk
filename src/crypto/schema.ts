import { z } from 'zod';

export const CryptoSendSchema = z.object({
  address: z.string().describe('The wallet address to send from'),
  chainType: z.string().describe('The blockchain type (e.g., "EVM", "SOLANA")'),
  chainId: z.number().optional().describe('The chain ID for the blockchain'),
  publicKey: z.string().optional().describe('The public key of the wallet'),
  account: z.number().optional().describe('The account number'),
  toAddress: z.string().describe('The recipient address to send to'),
  amount: z.string().describe('The amount to send'),
  token: z
    .string()
    .optional()
    .describe('Token address or symbol (send gas token if not specified)'),
  memo: z.string().optional().describe('Transaction memo (for Solana, etc.)'),
});

export const CryptoGetBalanceSchema = z.object({
  address: z.string().describe('The wallet address to check balance for'),
  chainType: z.string().describe('The blockchain type (e.g., "EVM", "SOLANA")'),
  chainId: z.number().optional().describe('The chain ID for the blockchain'),
  publicKey: z.string().optional().describe('The public key of the wallet'),
  account: z.number().optional().describe('The account number'),
  token: z
    .string()
    .optional()
    .describe(
      'Token address or symbol to check balance for (default is native token like ETH, SOL)',
    ),
});

export const CryptoSwapSchema = z.object({
  address: z.string().describe('The wallet address to perform the swap from'),
  chainType: z.string().describe('The blockchain type (e.g., "EVM", "SOLANA")'),
  confirmationCode: z.string().describe('The swap route confirmation code'),
});

export const CryptoGetSwapRouteSchema = z.object({
  account: z.number().describe('The account number'),
  amount: z.string().describe('The amount to swap (in token units)'),
  fromAddress: z.string().describe('The source token address'),
  fromChainType: z
    .string()
    .describe('The source blockchain type (e.g., "EVM", "SOLANA")'),
  fromChainId: z.number().optional().describe('The source chain ID'),
  toAddress: z.string().describe('The destination token address'),
  toChainType: z.string().describe('The destination blockchain type'),
  toChainId: z.number().optional().describe('The destination chain ID'),
});

export type CryptoSendParams = z.infer<typeof CryptoSendSchema>;
export type CryptoGetBalanceParams = z.infer<typeof CryptoGetBalanceSchema>;
export type CryptoSwapParams = z.infer<typeof CryptoSwapSchema>;
export type CryptoGetSwapRouteParams = z.infer<typeof CryptoGetSwapRouteSchema>;
