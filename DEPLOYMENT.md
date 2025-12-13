# Deployment Guide for TapRace

## Prerequisites

Before deploying, ensure you have:

1. **Base Sepolia ETH**: For gas fees during contract deployment
2. **WalletConnect Project ID** (optional): From https://cloud.walletconnect.com/
3. **Deployment Environment**: Vercel, Netlify, or self-hosted server
4. **Private Key**: For contract deployment (keep secure!)

## Step 1: Deploy Smart Contracts

### Option A: Using Remix IDE (Recommended for simplicity)

1. Visit [Remix IDE](https://remix.ethereum.org/)

2. Create `TapRaceToken.sol`:
   - Copy content from `contracts/TapRaceToken.sol`
   - Paste into Remix

3. Create `GameContract.sol`:
   - Copy content from `contracts/GameContract.sol`
   - Paste into Remix

4. Compile contracts:
   - Select Solidity compiler version `0.8.20`
   - Click "Compile"

5. Deploy TapRaceToken:
   - Go to "Deploy & Run Transactions"
   - Select "Injected Provider - MetaMask"
   - Connect to Base Sepolia network
   - Select `TapRaceToken` contract
   - Click "Deploy"
   - Confirm transaction in MetaMask
   - **Save the deployed contract address**

6. Deploy GameContract:
   - Select `GameContract` contract
   - In constructor parameters, paste the TapRaceToken address
   - Click "Deploy"
   - Confirm transaction
   - **Save the deployed contract address**

7. Set game contract in token:
   - In deployed TapRaceToken contract section
   - Find `setGameContract` function
   - Enter GameContract address
   - Click "transact"
   - Confirm transaction

### Option B: Using Foundry (Advanced)

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Initialize Foundry project
forge init --force

# Copy contracts to src/
cp contracts/*.sol src/

# Install OpenZeppelin
forge install OpenZeppelin/openzeppelin-contracts

# Create deployment script
# See example in scripts/Deploy.s.sol (create this file)

# Deploy to Base Sepolia
forge script scripts/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC --broadcast --verify
```

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your values:
   ```env
   # Base Sepolia RPC
   NEXT_PUBLIC_BASE_RPC_URL=https://sepolia.base.org
   NEXT_PUBLIC_BASE_CHAIN_ID=84532

   # Deployed contract addresses (from Step 1)
   NEXT_PUBLIC_TAPRACE_TOKEN_ADDRESS=0xYourTokenAddress
   NEXT_PUBLIC_GAME_CONTRACT_ADDRESS=0xYourGameAddress

   # WalletConnect (get from https://cloud.walletconnect.com/)
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

   # Your production URL
   NEXT_PUBLIC_API_URL=https://your-domain.com
   ```

## Step 3: Deploy Frontend

### Option A: Deploy to Vercel (Recommended)

1. **Push code to GitHub**:
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select "TapRace-" project

3. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --legacy-peer-deps`

4. **Add Environment Variables**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from your `.env.local`
   - Make sure to select "Production", "Preview", and "Development"

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option B: Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login
   netlify login

   # Deploy
   netlify deploy --prod
   ```

3. **Configure Environment Variables**:
   - In Netlify dashboard, go to Site settings → Build & deploy → Environment
   - Add all variables from your `.env.local`

### Option C: Self-hosted

1. **Build the project**:
   ```bash
   npm install --legacy-peer-deps
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Use PM2 for process management** (recommended):
   ```bash
   # Install PM2
   npm install -g pm2

   # Start application
   pm2 start npm --name "taprace" -- start

   # Save PM2 configuration
   pm2 save

   # Setup PM2 to start on boot
   pm2 startup
   ```

4. **Configure Nginx reverse proxy** (optional):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Step 4: Initial Token Distribution

After deployment, you'll need to distribute TAPRACE tokens to players:

1. **Mint tokens to your address**:
   - In Remix or using ethers.js:
   ```javascript
   // Connect to TapRaceToken contract
   await tokenContract.mint(recipientAddress, ethers.parseEther("1000"));
   ```

2. **Create faucet** (optional):
   - Users can request testnet tokens
   - Implement rate limiting
   - Store requests in database

## Step 5: Start Game Rounds

Game rounds must be started manually by the contract owner:

1. **Start a round**:
   - In Remix, call `startRound()` on GameContract
   - Or create admin dashboard to manage rounds

2. **End and finalize round**:
   - After 30 seconds, call `endRound()`
   - Then call `finalizeRound(roundId)` to pay winner

3. **Automate rounds** (optional):
   - Create cron job or scheduled task
   - Use backend script to manage rounds
   - Example:
   ```javascript
   // Backend script (run every minute)
   const checkAndManageRounds = async () => {
     const currentRound = await gameContract.getCurrentRound();
     if (!currentRound.active) {
       // Start new round
       await gameContract.startRound();
     } else if (Date.now() / 1000 > currentRound.endTime) {
       // End and finalize current round
       await gameContract.endRound();
       await gameContract.finalizeRound(currentRound.roundId);
     }
   };
   ```

## Step 6: Test the Deployment

1. **Visit your deployed URL**
2. **Connect your wallet** (make sure you're on Base Sepolia)
3. **Get test tokens** (contact admin or use faucet)
4. **Wait for a round to start**
5. **Test tapping functionality**
6. **Verify leaderboard updates**
7. **Check winner payout after round ends**

## Step 7: Farcaster Frame Setup

1. **Share Frame URL**:
   - Your frame is at: `https://your-domain.com/frame`
   - Share in Farcaster to test

2. **Verify Frame**:
   - Use [Farcaster Frame Validator](https://warpcast.com/~/developers/frames)
   - Enter your frame URL
   - Check for errors

## Post-Deployment Checklist

- [ ] Smart contracts deployed and verified
- [ ] Environment variables configured
- [ ] Frontend deployed and accessible
- [ ] Token contract has initial supply
- [ ] Game contract approved in token contract
- [ ] Test wallet has tokens for testing
- [ ] Game rounds can be started/ended
- [ ] Wallet connection works
- [ ] Tap functionality works
- [ ] Leaderboard updates
- [ ] Winner gets payout
- [ ] Farcaster frame displays correctly

## Troubleshooting

### Contract deployment fails
- Ensure you have enough Base Sepolia ETH
- Check RPC URL is correct
- Verify Solidity version is 0.8.20

### Frontend build fails
- Run `npm install --legacy-peer-deps`
- Check Node.js version (18+ or 20+)
- Verify all environment variables are set

### Wallet won't connect
- Check you're on Base Sepolia network (Chain ID: 84532)
- Try clearing browser cache
- Use MetaMask or another web3 wallet

### Taps aren't working
- Ensure you have TAPRACE tokens
- Check token approval (should happen automatically)
- Verify round is active
- Check console for errors

### Leaderboard not updating
- Check API routes are accessible
- Verify RPC connection
- Check browser network tab for errors

## Mainnet Deployment

When ready for production on Base mainnet:

1. Update `.env.local`:
   ```env
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   NEXT_PUBLIC_BASE_CHAIN_ID=8453
   ```

2. Deploy contracts to Base mainnet (requires real ETH)

3. Update contract addresses in environment variables

4. Perform thorough testing with real funds

5. Consider contract audits before launching

## Support

For issues or questions:
- Check GitHub Issues
- Review documentation
- Contact development team

## Security Notes

- **Never commit `.env.local`** to version control
- **Keep private keys secure**
- **Test thoroughly before mainnet**
- **Consider smart contract audit**
- **Implement rate limiting in production**
- **Monitor for unusual activity**

---

**Congratulations!** Your TapRace app should now be deployed and ready to use! 🎉
