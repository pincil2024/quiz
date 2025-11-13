// ===========================================
// token-manager.client.js - FINAL FIXED VERSION (2025)
// ===========================================

import { auth, db } from "./firebase-init.js";
import { doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ------------------------
// Force Admin Access
// ------------------------
function forceAdminAccess() {
  const adminEmails = ["pincil.pintarsikecil@gmail.com"];
  const user = auth.currentUser;
  if (user && adminEmails.includes(user.email.toLowerCase())) {
    console.log("🔓 Force-admin granted for:", user.email);
    localStorage.setItem("isAdmin", "true");
    document.body.classList.add("is-admin");
    return true;
  }
  return false;
}

// ------------------------
// Local caches
// ------------------------
let userTokens = {};
let expirationDates = {};
let currentUserEmail = null;
let _initialized = false;
let unsubscribeTokens = null;

// Anti-stale guards
let lastGoodTokens = null;

let tokenSubscribers = [];
// Prevent ReferenceError for snapshot tracking
let firstSnapshot = true;
let lastSnapshotTime = 0;


// Optional callback for UI updates
let onTokensUpdated = null;
export function setOnTokensUpdated(callback) {
  onTokensUpdated = callback;
  console.log("🪄 onTokensUpdated callback registered");
}

function notifySubscribers(tokens, tokensAvailable = {}) {
  try {
    tokenSubscribers.forEach(cb => {
      try { cb(tokens, tokensAvailable); } catch (e) { console.error("subscriber failed", e); }
    });
  } catch (e) {
    console.error("notifySubscribers failed:", e);
  }
}

const markInitialized = () => {
  if (!_initialized) {
    _initialized = true;
    console.log("✅ TokenManager ready — first valid snapshot received");
    try {
      window.dispatchEvent(new Event('tokenManagerReady'));
    } catch (err) {
      console.warn("Could not dispatch tokenManagerReady event:", err);
    }
    checkExpirations();
  }
};

// ==========================================
// Init Token Manager for Logged-in User
// ==========================================
export async function initTokenManager(user) {
  if (!user) {
    _initialized = false;
    userTokens = {};
    expirationDates = {};
    console.log("❌ Token manager: No user provided");
    return;
  }

  console.log("🔄 Token manager initializing for:", user.email);
  if (forceAdminAccess()) console.log("Admin access forced - full content unlocked");

  currentUserEmail = user.email.toLowerCase();

  try {
    const userRef = doc(db, "users", currentUserEmail);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      console.warn("⚠️ No user document found");
      userTokens = {};
    } else {
      const data = snap.data();
      userTokens = data.tokens || {};
      console.log("✅ Tokens loaded from Firestore:", userTokens);
      lastGoodTokens = structuredClone(userTokens);
      persistTokensToLocalStorage();
    }

    // Build expiration map
    expirationDates = {};
    for (const [productId, tokenInfo] of Object.entries(userTokens)) {
      if (tokenInfo.expiresAt) expirationDates[productId] = new Date(tokenInfo.expiresAt);
    }

    // Setup listener
    if (unsubscribeTokens) unsubscribeTokens();

    unsubscribeTokens = subscribeTokens(currentUserEmail, (tokens, tokensAvailable) => {
      const now = Date.now();

      // 🧩 Ignore all empty or undefined snapshots to prevent relocking
      if (!tokens || Object.keys(tokens).length === 0) {
        console.log("⚠️ Empty snapshot ignored, keeping last good tokens");
        tokens = lastGoodTokens;
      } else {
        lastGoodTokens = structuredClone(tokens);
      }

      firstSnapshot = false;
      lastSnapshotTime = now;

      userTokens = tokens;
      persistTokensToLocalStorage();

      markInitialized();

      console.log("🔁 Tokens updated in real-time:", userTokens);

      expirationDates = {};
      for (const [productId, tokenInfo] of Object.entries(userTokens)) {
        if (tokenInfo.expiresAt) expirationDates[productId] = new Date(tokenInfo.expiresAt);
      }

      checkExpirations();

      if (typeof onTokensUpdated === "function") {
        try {
          onTokensUpdated(userTokens, tokensAvailable);
        } catch (err) {
          console.error("⚠️ onTokensUpdated callback failed:", err);
        }
      }

      try {
        notifySubscribers(userTokens, tokensAvailable);
      } catch (e) {
        console.error("Failed to notify token subscribers:", e);
      }
    });

    console.log("🧩 Live token updates subscribed for:", currentUserEmail);
  } catch (err) {
    console.error("❌ Error loading tokens from Firestore:", err);

    if (err.code === "permission-denied" || err.code === "missing-or-insufficient-permissions") {
      console.log("🔒 Permission denied - using localStorage fallback");
      loadTokensFromLocalStorage();
    } else {
      _initialized = false;
    }
  }
}

// ==========================================
// Local Storage Persistence
// ==========================================
function persistTokensToLocalStorage() {
  try {
    localStorage.setItem("userTokens", JSON.stringify(userTokens));
    console.log("💾 Tokens saved to localStorage");
  } catch (err) {
    console.warn("⚠️ Failed to persist tokens:", err);
  }
}

function loadTokensFromLocalStorage() {
  try {
    const storedTokens = localStorage.getItem("userTokens");
    if (storedTokens) {
      userTokens = JSON.parse(storedTokens);
      console.log("✅ Tokens loaded from localStorage:", userTokens);

      expirationDates = {};
      for (const [productId, tokenInfo] of Object.entries(userTokens)) {
        if (tokenInfo.expiresAt) expirationDates[productId] = new Date(tokenInfo.expiresAt);
      }

      _initialized = true;
      lastGoodTokens = structuredClone(userTokens);
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
}

// ==========================================
// Firestore Token Subscription
// ==========================================
export function subscribeTokens(email, onUpdate) {
  if (!auth.currentUser || !email) {
    console.warn("❌ subscribeTokens blocked: no logged-in user");
    return () => {};
  }

  const userRef = doc(db, "users", email.toLowerCase());

  if (unsubscribeTokens) {
    unsubscribeTokens();
    unsubscribeTokens = null;
  }

 unsubscribeTokens = onSnapshot(userRef, snap => {
  if (!auth.currentUser) {
    console.warn("❌ Snapshot ignored: user logged out");
    return;
  }

  if (!snap.exists()) return;

  const data = snap.data();
  const tokensAvailable = data.tokensAvailable || {};
  const tokens = data.tokens || {};

  // ⚠️ Don't early-return — let initTokenManager handle empties
  onUpdate(tokens, tokensAvailable);
});

  return unsubscribeTokens;
}

// ==========================================
// Helpers
// ==========================================
export function isTokenManagerInitialized() {
  return _initialized;
}

export function clearTokens() {
  if (unsubscribeTokens) {
    unsubscribeTokens();
    unsubscribeTokens = null;
    console.log("🧹 Unsubscribed Firestore token listener");
  }

  userTokens = {};
  expirationDates = {};
  _initialized = false;
  currentUserEmail = null;
  lastGoodTokens = null;
  firstSnapshot = true;
  localStorage.removeItem("userTokens");
  console.log("🗑️ Tokens cleared and localStorage reset");
}

function checkExpirations() {
  const today = new Date();
  const lastWarningKey = "lastWarningDate";
  const lastWarningDate = localStorage.getItem(lastWarningKey);

  for (const [productId, expDate] of Object.entries(expirationDates)) {
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    if ((diffDays === 5 || diffDays === 1) && lastWarningDate !== today.toDateString()) {
      alert(`⚠️ Your access for "${productId}" will expire in ${diffDays} day(s)!`);
      localStorage.setItem(lastWarningKey, today.toDateString());
    }
  }
}

// ==========================================
// Access Checker - FIXED VERSION
// ==========================================
export function hasAccess(contentId, tokens = null) {
  // Always check admin first
  if (localStorage.getItem("isAdmin") === "true") {
    console.log(`🔓 Admin access granted for ${contentId}`);
    return true;
  }

  const user = auth.currentUser;
  if (!user) {
    console.warn("❌ hasAccess blocked: no user logged in");
    return false;
  }

  const t = (tokens || userTokens)[contentId];
  if (!t) {
    console.warn(`❌ No token found for ${contentId}`);
    return false;
  }

  // Check if token is active and not expired
  if (!t.active) {
    console.warn(`❌ Token inactive for ${contentId}`);
    return false;
  }

  if (!t.expiresAt) {
    console.warn(`❌ No expiration date for ${contentId}`);
    return false;
  }

  const expiry = new Date(t.expiresAt);
  const now = new Date();
  const valid = expiry > now;
  
  console.log(`🔑 ${contentId} access check:`, {
    active: t.active,
    expiresAt: t.expiresAt,
    expiry: expiry,
    now: now,
    valid: valid,
    timeRemaining: valid ? Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)) + ' days' : 'EXPIRED'
  });

  return valid;
}

// ==========================================
// Premium Access Checker
// ==========================================
export function hasPremiumAccess(tokens = null) {
  // Admins always have premium
  if (localStorage.getItem("isAdmin") === "true") return true;

  const user = auth.currentUser;
  if (!user) return false;

  const allTokens = tokens || userTokens;
  const premium = allTokens["premium-only"];
  const allAccess = allTokens["all-access"];

  // Either "premium-only" or "all-access" gives premium privileges
  const activePremium =
    (premium && premium.active && premium.expiresAt && new Date(premium.expiresAt) > new Date()) ||
    (allAccess && allAccess.active && allAccess.expiresAt && new Date(allAccess.expiresAt) > new Date());

  return !!activePremium;
}

// ==========================================
// Global TokenManager Helper
// ==========================================
window.tokenManager = {
  ...window.tokenManager,
  hasPremiumAccess() {
    return hasPremiumAccess(userTokens);
  },
  hasAccessTo(contentId) {
    return hasAccess(contentId, userTokens);
  },
  addContentAccess(contentId, token) {
    userTokens[contentId] = { token, issuedAt: new Date(), active: true };
    expirationDates[contentId] = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    lastGoodTokens = structuredClone(userTokens);
    persistTokensToLocalStorage();
    console.log(`🔑 Temporary access added for ${contentId}`);
    notifySubscribers(userTokens, {});
  },
  generatePurchaseUrl(contentId, title, redirectUrl) {
    const base = "/.netlify/functions/create-checkout";
    return `${base}?contentId=${contentId}&title=${encodeURIComponent(title)}&redirect=${encodeURIComponent(redirectUrl)}`;
  },
  isInitialized() {
    return _initialized;
  },
  clearTokens() {
    clearTokens();
  },
  subscribe(cb) {
    if (typeof cb !== 'function') return () => {};
    tokenSubscribers.push(cb);
    try { cb(userTokens, {}); } catch (err) { console.error("subscriber initial call failed:", err); }
    return () => {
      const idx = tokenSubscribers.indexOf(cb);
      if (idx >= 0) tokenSubscribers.splice(idx, 1);
    };
  }
};

// ==========================================
// Access Ready Waiter
// ==========================================
export async function ensureAccessReady(timeoutMs = 5000) {
  const start = Date.now();
  while (!_initialized && Date.now() - start < timeoutMs) {
    await new Promise(res => setTimeout(res, 100));
  }
  if (!_initialized) console.warn("⚠️ TokenManager never initialized in time");
}

export { auth };
