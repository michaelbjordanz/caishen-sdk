export * from './cash';
export * from './crypto';

import type { CaishenSDK } from '../../caishen';
import {
  CaishenCryptoGetBalanceTool,
  CaishenCryptoGetRPCTool,
  CaishenCryptoGetSupportedChainTypesTool,
  CaishenCryptoGetSwapRouteTool,
  CaishenCryptoSendTool,
  CaishenBalanceOtherTool,
  CaishenCryptoSwapTool,
  CaishenCashDepositTool,
  CaishenCashGetBalanceTool,
  CaishenCashGetSupportedTokensTool,
  CaishenCashSendTool,
  CaishenCashWithdrawTool
} from './index';

export function createAgentTools(sdk: CaishenSDK) {
  return [
    new CaishenCryptoGetBalanceTool(sdk),
    new CaishenCryptoGetRPCTool(sdk),
    new CaishenCryptoGetSupportedChainTypesTool(sdk),
    new CaishenCryptoGetSwapRouteTool(sdk),
    new CaishenCryptoSendTool(sdk),
    new CaishenBalanceOtherTool(sdk),
    new CaishenCryptoSwapTool(sdk),
    new CaishenCashDepositTool(sdk),
    new CaishenCashGetBalanceTool(sdk),
    new CaishenCashGetSupportedTokensTool(sdk),
    new CaishenCashSendTool(sdk),
    new CaishenCashWithdrawTool(sdk),
  ];
}
