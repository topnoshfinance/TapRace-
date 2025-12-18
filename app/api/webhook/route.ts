import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Handle Farcaster Mini App webhooks
  const data = await request.json();
  
  console.log('Webhook received:', data);
  
  return NextResponse.json({ success: true });
}
