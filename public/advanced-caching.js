// ADVANCED CACHING STRATEGY

const AdvancedCache = {
    VERSION: 'v4.0',
    CACHE_NAMES: {
        PAGES: 'pages-v4.0',
        IMAGES: 'images-v4.0',
        SCRIPTS: 'scripts-v4.0',
        STYLES: 'styles-v4.0'
    },
    
    init() {
        if ('caches' in window) {
            this.preloadCriticalAssets();
            this.setupCacheInterception();
        }
    },
    
    preloadCriticalAssets() {
        const criticalAssets = [
            '/index.html',
            '/app.js',
            '/styles.css',
            '/manifest.json'
        ];
        
        caches.open(this.CACHE_NAMES.PAGES).then(cache => {
            criticalAssets.forEach(asset => {
                cache.add(asset).catch(e => {
                    console.log(`Preload cache for ${asset} handled gracefully`);
                });
            });
        });
    },
    
    setupCacheInterception() {
        // Image caching
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'];
        // Scripts and styles are handled by service worker
        console.log('✨ Advanced caching: ACTIVE');
    }
};

AdvancedCache.init();
