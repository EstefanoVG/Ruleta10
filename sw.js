const cacheName = 'ruleta-v3'; // súbelo (v2, v3, etc.)
const assets = [
  './ruleta.html',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // activa SW nuevo inmediatamente
  event.waitUntil(caches.open(cacheName).then((c) => c.addAll(assets)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)))),
      self.clients.claim() // toma control de las pestañas abiertas
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
