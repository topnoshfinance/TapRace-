export function isInFarcasterFrame(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for Farcaster frame context
  return (
    window.parent !== window.self || // Running in iframe
    /farcaster/i.test(navigator.userAgent) ||
    window.location.ancestorOrigins?.[0]?.includes('warpcast.com')
  )
}

export function getFarcasterFrameContext() {
  // Extract Farcaster frame context (fid, wallet address, etc.)
  // This will be populated by the frame's postMessage
  return {
    fid: null, // Farcaster ID
    address: null, // Connected wallet
  }
}
