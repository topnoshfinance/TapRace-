import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import gameAbi from '@/lib/contracts/GameContract.json';

const GAME_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GAME_CONTRACT_ADDRESS as `0x${string}`;

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roundId = searchParams.get('roundId');

  if (!roundId) {
    return NextResponse.json({ error: 'Missing roundId parameter' }, { status: 400 });
  }

  try {
    // Get all players for the round
    const players = await publicClient.readContract({
      address: GAME_CONTRACT_ADDRESS,
      abi: gameAbi,
      functionName: 'getRoundPlayers',
      args: [BigInt(roundId)],
    }) as `0x${string}`[];

    // Batch fetch all player data
    const leaderboardPromises = players.map(async (playerAddress) => {
      const data = await publicClient.readContract({
        address: GAME_CONTRACT_ADDRESS,
        abi: gameAbi,
        functionName: 'getPlayerRoundData',
        args: [BigInt(roundId), playerAddress],
      });

      const [tapCount, lastTapTime, totalSpent] = data as [bigint, bigint, bigint];

      return {
        address: playerAddress,
        tapCount: tapCount.toString(),
        lastTapTime: lastTapTime.toString(),
        totalSpent: totalSpent.toString(),
      };
    });

    const leaderboard = await Promise.all(leaderboardPromises);

    // Sort by tap count descending
    leaderboard.sort((a, b) => Number(b.tapCount) - Number(a.tapCount));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
