import { base } from 'viem/chains';

export const GAME_CONFIG = {
  ROUND_DURATION: 30, // Individual game session duration in seconds
  TAP_COST: 1, // 1 TAP token per tap
  ROUND_INTERVAL: 5 * 60 * 1000, // Prize round interval in milliseconds (5 minutes)
  MIN_TOKEN_BALANCE: 100, // Minimum tokens required
};

export const CHAIN_CONFIG = {
  chain: base,
  rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453'),
};

export const CONTRACT_ADDRESSES = {
  game: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
  // TEMPORARY: Using tangyyoghurt creator coin for testing token gating
  // TODO: Replace with $TAP token address when ready
  // tangyyoghurt creator coin: 0x293b4308f55f7b9bdbea937bfe9c3ee50136e3b9
  token: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '0x293b4308f55f7b9bdbea937bfe9c3ee50136e3b9',
};
