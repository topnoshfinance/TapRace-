// Admin script to manage game rounds
// Run with: node --loader tsx scripts/admin/manage-rounds.mjs

import { createPublicClient, createWalletClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import * as dotenv from 'dotenv';
import gameAbi from '../../lib/contracts/GameContract.json' assert { type: 'json' };

dotenv.config();

const GAME_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GAME_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!GAME_CONTRACT_ADDRESS || !PRIVATE_KEY) {
  console.error('Missing required environment variables');
  console.error('Please set NEXT_PUBLIC_GAME_CONTRACT_ADDRESS and PRIVATE_KEY in .env');
  process.exit(1);
}

const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});

async function getCurrentRound() {
  const data = await publicClient.readContract({
    address: GAME_CONTRACT_ADDRESS,
    abi: gameAbi,
    functionName: 'getCurrentRound',
  });

  const [roundId, startTime, endTime, totalPot, active] = data;
  return { roundId, startTime, endTime, totalPot, active };
}

async function startRound() {
  console.log('Starting new round...');
  const hash = await walletClient.writeContract({
    address: GAME_CONTRACT_ADDRESS,
    abi: gameAbi,
    functionName: 'startRound',
  });

  console.log('Transaction submitted:', hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log('Round started! Receipt:', receipt);
  return receipt;
}

async function endRound() {
  console.log('Ending current round...');
  const hash = await walletClient.writeContract({
    address: GAME_CONTRACT_ADDRESS,
    abi: gameAbi,
    functionName: 'endRound',
  });

  console.log('Transaction submitted:', hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log('Round ended! Receipt:', receipt);
  return receipt;
}

async function finalizeRound(roundId) {
  console.log(`Finalizing round ${roundId}...`);
  const hash = await walletClient.writeContract({
    address: GAME_CONTRACT_ADDRESS,
    abi: gameAbi,
    functionName: 'finalizeRound',
    args: [roundId],
  });

  console.log('Transaction submitted:', hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log('Round finalized! Receipt:', receipt);
  return receipt;
}

async function manageRounds() {
  console.log('=== TapRace Round Manager ===\n');

  const currentRound = await getCurrentRound();
  const now = Math.floor(Date.now() / 1000);

  console.log('Current Round:', currentRound.roundId.toString());
  console.log('Active:', currentRound.active);
  console.log('Total Pot:', currentRound.totalPot.toString());
  console.log('Start Time:', new Date(Number(currentRound.startTime) * 1000).toISOString());
  console.log('End Time:', new Date(Number(currentRound.endTime) * 1000).toISOString());
  console.log('Current Time:', new Date(now * 1000).toISOString());
  console.log();

  if (!currentRound.active) {
    console.log('No active round. Starting new round...');
    await startRound();
  } else if (now >= Number(currentRound.endTime)) {
    console.log('Round has ended. Processing...');
    await endRound();
    console.log('Finalizing round...');
    await finalizeRound(currentRound.roundId);
    console.log('Starting next round...');
    await startRound();
  } else {
    const timeLeft = Number(currentRound.endTime) - now;
    console.log(`Round in progress. Time left: ${timeLeft} seconds`);
  }

  console.log('\n=== Done ===');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  manageRounds()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

export { manageRounds, getCurrentRound, startRound, endRound, finalizeRound };
