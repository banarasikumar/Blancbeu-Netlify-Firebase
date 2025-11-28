# Blancbeu - Premium Beauty & Wellness Salon

## Overview
Blancbeu is a luxurious beauty salon website designed to offer a premium, native app-like experience. It features a sophisticated 24k gold and black theme, stunning animations, and interactive elements, aiming to provide a magical user experience with high-end aesthetics and seamless functionality. Key capabilities include a light/dark mode toggle, comprehensive Progressive Web App (PWA) support for installability and optimized performance, and a rich display of beauty services. The project's ambition is to set a new standard for online salon presence through its world-class UI and user engagement features.

## User Preferences
- **Communication Style**: Please use clear, concise language. Avoid jargon where simpler terms suffice.
- **Workflow Preferences**: I prefer an iterative development approach. Break down complex tasks into smaller, manageable steps.
- **Interaction Preferences**: Always ask for confirmation before implementing significant changes or refactoring large portions of code.
- **Code Style**: Adhere to modern web standards (HTML5, CSS3, ES6+). Focus on clean, readable, and maintainable code.
- **Deployment**: Ensure all changes are thoroughly tested for cross-browser compatibility and responsiveness before deployment.
- **Design Adherence**: Maintain the premium 24k gold and black aesthetic as a primary design principle.
- **Development Approach**: Careful, step-by-step implementation. Work like the best web app designer in the world. Building world-class home page UI.

## System Architecture
The Blancbeu website employs a true system-wide theme architecture, utilizing CSS custom properties for dynamic styling across light and dark modes. The design prioritizes a premium aesthetic, responsiveness, and interactive user experience.

### UI/UX Decisions
- **Theming**: Dual-theme system (dark default: 24k gold on deep black; light: warm/cream on white) managed by dynamic CSS variables and a user-toggleable circular glassmorphism button.
- **Navigation**: iOS-style bottom navigation bar featuring glassmorphism, scroll-based visibility toggling, and theme-aware styling, with 5 core pages: Home, Notify, Booking, Contact, Account.
- **Animations**: Includes Diwali fireworks, brand name shimmer, sparkling particle backgrounds, offer card glow, and rose petal rain, alongside staggered reveals and smooth transitions.
- **Typography**: `Cinzel` for headings and `Poppins` for body text.
- **Design Elements**: Prominent use of glassmorphism with strong blur and shadow depth, and a consistent 24k gold and black aesthetic.
- **Responsiveness**: Fully responsive design with optimized images for various screen sizes.

### Technical Implementations
- **Frontend**: Built with vanilla HTML, CSS, and JavaScript for optimal performance and control.
- **Theme System**: CSS custom properties defined in `theme-variables.css` for comprehensive theme management.
- **CSS Architecture**: All styling parameters (colors, backgrounds, shadows, borders) are managed via CSS variables.
- **Image Optimization**: Images are in WebP format with PNG fallbacks, resized for display, and utilize lazy loading.
- **PWA Support**: Extensive Progressive Web App features including custom icons, splash screens, and install prompts.
- **Interactive Components**: Multiple premium carousels (banner, services, testimonials) with smooth transitions, IntersectionObserver-based stats counter animations, and glassmorphism cards with hover effects.
- **Core Features**: Includes service filtering and search, real pricing display with durations and member discounts, a live 14-day availability calendar with time slot booking, a Before & After transformation gallery, and a 3-tier membership program.
- **Enhanced Sections**: Staff spotlight carousel, testimonial carousels, and an interactive "Why Choose Us" section.

## External Dependencies
- **PWA Service Worker**: For offline capabilities and caching.
- **Google Fonts**: `Cinzel` and `Poppins` for typography.
- **Google Maps**: Integration for salon location.
- **WhatsApp**: Direct messaging integration.