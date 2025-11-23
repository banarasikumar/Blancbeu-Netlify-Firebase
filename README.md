# Blancbeu - Premium Beauty & Wellness Salon

A luxurious, production-ready beauty salon website featuring a Flipkart-style multi-tab navigation system with professional appointments, notifications, and account management.

## Features

✨ **Multi-Tab Navigation** - Seamlessly switch between Home, Notifications, My Bookings, and Account pages  
🌙 **Light/Dark Theme** - Automatic time-based theme detection with user preference persistence  
📱 **PWA Ready** - Install as an app on mobile devices with offline support  
✂️ **Appointment Management** - View, reschedule, and manage beauty service bookings  
🔔 **Real-Time Notifications** - Stay updated with salon offers and rewards  
💎 **Premium Aesthetic** - 24k gold and sophisticated black theme throughout  

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (with CSS variables), ES6+ JavaScript
- **PWA**: Service Worker, Web App Manifest, Add-to-Home-Screen support
- **Server**: Node.js http-server
- **Fonts**: Cinzel (headings), Poppins (body)
- **Performance**: WebP images with PNG fallbacks, lazy loading, optimized caching

## Project Structure

```
/home/runner/workspace/
├── index.html           - Main entry point with all tab pages
├── styles.css           - Core styling with responsive design
├── theme-variables.css  - CSS variable definitions for light/dark themes
├── script.js            - Theme controller and tab management
├── fireworks.js         - Diwali fireworks animations
├── sw.js                - Service worker for PWA support
├── manifest.json        - PWA manifest
├── version.json         - Version tracking
├── assets/              - Optimized images (WebP + PNG)
├── attached_assets/     - Generated stock images for gallery/services
└── icon-*.{png,webp}    - App icons for all screen sizes
```

## Getting Started

The app is already running and ready to publish!

```bash
npm start  # or http-server -p 5000
```

Visit http://localhost:5000 to see the live app.

## Version

**v17.0.0** - Production Ready
- Full multi-tab navigation system
- All 4 pages fully functional
- Zero JavaScript errors
- PWA support enabled
- Light/Dark theme system working perfectly

## Deployment

Click the **Publish** button in Replit to deploy to production.

---

Built with ❤️ for BlancBeu Beauty Salon
