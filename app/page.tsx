'use client';

import { useState, useEffect, useRef } from 'react';
import TapButton from '@/components/TapButton';
import GameStats from '@/components/GameStats';
import Leaderboard from '@/components/Leaderboard';

export default function Home() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [tapCount, setTapCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalPool, setTotalPool] = useState(0);
  const [hasToken, setHasToken] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const TAP_COST = 1; // 1 TAP token per tap
  const GAME_DURATION = 30; // 30 seconds

  useEffect(() => {
    // Check if user has TapRace token (simplified for demo)
    // In production, implement the following:
    // 1. Check TAP token balance via token.balanceOf(userAddress)
    // 2. Check token approval via token.allowance(userAddress, gameContractAddress)
    // 3. If balance sufficient but approval insufficient, prompt user to approve
    // 4. Then call gameContract.submitTaps() which will transfer tokens on-chain
    const checkTokenOwnership = async () => {
      // In production, this would check actual token balance
      // For now, we'll simulate token ownership
      setHasToken(true);
    };
    checkTokenOwnership();
  }, []);

  const startGame = () => {
    if (!hasToken) {
      alert('You need TapRace tokens to participate!');
      return;
    }
    
    setGameState('playing');
    setTapCount(0);
    setTimeLeft(GAME_DURATION);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState('finished');
    
    // Submit score to backend
    submitScore(tapCount);
  };

  const handleTap = () => {
    if (gameState === 'playing') {
      setTapCount((prev) => prev + 1);
      setTotalPool((prev) => prev + TAP_COST);
    }
  };

  const submitScore = async (score: number) => {
    try {
      // In production, this should call the smart contract's submitTaps() function
      // which will transfer TAP tokens and record the score on-chain
      // For demo purposes, we're submitting to the API route only
      const response = await fetch('/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, timestamp: Date.now() }),
      });
      
      if (!response.ok) {
        console.error('Failed to submit score');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setTapCount(0);
    setTimeLeft(GAME_DURATION);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-base-blue to-farcaster-purple p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            ⚡ TapRace ⚡
          </h1>
          <p className="text-white text-lg opacity-90">
            Tap faster, win bigger on Base!
          </p>
        </header>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <GameStats
            tapCount={tapCount}
            timeLeft={timeLeft}
            totalPool={totalPool}
            gameState={gameState}
          />

          {gameState === 'idle' && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-6 text-lg">
                Tap as many times as you can in 30 seconds!<br />
                Each tap costs 1 $TAP. Winner takes the entire pool! 🏆
              </p>
              {hasToken ? (
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-base-blue to-farcaster-purple text-white px-12 py-4 rounded-full text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Start Game 🎮
                </button>
              ) : (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-6">
                  <p className="text-yellow-800 font-semibold mb-4">
                    🪙 You need TapRace tokens to play!
                  </p>
                  <button
                    className="bg-yellow-500 text-white px-8 py-3 rounded-full font-bold hover:bg-yellow-600 transition-colors"
                    onClick={() => alert('Token purchase flow would be implemented here')}
                  >
                    Get TapRace Tokens
                  </button>
                </div>
              )}
            </div>
          )}

          {gameState === 'playing' && (
            <TapButton onTap={handleTap} />
          )}

          {gameState === 'finished' && (
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Game Over! 🎉
              </h2>
              <p className="text-xl text-gray-600 mb-2">
                Your score: <span className="font-bold text-base-blue">{tapCount} taps</span>
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Pool contribution: <span className="font-bold">{tapCount * TAP_COST} $TAP</span>
              </p>
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-base-blue to-farcaster-purple text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Play Again 🔄
              </button>
            </div>
          )}
        </div>

        <Leaderboard />

        <footer className="text-center text-white py-8">
          <p className="opacity-75">
            Built on Base 🔵 • Powered by Farcaster 💜
          </p>
        </footer>
      </div>
    </main>
  );
}
