/*
================================================================================
BLANCBEU SALON - WORLD-CLASS JAVASCRIPT IMPLEMENTATION ROADMAP
================================================================================
Benchmark: Sephora, Glossier, Ritz-Carlton, Apple Store, Airbnb
Design Language: Luxury 24K Gold + Noir with Premium Interactions

================================================================================
PHASE 0: VISUAL EXCELLENCE - JAVASCRIPT IMPLEMENTATIONS
================================================================================

ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
0.1 MAGNETIC BUTTON EFFECT
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

IMPLEMENTATION:
--------------
class MagneticButton {
    constructor(element, options = {}) {
        this.element = element;
        this.strength = options.strength || 0.3;  // How much button follows cursor
        this.ease = options.ease || 0.15;         // Smoothness of movement
        
        this.bounds = null;
        this.position = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.element.addEventListener('mouseenter', () => this.onEnter());
        this.element.addEventListener('mousemove', (e) => this.onMove(e));
        this.element.addEventListener('mouseleave', () => this.onLeave());
    }
    
    onEnter() {
        this.bounds = this.element.getBoundingClientRect();
        this.animate();
    }
    
    onMove(e) {
        // Calculate distance from center
        const centerX = this.bounds.left + this.bounds.width / 2;
        const centerY = this.bounds.top + this.bounds.height / 2;
        
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        
        // Set target position (limited by strength)
        this.target.x = distX * this.strength;
        this.target.y = distY * this.strength;
    }
    
    onLeave() {
        // Return to center with spring animation
        this.target = { x: 0, y: 0 };
    }
    
    animate() {
        // Smooth interpolation toward target
        this.position.x += (this.target.x - this.position.x) * this.ease;
        this.position.y += (this.target.y - this.position.y) * this.ease;
        
        this.element.style.transform = `
            translate(${this.position.x}px, ${this.position.y}px)
        `;
        
        // Continue animation if still moving
        if (Math.abs(this.target.x - this.position.x) > 0.01 ||
            Math.abs(this.target.y - this.position.y) > 0.01) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

USAGE:
------
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    new MagneticButton(btn, { strength: 0.4, ease: 0.1 });
});


ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
0.2 RIPPLE EFFECT ON CLICK
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

IMPLEMENTATION:
--------------
function createRipple(e) {
    const button = e.currentTarget;
    
    // Remove any existing ripple
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();
    
    // Create ripple element
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    // Calculate position
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    // Apply styles
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-expand 0.6s ease-out forwards;
        pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    // Remove after animation
    ripple.addEventListener('animationend', () => ripple.remove());
}

USAGE:
------
document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', createRipple);
});


ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
0.3 SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

IMPLEMENTATION:
--------------
class ScrollReveal {
    constructor(options = {}) {
        this.threshold = options.threshold || 0.15;  // % visible before triggering
        this.rootMargin = options.rootMargin || '0px';
        this.staggerDelay = options.staggerDelay || 100;  // ms between items
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Apply staggered delay for grouped elements
                    const siblings = entry.target.parentElement.querySelectorAll('.scroll-reveal');
                    const siblingIndex = Array.from(siblings).indexOf(entry.target);
                    
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, siblingIndex * this.staggerDelay);
                    
                    // Unobserve after animation (one-time only)
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: this.threshold,
            rootMargin: this.rootMargin
        });
        
        // Observe all scroll-reveal elements
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }
}

ANIMATION VARIANTS:
------------------
.scroll-reveal.fade-up {
    opacity: 0;
    transform: translateY(60px);
}
.scroll-reveal.fade-up.visible {
    opacity: 1;
    transform: translateY(0);
}

.scroll-reveal.fade-left {
    opacity: 0;
    transform: translateX(-60px);
}
.scroll-reveal.fade-left.visible {
    opacity: 1;
    transform: translateX(0);
}

.scroll-reveal.zoom-in {
    opacity: 0;
    transform: scale(0.8);
}
.scroll-reveal.zoom-in.visible {
    opacity: 1;
    transform: scale(1);
}

USAGE:
------
new ScrollReveal({ threshold: 0.2, staggerDelay: 150 });


ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
0.4 PARALLAX SCROLLING
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

IMPLEMENTATION:
--------------
class ParallaxManager {
    constructor() {
        this.elements = [];
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        // Collect all parallax elements with data-speed attribute
        document.querySelectorAll('[data-parallax]').forEach(el => {
            this.elements.push({
                element: el,
                speed: parseFloat(el.dataset.parallax) || 0.3,
                direction: el.dataset.parallaxDirection || 'y'
            });
        });
        
        // Listen for scroll with throttling
        window.addEventListener('scroll', () => this.requestTick(), { passive: true });
    }
    
    requestTick() {
        if (!this.ticking) {
            requestAnimationFrame(() => this.update());
            this.ticking = true;
        }
    }
    
    update() {
        const scrollY = window.scrollY;
        
        this.elements.forEach(({ element, speed, direction }) => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            
            // Only apply parallax when element is in viewport
            if (scrollY + window.innerHeight > elementTop && 
                scrollY < elementTop + rect.height) {
                
                const offset = (scrollY - elementTop) * speed;
                
                if (direction === 'y') {
                    element.style.transform = `translateY(${offset}px)`;
                } else {
                    element.style.transform = `translateX(${offset}px)`;
                }
            }
        });
        
        this.ticking = false;
    }
}

USAGE IN HTML:
-------------
<div class="hero-image" data-parallax="0.3" data-parallax-direction="y">
    <img src="hero.jpg" alt="Hero">
</div>

<div class="floating-element" data-parallax="-0.2">
    <!-- Moves opposite direction -->
</div>


ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
0.5 CONFETTI CELEBRATION EFFECT
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

IMPLEMENTATION:
--------------
class ConfettiBurst {
    constructor(options = {}) {
        this.colors = options.colors || [
            '#FFD700',  // Gold
            '#FFB6C1',  // Rose
            '#FFFFFF',  // White
            '#F7E7CE',  // Champagne
            '#B76E79'   // Rose Gold
        ];
        this.particleCount = options.count || 100;
        this.duration = options.duration || 3000;  // ms
        this.spread = options.spread || 360;       // degrees
        this.velocity = options.velocity || 30;
    }
    
    fire(originX = 0.5, originY = 0.5) {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        container.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 99999;
            overflow: hidden;
        `;
        document.body.appendChild(container);
        
        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const size = Math.random() * 10 + 5;
            const shape = Math.random() > 0.5 ? '50%' : '0';  // Circle or square
            
            // Random angle within spread
            const angle = (Math.random() * this.spread - this.spread / 2) * (Math.PI / 180);
            const velocity = this.velocity * (0.5 + Math.random() * 0.5);
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity - 20;  // Initial upward boost
            
            particle.style.cssText = `
                position: absolute;
                left: ${originX * 100}%;
                top: ${originY * 100}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: ${shape};
                transform: rotate(${Math.random() * 360}deg);
            `;
            
            container.appendChild(particle);
            
            // Animate with physics
            this.animateParticle(particle, vx, vy);
        }
        
        // Clean up after duration
        setTimeout(() => container.remove(), this.duration);
    }
    
    animateParticle(particle, vx, vy) {
        let x = 0, y = 0;
        let rotation = Math.random() * 360;
        const gravity = 0.5;
        const friction = 0.99;
        const rotationSpeed = Math.random() * 10 - 5;
        
        const animate = () => {
            vy += gravity;  // Apply gravity
            vx *= friction; // Apply friction
            vy *= friction;
            
            x += vx;
            y += vy;
            rotation += rotationSpeed;
            
            particle.style.transform = `
                translate(${x}px, ${y}px)
                rotate(${rotation}deg)
            `;
            particle.style.opacity = Math.max(0, 1 - y / 500);
            
            if (y < 500 && particle.style.opacity > 0) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

USAGE:
------
const confetti = new ConfettiBurst({
    colors: ['#FFD700', '#FFB6C1', '#FFFFFF'],
    count: 80
});

// Fire on booking success
function onBookingSuccess() {
    confetti.fire(0.5, 0.3);  // From center-top
    showSuccessMessage();
}


ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
0.6 SKELETON LOADING MANAGER
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

IMPLEMENTATION:
--------------
class SkeletonLoader {
    constructor() {
        this.skeletonTemplates = {
            'service-card': `
                <div class="skeleton-card">
                    <div class="skeleton skeleton-image" style="height: 200px;"></div>
                    <div class="skeleton-content" style="padding: 16px;">
                        <div class="skeleton skeleton-title" style="height: 24px; width: 70%;"></div>
                        <div class="skeleton skeleton-text" style="height: 16px; width: 90%; margin-top: 8px;"></div>
                        <div class="skeleton skeleton-text" style="height: 16px; width: 60%; margin-top: 8px;"></div>
                        <div class="skeleton skeleton-button" style="height: 44px; margin-top: 16px;"></div>
                    </div>
                </div>
            `,
            'staff-card': `
                <div class="skeleton-card">
                    <div class="skeleton skeleton-avatar" style="width: 120px; height: 120px; border-radius: 50%; margin: 0 auto;"></div>
                    <div class="skeleton skeleton-title" style="height: 24px; width: 60%; margin: 16px auto 8px;"></div>
                    <div class="skeleton skeleton-text" style="height: 16px; width: 40%; margin: 0 auto;"></div>
                </div>
            `,
            'review-card': `
                <div class="skeleton-card">
                    <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                        <div class="skeleton" style="width: 50px; height: 50px; border-radius: 50%;"></div>
                        <div style="flex: 1;">
                            <div class="skeleton" style="height: 18px; width: 60%;"></div>
                            <div class="skeleton" style="height: 14px; width: 40%; margin-top: 8px;"></div>
                        </div>
                    </div>
                    <div class="skeleton" style="height: 16px; width: 100%;"></div>
                    <div class="skeleton" style="height: 16px; width: 90%; margin-top: 8px;"></div>
                    <div class="skeleton" style="height: 16px; width: 70%; margin-top: 8px;"></div>
                </div>
            `
        };
    }
    
    show(container, type, count = 1) {
        const template = this.skeletonTemplates[type];
        if (!template) return;
        
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            container.innerHTML += template;
        }
    }
    
    hide(container, realContent) {
        // Fade out skeletons
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            container.innerHTML = realContent;
            container.style.opacity = '1';
        }, 300);
    }
}

USAGE:
------
const skeleton = new SkeletonLoader();

// When loading services
skeleton.show(servicesGrid, 'service-card', 6);

// When data arrives
fetch('/api/services')
    .then(res => res.json())
    .then(data => {
        const html = data.map(service => renderServiceCard(service)).join('');
        skeleton.hide(servicesGrid, html);
    });


================================================================================
PHASE 1: CORE FEATURES - JAVASCRIPT IMPLEMENTATIONS
================================================================================

ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
1.0 SERVICE FILTERING & SEARCH SYSTEM
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

IMPLEMENTATION:
--------------
class ServiceFilter {
    constructor(options) {
        this.container = document.querySelector(options.container);
        this.filterBar = document.querySelector(options.filterBar);
        this.searchInput = document.querySelector(options.searchInput);
        this.countDisplay = document.querySelector(options.countDisplay);
        
        this.services = [];           // All services data
        this.filteredServices = [];   // Currently filtered
        this.activeCategory = 'all';
        this.searchQuery = '';
        this.debounceTimer = null;
        
        this.init();
    }
    
    init() {
        // Load services from DOM or API
        this.services = this.parseServicesFromDOM();
        this.filteredServices = [...this.services];
        
        // Category filter buttons
        this.filterBar.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setActiveCategory(btn.dataset.category);
            });
        });
        
        // Search input with debouncing
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.setSearchQuery(e.target.value);
            }, 300);  // 300ms debounce
        });
    }
    
    parseServicesFromDOM() {
        return Array.from(this.container.querySelectorAll('.service-card')).map(card => ({
            element: card,
            name: card.querySelector('.service-name').textContent.toLowerCase(),
            category: card.dataset.category,
            price: parseFloat(card.dataset.price),
            duration: card.dataset.duration,
            description: card.querySelector('.service-description')?.textContent.toLowerCase() || ''
        }));
    }
    
    setActiveCategory(category) {
        this.activeCategory = category;
        
        // Update button states
        this.filterBar.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.applyFilters();
    }
    
    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase().trim();
        this.applyFilters();
    }
    
    applyFilters() {
        this.filteredServices = this.services.filter(service => {
            // Category filter
            const matchesCategory = this.activeCategory === 'all' || 
                                    service.category === this.activeCategory;
            
            // Search filter (name OR description)
            const matchesSearch = this.searchQuery === '' ||
                                  service.name.includes(this.searchQuery) ||
                                  service.description.includes(this.searchQuery);
            
            return matchesCategory && matchesSearch;
        });
        
        this.render();
    }
    
    render() {
        // Update count display
        const count = this.filteredServices.length;
        this.countDisplay.textContent = `${count} service${count !== 1 ? 's' : ''} found`;
        
        // Animate cards
        this.services.forEach(service => {
            const isVisible = this.filteredServices.includes(service);
            
            if (isVisible) {
                service.element.style.display = '';
                service.element.style.animation = 'fadeInUp 0.4s ease forwards';
            } else {
                service.element.style.animation = 'fadeOutDown 0.3s ease forwards';
                setTimeout(() => {
                    service.element.style.display = 'none';
                }, 300);
            }
        });
    }
}

USAGE:
------
const serviceFilter = new ServiceFilter({
    container: '.services-grid',
    filterBar: '.service-filter-bar',
    searchInput: '.filter-search input',
    countDisplay: '.filter-count'
});


ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
2.0 BEFORE & AFTER IMAGE SLIDER
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

IMPLEMENTATION:
--------------
class BeforeAfterSlider {
    constructor(element) {
        this.container = element;
        this.beforeImage = element.querySelector('.before-image');
        this.handle = element.querySelector('.slider-handle');
        this.isDragging = false;
        
        this.init();
    }
    
    init() {
        // Mouse events
        this.handle.addEventListener('mousedown', () => this.startDrag());
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        
        // Touch events for mobile
        this.handle.addEventListener('touchstart', () => this.startDrag());
        document.addEventListener('touchmove', (e) => this.onDrag(e.touches[0]));
        document.addEventListener('touchend', () => this.stopDrag());
        
        // Click on container to move handle
        this.container.addEventListener('click', (e) => {
            if (e.target !== this.handle) {
                this.setPosition(e);
            }
        });
    }
    
    startDrag() {
        this.isDragging = true;
        this.container.classList.add('dragging');
    }
    
    stopDrag() {
        this.isDragging = false;
        this.container.classList.remove('dragging');
    }
    
    onDrag(e) {
        if (!this.isDragging) return;
        this.setPosition(e);
    }
    
    setPosition(e) {
        const rect = this.container.getBoundingClientRect();
        let x = e.clientX - rect.left;
        
        // Clamp between 0 and container width
        x = Math.max(0, Math.min(x, rect.width));
        
        const percentage = (x / rect.width) * 100;
        
        // Update before image clip path
        this.beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        
        // Update handle position
        this.handle.style.left = `${percentage}%`;
    }
}

USAGE:
------
document.querySelectorAll('.before-after-slider').forEach(slider => {
    new BeforeAfterSlider(slider);
});


ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
3.0 LIVE AVAILABILITY CALENDAR
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

IMPLEMENTATION:
--------------
class AvailabilityCalendar {
    constructor(options) {
        this.container = document.querySelector(options.container);
        this.onDateSelect = options.onDateSelect || (() => {});
        this.onTimeSelect = options.onTimeSelect || (() => {});
        
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.availabilityData = {};  // Fetched from API
        
        this.init();
    }
    
    init() {
        this.render();
        this.fetchAvailability();
    }
    
    async fetchAvailability() {
        // Mock API call - replace with real endpoint
        try {
            // const response = await fetch('/api/availability?month=' + this.currentDate.toISOString());
            // this.availabilityData = await response.json();
            
            // Mock data for demonstration
            this.availabilityData = this.generateMockAvailability();
            this.render();
        } catch (error) {
            console.error('Failed to fetch availability:', error);
        }
    }
    
    generateMockAvailability() {
        const data = {};
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateKey = date.toISOString().split('T')[0];
            
            // Random availability (some days full, some have slots)
            const slotsAvailable = Math.floor(Math.random() * 8);
            
            data[dateKey] = {
                slotsAvailable,
                slots: this.generateTimeSlots(slotsAvailable)
            };
        }
        
        return data;
    }
    
    generateTimeSlots(available) {
        const allSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '14:00', '14:30', '15:00', '15:30', '16:00',
            '16:30', '17:00', '17:30', '18:00'
        ];
        
        return allSlots.map(time => ({
            time,
            available: Math.random() < (available / 8),
            therapist: ['Priya', 'Anita', 'Meera'][Math.floor(Math.random() * 3)]
        }));
    }
    
    render() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        this.container.innerHTML = `
            <div class="calendar-widget">
                <div class="calendar-header">
                    <button class="calendar-nav-btn prev" onclick="calendar.prevMonth()">ÔåÉ</button>
                    <span class="calendar-month">
                        ${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}
                    </span>
                    <button class="calendar-nav-btn next" onclick="calendar.nextMonth()">ÔåÆ</button>
                </div>
                
                <div class="calendar-weekdays">
                    ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                        .map(day => `<div class="weekday">${day}</div>`).join('')}
                </div>
                
                <div class="calendar-days">
                    ${this.renderDays()}
                </div>
                
                ${this.selectedDate ? this.renderTimeSlots() : ''}
            </div>
        `;
        
        this.attachEventListeners();
    }
    
    renderDays() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date().toISOString().split('T')[0];
        
        let html = '';
        
        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const availability = this.availabilityData[dateStr];
            const slots = availability?.slotsAvailable || 0;
            
            const isToday = dateStr === today;
            const isPast = new Date(dateStr) < new Date(today);
            const isSelected = dateStr === this.selectedDate;
            
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isPast) classes += ' disabled';
            if (isSelected) classes += ' selected';
            if (slots > 3) classes += ' has-slots';
            else if (slots > 0) classes += ' few-slots';
            
            html += `
                <div class="${classes}" data-date="${dateStr}" ${isPast ? 'disabled' : ''}>
                    <span class="day-number">${day}</span>
                    ${slots > 0 ? `<span class="slot-indicator">${slots}</span>` : ''}
                </div>
            `;
        }
        
        return html;
    }
    
    renderTimeSlots() {
        const availability = this.availabilityData[this.selectedDate];
        if (!availability) return '';
        
        return `
            <div class="time-slots-section">
                <h4>Available Times for ${this.formatDate(this.selectedDate)}</h4>
                <div class="time-slots-grid">
                    ${availability.slots.map(slot => `
                        <div class="time-slot ${slot.available ? '' : 'booked'} 
                                    ${slot.time === this.selectedTime ? 'selected' : ''}"
                             data-time="${slot.time}"
                             ${!slot.available ? 'disabled' : ''}>
                            <span class="slot-time">${slot.time}</span>
                            ${slot.available ? `<span class="slot-therapist">${slot.therapist}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }
    
    attachEventListeners() {
        // Day selection
        this.container.querySelectorAll('.calendar-day:not(.disabled):not(.empty)').forEach(day => {
            day.addEventListener('click', () => {
                this.selectedDate = day.dataset.date;
                this.selectedTime = null;
                this.onDateSelect(this.selectedDate);
                this.render();
            });
        });
        
        // Time slot selection
        this.container.querySelectorAll('.time-slot:not(.booked)').forEach(slot => {
            slot.addEventListener('click', () => {
                this.selectedTime = slot.dataset.time;
                this.onTimeSelect(this.selectedTime);
                this.render();
            });
        });
    }
    
    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.fetchAvailability();
    }
    
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.fetchAvailability();
    }
}

USAGE:
------
const calendar = new AvailabilityCalendar({
    container: '#availability-calendar',
    onDateSelect: (date) => {
        console.log('Selected date:', date);
    },
    onTimeSelect: (time) => {
        console.log('Selected time:', time);
        showBookingForm();
    }
});


ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
4.0 STAFF CAROUSEL
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

IMPLEMENTATION:
--------------
class StaffCarousel {
    constructor(options) {
        this.container = document.querySelector(options.container);
        this.track = this.container.querySelector('.carousel-track');
        this.cards = Array.from(this.track.querySelectorAll('.staff-card'));
        this.dotsContainer = this.container.querySelector('.carousel-dots');
        
        this.currentIndex = 0;
        this.autoPlayInterval = options.autoPlay || 8000;  // 8 seconds
        this.autoPlayTimer = null;
        this.cardsPerView = this.calculateCardsPerView();
        
        this.init();
    }
    
    calculateCardsPerView() {
        const containerWidth = this.container.offsetWidth;
        if (containerWidth < 640) return 1;
        if (containerWidth < 1024) return 2;
        return 3;
    }
    
    init() {
        this.createDots();
        this.attachEventListeners();
        this.startAutoPlay();
        
        // Recalculate on resize
        window.addEventListener('resize', () => {
            this.cardsPerView = this.calculateCardsPerView();
            this.goToSlide(this.currentIndex);
        });
    }
    
    createDots() {
        const totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
        
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    attachEventListeners() {
        // Navigation buttons
        this.container.querySelector('.prev-btn')?.addEventListener('click', () => this.prev());
        this.container.querySelector('.next-btn')?.addEventListener('click', () => this.next());
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Touch/swipe support
        let startX, moveX;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.stopAutoPlay();
        });
        
        this.track.addEventListener('touchmove', (e) => {
            moveX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', () => {
            const diff = startX - moveX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.next() : this.prev();
            }
            this.startAutoPlay();
        });
    }
    
    goToSlide(index) {
        const totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
        this.currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
        
        const cardWidth = this.cards[0].offsetWidth + 24;  // Include gap
        const offset = this.currentIndex * this.cardsPerView * cardWidth;
        
        this.track.style.transform = `translateX(-${offset}px)`;
        
        // Update dots
        this.dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    }
    
    next() {
        const totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
        this.goToSlide((this.currentIndex + 1) % totalSlides);
    }
    
    prev() {
        const totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
        this.goToSlide((this.currentIndex - 1 + totalSlides) % totalSlides);
    }
    
    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => this.next(), this.autoPlayInterval);
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlayTimer);
    }
}

USAGE:
------
const staffCarousel = new StaffCarousel({
    container: '.staff-carousel',
    autoPlay: 8000
});


ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
5.0 FLOATING CHAT WIDGET
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

IMPLEMENTATION:
--------------
class ChatWidget {
    constructor(options = {}) {
        this.container = null;
        this.isOpen = false;
        this.messages = [];
        
        this.botResponses = {
            greeting: "Hello! Welcome to Blancbeu Beauty Salon. How can I help you today?",
            services: "We offer a wide range of services including Hair Styling, Makeup, Facials, Manicures, Pedicures, and Spa treatments. Which would you like to know more about?",
            booking: "I'd be happy to help you book an appointment! You can call us at +91 92299 15277 or use our online booking system. Would you like me to guide you through the process?",
            hours: "We're open Monday to Saturday from 10:00 AM to 8:00 PM, and Sundays from 11:00 AM to 6:00 PM.",
            location: "We're located in Ranchi. You can find us on Google Maps. Would you like me to share the directions?",
            default: "Thank you for your message! Our team will get back to you shortly. In the meantime, you can also reach us at +91 92299 15277."
        };
        
        this.quickActions = [
            { label: "View Services", action: "services" },
            { label: "Book Appointment", action: "booking" },
            { label: "Our Hours", action: "hours" },
            { label: "Location", action: "location" }
        ];
        
        this.init();
    }
    
    init() {
        this.createWidget();
        this.attachEventListeners();
        
        // Show greeting after short delay
        setTimeout(() => {
            this.addBotMessage(this.botResponses.greeting);
            this.renderQuickActions();
        }, 1000);
    }
    
    createWidget() {
        this.container = document.createElement('div');
        this.container.className = 'chat-widget';
        this.container.innerHTML = `
            <button class="chat-bubble" aria-label="Open chat">
                <span class="chat-bubble-icon">­ƒÆ¼</span>
                <span class="chat-unread-badge" style="display: none;">1</span>
            </button>
            
            <div class="chat-window">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <img src="assets/brand_icon_optimized.webp" alt="Blancbeu" class="chat-avatar">
                        <div>
                            <div class="chat-header-title">Blancbeu Support</div>
                            <div class="chat-status">Online</div>
                        </div>
                    </div>
                    <button class="chat-close" aria-label="Close chat">Ô£ò</button>
                </div>
                
                <div class="chat-messages"></div>
                
                <div class="chat-quick-actions"></div>
                
                <div class="chat-input-area">
                    <input type="text" class="chat-input" placeholder="Type a message...">
                    <button class="chat-send" aria-label="Send message">Ô×ñ</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.container);
    }
    
    attachEventListeners() {
        const bubble = this.container.querySelector('.chat-bubble');
        const closeBtn = this.container.querySelector('.chat-close');
        const input = this.container.querySelector('.chat-input');
        const sendBtn = this.container.querySelector('.chat-send');
        
        bubble.addEventListener('click', () => this.toggle());
        closeBtn.addEventListener('click', () => this.close());
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.isOpen = true;
        this.container.querySelector('.chat-window').classList.add('open');
        this.container.querySelector('.chat-bubble').classList.add('active');
        this.container.querySelector('.chat-unread-badge').style.display = 'none';
        this.container.querySelector('.chat-input').focus();
    }
    
    close() {
        this.isOpen = false;
        this.container.querySelector('.chat-window').classList.remove('open');
        this.container.querySelector('.chat-bubble').classList.remove('active');
    }
    
    sendMessage() {
        const input = this.container.querySelector('.chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addUserMessage(message);
        input.value = '';
        
        // Simulate bot response after delay
        setTimeout(() => {
            this.processUserMessage(message);
        }, 500 + Math.random() * 1000);
    }
    
    addUserMessage(text) {
        this.messages.push({ type: 'user', text });
        this.renderMessage({ type: 'user', text });
    }
    
    addBotMessage(text) {
        this.messages.push({ type: 'bot', text });
        this.renderMessage({ type: 'bot', text });
        
        // Show unread badge if chat is closed
        if (!this.isOpen) {
            this.container.querySelector('.chat-unread-badge').style.display = 'flex';
        }
    }
    
    renderMessage(message) {
        const messagesContainer = this.container.querySelector('.chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${message.type}`;
        messageEl.textContent = message.text;
        
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    renderQuickActions() {
        const container = this.container.querySelector('.chat-quick-actions');
        container.innerHTML = this.quickActions.map(action => `
            <button class="quick-action-btn" data-action="${action.action}">
                ${action.label}
            </button>
        `).join('');
        
        container.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.addBotMessage(this.botResponses[action] || this.botResponses.default);
            });
        });
    }
    
    processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        let response = this.botResponses.default;
        
        if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('treatment')) {
            response = this.botResponses.services;
        } else if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
            response = this.botResponses.booking;
        } else if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('time')) {
            response = this.botResponses.hours;
        } else if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('address')) {
            response = this.botResponses.location;
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = this.botResponses.greeting;
        }
        
        this.addBotMessage(response);
    }
}

USAGE:
------
const chatWidget = new ChatWidget();


================================================================================
PHASE 2: ADVANCED FEATURES - JAVASCRIPT IMPLEMENTATIONS
================================================================================

ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
6.0 MEMBERSHIP TIER CALCULATOR
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

class MembershipCalculator {
    constructor() {
        this.tiers = {
            gold: {
                name: 'Gold',
                price: 999,
                discount: 0.05,  // 5%
                benefits: ['5% off all services', 'Priority booking']
            },
            platinum: {
                name: 'Platinum',
                price: 1999,
                discount: 0.10,  // 10%
                benefits: ['10% off all services', 'Free birthday treatment', 'Early access']
            },
            diamond: {
                name: 'Diamond',
                price: 3999,
                discount: 0.15,  // 15%
                benefits: ['15% off all services', 'VIP lounge access', 'Complimentary drinks', 'Free monthly treatment']
            }
        };
    }
    
    calculateSavings(tier, annualSpend) {
        const tierData = this.tiers[tier];
        if (!tierData) return null;
        
        const savings = annualSpend * tierData.discount;
        const netSavings = savings - tierData.price;
        const roi = (netSavings / tierData.price * 100).toFixed(0);
        
        return {
            grossSavings: savings,
            membershipCost: tierData.price,
            netSavings,
            roi: netSavings > 0 ? roi : 0,
            worthIt: netSavings > 0
        };
    }
    
    recommendTier(annualSpend) {
        let bestTier = null;
        let bestSavings = -Infinity;
        
        for (const [tierKey, tierData] of Object.entries(this.tiers)) {
            const result = this.calculateSavings(tierKey, annualSpend);
            if (result.netSavings > bestSavings) {
                bestSavings = result.netSavings;
                bestTier = tierKey;
            }
        }
        
        return bestTier;
    }
}


ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
7.0 FAQ ACCORDION
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

class FAQAccordion {
    constructor(container) {
        this.container = document.querySelector(container);
        this.items = this.container.querySelectorAll('.faq-item');
        this.allowMultiple = false;  // Only one open at a time
        
        this.init();
    }
    
    init() {
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                if (!this.allowMultiple) {
                    this.closeAll();
                }
                
                if (!isOpen) {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    item.classList.remove('open');
                    answer.style.maxHeight = '0';
                }
            });
        });
    }
    
    closeAll() {
        this.items.forEach(item => {
            item.classList.remove('open');
            item.querySelector('.faq-answer').style.maxHeight = '0';
        });
    }
}


ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
8.0 GIFT CARD SYSTEM
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

class GiftCardManager {
    constructor() {
        this.cards = [];
        this.presetAmounts = [500, 1000, 2000, 5000];
    }
    
    generateCardCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'BB-';
        for (let i = 0; i < 12; i++) {
            if (i === 4 || i === 8) code += '-';
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;  // e.g., BB-ABCD-EFGH-IJKL
    }
    
    createGiftCard(amount, recipientName, recipientEmail, message, senderName) {
        const card = {
            code: this.generateCardCode(),
            amount,
            balance: amount,
            recipientName,
            recipientEmail,
            message,
            senderName,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),  // 1 year
            isActive: true
        };
        
        this.cards.push(card);
        this.sendGiftCardEmail(card);
        
        return card;
    }
    
    redeemCard(code, amount) {
        const card = this.cards.find(c => c.code === code);
        
        if (!card) return { success: false, error: 'Invalid card code' };
        if (!card.isActive) return { success: false, error: 'Card is no longer active' };
        if (card.expiresAt < new Date()) return { success: false, error: 'Card has expired' };
        if (amount > card.balance) return { success: false, error: 'Insufficient balance' };
        
        card.balance -= amount;
        if (card.balance === 0) card.isActive = false;
        
        return { 
            success: true, 
            remainingBalance: card.balance,
            message: `Ôé╣${amount} redeemed successfully!`
        };
    }
    
    checkBalance(code) {
        const card = this.cards.find(c => c.code === code);
        if (!card) return null;
        
        return {
            balance: card.balance,
            isActive: card.isActive,
            expiresAt: card.expiresAt
        };
    }
    
    async sendGiftCardEmail(card) {
        // Integration with email service
        console.log('Sending gift card email to:', card.recipientEmail);
        // await emailService.send({...})
    }
}


ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü
9.0 REFERRAL PROGRAM
ÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöüÔöü

class ReferralProgram {
    constructor() {
        this.referrerReward = 200;   // Ôé╣200 for referrer
        this.refereeDiscount = 100;  // Ôé╣100 off for new customer
    }
    
    generateReferralCode(userId) {
        return `REF-${userId.substring(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    }
    
    async processReferral(referralCode, newCustomerId) {
        // Find referrer
        const referrer = await this.findReferrerByCode(referralCode);
        if (!referrer) return { success: false, error: 'Invalid referral code' };
        
        // Apply rewards
        await this.creditReward(referrer.id, this.referrerReward);
        await this.applyDiscount(newCustomerId, this.refereeDiscount);
        
        // Track referral
        await this.recordReferral(referrer.id, newCustomerId, referralCode);
        
        return {
            success: true,
            referrerReward: this.referrerReward,
            refereeDiscount: this.refereeDiscount
        };
    }
    
    generateShareLinks(code) {
        const baseUrl = 'https://blancbeu.com';
        const message = encodeURIComponent(`Get Ôé╣${this.refereeDiscount} off your first visit at Blancbeu Beauty Salon! Use my referral code: ${code}`);
        
        return {
            whatsapp: `https://wa.me/?text=${message}%20${baseUrl}/ref/${code}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${baseUrl}/ref/${code}`,
            twitter: `https://twitter.com/intent/tweet?text=${message}&url=${baseUrl}/ref/${code}`,
            copy: `${baseUrl}/ref/${code}`
        };
    }
}


================================================================================
INITIALIZATION
================================================================================

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Phase 0: Visual Effects
    new ScrollReveal({ threshold: 0.15, staggerDelay: 100 });
    new ParallaxManager();
    
    // Apply magnetic effect to premium buttons
    document.querySelectorAll('.hero-btn, .book-service-btn, .tier-cta').forEach(btn => {
        new MagneticButton(btn, { strength: 0.3 });
    });
    
    // Apply ripple effect to all buttons
    document.querySelectorAll('button, .btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
    
    // Initialize confetti for booking success
    window.confetti = new ConfettiBurst({
        colors: ['#FFD700', '#FFB6C1', '#FFFFFF', '#F7E7CE'],
        count: 80
    });
    
    // Initialize skeleton loader
    window.skeletonLoader = new SkeletonLoader();
    
    // Phase 1: Core Features (uncomment when ready)
    // new ServiceFilter({ ... });
    // new AvailabilityCalendar({ ... });
    // new StaffCarousel({ ... });
    // new ChatWidget();
    
    // Phase 2: Advanced Features (uncomment when ready)
    // new FAQAccordion('.faq-container');
    // window.giftCards = new GiftCardManager();
    // window.referralProgram = new ReferralProgram();
    // window.membershipCalc = new MembershipCalculator();
});

================================================================================
*/

// ===== Smart Cache Update System =====
let lastKnownVersion = null;

async function initUpdateChecker() {
    try {
        // Get stored version from localStorage
        const storedVersion = localStorage.getItem('blancbeu_version');
        const storedTimestamp = localStorage.getItem('blancbeu_timestamp');

        // Fetch latest version from server (always from network)
        const versionResponse = await fetch('/version.json?t=' + Date.now(), {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
        });

        if (versionResponse.ok) {
            const serverVersion = await versionResponse.json();
            const serverTimestamp = serverVersion.timestamp;

            lastKnownVersion = serverVersion;

            // Check if this is first load or if server has newer version
            const isFirstLoad = !storedVersion || !storedTimestamp;
            const hasNewerVersion = serverTimestamp > parseInt(storedTimestamp || 0);

            if (isFirstLoad) {
                console.log('­ƒÄë First time load - caching version', serverVersion.version);
                localStorage.setItem('blancbeu_version', serverVersion.version);
                localStorage.setItem('blancbeu_timestamp', serverTimestamp);
            } else if (hasNewerVersion) {
                console.warn('­ƒöä Newer version detected! Clearing cache and reloading...');
                console.log('Old version:', storedVersion, '| New version:', serverVersion.version);

                // Clear all cache and cookies
                await clearAllCacheAndCookies();

                // Update stored version
                localStorage.setItem('blancbeu_version', serverVersion.version);
                localStorage.setItem('blancbeu_timestamp', serverTimestamp);

                // Notify service worker to clear cache
                if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        type: 'CLEAR_CACHE'
                    });
                }

                // Force reload with fresh content
                window.location.reload(true);
            } else {
                console.log('Ô£à Cache is fresh - version', storedVersion);
                localStorage.setItem('blancbeu_version', serverVersion.version);
            }
        }
    } catch (error) {
        console.log('Ôä╣´©Å Could not check for updates:', error.message);
        // Continue app loading even if version check fails
    }
}

async function clearAllCacheAndCookies() {
    try {
        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Clear localStorage (except version info and theme preference which we need to preserve)
        const versionData = {
            version: localStorage.getItem('blancbeu_version'),
            timestamp: localStorage.getItem('blancbeu_timestamp'),
            theme: localStorage.getItem('theme')
        };
        localStorage.clear();
        localStorage.setItem('blancbeu_version', versionData.version);
        localStorage.setItem('blancbeu_timestamp', versionData.timestamp);
        if (versionData.theme) {
            localStorage.setItem('theme', versionData.theme);
        }

        // Clear sessionStorage
        sessionStorage.clear();

        // Clear all caches (for service worker)
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
        }

        console.log('Ô£¿ All cache and cookies cleared!');
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}

const servicesData = {
    groups: [
        {
            group: "Hair cutting",
            icon: "Ô£é´©Å",
            image: "assets/service_images/professional_hair_st_3fab25e9.webp",
            services: [
                { name: "Plain Haircut", price: 100, offerPrice: 99 },
                { name: "U-Cut", price: 150, offerPrice: 99 },
                { name: "V-Cut", price: 150, offerPrice: 99 },
                { name: "Deep U-Cut", price: 200, offerPrice: 99 },
                { name: "Deep V-Cut", price: 200, offerPrice: 99 },
                { name: "Step Cut", price: 300, offerPrice: 99 },
                { name: "Layer Cut", price: 500, offerPrice: 99 },
                { name: "Butterfly Cut", price: 500, offerPrice: 99 },
                { name: "Bob Cut", price: 400, offerPrice: 99 },
                { name: "Baby Cut", price: 200, offerPrice: 99 },
                { name: "Advance Haircut", price: 600, offerPrice: 99 },
                { name: "Feather Cut", price: 450, offerPrice: 99 },
                { name: "Pixie Cut", price: 500, offerPrice: 99 }
            ]
        },
        {
            group: "Clean up",
            icon: "Ô£¿",
            image: "assets/service_images/beautiful_woman_gett_9dc7243a.webp",
            services: [
                { name: "Fruit Cleanup", price: 500, offerPrice: 250 },
                { name: "Diamond Cleanup", price: 800, offerPrice: 499 },
                { name: "Gold Cleanup", price: 1000, offerPrice: 599 },
                { name: "Charcoal Cleanup", price: 700, offerPrice: 399 }
            ]
        },
        {
            group: "Facial",
            icon: "­ƒÆå",
            image: "assets/service_images/facial_new.webp",
            services: [
                { name: "Lotus Professional Facial", price: 1500, offerPrice: 699 },
                { name: "03+ Facial", price: 1500, offerPrice: 699 },
                { name: "Fruit Facial", price: 1200, offerPrice: 599 },
                { name: "Gold Facial", price: 2000, offerPrice: 999 },
                { name: "Diamond Facial", price: 2500, offerPrice: 1299 },
                { name: "Anti-Aging Facial", price: 2200, offerPrice: 1199 }
            ]
        },
        {
            group: "Hairs & Treatment",
            icon: "­ƒÆç",
            image: "assets/service_images/professional_hair_st_673b25ad.webp",
            services: [
                { name: "Keratin", price: 2500, offerPrice: 1499 },
                { name: "Straightening/Smoothening", price: 3000, offerPrice: 1999 },
                { name: "Botox", price: 3500, offerPrice: 2499 },
                { name: "Rebounding", price: 3500, offerPrice: 2400 },
                { name: "Nanoplastia", price: 7000, offerPrice: 2999 },
                { name: "Hair Spa", price: 1500, offerPrice: 799 },
                { name: "Protein Treatment", price: 2000, offerPrice: 1199 },
                { name: "Anti-Dandruff Treatment", price: 1800, offerPrice: 999 }
            ]
        },
        {
            group: "Premium services",
            icon: "­ƒææ",
            image: "assets/service_images/premium_hair_spa_nourish.webp",
            services: [
                { name: "Head Massage", price: 250, offerPrice: 199 },
                { name: "Deep Nourish HairSpa", price: 1500, offerPrice: 799 },
                { name: "Full Body Massage", price: 5000, offerPrice: 999 },
                { name: "Blow Dry", price: 500, offerPrice: 199 },
                { name: "Aroma Therapy", price: 3000, offerPrice: 1499 },
                { name: "Hot Stone Massage", price: 3500, offerPrice: 1799 },
                { name: "Thai Massage", price: 4000, offerPrice: 1999 }
            ]
        },
        {
            group: "Hair colour",
            icon: "­ƒÄ¿",
            image: "assets/service_images/hair_colour_vibrant_pink.webp",
            services: [
                { name: "Global Hair Colour", price: 1199, offerPrice: null },
                { name: "Global Highlight", price: 1299, offerPrice: null },
                { name: "Highlight Perstrik", price: 149, offerPrice: null },
                { name: "Balayage", price: 2500, offerPrice: 1999 },
                { name: "Ombre", price: 2200, offerPrice: 1799 },
                { name: "Root Touch-Up", price: 599, offerPrice: 399 }
            ]
        },
        {
            group: "Makeup & Styling",
            icon: "­ƒÆä",
            image: "assets/service_images/makeup_styling_new.webp",
            services: [
                { name: "Party Makeup", price: 2000, offerPrice: 1499 },
                { name: "Bridal Makeup", price: 8000, offerPrice: 5999 },
                { name: "HD Makeup", price: 3500, offerPrice: 2499 },
                { name: "Airbrush Makeup", price: 4000, offerPrice: 2999 },
                { name: "Pre-Bridal Package", price: 15000, offerPrice: 9999 }
            ]
        },
        {
            group: "Nails & Beauty",
            icon: "­ƒÆà",
            image: "assets/service_images/nails_beauty_vibrant.webp",
            services: [
                { name: "Manicure", price: 500, offerPrice: 299 },
                { name: "Pedicure", price: 600, offerPrice: 349 },
                { name: "Gel Nails", price: 1500, offerPrice: 999 },
                { name: "Nail Art", price: 800, offerPrice: 499 },
                { name: "Threading", price: 100, offerPrice: 50 },
                { name: "Waxing Full Arms", price: 400, offerPrice: 299 },
                { name: "Waxing Full Legs", price: 600, offerPrice: 399 }
            ]
        }
    ]
};

const reviewsData = [
    {
        reviewer_name: "Nikita Kumari",
        reviewer_details: "1 review",
        rating_hearts: 5,
        review_date: "a month ago",
        review_text: "I recently visited BlancBeu Family beauty salon for a haircut and highlights, and I'm very impressed with the overall experience. The salon is beautiful and well-maintained!"
    },
    {
        reviewer_name: "Parwati Lohar",
        reviewer_details: "2 reviews",
        rating_hearts: 5,
        review_date: "9 month ago",
        review_text: "It was my first time visiting this salon, and I was nervous - but they made me feel so comfortable! The beautician listened to me patiently and suggested the perfect style."
    },
    {
        reviewer_name: "Rajendra Kumar Lohra",
        reviewer_details: "2 reviews",
        rating_hearts: 5,
        review_date: "a month ago",
        review_text: "My wife loves this place. She got her haircut and facial done that was awesome all service is wow! I've never been so happy with them. I'd highly recommend!"
    },
    {
        reviewer_name: "Ujala Oraon",
        reviewer_details: "4 reviews",
        rating_hearts: 5,
        review_date: "5 days ago",
        review_text: "Best service... I done my cleanup.. Thank you blanc beu"
    },
    {
        reviewer_name: "Fehran Saifi",
        reviewer_details: "1 review",
        rating_hearts: 5,
        review_date: "a month ago",
        review_text: "Highly recommended, all services are premium and result was very good in behaviour.. maine waha global highlight karwaya ­ƒÿì­ƒÿì­ƒÿìÔØñ´©Å"
    },
    {
        reviewer_name: "Aditi Singh",
        reviewer_details: "5 reviews",
        rating_hearts: 5,
        review_date: "2 months ago",
        review_text: "Such a great place! I was glad to have your pampering sessions, recently visited there, felt so comfortable..."
    }
];

let currentSlide = 0;
let carouselInterval;

function initCarousel() {
    const dots = document.getElementById('carouselDots');
    const slides = document.querySelectorAll('.carousel-slide');

    console.log(`­ƒÄá Carousel initialized with ${slides.length} slides`);

    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(index);
        dots.appendChild(dot);
    });

    startAutoPlay();
}

function startAutoPlay() {
    console.log('ÔûÂ´©Å Starting carousel auto-play');
    carouselInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

function moveCarousel(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    console.log(`­ƒöä Moving carousel: current=${currentSlide}, direction=${direction}`);

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + direction + slides.length) % slides.length;

    console.log(`Ô£à New slide: ${currentSlide}`);

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    clearInterval(carouselInterval);
    startAutoPlay();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    clearInterval(carouselInterval);
    startAutoPlay();
}



function renderReviews() {
    const container = document.getElementById('reviewsContainer');

    // Skip if container doesn't exist (reviews converted to testimonial carousel)
    if (!container) return;

    reviewsData.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';

        const stars = 'Ôÿà'.repeat(review.rating_hearts || 5);

        reviewCard.innerHTML = `
      <div class="review-header">
        <div class="reviewer-info">
          <h4>${review.reviewer_name}</h4>
          <p class="reviewer-details">${review.reviewer_details}</p>
        </div>
        <div class="rating">
          ${stars.split('').map(star => `<span class="star">${star}</span>`).join('')}
        </div>
      </div>
      <p class="review-text">${review.review_text}</p>
      <p class="review-date">${review.review_date}</p>
    `;

        container.appendChild(reviewCard);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return; // Skip empty anchors

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function showTC() {
    const modal = document.getElementById('tcModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeTC() {
    const modal = document.getElementById('tcModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function (event) {
    const modal = document.getElementById('tcModal');
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

class ScrollBehaviorManager {
    constructor() {
        this.lastScroll = 0;
        this.scrollThreshold = 5;
        this.header = null;
        this.bottomNav = null;
        this.fireworksResumeTimer = null;
        this.isScrolling = false;
        this.fireworksWerePausedByScroll = false;
        this.ticking = false; // For requestAnimationFrame throttling
    }

    init() {
        this.header = document.getElementById('mainHeader');
        this.bottomNav = document.getElementById('bottomNav');

        if (!this.header) {
            console.warn('ÔØî Header element not found - navbar auto-hide disabled');
        }

        if (!this.bottomNav) {
            console.warn('ÔØî Bottom nav element not found - bottom nav auto-hide disabled');
        }
        window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    }

    onScroll() {
        // Use requestAnimationFrame for smooth, throttled scroll handling
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.handleScroll();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        this.updateNavbarVisibility(currentScroll);

        this.handleFireworksScroll();

        this.lastScroll = currentScroll;
    }

    updateNavbarVisibility(currentScroll) {
        // NOTE: Header visibility is now handled by nav_fix.js (YouTube-style)
        // This method only handles bottom nav at-bottom detection

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const isAtBottom = (currentScroll + windowHeight) >= (documentHeight - 50);

        // Always show bottom nav when at bottom of page
        if (isAtBottom) {
            if (this.bottomNav) this.bottomNav.classList.remove('hidden');
        }
    }

    handleFireworksScroll() {
        if (typeof togglePause !== 'function' || typeof store === 'undefined') {
            return;
        }

        if (!this.isScrolling) {
            this.isScrolling = true;

            const wasAlreadyPaused = store.state && store.state.paused;

            if (!wasAlreadyPaused) {
                this.fireworksWerePausedByScroll = true;
                togglePause(true);
            } else {
                this.fireworksWerePausedByScroll = false;
            }
        }

        clearTimeout(this.fireworksResumeTimer);

        // Resume fireworks after 0.5 seconds of no scrolling
        this.fireworksResumeTimer = setTimeout(() => {
            this.isScrolling = false;
            if (this.fireworksWerePausedByScroll) {
                togglePause(false);
                this.fireworksWerePausedByScroll = false;
            }
        }, 500);
    }
}

function initScrollBehavior() {
    const scrollManager = new ScrollBehaviorManager();
    scrollManager.init();
}

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    renderServices();
    renderReviews();
    initServiceFiltering();
    initSmoothScroll();
    initScrollBehavior();
});

let deferredPrompt;
let installButton;

function updateInstallButtonVisibility() {
    const navInstallBtn = document.getElementById('installBtn');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://') ||
        sessionStorage.getItem('isStandalone') === 'true' ||
        sessionStorage.getItem('appInstalled') === 'true';

    if (navInstallBtn) {
        if (isStandalone || !deferredPrompt) {
            navInstallBtn.style.display = 'none';
            console.log('­ƒöÆ Install button hidden - app is installed or cannot be installed');
        } else {
            navInstallBtn.style.display = 'flex';
            console.log('­ƒô▓ Install button visible - app can be installed');
        }
    }
}

function initPWA() {
    const navInstallBtn = document.getElementById('installBtn');

    // Initial check - hide button if already installed
    updateInstallButtonVisibility();

    // Monitor display mode changes
    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    displayModeQuery.addListener(() => updateInstallButtonVisibility());

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('­ƒô▓ PWA Install prompt available');
        e.preventDefault();
        deferredPrompt = e;

        // Show nav install button only if not standalone
        if (!checkIfStandalone() && navInstallBtn) {
            navInstallBtn.style.display = 'flex';
            console.log('Ô£à Showing install button - prompt is available');
        }
        showInstallPromotion();
    });

    window.addEventListener('appinstalled', () => {
        console.log('Ô£à PWA was installed successfully');
        sessionStorage.setItem('appInstalled', 'true');
        sessionStorage.setItem('isStandalone', 'true');
        deferredPrompt = null;

        // Hide install button
        updateInstallButtonVisibility();
        hideInstallPromotion();
    });

    // Nav button click handler
    if (navInstallBtn) {
        navInstallBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                try {
                    await deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`User response: ${outcome}`);
                    if (outcome === 'accepted') {
                        sessionStorage.setItem('appInstalled', 'true');
                        sessionStorage.setItem('isStandalone', 'true');
                    }
                    deferredPrompt = null;
                    updateInstallButtonVisibility();
                } catch (error) {
                    console.error('Install error:', error);
                }
            }
        });
    }

    const isStandalone = checkIfStandalone();

    if (!isStandalone && !deferredPrompt) {
        setTimeout(() => {
            showBrowserSpecificInstallPrompt();
        }, 5000);
    }
}

function showInstallPromotion() {
    const isStandalone = checkIfStandalone();
    if (isStandalone || sessionStorage.getItem('installPromptDismissed') === 'true') {
        return;
    }

    if (!installButton) {
        installButton = document.createElement('div');
        installButton.className = 'install-banner';
        installButton.innerHTML = `
            <div class="install-area-1-model">
                <img src="assets/install_model_new.png" alt="Install App" class="install-model-img">
            </div>
            <div class="install-content-wrapper">
                <div class="install-row-top">
                    <div class="install-area-2-button">
                        <button id="pwaInstallBtn" class="pwa-install-btn">Install App</button>
                    </div>
                    <div class="install-area-4-close">
                        <button id="pwaCloseBtn" class="pwa-close-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                        </button>
                    </div>
                </div>
                <div class="install-area-3-text">
                    Install the app for better experience.
                </div>
            </div>
        `;

        document.body.appendChild(installButton);

        // Add event listeners after appending to DOM
        const installBtn = document.getElementById('pwaInstallBtn');
        const closeBtn = document.getElementById('pwaCloseBtn');

        if (installBtn) {
            installBtn.onclick = async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`User response to install prompt: ${outcome}`);
                    if (outcome === 'accepted') {
                        sessionStorage.setItem('appInstalled', 'true');
                    } else {
                        sessionStorage.setItem('installPromptDismissed', 'true');
                    }
                    deferredPrompt = null;
                    hideInstallPromotion();
                } else {
                    showBrowserSpecificInstructions();
                }
            };
        }

        if (closeBtn) {
            closeBtn.onclick = () => {
                hideInstallPromotion();
                sessionStorage.setItem('installPromptDismissed', 'true');
            };
        }
    }

    setTimeout(() => {
        if (installButton) {
            installButton.classList.add('show');
        }
    }, 3000);
}

function showBrowserSpecificInstallPrompt() {
    const isStandalone = checkIfStandalone();
    if (isStandalone || sessionStorage.getItem('installPromptDismissed') === 'true') {
        return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    if (isIOS || isSafari || isFirefox) {
        showInstallPromotion();
    }
}

function showBrowserSpecificInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    let message = '';

    if (isIOS || isSafari) {
        message = 'To install this app:\n\n1. Tap the Share button (box with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right corner';
    } else if (isFirefox) {
        message = 'To install this app:\n\n1. Tap the menu button (three dots)\n2. Tap "Install"\n3. Follow the prompts to add to home screen';
    } else {
        message = 'To install this app:\n\nPlease use your browser\'s menu to add this website to your home screen.';
    }

    alert(message);
}

function hideInstallPromotion() {
    if (installButton) {
        installButton.classList.remove('show');
        setTimeout(() => {
            if (installButton && installButton.parentNode) {
                installButton.parentNode.removeChild(installButton);
                installButton = null;
            }
        }, 300);
    }
}

function checkIfStandalone() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');

    if (isStandalone) {
        console.log('­ƒÄë App is running in standalone (installed) mode');
        sessionStorage.setItem('appInstalled', 'true');
        sessionStorage.setItem('isStandalone', 'true');
        showSplashScreen();
        updateInstallButtonVisibility();
    }

    return isStandalone;
}

function showSplashScreen() {
    const splash = document.getElementById('pwaSplash');
    if (splash) {
        splash.classList.remove('hidden');

        setTimeout(() => {
            hideSplashScreen();
        }, 2500);
    }
}

function hideSplashScreen() {
    const splash = document.getElementById('pwaSplash');
    if (splash) {
        splash.classList.add('hidden');
    }
}

// Service Worker removed to ensure fresh reloads
window.addEventListener('load', () => {
    initPWA();
});

// ========================================
// iOS-Style Bottom Navigation Controller
// ========================================

class BottomNavController {
    constructor() {
        this.bottomNav = document.getElementById('bottomNav');
        this.navItems = document.querySelectorAll('.nav-item');
        this.ticking = false;
        this.sections = [];

        this.init();
    }

    init() {
        if (!this.bottomNav) {
            console.log('ÔØî Bottom nav element not found');
            return;
        }

        console.log('Ô£à Bottom nav controller initialized (scrollspy only)');

        // Initialize sections for scrollspy
        this.initSections();

        // Set up scroll listener for scrollspy ONLY (not for hide/show)
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

        // Handle hash changes
        window.addEventListener('hashchange', this.handleHashChange.bind(this));

        // Handle nav item clicks
        this.navItems.forEach(item => {
            item.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Initial active state
        this.updateActiveState();
    }

    initSections() {
        const sectionIds = ['home', 'offers', 'services', 'gallery', 'reviews'];
        this.sections = sectionIds
            .map(id => document.getElementById(id))
            .filter(section => section !== null)
            .map(section => ({
                id: section.id,
                element: section,
                offsetTop: section.offsetTop,
                offsetBottom: section.offsetTop + section.offsetHeight
            }));
    }

    handleScroll() {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.updateActiveState();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateActiveState() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        // Find current section
        let currentSection = this.sections[0]?.id || 'home';

        for (const section of this.sections) {
            if (scrollPosition >= section.offsetTop) {
                currentSection = section.id;
            }
        }

        // Update active nav item
        this.navItems.forEach(item => {
            const page = item.getAttribute('data-page');
            if (page === currentSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    handleHashChange() {
        const hash = window.location.hash.slice(1);
        this.setActivePage(hash || 'home');
    }

    handleNavClick(event) {
        const item = event.currentTarget;
        const page = item.getAttribute('data-page');

        // Don't prevent default for external links (like WhatsApp)
        if (item.getAttribute('href').startsWith('http')) {
            return;
        }

        // Smooth scroll to section
        const section = document.getElementById(page);
        if (section) {
            event.preventDefault();
            const offsetTop = section.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Update URL hash without jumping
            history.pushState(null, '', `#${page}`);
            this.setActivePage(page);
        }
    }

    setActivePage(page) {
        this.navItems.forEach(item => {
            const itemPage = item.getAttribute('data-page');
            if (itemPage === page) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// Initialize bottom nav controller when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BottomNavController();
    });
} else {
    new BottomNavController();
}

// Visibility-based animation for offer cards
class OfferCardAnimationController {
    constructor() {
        this.offerCards = document.querySelectorAll('.offer-card');
        this.init();
    }

    init() {
        if (!this.offerCards.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                } else {
                    entry.target.classList.remove('animate');
                }
            });
        }, observerOptions);

        this.offerCards.forEach(card => observer.observe(card));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new OfferCardAnimationController();
    });
} else {
    new OfferCardAnimationController();
}

class ThemeController {
    constructor() {
        this.themeToggleBtn = document.getElementById('themeToggle');
        this.html = document.documentElement;
        this.body = document.body;

        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            if (savedTheme === 'dark') {
                this.enableDarkMode();
            } else {
                this.enableLightMode();
            }
        } else {
            // Default to light mode for new users
            this.enableLightMode();
        }

        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const currentTheme = this.html.getAttribute('data-theme');
        if (currentTheme === 'light') {
            this.enableDarkMode();
            localStorage.setItem('theme', 'dark');
        } else {
            this.enableLightMode();
            localStorage.setItem('theme', 'light');
        }
    }

    enableLightMode() {
        // Set data-theme attribute to trigger CSS variable changes
        this.html.setAttribute('data-theme', 'light');
        // Keep light-mode class for legacy animations
        this.body.classList.add('light-mode');

        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#fef5e7');
    }

    enableDarkMode() {
        // Set data-theme attribute to trigger CSS variable changes
        this.html.removeAttribute('data-theme');
        // Remove light-mode class
        this.body.classList.remove('light-mode');

        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#000000');
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ThemeController();
    });
} else {
    new ThemeController();
}

// ===== APP SHELL NAVIGATION CONTROLLER =====
class AppShellNavigator {
    constructor() {
        this.currentPage = 'home';
        this.contentArea = document.getElementById('appContent');
        this.bottomNav = document.getElementById('bottomNav');
        this.pageScrollPositions = {}; // Store scroll position for each page in memory
        this.init();
    }

    init() {
        // Setup bottom nav click handlers
        const navItems = this.bottomNav.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const isExternalLink = item.href && item.href.includes('wa.me');
                if (!isExternalLink) {
                    e.preventDefault();
                    const page = item.getAttribute('data-page');
                    this.navigateTo(page);
                }
            });
        });

        // Handle hash navigation from desktop nav
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash) {
                this.navigateTo(hash);
            }
        });

        // Save scroll position when scrolling - use window scroll
        window.addEventListener('scroll', () => {
            this.pageScrollPositions[this.currentPage] = window.scrollY;
            console.log(`­ƒôì Page scroll saved - ${this.currentPage}: ${window.scrollY}px`);
        }, { passive: true });
    }

    navigateTo(page) {
        if (!page || page === '') page = 'home'; // Default to home if page is empty

        // If same page clicked: just scroll to top (no page transition)
        if (page === this.currentPage) {
            window.scrollTo(0, 0);
            console.log(`Ô¼å´©Å Same page, scrolling to top`);
            return;
        }

        // Save current page scroll position IMMEDIATELY
        this.pageScrollPositions[this.currentPage] = window.scrollY;
        console.log(`­ƒÆ¥ Saved ${this.currentPage} at: ${this.pageScrollPositions[this.currentPage]}px`);

        // Hide ALL sections from current page
        const currentPages = this.contentArea.querySelectorAll(`[data-page="${this.currentPage}"]`);
        currentPages.forEach(el => el.classList.remove('active'));

        // Show ALL sections of new page
        const newPages = this.contentArea.querySelectorAll(`[data-page="${page}"]`);
        newPages.forEach(el => el.classList.add('active'));

        // Update bottom nav
        const navItems = this.bottomNav.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-page') === page) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        this.currentPage = page;

        // Restore last saved scroll position for this page
        const savedPosition = this.pageScrollPositions[page] || 0;
        requestAnimationFrame(() => {
            window.scrollTo(0, savedPosition);
            console.log(`­ƒöä Restored ${page} to: ${savedPosition}px`);
        });
    }
}

// Initialize app shell after DOM is ready
// NOTE: AppShellNavigator is DISABLED - nav_fix.js now handles navigation and scroll memory
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // window.appShell = new AppShellNavigator(); // Disabled: nav_fix.js handles this
        initNotificationsController();
        initBookingsController();
    });
} else {
    // window.appShell = new AppShellNavigator(); // Disabled: nav_fix.js handles this
    initNotificationsController();
    initBookingsController();
}

// ===== NOTIFICATIONS PAGE CONTROLLER =====
function initNotificationsController() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const notificationCards = document.querySelectorAll('.notification-card');
    const dismissBtns = document.querySelectorAll('.dismiss-btn');
    const actionBtns = document.querySelectorAll('.action-btn');
    const quickActionChips = document.querySelectorAll('.quick-action-chip');
    const settingsBtn = document.querySelector('.notifications-settings-btn');

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter notification cards and sections
            let visibleCount = 0;
            notificationCards.forEach(card => {
                const cardType = card.getAttribute('data-type');
                if (filter === 'all' || cardType === filter) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            checkEmptyState();
            console.log(`­ƒöì Filtered to '${filter}' - ${visibleCount} notifications visible`);
        });
    });

    // Dismiss notification
    dismissBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.notification-card');
            card.style.animation = 'slideOutNotification 0.3s ease-out forwards';
            setTimeout(() => {
                card.remove();
                checkEmptyState();
                console.log('­ƒùæ´©Å Notification dismissed');
            }, 300);
        });
    });

    // Action buttons feedback
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.classList.contains('dismiss-btn')) return;
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => { btn.style.transform = ''; }, 200);
        });
    });

    // Quick action chips
    quickActionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const action = chip.getAttribute('data-action');
            if (action === 'mark-all-read') {
                notificationCards.forEach(card => {
                    card.setAttribute('data-unread', 'false');
                    card.style.animation = 'slideInNotification 0.3s ease-out';
                });
                console.log('Ô£à All marked as read');
            } else if (action === 'clear-all') {
                notificationCards.forEach(card => {
                    card.style.animation = 'slideOutNotification 0.3s ease-out forwards';
                    setTimeout(() => card.remove(), 300);
                });
                setTimeout(checkEmptyState, 300);
                console.log('­ƒùæ´©Å All notifications cleared');
            }
        });
    });

    // Settings button
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            alert('ÔÜÖ´©Å Notification settings coming soon!');
        });
    }

    // Add animation keyframe
    if (!document.querySelector('style[data-notif-anim]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notif-anim', 'true');
        style.textContent = `
            @keyframes slideOutNotification {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }

    function checkEmptyState() {
        const allCards = document.querySelectorAll('.notification-card');
        const emptyState = document.querySelector('.notifications-container .empty-state');
        if (allCards.length === 0 && emptyState) {
            emptyState.style.display = 'block';
        } else if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    console.log('Ô£à Notifications controller initialized with enhanced features');
}

// ===== BOOKINGS PAGE CONTROLLER =====
function initBookingsController() {
    const bookingTabs = document.querySelectorAll('.booking-tab');
    const bookingCards = document.querySelectorAll('.booking-card');
    const actionBtns = document.querySelectorAll('.booking-action-btn');
    const filterBtn = document.querySelector('.bookings-filter-btn');

    // Tab filtering
    bookingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const status = tab.getAttribute('data-status');

            bookingTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            let visibleCount = 0;
            bookingCards.forEach(card => {
                const cardStatus = card.getAttribute('data-status');
                if (status === 'all' || cardStatus === status) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            checkEmptyBookings();
            console.log(`­ƒôà Filtered to '${status}' - ${visibleCount} bookings visible`);
        });
    });

    // Action buttons with visual feedback
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const btnText = btn.textContent;

            btn.style.transform = 'scale(0.95)';
            setTimeout(() => { btn.style.transform = ''; }, 200);

            if (btnText.includes('Cancel')) {
                if (confirm('Are you sure you want to cancel this booking?')) {
                    btn.closest('.booking-card').style.animation = 'slideOutNotification 0.3s ease-out forwards';
                    setTimeout(() => {
                        btn.closest('.booking-card').remove();
                        checkEmptyBookings();
                    }, 300);
                }
            } else if (btnText.includes('Reschedule')) {
                alert('­ƒôà Reschedule feature coming soon!');
            } else if (btnText.includes('Rebook')) {
                alert('Ô£à Rebook feature coming soon!');
            } else if (btnText.includes('Details')) {
                alert('­ƒôï Booking details coming soon!');
            }
        });
    });

    // Filter button
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            alert('­ƒöì Advanced filters coming soon!');
        });
    }

    function checkEmptyBookings() {
        const visibleCards = document.querySelectorAll('.booking-card[style*="display: flex"], .booking-card:not([style*="display: none"])');
        const emptyState = document.querySelector('.empty-state-bookings');

        if (visibleCards.length === 0 && emptyState) {
            emptyState.style.display = 'block';
        } else if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    console.log('Ô£à Bookings controller initialized');
}

// ===== CHAT PAGE FUNCTIONS =====
function openBlancbeuMaps() {
    window.open('https://maps.app.goo.gl/WYxp5QuhjXEiBaXE9', '_blank');
}

function openWhatsAppChat() {
    window.open('https://wa.me/919229915277', '_blank');
}


// ===== HERO TEXT ANIMATION ON LOAD =====
document.addEventListener('DOMContentLoaded', function () {
    const heroLines = document.querySelectorAll('.hero-text-line');
    heroLines.forEach((line, index) => {
        // Force styles immediately for better visibility
        line.style.opacity = '1';
        line.style.visibility = 'visible';
        line.style.display = 'block';
        line.style.color = '#FFD700';
        line.style.WebkitTextFillColor = '#FFD700';

        setTimeout(() => {
            line.style.opacity = '1';
        }, 200 + (index * 200));
    });

    // Also force the hero-text-section visibility
    const heroSection = document.querySelector('.hero-text-section');
    if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.visibility = 'visible';
        heroSection.style.display = 'block';
    }
});

// ===== STATS COUNTER ANIMATION =====
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(element => {
        const targetValue = parseInt(element.getAttribute('data-value'));
        let currentValue = 0;
        const duration = 2000; // 2 seconds
        const increment = targetValue / (duration / 50);

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
                // Add "+" sign after animation completes
                element.textContent = Math.floor(currentValue).toLocaleString() + '+';
            } else {
                element.textContent = Math.floor(currentValue).toLocaleString();
            }
        }, 50);
    });
}

// Trigger animation when section comes into view
function setupCounterAnimation() {
    const trustSection = document.querySelector('.trust-section');

    if (!trustSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(trustSection);
}

document.addEventListener('DOMContentLoaded', setupCounterAnimation);

// ===== SERVICE CAROUSEL FUNCTIONALITY =====
let serviceCarouselPosition = 0;

function slideServiceCarousel(direction) {
    const carousel = document.getElementById('serviceCarouselTrack');
    if (!carousel) return;

    const items = carousel.querySelectorAll('.service-card-item');
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth + 20; // 20px gap
    const containerWidth = carousel.parentElement.offsetWidth;
    const visibleItems = Math.floor(containerWidth / itemWidth);
    const maxPosition = Math.max(0, items.length - visibleItems);

    serviceCarouselPosition += direction;
    if (serviceCarouselPosition < 0) serviceCarouselPosition = 0;
    if (serviceCarouselPosition > maxPosition) serviceCarouselPosition = maxPosition;

    carousel.style.transform = `translateX(-${serviceCarouselPosition * itemWidth}px)`;
}

// Initialize service carousel on load
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('serviceCarouselTrack');
    if (carousel) {
        // Responsive carousel adjustment on resize
        window.addEventListener('resize', () => {
            const items = carousel.querySelectorAll('.service-card-item');
            const itemWidth = items[0].offsetWidth + 20;
            const containerWidth = carousel.parentElement.offsetWidth;
            const visibleItems = Math.floor(containerWidth / itemWidth);
            const maxPosition = Math.max(0, items.length - visibleItems);

            if (serviceCarouselPosition > maxPosition) {
                serviceCarouselPosition = maxPosition;
                carousel.style.transform = `translateX(-${serviceCarouselPosition * itemWidth}px)`;
            }
        });
    }
});

// ===== TESTIMONIAL CAROUSEL =====
let testimonialPosition = 0;

function slideTestimonial(direction) {
    const track = document.getElementById('testimonialTrack');
    if (!track) return;

    const items = track.querySelectorAll('.testimonial-card-item');
    testimonialPosition += direction;

    if (testimonialPosition < 0) testimonialPosition = items.length - 1;
    if (testimonialPosition >= items.length) testimonialPosition = 0;

    track.style.transform = `translateX(-${testimonialPosition * 100}%)`;
}

// Auto-advance testimonials every 8 seconds
document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => {
        if (document.getElementById('testimonialTrack')) {
            slideTestimonial(1);
        }
    }, 8000);
});

// ===== BEFORE & AFTER GALLERY =====
let baCurrentSlide = 0;
let baFilteredSlides = [];
let baAutoPlayInterval = null;

function initBeforeAfterGallery() {
    const slides = document.querySelectorAll('.ba-slide');
    const dotsContainer = document.getElementById('baDots');
    const filterBtns = document.querySelectorAll('.ba-filter-btn');

    if (!slides.length || !dotsContainer) return;

    baFilteredSlides = Array.from(slides);

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `ba-dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToBASlide(index);
        dotsContainer.appendChild(dot);
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterBASlides(category);
        });
    });

    // Initialize comparison sliders
    initComparisonSliders();

    // Auto-advance every 6 seconds
    baAutoPlayInterval = setInterval(() => slideBA(1), 6000);
}

function filterBASlides(category) {
    const slides = document.querySelectorAll('.ba-slide');
    const dotsContainer = document.getElementById('baDots');

    baCurrentSlide = 0;
    baFilteredSlides = [];

    slides.forEach(slide => {
        if (category === 'all' || slide.dataset.category === category) {
            baFilteredSlides.push(slide);
        }
        slide.classList.remove('active');
    });

    if (baFilteredSlides.length > 0) {
        baFilteredSlides[0].classList.add('active');
    }

    // Update dots
    dotsContainer.innerHTML = '';
    baFilteredSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `ba-dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToBASlide(index);
        dotsContainer.appendChild(dot);
    });
}

function slideBA(direction) {
    if (baFilteredSlides.length === 0) {
        baFilteredSlides = Array.from(document.querySelectorAll('.ba-slide'));
    }

    baFilteredSlides[baCurrentSlide].classList.remove('active');
    baCurrentSlide += direction;

    if (baCurrentSlide < 0) baCurrentSlide = baFilteredSlides.length - 1;
    if (baCurrentSlide >= baFilteredSlides.length) baCurrentSlide = 0;

    baFilteredSlides[baCurrentSlide].classList.add('active');
    updateBADots();
}

function goToBASlide(index) {
    baFilteredSlides[baCurrentSlide].classList.remove('active');
    baCurrentSlide = index;
    baFilteredSlides[baCurrentSlide].classList.add('active');
    updateBADots();
}

function updateBADots() {
    const dots = document.querySelectorAll('.ba-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === baCurrentSlide);
    });
}

function initComparisonSliders() {
    const sliders = document.querySelectorAll('.comparison-slider');

    sliders.forEach(slider => {
        const handle = slider.querySelector('.slider-handle');
        const beforeImg = slider.querySelector('.before-img');
        const beforeLabel = slider.querySelector('.before-label');
        const afterLabel = slider.querySelector('.after-label');
        let isDragging = false;

        // Touch tracking variables
        let startX = 0;
        let startY = 0;
        let isGestureLocked = false;
        let isHorizontalSwipe = false;

        function updateSlider(e) {
            // For touch events, handle gesture direction logic
            if (e.type === 'touchmove') {
                if (!isDragging) return;

                if (!isGestureLocked) {
                    const currentX = e.touches[0].clientX;
                    const currentY = e.touches[0].clientY;
                    const diffX = Math.abs(currentX - startX);
                    const diffY = Math.abs(currentY - startY);

                    // Lock gesture if movement is significant (> 5px)
                    if (diffX > 5 || diffY > 5) {
                        isGestureLocked = true;
                        // If horizontal movement is greater, it's a swipe -> PREVENT SCROLL
                        if (diffX > diffY) {
                            isHorizontalSwipe = true;
                        } else {
                            // Vertical movement -> ALLOW SCROLL (cancel drag)
                            isHorizontalSwipe = false;
                            isDragging = false;
                            return;
                        }
                    } else {
                        // Not moved enough yet to decide
                        return;
                    }
                }

                // If established as vertical scroll, do nothing (let browser scroll)
                if (!isHorizontalSwipe) {
                    isDragging = false;
                    return;
                }

                // If established as horizontal swipe, update slider and prevent scrolling
                if (e.cancelable) e.preventDefault();
            } else {
                // Mouse events (always drag)
                if (!isDragging) return;
                e.preventDefault(); // Prevent text selection
            }

            const rect = slider.getBoundingClientRect();
            let x = (e.clientX || e.touches[0].clientX) - rect.left;
            let percentage = (x / rect.width) * 100;

            percentage = Math.max(0, Math.min(100, percentage));

            beforeImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            handle.style.left = `${percentage}%`;

            // Dynamic Label Hiding - Pixel Perfect
            const handleX = (percentage / 100) * rect.width;

            if (beforeLabel) {
                const labelLeft = beforeLabel.offsetLeft;
                const labelWidth = beforeLabel.offsetWidth;

                // Calculate how much of the label is to the right of the handle
                // visibleWidth = handleX - labelLeft
                // hiddenWidth (Right side) = labelWidth - visibleWidth

                let clipRightP = ((labelWidth - (handleX - labelLeft)) / labelWidth) * 100;
                clipRightP = Math.max(0, Math.min(100, clipRightP));

                beforeLabel.style.clipPath = `inset(0 ${clipRightP}% 0 0)`;
            }

            if (afterLabel) {
                const labelLeft = afterLabel.offsetLeft;
                const labelWidth = afterLabel.offsetWidth;

                // Calculate how much of the label is to the left of the handle
                // hiddenWidth (Left side) = handleX - labelLeft

                let clipLeftP = ((handleX - labelLeft) / labelWidth) * 100;
                clipLeftP = Math.max(0, Math.min(100, clipLeftP));

                afterLabel.style.clipPath = `inset(0 0 0 ${clipLeftP}%)`;
            }
        }

        function startDrag(e) {
            isDragging = true;

            // Stop auto-play immediately on interaction
            if (baAutoPlayInterval) {
                clearInterval(baAutoPlayInterval);
                baAutoPlayInterval = null;
            }

            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isGestureLocked = false;
                isHorizontalSwipe = false;
            } else {
                e.preventDefault();
            }
        }

        function endDrag() {
            isDragging = false;
            isGestureLocked = false;
        }

        // Mouse events
        handle.addEventListener('mousedown', startDrag);
        slider.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', updateSlider);
        document.addEventListener('mouseup', endDrag);

        // Touch events - Improved options for better performance
        handle.addEventListener('touchstart', startDrag, { passive: false });
        slider.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', updateSlider, { passive: false });
        document.addEventListener('touchend', endDrag);
    });
}

document.addEventListener('DOMContentLoaded', initBeforeAfterGallery);

// ===== STAFF CAROUSEL =====
let staffPosition = 0;

function slideStaff(direction) {
    const carousel = document.getElementById('staffCarousel');
    if (!carousel) return;

    const cards = carousel.querySelectorAll('.staff-card');
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth + 30; // 30px gap
    const containerWidth = carousel.parentElement.offsetWidth; // utilizing full width
    const visibleCards = Math.floor(containerWidth / cardWidth);
    const maxPosition = Math.max(0, cards.length - visibleCards);

    staffPosition += direction;
    if (staffPosition < 0) staffPosition = 0;
    if (staffPosition > maxPosition) staffPosition = maxPosition;

    carousel.style.transform = `translateX(-${staffPosition * cardWidth}px)`;
}

// Auto-advance staff carousel every 5 seconds
document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => {
        const carousel = document.getElementById('staffCarousel');
        if (carousel) {
            const cards = carousel.querySelectorAll('.staff-card');
            const containerWidth = carousel.parentElement.offsetWidth;
            const cardWidth = cards[0]?.offsetWidth + 30 || 310;
            const visibleCards = Math.floor(containerWidth / cardWidth);
            const maxPosition = Math.max(0, cards.length - visibleCards);

            staffPosition++;
            if (staffPosition > maxPosition) staffPosition = 0;
            carousel.style.transform = `translateX(-${staffPosition * cardWidth}px)`;
        }
    }, 5000);
});

// ===== SAVINGS CALCULATOR =====
function initSavingsCalculator() {
    const slider = document.getElementById('monthlySpendSlider');
    const spendValue = document.getElementById('spendValue');
    const goldSavings = document.getElementById('goldSavings');
    const platinumSavings = document.getElementById('platinumSavings');
    const diamondSavings = document.getElementById('diamondSavings');

    if (!slider) return;

    const membershipCosts = { gold: 999, platinum: 2499, diamond: 4999 };
    const discountRates = { gold: 0.05, platinum: 0.15, diamond: 0.25 };

    function calculateSavings(monthlySpend) {
        const yearlySpend = monthlySpend * 12;

        const goldYearlySavings = (yearlySpend * discountRates.gold) - membershipCosts.gold;
        const platinumYearlySavings = (yearlySpend * discountRates.platinum) - membershipCosts.platinum;
        const diamondYearlySavings = (yearlySpend * discountRates.diamond) - membershipCosts.diamond;

        return {
            gold: Math.max(0, Math.round(goldYearlySavings)),
            platinum: Math.max(0, Math.round(platinumYearlySavings)),
            diamond: Math.max(0, Math.round(diamondYearlySavings))
        };
    }

    function updateDisplay() {
        const monthlySpend = parseInt(slider.value);
        spendValue.textContent = `Ôé╣${monthlySpend.toLocaleString('en-IN')}`;

        const savings = calculateSavings(monthlySpend);
        goldSavings.textContent = `Ôé╣${savings.gold.toLocaleString('en-IN')}/yr`;
        platinumSavings.textContent = `Ôé╣${savings.platinum.toLocaleString('en-IN')}/yr`;
        diamondSavings.textContent = `Ôé╣${savings.diamond.toLocaleString('en-IN')}/yr`;
    }

    slider.addEventListener('input', updateDisplay);
    updateDisplay();
}

document.addEventListener('DOMContentLoaded', initSavingsCalculator);

// ================================================================================
// PHASE 0: PREMIUM MICRO-INTERACTIONS - ACTUAL IMPLEMENTATIONS
// ================================================================================

// ===== RIPPLE EFFECT ON BUTTONS =====
function createRipple(e) {
    const button = e.currentTarget;
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();

    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,215,0,0.5) 0%, transparent 70%);
        transform: scale(0);
        animation: rippleExpand 0.6s ease-out forwards;
        pointer-events: none;
    `;

    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}

// ===== MAGNETIC BUTTON EFFECT =====
class MagneticButton {
    constructor(element, strength = 0.3) {
        this.element = element;
        this.strength = strength;
        this.bounds = null;
        this.position = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        this.animating = false;

        this.element.addEventListener('mouseenter', () => this.onEnter());
        this.element.addEventListener('mousemove', (e) => this.onMove(e));
        this.element.addEventListener('mouseleave', () => this.onLeave());
    }

    onEnter() {
        this.bounds = this.element.getBoundingClientRect();
        if (!this.animating) {
            this.animating = true;
            this.animate();
        }
    }

    onMove(e) {
        if (!this.element || !this.element.isConnected) return;
        this.bounds = this.element.getBoundingClientRect();
        const centerX = this.bounds.left + this.bounds.width / 2;
        const centerY = this.bounds.top + this.bounds.height / 2;
        this.target.x = (e.clientX - centerX) * this.strength;
        this.target.y = (e.clientY - centerY) * this.strength;
    }

    onLeave() {
        this.target = { x: 0, y: 0 };
    }

    animate() {
        this.position.x += (this.target.x - this.position.x) * 0.15;
        this.position.y += (this.target.y - this.position.y) * 0.15;

        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

        if (Math.abs(this.target.x - this.position.x) > 0.01 ||
            Math.abs(this.target.y - this.position.y) > 0.01 ||
            Math.abs(this.position.x) > 0.01 ||
            Math.abs(this.position.y) > 0.01) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.animating = false;
            this.element.style.transform = '';
        }
    }
}

// ===== SCROLL REVEAL ANIMATION =====
class ScrollReveal {
    constructor(options = {}) {
        this.threshold = options.threshold || 0.15;
        this.staggerDelay = options.staggerDelay || 80;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    let siblingIndex = 0;
                    const parent = entry.target.parentElement;
                    if (parent) {
                        const siblings = parent.querySelectorAll('.scroll-reveal');
                        siblingIndex = Math.max(0, Array.from(siblings).indexOf(entry.target));
                    }

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, siblingIndex * this.staggerDelay);

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: this.threshold, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    }
}

// ===== FAQ ACCORDION =====
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others
            faqItems.forEach(other => other.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ===== INITIALIZE ALL MICRO-INTERACTIONS =====
function initMicroInteractions() {
    // Ripple effect on buttons
    document.querySelectorAll('.hero-btn, .contact-btn, .book-service-btn, .book-staff-btn, .tier-cta-btn, .btn-premium, .ripple-btn').forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.addEventListener('click', createRipple);
    });

    // Magnetic buttons (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.hero-btn, .magnetic-btn').forEach(btn => {
            new MagneticButton(btn, 0.25);
        });
    }

    // Scroll reveal
    new ScrollReveal({ threshold: 0.12, staggerDelay: 100 });

    // FAQ accordion
    initFaqAccordion();

    console.log('Ô£¿ Premium micro-interactions initialized');
}

// ===== ADD SCROLL-REVEAL CLASSES TO SECTIONS =====
function addScrollRevealClasses() {
    // Trust cards
    document.querySelectorAll('.trust-card').forEach(card => {
        card.classList.add('scroll-reveal', 'fade-up');
    });

    // Feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.classList.add('scroll-reveal', 'zoom-in');
    });

    // Service cards
    document.querySelectorAll('.service-card-item').forEach(card => {
        card.classList.add('scroll-reveal', 'fade-up');
    });

    // Gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.classList.add('scroll-reveal', 'zoom-in');
    });

    // Testimonial cards
    document.querySelectorAll('.testimonial-card-item').forEach(card => {
        card.classList.add('scroll-reveal', 'fade-up');
    });

    // Staff cards
    document.querySelectorAll('.staff-card').forEach(card => {
        card.classList.add('scroll-reveal', 'fade-up');
    });

    // Tier cards
    document.querySelectorAll('.tier-card').forEach(card => {
        card.classList.add('scroll-reveal', 'zoom-in');
    });

    // FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.add('scroll-reveal', 'fade-up');
    });

    // Section titles
    document.querySelectorAll('.section-title').forEach(title => {
        title.classList.add('scroll-reveal', 'fade-up');
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    addScrollRevealClasses();
    initMicroInteractions();
    initServiceFilter();
    initFloatingChatWidget();
});

// ================================================================================
// SERVICE FILTERING & SEARCH SYSTEM
// ================================================================================
function initServiceFilter() {
    const filterBar = document.getElementById('serviceFilterBar');
    if (!filterBar) return;

    const filterBtns = filterBar.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('serviceSearch');
    const filterCount = document.getElementById('filterCount');
    const servicesSection = document.getElementById('services');

    if (!servicesSection) return;

    const serviceCards = servicesSection.querySelectorAll('.service-card-item');
    let activeCategory = 'all';
    let searchQuery = '';
    let debounceTimer = null;
    let filterVersion = 0;
    const cardTimers = new Map();

    // Category filter click handlers
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            activeCategory = btn.dataset.category;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });

    // Search with debouncing
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value.toLowerCase().trim();
                applyFilters();
            }, 300);
        });
    }

    function applyFilters() {
        filterVersion++;
        const currentVersion = filterVersion;
        let visibleCount = 0;

        cardTimers.forEach(timer => clearTimeout(timer));
        cardTimers.clear();

        serviceCards.forEach((card, index) => {
            const cardCategory = card.dataset.category || 'all';
            const cardText = card.textContent.toLowerCase();

            const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
            const matchesSearch = searchQuery === '' || cardText.includes(searchQuery);

            const isVisible = matchesCategory && matchesSearch;

            if (isVisible) {
                visibleCount++;
                card.style.display = '';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                const showTimer = setTimeout(() => {
                    if (filterVersion === currentVersion) {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }
                }, index * 50);
                cardTimers.set(card, showTimer);
            } else {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                const hideTimer = setTimeout(() => {
                    if (filterVersion === currentVersion) {
                        card.style.display = 'none';
                    }
                }, 300);
                cardTimers.set(card, hideTimer);
            }
        });

        if (filterCount) {
            filterCount.textContent = `${visibleCount} service${visibleCount !== 1 ? 's' : ''} found`;
        }
    }

    console.log('Ô£à Service filter initialized');
}

// ================================================================================
// FLOATING CHAT WIDGET
// ================================================================================
function initFloatingChatWidget() {
    // Create chat widget HTML
    const chatHTML = `
        <div class="floating-chat-widget" id="floatingChatWidget">
            <button class="chat-fab" id="chatFab" aria-label="Open chat">
                <img src="assets/ai_assistant_icon.png" alt="AI Assistant" class="fab-icon-img">
                <span class="fab-pulse"></span>
            </button>
            
            <div class="chat-window-float" id="chatWindowFloat">
                <div class="chat-header-float">
                    <div class="chat-header-info-float">
                        <img src="assets/brand_icon_optimized.webp" alt="Blancbeu" class="chat-avatar-float">
                        <div>
                            <div class="chat-title-float">Blancbeu Support</div>
                            <div class="chat-status-float"><span class="status-dot"></span>Online now</div>
                        </div>
                    </div>
                    <button class="chat-close-float" id="chatCloseFloat">Ô£ò</button>
                </div>
                
                <div class="chat-messages-float" id="chatMessagesFloat"></div>
                
                <div class="chat-quick-float" id="chatQuickFloat">
                    <button class="quick-btn-float" data-action="services">View Services</button>
                    <button class="quick-btn-float" data-action="booking">Book Now</button>
                    <button class="quick-btn-float" data-action="hours">Hours</button>
                    <button class="quick-btn-float" data-action="location">Location</button>
                </div>
                
                <div class="chat-input-float">
                    <input type="text" id="chatInputFloat" placeholder="Type a message...">
                    <button id="chatSendFloat">Ô×ñ</button>
                </div>
            </div>
        </div>
    `;

    // Add CSS for floating chat
    const chatCSS = `
        .floating-chat-widget {
            position: fixed;
            bottom: 100px;
            right: 24px;
            z-index: 9998;
        }
        
        .chat-fab {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--gold-600), var(--gold-500));
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 8px 30px rgba(255, 215, 0, 0.4);
            transition: all 0.3s ease;
        }
        
        .chat-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 40px rgba(255, 215, 0, 0.5);
        }
        
        .fab-icon {
            width: 28px;
            height: 28px;
            z-index: 1;
            color: white;
        }
        
        .fab-icon-img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            z-index: 1;
            border: 2px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
        }
        
        .fab-pulse {
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            background: rgba(255, 215, 0, 0.3);
            animation: fabPulse 2s ease-in-out infinite;
        }
        
        @keyframes fabPulse {
            0%, 100% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(1.2); opacity: 0; }
        }
        
        .chat-window-float {
            position: absolute;
            bottom: 75px;
            right: 0;
            width: 360px;
            max-height: 500px;
            background: var(--bg-secondary, #0a0a0a);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
            display: none;
            flex-direction: column;
            border: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        .chat-window-float.open {
            display: flex;
            animation: chatSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes chatSlideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .chat-header-float {
            background: linear-gradient(135deg, var(--gold-600), var(--gold-500));
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chat-header-info-float {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .chat-avatar-float {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid rgba(0,0,0,0.2);
        }
        
        .chat-title-float {
            font-family: 'Cinzel', serif;
            font-size: 15px;
            font-weight: 600;
            color: #000;
        }
        
        .chat-status-float {
            font-size: 12px;
            color: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            background: #22c55e;
            border-radius: 50%;
            animation: statusBlink 2s ease-in-out infinite;
        }
        
        @keyframes statusBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .chat-close-float {
            background: rgba(0,0,0,0.2);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            color: #000;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .chat-close-float:hover {
            background: rgba(0,0,0,0.3);
        }
        
        .chat-messages-float {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-height: 200px;
            max-height: 280px;
        }
        
        .chat-msg {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.5;
            animation: msgFadeIn 0.3s ease;
        }
        
        @keyframes msgFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .chat-msg.bot {
            align-self: flex-start;
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid rgba(255, 215, 0, 0.2);
            color: var(--text-primary, #fff);
            border-bottom-left-radius: 4px;
        }
        
        .chat-msg.user {
            align-self: flex-end;
            background: linear-gradient(135deg, var(--gold-600), var(--gold-500));
            color: #000;
            border-bottom-right-radius: 4px;
        }
        
        .chat-quick-float {
            padding: 12px 20px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            border-top: 1px solid rgba(255, 215, 0, 0.1);
        }
        
        .quick-btn-float {
            padding: 8px 14px;
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            color: var(--gold-400, #FFC942);
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .quick-btn-float:hover {
            background: rgba(255, 215, 0, 0.2);
            border-color: var(--gold-500);
        }
        
        .chat-input-float {
            padding: 16px 20px;
            display: flex;
            gap: 12px;
            border-top: 1px solid rgba(255, 215, 0, 0.1);
        }
        
        .chat-input-float input {
            flex: 1;
            padding: 12px 16px;
            border-radius: 25px;
            border: 1px solid rgba(255, 215, 0, 0.2);
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-primary, #fff);
            font-size: 14px;
            outline: none;
            transition: all 0.3s ease;
        }
        
        .chat-input-float input:focus {
            border-color: var(--gold-500);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
        }
        
        .chat-input-float button {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--gold-600), var(--gold-500));
            border: none;
            color: #000;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .chat-input-float button:hover {
            transform: scale(1.1);
        }
        
        @media (max-width: 480px) {
            .floating-chat-widget {
                right: 16px;
                bottom: 90px;
            }
            
            .chat-window-float {
                width: calc(100vw - 32px);
                right: -8px;
            }
        }
        
        /* Light mode */
        body.light-mode .chat-window-float {
            background: #fff;
            border-color: rgba(212, 160, 23, 0.3);
        }
        
        body.light-mode .chat-msg.bot {
            background: rgba(212, 160, 23, 0.1);
            border-color: rgba(212, 160, 23, 0.2);
            color: #333;
        }
        
        body.light-mode .chat-input-float input {
            background: rgba(0,0,0,0.03);
            color: #333;
        }
    `;

    // Add styles to head
    const styleEl = document.createElement('style');
    styleEl.textContent = chatCSS;
    document.head.appendChild(styleEl);

    // Add chat widget to body
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // Chat functionality
    const chatWidget = document.getElementById('floatingChatWidget');
    const chatFab = document.getElementById('chatFab');
    const chatWindow = document.getElementById('chatWindowFloat');
    const chatClose = document.getElementById('chatCloseFloat');
    const chatMessages = document.getElementById('chatMessagesFloat');
    const chatInput = document.getElementById('chatInputFloat');
    const chatSend = document.getElementById('chatSendFloat');
    const quickBtns = document.querySelectorAll('.quick-btn-float');

    let isOpen = false;

    const botResponses = {
        greeting: "Hello! Welcome to Blancbeu Beauty Salon. ­ƒÆäÔ£¿ How can I help you today?",
        services: "We offer Hair Styling, Makeup, Facials, Manicures, Pedicures, Spa treatments and more! ­ƒÆçÔÇìÔÖÇ´©Å Browse our services above or ask about a specific treatment.",
        booking: "I'd love to help you book! ­ƒôà You can call us at +91 92299 15277 or message on WhatsApp. We're open 10AM-8PM Mon-Sat.",
        hours: "­ƒòÉ Our hours are:\nÔÇó Mon-Sat: 10:00 AM - 8:00 PM\nÔÇó Sunday: 11:00 AM - 7:00 PM\nWe recommend booking in advance!",
        location: "­ƒôì Find us on Google Maps! We're conveniently located in Ranchi. Click the Contact tab below to get directions.",
        default: "Thanks for your message! ­ƒÆî Our team will respond shortly. You can also call us at +91 92299 15277 for immediate assistance."
    };

    function addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${type}`;
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function processMessage(text) {
        const lowerText = text.toLowerCase();
        let response = botResponses.default;

        if (lowerText.match(/service|offer|treatment|hair|makeup|facial|nail|spa/)) {
            response = botResponses.services;
        } else if (lowerText.match(/book|appointment|reserve|schedule/)) {
            response = botResponses.booking;
        } else if (lowerText.match(/hour|open|close|time|when/)) {
            response = botResponses.hours;
        } else if (lowerText.match(/where|location|address|direction|map/)) {
            response = botResponses.location;
        } else if (lowerText.match(/hi|hello|hey|good/)) {
            response = botResponses.greeting;
        }

        setTimeout(() => addMessage(response, 'bot'), 500 + Math.random() * 500);
    }

    // Event listeners
    chatFab.addEventListener('click', () => {
        isOpen = !isOpen;
        chatWindow.classList.toggle('open', isOpen);
        if (isOpen && chatMessages.children.length === 0) {
            setTimeout(() => addMessage(botResponses.greeting, 'bot'), 500);
        }
    });

    chatClose.addEventListener('click', () => {
        isOpen = false;
        chatWindow.classList.remove('open');
    });

    chatSend.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatInput.value = '';
            processMessage(text);
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            chatSend.click();
        }
    });

    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            addMessage(btn.textContent, 'user');
            addMessage(botResponses[action] || botResponses.default, 'bot');
        });
    });

    console.log('­ƒÆ¼ Chat widget initialized');
}

// ================================================================================
// CONFETTI CELEBRATION
// ================================================================================
function triggerConfetti() {
    const colors = ['#FFD700', '#FFB6C1', '#FFFFFF', '#F7E7CE', '#B76E79'];
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;overflow:hidden;';
    document.body.appendChild(container);

    for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 6 + Math.random() * 8;
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;

        particle.style.cssText = `
            position:absolute;
            left:${left}%;
            top:-20px;
            width:${size}px;
            height:${size}px;
            background:${color};
            border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
            animation:confettiFall ${2 + Math.random()}s ease-out ${delay}s forwards;
        `;
        container.appendChild(particle);
    }

    setTimeout(() => container.remove(), 4000);
}

// Add confetti keyframes
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
`;
document.head.appendChild(confettiStyle);

// Export for booking success
window.triggerConfetti = triggerConfetti;

// ================================================================================
// SERVICES PAGE - Dedicated Services Tab Functionality
// ================================================================================

let servicesPageCurrentCategory = 'all';
let servicesPageSearchQuery = '';
let servicesPageHasInteracted = false;

function initServicesPage() {
    const searchInput = document.getElementById('servicesPageSearch');
    const clearSearchBtn = document.getElementById('clearServicesSearch');
    const categoryCardsContainer = document.getElementById('servicesCategoryCards');
    const categoryCards = document.querySelectorAll('.category-image-card');

    // Render services initially
    renderServicesPage();

    // Category Card Click Handlers
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const category = card.dataset.category;

            // Check current state
            const isModeActive = categoryCardsContainer.classList.contains('category-active-mode');
            const isAlreadyActive = card.classList.contains('active');

            // TOGGLE / CLOSE LOGIC
            // If we are in Banner Mode AND clicking the currently active card (including 'all'), Close/Reset.
            if (isModeActive && isAlreadyActive) {
                servicesPageCurrentCategory = 'all';
                servicesPageHasInteracted = false; // Reset interaction (hide list)

                // Exit Active Mode (return to grid)
                categoryCardsContainer.classList.remove('category-active-mode');

                // Reset active highlighting to defaults (or keep 'all' highlighted if that's default behavior)
                categoryCards.forEach(c => c.classList.remove('active'));

                // Highlight 'All' as the default state in grid
                const allCard = document.querySelector('.category-image-card[data-category="all"]');
                if (allCard) allCard.classList.add('active');

                renderServicesPage();
                return;
            }

            // ACTIVATION LOGIC (Switching to Banner or Switching Category)
            servicesPageHasInteracted = true;
            servicesPageCurrentCategory = category;

            // Enter Active Mode (Banner View) - applies for ALL categories including 'all'
            categoryCardsContainer.classList.add('category-active-mode');

            // Update Active Card Classes
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // SCROLL TO TOP (Smooth)
            setTimeout(() => {
                const searchBar = document.querySelector('.services-search-wrapper');
                if (searchBar) {
                    searchBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);

            // Re-render grid
            renderServicesPage();
        });
    });

    // Search input handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            servicesPageSearchQuery = e.target.value.toLowerCase();
            clearSearchBtn.style.display = servicesPageSearchQuery ? 'flex' : 'none';
            renderServicesPage();
        });
    }

    // Clear search button
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            servicesPageSearchQuery = '';
            clearSearchBtn.style.display = 'none';
            renderServicesPage();
        });
    }

    console.log('­ƒÆÄ Services Page initialized (Interactive Cards)');
}

function renderServicesPage() {
    const grid = document.getElementById('servicesPageGrid');
    const countElement = document.getElementById('servicesPageCount');

    if (!grid) return;

    let allServices = [];

    // Collect all services with category info
    servicesData.groups.forEach(group => {
        group.services.forEach(service => {
            allServices.push({
                ...service,
                category: group.group,
                icon: group.icon
            });
        });
    });

    // Filter by category
    if (servicesPageCurrentCategory !== 'all') {
        allServices = allServices.filter(s => s.category === servicesPageCurrentCategory);
    }

    // Filter by search query
    if (servicesPageSearchQuery) {
        allServices = allServices.filter(s =>
            s.name.toLowerCase().includes(servicesPageSearchQuery) ||
            s.category.toLowerCase().includes(servicesPageSearchQuery)
        );
    }

    // VISUAL FILTERING OF CATEGORY CARDS (New Requirement)
    // Only in 'all' mode: Filter the Image Cards to show only relevant categories based on search
    const categoryCards = document.querySelectorAll('.category-image-card');
    if (servicesPageCurrentCategory === 'all') {
        if (servicesPageSearchQuery) {
            const matchingCategories = new Set(allServices.map(s => s.category));
            categoryCards.forEach(card => {
                const cardCat = card.dataset.category;
                if (cardCat === 'all') {
                    card.style.display = 'none'; // Hide 'All' during search
                } else if (matchingCategories.has(cardCat)) {
                    card.style.display = ''; // Show match
                } else {
                    card.style.display = 'none'; // Hide non-match
                }
            });
        } else {
            // Show all if no search
            categoryCards.forEach(card => card.style.display = '');
        }
    } else {
        // Reset in other modes (handled by CSS classes usually, but safe to clear)
        categoryCards.forEach(card => card.style.display = '');
    }

    // DEFAULT EMPTY STATE: 
    // If category is 'all' AND no search query AND no interaction, show NOTHING
    if (servicesPageCurrentCategory === 'all' && !servicesPageSearchQuery && !servicesPageHasInteracted) {
        grid.innerHTML = ''; // Clear grid
        if (countElement) countElement.textContent = ''; // Clear count
        return;
    }

    // Update count
    if (countElement) {
        if (servicesPageSearchQuery) {
            countElement.textContent = `Found ${allServices.length} service${allServices.length !== 1 ? 's' : ''} for "${servicesPageSearchQuery}"`;
        } else if (servicesPageCurrentCategory !== 'all') {
            countElement.textContent = `Showing ${allServices.length} ${servicesPageCurrentCategory} service${allServices.length !== 1 ? 's' : ''}`;
        } else {
            countElement.textContent = `Showing all ${allServices.length} services`;
        }
    }

    // Render empty state
    if (allServices.length === 0) {
        grid.innerHTML = `
            <div class="services-empty-state" style="grid-column: 1 / -1;">
                <div class="services-empty-icon">­ƒöì</div>
                <h3 class="services-empty-title">No services found</h3>
                <p class="services-empty-text">Try a different search term or category</p>
            </div>
        `;
        return;
    }

    // Render service cards
    grid.innerHTML = allServices.map(service => {
        const hasOffer = service.offerPrice !== null;
        const discount = hasOffer ? Math.round((1 - service.offerPrice / service.price) * 100) : 0;
        const displayPrice = service.offerPrice || service.price;

        // Duration logic (Default to 30-60 min if data missing)
        const duration = service.duration || '30-60 min';

        // Create WhatsApp message for booking
        const bookingMessage = encodeURIComponent(`Hi! I'd like to book "${service.name}" from ${service.category}. Please let me know the available slots.`);
        const whatsappLink = `https://wa.me/919229915277?text=${bookingMessage}`;

        return `
            <div class="service-page-card">
                <div class="service-duration-badge">ÔÅ▒´©Å ${duration}</div>
                <div class="service-page-card-info">
                    <div class="service-page-card-category">
                        <span>${service.icon}</span>
                        <span>${service.category}</span>
                    </div>
                    <div class="service-page-card-name">${service.name}</div>
                    <div class="service-page-card-prices">
                        ${hasOffer ? `<span class="service-page-original-price">Ôé╣${service.price}</span>` : ''}
                        <span class="service-page-offer-price">Ôé╣${displayPrice}</span>
                        ${hasOffer && discount > 0 ? `<span class="service-page-discount-badge">${discount}% OFF</span>` : ''}
                    </div>
                </div>
                <a href="${whatsappLink}" target="_blank" class="service-page-book-btn">Book</a>
            </div>
        `;
    }).join('');
}

// Initialize Services Page when navigating to it
function onServicesPageVisible() {
    // Check if already initialized
    const grid = document.getElementById('servicesPageGrid');
    if (grid && !grid.dataset.initialized) {
        initServicesPage();
        grid.dataset.initialized = 'true';
    }
}

// Hook into page navigation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize on page load if services page is active
    const servicesPage = document.querySelector('[data-page="services"]');
    if (servicesPage && servicesPage.classList.contains('active')) {
        onServicesPageVisible();
    }

    // Listen for navigation changes
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    bottomNavItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.dataset.page === 'services') {
                setTimeout(onServicesPageVisible, 100);
            }
        });
    });

    // Also handle header nav clicks
    const headerNavLinks = document.querySelectorAll('.nav a[href="#services"]');
    headerNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(onServicesPageVisible, 100);
        });
    });
});

// ==========================================
// NEW: Services Page Category Image Cards Logic
// ==========================================

// Global function for category card clicks (referenced in HTML)
// Global function for category card clicks (referenced in HTML or other scripts)
window.filterByCategory = function (category) {
    const card = document.querySelector(`.category-image-card[data-category="${category}"]`);
    if (card) {
        card.click();
    }
};


/* ==========================================================================
   MY BOOKINGS REDESIGN - TAB LOGIC
   ========================================================================== */
function initModernBookingsTabs() {
    const tabs = document.querySelectorAll('.booking-pill-tab');
    const groups = document.querySelectorAll('.booking-group');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const status = tab.dataset.status;

            // Update active tab state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show relevant booking group
            groups.forEach(group => {
                group.classList.add('hidden');
                group.style.display = 'none'; // Ensure display none is applied
            });

            const targetGroup = document.getElementById(`${status}-bookings`);
            if (targetGroup) {
                targetGroup.classList.remove('hidden');
                targetGroup.style.display = 'block'; // Ensure display block is applied

                // Add fade-in animation
                targetGroup.style.opacity = '0';
                targetGroup.style.transform = 'translateY(10px)';
                targetGroup.style.transition = 'all 0.4s ease';

                requestAnimationFrame(() => {
                    targetGroup.style.opacity = '1';
                    targetGroup.style.transform = 'translateY(0)';
                });
            } else {
                // If no group found (e.g. cancelled), maybe show empty state or specific message
                // For now, if "cancelled" has no group, do nothing or show safe fallback
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initModernBookingsTabs();
});/* =========================================
   GALLERY LIGHTBOX LOGIC
   ========================================= */

let currentLightboxIndex = 0;
const galleryImages = document.querySelectorAll('.gallery-grid .gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

// Open Lightbox
function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;

    currentLightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close Lightbox
function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Update Image Source
function updateLightboxImage() {
    if (!lightboxImg || galleryImages.length === 0) return;

    const imageSrc = galleryImages[currentLightboxIndex].src;
    // Optional: Fade out effect before changing
    lightboxImg.style.opacity = '0';

    setTimeout(() => {
        lightboxImg.src = imageSrc;
        lightboxImg.onload = () => {
            lightboxImg.style.opacity = '1';
        };
    }, 200);
}

// Next Image
function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

// Previous Image
function prevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

// Event Listeners for Gallery Items
galleryImages.forEach((img, index) => {
    img.closest('.gallery-item').addEventListener('click', () => {
        openLightbox(index);
    });
});

// Close on clicking outside image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
        closeLightbox();
    }
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});

// Swipe Logic for Mobile
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const threshold = 50; // Minimum distance for swipe
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > threshold) {
        if (swipeDistance < 0) {
            // Swiped Left -> Next
            nextImage();
        } else {
            // Swiped Right -> Prev
            prevImage();
        }
    }
}
