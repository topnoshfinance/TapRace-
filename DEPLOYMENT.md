# TapRace Deployment Guide

## Prerequisites

1. Node.js 18+ installed
2. npm or yarn package manager
3. Base network wallet with ETH for gas fees
4. TAP tokens for testing gameplay
5. Vercel account (for hosting)
6. Farcaster account (for testing)

## Step 1: Deploy Smart Contracts

### Option A: Using Foundry (Recommended)

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Create a Foundry project (if not already):
```bash
forge init --no-commit
```

3. Copy contracts:
```bash
cp contracts/TapRace.sol src/
```

4. Install OpenZeppelin:
```bash
forge install OpenZeppelin/openzeppelin-contracts
```

5. Create foundry.toml:
```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = [
    "@openzeppelin/=lib/openzeppelin-contracts/"
]
```

6. Deploy TapRaceToken:
```bash
forge create --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  src/TapRace.sol:TapRaceToken \
  --verify
```

7. Deploy TapRaceGame (using token address from step 6):
```bash
forge create --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  src/TapRace.sol:TapRaceGame \
  --constructor-args <TOKEN_ADDRESS> \
  --verify
```

### Option B: Using Hardhat

1. Install Hardhat:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Initialize Hardhat:
```bash
npx hardhat init
```

3. Configure hardhat.config.js:
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453,
    },
  },
  etherscan: {
    apiKey: process.env.BASESCAN_API_KEY,
  },
};
```

4. Create deployment script:
```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // Deploy Token
  const TapRaceToken = await hre.ethers.getContractFactory("TapRaceToken");
  const token = await TapRaceToken.deploy();
  await token.waitForDeployment();
  console.log("Token deployed to:", await token.getAddress());

  // Deploy Game
  const TapRaceGame = await hre.ethers.getContractFactory("TapRaceGame");
  const game = await TapRaceGame.deploy(await token.getAddress());
  await game.waitForDeployment();
  console.log("Game deployed to:", await game.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

5. Deploy:
```bash
npx hardhat run scripts/deploy.js --network base
```

## Step 2: Deploy Frontend to Vercel

1. Push your code to GitHub:
```bash
git add .
git commit -m "Add TapRace application"
git push origin main
```

2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `NEXT_PUBLIC_BASE_URL`: Your deployment URL (e.g., https://taprace.vercel.app)
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: Game contract address from Step 1
   - `NEXT_PUBLIC_TOKEN_ADDRESS`: Token contract address from Step 1
   - `NEXT_PUBLIC_BASE_RPC_URL`: https://mainnet.base.org
   - `NEXT_PUBLIC_CHAIN_ID`: 8453

6. Click "Deploy"

## Step 3: Configure Domain (Optional)

1. In Vercel, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_BASE_URL` in environment variables

## Step 4: Test Farcaster Frame

1. Once deployed, your Frame will be available at your deployment URL
2. Create a test cast on Warpcast with your URL
3. Test the Frame buttons and interactions
4. Use [Frame Validator](https://warpcast.com/~/developers/frames) to debug

Example cast:
```
Check out TapRace! ⚡ 
Competitive tapping on Base - tap fast, win big! 🏆

https://your-deployment-url.vercel.app
```

## Step 5: Verify Contracts on BaseScan

1. Go to [BaseScan](https://basescan.org)
2. Find your contract
3. Click "Verify and Publish"
4. Enter contract details and source code
5. Or use Foundry/Hardhat verification commands

## Step 6: Initial Token Distribution and Approvals

1. Mint some tokens to test wallets:
```bash
cast send <TOKEN_ADDRESS> "mint(address,uint256)" <RECIPIENT> <AMOUNT> \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY
```

2. Approve the GameContract to spend TAP tokens:
```bash
cast send <TOKEN_ADDRESS> "approve(address,uint256)" <GAME_CONTRACT_ADDRESS> <AMOUNT> \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY
```

3. Create a liquidity pool (optional):
   - Use Uniswap or other DEX on Base
   - Pair with ETH or USDC
   - Add initial liquidity

## Security Checklist

- [ ] Contracts audited or security reviewed
- [ ] Private keys stored securely (never in code)
- [ ] Environment variables configured correctly
- [ ] Rate limiting enabled on API routes
- [ ] Frame signature verification implemented
- [ ] Test on testnet first (Base Goerli)
- [ ] Monitor contract for unusual activity

## Monitoring

1. Set up contract event monitoring:
   - Use Tenderly, Defender, or custom scripts
   - Monitor RoundStarted, ScoreSubmitted, RoundFinalized events

2. Set up application monitoring:
   - Vercel Analytics for performance
   - Sentry for error tracking
   - Custom logging for game events

## Maintenance

- Regularly check contract balance
- Monitor TAP token price and market conditions
- Keep dependencies updated
- Back up database (when implemented)
- Monitor for abuse or exploits
- Ensure sufficient TAP token liquidity

## Troubleshooting

### Contract deployment fails
- Check you have enough ETH for gas
- Verify RPC URL is correct
- Check Base network status

### Frame not showing in Farcaster
- Verify meta tags in layout.tsx
- Check image URLs are publicly accessible
- Use Frame Validator to debug
- Ensure NEXT_PUBLIC_BASE_URL is correct

### Transactions failing
- Check gas limits
- Verify contract addresses
- Ensure users have enough TAP tokens and have approved token spending
- Check Base network congestion
- Verify token approval amounts

## Next Steps

1. Add database for persistent storage (PostgreSQL, Supabase)
2. Implement real wallet connection (RainbowKit)
3. Add social features (sharing, invites)
4. Create admin dashboard
5. Implement anti-cheat measures
6. Add analytics and metrics
7. Launch marketing campaign

## Support

- Base Discord: https://base.org/discord
- Farcaster: https://warpcast.com
- GitHub Issues: Create an issue in the repository
