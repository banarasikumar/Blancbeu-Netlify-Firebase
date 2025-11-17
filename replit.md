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
The Blancbeu website is built using a modern, client-side focused architecture, leveraging vanilla JavaScript, HTML, and CSS for a lightweight and highly performant experience.

### UI/UX Decisions
- **Theming**: Features a dual-theme system: a default premium 24k gold on deep black (Dark Mode) and a vibrant, colorful Light Mode. Themes are user-toggleable with persistence via `localStorage`.
- **Navigation**: Utilizes an iOS-style bottom navigation bar with glassmorphism effects, larger icons, and a reordered structure (Home, Notifications, My Bookings, Chat, Account) for enhanced mobile usability. It hides on scroll down and shows on scroll up.
- **Animations**: Incorporates extensive animations including a transparent Diwali fireworks overlay, brand name shimmer, sparkling particle backgrounds, offer card glow effects, rose petal rain, and responsive hover effects. Animations are optimized for performance with `requestAnimationFrame` throttling and GPU acceleration.
- **Design Elements**: Uses `Cinzel` for luxury headings and `Poppins` for body text. Features glassmorphism with strong blur and shadow depth for interactive elements.
- **Responsiveness**: Designed to be fully responsive across all devices, with images optimized for various screen sizes.

### Technical Implementations
- **Frontend**: Primarily Vanilla HTML, CSS, JavaScript for maximum control and performance.
- **State Management**: A `ThemeController` class manages theme state and transitions.
- **Image Optimization**: Implements WebP format where supported, with PNG fallbacks for iOS. Images are resized to display dimensions, significantly reducing load times. Lazy loading is used for performance-critical images.
- **Scroll Behavior**: A `ScrollBehaviorManager` unifies header and bottom navigation visibility, and manages fireworks pausing/resuming based on scroll events.
- **PWA Support**: Comprehensive Progressive Web App features including custom brand icons, seamless splash screens, cross-browser install prompts, and standalone mode detection.
- **Asset Management**: Organized folder structure for banners, service images, and other assets.

### Feature Specifications
- **Light/Dark Mode**: Intelligent automatic theme selection based on time of day (6 AM - 6 PM: Light Mode, 6 PM - 6 AM: Dark Mode) for first-time visitors. User-toggleable with smooth transitions, preference persistence via `localStorage`, and meta theme-color updates. Once a user manually toggles the theme, their preference is saved and respected on future visits.
- **Image Optimization**: 90% overall reduction in image weight using WebP, resizing, and lazy loading.
- **Modern Navigation**: Redesigned iOS-style bottom navigation with enhanced icons, typography, and scroll behavior.
- **Fireworks Overlay**: Transparent, continuous Diwali fireworks animation at 60% speed with sound, acting as a decorative overlay without blocking interaction.
- **Banner Carousel**: Auto-playing banner carousel with 6 professional square images, optimized dimensions, and radial gradient backgrounds.
- **Brand Identity**: Prominent "BLANCBEU" brand name with a gold gradient shimmer and "Family Beauty Salon" subtitle.
- **Contact & Services**: Smartphone-optimized contact buttons, 8 categorized service groups with 60+ services, and special offers with glow animations.
- **Music Player**: Background music player with a rose petal rain animation.
- **Customer Engagement**: Customer reviews with star ratings and an image gallery.

## External Dependencies
- **http-server (Node.js)**: Used for serving the application locally during development.
- **PWA Service Worker**: For offline capabilities, caching assets, and enabling installability.
- **Fonts**: `Cinzel` and `Poppins` (likely sourced from Google Fonts or local assets).
- **Audio**: `Sundari` (SpotiDownloader.com) for background music.
- **Google Maps**: Integration for salon location.
- **WhatsApp**: Integration for direct messaging.