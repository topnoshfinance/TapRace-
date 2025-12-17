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
    // Farcaster Frame v2 metadata
    'fc:frame': 'vNext',
    'fc:frame:name': 'TapRace',
    'fc:frame:icon': `${baseUrl}/og-image.png`,
    'fc:frame:image': `${baseUrl}/api/frame/image`,
    'fc:frame:image:aspect_ratio': '1:1',
    'fc:frame:post_url': `${baseUrl}/api/frame`,
    'fc:frame:button:1': 'Start Game',
    'fc:frame:button:1:action': 'post',
    'fc:frame:button:2': 'Open Full App',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': baseUrl,
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
