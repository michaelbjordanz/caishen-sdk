```ts
import { Psbt } from 'bitcoinjs-lib';

async function run() {
  const wallet = {
    chainType: 'BITCOIN',
    account: 1,
  }
  const { address } = await sdk.crypto.getWallet(wallet);
  const { data: utxos } = await axios.get(`https://blockstream.info/api/address/${address}/utxo`);
  const [utxo] = utxos;
  
  const psbt = new Psbt({ network })
    .addInput({
      hash: utxo.txid,
      index: utxo.vout,
      nonWitnessUtxo: Buffer.from(inputTx.hex, 'hex'),
    })
    .addOutput({
      value: '1000', // satoshi
      address: 'bc1q2kmxffvx6dgvuufz72q5awpvg0utcsl4nf26gg',
    });

  const serializedTransaction = psbt.toHex()
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