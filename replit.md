# Blancbeu - Premium Beauty & Wellness Salon

## Overview
A truly luxurious beauty salon website with premium 24k gold and black theme, featuring stunning animations, interactive elements, and a magical user experience.

## Latest Update (October 3, 2025)
### Brand Identity Enhancement & Banner Carousel Redesign
- **Brand Name Styling**:
  - **"BLANCBEU"** now displayed in large, attractive uppercase (42px)
  - Premium gold gradient with shimmer animation
  - Prominent positioning with enhanced glow effects
  - **"Family Beauty Salon"** as smaller subtitle below (14px)
  - Clear visual hierarchy in header
- **Banner Carousel**:
  - NEW: 4 professional banner images in assets/banner_carousel_images/
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
├── index.html                  # Main HTML file with carousel
├── styles.css                  # Premium gold theme & animations
├── script.js                   # Carousel, music player, rose petals
├── manifest.json               # PWA configuration
├── sw.js                      # Service Worker
├── assets/
│   └── banner_carousel_images/ # Banner carousel images (4 images)
└── attached_assets/
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
✅ PWA support for mobile installation
✅ Customer reviews with star ratings
✅ Image gallery with hover overlays
✅ Well-organized asset folder structure

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
1. **Brand Name Shimmer**: Pulsing glow effect on BLANCBEU logo
2. **Sparkle Background**: Floating golden particles
3. **Carousel Auto-play**: Smooth fade transitions every 5 seconds
4. **Carousel Controls**: Circular transparent buttons with backdrop blur
5. **Contact Buttons**: SlideInUp animation with 0.1s, 0.2s, 0.3s delays
6. **Glow Animations**: Rotating gradient effects on offer cards
7. **Rose Petals**: Falling animation when music plays
8. **Shimmer Text**: Animated gold gradient on titles
9. **Hover Effects**: Scale and glow transformations
10. **Pulse & Bounce**: Icon animations on contact buttons
11. **Smooth Scrolling**: Navigation with easing
12. **Blurred Backgrounds**: Modern glassmorphism effects
