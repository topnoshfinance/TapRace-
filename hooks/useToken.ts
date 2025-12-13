'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACTS } from '@/lib/web3/constants';
import tokenAbi from '@/lib/contracts/TapRaceToken.json';

export function useTokenBalance() {
  const { address } = useAccount();
  
  const { data: balance, isLoading, refetch } = useReadContract({
    address: CONTRACTS.TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  return {
    balance: balance ? (balance as bigint) : BigInt(0),
    isLoading,
    refetch,
  };
}

export function useTokenApproval() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const approve = async (spender: `0x${string}`, amount: string) => {
    return writeContract({
      address: CONTRACTS.TOKEN_ADDRESS,
      abi: tokenAbi,
      functionName: 'approve',
      args: [spender, parseEther(amount)],
    });
  };

  return {
    approve,
    isPending,
    isSuccess,
    error,
  };
}

export function useTokenAllowance(spender: `0x${string}`) {
  const { address } = useAccount();

  const { data: allowance, isLoading, refetch } = useReadContract({
    address: CONTRACTS.TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: 'allowance',
    args: address && spender ? [address, spender] : undefined,
  });

  return {
    allowance: allowance ? (allowance as bigint) : BigInt(0),
    isLoading,
    refetch,
  };
}
