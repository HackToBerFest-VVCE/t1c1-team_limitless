const CACHE_NAME = 'scamlens-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Network-first for dynamic content, cache-first for static assets
// NEVER cache API requests, Supabase calls, scan results, or user uploads
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclude API calls, edge functions, external AI providers, and POST/PUT/DELETE
  if (
    event.request.method !== 'GET' ||
    url.pathname.includes('/functions/v1/') ||
    url.pathname.includes('/rest/v1/') ||
    url.pathname.includes('/auth/v1/') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('googleapis.com')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache successful GET requests for local static assets only
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic' &&
            (url.pathname.endsWith('.js') ||
              url.pathname.endsWith('.css') ||
              url.pathname.endsWith('.svg') ||
              url.pathname.endsWith('.woff2'))
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and requesting navigation, serve offline app shell
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Network error occurred (Offline)', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });
    })
  );
});
