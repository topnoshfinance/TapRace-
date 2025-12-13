'use client';

import { useEffect, useState } from 'react';
import { formatEther } from 'viem';

interface LeaderboardProps {
  roundId: bigint;
}

interface PlayerScore {
  address: string;
  tapCount: string;
  totalSpent: string;
}

export function Leaderboard({ roundId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<PlayerScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (roundId === BigInt(0)) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/leaderboard?roundId=${roundId}`);
        const data = await response.json();
        
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, [roundId]);

  if (isLoading && leaderboard.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Leaderboard</h2>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

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
                {player.tapCount} taps
              </div>
              <div className="text-xs text-gray-400">
                {formatEther(BigInt(player.totalSpent))} TAPRACE
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
