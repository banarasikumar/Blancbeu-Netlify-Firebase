const CACHE_NAME = 'blancbeu-v11-padding-removed';
const VERSION_URL = '/version.json';

// Assets to cache (NO HTML FILES - they must be fresh)
const urlsToCache = [
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
  '/assets/banner_carousel_images/1.webp',
  '/assets/banner_carousel_images/2.webp',
  '/assets/banner_carousel_images/3.webp',
  '/assets/banner_carousel_images/4.webp',
  '/assets/banner_carousel_images/5.webp',
  '/assets/service_images/professional_hair_st_3fab25e9.webp',
  '/assets/service_images/beautiful_woman_gett_9dc7243a.webp',
  '/assets/service_images/beautiful_woman_gett_6dc3de2b.webp',
  '/assets/service_images/professional_hair_st_673b25ad.webp',
  '/assets/service_images/luxury_spa_massage_w_43d50481.webp',
  '/assets/service_images/hair_coloring_treatm_f184b598.webp',
  '/assets/service_images/glamorous_woman_luxu_658b74ed.webp',
  '/assets/service_images/attractive_model_wit_bcb81b4f.webp'
];

// Install event - cache assets only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event - NETWORK-FIRST for HTML, CACHE-FIRST for assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // NETWORK-FIRST for HTML files (always get fresh theme detection)
  if (url.pathname === '/' || url.pathname === '/index.html' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the fresh response
          if (response && response.status === 200) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Always fetch version.json from network
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

  // CACHE-FIRST for all other assets
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request)
          .then((networkResponse) => {
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

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
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
