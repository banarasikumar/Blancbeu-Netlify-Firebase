const CACHE_NAME = 'beauty-family-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json'
];

// Fallback for offline
const FALLBACK_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Beauty Family - Loading</title>
<style>
body { background: #0a0a0a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: system-ui; }
.container { text-align: center; }
h1 { font-size: 24px; margin-bottom: 10px; }
p { opacity: 0.7; }
</style>
</head>
<body>
<div class="container">
<h1>Beauty Family Salon</h1>
<p>Loading your premium salon experience...</p>
</div>
</body>
</html>`;

// Install event - cache essential files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
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
});

// Fetch event - network first, fallback to cache, with smart fallback
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone the response
                const responseClone = response.clone();

                // Cache successful responses
                if (response.status === 200) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }

                return response;
            })
            .catch(() => {
                // Try cache first
                return caches.match(event.request).then((response) => {
                    if (response) {
                        return response;
                    }
                    
                    // Smart fallback for HTML pages
                    if (event.request.mode === 'navigate') {
                        return new Response(FALLBACK_HTML, {
                            status: 200,
                            statusText: 'OK',
                            headers: new Headers({
                                'Content-Type': 'text/html'
                            })
                        });
                    }
                    
                    // Generic offline response
                    return new Response('Offline - content not available', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/plain'
                        })
                    });
                });
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
