import { Tool } from "langchain/tools";
import { BalanceOption } from "../../constants";
import { CaishenSDK } from '../../caishen';

export class CaishenBalanceOtherTool extends Tool {
  name = "caishen_balance_other";
  description = `Get the balance of ANOTHER wallet (not your own) or token account on Caishen.`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      // Prepare balance options
      const balanceOptions: BalanceOption = {
        account: parsedInput.account,
        chainType: parsedInput.chainType,
        chainId: parsedInput.chainId,
        walletAddress: parsedInput.walletAddress,
        tokenAddress: parsedInput.tokenAddress,
      };

      const balance = await this.sdk.getBalanceOther(balanceOptions);

      return JSON.stringify({
        status: "success",
        balance,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}
