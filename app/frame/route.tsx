/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog';
import { handle } from 'frog/next';

const app = new Frog({
  assetsPath: '/',
  basePath: '/frame',
  title: 'TapRace',
});

app.frame('/', (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(to right, #4a148c, #880e4f)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
            fontWeight: 'bold',
          }}
        >
          🏁 TapRace 🏁
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 30,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Tap to Win on Base!
        </div>
        <div
          style={{
            color: '#fbbf24',
            fontSize: 24,
            fontStyle: 'normal',
            marginTop: 20,
          }}
        >
          Each tap costs 0.03 TAPRACE • Winner takes all!
        </div>
      </div>
    ),
    intents: [
      <Button action="/status">Check Round</Button>,
      <Button.Link href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}`}>
        Play Now
      </Button.Link>,
    ],
  });
});

app.frame('/status', async (c) => {
  // Fetch current round status
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/round`);
  const data = await response.json();

  const { roundId, active, totalPot, endTime } = data;
  const timeLeft = active ? Math.max(0, Number(endTime) - Math.floor(Date.now() / 1000)) : 0;

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(to right, #4a148c, #880e4f)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 40,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          Round #{roundId}
        </div>
        <div
          style={{
            color: active ? '#4ade80' : '#ef4444',
            fontSize: 32,
            marginBottom: 20,
          }}
        >
          {active ? '🟢 ACTIVE' : '🔴 ENDED'}
        </div>
        <div
          style={{
            color: '#fbbf24',
            fontSize: 36,
            fontWeight: 'bold',
            marginBottom: 10,
          }}
        >
          Pot: {(Number(totalPot) / 1e18).toFixed(2)} TAPRACE
        </div>
        {active && (
          <div
            style={{
              color: 'white',
              fontSize: 28,
            }}
          >
            Time Left: {timeLeft}s
          </div>
        )}
      </div>
    ),
    intents: [
      <Button action="/status">Refresh</Button>,
      <Button.Link href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}`}>
        Play Now
      </Button.Link>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
