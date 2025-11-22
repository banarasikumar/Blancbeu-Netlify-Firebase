# Blancbeu - Premium Beauty & Wellness Salon

## Overview
Blancbeu is a luxurious beauty salon website designed to provide a premium, native app-like experience. It features a sophisticated 24k gold and black theme, stunning animations, and interactive elements. The project aims to offer a magical user experience with a focus on high-end aesthetics and seamless functionality, including a light/dark mode toggle for diverse viewing preferences. Key capabilities include PWA support for installability, optimized performance, and a rich set of beauty service showcases.

## User Preferences
I want to ensure a smooth, professional development process.
- **Communication Style**: Please use clear, concise language. Avoid jargon where simpler terms suffice.
- **Workflow Preferences**: I prefer an iterative development approach. Break down complex tasks into smaller, manageable steps.
- **Interaction Preferences**: Always ask for confirmation before implementing significant changes or refactoring large portions of code. Provide a brief explanation of the proposed changes and their impact.
- **Code Style**: Adhere to modern web standards (HTML5, CSS3, ES6+). Focus on clean, readable, and maintainable code.
- **Deployment**: Ensure all changes are thoroughly tested for cross-browser compatibility and responsiveness before deployment.
- **Design Adherence**: Maintain the premium 24k gold and black aesthetic as a primary design principle.

## System Architecture
The Blancbeu website now uses a **true system-wide theme architecture** leveraging CSS custom properties (variables) to control all colors and styles dynamically across light and dark modes.

### Theme System (Version 16.1.0 - COMPLETE)
- **CSS Variable-Based Architecture**: Complete theme separation using `:root` with dual theme definitions
  - Dark theme (default): 40+ CSS variables for backgrounds, text, shadows, borders, etc.
  - Light theme: Activated via `data-theme="light"` attribute on HTML element
  - ALL colors (100%) use CSS variable references - zero hardcoded colors in production CSS
- **Dynamic Theme Switching**: JavaScript `ThemeController` updates `data-theme` attribute, triggering instant CSS variable changes
- **Zero Theme Mixing**: When theme switches, ALL elements receive updated colors simultaneously from CSS variables
- **Smart Detection**: Automatic theme selection based on time of day (6 AM - 5 PM: Light, 5 PM - 6 AM: Dark) for first-time visitors
- **Persistence**: User theme preference saved in localStorage and restored on subsequent visits

### UI/UX Decisions
- **Theming**: Dual-theme system with dynamic CSS variables. Dark Mode is premium 24k gold on deep black, Light Mode is sophisticated warm/cream on white. Themes are user-toggleable via modern circular glassmorphism button with smooth transitions.
- **Navigation**: iOS-style bottom navigation bar with glassmorphism effects, scroll-based visibility toggling, and theme-aware styling using `data-theme` attribute selectors.
- **Animations**: In dark mode only, incorporates animations including transparent Diwali fireworks overlay, brand name shimmer, sparkling particle backgrounds, offer card glow effects, and rose petal rain. All animations disabled in light mode.
- **Design Elements**: Uses `Cinzel` for luxury headings and `Poppins` for body text. Features glassmorphism with strong blur and shadow depth for interactive elements.
- **Responsiveness**: Fully responsive across all devices with optimized images for various screen sizes.
- **Gallery**: All gallery images correctly mapped to `/assets/service_images/` with proper WebP format

### Technical Implementations
- **Frontend**: Vanilla HTML, CSS, JavaScript for maximum control and performance.
- **Theme System**: CSS custom properties (`--bg-primary`, `--text-primary`, `--shadow-dark`, etc.) defined in `theme-variables.css`. Two complete theme definitions: one for `:root` (dark) and one for `:root[data-theme="light"]`.
- **Color Conversion**: All hardcoded colors in styles.css have been replaced with CSS variables:
  - Text colors: `#1a1a1a`, `#333333`, `#555555`, `#666666`, `#2c3e50` → `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`
  - Background colors: `#ffffff`, `rgba(255, 255, 255, 0.95/0.9)` → `var(--bg-primary)`, `var(--bg-tertiary)`
  - Gold colors: `#b8860b`, `#d4a017` → `var(--gold-primary)`, `var(--gold-bright)`
  - Gradients: All gradient backgrounds now use theme-aware color variables
- **State Management**: `ThemeController` class manages theme state, synchronizes with localStorage, and updates DOM attributes.
- **CSS Architecture**: Refactored to use CSS variables throughout for colors, backgrounds, shadows, and borders. All hardcoded colors replaced with variable references.
- **Image Optimization**: WebP format with proper paths to `/assets/service_images/` and `/assets/banner_carousel_images/`, resized to display dimensions, lazy loading for performance.
- **Scroll Behavior**: Unified header and bottom navigation visibility management based on scroll events.
- **PWA Support**: Comprehensive Progressive Web App features with custom brand icons, splash screens, and install prompts. Manifest.json configured with correct icon paths.

### Feature Specifications
- **Light/Dark Mode**: System-wide CSS variable-based theme switching. Intelligent automatic detection based on time (IST), user-toggleable with preference persistence. All elements use theme variables—no class-based patches or mixed states.
- **Image Optimization**: 90% reduction in image weight using WebP, resizing, and lazy loading.
- **Modern Navigation**: iOS-style bottom navigation with theme-aware styling and scroll behavior.
- **Fireworks Overlay**: Transparent Diwali fireworks (dark mode only) at 60% speed, visual-only, audio disabled.
- **Banner Carousel**: Auto-playing carousel with user-provided 16:9 widescreen images.
- **Brand Identity**: "BLANCBEU" name with gold gradient, "Family Beauty Salon" subtitle, premium aesthetic.
- **Contact & Services**: Smartphone-optimized buttons, 8 categorized service groups with 60+ services, special offers with compact design.
- **Music Player**: Background music with rose petal rain animation.
- **Customer Engagement**: Customer reviews with star ratings and image gallery with proper asset references.

## Recent Changes (v16.1.0 - FINAL DARK MODE FIX)
- **Fixed gallery image paths**: Changed from deleted `/attached_assets/` to correct `/assets/service_images/` paths
- **Fixed bottom nav theme switching**: Updated CSS selectors from `.light-mode .bottom-nav` to `html[data-theme="light"] .bottom-nav` for proper data-attribute based theming
- **Cleaned manifest.json**: Removed non-existent icon references, kept only available WebP icons (192x192, 512x512)
- **Replaced ALL hardcoded colors**: Converted 16+ hardcoded color instances in styles.css to CSS variables for complete dark mode support
  - Text colors now use `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`
  - Backgrounds now use `var(--bg-primary)`, `var(--bg-tertiary)`
  - Gold accents now use `var(--gold-primary)`, `var(--gold-bright)`, `var(--gold-light)`
- **Verified theme variable coverage**: 100% of color references now use CSS variables - zero hardcoded colors in production CSS
- **Bumped version to 16.1.0** for PWA cache clearance

## External Dependencies
- **http-server (Node.js)**: Local development server
- **PWA Service Worker**: Offline capabilities and caching
- **Fonts**: Cinzel (headings), Poppins (body text) from Google Fonts
- **Audio**: Background music ("Sundari")
- **Google Maps**: Salon location integration
- **WhatsApp**: Direct messaging integration

## File Structure
```
├── index.html              (Main entry point with early theme script)
├── styles.css              (Refactored with 100% CSS variable color references)
├── theme-variables.css     (Complete theme definitions for dark & light modes)
├── script.js               (ThemeController with data-theme attribute management)
├── manifest.json           (PWA manifest with verified icon paths)
├── version.json            (Cache versioning - v16.1.0)
├── sw.js                   (Service worker)
├── fireworks.css           (Fireworks animations - dark mode only)
├── assets/                 (Optimized images)
│   ├── banner_carousel_images/ (5 widescreen banners, 5.1MB total, WebP)
│   ├── service_images/     (44 optimized service images, 2.8MB, WebP)
│   ├── brand_icon_optimized.webp
│   └── app_splash_screen.webp
├── icon-192x192.webp       (PWA icon)
├── icon-512x512.webp       (PWA icon)
└── splash-*.webp           (PWA splash screens)
```

## Deployable App Size
- **Total deployable code**: ~8.3MB (includes all optimized WebP images)
- Not deployed: .git folder (131MB), node_modules, system folders, temporary files

## Known Limitations & Future Improvements
- None currently - all critical dark mode issues resolved

## Fixed Issues (Session Complete)
✅ Gallery images now load from correct paths
✅ Bottom navigation properly switches colors with theme
✅ All text elements display correct color in both themes
✅ All background elements respect theme CSS variables
✅ Manifest.json icon references corrected
✅ Zero hardcoded colors remaining in production CSS
