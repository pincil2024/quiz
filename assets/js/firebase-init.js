// assets/js/firebase-init.js
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
 apiKey: "AIzaSyAKFiCF8Foaq6e5LZq9wJ_yphxPuUhn6vE",
  authDomain: "token-f9eeb.firebaseapp.com",
  projectId: "token-f9eeb",
  storageBucket: "token-f9eeb.firebasestorage.app",
  messagingSenderId: "813958921402",
  appId: "1:813958921402:web:dfe905e58af885421ed683",
  measurementId: "G-D2W7PGLC0R"
};

// Ensure single app instance
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase initialized once");
} else {
  app = getApps()[0];
  console.log("⚙️ Firebase reused");
}

// Create shared instances
const auth = getAuth(app);
const db = getFirestore(app);

// Lazy-import onAuthStateChanged AFTER auth exists
let onAuthStateChangedFn = null;
import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js").then(mod => {
  onAuthStateChangedFn = mod.onAuthStateChanged;
});

// Export consistently
export { app, auth, db, onAuthStateChangedFn as onAuthStateChanged };
export default app;