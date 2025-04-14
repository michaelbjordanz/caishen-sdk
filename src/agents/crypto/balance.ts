import { Tool } from 'langchain/tools';
import { CaishenSDK } from '../../caishen';

export class CaishenBalanceTool extends Tool {
  name = 'crypto_balance_other';
  description = `Get the balance of ANOTHER wallet (not your own) or token account on Caishen.`;

  constructor(private sdk: CaishenSDK) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      const balance = await this.sdk.crypto.getBalance({
        wallet: {
          chainType: parsedInput.chainType,
          account: parsedInput.account,
          chainId: parsedInput.chainId,
        },
        payload: { token: parsedInput.tokenAddress },
      });

      return JSON.stringify({
        status: 'success',
        balance,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: 'error',
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
      });
    }
  }
}
