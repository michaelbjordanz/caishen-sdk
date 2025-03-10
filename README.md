# Caishen SDK

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/caishen-sdk.svg)](https://badge.fury.io/js/caishen-sdk)

The Caishen SDK provides developers with seamless access to unlimited multi-chain crypto wallets. It offers a unified interface for interacting with various blockchain networks and managing crypto assets.

## Features

- Multi-chain wallet support
- Support for major blockchain networks:
  - Ethereum (via ethers.js)
  - Bitcoin (via bitcoinjs-lib)
  - Solana (via @solana/web3.js)
  - Cardano (via @emurgo/cardano-serialization-lib)
  - Sui (via @mysten/sui)
  - NEAR (via near-api-js)
  - Ripple
  - Tron
  - TON
  - Aptos
- Secure wallet management
- Type-safe implementation with TypeScript
- Comprehensive crypto operations support

## Installation

```bash
npm install caishen-sdk
# or
yarn add caishen-sdk
# or
pnpm add caishen-sdk
```

## Requirements

- Node.js 14.x or higher
- TypeScript 4.x or higher (for TypeScript users)

## Quick Start

```typescript
import { Wallets, Agents } from 'caishen-sdk';

// Initialize the wallets
const wallets = new Wallets();

// Initialize the agents
const agents = new Agents();

// Use the SDK's features
// ... (Documentation for specific features will be added)
```

## Dependencies

The SDK relies on several peer and production dependencies:

- `zod` (3.x) - For runtime type validation
- Various blockchain-specific libraries (automatically installed)

## Building from Source

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Watch mode for development
npm run dev
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

CaishenXYZ

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Made with ❤️ by Caishen 