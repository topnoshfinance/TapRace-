export function isInFarcasterFrame(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for Farcaster frame context
  const ancestorOrigin = window.location.ancestorOrigins?.[0];
  const isWarpcastOrigin = ancestorOrigin ? 
    new URL(ancestorOrigin).hostname === 'warpcast.com' || 
    new URL(ancestorOrigin).hostname.endsWith('.warpcast.com') : false;
  
  return (
    window.parent !== window.self || // Running in iframe
    /farcaster/i.test(navigator.userAgent) ||
    isWarpcastOrigin
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
