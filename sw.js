const CACHE_NAME = 'keuangan-mmu-b77-v2'; // Temuan #10: Versi di-bump ke v2
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/beranda.html',
  '/dashboard.html',
  '/profil.html',
  '/data-santri.html',
  '/pos-keuangan.html',
  '/manajemen-tagihan.html',
  '/pembayaran-santri.html',
  '/transaksi-kas.html',
  '/buku-kas.html',
  '/rekap-piutang.html',
  '/tutup-buku.html',
  '/pengaturan.html',
  '/firebase-config.js',
  '/manifest.json',
  '/Logo-Favicon.png',
  '/Icon-Aplikasi.png',
  '/Lambang-Keuangan.png'
  // Temuan #7: Seluruh halaman aplikasi sekarang masuk ke dalam Cache (Offline Mode)
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