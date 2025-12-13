'use client';

import { formatEther } from 'viem';

interface GameStatsProps {
  totalPot: bigint;
  myTaps: bigint;
  mySpent: bigint;
}

export function GameStats({ totalPot, myTaps, mySpent }: GameStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-900 rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-yellow-400 mb-2">
          {formatEther(totalPot)}
        </div>
        <div className="text-sm text-gray-400">Total Pot (TAPRACE)</div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-purple-400 mb-2">
          {myTaps.toString()}
        </div>
        <div className="text-sm text-gray-400">Your Taps</div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-pink-400 mb-2">
          {formatEther(mySpent)}
        </div>
        <div className="text-sm text-gray-400">Your Spent (TAPRACE)</div>
      </div>
    </div>
  );
}
