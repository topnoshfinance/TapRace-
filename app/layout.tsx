import './globals.css';
import type { Metadata } from 'next';
import { Web3Provider } from '@/src/components/Web3Provider';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'TapRace - Competitive Tapping on Base',
  description: 'Race against others to tap the most in 30 seconds. Winner takes all!',
  openGraph: {
    title: 'TapRace - Competitive Tapping on Base',
    description: 'Race against others to tap the most in 30 seconds. Winner takes all!',
    images: [`${baseUrl}/api/frame/image`],
  },
  other: {
    // Farcaster Mini App embed metadata (NEW FORMAT)
    'fc:miniapp:title': 'TapRace',
    'fc:miniapp:icon': `${baseUrl}/og-image.png`,
    'fc:miniapp:url': baseUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
