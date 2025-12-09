# Quick Start: Deploy TapRace to Vercel for Testing

This guide will help you quickly deploy TapRace to Vercel for testing purposes.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com) - it's free)
- Your code pushed to GitHub repository

## Step-by-Step Deployment

### 1. Push Your Code to GitHub (if not already done)

```bash
# Make sure you're on the correct branch
git checkout copilot/build-social-race-mini-app

# Push to GitHub
git push origin copilot/build-social-race-mini-app
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub repository: `topnoshfinance/TapRace-`
5. Select the branch: `copilot/build-social-race-mini-app`

### 3. Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Add Environment Variables

Click **"Environment Variables"** and add these:

#### Required (Minimal for Testing)
```
NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app
```

> **Note**: After first deployment, Vercel will give you a URL. Come back and update this variable with your actual URL.

#### Optional (For Production Features)
```
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_TOKEN_ADDRESS=your_token_address_here
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_CHAIN_ID=8453
```

> **Note**: You can leave the contract addresses empty for initial testing. The frontend will work in demo mode.

### 5. Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. You'll get a deployment URL like: `https://taprace-abc123.vercel.app`

### 6. Update Environment Variable

1. Go to your Vercel project settings
2. Navigate to **"Settings"** → **"Environment Variables"**
3. Update `NEXT_PUBLIC_BASE_URL` with your actual deployment URL
4. Click **"Save"**
5. Go to **"Deployments"** → **"Redeploy"** to apply the change

### 7. Test Your Deployment

Visit your deployment URL and test:
- ✅ Page loads correctly
- ✅ Tap button works
- ✅ Timer functions
- ✅ Game stats display
- ✅ Leaderboard shows

## Testing on Farcaster (Optional)

1. Copy your Vercel deployment URL
2. Go to [Warpcast](https://warpcast.com)
3. Create a new cast with your URL
4. The Frame should display with game information
5. Test the Frame buttons

## Troubleshooting

### Build Fails

**Error**: `Module not found` or dependency errors

**Solution**: 
```bash
# Locally test the build
npm install
npm run build

# If successful, commit package-lock.json if needed
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Environment Variables Not Working

**Solution**: Make sure you added `NEXT_PUBLIC_` prefix to all variables that need to be accessible in the browser.

### Frame Not Showing in Farcaster

**Solution**: 
1. Check that your URL is publicly accessible
2. Verify Frame meta tags by viewing page source
3. Use [Warpcast Frame Validator](https://warpcast.com/~/developers/frames) to debug

### Page Shows "Configuration Error"

**Solution**: The app needs `NEXT_PUBLIC_BASE_URL` set. Update it in Vercel environment variables and redeploy.

## Next Steps After Testing

Once you've tested and are ready for production:

1. **Deploy Smart Contracts** to Base network (see DEPLOYMENT.md)
2. **Update Environment Variables** with actual contract addresses
3. **Custom Domain** (optional) - Add in Vercel settings
4. **Enable Analytics** - Vercel provides free analytics
5. **Monitor Performance** - Check Vercel dashboard

## Quick Commands Reference

```bash
# Test build locally before deploying
npm run build

# Test locally
npm run dev

# Check for errors
npm run lint
```

## Vercel CLI (Alternative Method)

If you prefer command-line deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Need Help?

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js on Vercel**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Farcaster Frames**: [docs.farcaster.xyz/learn/what-is-farcaster/frames](https://docs.farcaster.xyz/learn/what-is-farcaster/frames)

## Testing Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] URL updated in environment variables
- [ ] Redeployed with correct URL
- [ ] Game interface working
- [ ] Tested on mobile
- [ ] Farcaster Frame displaying (optional)

---

**Estimated Time**: 10-15 minutes for first deployment

**Cost**: $0 (Vercel free tier includes generous limits for testing)
