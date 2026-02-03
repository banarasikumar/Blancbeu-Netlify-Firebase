export function initParallax() {
    const hero = document.querySelector('.hero');
    const banner = document.querySelector('.carousel');
    const textSection = document.querySelector('.hero-text-section');
    const header = document.querySelector('.header');
    const primaryBtn = document.querySelector('.hero-btn.primary-btn');

    // Target the actual scroll container
    const scroller = document.querySelector('.app-shell-content') || window;

    if (!hero || !banner || !textSection) return;

    // GPU HARDWARE ACCELERATION HINTS
    textSection.style.willChange = 'transform, opacity';
    banner.style.willChange = 'transform';
    if (primaryBtn) primaryBtn.style.willChange = 'transform';

    // 1. Set static styles for text section FIRST (Move down 20px as requested)
    if (textSection) {
        Object.assign(textSection.style, {
            visibility: 'visible',
            left: '50%',
            top: 'calc(50% + 55px)',
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            background: 'transparent',
            border: 'none',
            zIndex: '100'
        });
    }

    // 2. INITIALIZATION: Cache static dimensions (Measure after repositioning)
    const heroHeight = hero.offsetHeight;
    const initialHeroTopViewport = hero.getBoundingClientRect().top + (scroller === window ? window.pageYOffset : scroller.scrollTop);

    let btnHeroOffset = 0;
    let btnHeight = 0;
    if (primaryBtn) {
        const heroRect = hero.getBoundingClientRect();
        const btnRect = primaryBtn.getBoundingClientRect();
        btnHeroOffset = btnRect.top - heroRect.top;
        btnHeight = primaryBtn.offsetHeight;
        primaryBtn.style.transition = 'transform 0s !important, background 0.3s ease, box-shadow 0.3s ease';
    }

    // LERP STATE
    let currentScroll = (scroller === window ? window.pageYOffset : scroller.scrollTop);
    let targetScroll = currentScroll;
    const lerpFactor = 0.1;

    function updateParallax() {
        // 1. LERP SCROLL: Smoothly chase the real scroll position
        const diffScroll = targetScroll - currentScroll;
        if (Math.abs(diffScroll) < 0.05) {
            currentScroll = targetScroll;
        } else {
            currentScroll += diffScroll * lerpFactor;
        }

        // 2. LIVE MEASUREMENTS: Get real-time viewport positions for hard constraints
        const heroRect = hero.getBoundingClientRect();
        const liveHeroTop = heroRect.top;

        // 3. FADES (Based on smoothed currentScroll)
        const whiteOverlay = document.querySelector('.hero-scroll-overlay');
        if (whiteOverlay) {
            whiteOverlay.style.opacity = Math.min(0.85, currentScroll / 600);
        }

        const textContent = textSection.querySelector('.hero-text-content');
        if (textContent) {
            textContent.style.opacity = Math.max(0, 1 - (currentScroll / 400));
        }

        // 4. MOTION (Text & Banner use smoothed LERP for "Buttery" feel)
        const textOffset = currentScroll * -0.5;
        textSection.style.transform = `translate3d(-50%, -50%, 0) translate3d(0, ${textOffset.toFixed(2)}px, 0)`;

        const bannerOffset = (currentScroll * 0.4).toFixed(2);
        banner.style.transform = `translate3d(0, ${bannerOffset}px, 0) scale(1.1)`;

        // 5. STICKY LOGIC (Uses LIVE clamping for absolute 80px stop)
        if (primaryBtn) {
            // Natural Viewport Position = RealHeroTop + InitialOffset + SmoothParallaxOffset
            // We use liveHeroTop to ensure the button can't "lag" past its lock point
            const naturalBtnTop = liveHeroTop + btnHeroOffset + textOffset;

            // Absolute Constraints (80px from top, Release at 50px remaining)
            const stickyLimit = 80;
            const releaseLimit = liveHeroTop + heroHeight - btnHeight - 50;

            // Determine Target Viewport Top
            let targetTop = Math.max(naturalBtnTop, stickyLimit);
            targetTop = Math.min(targetTop, releaseLimit);

            // Calculate exact transform required to reach targetTop
            const applyMove = (targetTop - naturalBtnTop).toFixed(2);
            primaryBtn.style.transform = `translate3d(0, ${applyMove}px, 0)`;
            primaryBtn.style.zIndex = "100";
        }

        // Header Style logic moved to nav_fix.js (Strict Home Page Check)

        // Continue loop if not settled
        if (currentScroll !== targetScroll) {
            requestAnimationFrame(updateParallax);
        }
    }

    const onScroll = () => {
        const newTarget = (scroller === window) ?
            (window.pageYOffset || document.documentElement.scrollTop) :
            scroller.scrollTop;

        const wasSettled = (currentScroll === targetScroll);
        targetScroll = newTarget;

        if (wasSettled) {
            requestAnimationFrame(updateParallax);
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
