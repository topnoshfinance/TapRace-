import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import gameAbi from '@/lib/contracts/GameContract.json';

const GAME_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GAME_CONTRACT_ADDRESS as `0x${string}`;

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export async function GET() {
  try {
    const data = await publicClient.readContract({
      address: GAME_CONTRACT_ADDRESS,
      abi: gameAbi,
      functionName: 'getCurrentRound',
    });

    const [roundId, startTime, endTime, totalPot, active] = data as [
      bigint,
      bigint,
      bigint,
      bigint,
      boolean
    ];

    return NextResponse.json({
      roundId: roundId.toString(),
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      totalPot: totalPot.toString(),
      active,
    });
  } catch (error) {
    console.error('Error fetching round data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
