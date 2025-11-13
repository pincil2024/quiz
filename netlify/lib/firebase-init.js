// netlify/lib/firebase-init.js (for functions)
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAKFiCF8Foaq6e5LZq9wJ_yphxPuUhn6vE",
    authDomain: "token-f9eeb.firebaseapp.com",
    projectId: "token-f9eeb",
    storageBucket: "token-f9eeb.firebasestorage.app",
    messagingSenderId: "813958921402",
    appId: "1:813958921402:web:dfe905e58af885421ed683",
    measurementId: "G-D2W7PGLC0R"
  };

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
