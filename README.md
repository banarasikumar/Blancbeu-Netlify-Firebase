# Blancbeu - Beauty Salon PWA

Premium beauty salon app with iOS native aesthetic, built with vanilla HTML/CSS/JavaScript.

## Quick Start

The app is running on **port 5000** and ready to deploy!

## Features

✅ **Home Tab** - Auto-rotating carousel (5-second intervals)
✅ **Notifications Tab** - Alert cards with actions  
✅ **My Bookings Tab** - Appointment management with filters
✅ **Account Tab** - Profile with stats and preferences
✅ **Dark/Light Theme** - Toggle with system auto-detect
✅ **iOS Design** - Bottom navigation, spring animations
✅ **PWA Ready** - Installable, offline support

## Structure

```
├── index.html              (183 lines)
├── styles.css              (681 lines)
├── app.js                  (170 lines)
├── auth.js                 (545 lines)
├── firebase-config.js      (40 lines)
├── manifest.json           PWA config
├── sw.js                   Service worker
└── assets/                 Images
```

## Deploy

**Netlify (Frontend)**
```bash
netlify deploy --prod --dir .
```

**Firebase (Backend)**
```bash
cd firebase-backend
firebase deploy --only functions
```

## Browser Support

iOS Safari 15+ | Chrome 90+ | Firefox 88+ | Edge 90+

---

Built with vanilla JavaScript - no frameworks, maximum performance.
