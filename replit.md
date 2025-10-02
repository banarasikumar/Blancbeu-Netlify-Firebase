# Blancbeu - Premium Beauty & Wellness Salon

## Overview
A truly luxurious beauty salon website with premium 24k gold and black theme, featuring stunning animations, interactive elements, and a magical user experience.

## Latest Update (October 2, 2025)
### Complete Premium Redesign
- **Premium Theme**: True 24k gold (#FFD700) on deep black color scheme
- **Hero Carousel**: 4 beautiful banner images with auto-play and smooth transitions
- **Iconic Contact Buttons**: 
  - 📍 Locate Our Salon (pink gradient)
  - 💬 Chat on WhatsApp (green gradient)
  - 📞 Call +91 92299 15277 (gold border)
- **Special Offers**:
  - All haircuts @ ₹99 (limited time)
  - Durga Puja festive special (up to 50% off)
  - College student discount (25% off with valid ID)
  - Glow effects with CSS animations (no borders)
- **Interactive Features**:
  - 🎉✨ "Surprise me" button plays Sundari song
  - 🌹 Rose petal rain animation when music plays
  - ✨ Sparkling particle effects throughout
- **8 Service Categories** with images:
  1. Hair cutting (✂️) - All cuts at ₹99
  2. Clean up (✨)
  3. Facial (💆)
  4. Hairs & Treatment (💇)
  5. Premium services (👑)
  6. Hair colour (🎨)
  7. Makeup & Styling (💄)
  8. Nails & Beauty (💅)
- **Gallery**: 4 stunning transformation images with hover effects
- **Customer Reviews**: Real Google Maps testimonials with star ratings
- **Footer**: Updated to 2025

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
✅ Auto-playing carousel with 4 banner images
✅ Manual carousel navigation (arrows & dots)
✅ Premium iconic contact buttons
✅ Sparkling particle background effects
✅ Glow animations on offer cards
✅ 8 categorized service groups with images
✅ Expanded services list (60+ services)
✅ Music player with "Surprise me" button
✅ Rose petal falling animation
✅ Smooth transitions throughout
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

## Special Effects
1. **Sparkle Background**: Floating golden particles
2. **Carousel Auto-play**: Changes every 5 seconds
3. **Glow Animations**: Rotating gradient effects on offer cards
4. **Rose Petals**: Falling animation when music plays
5. **Shimmer Text**: Animated gold gradient on titles
6. **Hover Effects**: Scale and glow transformations
7. **Smooth Scrolling**: Navigation with easing
