export const CONTRACTS = {
  TOKEN_ADDRESS: process.env.NEXT_PUBLIC_TAPRACE_TOKEN_ADDRESS as `0x${string}` || '0x',
  GAME_ADDRESS: process.env.NEXT_PUBLIC_GAME_CONTRACT_ADDRESS as `0x${string}` || '0x',
};

export const TAP_COST = '0.03'; // 0.03 TAPRACE tokens per tap
export const ROUND_DURATION = 30; // 30 seconds
