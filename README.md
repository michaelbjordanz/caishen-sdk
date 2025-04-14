
# Caishen SDK

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/caishen-sdk.svg)](https://badge.fury.io/js/caishen-sdk)

> The Caishen SDK provides developers with seamless access to unlimited multi-chain crypto wallets. It offers a unified interface for interacting with various blockchain networks and managing crypto assets.

---

## ✨ Features

- 🔗 Multi-chain wallet support
- 🌐 Supports major blockchains:
  - Ethereum (via `ethers.js`)
  - Bitcoin (via `bitcoinjs-lib`)
  - Solana (via `@solana/web3.js`)
  - Cardano (via `@emurgo/cardano-serialization-lib`)
  - Sui, NEAR, Ripple, Tron, TON, Aptos
- 🔒 Secure wallet management
- ⚙️ Type-safe TypeScript APIs
- 💸 Token operations: Send, Balance, Swap, Deposit, Withdraw

---

## 📦 Installation

```bash
npm install caishen-sdk
# or
yarn add caishen-sdk
# or
pnpm add caishen-sdk
```

> ⚠️ Requires Node.js ≥ 14.x and TypeScript ≥ 4.x

---

## 🚀 Quick Start

```ts
import { CaishenSDK, createAgentTools } from "caishen-sdk";

const sdk = new CaishenSDK("your-project-key");
const tools = createAgentTools(sdk);
```

---

## 🔑 Authentication

You can authenticate as either a **user** or an **agent**.

### Connect as User

```ts
await sdk.connectAsUser({
  token: 'USER TOKEN',
  provider: 'USER PROVIDER',
});
```

#### ✅ Supported Providers

- `google`
- `facebook`
- `twitter`
- `discord`
- `github`
- `linkedin`
- `reddit`
- `line`
- `kakao`
- `weibo`
- `farcaster`
- `custom`

### Connect as Agent

```ts
await sdk.connectAsAgent({
  agentId: 'AGENT ID',
});
```

---

## 👛 Wallets

### 🔍 Get Wallet Info
Fetch a wallet associated with a user or agent for a specific chain.
> ⚠️ Note: The privateKey will only be returned if the developer dashboard has explicitly allowed access. With it, you can construct your own signer. If not enabled, the SDK will only return the public data needed to interact via Caishen.
#### 📥 Parameters

| Name        | Type     | Required | Description |
|-------------|----------|----------|-------------|
| `chainType` | string   | ✅        | Blockchain type (`ETHEREUM`, `SOLANA`, etc.) |
| `chainId`   | number   | ❌        | Optional chain ID (e.g., 1 for Ethereum) |
| `account`   | number   | ✅        | Account index or identifier |

#### 📘 Example
```ts
const wallet = await sdk.crypto.getWallet({
  chainType: 'ETHEREUM',
  chainId: 1,
  account: 0,
});
```
#### 📚 Type: `IWalletAccount`
```ts
interface IWalletAccount {
  address: string;
  chainType: string;
  publicKey: string;
  privateKey?: string; // Only returned if access is enabled in the dashboard
  account: number;
}
```
> ⚠️ Private key is optional and only available if explicitly enabled in the dashboard.
### MinimalWalletInput

```ts
interface MinimalWalletInput {
  account: number;
  chainType: string;
  address: string;
}
```

Used for all `cash` and `swap` functions to avoid sending sensitive data.


### 🌐 Supported Chains
Returns the list of all chain types supported by the backend for wallet creation.

#### 📦 Returns

```ts
string[] // e.g., ['evm', 'solana']
```

#### 📘 Example
```ts
const chains = await sdk.crypto.getSupportedChainTypes();
```

### 🔗 Get EVM RPC URL
Returns the public RPC endpoint URL for a given EVM-compatible chain ID.

### 📥 Parameters

| Name       | Type     | Required | Description |
|------------|----------|----------|-------------|
| `chainId`  | ChainIds | ✅        | Chain ID enum value |

### 📦 Returns

```ts
const rpcUrl = await sdk.crypto.getRPC(1); // Ethereum Mainnet
```

---

## 💸 Token Operations

### ➕ Send Token
Send a token or native coin (like ETH, MATIC, SOL) to another address.

#### 📥 Parameters

| Name      | Type                        | Required | Description |
|-----------|-----------------------------|----------|-------------|
| `wallet`  | `IWalletAccount`            | ✅        | Wallet object returned from `getWallet()` |
| `payload` | `{ token?: string; amount: string; toAddress: string; memo?: number }` | ✅ | Transfer details |
> 🚫 Do not pass the full `IWalletAccount` into this function — only `MinimalWalletInput` is required and safer.
- If `payload.token` is **undefined**, the function sends the **native gas token** (e.g. ETH, MATIC).
- If `payload.token` is provided, it sends that **ERC20 or token** instead.

#### 📦 Returns

```ts
string // Transaction hash
```

#### 📘 Example
```ts
const txHash = await sdk.crypto.send({
  wallet,
  payload: {
    token: '0xTokenAddress...', // omit for native
    amount: '0.5',
    toAddress: '0xRecipient...',
  },
});
```

### 📊 Get Balance
Fetch the balance of a wallet for either the **native coin** or a specific **token**.

#### 📥 Parameters

| Name      | Type                         | Required | Description |
|-----------|------------------------------|----------|-------------|
| `wallet`  | `IWalletAccount`             | ✅        | Wallet object |
| `payload` | `{ token?: string }`         | ❌        | If `token` is provided, fetch its balance; otherwise fetch native balance |
> 🚫 Do not pass the full `IWalletAccount` into this function — only `MinimalWalletInput` is required and safer.
#### 📦 Returns

```ts
string // Balance (in decimal format)
```

#### Native Balance

```ts
const native = await sdk.crypto.getBalance({ wallet, payload: {} });
```

#### Token Balance

```ts
const dai = await sdk.crypto.getBalance({
  wallet,
  payload: { token: '0x6B1754...' },
});
```

---

## 🔁 Token Swap

### 🔍 Get Swap Route
Fetch a possible token swap route across chains.

#### 📥 Parameters

| Field       | Type   | Description |
|-------------|--------|-------------|
| `wallet`    | `Pick<IWalletAccount, 'account'>` | Wallet account info |
| `payload`   | `object` | Swap details including amount, from/to tokens |
> 🚫 Do not pass the full `IWalletAccount` into this function — only `MinimalWalletInput` is required and safer.

#### `payload` structure:

```ts
{
  amount: string; // in smallest unit (e.g. wei)
  from: {
    tokenAddress: string;
    chainType: ChainType;
    chainId?: number;
  };
  to: {
    tokenAddress: string;
    chainType: ChainType;
    chainId?: number;
  };
}
```

#### 📦 Returns

```ts
interface RouteOutput {
  id: string;
  fromChainId: number;
  fromAmountUSD: string;
  fromAmount: string;
  fromToken: TokenWithPrice;
  fromAddress?: string;
  toChainId: number;
  toAmountUSD: string;
  toAmount: string;
  toAmountMin: string;
  toToken: TokenWithPrice;
  toAddress?: string;
  confirmationCode: string;
}
```

#### 📘 Example

```ts
const route = await sdk.crypto.getSwapRoute({
  wallet: { account: 0 },
  payload: {
    amount: '1000000000000000000',
    from: { tokenAddress: '0x...', chainType: 'ETHEREUM' },
    to: { tokenAddress: '0x...', chainType: 'ETHEREUM' },
  },
});
```

### 🔄 Execute Swap
Execute the swap route using a confirmation code.

#### 📥 Parameters

| Field       | Type   | Description |
|-------------|--------|-------------|
| `wallet`    | `Pick<IWalletAccount, 'account', 'chainType'>` | Wallet info |
| `payload`   | `object` | Swap payload including `confirmationCode` |
> 🚫 Do not pass the full `IWalletAccount` into this function — only `MinimalWalletInput` is required and safer.

#### `payload` structure:

```ts
{
  confirmationCode: string; // from getSwapRoute()
}
```

#### 📦 Returns

```ts
interface RouteExecutedResponse {
  transactionStatus: string;
  transactionHash: string | null;
  fees: string | null;
  error: string | null;
}
```

#### 📘 Example
```ts
const result = await sdk.crypto.swap({
  wallet: { account: 0, chainType: 'ETHEREUM' },
  payload: { confirmationCode: 'abc123' },
});
```

---

## 🏦 Cash Accounts

### 💰 Get Account Balance
Get current balance of all tokens for a specific account.

#### Parameters

| Name     | Type   | Description              |
|----------|--------|--------------------------|
| account  | number | The account identifier   |

#### Returns

```ts
Promise<BalanceResponse>
```

#### 📘 Example

```ts
const balance = await sdk.cash.getBalance({ account: 1 });
```

### 💵 Deposit
Deposit a supported token into the account.

#### Parameters

| Name     | Type                | Description            |
|----------|---------------------|------------------------|
| params   | `DepositCashParams` | Token and amount info  |

#### Returns

```ts
Promise<TransactionResponse>
```

#### 📘 Example

```ts
await sdk.cash.deposit({
  account: 1,
  tokenAddress: '0x...',
  amount: '1000000000000000000',
});
```

### 💸 Withdraw
Withdraw a supported token from the account.

#### Parameters

| Name     | Type                 | Description           |
|----------|----------------------|-----------------------|
| params   | `WithdrawCashParams` | Token and amount info |

#### Returns

```ts
Promise<TransactionResponse>
```

#### 📘 Example

```ts
await sdk.cash.withdraw({
  account: 1,
  tokenAddress: '0x...',
  amount: '1000000000000000000',
});
```

### 🔁 Send

Send supported tokens between accounts.

#### Parameters

| Name     | Type                   | Description           |
|----------|------------------------|-----------------------|
| params   | `SendTransactionParams`| Token, to/from, etc.  |

#### Returns

```ts
Promise<TransactionResponse>
```

#### 📘 Example

```ts
await sdk.cash.send({
  fromAccount: 1,
  toAccount: 2,
  tokenAddress: '0x...',
  amount: '1000000000000000000',
});
```

### 🪙 Get Supported Tokens

```ts
const tokens = await sdk.cash.getSupportedTokens();
```

---

## 🛠 Types

### `TokenWithPrice`

```ts
type TokenWithPrice = Token & {
  priceUSD: string;
};
```

---

## 🧱 Build from Source

```bash
# Clone & install
npm install

# Build SDK
npm run build

# Dev mode
npm run dev
```

---

## 🤝 Contributing

Contributions welcome! Open an issue or submit a pull request.

---

## 📜 License

MIT © [CaishenXYZ](https://github.com/CaishenXYZ)

---

## 💬 Support

Please open an issue in the GitHub repository for help or contact the maintainers.

---

Made with ❤️ by **Caishen**
