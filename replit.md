# Blancbeu - Premium Beauty & Wellness Salon

## Overview
A truly luxurious beauty salon website with premium 24k gold and black theme, featuring stunning animations, interactive elements, native app-like experience, and a magical user experience.

## Latest Update (November 11, 2025)
### iOS-Style Bottom Navigation Bar
- **Native App Experience**:
  - Beautiful bottom navigation bar with iOS-style glassmorphism
  - Modern touch-optimized design with 5 navigation items
  - Smooth hide/show behavior on scroll (hides when scrolling down, shows when scrolling up)
- **Design Features**:
  - Glassmorphism effect with 20px backdrop blur and semi-transparent background
  - Golden active state with gradient background and shadow effects
  - Safe-area inset support for iPhone X+ devices
  - Clean SVG icons for Home, Bookings, Chat, Notifications, Profile
  - Smooth cubic-bezier transitions for premium feel
- **Technical Implementation**:
  - Throttled scroll listener using requestAnimationFrame for optimal performance
  - Scrollspy logic for automatic active state based on scroll position
  - Hash change handling for proper navigation state
  - Z-index 999 for proper layering above content
  - Body padding (80px + safe-area-inset) to prevent content overlap
- **Fireworks Enhancement**:
  - Touch/click firework launching disabled for better UX
  - Fireworks now purely decorative overlay
- **Service Worker Fixes**:
  - Updated carousel image cache from .png to .webp
  - Fixed cache activation to preserve current cache and only delete old versions
  - Proper offline support maintained

### Previous Update (October 20, 2025)
### Brand Asset Refresh & Banner Carousel Expansion
- **Updated App Icons & Splash Screens**:
  - New brand logo icons in multiple sizes (72x72, 96x96, 144x144, 192x192, 512x512)
  - New splash screen images (750x1334, 1170x2532)
  - Created from user-provided app_icon.png and app_splash_screen.png
  - Optimized with ImageMagick at 90% quality
- **New Homepage Logo**:
  - Replaced text logo with actual brand image (assets/homepage_brand_logo.png)
  - Seamless dark gradient background (#1a1a1a to #0a0a0a)
  - 20px border radius with golden glow effects
  - Responsive sizing: 60px (desktop), 40px (mobile)
  - Hover animations with transform and enhanced glow
- **Expanded Banner Carousel (4 → 6 slides)**:
  - NEW: 6 professional square banner images (1024x1024px)
  - Optimized carousel dimensions: 800x800px (desktop), 600x600px (tablet), 400px (mobile)
  - Changed object-fit to 'contain' for proper square image display
  - Radial gradient background for seamless appearance
  - All 6 banners load correctly (banner1.png through banner6.png)
- **Theme Color Updated to Black**:
  - Mobile address bar now shows black (#000000) instead of gold
  - Updated in manifest.json and HTML meta tags
  - Professional appearance on all devices
- **Service Worker Cache Optimized**:
  - Cache version bumped to v3 for asset refresh
  - Removed non-existent /static/* paths (eliminated 404 errors)
  - Added correct project assets to cache list
  - Aggressive cache clearing with skipWaiting and clients.claim()
- **Cross-Browser Install Prompt** (existing):
  - Chrome/Edge: Native install prompt with golden install button
  - Safari/iOS: Custom install button with step-by-step instructions
  - Firefox: Browser-specific installation guidance
  - Smart detection to prevent duplicate prompts
- **Seamless Splash Screen** (existing):
  - Burgundy/maroon background (#4a2332) matching splash image
  - Blur effects for professional appearance
  - Auto-displays in standalone mode
  - Auto-hides after 2.5 seconds
- **Standalone Mode Detection** (existing):
  - Detects when app is running as installed PWA
  - Consistent session storage tracking
  - Works on iOS, Android, and desktop

### Previous Update (October 19, 2025)
#### Diwali Fireworks Animation Integration
- **Transparent Fireworks Overlay**:
  - Fireworks display on top of website content with full transparency
  - No opaque black background blocking website elements
  - Pointer-events disabled to allow full website interaction
  - Fixed 60% speed for smooth, consistent animations
- **Sound & Effects**:
  - Continuous sound playback at 60% speed (no more stopping)
  - Removed swipe/drag speed control (fixed speed only)
  - Sky lighting disabled for complete transparency
  - Multiple firework types with sound effects
- **Technical Implementation**:
  - Canvas backgrounds set to transparent
  - Sky lighting mode: NONE (no background illumination)
  - Speed locked at 0.6 (60%) - no user adjustment
  - All controls hidden for clean overlay effect

### Previous Update (October 3, 2025)
#### Brand Identity Enhancement & Banner Carousel Redesign
- **Brand Name Styling**:
  - **"BLANCBEU"** now displayed in large, attractive uppercase (42px)
  - Premium gold gradient with shimmer animation
  - Prominent positioning with enhanced glow effects
  - **"Family Beauty Salon"** as smaller subtitle below (14px)
  - Clear visual hierarchy in header
- **Banner Carousel** (updated to 6 images):
  - 6 professional square banner images (1024x1024px) in assets/banner_carousel_images/
  - Properly positioned below brand header (no overlap)
  - Clean layout without text overlays
  - Smooth fade transitions between slides
  - All carousel images load correctly (no empty slides)
- **Folder Structure**:
  - Organized asset management with assets/banner_carousel_images/
  - Clean separation of banner and service images
- **Previous Features** (October 2, 2025):
  - Surprise Me button with blurred background
  - Transparent carousel navigation buttons
  - Smartphone-optimized contact buttons with animations
  - Service categories with images below titles
  - Premium 24k gold theme on deep black background
  - 8 service categories with 60+ services
  - Special offers with glow animations
  - Rose petal rain with background music
  - Customer reviews and gallery
  - PWA support

## Project Architecture
### Tech Stack
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Server**: http-server (Node.js)
- **PWA**: Service Worker for offline capability
- **Fonts**: Cinzel (luxury headings), Poppins (body text)
- **Audio**: Background music player with Sundari song

### File Structure
```
├── index.html                  # Main HTML file with carousel & fireworks
├── styles.css                  # Premium gold theme & animations
├── fireworks.css               # Fireworks overlay styles
├── fireworks.js                # Fireworks animation engine
├── script.js                   # Carousel, music player, rose petals
├── manifest.json               # PWA configuration
├── sw.js                      # Service Worker
├── assets/
│   └── banner_carousel_images/ # Banner carousel images (4 images)
└── attached_assets/
    ├── diwali_animation/      # Fireworks source files
    ├── stock_images/          # Beauty service images
    └── SpotiDownloader.com... # Sundari background music
```

### Color Palette
**24k Gold Premium Theme**:
- Primary Gold: #FFD700
- Bright Gold: #FFC700
- Dark Gold: #B8860B
- Light Gold: #FFED4E
- Deep Black: #0a0a0a
- Pure Black: #000000
- Pink Rose: #FFB6C1
- WhatsApp Green: #25D366

## Features
✅ **Full PWA Support**: Cross-browser install prompts for Chrome, Safari, Firefox, Edge
✅ **Custom Brand Icons**: Professional app icons in 5 sizes with golden beauty logo
✅ **Seamless Splash Screen**: Burgundy background with blur effects and auto-hide
✅ **Standalone Mode**: Detects and adapts when running as installed app
✅ **Golden Install Button**: Animated install prompt with bounce effect
✅ **Diwali Fireworks**: Transparent overlay with continuous sound at 60% speed
✅ Large, attractive brand name "BLANCBEU" with shimmer animation
✅ Clear brand hierarchy with "Family Beauty Salon" subtitle
✅ Auto-playing banner carousel with 4 professional beauty images
✅ Clean carousel layout below header (no overlap)
✅ Small transparent carousel navigation buttons
✅ Bottom-right "Surprise me" button with blurred background
✅ Smartphone-optimized contact buttons with animations
✅ Service categories with large images below titles (600x300px)
✅ Sparkling particle background effects
✅ Glow animations on offer cards
✅ 8 categorized service groups with 60+ services
✅ Music player with rose petal rain animation
✅ Smooth slideInUp animations with staggered delays
✅ Enhanced hover effects throughout
✅ Responsive design for all devices
✅ Customer reviews with star ratings
✅ Image gallery with hover overlays
✅ Well-organized asset folder structure
✅ Click-through fireworks (website fully interactive underneath)

## Contact Information
- Phone: +91 92299 15277
- WhatsApp: https://wa.me/919229915277
- Location: Google Maps integration

## Development
Run locally:
```bash
npx http-server . -p 5000 -a 0.0.0.0 --cors -c-1
```

Visit: http://localhost:5000

## Special Effects & Animations
1. **Diwali Fireworks**: Transparent overlay with multi-color explosions, trails, and sound
2. **Brand Name Shimmer**: Pulsing glow effect on BLANCBEU logo
3. **Sparkle Background**: Floating golden particles
4. **Carousel Auto-play**: Smooth fade transitions every 5 seconds
5. **Carousel Controls**: Circular transparent buttons with backdrop blur
6. **Contact Buttons**: SlideInUp animation with 0.1s, 0.2s, 0.3s delays
7. **Glow Animations**: Rotating gradient effects on offer cards
8. **Rose Petals**: Falling animation when music plays
9. **Shimmer Text**: Animated gold gradient on titles
10. **Hover Effects**: Scale and glow transformations
11. **Pulse & Bounce**: Icon animations on contact buttons
12. **Smooth Scrolling**: Navigation with easing
13. **Blurred Backgrounds**: Modern glassmorphism effects

## Fireworks Configuration
- **Speed**: Fixed at 60% (0.6) - optimized for smooth performance
- **Transparency**: Full transparent background - fireworks only, no dark overlay
- **Interaction**: Click-through enabled - website remains fully functional
- **Sound**: Continuous playback with explosion and launch sounds
- **Controls**: All UI controls hidden for clean visual presentation
