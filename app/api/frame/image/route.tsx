import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get('state') || 'idle';

  try {
    // Generate different images based on state
    if (state === 'playing') {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0052FF',
              backgroundImage: 'linear-gradient(135deg, #0052FF 0%, #8465CB 100%)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 120, marginBottom: 20 }}>⚡</div>
              <div style={{ fontSize: 72, fontWeight: 'bold', color: 'white' }}>
                TapRace
              </div>
              <div style={{ fontSize: 48, color: 'white', opacity: 0.9, marginTop: 20 }}>
                Tap to Play!
              </div>
              <div style={{ fontSize: 32, color: 'white', opacity: 0.8, marginTop: 20 }}>
                Each tap: 1 $TAP • Winner takes all! 🏆
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    } else if (state === 'results') {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0052FF',
              backgroundImage: 'linear-gradient(135deg, #0052FF 0%, #8465CB 100%)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 120, marginBottom: 20 }}>🏆</div>
              <div style={{ fontSize: 72, fontWeight: 'bold', color: 'white' }}>
                Round Complete!
              </div>
              <div style={{ fontSize: 48, color: 'white', opacity: 0.9, marginTop: 20 }}>
                Check the leaderboard
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    } else if (state === 'error') {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#EF4444',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 120, marginBottom: 20 }}>⚠️</div>
              <div style={{ fontSize: 72, fontWeight: 'bold', color: 'white' }}>
                Oops!
              </div>
              <div style={{ fontSize: 48, color: 'white', opacity: 0.9, marginTop: 20 }}>
                Something went wrong
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // Default idle state
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0052FF',
            backgroundImage: 'linear-gradient(135deg, #0052FF 0%, #8465CB 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 120, marginBottom: 20 }}>⚡</div>
            <div style={{ fontSize: 80, fontWeight: 'bold', color: 'white' }}>
              TapRace
            </div>
            <div style={{ fontSize: 40, color: 'white', opacity: 0.9, marginTop: 20 }}>
              Competitive Tapping on Base
            </div>
            <div style={{ fontSize: 32, color: 'white', opacity: 0.8, marginTop: 20 }}>
              Tap faster, win bigger! 🏆
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
