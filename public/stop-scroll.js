// Prevent any page scroll
let lastScrollTop = 0;

window.addEventListener('scroll', (e) => {
    if (window.scrollY !== lastScrollTop) {
        window.scrollTo(0, lastScrollTop);
    }
});

// Also prevent body scroll
document.body.style.overflow = 'auto';
document.documentElement.style.overflow = 'auto';
