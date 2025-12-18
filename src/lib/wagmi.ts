import { createConfig, http } from 'wagmi'
import { base, baseGoerli } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, baseGoerli],
  connectors: [
    // Coinbase Smart Wallet (for Base app users)
    coinbaseWallet({
      appName: 'TapRace',
      preference: 'smartWalletOnly', // Prioritize Smart Wallet
    }),
    
    // Injected wallets (Farcaster mobile browser, Coinbase Wallet, etc.)
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
