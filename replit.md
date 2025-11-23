# Beauty Family Salon

## Overview

Beauty Family Salon is a single-page web application for a beauty salon business. The application provides a modern, mobile-first interface for browsing services, managing bookings, and switching between light/dark themes. Built with vanilla JavaScript, HTML, and CSS, it focuses on simplicity and user experience without external framework dependencies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Single-Page Application (SPA) Design**
- Uses vanilla JavaScript with DOM manipulation for all interactions
- Tab-based navigation system without page reloads
- State management through simple JavaScript variables and localStorage
- Problem: Need responsive, app-like experience without framework overhead
- Solution: Custom tab navigation, modal system, and carousel implementation
- Pros: Lightweight, no build process, fast loading; Cons: Manual DOM management, no component reusability

**Theme System**
- Dual theme support (light/dark mode) using CSS custom properties
- Theme state persisted in localStorage
- Dynamic theme switching without page reload
- CSS variable-based theming allows instant visual updates across entire application

**Component Structure**
- Header with logo, theme toggle, and notifications
- Tabbed content sections (home, services, bookings, profile)
- Reusable modal system for authentication and booking flows
- Carousel component for promotional content
- Filter system for booking management

**State Management**
- Client-side state stored in JavaScript variables (currentTab, theme, bookingFilter, etc.)
- localStorage used for persistence (theme preferences)
- No backend integration currently implemented
- Booking data likely stored locally (implementation suggests localStorage or future API integration)

### Styling Architecture

**CSS Custom Properties (CSS Variables)**
- Centralized design tokens for colors, spacing, shadows
- Theme-aware variables that switch based on `.light-theme` class
- Consistent design system with primary gold color (#d4af37) and secondary accent colors
- Problem: Maintain consistent theming across light/dark modes
- Solution: CSS custom properties with theme-specific overrides
- Pros: Easy theme switching, maintainable; Cons: Limited IE11 support

**Responsive Design**
- Mobile-first approach using viewport meta tags
- CSS transitions and animations for smooth interactions
- Uses system fonts for optimal performance

### Data Architecture

**Local Storage Strategy**
- Theme preferences stored persistently
- Booking data structure suggests local-first approach
- No database currently integrated
- Future expansion likely requires backend API integration

**Booking System**
- Filter-based booking view (upcoming/past bookings)
- Service card interaction triggers booking modal
- Authentication modal for user management
- Empty state handling for zero bookings

## External Dependencies

**None Currently Implemented**

The application is built entirely with web standards:
- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 with custom properties
- Web Storage API (localStorage)

**Future Integration Points:**
- Backend API for booking management (RESTful or GraphQL)
- Database for user accounts and booking records (likely candidates: PostgreSQL, MongoDB)
- Authentication service (potential: JWT, OAuth)
- Payment gateway for booking payments
- Email/SMS notification service
- Analytics platform (Google Analytics, Mixpanel)

**PWA Capabilities:**
- Manifest file referenced (manifest.json)
- Meta tags for theme-color and apple-touch-icon
- Suggests Progressive Web App functionality intended

**No Build Tools or Package Managers:**
- No webpack, Vite, or similar bundlers
- No npm/yarn dependencies
- Static asset serving only
- Deployment-ready as-is for static hosting (Netlify, Vercel, GitHub Pages)