/*** Uncomment blockchains that should be tested ***/

export const BLOCKCHAIN_CONFIGS = [
  {
    type: 'BITCOIN',
    name: 'BITCOIN',
    tokens: [
      {
        symbol: 'BTC',
      },
    ],
    transferDest: {
      address: 'bc1q4mxn3kzmw96e3el7fzkyv7rxyqcz5xkxcclmah',
    },
  },
  {
    type: 'TRON',
    name: 'TRON',
    tokens: [
      {
        symbol: 'TRX',
      },
      {
        address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        symbol: 'USDT',
      },
    ],
    transferDest: {
      address: 'TMJ8vu3vm6eU5UndnEdUdaQmKgPJXLRwBQ',
    },
  },
  {
    type: 'XRP',
    name: 'RIPPLE',
    tokens: [
      {
        symbol: 'XRP',
      },
    ],
    transferDest: {
      memo: 2987311027,
      address: 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg',
    },
  },
  {
    type: 'TON',
    name: 'TON',
    tokens: [
      {
        symbol: 'TON',
      },
      {
        address: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
        symbol: 'USDT',
      },
    ],
    transferDest: {
      address: 'EQA2jnm1S6htWeWjNfY_3ZBmg_U_tF9KK-RstrySUepbJmEq',
    },
  },
  {
    type: 'CARDANO',
    name: 'CARDANO',
    tokens: [
      {
        symbol: 'ADA',
      },
      {
        // CIP-25
        address:
          'd1fc2f1815468b948fead16244735a378c3e3c89be52ce85791a926755534443', // encoded name
        symbol: 'USDC',
      },
    ],
    transferDest: {
      address: 'addr1v83jwzvhv4xfkfdwne2f0tgg64994kq929zql0y6frsqrhccnkyfx',
    },
  },
  {
    type: 'SOLANA',
    name: 'SOLANA',
    tokens: [
      {
        symbol: 'SOL',
      },
      {
        // SPL
        address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        symbol: 'USDT',
      },
    ],
    transferDest: {
      address: 'ANnz9oS3CRSgczVBZyGfJFiyYRKutgsxf5CCWToPFRBQ',
    },
  },
  {
    type: 'SUI',
    name: 'SUI',
    tokens: [
      {
        symbol: 'SUI',
      },
      {
        address:
          '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
        symbol: 'USDC',
      },
    ],
    transferDest: {
      address:
        '0x8a1183abd28ccbab33c44b513a582cf9eaee580f4d8fdac80e138add659dca59',
    },
  },
  // {
  //   type: 'ETHEREUM', // EVM BASED
  //   chainId: 1,
  //   name: 'ETHEREUM',
  //   tokens: [
  //     {
  //       symbol: 'ETH',
  //     },
  //     { // ERC20
  //       address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  //       symbol: 'USDT',
  //     }
  //   ],
  //   transferDest: {
  //     address: '0x6052a78f280474De3e7A4937702914cbFD9b2764'
  //   }
  // },
  // {
  //   type: 'ETHEREUM',
  //   chainId: 56,
  //   name: 'Binance SC',
  //   tokens: [
  //     {
  //       symbol: 'BNB',
  //     },
  //     {
  //       address: '0xef6d459fe81c3ed53d292c936b2df5a8084975de',
  //       symbol: 'crUSDT',
  //     }
  //   ],
  //   transferDest: {
  //     address: '0x6052a78f280474De3e7A4937702914cbFD9b2764'
  //   },
  // },
  // {
  //   type: 'ETHEREUM',
  //   chainId: 43114,
  //   name: 'Avalanche (C-Chain)',
  //   tokens: [
  //     {
  //       symbol: 'AVAXC',
  //     },
  //     {
  //       address: '0xde3A24028580884448a5397872046a019649b084',
  //       symbol: 'USDT',
  //     },
  //   ],
  //   transferDest: {
  //     address: '0x6052a78f280474De3e7A4937702914cbFD9b2764'
  //   },
  // },
  // {
  //   type: 'ETHEREUM',
  //   chainId: 137,
  //   name: 'POLYGON',
  //   tokens: [
  //     {
  //       symbol: 'POL'
  //     },
  //     {
  //       address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
  //       symbol: 'USDC'
  //     },
  //   ],
  //   transferDest: {
  //     address: '0x6052a78f280474De3e7A4937702914cbFD9b2764'
  //   },
  // },
  // {
  //   type: 'ETHEREUM',
  //   chainId: 10,
  //   name: 'OPTIMISM',
  //   tokens: [
  //     {
  //       symbol: 'OPT'
  //     },
  //     { // ERC20
  //       address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
  //       symbol: 'USDT'
  //     }
  //   ],
  //   transferDest: {
  //     address: '0x6052a78f280474De3e7A4937702914cbFD9b2764'
  //   },
  // },
  {
    type: 'ETHEREUM',
    chainId: 42161,
    name: 'ARBITRUM',
    tokens: [
      {
        symbol: 'ETH',
      },
      {
        // ERC20
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        symbol: 'USDT',
      },
    ],
    transferDest: {
      address: '0x6052a78f280474De3e7A4937702914cbFD9b2764',
    },
  },
  // {
  //   type: 'ETHEREUM',
  //   chainId: 8453,
  //   name: 'BASE',
  //   tokens: [
  //     {
  //       symbol: 'ETH',
  //     },
  //     { // ERC20
  //       address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  //       symbol: 'USDC',
  //     }
  //   ],
  //   transferDest: {
  //     address: '0x6052a78f280474De3e7A4937702914cbFD9b2764'
  //   },
  // },
  // {
  //   type: 'ETHEREUM',
  //   chainId: 34443,
  //   name: 'MODE',
  //   tokens: [
  //     {
  //       symbol: 'ETH',
  //     },
  //     { // ERC20
  //       address: '0xf0F161fDA2712DB8b566946122a5af183995e2eD',
  //       symbol: 'USDC',
  //     }
  //   ],
  //   transferDest: {
  //     address: '0x6052a78f280474De3e7A4937702914cbFD9b2764'
  //   },
  // },
  // {
  //   type: 'ETHEREUM',
  //   chainId: 5000,
  //   name: 'MANTLE',
  //   tokens: [
  //     {
  //       symbol: 'ETH',
  //     },
  //     { // ERC20
  //       address: '0xf0F161fDA2712DB8b566946122a5af183995e2eD',
  //       symbol: 'USDC',
  //     }
  //   ],
  //   transferDest: {
  //     address: '0x6052a78f280474De3e7A4937702914cbFD9b2764'
  //   },
  // },
];
