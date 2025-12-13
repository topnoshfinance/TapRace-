import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TapRace - Competitive Tapping on Base',
  description: 'Race to tap the most in 30 seconds! Winner takes the prize pool. Built on Base with Farcaster Frames.',
  openGraph: {
    title: 'TapRace - Competitive Tapping on Base',
    description: 'Race to tap the most in 30 seconds! Winner takes the prize pool.',
    images: ['/og-image.svg'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/frame/image`,
    'fc:frame:button:1': 'Start Game',
    'fc:frame:button:1:action': 'post',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/frame`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
