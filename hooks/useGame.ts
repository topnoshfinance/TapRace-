'use client';

import { useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACTS } from '@/lib/web3/constants';
import gameAbi from '@/lib/contracts/GameContract.json';

export function useCurrentRound() {
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.GAME_ADDRESS,
    abi: gameAbi,
    functionName: 'getCurrentRound',
  });

  const round = data as [bigint, bigint, bigint, bigint, boolean] | undefined;

  return {
    roundId: round ? round[0] : BigInt(0),
    startTime: round ? round[1] : BigInt(0),
    endTime: round ? round[2] : BigInt(0),
    totalPot: round ? round[3] : BigInt(0),
    active: round ? round[4] : false,
    isLoading,
    refetch,
  };
}

export function usePlayerRoundData(roundId: bigint, playerAddress?: `0x${string}`) {
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.GAME_ADDRESS,
    abi: gameAbi,
    functionName: 'getPlayerRoundData',
    args: roundId && playerAddress ? [roundId, playerAddress] : undefined,
  });

  const playerData = data as [bigint, bigint, bigint] | undefined;

  return {
    tapCount: playerData ? playerData[0] : BigInt(0),
    lastTapTime: playerData ? playerData[1] : BigInt(0),
    totalSpent: playerData ? playerData[2] : BigInt(0),
    isLoading,
    refetch,
  };
}

export function useRoundPlayers(roundId: bigint) {
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.GAME_ADDRESS,
    abi: gameAbi,
    functionName: 'getRoundPlayers',
    args: roundId ? [roundId] : undefined,
  });

  return {
    players: (data as `0x${string}`[]) || [],
    isLoading,
    refetch,
  };
}

export function useTap() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const tap = async () => {
    return writeContract({
      address: CONTRACTS.GAME_ADDRESS,
      abi: gameAbi,
      functionName: 'tap',
    });
  };

  return {
    tap,
    isPending,
    isSuccess,
    error,
  };
}
