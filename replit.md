# Blancbeu - Premium Beauty & Wellness Salon

## Overview
A truly luxurious beauty salon website with premium 24k gold and black theme, featuring stunning animations, interactive elements, and a magical user experience.

## Latest Update (October 3, 2025)
### Enhanced UI & Mobile Optimization
- **Surprise Me Button**: 
  - Relocated to bottom-left corner (no longer blocks brand name)
  - Smaller, stylish design (13px font, compact padding)
  - Blurred transparent background with backdrop-filter effect
  - Smooth pulse animation
- **Carousel Navigation**:
  - Smaller circular buttons (40px diameter)
  - Transparent with backdrop blur
  - Improved hover effects with scale animation
  - 5 stunning beauty model images (upgraded from 4)
- **Service Categories**: 
  - Images now display BELOW titles (centered layout)
  - Larger showcase images (600px x 300px)
  - Flex-direction column layout for better visual hierarchy
  - Enhanced gold border and shadow effects
- **Contact Buttons**:
  - Optimized for smartphone screens (max-width 350px)
  - Smaller, more elegant sizing (14px padding)
  - SlideInUp CSS animations with staggered delays
  - Enhanced hover effects (scale + translateY)
  - Animated icons with pulse and bounce effects
- **Previous Features** (October 2, 2025):
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
└── attached_assets/
    ├── stock_images/          # Beauty service & carousel images
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
✅ Auto-playing carousel with 5 stunning beauty model images
✅ Small transparent carousel navigation buttons
✅ Bottom-left "Surprise me" button with blurred background
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
1. **Sparkle Background**: Floating golden particles
2. **Carousel Auto-play**: Changes every 5 seconds
3. **Carousel Controls**: Circular transparent buttons with backdrop blur
4. **Contact Buttons**: SlideInUp animation with 0.1s, 0.2s, 0.3s delays
5. **Glow Animations**: Rotating gradient effects on offer cards
6. **Rose Petals**: Falling animation when music plays
7. **Shimmer Text**: Animated gold gradient on titles
8. **Hover Effects**: Scale and glow transformations
9. **Pulse & Bounce**: Icon animations on contact buttons
10. **Smooth Scrolling**: Navigation with easing
11. **Blurred Backgrounds**: Modern glassmorphism effects
