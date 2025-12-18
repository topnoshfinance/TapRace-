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
    images: [`${baseUrl}/og-image.png`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/og-image.png`,
    'fc:frame:button:1': 'Play Now',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': baseUrl,
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
