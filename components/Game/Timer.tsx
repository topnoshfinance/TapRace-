'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  endTime: bigint;
  onEnd?: () => void;
}

export function Timer({ endTime, onEnd }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const end = Number(endTime);
      const remaining = Math.max(0, end - now);
      setTimeLeft(remaining);

      if (remaining === 0 && onEnd) {
        onEnd();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [endTime, onEnd]);

  return (
    <div className="text-center">
      <div className="text-6xl font-bold text-white mb-2">
        {timeLeft}s
      </div>
      <div className="text-xl text-gray-400">Time Remaining</div>
    </div>
  );
}
