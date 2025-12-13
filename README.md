# TapRace

A social racing mini app for Farcaster built on Base blockchain. Players compete in 30-second tapping rounds where each tap costs $0.03 (paid in TAPRACE tokens). The winner takes the entire pot!

## 🎮 Features

- **30-Second Rounds**: Fast-paced tapping competition
- **Token-Based Economy**: Each tap costs 0.03 TAPRACE tokens
- **Winner Takes All**: Highest tap count wins the entire pot
- **Real-Time Leaderboard**: Live updates during rounds
- **Base Blockchain**: Built on Ethereum L2 for low fees
- **Farcaster Frames**: Play directly in Farcaster

## 🏗️ Tech Stack

- **Frontend**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, Viem
- **Smart Contracts**: Solidity 0.8.20
- **Blockchain**: Base (Sepolia testnet)
- **Farcaster**: Frog framework

## 📁 Project Structure

```
/contracts              - Solidity smart contracts
  /TapRaceToken.sol    - ERC-20 token contract
  /GameContract.sol    - Game logic contract
  /test                - Contract tests
/app
  /api                 - API routes for backend logic
  /frame               - Farcaster frame endpoints
  /page.tsx            - Main game interface
/components
  /Game                - Game UI components
  /Wallet              - Wallet connection components
/hooks                 - Custom React hooks
/lib
  /contracts           - Contract ABIs
  /web3                - Web3 configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- MetaMask or another Web3 wallet
- Base Sepolia ETH for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/topnoshfinance/TapRace-.git
   cd TapRace-
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Update the following variables in `.env.local`:
   ```env
   # RPC URL for Base Sepolia
   NEXT_PUBLIC_BASE_RPC_URL=https://sepolia.base.org
   NEXT_PUBLIC_BASE_CHAIN_ID=84532

   # Contract addresses (get these after deployment)
   NEXT_PUBLIC_TAPRACE_TOKEN_ADDRESS=
   NEXT_PUBLIC_GAME_CONTRACT_ADDRESS=

   # WalletConnect Project ID (get from https://cloud.walletconnect.com/)
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=

   # Private key for contract deployment (without 0x prefix)
   PRIVATE_KEY=

   # Farcaster Hub URL
   FARCASTER_HUB_URL=https://nemes.farcaster.xyz:2281

   # API URL
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

### Deploy Smart Contracts

Note: The contracts require Hardhat or a compatible tool for deployment. Since we had compatibility issues, you can use Remix IDE or Foundry as alternatives.

**Option 1: Using Remix IDE**

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Copy the contract code from `contracts/TapRaceToken.sol` and `contracts/GameContract.sol`
3. Compile with Solidity 0.8.20
4. Deploy to Base Sepolia network
5. Copy the deployed addresses to your `.env.local`

**Option 2: Manual Deployment Script**

If you have a deployment tool configured:
```bash
npm run deploy:testnet
```

### Run the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Connect your wallet**
   
   Click "Connect Wallet" and select your preferred wallet

4. **Get TAPRACE tokens**
   
   You'll need TAPRACE tokens to play. Contact the contract owner to mint tokens to your address.

## 🎯 How to Play

1. **Connect Wallet**: Connect your Web3 wallet to the Base Sepolia network
2. **Get Tokens**: Acquire TAPRACE tokens (contact admin for testnet tokens)
3. **Wait for Round**: A new 30-second round will start
4. **Approve Tokens**: First time playing, approve the game contract to spend your tokens
5. **Tap Away**: Click the TAP button as many times as you can in 30 seconds
6. **Win Prize**: The player with the most taps wins the entire pot!

## 🔐 Smart Contract Details

### TapRaceToken (ERC-20)
- **Name**: TapRace Token
- **Symbol**: TAPRACE
- **Decimals**: 18
- **Max Supply**: 100,000,000 tokens
- **Features**: Mintable, Burnable, Ownable

### GameContract
- **Round Duration**: 30 seconds
- **Tap Cost**: 0.03 TAPRACE tokens
- **Min Tap Interval**: 50ms (anti-cheat)
- **Features**: Round management, tap validation, winner selection, payout mechanism

## 📱 Farcaster Integration

The app includes Farcaster Frame integration at `/frame`. Users can:
- View current round status
- Check pot size
- Quick link to play the game

To test Frames:
1. Deploy your app to a public URL
2. Share the frame URL in Farcaster: `https://your-domain.com/frame`

## 🧪 Testing

### Smart Contract Tests

```bash
npm run test:contracts
```

Note: Contract tests require Hardhat. Due to version compatibility issues, tests may need to be adapted.

### Frontend Testing

Run the development server and manually test:
1. Wallet connection
2. Token approval
3. Tapping functionality
4. Leaderboard updates
5. Timer countdown

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting
- `npm run compile` - Compile smart contracts (requires Hardhat setup)
- `npm run deploy:testnet` - Deploy to Base Sepolia

### Environment Variables

See `.env.example` for all required environment variables.

## 🔒 Security Features

- **Rate Limiting**: Minimum 50ms between taps per user
- **Transaction Validation**: Each tap requires a valid blockchain transaction
- **Smart Contract Auditing**: Contracts use OpenZeppelin standards
- **Reentrancy Protection**: ReentrancyGuard on critical functions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Smart contracts use [OpenZeppelin](https://openzeppelin.com/)
- Web3 integration via [Wagmi](https://wagmi.sh/)
- Farcaster frames via [Frog](https://frog.fm/)
- Deployed on [Base](https://base.org/)

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

## 🚧 Roadmap

- [ ] Mainnet deployment
- [ ] Token distribution mechanism
- [ ] Tournament mode
- [ ] Social features (challenges, team play)
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] NFT rewards for winners

---

**Built with ❤️ for the Farcaster and Base communities**
