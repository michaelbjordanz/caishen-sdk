export async function swap(signer: any) {
  if (!signer) throw new Error('Signer is required to swap Ethereum tokens');
  console.log('Swapping Ethereum tokens using signer:', signer.address);
}