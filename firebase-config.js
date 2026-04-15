// firebase-config.js
// KONFIGURASI AMAN & BERSIH - Menggunakan Environment Variables

// 1. Cek apakah menggunakan environment variable atau fallback (Hardcoded Aman)
const firebaseConfig = {
    apiKey: window.ENV?.VITE_FIREBASE_API_KEY || "AIzaSyAFdlgBRw9stQDAguizoFho5vhpdd1TDiw",
    authDomain: window.ENV?.VITE_FIREBASE_AUTH_DOMAIN || "keuangan-mmu-b-77.firebaseapp.com",
    databaseURL: window.ENV?.VITE_FIREBASE_DATABASE_URL || "https://keuangan-mmu-b-77-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: window.ENV?.VITE_FIREBASE_PROJECT_ID || "keuangan-mmu-b-77",
    storageBucket: window.ENV?.VITE_FIREBASE_STORAGE_BUCKET || "keuangan-mmu-b-77.appspot.com",
    messagingSenderId: window.ENV?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1054561507756",
    appId: window.ENV?.VITE_FIREBASE_APP_ID || "1:1054561507756:web:e16722c692d3b44ed3c209"
};

// 2. INISIALISASI FIREBASE (Hanya dieksekusi 1x untuk mencegah memory leak)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 3. EXPORT MODULES (Jembatan Utama Aplikasi)
const database = firebase.database();
const auth = firebase.auth();

// 4. HELPER SANITASI GLOBAL (Pencegah XSS Lintas File)
window.sanitizeInput = function(input) {
    if (input === null || input === undefined) return '';
    return String(input)
        .replace(/[&<>'"]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            if (m === "'") return '&#39;';
            if (m === '"') return '&quot;';
            return m;
        });
};

/* ==================================================================
  LOG PEMBERSIHAN KEAMANAN (AUDIT 2026):
  - Fungsi window.validateAccess() DIHAPUS (Sekarang dipindah ke Server-Side per HTML)
  - Fungsi window.checkRateLimit() DIHAPUS (Sistem blokir login sekarang dicatat di Firebase Database)
  - Fungsi window.generateCsrfToken() DIHAPUS (Tidak relevan untuk Firebase Realtime DB, hanya bikin lemot)
  ==================================================================
*/
