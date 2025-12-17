import './globals.css';
import type { Metadata } from 'next';
import { Web3Provider } from '@/src/components/Web3Provider';

export const metadata: Metadata = {
  title: 'TapRace - Competitive Tapping on Base',
  description: 'Race against others to tap the most in 30 seconds. Winner takes all!',
  openGraph: {
    title: 'TapRace - Competitive Tapping on Base',
    description: 'Race against others to tap the most in 30 seconds. Winner takes all!',
    images: [`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/og-image.png`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/og-image.png`,
    'fc:frame:image:aspect_ratio': '1:1',
    'fc:frame:button:1': 'Play TapRace',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
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
