import { NextResponse } from 'next/server';

// In-memory storage - shared with submit-score
// In production, use a database
const getMockLeaderboard = () => {
  // For demo, return mock data
  return [
    {
      rank: 1,
      player: '0x742d...4f2a',
      score: 287,
      prize: '$8.61',
      timestamp: Date.now() - 1000 * 60 * 2,
    },
    {
      rank: 2,
      player: '0x8b3c...9e1d',
      score: 256,
      prize: '$0.00',
      timestamp: Date.now() - 1000 * 60 * 5,
    },
    {
      rank: 3,
      player: '0x1a2b...3c4d',
      score: 234,
      prize: '$0.00',
      timestamp: Date.now() - 1000 * 60 * 8,
    },
    {
      rank: 4,
      player: '0x5e6f...7g8h',
      score: 198,
      prize: '$0.00',
      timestamp: Date.now() - 1000 * 60 * 12,
    },
    {
      rank: 5,
      player: '0x9i0j...1k2l',
      score: 176,
      prize: '$0.00',
      timestamp: Date.now() - 1000 * 60 * 15,
    },
  ];
};

export async function GET() {
  try {
    const leaderboard = getMockLeaderboard();

    return NextResponse.json({
      success: true,
      leaderboard,
      lastUpdated: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
