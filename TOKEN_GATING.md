# Token Gating Implementation

## Current Implementation (Temporary)

This application currently uses **tangyyoghurt creator coin** for token gating functionality. This is a temporary testing implementation.

### Token Details
- **Token Name**: tangyyoghurt creator coin
- **Contract Address**: `0x293b4308f55f7b9bdbea937bfe9c3ee50136e3b9`
- **Network**: Base Mainnet
- **Purpose**: Testing token gating functionality

### How It Works

The token gating system checks if users hold sufficient tokens before allowing them to play the game:

1. **Balance Check**: When a wallet connects, the app checks the user's token balance
2. **Minimum Requirement**: Users need at least 100 tokens to participate
3. **Real-time Display**: The UI shows the user's current token balance
4. **Access Control**: Users without sufficient tokens are prevented from starting the game

### Files Modified

- `.env.example` - Added tangyyoghurt token address as default
- `lib/config.ts` - Updated with token address and documentation
- `lib/token-abi.ts` - Standard ERC20 ABI for token interactions
- `lib/token-gating.ts` - Core token balance checking logic
- `app/page.tsx` - Integrated token checks into the game UI

### Key Functions

**`checkTokenBalance(address)`** in `lib/token-gating.ts`:
- Checks if a wallet address has sufficient tokens
- Returns balance information and eligibility status
- Handles errors gracefully

**`getTokenInfo()`** in `lib/token-gating.ts`:
- Retrieves token metadata (name, symbol, decimals)
- Useful for displaying token information in the UI

## Switching to $TAP Token

When the $TAP token is ready, follow these steps to switch:

### Step 1: Update Environment Variable

Update your `.env` file (or environment variables in deployment):

```env
NEXT_PUBLIC_TOKEN_ADDRESS=<NEW_TAP_TOKEN_ADDRESS>
```

### Step 2: Verify Token Decimals

Check if the new token has the same decimals as the current one:

1. The current implementation auto-detects decimals
2. If decimals differ significantly, you may need to adjust `MIN_TOKEN_BALANCE` in `lib/config.ts`

### Step 3: Update Documentation

Remove or update the "TEMPORARY" comments in:
- `lib/config.ts` (lines 18-20)
- `lib/token-gating.ts` (lines 7-21)
- `.env.example` (line 6)

### Step 4: Test Thoroughly

Before deploying to production:

1. Test wallet connection with new token
2. Verify balance checks work correctly
3. Test with accounts that have/don't have sufficient tokens
4. Check error handling

### Step 5: Deploy

Once tested:
1. Update environment variables in your hosting platform (Vercel, etc.)
2. Deploy the changes
3. Verify in production

## Development

### Testing Locally

1. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

2. Run the development server:
```bash
npm run dev
```

3. Connect a wallet that has tangyyoghurt tokens to test

### Building for Production

```bash
npm run build
npm start
```

## Technical Details

### Technology Stack
- **wagmi**: Ethereum library for React
- **viem**: TypeScript library for Ethereum
- **Next.js**: React framework
- **RainbowKit**: Wallet connection UI

### Token Standard
- ERC20 compliant token
- Standard functions: `balanceOf`, `decimals`, `symbol`, `name`

### Network
- Base Mainnet (Chain ID: 8453)
- RPC: https://mainnet.base.org

## Troubleshooting

### "No address provided" error
- User needs to connect their wallet first
- Check if wallet connection is working properly

### "Token address not configured" error
- Verify `NEXT_PUBLIC_TOKEN_ADDRESS` is set in environment variables
- Check the token address is a valid Ethereum address

### Balance shows as 0 but user has tokens
- Verify the correct network is connected (Base Mainnet)
- Check the token contract address is correct
- Ensure wallet is on the Base network

### Build errors
- Run `npm install` to ensure dependencies are installed
- Check TypeScript types are correct
- Verify all imports are correct

## Security Notes

⚠️ **Important**: This is a frontend-only token gate. For production:
- Backend validation should also check token balances
- Smart contract integration should verify token ownership on-chain
- Consider rate limiting and anti-abuse measures

## Support

For issues or questions:
- Check the main [README.md](./README.md)
- Review the smart contracts in `contracts/TapRace.sol`
- Open an issue on GitHub
