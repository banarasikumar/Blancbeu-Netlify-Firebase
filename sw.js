const CACHE_NAME = 'blancbeu-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/fireworks.css',
  '/fireworks.js',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/assets/homepage_brand_logo.png',
  '/assets/banner_carousel_images/banner1.webp',
  '/assets/banner_carousel_images/banner2.webp',
  '/assets/banner_carousel_images/banner3.webp',
  '/assets/banner_carousel_images/banner4.webp',
  '/assets/banner_carousel_images/banner5.webp',
  '/assets/banner_carousel_images/banner6.webp'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
  self.skipWaiting();
});
