'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rank: number;
  player: string;
  score: number;
  prize: string;
  timestamp: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    
    // Refresh leaderboard every 10 seconds
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🏆 Leaderboard 🏆
      </h2>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-base-blue mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading leaderboard...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No games played yet. Be the first! 🎮</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`
                flex items-center justify-between p-4 rounded-xl
                ${entry.rank === 1 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400' : 
                  entry.rank === 2 ? 'bg-gradient-to-r from-gray-100 to-gray-200' :
                  entry.rank === 3 ? 'bg-gradient-to-r from-orange-100 to-orange-200' :
                  'bg-gray-50'}
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                  ${entry.rank === 1 ? 'bg-yellow-500 text-2xl' :
                    entry.rank === 2 ? 'bg-gray-400' :
                    entry.rank === 3 ? 'bg-orange-500' :
                    'bg-gray-300 text-gray-700'}
                `}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{entry.player}</p>
                  <p className="text-sm text-gray-600">{entry.score} taps</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{entry.prize}</p>
                {entry.rank === 1 && (
                  <p className="text-xs text-gray-500">Winner! 🎉</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-gray-600 text-center">
          💡 New round starts every 5 minutes. The player with the most taps wins the entire pool!
        </p>
      </div>
    </div>
  );
}
