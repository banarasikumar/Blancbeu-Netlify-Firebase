# Blancbeu - Premium Beauty & Wellness Salon

## Overview
Blancbeu is a luxurious beauty salon website offering a premium, native app-like experience with a sophisticated 24k gold and black theme, stunning animations, and interactive elements. Its purpose is to provide a magical user experience with high-end aesthetics and seamless functionality, including a light/dark mode toggle and Progressive Web App (PWA) support for installability and optimized performance. The project showcases a rich set of beauty services.

## User Preferences
- **Communication Style**: Please use clear, concise language. Avoid jargon where simpler terms suffice.
- **Workflow Preferences**: I prefer an iterative development approach. Break down complex tasks into smaller, manageable steps.
- **Interaction Preferences**: Always ask for confirmation before implementing significant changes or refactoring large portions of code. Provide a brief explanation of the proposed changes and their impact.
- **Code Style**: Adhere to modern web standards (HTML5, CSS3, ES6+). Focus on clean, readable, and maintainable code.
- **Deployment**: Ensure all changes are thoroughly tested for cross-browser compatibility and responsiveness before deployment.
- **Design Adherence**: Maintain the premium 24k gold and black aesthetic as a primary design principle.

## System Architecture
The Blancbeu website utilizes a true system-wide theme architecture, leveraging CSS custom properties for dynamic styling across light and dark modes.

### UI/UX Decisions
- **Theming**: Dual-theme system (dark default: 24k gold on deep black; light: warm/cream on white) with dynamic CSS variables and user-toggleable via a circular glassmorphism button.
- **Navigation**: iOS-style bottom navigation bar with glassmorphism effects, scroll-based visibility toggling, and theme-aware styling.
- **Navigation Icons**: 5 iOS-inspired SVG outline icons (Home, Notify, Bookings, Contact, Account) with gold gradient strokes (#ffd700 → #d4af37), consistent 1.5px stroke-width, rounded joins, and premium clean aesthetic. All icons use outline/stroke-based design for light, modern appearance.
- **Animations**: Dark mode includes transparent Diwali fireworks, brand name shimmer, sparkling particle backgrounds, offer card glow, and rose petal rain. Animations are disabled in light mode.
- **Design Elements**: `Cinzel` for headings, `Poppins` for body text, and glassmorphism with strong blur and shadow depth for interactive elements.
- **Responsiveness**: Fully responsive design with optimized images for various screen sizes.

### Technical Implementations
- **Frontend**: Vanilla HTML, CSS, JavaScript for performance and control.
- **Theme System**: CSS custom properties defined in `theme-variables.css` enable two complete theme definitions (default dark, `[data-theme="light"]`). A `ThemeController` class manages state, localStorage persistence, and DOM attribute updates.
- **CSS Architecture**: All colors, backgrounds, shadows, and borders are managed via CSS variables.
- **Image Optimization**: WebP format with PNG fallbacks, resized for display dimensions, and lazy loading.
- **Scroll Behavior**: Unified header and bottom navigation visibility managed by scroll events.
- **PWA Support**: Comprehensive Progressive Web App features including custom brand icons, splash screens, and install prompts.

### Feature Specifications
- **Light/Dark Mode**: System-wide, CSS variable-based theme switching with intelligent automatic detection (time of day IST) and user-toggleable preference persistence.
- **Image Optimization**: Significant image weight reduction via WebP, resizing, and lazy loading.
- **Modern Navigation**: iOS-style bottom navigation with theme-aware styling and scroll behavior.
- **Fireworks Overlay**: Transparent Diwali fireworks (dark mode only), visual only.
- **Banner Carousel**: Auto-playing carousel for 16:9 widescreen images.
- **Brand Identity**: "BLANCBEU" with gold gradient, "Family Beauty Salon" subtitle.
- **Contact & Services**: Smartphone-optimized buttons, 8 categorized service groups, special offers.
- **Music Player**: Background music with rose petal rain animation.
- **Customer Engagement**: Customer reviews with star ratings and image gallery.
- **Chat Page**: Features an interactive Google Maps viewer for salon location, premium action buttons ("Open in Maps," "Chat on WhatsApp"), location info card, and stat cards for contact and response time.
- **Bookings Page**: Enhanced with glassmorphism, gradient accents, enhanced shadows, and polished interactions for a premium booking interface.
- **Account Page**: Features loyalty tier progression, animated progress bars, and exclusive benefits.

## External Dependencies
- **http-server (Node.js)**: For local development.
- **PWA Service Worker**: For offline capabilities and caching.
- **Google Fonts**: `Cinzel` and `Poppins`.
- **Audio**: Background music ("Sundari").
- **Google Maps**: Salon location integration.
- **WhatsApp**: Direct messaging integration.