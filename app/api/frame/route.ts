import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData } = body;
    
    // In production, verify the frame signature
    // const { isValid } = await validateFrameSignature(body);
    
    const buttonIndex = untrustedData?.buttonIndex || 1;
    // const fid = untrustedData?.fid; // For future use with user identification

    // Generate game start response
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (buttonIndex === 1) {
      // Start game button pressed - show playing state
      return NextResponse.json({
        version: 'vNext',
        image: `${baseUrl}/api/frame/image?state=playing`,
        postUrl: `${baseUrl}/api/frame`,
        buttons: [
          {
            label: 'View Results',
            action: 'post',
          },
          {
            label: 'Open Full App',
            action: 'link',
            target: `${baseUrl}`,
          },
        ],
      });
    } else if (buttonIndex === 2) {
      // View results button pressed or coming from "Open Full App" shouldn't happen in POST
      // This handles "View Results" from playing state
      return NextResponse.json({
        version: 'vNext',
        image: `${baseUrl}/api/frame/image?state=results`,
        postUrl: `${baseUrl}/api/frame`,
        buttons: [
          {
            label: 'Play Again',
            action: 'post',
          },
          {
            label: 'Open Full App',
            action: 'link',
            target: baseUrl,
          },
        ],
      });
    }

    // Default response - initial state or "Play Again"
    return NextResponse.json({
      version: 'vNext',
      image: `${baseUrl}/api/frame/image`,
      postUrl: `${baseUrl}/api/frame`,
      buttons: [
        {
          label: 'Start Game',
          action: 'post',
        },
        {
          label: 'Open Full App',
          action: 'link',
          target: baseUrl,
        },
      ],
    });
  } catch (error) {
    console.error('Frame error:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    return NextResponse.json({
      version: 'vNext',
      image: `${baseUrl}/api/frame/image?state=error`,
      postUrl: `${baseUrl}/api/frame`,
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
    postUrl: `${baseUrl}/api/frame`,
    buttons: [
      {
        label: 'Start Game',
        action: 'post',
      },
      {
        label: 'Open Full App',
        action: 'link',
        target: baseUrl,
      },
    ],
  });
}
