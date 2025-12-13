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
  const address = searchParams.get('address');

  if (!roundId || !address) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const data = await publicClient.readContract({
      address: GAME_CONTRACT_ADDRESS,
      abi: gameAbi,
      functionName: 'getPlayerRoundData',
      args: [BigInt(roundId), address as `0x${string}`],
    });

    const [tapCount, lastTapTime, totalSpent] = data as [bigint, bigint, bigint];

    return NextResponse.json({
      tapCount: tapCount.toString(),
      lastTapTime: lastTapTime.toString(),
      totalSpent: totalSpent.toString(),
    });
  } catch (error) {
    console.error('Error fetching player data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
