'use client';

import { useState, useEffect } from 'react';
import { useTap } from '@/hooks/useGame';
import { useTokenAllowance, useTokenApproval } from '@/hooks/useToken';
import { CONTRACTS, TAP_COST } from '@/lib/web3/constants';
import { parseEther } from 'viem';

interface TapButtonProps {
  onTap?: () => void;
  disabled?: boolean;
}

export function TapButton({ onTap, disabled }: TapButtonProps) {
  const { tap, isPending: isTapping } = useTap();
  const { allowance, refetch: refetchAllowance } = useTokenAllowance(CONTRACTS.GAME_ADDRESS);
  const { approve, isPending: isApproving, isSuccess: approvalSuccess } = useTokenApproval();
  const [needsApproval, setNeedsApproval] = useState(false);
  const [tapAnimation, setTapAnimation] = useState(false);

  const tapCostWei = parseEther(TAP_COST);

  useEffect(() => {
    setNeedsApproval(allowance < tapCostWei);
  }, [allowance, tapCostWei]);

  useEffect(() => {
    if (approvalSuccess) {
      refetchAllowance();
    }
  }, [approvalSuccess, refetchAllowance]);

  const handleTap = async () => {
    if (disabled || isTapping) return;

    setTapAnimation(true);
    setTimeout(() => setTapAnimation(false), 150);

    try {
      await tap();
      onTap?.();
    } catch (error) {
      console.error('Tap failed:', error);
    }
  };

  const handleApprove = async () => {
    try {
      // Approve a large amount so user doesn't need to approve every time
      await approve(CONTRACTS.GAME_ADDRESS, '1000');
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  if (needsApproval) {
    return (
      <button
        onClick={handleApprove}
        disabled={isApproving || disabled}
        className="w-64 h-64 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 
                   text-white text-2xl font-bold shadow-2xl transition-all duration-200 
                   disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        {isApproving ? 'Approving...' : 'Approve Tokens'}
      </button>
    );
  }

  return (
    <button
      onClick={handleTap}
      disabled={disabled || isTapping}
      className={`w-64 h-64 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                 text-white text-4xl font-bold shadow-2xl transition-all duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 ${tapAnimation ? 'scale-95' : 'scale-100'}
                 ${!disabled && !isTapping ? 'hover:scale-105' : ''}`}
    >
      {isTapping ? '...' : 'TAP!'}
    </button>
  );
}
