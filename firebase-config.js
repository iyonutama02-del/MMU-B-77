// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyAFdlgBRw9stQDAguizoFho5vhpdd1TDiw",
    authDomain: "keuangan-mmu-b-77.firebaseapp.com",
    databaseURL: "https://keuangan-mmu-b-77-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "keuangan-mmu-b-77",
    storageBucket: "keuangan-mmu-b-77.appspot.com",
    messagingSenderId: "1054561507756",
    appId: "1:1054561507756:web:e16722c692d3b44ed3c209"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();