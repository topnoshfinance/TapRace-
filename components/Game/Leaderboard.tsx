'use client';

import { useEffect, useState } from 'react';
import { useRoundPlayers, usePlayerRoundData } from '@/hooks/useGame';
import { formatEther } from 'viem';

interface LeaderboardProps {
  roundId: bigint;
}

interface PlayerScore {
  address: string;
  tapCount: bigint;
  totalSpent: bigint;
}

export function Leaderboard({ roundId }: LeaderboardProps) {
  const { players, refetch } = useRoundPlayers(roundId);
  const [leaderboard, setLeaderboard] = useState<PlayerScore[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!players || players.length === 0) return;

      const scores: PlayerScore[] = [];
      for (const player of players) {
        // Note: In production, this should be done via API to avoid rate limiting
        const data = await fetch(`/api/player-data?roundId=${roundId}&address=${player}`);
        const playerData = await data.json();
        scores.push({
          address: player,
          tapCount: BigInt(playerData.tapCount || 0),
          totalSpent: BigInt(playerData.totalSpent || 0),
        });
      }

      // Sort by tap count descending
      scores.sort((a, b) => Number(b.tapCount - a.tapCount));
      setLeaderboard(scores);
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, [players, roundId]);

  if (leaderboard.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Leaderboard</h2>
        <p className="text-gray-400">No players yet. Be the first to tap!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Leaderboard</h2>
      <div className="space-y-2">
        {leaderboard.map((player, index) => (
          <div
            key={player.address}
            className={`flex items-center justify-between p-3 rounded-lg ${
              index === 0
                ? 'bg-gradient-to-r from-yellow-900 to-yellow-800'
                : 'bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white">#{index + 1}</span>
              <span className="text-sm text-gray-300">
                {player.address.slice(0, 6)}...{player.address.slice(-4)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">
                {player.tapCount.toString()} taps
              </div>
              <div className="text-xs text-gray-400">
                {formatEther(player.totalSpent)} TAPRACE
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
