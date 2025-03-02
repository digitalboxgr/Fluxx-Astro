// Modern service worker with workbox-like functionality
const CACHE_NAME = 'fluxx-cache-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/assets/css/main.css',
  // Add other critical assets
];

// Cache strategy: 
// - For pages: Network first, falling back to cache
// - For assets: Cache first, falling back to network

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // For HTML pages (URLs ending with / or without file extension)
  if (url.pathname.endsWith('/') || !url.pathname.includes('.')) {
    // Network first, falling back to cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } 
  // For assets (CSS, JS, images, etc.)
  else {
    // Cache first, falling back to network
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200) {
            return response;
          }
          
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          
          return response;
        });
      })
    );
  }
});