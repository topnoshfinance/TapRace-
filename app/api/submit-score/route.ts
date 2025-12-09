import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, use a database like PostgreSQL or MongoDB
let gameRounds: {
  roundId: string;
  startTime: number;
  endTime: number;
  scores: { player: string; score: number; timestamp: number }[];
  winner?: string;
  prizePool: number;
}[] = [];

let currentRound = {
  roundId: `round-${Date.now()}`,
  startTime: Date.now(),
  endTime: Date.now() + 5 * 60 * 1000, // 5 minutes
  scores: [] as { player: string; score: number; timestamp: number }[],
  prizePool: 0,
};

export async function POST(request: NextRequest) {
  try {
    const { score, timestamp } = await request.json();

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { error: 'Invalid score' },
        { status: 400 }
      );
    }

    // Check if current round has ended
    if (Date.now() >= currentRound.endTime) {
      // Finalize current round
      if (currentRound.scores.length > 0) {
        const winner = currentRound.scores.reduce((prev, current) => 
          prev.score > current.score ? prev : current
        );
        gameRounds.push({
          ...currentRound,
          winner: winner.player,
        });
      }

      // Start new round
      currentRound = {
        roundId: `round-${Date.now()}`,
        startTime: Date.now(),
        endTime: Date.now() + 5 * 60 * 1000,
        scores: [],
        prizePool: 0,
      };
    }

    // Generate a player ID (in production, use wallet address or Farcaster ID)
    const playerId = `player-${Math.random().toString(36).substring(7)}`;
    
    // Calculate contribution to prize pool (3 cents per tap)
    const contribution = score * 0.03;
    currentRound.prizePool += contribution;

    // Add score to current round
    currentRound.scores.push({
      player: playerId,
      score,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      roundId: currentRound.roundId,
      score,
      contribution: contribution.toFixed(2),
      currentPool: currentRound.prizePool.toFixed(2),
      timeLeft: Math.max(0, currentRound.endTime - Date.now()),
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}
