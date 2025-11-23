// Service Worker for offline support and caching
const CACHE_NAME = 'beauty-salon-v4-cache';
const ASSETS = [
    '/',
    '/index.html',
    '/app.js',
    '/styles.css',
    '/manifest.json',
    '/luxury_salon_interior_design.png',
    '/professional_hair_styling_service.png',
    '/luxury_facial_treatment_service.png',
    '/premium_nail_art_service.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) return caches.delete(name);
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((response) => {
                if (!response || response.status !== 200) return response;
                const cache = caches.open(CACHE_NAME);
                cache.then((c) => c.put(event.request, response.clone()));
                return response;
            }).catch(() => {
                return caches.match('/index.html');
            });
        })
    );
});
