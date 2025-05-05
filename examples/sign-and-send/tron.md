```ts
const { TronWeb } = require('tronweb');

async function run() {
  const wallet = {
    chainType: 'TRON',
    account: 1,
  }
  const { address } = await sdk.crypto.getWallet(wallet);

  const tronWeb = new TronWeb({
    fullhost: 'https://api.trongrid.io',
  });

  const transaction = await tronWeb.transactionBuilder.sendTrx(
    'TYrXq2FN5pXG7KJbFkUcrd3oUAK7rBWZiF',
    1000000,
    address,
  )

  const serializedTransaction = Buffer.from(JSON.stringify(transaction), 'utf8').toString('hex')
  const transactionHash = await sdk.crypto.signAndSend({
    wallet,
    payload: {
      serializedTransaction,
    }
  });
  
  return transactionHash;
} 

run()
```