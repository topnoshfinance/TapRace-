'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnect } from '@/components/Wallet/WalletConnect';
import { TapButton } from '@/components/Game/TapButton';
import { Timer } from '@/components/Game/Timer';
import { Leaderboard } from '@/components/Game/Leaderboard';
import { GameStats } from '@/components/Game/GameStats';
import { useCurrentRound, usePlayerRoundData } from '@/hooks/useGame';
import { useTokenBalance } from '@/hooks/useToken';
import { formatEther } from 'viem';

export default function GamePage() {
  const { address, isConnected } = useAccount();
  const { balance } = useTokenBalance();
  const { roundId, startTime, endTime, totalPot, active, refetch: refetchRound } = useCurrentRound();
  const { tapCount, totalSpent, refetch: refetchPlayerData } = usePlayerRoundData(
    roundId,
    address
  );
  const [roundEnded, setRoundEnded] = useState(false);

  useEffect(() => {
    // Poll for round updates
    const interval = setInterval(() => {
      refetchRound();
      if (address) {
        refetchPlayerData();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [refetchRound, refetchPlayerData, address]);

  const handleTapSuccess = () => {
    // Refresh data after successful tap
    setTimeout(() => {
      refetchRound();
      refetchPlayerData();
    }, 1000);
  };

  const handleRoundEnd = () => {
    setRoundEnded(true);
    refetchRound();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            TapRace
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Compete to win on Base blockchain
          </p>
        </div>
        <WalletConnect />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            TapRace
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm bg-gray-800 px-4 py-2 rounded-lg">
              Balance: {formatEther(balance)} TAPRACE
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="container mx-auto px-4 py-8">
        {!active && !roundEnded ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold text-white mb-4">No Active Round</h2>
            <p className="text-xl text-gray-400">
              Waiting for the next round to start...
            </p>
          </div>
        ) : (
          <>
            {/* Timer and Stats */}
            <div className="mb-8">
              {active && !roundEnded && (
                <div className="mb-8">
                  <Timer endTime={endTime} onEnd={handleRoundEnd} />
                </div>
              )}

              <GameStats totalPot={totalPot} myTaps={tapCount} mySpent={totalSpent} />
            </div>

            {/* Tap Button */}
            <div className="flex justify-center mb-12">
              <TapButton
                onTap={handleTapSuccess}
                disabled={!active || roundEnded}
              />
            </div>

            {roundEnded && (
              <div className="text-center mb-8 p-6 bg-gray-900 rounded-lg">
                <h3 className="text-3xl font-bold text-yellow-400 mb-2">
                  Round Ended!
                </h3>
                <p className="text-gray-300">
                  Waiting for winner announcement...
                </p>
              </div>
            )}

            {/* Leaderboard */}
            {roundId > BigInt(0) && (
              <div className="max-w-2xl mx-auto">
                <Leaderboard roundId={roundId} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400">
          <p>TapRace - Built on Base • Each tap costs 0.03 TAPRACE</p>
        </div>
      </footer>
    </div>
  );
}
