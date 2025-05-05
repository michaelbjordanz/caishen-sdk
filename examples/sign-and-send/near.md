```ts
import * as nearAPI from 'near-api-js';

async function run() {
  const wallet = {
    chainType: 'NEAR',
    account: 1,
  }
  const { address, publicKey } = await sdk.crypto.getWallet(wallet);
  const accountId = Buffer
    .from(decode(publicKey.replace('ed25519:', '')))
    .toString('hex');

  const near = await await nearAPI.connect({
    networkId: 'mainnet',
    keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
    nodeUrl: 'https://rpc.mainnet.near.org/',
  });
  const account = await near.account(accountId);

  const actions = [nearAPI.transactions.transfer(BigInt(100000))]
  const toAddress = '2ffd9feb233dc9f26d6e4afcf7e81509e042e11ab91dc8a888ce48ea2ccf3089'
  const accessKey = await account.findAccessKey(toAddress, actions);

  const recentBlockHash = nearAPI.utils.serialize.base_decode(accessKey.accessKey.block_hash);

  const tx = nearAPI.transactions.createTransaction(
    accountId,
    keyPair.getPublicKey(),
    toAddress,
    accessKey.accessKey.nonce,
    actions,
    recentBlockHash
  );

  const serializedTransaction = Buffer.from(tx.encode()).toString('hex');
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