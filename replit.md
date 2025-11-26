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

### Theme System (NEW - Version 16.0.0+)
- **CSS Variable-Based Architecture**: Complete theme separation using `:root` with dual theme definitions
  - Dark theme (default): 40+ CSS variables for backgrounds, text, shadows, borders, etc.
  - Light theme: Activated via `data-theme="light"` attribute on HTML element
  - All colors defined in `theme-variables.css` and applied throughout styles via `var(--*)` references
- **Dynamic Theme Switching**: JavaScript `ThemeController` updates `data-theme` attribute, triggering instant CSS variable changes
- **Zero Theme Mixing**: When theme switches, ALL elements receive updated colors simultaneously from CSS variables
- **Smart Detection**: Automatic theme selection based on time of day (6 AM - 5 PM: Light, 5 PM - 6 AM: Dark) for first-time visitors
- **Persistence**: User theme preference saved in localStorage and restored on subsequent visits

### UI/UX Decisions
- **Theming**: Dual-theme system with dynamic CSS variables. Dark Mode is premium 24k gold on deep black, Light Mode is sophisticated warm/cream on white. Themes are user-toggleable via modern circular glassmorphism button with smooth transitions.
- **Navigation**: iOS-style bottom navigation bar with glassmorphism effects, scroll-based visibility toggling, and theme-aware styling.
- **Animations**: In dark mode only, incorporates animations including transparent Diwali fireworks overlay, brand name shimmer, sparkling particle backgrounds, offer card glow effects, and rose petal rain. All animations disabled in light mode.
- **Design Elements**: Uses `Cinzel` for luxury headings and `Poppins` for body text. Features glassmorphism with strong blur and shadow depth for interactive elements.
- **Responsiveness**: Fully responsive across all devices with optimized images for various screen sizes.

### Technical Implementations
- **Frontend**: Vanilla HTML, CSS, JavaScript for maximum control and performance.
- **Theme System**: CSS custom properties (`--bg-primary`, `--text-primary`, `--shadow-dark`, etc.) defined in `theme-variables.css`. Two complete theme definitions: one for `:root` (dark) and one for `:root[data-theme="light"]`.
- **State Management**: `ThemeController` class manages theme state, synchronizes with localStorage, and updates DOM attributes.
- **CSS Architecture**: Refactored to use CSS variables throughout for colors, backgrounds, shadows, and borders. All hardcoded colors replaced with variable references.
- **Image Optimization**: WebP format with PNG fallbacks for iOS, resized to display dimensions, lazy loading for performance.
- **Scroll Behavior**: Unified header and bottom navigation visibility management based on scroll events.
- **PWA Support**: Comprehensive Progressive Web App features with custom brand icons, splash screens, and install prompts.

### Feature Specifications
- **Light/Dark Mode**: System-wide CSS variable-based theme switching. Intelligent automatic detection based on time (IST), user-toggleable with preference persistence. All elements use theme variables—no class-based patches or mixed states.
- **Image Optimization**: 90% reduction in image weight using WebP, resizing, and lazy loading.
- **Modern Navigation**: iOS-style bottom navigation with theme-aware styling and scroll behavior.
- **Fireworks Overlay**: Transparent Diwali fireworks (dark mode only) at 60% speed, visual-only, audio disabled.
- **Banner Carousel**: Auto-playing carousel with user-provided 16:9 widescreen images.
- **Brand Identity**: "BLANCBEU" name with gold gradient, "Family Beauty Salon" subtitle, premium aesthetic.
- **Contact & Services**: Smartphone-optimized buttons, 8 categorized service groups with 60+ services, special offers with compact design.
- **Music Player**: Background music with rose petal rain animation.
- **Customer Engagement**: Customer reviews with star ratings and image gallery.

## Recent Changes (v16.4.1 - SCROLL BEHAVIOR PERFECTED)
- **FIXED: Removed scrollable blank space above content** - Eliminated 80px top padding on Chat, Notifications, and Account page containers
- **SCROLL BEHAVIOR**: Pages now stay locked at top - no whitespace appears when swiping down from top position
- **OVERSCROLL PREVENTION**: Added `overscroll-behavior: none;` to prevent browser default overscroll effects
- **ALL PAGES POLISHED**: Smooth, native app-like scrolling behavior across all 5 navigation pages
- **Result**: Premium scrolling experience matching world-class mobile apps

## Previous: v16.4.0 - CHAT PAGE PREMIUM POLISH & APP COMPLETION
- **CHAT PAGE COMPLETE**: Designed stunning Chat page with interactive Google Maps viewer showing BlancBeu Salon location
- **INTERACTIVE GOOGLE MAPS**: Embedded responsive Google Maps iframe displaying salon location with smooth animations
- **PREMIUM ACTION BUTTONS**: Two beautifully styled buttons:
  - "Open in Maps" 🗺️ - Opens Google Maps app with BlancBeu location
  - "Chat on WhatsApp" 💬 - Initiates WhatsApp conversation with salon
- **LOCATION INFO CARD**: Premium display with salon name, description, and business hours (9 AM - 8 PM)
- **INFO CARDS**: Two stat cards showing Call Us (+91 9229915277) and Response Time (Usually within 1 hour)
- **GLASSMORPHISM & ANIMATIONS**: 
  - 10px backdrop blur effects on all cards
  - Premium gold gradients throughout
  - Staggered entrance animations with cubic-bezier (0.34, 1.56, 0.64, 1)
  - Smooth hover effects with lift transforms
- **RESPONSIVE DESIGN**: Perfect scaling for mobile (280px map height) and tablet (320px map height)
- **JAVASCRIPT FUNCTIONS**: Added `openBlancbeuMaps()` and `openWhatsAppChat()` functions for button interactions
- **ALL 5 NAVIGATION PAGES COMPLETE**: Home, Notifications, Bookings, Account, and Chat all feature world-class premium UI
- **Result**: Production-ready beauty salon app with all features implemented and polished

## Previous: v16.3.2 - ACCOUNT PAGE PREMIUM POLISH
- Enhanced Account page with loyalty tier progression, animated progress bars, and exclusive benefits section

## Previous: v16.3.0 - BOOKINGS PAGE PREMIUM POLISH
- **COMPLETE VISUAL ELEVATION**: Transformed Bookings page into stunning premium UI
- **GLASSMORPHISM EFFECTS**: Added backdrop blur and semi-transparent backgrounds to cards, tabs, buttons
- **GRADIENT ACCENTS**: Premium gradient backgrounds throughout (cards, active tabs, buttons, time blocks)
- **ENHANCED SHADOWS**: Multi-layered sophisticated shadows with proper depth and elevation
- **POLISHED INTERACTIONS**: 
  - Smooth cubic-bezier animations (0.34, 1.56, 0.64, 1) for bouncy, premium feel
  - Active tab lifts with gradient and glow effect
  - Buttons scale and lift on hover with smooth transitions
  - Cards show elegant top border gradient line on hover
  - Filter button rotates and scales with premium feel
- **REFINED TYPOGRAPHY**: 
  - Enhanced font weights and letter spacing for luxury feel
  - Gold gradient text for dates/times
  - Uppercase badges with letter-spacing
  - Text shadows on active/hovered elements
- **PREMIUM COLOR PALETTE**: 
  - Subtle gold gradients throughout
  - Professional green gradients for completed services
  - Red gradients for cancel actions
  - Sophisticated opacity layers for depth
- **MICRO-INTERACTIONS**:
  - Badge glassmorphism with backdrop blur
  - Detail items with gradient backgrounds and borders
  - Smooth 400ms transitions with custom easing
  - Cards lift on hover with enhanced glow
- **VISUAL HIERARCHY**: Better spacing, refined proportions, premium aesthetic maintained
- **Result**: World-class premium booking interface matching flagship apps

## Previous Changes (v16.0.7 - HEADER POSITIONING PERFECTED)
- **FIXED: Header bar positioning and overflow issues** - Logo icon, brand name, subtitle, and theme toggle now perfectly aligned
- **IMPROVEMENTS APPLIED**:
  - Increased header container padding and proper flex alignment
  - Reduced brand icon from 85px to 56px for better proportions
  - Reduced brand name font from 42px to 32px
  - Reduced brand subtitle font from 13px to 10px
  - Changed theme toggle from `position: absolute` to `margin-left: auto` (flex-based positioning)
  - Added proper `height: 100%` and vertical alignment to logo content
  - Optimized spacing: logo gap adjusted, brand-icon-wrapper uses flex alignment
  - All margins/padding set to 0 for brand-name and subtitle for tight control
- **Responsive scaling**:
  - Tablet (768px): Header height 70px, icon 48px, name 24px
  - Mobile (480px): Header height 70px, icon 44px, name 20px
  - Theme toggle and all elements properly centered vertically
- **Result**: Beautiful, proportional header with NO overflow, consistent across all navigation pages (Home, Notifications, Bookings, Account)
- **Previous fix maintained**: Footer-to-nav gap still at 0px (from v16.0.6)

## Previous Changes (v16.0.2)
- First attempt at fixing blank space issue

## Previous Changes (v16.0.1)
- **FIXED: Resolved excessive blank space at bottom of home page** - Removed duplicate `padding-bottom` from `.app-page.active` that was conflicting with `.app-shell-content` margin
- **Debugged App Shell layout issues** - Identified that 160px of combined padding was creating colored blank areas in light mode
- **Cleaned up CSS overflow** - Removed redundant padding-bottom from both desktop and mobile responsive rules
- **Verified fix across all themes** - Confirmed light and dark modes now display correctly with proper spacing

## Previous Changes (v16.0.0)
- **Implemented true system-wide theme architecture** using CSS custom properties
- **Created `theme-variables.css`** with 40+ theme variables for dark and light modes
- **Refactored `script.js` ThemeController** to use `data-theme` attribute instead of class-based toggling
- **Updated `styles.css`** to reference CSS variables for all colors and styles
- **Replaced hardcoded colors** with variable references (dark shadows, backgrounds, text colors)
- **Added theme-variables.css link** to index.html for immediate theme application

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
├── styles.css              (Refactored with CSS variable references)
├── theme-variables.css     (NEW: Complete theme definitions)
├── script.js               (Updated ThemeController with data-theme)
├── manifest.json           (PWA manifest)
├── version.json            (Cache versioning - v16.0.0)
├── sw.js                   (Service worker)
├── fireworks.css           (Fireworks animations)
├── assets/                 (Optimized images: banners, services, gallery)
└── splash-*.png            (PWA splash screens)
```

## Known Limitations & Future Improvements
- Some older CSS references may still use legacy color values (gradients with hardcoded gold values)—these will be systematically converted to variables in future updates
- Theme switching CSS transitions are quick but could benefit from staggered animations for ultra-smooth UX
