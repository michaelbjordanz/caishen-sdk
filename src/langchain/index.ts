
export * from "./crypto";

import type { CaishenSDK } from "../caishen";
import {
  CaishenBalanceTool,
  CaishenBalanceOtherTool,
  CaishenTransferTool
} from "./index";

export function createAgentTools(sdk: CaishenSDK) {
  return [
    new CaishenBalanceTool(sdk),
    new CaishenBalanceOtherTool(sdk),
    new CaishenTransferTool(sdk)
  ];
}
