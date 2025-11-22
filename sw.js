const CACHE_NAME = 'blancbeu-v17-comprehensive-cache';
const VERSION_URL = '/version.json';

// COMPREHENSIVE ASSETS TO CACHE - EVERYTHING for offline-first super-fast loading
const urlsToCache = [
  // Core HTML & JS
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/fireworks.css',
  '/fireworks.js',
  '/manifest.json',
  '/version.json',
  
  // PWA Icons
  '/icon-192x192.webp',
  '/icon-512x512.webp',
  
  // Splash Screens
  '/splash-750x1334.webp',
  '/splash-1170x2532.webp',
  
  // Brand Assets
  '/assets/brand_icon_optimized.webp',
  '/assets/homepage_brand_logo.webp',
  '/assets/app_splash_screen.webp',
  
  // Banner Carousel Images (ALL 5)
  '/assets/banner_carousel_images/1.webp',
  '/assets/banner_carousel_images/2.webp',
  '/assets/banner_carousel_images/3.webp',
  '/assets/banner_carousel_images/4.webp',
  '/assets/banner_carousel_images/5.webp',
  
  // Service Images (ALL 44 images for comprehensive cache)
  '/assets/service_images/facial_new.webp',
  '/assets/service_images/makeup_styling_new.webp',
  '/assets/service_images/hair_colour_vibrant.webp',
  '/assets/service_images/hair_colour_vibrant_pink.webp',
  '/assets/service_images/professional_hair_st_3fab25e9.webp',
  '/assets/service_images/professional_hair_st_673b25ad.webp',
  '/assets/service_images/beautiful_woman_gett_9dc7243a.webp',
  '/assets/service_images/beautiful_woman_gett_6dc3de2b.webp',
  '/assets/service_images/beautiful_woman_gett_7711a8e2.webp',
  '/assets/service_images/beautiful_woman_mode_1a74f53b.webp',
  '/assets/service_images/beautiful_woman_mode_7e54e2b1.webp',
  '/assets/service_images/beautiful_woman_mode_848de48f.webp',
  '/assets/service_images/beautiful_woman_mode_c7e25374.webp',
  '/assets/service_images/beautiful_woman_mode_feefb04f.webp',
  '/assets/service_images/luxury_spa_massage_w_43d50481.webp',
  '/assets/service_images/luxury_spa_massage_w_aa2e8462.webp',
  '/assets/service_images/hair_coloring_treatm_f184b598.webp',
  '/assets/service_images/hair_coloring_treatm_b175b405.webp',
  '/assets/service_images/glamorous_woman_luxu_658b74ed.webp',
  '/assets/service_images/glamorous_woman_luxu_1e3349a9.webp',
  '/assets/service_images/glamorous_woman_luxu_370f1816.webp',
  '/assets/service_images/glamorous_woman_luxu_ea2d2063.webp',
  '/assets/service_images/attractive_model_wit_bcb81b4f.webp',
  '/assets/service_images/attractive_model_wit_23aaed3d.webp',
  '/assets/service_images/attractive_model_wit_99f5a700.webp',
  '/assets/service_images/nails_beauty_new.webp',
  '/assets/service_images/nails_beauty_vibrant.webp',
  '/assets/service_images/premium_hair_spa_nourish.webp',
  '/assets/service_images/premium_services_luxury.webp',
  '/assets/service_images/luxury_beauty_salon__046b2a84.webp',
  '/assets/service_images/luxury_beauty_salon__3aa7fa66.webp',
  '/assets/service_images/stunning_beautiful_w_3ad92edc.webp',
  '/assets/service_images/stunning_beautiful_w_4fae0019.webp',
  '/assets/service_images/stunning_beautiful_w_96d07ba8.webp',
  '/assets/service_images/stunning_beautiful_w_d60bc25c.webp',
  '/assets/service_images/stunning_beautiful_w_f6e2ab0c.webp'
];

// Install event - cache EVERYTHING upfront for super-fast offline-first loading
self.addEventListener('install', (event) => {
  console.log('🚀 Installing Blancbeu PWA - caching all static assets...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching', urlsToCache.length, 'static assets for offline-first experience...');
        // Cache with error handling - continue even if some assets fail
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url))
        ).then((results) => {
          const successful = results.filter(r => r.status === 'fulfilled').length;
          console.log(`✅ Cached ${successful}/${urlsToCache.length} assets successfully!`);
        });
      })
  );
  self.skipWaiting();
});

// Fetch event - OFFLINE-FIRST (cache-first) for maximum performance
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // NETWORK-FIRST for index.html (fresh theme detection)
  if (url.pathname === '/' || url.pathname === '/index.html' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          console.log('📱 Using cached HTML (offline)');
          return caches.match(request);
        })
    );
    return;
  }

  // NETWORK-FIRST for version.json (detect updates)
  if (request.url.includes('version.json')) {
    event.respondWith(
      fetch(request)
        .then(response => response)
        .catch(() => {
          console.log('📱 Using cached version (offline)');
          return caches.match(request);
        })
    );
    return;
  }

  // CACHE-FIRST (offline-first) for ALL static assets - SUPER FAST loading
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response; // Return from cache immediately (instant loading)
        }
        
        // Not in cache, fetch from network and add to cache
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
              // Clone and cache the response for future use
              const clonedResponse = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clonedResponse);
              });
            }
            return networkResponse;
          });
      })
      .catch(() => {
        // Offline fallback
        if (request.destination === 'image') {
          // Return a simple SVG placeholder for missing images
          return new Response('<svg><rect width="100" height="100" fill="#FFD700"/></svg>', {
            headers: { 'Content-Type': 'image/svg+xml' }
          });
        }
        return new Response('Offline - Check your connection', { status: 503 });
      })
  );
});

// Activate event - clean up old caches and claim all clients
self.addEventListener('activate', (event) => {
  console.log('🔄 Activating Blancbeu Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✨ Blancbeu PWA ready for instant loading!');
      return self.clients.claim();
    })
  );
});

// Message handler for manual cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('🧹 Clearing cache on user request...');
    caches.delete(CACHE_NAME).then(() => {
      caches.open(CACHE_NAME).then((cache) => {
        cache.addAll(urlsToCache);
        event.ports[0].postMessage({ success: true });
      });
    });
  }
});
