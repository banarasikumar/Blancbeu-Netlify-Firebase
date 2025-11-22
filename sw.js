const CACHE_NAME = 'blancbeu-v7-optimized';
const VERSION_URL = '/version.json';

const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/fireworks.css',
  '/fireworks.js',
  '/manifest.json',
  '/version.json',
  '/icon-72x72.webp',
  '/icon-96x96.webp',
  '/icon-144x144.webp',
  '/icon-192x192.webp',
  '/icon-192x192.png',
  '/icon-512x512.webp',
  '/icon-512x512.png',
  '/splash-750x1334.png',
  '/splash-1170x2532.png',
  '/assets/homepage_brand_logo.webp',
  '/assets/brand_icon_optimized.webp',
  '/assets/banner_carousel_images/banner1.webp',
  '/assets/banner_carousel_images/banner2.webp',
  '/assets/banner_carousel_images/banner3.webp',
  '/assets/banner_carousel_images/banner4.webp',
  '/assets/banner_carousel_images/banner5.webp',
  '/assets/banner_carousel_images/banner6.webp',
  '/assets/service_images/professional_hair_st_3fab25e9.webp',
  '/assets/service_images/beautiful_woman_gett_9dc7243a.webp',
  '/assets/service_images/beautiful_woman_gett_6dc3de2b.webp',
  '/assets/service_images/professional_hair_st_673b25ad.webp',
  '/assets/service_images/luxury_spa_massage_w_43d50481.webp',
  '/assets/service_images/hair_coloring_treatm_f184b598.webp',
  '/assets/service_images/glamorous_woman_luxu_658b74ed.webp',
  '/assets/service_images/attractive_model_wit_bcb81b4f.webp'
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

// Fetch event with version checking
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Always fetch version.json from network to check for updates
  if (request.url.includes('version.json')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // For other requests, use cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request)
          .then((networkResponse) => {
            // Cache new responses
            if (networkResponse && networkResponse.status === 200) {
              const cache = caches.open(CACHE_NAME);
              cache.then((c) => c.put(request, networkResponse.clone()));
            }
            return networkResponse;
          });
      })
      .catch(() => {
        return fetch(request);
      })
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

// Message handler for cache invalidation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      caches.open(CACHE_NAME).then((cache) => {
        cache.addAll(urlsToCache);
        event.ports[0].postMessage({ success: true });
      });
    });
  }
});
