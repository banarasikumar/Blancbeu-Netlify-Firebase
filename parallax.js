export function initParallax() {
    const hero = document.querySelector('.hero');
    const banner = document.querySelector('.carousel');
    const textSection = document.querySelector('.hero-text-section');

    // Target the actual scroll container
    const scroller = document.querySelector('.app-shell-content') || window;

    if (!hero || !banner || !textSection) return;

    // GPU HARDWARE ACCELERATION HINTS
    textSection.style.willChange = 'transform, opacity';
    banner.style.willChange = 'transform';

    // Set static styles for text section
    if (textSection) {
        Object.assign(textSection.style, {
            visibility: 'visible',
            zIndex: '100'
        });
    }

    // Use IntersectionObserver to track visibility
    let isHeroVisible = true;
    const observer = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    observer.observe(hero);

    function updateParallax() {
        if (!isHeroVisible) return;

        // Get current scroll position directly (no LERP)
        const scrollY = (scroller === window)
            ? (window.pageYOffset || document.documentElement.scrollTop)
            : scroller.scrollTop;

        // 1. FADES - Based on direct scroll
        const whiteOverlay = document.querySelector('.hero-scroll-overlay');
        if (whiteOverlay) {
            whiteOverlay.style.opacity = Math.min(0.85, scrollY / 600);
        }

        // Fade text elements but keep primary button always visible
        const textContent = textSection.querySelector('.hero-text-content');
        if (textContent) {
            const fadeOpacity = Math.max(0, 1 - (scrollY / 400));

            // Fade only text elements, not buttons
            const overline = textContent.querySelector('.hero-overline');
            const title = textContent.querySelector('.hero-title');
            const tagline = textContent.querySelector('.hero-tagline');
            const secondaryBtn = textContent.querySelector('.secondary-btn');

            if (overline) overline.style.opacity = fadeOpacity;
            if (title) title.style.opacity = fadeOpacity;
            if (tagline) tagline.style.opacity = fadeOpacity;
            if (secondaryBtn) secondaryBtn.style.opacity = fadeOpacity;
        }

        // 2. PARALLAX MOTION - Direct scroll with subtle multipliers
        const textOffset = scrollY * -0.4; // Text moves up slower
        textSection.style.transform = `translate3d(0, ${textOffset}px, 0)`;

        const bannerOffset = scrollY * 0.3; // Banner moves down slower
        banner.style.transform = `translate3d(0, ${bannerOffset}px, 0) scale(1.1)`;
    }

    // Use scroll event with requestAnimationFrame for optimal performance
    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });

    // Force initial draw
    updateParallax();
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
} else {
    initParallax();
}
