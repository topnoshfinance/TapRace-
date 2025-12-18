# TapRace Image Assets

## Required Files

The following image files are required for proper Farcaster Mini App embedding:

### 1. `icon.png` (Required)
- **Purpose**: App icon displayed in Farcaster/Warpcast
- **Recommended Size**: 512x512px (square)
- **Format**: PNG with transparency
- **Content**: TapRace logo or ⚡ lightning bolt icon
- **Location**: `/public/icon.png`

### 2. `og-image.png` (Required)
- **Purpose**: Social preview image and Mini App preview
- **Recommended Size**: 1200x630px (Open Graph standard)
- **Format**: PNG or JPG
- **Content**: TapRace branding with game preview
- **Location**: `/public/og-image.png`

### 3. `splash.png` (Required)
- **Purpose**: Loading screen when Mini App is launching
- **Recommended Size**: 1080x1920px (mobile portrait)
- **Format**: PNG or JPG
- **Content**: TapRace splash screen with branding
- **Background**: Should complement `splashBackgroundColor` (#0052FF)
- **Location**: `/public/splash.png`

## Quick Creation Tips

### For icon.png:
- Use a simple, recognizable symbol (⚡ lightning bolt recommended)
- Ensure it's visible at small sizes (as small as 32x32px)
- Transparent background works best

### For og-image.png:
- Include "TapRace" text prominently
- Add tagline: "Competitive Tapping on Base"
- Use Base blue (#0052FF) and Farcaster purple (#8465CB) colors
- Show a visual hint of the tapping gameplay

### For splash.png:
- Center the TapRace logo
- Add loading indicator or animation hint
- Use gradient from Base blue to Farcaster purple
- Keep text minimal

## Tools for Creating Assets

- **Figma**: Professional design tool (free tier available)
- **Canva**: Easy templates and quick creation
- **DALL-E/Midjourney**: AI-generated graphics
- **Photopea**: Free Photoshop alternative (online)

## Verification

After adding these files, verify they're accessible:
- https://tap-race.vercel.app/icon.png
- https://tap-race.vercel.app/og-image.png
- https://tap-race.vercel.app/splash.png

All URLs should return 200 OK status and display the image.
