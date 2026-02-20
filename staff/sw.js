const CACHE_NAME = 'blancbeu-staff-v1';
const ASSETS = [
    '/staff/',
    '/staff/index.html',
    '/admin/styles.css', // Shared styles
    '/staff/script.js',
    '/staff/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate' && event.request.url.includes('/staff')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/staff/index.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
