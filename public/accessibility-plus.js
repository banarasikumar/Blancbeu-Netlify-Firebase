// FINAL ACCESSIBILITY ENHANCEMENTS

const AccessibilityPlus = {
    init() {
        this.enhanceKeyboardNavigation();
        this.improveScreenReaderSupport();
        this.addLiveRegions();
        this.enhanceContrast();
    },
    
    enhanceKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Tab navigation
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('[role="dialog"]');
                modals.forEach(modal => modal.style.display = 'none');
            }
            
            // Arrow keys for navigation
            if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                this.handleArrowNavigation(e.key);
            }
        });
    },
    
    improveScreenReaderSupport() {
        document.querySelectorAll('[role="button"]').forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', btn.textContent.trim());
            }
        });
        
        document.querySelectorAll('img').forEach(img => {
            if (!img.getAttribute('alt')) {
                img.setAttribute('alt', 'Decorative image');
            }
        });
    },
    
    addLiveRegions() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        document.body.appendChild(liveRegion);
        window.a11yLiveRegion = liveRegion;
    },
    
    enhanceContrast() {
        const style = document.createElement('style');
        style.textContent = `
            @media (prefers-contrast: more) {
                body { --text-dark: #000; --text-light: #fff; }
            }
        `;
        document.head.appendChild(style);
    },
    
    handleArrowNavigation(key) {
        const focusable = Array.from(document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]'
        ));
        const current = document.activeElement;
        const index = focusable.indexOf(current);
        
        if (key === 'ArrowRight' || key === 'ArrowDown') {
            focusable[index + 1]?.focus();
        } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
            focusable[index - 1]?.focus();
        }
    }
};

AccessibilityPlus.init();
console.log('♿ Accessibility+: ENHANCED');
