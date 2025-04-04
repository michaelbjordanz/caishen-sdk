import { Tool } from "langchain/tools";
import { CaishenSDK } from '../../caishen';

export class CaishenTransferTool extends Tool {
    name = "crypto_transfer";
    description = `Transfer tokens to another address ( also called as wallet address )`;
  
    constructor(private sdk: CaishenSDK) {
      super();
    }
  
    protected async _call(input: string): Promise<string> {
      try {
        const parsedInput = JSON.parse(input);
  
        const tx = await this.sdk.crypto.send({
          wallet: {
            account: parsedInput.account,
            chainType: parsedInput.chainType,
            rpc: parsedInput.rpc,
          },
          payload: {
            token: parsedInput.token,
            amount: parsedInput.amount,
            toAddress: parsedInput.toAddress
          }
        });

        return JSON.stringify({
          status: "success",
          message: "Transfer completed successfully",
          amount: parsedInput.amount,
          recipient: parsedInput.toAddress,
          transaction: tx,
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