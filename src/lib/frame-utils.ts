export function isInFarcasterFrame(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for Farcaster frame context
  try {
    const ancestorOrigin = window.location.ancestorOrigins?.[0];
    if (ancestorOrigin) {
      const url = new URL(ancestorOrigin);
      const isWarpcastOrigin = url.hostname === 'warpcast.com' || url.hostname.endsWith('.warpcast.com');
      if (isWarpcastOrigin) return true;
    }
  } catch {
    // Invalid URL, continue to other checks
  }
  
  // Check for Farcaster in user agent
  if (/farcaster/i.test(navigator.userAgent)) return true;
  
  return false;
}

export function getFarcasterFrameContext() {
  // Extract Farcaster frame context (fid, wallet address, etc.)
  // This will be populated by the frame's postMessage
  return {
    fid: null, // Farcaster ID
    address: null, // Connected wallet
  }
}
