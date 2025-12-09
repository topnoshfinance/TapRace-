import { base } from 'viem/chains';

export const GAME_CONFIG = {
  ROUND_DURATION: 30, // seconds
  TAP_COST: 0.03, // USD
  ROUND_INTERVAL: 5 * 60 * 1000, // 5 minutes in milliseconds
  MIN_TOKEN_BALANCE: 100, // Minimum tokens required
};

export const CHAIN_CONFIG = {
  chain: base,
  rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453'),
};

export const CONTRACT_ADDRESSES = {
  game: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
  token: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '',
};
