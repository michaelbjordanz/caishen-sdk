import { Wallet, ethers } from 'ethers';
import Chains from '../../constants/chains';

export async function sendETH(signer: Wallet, amount: string, to: string, rpcUrl?: string) {
  if (!signer) throw new Error('Signer is required');
  if (!amount || !to) throw new Error('Amount and destination address are required');

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl || Chains[1].publicRpc);
  const tx = await signer.sendTransaction({
    to,
    value: ethers.utils.parseEther(amount),
  });

  return tx.wait();
}

export async function sendTokens(signer: Wallet, tokenAddress: string, amount: string, to: string, rpcUrl?: string) {
  if (!signer) throw new Error('Signer is required');
  if (!tokenAddress || !amount || !to) throw new Error('Token address, amount, and destination address are required');

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl || Chains[1].publicRpc);
  const erc20 = new ethers.Contract(tokenAddress, [
    'function transfer(address to, uint amount) public returns (bool)',
  ], signer);

  const tx = await erc20.transfer(to, ethers.utils.parseUnits(amount, 18));
  return tx.wait();
}

export async function getETHBalance(signer: Wallet, rpcUrl?: string) {
  if (!signer) throw new Error('Signer is required');
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl || Chains[1].publicRpc);
  return ethers.utils.formatEther(await provider.getBalance(signer.address));
}

export async function getTokenBalance(signer: Wallet, tokenAddress: string, rpcUrl?: string) {
  if (!signer) throw new Error('Signer is required');
  if (!tokenAddress) throw new Error('Token address is required');

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl || Chains[1].publicRpc);
  const erc20 = new ethers.Contract(tokenAddress, [
    'function balanceOf(address account) view returns (uint)',
  ], provider);

  const balance = await erc20.balanceOf(signer.address);
  return ethers.utils.formatUnits(balance, 18);
}

export async function getTokenBalances(signer: Wallet, rpcUrl?: string) {
  if (!signer) throw new Error('Signer is required');
  // To be implemented later
}
