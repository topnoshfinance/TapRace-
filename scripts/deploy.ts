import { ethers } from "hardhat";

async function main() {
  console.log("Deploying TapRace contracts...");

  // Deploy TapRaceToken
  const TapRaceToken = await ethers.getContractFactory("TapRaceToken");
  const tapRaceToken = await TapRaceToken.deploy();
  await tapRaceToken.waitForDeployment();
  const tokenAddress = await tapRaceToken.getAddress();
  console.log("TapRaceToken deployed to:", tokenAddress);

  // Deploy GameContract
  const GameContract = await ethers.getContractFactory("GameContract");
  const gameContract = await GameContract.deploy(tokenAddress);
  await gameContract.waitForDeployment();
  const gameAddress = await gameContract.getAddress();
  console.log("GameContract deployed to:", gameAddress);

  // Set game contract in token
  const tx = await tapRaceToken.setGameContract(gameAddress);
  await tx.wait();
  console.log("Game contract set in token");

  console.log("\n=== Deployment Complete ===");
  console.log("Add these to your .env file:");
  console.log(`NEXT_PUBLIC_TAPRACE_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_GAME_CONTRACT_ADDRESS=${gameAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
