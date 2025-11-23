// Advanced Professional Gallery Enhancement
const GalleryEnhancer = {
    init() {
        this.setupLazyLoading();
        this.setupGalleryAnimations();
        this.setupImagePreload();
        console.log('✨ Advanced Gallery System: ACTIVE');
    },

    setupImagePreload() {
        const images = [
            'luxury_salon_interior_design.png',
            'professional_hair_styling_service.png',
            'luxury_facial_treatment_service.png',
            'premium_nail_art_service.png'
        ];
        images.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img;
            document.head.appendChild(link);
        });
    },

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[src*="salon"], img[src*="hair"], img[src*="facial"], img[src*="nail"]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                        imageObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            images.forEach(img => {
                img.style.opacity = '0.8';
                img.style.transform = 'scale(0.95)';
                img.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                imageObserver.observe(img);
            });
        }
    },

    setupGalleryAnimations() {
        const galleryItems = document.querySelectorAll('[style*="border-radius"]');
        galleryItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.addEventListener('click', () => this.handleGalleryClick(item));
        });
    },

    handleGalleryClick(element) {
        const img = element.querySelector('img');
        if (img) {
            this.showFullScreenGallery(img.src, img.alt);
        }
    },

    showFullScreenGallery(src, alt) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
            animation: fadeIn 0.3s ease;
        `;
        modal.innerHTML = `
            <div style="position: relative; max-width: 90vw; max-height: 90vh;">
                <img src="${src}" alt="${alt}" style="
                    width: 100%;
                    height: 100%;
                    border-radius: 16px;
                    box-shadow: 0 30px 80px rgba(212,175,55,0.4);
                    object-fit: contain;
                    animation: zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                ">
                <button style="
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: rgba(212,175,55,0.2);
                    border: 2px solid #d4af37;
                    color: #d4af37;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                " onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', () => modal.remove());
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GalleryEnhancer.init());
} else {
    GalleryEnhancer.init();
}
