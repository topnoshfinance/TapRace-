'use client';

interface GameStatsProps {
  tapCount: number;
  timeLeft: number;
  totalPool: number;
  gameState: 'idle' | 'playing' | 'finished';
}

export default function GameStats({ tapCount, timeLeft, totalPool, gameState }: GameStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
        <p className="text-sm text-gray-600 font-semibold mb-1">TAPS</p>
        <p className="text-4xl font-bold text-base-blue">{tapCount}</p>
      </div>

      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
        <p className="text-sm text-gray-600 font-semibold mb-1">TIME LEFT</p>
        <p className={`text-4xl font-bold ${timeLeft <= 10 && gameState === 'playing' ? 'text-red-500 animate-pulse' : 'text-farcaster-purple'}`}>
          {timeLeft}s
        </p>
      </div>

      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
        <p className="text-sm text-gray-600 font-semibold mb-1">POOL</p>
        <p className="text-4xl font-bold text-green-600">
          ${totalPool.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
