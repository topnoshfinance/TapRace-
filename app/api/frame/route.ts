import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData } = body;
    
    // In production, verify the frame signature
    // const { isValid } = await validateFrameSignature(body);
    
    const buttonIndex = untrustedData?.buttonIndex || 1;
    const fid = untrustedData?.fid;

    // Generate game start response
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (buttonIndex === 1) {
      // Start game button pressed
      return NextResponse.json({
        version: 'vNext',
        image: `${baseUrl}/api/frame/image?state=playing`,
        buttons: [
          {
            label: 'Tap! (3¢)',
            action: 'post',
          },
          {
            label: 'View Results',
            action: 'post',
          },
        ],
      });
    } else if (buttonIndex === 2) {
      // View results button pressed
      return NextResponse.json({
        version: 'vNext',
        image: `${baseUrl}/api/frame/image?state=results`,
        buttons: [
          {
            label: 'Play Again',
            action: 'post',
          },
          {
            label: 'Open App',
            action: 'link',
            target: baseUrl,
          },
        ],
      });
    }

    // Default response
    return NextResponse.json({
      version: 'vNext',
      image: `${baseUrl}/api/frame/image`,
      buttons: [
        {
          label: 'Start Game',
          action: 'post',
        },
      ],
    });
  } catch (error) {
    console.error('Frame error:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    return NextResponse.json({
      version: 'vNext',
      image: `${baseUrl}/api/frame/image?state=error`,
      buttons: [
        {
          label: 'Try Again',
          action: 'post',
        },
      ],
    });
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return NextResponse.json({
    version: 'vNext',
    image: `${baseUrl}/api/frame/image`,
    buttons: [
      {
        label: 'Start Game',
        action: 'post',
      },
    ],
  });
}
