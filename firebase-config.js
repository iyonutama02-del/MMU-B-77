// firebase-config.js
// KONFIGURASI AMAN - Menggunakan Environment Variables

// Cek apakah menggunakan environment variable atau fallback
const firebaseConfig = {
    apiKey: window.ENV?.VITE_FIREBASE_API_KEY || "AIzaSyAFdlgBRw9stQDAguizoFho5vhpdd1TDiw",
    authDomain: window.ENV?.VITE_FIREBASE_AUTH_DOMAIN || "keuangan-mmu-b-77.firebaseapp.com",
    databaseURL: window.ENV?.VITE_FIREBASE_DATABASE_URL || "https://keuangan-mmu-b-77-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: window.ENV?.VITE_FIREBASE_PROJECT_ID || "keuangan-mmu-b-77",
    storageBucket: window.ENV?.VITE_FIREBASE_STORAGE_BUCKET || "keuangan-mmu-b-77.appspot.com",
    messagingSenderId: window.ENV?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1054561507756",
    appId: window.ENV?.VITE_FIREBASE_APP_ID || "1:1054561507756:web:e16722c692d3b44ed3c209"
};

// INISIALISASI FIREBASE
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const auth = firebase.auth();

// Helper function untuk sanitasi input
window.sanitizeInput = function(input) {
    if (input === null || input === undefined) return '';
    return String(input)
        .replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        })
        .replace(/['"]/g, '');
};

// Helper function untuk validasi akses
window.validateAccess = async function(resourceId, userId, requiredRole) {
    const userRole = localStorage.getItem('hakAkses');
    const currentUser = localStorage.getItem('usernameAsli');
    
    // Admin selalu punya akses
    if (userRole === 'Administrator' || userRole === 'Developer') {
        return true;
    }
    
    // Validasi kepemilikan resource
    if (resourceId && userId) {
        const snapshot = await database.ref(`tagihan/${resourceId}`).once('value');
        const data = snapshot.val();
        
        if (data && data.ID_Murid === userId) {
            return true;
        }
    }
    
    // Cek role
    if (requiredRole && userRole !== requiredRole) {
        return false;
    }
    
    return true;
};

// Rate limiting untuk login
window.loginAttempts = 0;
window.loginLockUntil = null;

window.checkRateLimit = function() {
    if (window.loginLockUntil && Date.now() < window.loginLockUntil) {
        const remainingSeconds = Math.ceil((window.loginLockUntil - Date.now()) / 1000);
        throw new Error(`Terlalu banyak percobaan. Coba lagi ${remainingSeconds} detik.`);
    }
    return true;
};

window.incrementLoginAttempts = function() {
    window.loginAttempts++;
    if (window.loginAttempts >= 5) {
        window.loginLockUntil = Date.now() + 15 * 60 * 1000; // 15 menit
        setTimeout(() => {
            window.loginAttempts = 0;
            window.loginLockUntil = null;
        }, 15 * 60 * 1000);
    }
};

window.resetLoginAttempts = function() {
    window.loginAttempts = 0;
    window.loginLockUntil = null;
};

// CSRF Token Management
window.csrfToken = null;

window.generateCsrfToken = function() {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('csrfToken', token);
    return token;
};

window.validateCsrfToken = function(token) {
    const storedToken = sessionStorage.getItem('csrfToken');
    return token && storedToken && token === storedToken;
};

// Generate token saat load
window.generateCsrfToken();