```ts
import { beginCell, Builder, internal, SendMode, storeOutList, WalletContractV5R1 } from '@ton/ton';

async function run() {
  const { address, publicKey } = await sdk.crypto.getWallet({
    chainType: 'TON',
    account: 1,
  });
  const wallet = WalletContractV5R1.create({
    publicKey: Buffer.from(publicKey, 'hex'),
  });

  const unsignedMessage = beginCell()
    .storeUint(WalletContractV5R1.OpCodes.auth_signed_external, 32)
    .store((builder: Builder) => {
      let context: number;

      if (typeof wallet.walletId.context !== 'number') {
        context = beginCell()
          .storeUint(1, 1)
          .storeInt(wallet.walletId.context.workchain, 8)
          .storeUint(0, 8)
          .storeUint(wallet.walletId.context.subwalletNumber, 15)
          .endCell()
          .beginParse()
          .loadInt(32);
      } else {
        context = beginCell()
          .storeUint(0, 1)
          .storeUint(wallet.walletId.context, 31)
          .endCell()
          .beginParse()
          .loadInt(32);
      }

      return builder.storeInt(BigInt(wallet.walletId.networkGlobalId) ^ BigInt(context), 32);
    });

  if (seqno === 0) {
    for (let i = 0; i < 32; i++) {
      unsignedMessage.storeBit(1);
    }
  } else {
    unsignedMessage.storeUint(Math.floor(Date.now() / 1e3) + 60, 32); // 60 seconds timeout 
  }

  unsignedMessage
    .storeUint(seqno, 32)
    .store((builder: Builder) => {
      const outListPacked = beginCell().store(storeOutList([{
        type: 'sendMsg',
        mode: SendMode.NONE + SendMode.IGNORE_ERRORS,
        outMsg: internal({
          value: BigInt(1000000),
          to: 'EQA_4Ggq10VefFOeecpsJ-qjbGpz_c09EE7CCSHNxE0Y6jCQ',
          bounce: false,
        })
      }]));

      builder.storeMaybeRef(outListPacked);
      builder.storeUint(0, 1);
    });

  const serializedTransaction = Buffer.from(
    unsignedMessage
      .endCell()
      .toBoc()
  ).toString('hex');
  
  const transactionHash = await sdk.crypto.signAndSend({
    wallet: {
      chainType: 'TON',
      account: 1,
    },
    payload: {
      serializedTransaction,
    }
  });
  
  return transactionHash;
} 

run()
```