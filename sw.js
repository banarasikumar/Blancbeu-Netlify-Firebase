const CACHE_NAME = 'blancbeu-v6-optimized';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/fireworks.css',
  '/fireworks.js',
  '/manifest.json',
  '/icon-72x72.webp',
  '/icon-96x96.webp',
  '/icon-144x144.webp',
  '/icon-192x192.webp',
  '/icon-512x512.webp',
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
