import ChainIds from './chain-ids';

const PublicRpcEndpoints: any = {
  [ChainIds.MAINNET]: 'https://rpc.ankr.com/eth',
  [ChainIds.SMART_CHAIN]: 'https://bsc-dataseed.binance.org/',
  [ChainIds.MATIC]: 'https://polygon-rpc.com/',
  [ChainIds.OPTIMISM]: 'https://optimism.publicnode.com',
  [ChainIds.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
  [ChainIds.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [ChainIds.BASE]: 'https://mainnet.base.org',
  [ChainIds.MANTLE]: 'https://rpc.mantle.xyz',
  [ChainIds.MODE]: 'https://mainnet.mode.network',
  [ChainIds.SOLANA]: 'https://solana-mainnet.g.alchemy.com/v2/demo',
  [ChainIds.SUI]: 'https://fullnode.mainnet.sui.io',
  [ChainIds.BITCOIN]: 'https://api.blockcypher.com/v1/btc/main',
  [ChainIds.NEWMONEY_CHAIN]: 'https://cashchain-rpc.newmoney.ai',
  [ChainIds.ABSTRACT]: 'https://abstract.drpc.org',
  [ChainIds.LINEA]: 'https://linea-rpc.publicnode.com',
  [ChainIds.BLAST]: 'https://rpc.blast.io',
  [ChainIds.LITECOIN]: 'https://go.getblock.io/687a16d871f54299b19a285be54bc891',
  [ChainIds.DOGECOIN]: 'https://go.getblock.io/f6ac2b4b5ce246829db698141d9f0bfe',
  [ChainIds.DASHCOIN]: 'https://dash-rpc.publicnode.com',
  [ChainIds.TON]: 'https://toncenter.com/api/v2/jsonRPC',
  [ChainIds.TRON]: 'https://api.trongrid.io',
  [ChainIds.RIPPLE]: 'wss://s2.ripple.com:443',
  [ChainIds.COSMOS]: 'https://cosmos-rpc.publicnode.com:443',
  [ChainIds.NEAR]: 'https://rpc.mainnet.near.org',
  [ChainIds.APTOS]: 'https://1rpc.io/aptos',
  [ChainIds.CARDANO]: 'wss://go.getblock.io/68afeff066af41bb89baed64b21671b8',
} as const;

export default PublicRpcEndpoints;
