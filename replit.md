# Blancbeu - Premium Beauty & Wellness Salon

## Overview
A premium beauty salon website with a luxurious black and gold theme, featuring modern animations and responsive design.

## Recent Changes (October 2, 2025)
### Complete Redesign
- **Theme**: Premium black and gold color scheme with dark mode by default
- **Theme Toggle**: Light/dark mode toggle button in top-right corner
- **Hero Section**: Elegant typography with gradient gold text
- **Special Offers**: 
  - All haircuts starting at ₹99 (limited time)
  - Durga Puja festive special (up to 50% off)
  - College student discount (25% off with valid ID)
- **Gallery**: Showcase of beauty services with hover effects
- **Services**: Categorized and prioritized services with updated pricing
- **Reviews**: Customer testimonials from Google Maps
- **Footer**: Updated to 2025

## Project Architecture
### Tech Stack
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Server**: http-server (Node.js)
- **PWA**: Service Worker for offline capability
- **Fonts**: Playfair Display (headings), Poppins (body)

### File Structure
```
├── index.html          # Main HTML file
├── styles.css          # All styling and themes
├── script.js           # Dynamic content rendering
├── manifest.json       # PWA configuration
├── sw.js              # Service Worker
└── attached_assets/stock_images/  # Beauty service images
```

### Services Categories (Priority Order)
1. Hair cutting (✂️) - All cuts at ₹99
2. Clean up (✨)
3. Facial (💆)
4. Hairs & Treatment (💇)
5. Premium services (👑)
6. Hair colour (🎨)

### Color Scheme
**Dark Theme (Default)**:
- Background: #000000
- Secondary: #1a1a1a
- Gold Accent: #D4AF37
- Text: #ffffff

**Light Theme**:
- Background: #ffffff
- Secondary: #f8f8f8
- Gold Accent: #B8941F
- Text: #1a1a1a

## Features
- ✅ Responsive design for mobile and desktop
- ✅ Smooth scrolling navigation
- ✅ CSS animations on offer cards
- ✅ Image hover effects in gallery
- ✅ Theme persistence (localStorage)
- ✅ PWA support for mobile installation
- ✅ Dark/Light theme toggle

## Contact Information
- Phone: +91 92299 15277
- WhatsApp: Available
- Location: Quick booking and directions available on site

## Development
Run locally:
```bash
npm install http-server
npx http-server . -p 5000 -a 0.0.0.0 --cors -c-1
```

Visit: http://localhost:5000
