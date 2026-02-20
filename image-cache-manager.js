/**
 * Image Cache Manager for Blancbeu Legacy App
 * 
 * Features:
 * 1. Lazy Loading: Images only load when they enter the viewport.
 * 2. LocalStorage Caching: Images are fetched in background and stored as Base64.
 * 3. Smooth Experience: Throttled background prefetching to avoid UI lag.
 */

const IMAGE_CACHE_PREFIX = 'bl_img_';
const PLACEHOLDER_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const ImageCacheManager = {
    /**
     * Convert image URL to Data URL (Base64)
     */
    async toDataURL(url) {
        try {
            // Avoid attempting to fetch data URLs or already cached URLs
            if (url.startsWith('data:')) return url;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Failed to convert image to Data URL:', url, error);
            return null;
        }
    },

    /**
     * Get image from LocalStorage
     */
    getFromCache(url) {
        try {
            return localStorage.getItem(IMAGE_CACHE_PREFIX + url);
        } catch (e) {
            return null;
        }
    },

    /**
     * Set image to LocalStorage with quota management
     */
    saveToCache(url, data) {
        // DISABLED: Transitioned to Service Worker Cache API for better performance
        return;
    },

    /**
     * Clear image cache from LocalStorage
     */
    clearImageCache() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(IMAGE_CACHE_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
    },

    /**
     * Background prefetcher image list
     */
    getUrlsToPrefetch() {
        // Prefetching handled by Service Worker for better reliability
        return [];
    },

    /**
     * Start background prefetching
     */
    startPrefetch() {
        // Disabled background prefetching to LocalStorage
        // First run: Clear existing cache to free up synchronous LocalStorage
        if (!localStorage.getItem('bl_cache_cleaned')) {
            this.clearImageCache();
            localStorage.setItem('bl_cache_cleaned', 'true');
        }
    },

    /**
     * Load an element's source (Browser Cache & Service Worker will handle the rest)
     */
    async loadElement(el) {
        const src = el.getAttribute('data-src');
        const srcset = el.getAttribute('data-srcset');

        if (srcset) {
            el.srcset = srcset;
            el.removeAttribute('data-srcset');
        }

        if (src) {
            el.src = src;
            el.removeAttribute('data-src');
        }
    },

    /**
     * Initialize the manager
     */
    init() {
        // 1. Setup intersection observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // If in a picture tag, handle all sources
                    if (img.parentElement && img.parentElement.tagName === 'PICTURE') {
                        const sources = img.parentElement.querySelectorAll('source[data-srcset]');
                        sources.forEach(s => this.loadElement(s));
                    }

                    this.loadElement(img);
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });

        // 2. Observe all lazy images
        const observeAll = () => {
            document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
        };

        observeAll();

        // 3. Handle dynamic elements efficiently
        const mutObserver = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'IMG' && node.hasAttribute('data-src')) {
                            observer.observe(node);
                        }
                        // Also check for children that might be lazy images
                        node.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
                    }
                });
            });
        });
        mutObserver.observe(document.body, { childList: true, subtree: true });

        // 4. Start background prefetching after window load
        window.addEventListener('load', () => {
            setTimeout(() => this.startPrefetch(), 5000);
        });
    }
};

// Start
ImageCacheManager.init();
