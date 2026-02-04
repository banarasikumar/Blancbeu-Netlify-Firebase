importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

const CACHE_NAME = 'blancbeu-static-v3';
const DYNAMIC_CACHE = 'blancbeu-dynamic-v1';

// Assets to pre-cache (Core Application Shell)
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/theme-variables.css',
    '/script_pwa.js',
    '/theme-toggle.js',
    '/parallax.js',
    '/manifest.json',
    '/assets/brand_icon_optimized.webp'
];

// Install Event - Cache Core Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Pre-caching core assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting(); // Activate immediately
});

// Activate Event - Cleanup Old Caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
                        console.log('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch Event - Strategy Implementation
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 1. Version Check & Dynamic Data -> NETWORK ONLY
    // Ensure we always get the latest version.json and API data
    if (url.pathname.includes('version.json') || url.pathname.includes('/api/') || url.pathname.includes('/admin')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // 2. HTML Navigation -> NETWORK FIRST (Fallback to Cache)
    // We want fresh content if available div. updates
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    return caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => {
                    return caches.match(event.request).then((cachedResp) => {
                        if (cachedResp) return cachedResp;
                        // Optional: Return offline.html if cached
                        return caches.match('/index.html');
                    });
                })
        );
        return;
    }

    // 3. Static Assets (JS, CSS, Images, Fonts) -> STALE-WHILE-REVALIDATE
    // Serve fast from cache, then update in background
    if (
        url.pathname.match(/\.(js|css|webp|png|jpg|jpeg|svg|woff2)$/)
    ) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    return caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // 4. Default -> Cache First (for anything else)
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});

// Initialize Firebase in Service Worker for Background Notifications
// Note: Hardcoded for SW as it doesn't have access to Vite env vars directly in this setup
firebase.initializeApp({
    apiKey: "AIzaSyC4jkARU5-Ohb5w71Bi9eXY3A4ozOidyro",
    projectId: "blancbeu-60b2a",
    messagingSenderId: "344944570615",
    appId: "1:344944570615:web:793eecc8ba4027492863f2"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/assets/brand_icon_optimized.webp'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
