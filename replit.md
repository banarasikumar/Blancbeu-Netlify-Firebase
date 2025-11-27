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
- **Development Approach**: Careful, step-by-step implementation. Work like the best web app designer in the world. No mistakes. Building the best home page UI.

## System Architecture
The Blancbeu website utilizes a true system-wide theme architecture, leveraging CSS custom properties for dynamic styling across light and dark modes.

### UI/UX Decisions
- **Theming**: Dual-theme system (dark default: 24k gold on deep black; light: warm/cream on white) with dynamic CSS variables and user-toggleable via a circular glassmorphism button.
- **Navigation**: iOS-style bottom navigation bar with glassmorphism effects, scroll-based visibility toggling, and theme-aware styling.
- **Navigation Labels**: Home, Notify, Booking, Contact, Account (5 core pages with modern, premium icons)
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
- **Hero Section Animations**: Smooth text reveal animations with staggered timing, gradient text overlays, and premium CTA buttons.
- **Stats Counter Animation**: IntersectionObserver-based automatic counter animation that triggers when stats section comes into view.
- **Premium Feature Cards**: Glassmorphism cards with hover effects and staggered animations.

### Feature Specifications
- **Light/Dark Mode**: System-wide, CSS variable-based theme switching with intelligent automatic detection (time of day IST) and user-toggleable preference persistence.
- **Image Optimization**: Significant image weight reduction via WebP, resizing, and lazy loading.
- **Modern Navigation**: iOS-style bottom navigation with theme-aware styling, scroll behavior, and modern premium icons.
- **Fireworks Overlay**: Transparent Diwali fireworks (dark mode only), visual only.
- **Banner Carousel**: Auto-playing carousel for 16:9 widescreen images.
- **Brand Identity**: "BLANCBEU" with gold gradient, "Family Beauty Salon" subtitle.
- **Contact & Services**: Smartphone-optimized buttons, 8 categorized service groups, special offers.
- **Music Player**: Background music with rose petal rain animation.
- **Customer Engagement**: Customer reviews with star ratings and image gallery.
- **Contact Page**: Features an interactive Google Maps viewer for salon location, premium action buttons ("Open in Maps," "Chat on WhatsApp"), location info card, and stat cards for contact and response time.
- **Booking Page**: Enhanced with glassmorphism, gradient accents, enhanced shadows, and polished interactions for a premium booking interface.
- **Account Page**: Features loyalty tier progression, animated progress bars, and exclusive benefits.

## Home Page Enhancement Roadmap
Interactive **Premium UI Enhancement Roadmap** section to home page with 11 strategic improvements:

### COMPLETED ✅
1. **🎨 Hero Section Enhancement** - Animated text overlays ("Transform Your Beauty"), premium tagline, professional CTA buttons
2. **📊 Trust & Social Proof** - Stats cards with animated counters (15 Years, 10000+ Clients, 50+ Services)
3. **💎 Why Choose Us** - Premium features highlight section with 6 luxury icons (Premium Quality, Expert Professionals, Personalized Care, Relaxing Ambiance, Best Value, 100% Satisfaction)

### PENDING 🔄
4. **⭐ Service Highlights** - Featured service cards carousel with luxury styling
5. **🎬 Testimonial Carousel** - Convert reviews grid to premium engaging carousel format
6. **✨ Premium Animations** - Staggered reveals, scroll triggers, smooth transitions
7. **🎯 Visual Hierarchy** - Better spacing, typography scales, color emphasis
8. **🎪 Interactive Elements** - Floating elements, parallax effects, premium hover states
9. **📱 Sticky Booking CTA** - Prominent sticky booking section with easy-to-notice buttons
10. **📖 About Blancbeu** - Brand storytelling section with luxury positioning
11. **🎨 Final Polish & Testing** - Cross-browser testing, responsiveness, performance optimization

### Roadmap Features
- Interactive checkbox progress tracker (3/11 completion status - 27%)
- Beautiful glassmorphism card design with hover effects
- Persistent progress storage in localStorage
- Visual progress bar with completion percentage
- Status badges (Pending/Completed) that update dynamically
- Responsive grid layout for all screen sizes

## External Dependencies
- **http-server (Node.js)**: For local development.
- **PWA Service Worker**: For offline capabilities and caching.
- **Google Fonts**: `Cinzel` and `Poppins`.
- **Audio**: Background music ("Sundari").
- **Google Maps**: Salon location integration.
- **WhatsApp**: Direct messaging integration.

## Recent Changes (Nov 27, 2025)

### COMPLETED
- ✅ Updated navigation labels to: Home, Notify, Booking, Contact, Account
- ✅ Redesigned navigation icons to modern, premium, stunning polished look
- ✅ Added interactive Premium UI Enhancement Roadmap section to home page
- ✅ Roadmap includes 11 strategic improvements with interactive task tracking
- ✅ Roadmap has persistent progress storage and beautiful glassmorphism UI
- ✅ **Feature #1 COMPLETE**: Hero Section Enhancement with animated text overlays, premium tagline, and professional CTA buttons
- ✅ **Feature #2 COMPLETE**: Trust & Social Proof section with animated stat counters (15 Years, 10000+ Clients, 50+ Services)
- ✅ **Feature #3 COMPLETE**: Why Choose Us section with 6 premium feature cards (Premium Quality, Expert Professionals, Personalized Care, Relaxing Ambiance, Best Value, 100% Satisfaction)

### NEXT STEPS
- Feature #4: Service Highlights Carousel
- Feature #5: Testimonial Carousel (convert reviews to carousel)
- And continue through all 11 features
