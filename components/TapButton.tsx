'use client';

import { useState } from 'react';

interface TapButtonProps {
  onTap: () => void;
}

export default function TapButton({ onTap }: TapButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    onTap();
    
    // Visual feedback
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <button
        onClick={handleTap}
        onTouchStart={handleTap}
        className={`
          tap-button relative overflow-hidden
          w-64 h-64 rounded-full 
          bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500
          text-white text-6xl font-bold
          shadow-2xl
          transition-all duration-100
          ${isPressed ? 'scale-95 shadow-lg' : 'scale-100 hover:scale-105'}
        `}
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span className="relative z-10">TAP!</span>
        
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute bg-white opacity-50 rounded-full animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)',
              animation: 'ripple 0.6s ease-out',
            }}
          />
        ))}
      </button>

      <style jsx>{`
        @keyframes ripple {
          from {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.5;
          }
          to {
            transform: translate(-50%, -50%) scale(10);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
