// ═══════════════════════════════════════════════════════
//  D-QueenCart Jewellery — Firebase Configuration
//  Replace the values below with your own Firebase project
//  Free setup at: https://console.firebase.google.com
// ═══════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "AIzaSyCmyIStcAwBuAa0BQAVBh4O4uE6ti22b14",
  authDomain: "d-queencart-7b4f9.firebaseapp.com",
  projectId: "d-queencart-7b4f9",
  storageBucket: "d-queencart-7b4f9.appspot.com",
  messagingSenderId: "893141327235",
  appId: "1:893141327235:web:aa88bb968fd8ae0cffeab6",
  measurementId: "G-QBQ06VWE34"
};

// ── Initialize Firebase (safe — won't crash if config is placeholder) ──
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  window.db   = firebase.firestore();
  window.auth = firebase.auth();
  // Storage SDK is only loaded on admin.html — guard it
  if (typeof firebase.storage === 'function') {
    window.storage = firebase.storage();
  }
  console.log("✅ Firebase connected");
} catch (e) {
  console.warn("Firebase init skipped:", e.message);
}

// ── Global Business Configuration ───────────────────────────────
window.DQC_CONFIG = {
  storeName: "D-QueenCart",
  whatsappNumber: "919952663563", // Your business WhatsApp
  ownerName: "Admin",
  currency: "₹",
  shipping: {
    baseCharge: 100,
    freeThreshold: 500
  },
  social: {
    instagram: "D-QueenCart",
    tagline: "Fine Jewellery & Accessories"
  }
};