# Blancbeu - Premium Beauty & Wellness Salon

## Overview
Blancbeu is a luxurious beauty salon website designed to offer a premium, native app-like experience. It features a sophisticated 24k gold and black theme, stunning animations, and interactive elements. The project aims to provide a magical user experience with high-end aesthetics, seamless functionality, including a light/dark mode toggle, and Progressive Web App (PWA) support for installability and optimized performance. The website showcases a rich set of beauty and wellness services.

## User Preferences
- **Communication Style**: Please use clear, concise language. Avoid jargon where simpler terms suffice.
- **Workflow Preferences**: I prefer an iterative development approach. Break down complex tasks into smaller, manageable steps.
- **Interaction Preferences**: Always ask for confirmation before implementing significant changes or refactoring large portions of code.
- **Code Style**: Adhere to modern web standards (HTML5, CSS3, ES6+). Focus on clean, readable, and maintainable code.
- **Deployment**: Ensure all changes are thoroughly tested for cross-browser compatibility and responsiveness before deployment.
- **Design Adherence**: Maintain the premium 24k gold and black aesthetic as a primary design principle.
- **Development Approach**: Careful, step-by-step implementation. Work like the best web app designer in the world. Building world-class home page UI.

## System Architecture
The Blancbeu website utilizes a true system-wide theme architecture, leveraging CSS custom properties for dynamic styling across light and dark modes. The frontend is built with vanilla HTML, CSS, and JavaScript for performance and control.

### UI/UX Decisions
- **Theming**: Dual-theme system (dark default: 24k gold on deep black; light: warm/cream on white) with dynamic CSS variables and a user-toggleable circular glassmorphism button.
- **Navigation**: iOS-style bottom navigation bar with glassmorphism effects, scroll-based visibility toggling, and theme-aware styling. It includes "Home", "Notify", "Booking", "Contact", and "Account".
- **Animations**: Dark mode includes transparent Diwali fireworks, brand name shimmer, sparkling particle backgrounds, offer card glow, and rose petal rain. Staggered reveals, slide-in effects, and smooth transitions are used throughout.
- **Design Elements**: `Cinzel` for headings and `Poppins` for body text. Glassmorphism with strong blur and shadow depth is a key visual component.
- **Responsiveness**: Fully responsive design with optimized images for various screen sizes.

### Technical Implementations
- **Frontend Framework**: Vanilla HTML, CSS, JavaScript.
- **Theme System**: CSS custom properties defined in `theme-variables.css` manage all colors, backgrounds, shadows, and borders.
- **Image Optimization**: WebP format with PNG fallbacks, resized for display dimensions, and lazy loading.
- **PWA Support**: Comprehensive Progressive Web App features, including custom icons, splash screens, and install prompts.
- **Interactive Components**: Multiple premium carousels (banner, services, testimonials) with smooth transitions, IntersectionObserver-based stats counter animation, and glassmorphism cards with hover effects and staggered animations.

### Feature Specifications
- **Hero Section**: Animated text overlays, premium tagline, professional CTA buttons.
- **Trust & Social Proof**: Stats cards with animated counters.
- **Why Choose Us**: Premium feature cards highlighting quality, professionals, care, ambiance, value, and satisfaction.
- **Service Highlights**: Featured services carousel.
- **Testimonial Carousel**: Premium customer testimonials carousel with auto-advance.
- **Sticky Booking CTA**: Prominent CTA section with premium button styling.
- **About Blancbeu**: Brand storytelling section with mission, values, and stat highlights.
- **Gallery**: Beauty salon gallery with responsive design, 1:1 square aspect ratio, hover effects, and gold-themed glassmorphism styling.

## External Dependencies
- **PWA Service Worker**: For offline capabilities and caching.
- **Google Fonts**: `Cinzel` and `Poppins` are used for typography.
- **Google Maps**: Integration for salon location.
- **WhatsApp**: Direct messaging integration.