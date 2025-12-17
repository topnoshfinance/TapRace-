'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'taprace_add_prompt_dismissed';
const SHOW_DELAY_MS = 2000; // Show prompt after 2 seconds

export default function AddToFarcasterPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if prompt was previously dismissed
    const isDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    
    if (!isDismissed) {
      // Show the prompt after a delay
      const timer = setTimeout(() => {
        setShouldShow(true);
        // Trigger fade-in animation
        setTimeout(() => setIsVisible(true), 50);
      }, SHOW_DELAY_MS);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAddToApps = () => {
    // Try to use Farcaster SDK if available
    if (typeof window !== 'undefined') {
      try {
        // Call Farcaster SDK method to add to apps
        // This is placeholder - actual implementation depends on Farcaster SDK
        const farcasterSDK = (window as { farcaster?: { addToApps?: () => void } }).farcaster;
        farcasterSDK?.addToApps?.();
      } catch (error) {
        console.error('Error adding to Farcaster apps:', error);
      }
    }
    
    // For now, provide instructions or open relevant page
    alert('To add TapRace to your Farcaster apps:\n\n1. Open TapRace in Farcaster/Warpcast\n2. Tap the menu (⋯)\n3. Select "Add to Home Screen" or "Add to Apps"\n\nThis will give you quick access to TapRace anytime!');
    
    handleDismiss();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for fade-out animation before hiding
    setTimeout(() => {
      setShouldShow(false);
      localStorage.setItem(STORAGE_KEY, 'true');
    }, 300);
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50
        transition-all duration-300 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
    >
      <div className="mx-4 mb-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Gradient border effect */}
        <div className="bg-gradient-to-r from-base-blue to-farcaster-purple p-[2px]">
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 text-3xl">
                ⚡
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-lg mb-1">
                  Add TapRace to Your Apps
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Get quick access to TapRace anytime from your Farcaster apps collection!
                </p>
                
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleAddToApps}
                    className="
                      flex-1 bg-gradient-to-r from-base-blue to-farcaster-purple
                      text-white px-4 py-2.5 rounded-xl font-semibold
                      hover:shadow-lg transform hover:scale-[1.02]
                      transition-all duration-200
                      active:scale-95
                    "
                  >
                    📱 Add to Apps
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="
                      flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-semibold
                      hover:bg-gray-200 transition-colors duration-200
                      active:scale-95
                    "
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="
                  flex-shrink-0 w-8 h-8 rounded-full
                  flex items-center justify-center
                  text-gray-400 hover:text-gray-600 hover:bg-gray-100
                  transition-colors duration-200
                "
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
