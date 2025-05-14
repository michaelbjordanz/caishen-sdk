import { toolBase } from '../ToolBase';

export interface Tools {
  cash_get_balance: ReturnType<typeof toolBase>;
  cash_deposit: ReturnType<typeof toolBase>;
  cash_send: ReturnType<typeof toolBase>;
  cash_withdraw: ReturnType<typeof toolBase>;
  crypto_get_balance: ReturnType<typeof toolBase>;
  send_crypto: ReturnType<typeof toolBase>;
  sign_and_send: ReturnType<typeof toolBase>;
  swap_crypto: ReturnType<typeof toolBase>;
  crypto_get_swap_route: ReturnType<typeof toolBase>;
}