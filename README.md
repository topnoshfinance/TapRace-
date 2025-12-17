# ⚡ TapRace - Competitive Tapping on Base

TapRace is a social race mini app for Farcaster and Base where players compete to tap the screen as many times as possible in 30 seconds. Each tap costs 1 $TAP token, and the winner takes the entire prize pool!

> **Note**: The smart contracts have been updated to use TAP token payments. For full functionality, wallet integration is required to handle token approvals and on-chain transactions. The current frontend is a demo version.

## 🎮 Features

- **Competitive Tapping**: Race against others to tap the most in 30 seconds
- **Token-Gated**: Requires TapRace tokens to participate (encourages transfer volume)
- **Winner Takes All**: Highest score wins the entire prize pool
- **Base Network**: Built on Base for fast, cheap transactions
- **Farcaster Frames**: Playable directly in Farcaster feeds
- **Real-time Leaderboard**: Track your ranking and see top players
- **5-Minute Rounds**: New rounds start automatically

## 🔗 Supported Wallets

- ✅ **Coinbase Smart Wallet** (recommended for Base app users)
- ✅ **Farcaster Wallet** (via injected provider)
- ✅ **MetaMask**
- ✅ **Any injected wallet provider**

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Base network wallet (for deployment)
- Farcaster account (for testing frames)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/topnoshfinance/TapRace-.git
cd TapRace-
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_TOKEN_ADDRESS=your_token_address
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
TapRace-/
├── app/                      # Next.js 14 app directory
│   ├── api/                  # API routes
│   │   ├── frame/            # Farcaster Frame endpoints
│   │   ├── leaderboard/      # Leaderboard API
│   │   └── submit-score/     # Score submission API
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout with Frame metadata
│   └── page.tsx              # Main game page
├── components/               # React components
│   ├── TapButton.tsx         # Main tap button with effects
│   ├── GameStats.tsx         # Game statistics display
│   └── Leaderboard.tsx       # Leaderboard component
├── contracts/                # Smart contracts
│   └── TapRace.sol           # Main game contract and token
├── lib/                      # Utility functions
├── public/                   # Static assets
└── package.json              # Dependencies

```

## 📝 Smart Contracts

### TapRaceToken (ERC20)
- Token required to participate in games
- Encourages transfer volume and reputation building
- Initial supply: 1,000,000 tokens

### TapRaceGame
- Manages game rounds and prize pools
- Tracks player scores and contributions
- Handles winner determination and prize distribution
- Round duration: 5 minutes
- Tap cost: 1 TAP token per tap

## 🎯 How to Play

1. **Get Tokens**: Acquire TapRace tokens (minimum 100 tokens required)
2. **Join a Round**: Click "Start Game" when a round is active
3. **Tap Away**: Tap the button as many times as possible in 30 seconds
4. **Each Tap Costs**: 1 $TAP token per tap
5. **Multiple Games**: Play multiple 30-second games within each 5-minute prize round
6. **Winner Takes All**: Player with the most cumulative taps in the 5-minute round wins the entire prize pool
7. **Claim Prize**: Winners can withdraw their prize from the contract

## 🖼️ Farcaster Mini App Integration

TapRace is fully integrated with Farcaster Mini Apps, allowing users to play directly from their Farcaster feed:

1. Uses Farcaster Mini Apps 2025 standards with manifest file
2. Implements `@farcaster/miniapp-sdk` for proper initialization
3. Supports wallet integration via Farcaster providers
4. Signal app readiness with `sdk.actions.ready()`
5. Embeds seamlessly in Warpcast and other Farcaster clients
6. Link to full app for detailed leaderboard

## 🔗 Base Network Integration

TapRace is built on Base for:
- **Low Transaction Costs**: Affordable tap fees
- **Fast Confirmations**: Quick game rounds
- **Ethereum Security**: L2 security with Ethereum finality
- **Easy Onboarding**: Simple wallet setup for users

## 🛠️ Development

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Deploy Smart Contracts

1. Install Foundry or Hardhat
2. Configure deployment scripts
3. Deploy to Base testnet/mainnet:
```bash
forge create --rpc-url $BASE_RPC_URL --private-key $PRIVATE_KEY contracts/TapRace.sol:TapRaceToken
forge create --rpc-url $BASE_RPC_URL --private-key $PRIVATE_KEY contracts/TapRace.sol:TapRaceGame --constructor-args $TOKEN_ADDRESS
```

## 🔐 Security Considerations

- Smart contracts should be audited before mainnet deployment
- Rate limiting on API endpoints to prevent abuse
- Frame signature verification for Farcaster integration
- Proper handling of TAP token transfers and prize distributions
- Token balance checks before allowing participation
- Token approval checks for spending TAP tokens

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy with one click

### Other Platforms
- Railway
- Render
- AWS/GCP
- Self-hosted with PM2

## 📱 Testing on Farcaster

1. Deploy your app to a public URL
2. Ensure manifest is accessible at `https://your-url.com/.well-known/farcaster.json`
3. Create a cast with your app URL
4. Test the Mini App embed in Warpcast
5. Use [Warpcast Frame Validator](https://warpcast.com/~/developers/frames) for debugging
6. Verify that `sdk.actions.ready()` is called on app load

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Base Network](https://base.org)
- [Farcaster](https://farcaster.xyz)
- [Farcaster Mini Apps Documentation](https://miniapps.farcaster.xyz)
- [Manifest vs Embed Guide](https://miniapps.farcaster.xyz/docs/guides/manifest-vs-embed)

## 💡 Future Enhancements

- [ ] Tournament mode with multiple rounds
- [ ] NFT rewards for top players
- [ ] Team-based competitions
- [ ] Custom tap effects and skins
- [ ] Social sharing features
- [ ] Mobile app version
- [ ] Multi-chain support

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Join our Discord (coming soon)
- Follow us on Twitter (coming soon)

---

Built with ❤️ for the Base and Farcaster communities