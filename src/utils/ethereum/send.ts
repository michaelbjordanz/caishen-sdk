export async function send(signer: any) {
  if (!signer) throw new Error('Signer is required to send Ethereum tokens');
  console.log('Sending Ethereum tokens using signer:', signer.address);
}