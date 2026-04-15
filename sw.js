// sw.js
// KONFIGURASI SERVICE WORKER - PWA ENTERPRISE B-77

const CACHE_NAME = 'keuangan-mmu-b77-v3-Enterprise'; // BUMP VERSI KE V3 (Memaksa HP Kasir Update Total)
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/beranda.html',
  '/dashboard.html',
  '/profil.html',
  '/data-santri.html',
  '/pos-keuangan.html',
  '/transaksi-kas.html',
  '/buku-kas.html',
  '/rekap-piutang.html',
  '/live-chat.html', // Tambahan file yang sudah kita operasi
  '/firebase-config.js',
  '/manifest.json',
  '/Logo-Favicon.png',
  '/Lambang-Keuangan.png'
];

// 1. Install Service Worker & Simpan Cache Inti
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Mengunduh aset versi terbaru...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Memaksa SW baru segera terinstal tanpa menunggu tab ditutup
  self.skipWaiting();
});

// 2. Hapus Cache Lama (Pembersihan Sisa-sisa File Usang)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Menghapus cache usang:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Memaksa kontrol langsung ke halaman yang sedang terbuka
  self.clients.claim();
});

// 3. Strategi: Network First dengan Dynamic Caching (Anti-Lemot & Anti-Kudet)
self.addEventListener('fetch', event => {
  // Abaikan request dari ekstensi chrome atau API eksternal yang tidak perlu dicache
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Jika berhasil ambil dari server, simpan/update ke Cache (Dynamic Caching)
        if (event.request.method === 'GET' && response.status === 200) {
          let responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Jika sedang OFFLINE, ambil dari Cache memori HP
        return caches.match(event.request);
      })
  );
});

// 4. Listener untuk Force Update dari Client (HTML)
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
