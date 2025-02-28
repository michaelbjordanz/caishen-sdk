export async function send(signer: any) {
  if (!signer) throw new Error('Signer is required to send tokens');
  console.log('Sending Solana tokens using signer:', signer.publicKey.toString());
}