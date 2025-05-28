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
- Cash operations: Send, Deposit, Withdraw

---

## 📦 Installation

```bash
npm install @caishen/sdk
# or
yarn add @caishen/sdk
# or
pnpm add @caishen/sdk
```

> ⚠️ Requires Node.js ≥ 14.x and TypeScript ≥ 4.x

---

## 🔗 Links

- 🌐 [Website](https://caishen.tech)
- 🛠️ [Developer Dashboard](https://dashboard.caishen.tech)
- 📚 [Docs](https://docs.caishen.tech)

---

## 🚀 Quick Start

```ts
import { CaishenSDK, createAgentTools } from "@caishen/sdk";

const sdk = new CaishenSDK({ projectKey: "your-project-key" });
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

- `google`, `facebook`, `twitter`, `discord`, `github`, `linkedin`
- `reddit`, `line`, `kakao`, `weibo`, `farcaster`, `custom`

---

### 🔐 Custom Authentication

If you want to authenticate users **from your own backend**, you can use the `custom` provider.

In this case:

- You must **encrypt a JWT** on your backend using your `projectSecret` (found in your Caishen developer dashboard).
- That encrypted token must contain an object like `{ id: string }`, where `id` is the user identifier in your system.
- You then pass this encrypted token into `connectAsUser`.

#### 💡 Example
**Backend-side (Node.js):**

```ts
import jwt from 'jsonwebtoken';

const payload = { id: 'user-123' };
const token = jwt.sign(payload, projectSecret);
```

**Frontend-side:**

```ts
await sdk.connectAsUser({
  provider: 'custom',
  token: 'ENCRYPTED_JWT_TOKEN',
});
```

On the Caishen backend, this token is decrypted with your `projectSecret` using:

```ts
jwt.verify(token, projectSecret); // -> { id: string }
```

> ⚠️ Never share your `projectSecret` publicly. Only your server should have access to it.

---


### Issue authorization token

Simple way to issue an authorization token for the Caishen API without storing it in the CaishenSDK instance.

As because you cannot call `connectAsUser` or `connectAsAgent` twice, this method provides you an ability to get authorization token (of a user or agent) based on your credentials.

Useful primarily for authorizing multiple users independently on your back-end side and managing it without.


##### Example:
```ts
const authToken = await sdk.issueAuthToken({
  connectAs: 'user',
  provider: 'custom',
  token: 'ENCRYPTED_JWT_TOKEN',
});

const balance = await sdk.crypto.getBalance({
  wallet: {
    account: 1,
    chainId: 1,
    chainType: 'ETHEREUM',
  },
  authToken,
});

console.log(`Balance ETH: ${balance}`)
```

Here is a basic real-world example of how you can use it:
```ts
// Create a global SDK instance with project key provided
const caishenSDK = new CaisenSDK({ projectKey });

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing JWT token');
    }

    try {
      // Verify main JWT token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // Extract and verify the encrypted Caishen auth token from payload
      const encryptedCaishenToken = payload.caishenAuthTokenEncrypted;

      let decryptedCaishenToken = await this.jwtService.verifyAsync(
        encryptedCaishenToken,
        {
          secret: jwtConstants.caishenSecret,
        },
      );

      // Optional: validate token expiration or structure
      
      if (!decryptedCaishenToken) {
        // Fallback: generate a new token via SDK if decryption fails
        decryptedCaishenToken = await caishenSDK.issueAuthToken({
          provider: 'custom',
          token: payload.userId, // Replace with actual user ID if available
          connectAs: 'user',
        });
      }

      // Attach the decrypted token to the request for later use
      request.caishenAuthTokenDecrypted = decryptedCaishenToken;

      return true;
    } catch (error) {
      console.error('AuthGuard error:', error);
      throw new UnauthorizedException('Invalid token or authorization failed');
    }
  }

  // Extracts JWT token from Authorization header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Controller('my-api')
export class MyApiController {
  constructor(private readonly caishenSDK: CaisenSDK) {}

  @UseGuards(AuthGuard)
  @Get('balance')
  async getMyBalance(@Request() req) {
    const caishenUserAuthToken = req.caishenAuthTokenDecrypted;
    const balance = await this.caishenSDK.crypto.getBalance({
      wallet: { account: 1, chainType: ChainType.SUI },
      authToken: caishenUserAuthToken,
    });

    return balance;
  }
}
```

### Connect as Agent

```ts
await sdk.connectAsAgent({
  agentId: 'AGENT ID',
  userId: 'USER ID', // NOTE: userId cannot be provided without an agentId
});
```

> Different values for `agentId` and `userId` will generate different wallet scopes.

---

## 👛 Wallets

### 🔍 Get Wallet Info

> ⚠️ The `privateKey` is only returned if `allowPrivateKeyAccess` is enabled in your developer dashboard.  
> You do **not** need to send the private key back to the server. All you need is `{ account, chainType }`.

#### 📥 Parameters

| Name        | Type     | Required | Description |
|-------------|----------|----------|-------------|
| `chainType` | string   | ✅        | Blockchain type (`ETHEREUM`, `SOLANA`, etc.) |
| `account`   | number   | ✅        | Account index or identifier |


#### ✅ Supported chainTypes

- `BITCOIN`, `LITECOIN`, `DASHCOIN`, `DOGECOIN`
- `ETHEREUM` (and other EVM-based, such as, `Arbitrum`, `Polygon`, `Optimism`, etc.)
- `SUI`, `SOLANA`,  `APTOS`, `TON`, `TRON`, `NEAR`, `XRP`, `CARDANO`, `COSMOS`

---

#### 📘 Example
```ts
const wallet = await sdk.crypto.getWallet({
  chainType: 'ETHEREUM',
  account: 1,
});
```

#### 📚 Type: `IWalletAccount`
```ts
interface IWalletAccount {
  address: string;
  chainType: string;
  account: number;
  publicKey: string;
  privateKey?: string; // Only returned if access is enabled in the dashboard
}
```

### MinimalWalletInput

```ts
interface MinimalWalletInput {
  account: number;
  chainType: string;
  address: string;
}
```

Used for all `cash` and `swap` functions to avoid sending sensitive data.

---

## 💸 Token Operations

> 🚫 Use `MinimalWalletInput` when possible to reduce sensitive data exposure.

### ➕ Send Token
```ts
const txHash = await sdk.crypto.send({
  wallet: {
    account: 1,
    chainType: "ETHEREUM",
    /**
     * If not provided, our Caishen's rpc will be used. 
     * NOTE: currently custom RPC feature is not supported for Bitcoin based blockchains 
     * (such as Bitcoin, Litecoin, Dogecoin, Dashcoin)
     * 
     * Specify ws rpc for Cardano & Ripple,  
     */
    rpc: 'your_rpc_url'
  },
  payload: {
    token: '0xTokenAddress...', // omit for native
    amount: '1000000000000000000', // amount in base units
    toAddress: '0xRecipient...',
  },
});
```

### 📊 Get Balance
```ts
const native = await sdk.crypto.getBalance({ wallet, payload: {} });
const dai = await sdk.crypto.getBalance({
  wallet,
  payload: { token: '0x6B1754...' },
});
```

### ✍️ Sign and Send transaction

```ts
import { serializeTransaction, parseGwei, parseEther } from 'viem'

const serializedTransaction = serializeTransaction({
  chainId: 1,
  gas: 21001n,
  maxFeePerGas: parseGwei('20'),
  maxPriorityFeePerGas: parseGwei('2'),
  nonce: 69,
  to: "0x1234512345123451234512345123451234512345",
  value: parseEther('0.01'),
})

const transactionHash = await sdk.crypto.signAndSend({
  wallet,
  payload: {
    serializedTransaction,
  }
});
```

### ✍️ Sign transaction

```ts
import { serializeTransaction, parseGwei, parseEther } from 'viem'

const serializedTransaction = serializeTransaction({
  chainId: 1,
  gas: 21001n,
  maxFeePerGas: parseGwei('20'),
  maxPriorityFeePerGas: parseGwei('2'),
  nonce: 69,
  to: "0x1234512345123451234512345123451234512345",
  value: parseEther('0.01'),
})

const transactionHash = await sdk.crypto.sign({ 
  wallet, 
  payload: {
    transactionData: serializedTransaction,
  }
});
```

---

## 🔁 Token Swap

> 🚫 Do not send the full wallet object. Use only `{ account, chainType }`.

### 🔍 Get Swap Route
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
```ts
const result = await sdk.crypto.swap({
  wallet: { account: 0, chainType: 'ETHEREUM' },
  payload: { confirmationCode: 'abc123' },
});
```

---

## 🏦 Cash Accounts

> **Cash** is a chain-abstracted, gasless stablecoin system designed to make stablecoin transfers seamless, fast, and free.

### 🔍 What is Cash?

**Cash** is an internal ERC-20-compatible asset that abstracts away the complexity of stablecoins across chains. It enables instant, gasless transfers between wallets without needing users to worry about:

- Native gas tokens (e.g., ETH, MATIC)
- Stablecoin formats (e.g., USDC vs USDT)
- Blockchain networks (e.g., Arbitrum, Base, Solana)

### 🧪 How It Works

- **Deposit**: Users deposit supported stablecoins (e.g., USDC, USDT) from chains like Arbitrum, Base, or Solana.
- **Issue**: The system issues equivalent **Cash** tokens 1:1, held in an abstracted balance.
- **Send**: These Cash tokens can be sent to any wallet address instantly with zero gas cost.
- **Withdraw**: When users withdraw, their Cash tokens are burned and they receive the original stablecoin on the selected chain.

> ⚠️ Different combinations of `agentId` and `userId` result in separate Cash balances.

### ✅ Benefits

- 💸 Gasless transfers (no ETH/SOL required)
- ⚡ Cross-chain abstraction
- 🔄 Simple send/receive interface
- 🔐 Fully backed, 1:1 redeemable

---

### 💱 Supported Stablecoins

| Chain     | Token | Symbol | Address |
|-----------|--------|--------|---------|
| Arbitrum  | USDC  | USDC   | `0xaf88...5831` |
| Arbitrum  | USDT  | USDT   | `0xFd08...cbb9` |
| Base      | USDC  | USDC   | `0x8335...2913` |
| Solana    | USDC  | USDC   | `EPjFWd...TDt1v` |

> See `CASH_SUPPORTED_TOKENS` for full details.

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

```ts
type TokenWithPrice = Token & {
  priceUSD: string;
};
```

---

# Vercel AI, Langchain, and ElevenLabs Integration

This project demonstrates the integration of three powerful AI tools: Vercel AI, Langchain, and ElevenLabs, to create intelligent and engaging applications. It showcases how these technologies can be combined to process natural language, orchestrate complex tasks, and generate realistic audio output.

## Overview

This project provides examples of how to:

- **Utilize Vercel AI:** Leverage Vercel AI's `generateText` function with custom tools to interact with external APIs or perform specific actions based on user input.
- **Employ Langchain:** Use Langchain's agent capabilities and its integration with large language models (LLMs) to create sophisticated workflows involving multiple steps and tool usage.
- **Integrate ElevenLabs:** Synthesize realistic speech from text using ElevenLabs' API, allowing for voice-based interactions and richer user experiences.

The code snippets provided in this README illustrate fetching data using tools defined for each service and then logging the results.

## Prerequisites

Before running this project, ensure you have the following:

- **Node.js and npm (or yarn) installed:** This project is likely built using JavaScript/TypeScript.
- **ElevenLabs API Key:** You'll need an API key from your ElevenLabs account to use their text-to-speech service. Set this as an environment variable (e.g., `ELEVENLABS_API_KEY`).
- **Vercel AI SDK Installed:** Ensure you have the `@vercel/ai` package installed in your project.
- **Langchain Installed:** Ensure you have the `langchain` and `@langchain/openai` packages installed.
- **Zod Installed:** You're using `zod` for schema validation (`z`).
- **`node-fetch` Installed:** If you're making direct API calls, you'll need `node-fetch`.

## Setup

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd <your-project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file (or configure your environment variables through your hosting provider) and add your ElevenLabs API key:
    ```
    ELEVENLABS_API_KEY=your_elevenlabs_api_key
    ```

## Usage

The provided code snippet demonstrates how to use each of the integrated services:

### ElevenLabs Integration

```javascript
// /// ================ elevenLabsData =============
const elevenLabsData = await createElevenLabsTools({sdk})
const tools = castToToolRecord(elevenLabsData);
const elevenLabs_input_text = "Hello, please give me the balance of account 15!";
const elevenLabsData_result = await generateText({
  model: openai("gpt-4o-mini"),
  tools: tools,
  maxSteps: 10,
  prompt: elevenLabs_input_text,
});
console.log("elevenLabs data result text: ", elevenLabsData_result.text);
```

// /// ================ vercelAIData =============
```javascript
const vercelAIData_text = "Hello, please give me the balance of account 15!";
const vercelAIData = await createVercelAITools({sdk})
const vercelAIData_result = await generateText({
  model: openai("gpt-4o-mini"),
  tools: castToToolRecord(vercelAIData),
  maxSteps: 10, // Maximum number of tool invocations per request
  prompt: vercelAIData_text,
});
console.log("vercelAIData Result text: ", vercelAIData_result.text);
## 🧱 Build from Source
```

// /// ================ langchainData =============
```javascript
const langhchain_tools = createAgentTools(sdk)
const langchainData_text = "Fetch my cash balance account 12345";
const llm = new ChatOpenAI({
  temperature: 0,
  modelName: "gpt-4o-mini", // or "gpt-3.5-turbo", whatever you're using
});
const executor = await initializeAgentExecutorWithOptions(
  langhchain_tools,
  llm, // your model (OpenAI, Anthropic, etc)
  {
    agentType: "openai-functions",//"zero-shot-react-description",
    verbose: true,
  }
);
// now you can run
const res = await executor.call({ input: langchainData_text });
console.log("langchain result output: ", res.output);
```

```bash
npm install
npm run dev
npm run build
```

---

## 🤝 Contributing

Contributions welcome! Open an issue or PR.

---

## 📜 License

MIT © [CaishenTech](https://github.com/CaishenTech)

---

## 💬 Support

Open an issue on GitHub or contact the maintainers.

---

Made with ❤️ by **Caishen**
