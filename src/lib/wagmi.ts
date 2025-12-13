import { createConfig, http } from 'wagmi'
import { base, baseGoerli } from 'wagmi/chains'
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, baseGoerli],
  connectors: [
    // Coinbase Smart Wallet (for Base app)
    coinbaseWallet({
      appName: 'TapRace',
      preference: 'smartWalletOnly', // Prioritize Smart Wallet
    }),
    
    // WalletConnect (for Farcaster and mobile wallets)
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
      metadata: {
        name: 'TapRace',
        description: 'Competitive tapping game on Base',
        url: 'https://taprace.app',
        icons: ['https://taprace.app/icon.png']
      },
      showQrModal: true,
    }),
    
    // Injected wallets (MetaMask, etc.)
    injected(),
  ],
  transports: {
    [base.id]: http(),
    [baseGoerli.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
