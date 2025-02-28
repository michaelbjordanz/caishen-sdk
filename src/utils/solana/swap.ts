export async function swap(signer: any) {
  if (!signer) throw new Error('Signer is required to swap tokens');
  console.log('Swapping Solana tokens using signer:', signer.publicKey.toString());
}