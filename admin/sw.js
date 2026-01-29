const CACHE_NAME = 'blancbeu-admin-v1';
const ASSETS = [
    '/admin/',
    '/admin/index.html',
    '/admin/styles.css',
    '/admin/script.js',
    '/admin/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    // Navigation fallback for SPA behavior if needed, or just standard caching
    if (event.request.mode === 'navigate' && event.request.url.includes('/admin')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/admin/index.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
