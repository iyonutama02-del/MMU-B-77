const CACHE_NAME = 'keuangan-mmu-b77-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/firebase-config.js',
  '/manifest.json',
  '/Logo-Favicon.png'
  // Web akan menyimpan file-file ini ke memori HP
];

// Install Service Worker & Simpan Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Hapus Cache Lama jika ada versi baru
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Strategi: Tarik dari Internet dulu, kalau putus baru ambil dari Memori HP (Offline Mode)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});