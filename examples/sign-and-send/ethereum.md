```ts
import { serializeTransaction, parseGwei, parseEther } from 'viem'

async function run() {
  const wallet = {
    chainType: 'ETHEREUM',
    account: 1,
  }
  const { address } = await sdk.crypto.getWallet(wallet);

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
  
  return transactionHash;
} 

run()
```