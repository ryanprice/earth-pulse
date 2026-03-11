// Earth Pulse Service Worker — cache shell, network-first for data
const CACHE_NAME = 'earth-pulse-v1';
const SHELL_ASSETS = [
  './',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './textures/earth_night.jpg',
];

// CDN libs to cache (Three.js, WebLLM)
const CDN_PREFIXES = [
  'https://cdn.jsdelivr.net/npm/three@',
  'https://esm.run/@mlc-ai/web-llm',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Never cache API data feeds — always go to network
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname === 'earthquake.usgs.gov' ||
    url.hostname === 'api.open-notify.org' ||
    url.hostname.includes('noaa.gov') ||
    url.hostname.includes('nasa.gov') ||
    url.hostname.includes('openuv.io') ||
    url.hostname.includes('waqi.info') ||
    url.hostname.includes('blitzortung.org') ||
    url.hostname.includes('nmdb.eu')
  ) {
    return; // Let browser handle normally
  }

  // CDN assets — cache-first (they're versioned/immutable)
  const isCDN = CDN_PREFIXES.some((prefix) => e.request.url.startsWith(prefix));
  if (isCDN) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Shell assets — stale-while-revalidate
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        const fetchPromise = fetch(e.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return response;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }
});
