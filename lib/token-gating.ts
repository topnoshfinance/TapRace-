import { readContract } from 'wagmi/actions';
import { config } from '@/src/lib/wagmi';
import { ERC20_ABI } from './token-abi';
import { CONTRACT_ADDRESSES, GAME_CONFIG } from './config';
import { formatUnits } from 'viem';

/**
 * TEMPORARY TOKEN GATING IMPLEMENTATION
 * 
 * This module implements token gating using the tangyyoghurt creator coin
 * for testing purposes. This is a temporary solution until the $TAP token
 * is deployed and ready for use.
 * 
 * Token: tangyyoghurt creator coin
 * Address: 0x293b4308f55f7b9bdbea937bfe9c3ee50136e3b9
 * 
 * TO SWAP TO $TAP TOKEN LATER:
 * 1. Update NEXT_PUBLIC_TOKEN_ADDRESS in .env to the $TAP token address
 * 2. Verify the token decimals match (adjust MIN_TOKEN_BALANCE if needed)
 * 3. Test thoroughly with the new token address
 * 4. Remove this comment block
 */

/**
 * Check if a user has sufficient token balance to play the game
 * @param address - User's wallet address
 * @returns Object with hasTokens boolean and balance string
 */
export async function checkTokenBalance(address: `0x${string}` | undefined) {
  if (!address) {
    return { hasTokens: false, balance: '0', error: 'No address provided' };
  }

  if (!CONTRACT_ADDRESSES.token) {
    return { hasTokens: false, balance: '0', error: 'Token address not configured' };
  }

  try {
    // Read token balance from the contract
    const balance = await readContract(config, {
      address: CONTRACT_ADDRESSES.token as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    // Get token decimals
    const decimals = await readContract(config, {
      address: CONTRACT_ADDRESSES.token as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'decimals',
    });

    // Type guard: Ensure balance is a bigint and decimals is a number
    if (typeof balance !== 'bigint' || typeof decimals !== 'number') {
      throw new Error('Invalid response from token contract');
    }

    // Convert balance to human-readable format
    const formattedBalance = formatUnits(balance, decimals);
    const balanceNumber = parseFloat(formattedBalance);

    // Check if balance meets minimum requirement
    const hasTokens = balanceNumber >= GAME_CONFIG.MIN_TOKEN_BALANCE;

    return {
      hasTokens,
      balance: formattedBalance,
      balanceNumber,
      error: null,
    };
  } catch (error) {
    console.error('Error checking token balance:', error);
    return {
      hasTokens: false,
      balance: '0',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get token information (name, symbol, decimals)
 * @returns Token information or null if error
 */
export async function getTokenInfo() {
  if (!CONTRACT_ADDRESSES.token) {
    return null;
  }

  try {
    const [name, symbol, decimals] = await Promise.all([
      readContract(config, {
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'name',
      }),
      readContract(config, {
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }),
      readContract(config, {
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }),
    ]);

    // Type guards: Ensure correct types
    if (typeof name !== 'string' || typeof symbol !== 'string' || typeof decimals !== 'number') {
      throw new Error('Invalid response from token contract');
    }

    return {
      name,
      symbol,
      decimals,
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    return null;
  }
}
