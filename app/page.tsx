'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount, useConnect } from 'wagmi';
import TapButton from '@/components/TapButton';
import GameStats from '@/components/GameStats';
import Leaderboard from '@/components/Leaderboard';
import AddToFarcasterPrompt from '@/components/AddToFarcasterPrompt';
import { isInFarcasterFrame } from '@/src/lib/frame-utils';
import { checkTokenBalance } from '@/lib/token-gating';
import { sdk } from '@farcaster/miniapp-sdk';

export default function Home() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [tapCount, setTapCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalPool, setTotalPool] = useState(0);
  const [hasToken, setHasToken] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [checkingToken, setCheckingToken] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  const TAP_COST = 1; // 1 TAP token per tap
  const GAME_DURATION = 30; // 30 seconds

  // Initialize Farcaster Mini App SDK
  useEffect(() => {
    const initSDK = async () => {
      try {
        const context = await sdk.context;
        if (context) {
          // Signal that the app is ready
          await sdk.actions.ready();
        }
      } catch {
        console.log('Not running in Farcaster Mini App context');
      }
    };

    initSDK();
  }, []);

  // Auto-connect in Farcaster frames
  useEffect(() => {
    if (isInFarcasterFrame() && !isConnected) {
      // Try to find Coinbase wallet connector by name or type
      const coinbaseConnector = connectors.find(c => 
        c.id.toLowerCase().includes('coinbase') || 
        c.name.toLowerCase().includes('coinbase')
      );
      if (coinbaseConnector) {
        connect({ connector: coinbaseConnector });
      }
    }
  }, [isConnected, connect, connectors]);

  // TEMPORARY: Token gating with tangyyoghurt creator coin
  // This checks the user's balance of the tangyyoghurt token
  // TODO: Replace with $TAP token when ready (just update NEXT_PUBLIC_TOKEN_ADDRESS env var)
  useEffect(() => {
    const checkTokenOwnership = async () => {
      if (!isConnected || !address) {
        setHasToken(false);
        setTokenBalance('0');
        return;
      }

      setCheckingToken(true);
      try {
        const result = await checkTokenBalance(address);
        setHasToken(result.hasTokens);
        setTokenBalance(result.balance);
        
        if (result.error) {
          console.error('Token check error:', result.error);
        }
      } catch (error) {
        console.error('Error checking token balance:', error);
        setHasToken(false);
        setTokenBalance('0');
      } finally {
        setCheckingToken(false);
      }
    };

    checkTokenOwnership();
  }, [isConnected, address]);

  const startGame = () => {
    if (!hasToken) {
      alert('You need at least 100 tokens to participate!');
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
      <AddToFarcasterPrompt />
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
              {!isConnected ? (
                <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-6">
                  <p className="text-blue-800 font-semibold">
                    🔄 Connecting your wallet...
                  </p>
                </div>
              ) : checkingToken ? (
                <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-6">
                  <p className="text-blue-800 font-semibold">
                    🔍 Checking your token balance...
                  </p>
                </div>
              ) : hasToken ? (
                <div>
                  <div className="bg-green-100 border-2 border-green-400 rounded-xl p-4 mb-4">
                    <p className="text-green-800 font-semibold">
                      ✅ Token Balance: {parseFloat(tokenBalance).toFixed(2)} tokens
                    </p>
                  </div>
                  <button
                    onClick={startGame}
                    className="bg-gradient-to-r from-base-blue to-farcaster-purple text-white px-12 py-4 rounded-full text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Start Game 🎮
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-6">
                  <p className="text-yellow-800 font-semibold mb-2">
                    🪙 Insufficient Token Balance
                  </p>
                  <p className="text-yellow-700 mb-4">
                    You have {parseFloat(tokenBalance).toFixed(2)} tokens. You need at least 100 tokens to play!
                  </p>
                  <button
                    className="bg-yellow-500 text-white px-8 py-3 rounded-full font-bold hover:bg-yellow-600 transition-colors"
                    onClick={() => alert('Token purchase flow would be implemented here')}
                  >
                    Get More Tokens
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
