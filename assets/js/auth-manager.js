// assets/js/auth-manager.js
// Firebase v9+ modular - auth UI + token integration

import { auth, db } from "./firebase-init.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  onSnapshot,
  deleteField
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { initTokenManager, hasAccess as tokenHasAccess, ensureAccessReady} from "./token-manager.client.js";


import { PRODUCT_CONFIG } from "./product-config.js";
import { showClaimDialog } from "./token-ui.js";
import { setOnTokensUpdated } from "./token-manager.client.js";

// internal state to avoid double-binding
let uiBound = false;
let authStateUnsub = null;


// ----------------- Utilities -----------------
function sanitizeInput(input) {
  if (!input) return "";
  return input.toString().replace(/[<>]/g, "");
}

function getUserInitials(email) {
  if (!email) return "?";
  return email.charAt(0).toUpperCase();
}

// ----------------- Admin Check -----------------
async function isUserAdmin() {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      console.log("No authenticated user found - not admin");
      localStorage.setItem('isAdmin', 'false');
      document.body.classList.remove("is-admin");
      return false;
    }
    
    console.log("Checking admin status for user:", user.email, user.uid);
    
    // Manual admin list as fallback
    const manualAdmins = [
      "pincil.pintarsikecil@gmail.com",  // ← REPLACE WITH YOUR EMAIL
   
    ];
    
    // Check manual list first
    if (manualAdmins.includes(user.email.toLowerCase())) {
      console.log("✅ Admin access granted via manual list");
      localStorage.setItem('isAdmin', 'true');
      document.body.classList.add("is-admin");
      return true;
    }
    
    // Try Firestore methods with better error handling
    try {
      // Method 1: Check admins collection with UID
      const adminDocRef = doc(db, "admins", user.uid);
      const adminDoc = await getDoc(adminDocRef);
      
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        if (adminData.isAdmin === true) {
          console.log("✅ Admin access granted via admins collection");
          localStorage.setItem('isAdmin', 'true');
          document.body.classList.add("is-admin");
          return true;
        }
      }
    } catch (error) {
      console.log("Admin collection not accessible, trying config...");
    }
    
    try {
      // Method 2: Check if user email is in admin list
      const adminEmailsDoc = await getDoc(doc(db, "config", "adminEmails"));
      if (adminEmailsDoc.exists()) {
        const adminEmails = adminEmailsDoc.data().emails || [];
        if (adminEmails.includes(user.email.toLowerCase())) {
          console.log("✅ Admin access granted via email list");
          localStorage.setItem('isAdmin', 'true');
          document.body.classList.add("is-admin");
          return true;
        }
      }
    } catch (error) {
      console.log("Config collection not accessible");
    }
    
    console.log("User is not an admin");
    localStorage.setItem('isAdmin', 'false');
    document.body.classList.remove("is-admin");
    return false;
    
  } catch (error) {
    console.error("Error checking admin status:", error);
    localStorage.setItem('isAdmin', 'false');
    document.body.classList.remove("is-admin");
    return false;
  }
}
// ----------------- Overlay controls & toggles -----------------
function showOverlay(section = "login") {
  const overlay = document.getElementById("accessOverlay");
  if (!overlay) return;
  overlay.style.display = "block";
  document.body.style.overflow = "hidden";

  const registerSection = document.getElementById("registerSection");
  const loginSection = document.getElementById("loginSection");
  const resetSection = document.getElementById("resetSection");
  const welcomeBackSection = document.getElementById("welcomeBackSection");

  if (registerSection) registerSection.style.display = "none";
  if (loginSection) loginSection.style.display = "none";
  if (resetSection) resetSection.style.display = "none";
  if (welcomeBackSection) welcomeBackSection.style.display = "none";

  if (section === "register" && registerSection) registerSection.style.display = "block";
  if (section === "login" && loginSection) loginSection.style.display = "block";
  if (section === "reset" && resetSection) resetSection.style.display = "block";
  if (section === "welcome" && welcomeBackSection) welcomeBackSection.style.display = "block";
}

function closeAccessOverlay() {
  const overlay = document.getElementById("accessOverlay");
  if (!overlay) return;
  overlay.style.display = "none";
  document.body.style.overflow = "";
}

function toggleToLogin() { showOverlay("login"); }
function toggleToRegister() { showOverlay("register"); }
function toggleToReset() { showOverlay("reset"); }

// ----------------- UI binding (idempotent) -----------------
export function setupAuthUI() {
  // If it's already been bound, do nothing
  if (uiBound) return;
  uiBound = true;

  // Buttons that exist inside navbar.html / overlay
  // use optional chaining in case HTML structure changes a bit
  document.getElementById("loginLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    showOverlay("login");
  });

  document.getElementById("closeAccessOverlayBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAccessOverlay();
  });

  // Toggle buttons in the overlay (IDs must match your navbar.html)
  document.getElementById("toLoginFromRegisterBtn")?.addEventListener("click", (e) => {
    e.preventDefault(); toggleToLogin();
  });
  document.getElementById("toRegisterFromLoginBtn")?.addEventListener("click", (e) => {
    e.preventDefault(); toggleToRegister();
  });
  document.getElementById("toResetFromLoginBtn")?.addEventListener("click", (e) => {
    e.preventDefault(); toggleToReset();
  });
  document.getElementById("toLoginFromResetBtn")?.addEventListener("click", (e) => {
    e.preventDefault(); toggleToLogin();
  });

  // Reset email button
  document.getElementById("sendResetEmail")?.addEventListener("click", (e) => {
    e.preventDefault();
    sendResetEmail();
  });

  // Register form submit
  const registerForm = document.getElementById("registerSection");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // read form elements (IDs must match)
      const emailEl = document.getElementById("email");
      const nicknameEl = document.getElementById("nickname");
      const passwordEl = document.getElementById("password");
      const confirmEl = document.getElementById("confirmPassword");
 const spinner = document.getElementById("loginSpinner")
     
        spinner.style.display = "inline-block";

      const email = emailEl?.value?.trim() || "";
      const nickname = nicknameEl?.value?.trim() || "";
      const password = passwordEl?.value || "";
      const confirm = confirmEl?.value || "";

      if (!email || !password) {
        document.getElementById("registerMsg") && (document.getElementById("registerMsg").textContent = "Email & password required");
        return;
      }
      if (password !== confirm) {
        document.getElementById("registerMsg") && (document.getElementById("registerMsg").textContent = "Passwords do not match");
        return;
      }
      try {
        await registerUser(email, password, nickname);
        // success — close overlay
        closeAccessOverlay();
      } catch (err) {
        // error shown in registerUser
      } finally {
    spinner.style.display = "none";
  }
    });
  }

  // Login form submit
  const loginForm = document.getElementById("loginSection");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail")?.value?.trim() || "";
      const password = document.getElementById("loginPassword")?.value || "";
      const spinner = document.getElementById("loginSpinner")
     
        spinner.style.display = "inline-block";

      if (!email || !password) {
        document.getElementById("loginMsg") && (document.getElementById("loginMsg").textContent = "Email & password required");
        return;
      }
      try {
        await loginUser(email, password);
        closeAccessOverlay();
      } catch (err) {
        // error already handled in loginUser()
      } finally {
    spinner.style.display = "none";
  }
    });
  }
}

// ----------------- Reset helper -----------------
async function sendResetEmail() {
  const email = document.getElementById("resetEmail")?.value?.trim();
  if (!email) {
    const el = document.getElementById("resetMsg");
    if (el) el.innerText = "❌ Masukkan email valid.";
    return;
  }
  
  const spinner = document.getElementById("resetSpinner");
  const msgElement = document.getElementById("resetMsg");
  
  spinner && (spinner.style.display = "inline-block");
  msgElement && (msgElement.innerText = "Mengirim link reset...");
  
  try {
    // Send actual password reset email using Firebase
    await sendPasswordResetEmail(auth, email);
    
    // Success message
    if (msgElement) {
      msgElement.innerText = "✅ Link reset terkirim ke " + email;
      msgElement.style.color = "green";
    }
    
    console.log("Password reset email sent to:", email);
    
  } catch (error) {
    console.error("Password reset error:", error);
    
    // Handle specific error cases
    if (msgElement) {
      if (error.code === 'auth/user-not-found') {
        msgElement.innerText = "❌ Email tidak terdaftar.";
      } else if (error.code === 'auth/invalid-email') {
        msgElement.innerText = "❌ Format email tidak valid.";
      } else if (error.code === 'auth/too-many-requests') {
        msgElement.innerText = "❌ Terlalu banyak percobaan. Coba lagi nanti.";
      } else {
        msgElement.innerText = "❌ Error: " + error.message;
      }
      msgElement.style.color = "red";
    }
  } finally {
    spinner && (spinner.style.display = "none");
  }
}



// Add this function to check if user is authenticated
export function isUserAuthenticated() {
  return auth.currentUser !== null;
}

// ----------------- Auth state listener -----------------
export function initAuthStateListener() {
  // detach previous if exists
  if (authStateUnsub) {
    try { authStateUnsub(); } catch (e) {}
    authStateUnsub = null;
  }

  // Clear admin status on initial load
  localStorage.setItem('isAdmin', 'false');
  document.body.classList.remove("is-admin");
  hideAdminPanel();

// Update your auth state listener in auth-manager.js
authStateUnsub = onAuthStateChanged(auth, async (user) => {
  console.log("auth state changed:", user?.email || null);
  window.accessReady = false;

  // Always reset admin status first
  localStorage.setItem('isAdmin', 'false');
  document.body.classList.remove("is-admin");
  hideAdminPanel();

  const loginContainer = document.getElementById("loginContainer");
  const userMenuContainer = document.getElementById("userMenuContainer");
  const navWelcome = document.getElementById("navWelcome");
  const userInitials = document.getElementById("userInitials");
  const userEmail = document.getElementById("userEmail");

  if (user) {
    loginContainer && (loginContainer.style.display = "none");
    userMenuContainer && (userMenuContainer.style.display = "block");

    // Initialize token manager only when user is authenticated
    try { 
      await initTokenManager(user); 
       await ensureAccessReady(); // ✅ wait until Firestore tokens fully loaded
console.log("✅ Access ready confirmed, tokens loaded:", await tokenHasAccess("premium"));
  // ✅ Mark access ready globally so premium-lock.js can safely run now
  window.accessReady = true;
    
        // Dispatch access-ready event for premium-lock.js
        window.dispatchEvent(new CustomEvent("access-ready", { 
          detail: { hasPremium: await tokenHasAccess("premium") }
        }));
  

          // 🔔 Attach live token update listener right after init
        setOnTokensUpdated((tokens, tokensAvailable) => {
          console.log("🌟 Tokens updated callback triggered:", tokens);
          console.log("📦 Tokens available (not yet claimed):", tokensAvailable);

          // --- Premium badge refresh ---
          const premium = tokens["premium"];
          const badge = document.querySelector("#premiumBadge");
          if (badge) {
            if (premium && premium.active && new Date(premium.expiresAt) > new Date()) {
              badge.textContent = "Premium Active";
              badge.classList.add("active");
            } else {
              badge.textContent = "Premium Expired";
              badge.classList.remove("active");
            }
          }

          // --- Optional: auto-refresh book locks ---
          if (typeof createBookCovers === "function") {
            createBookCovers();
          }

          // --- Optional: refresh claim FAB visibility ---
          const hasActive = Object.values(tokens || {}).some(t => t.active);
          const unclaimedExists = Object.values(tokensAvailable || {}).length > 0;
          const fab = document.getElementById("claim-floating-btn");
          if (fab) {
            fab.style.display = !hasActive && unclaimedExists ? "block" : "none";
          }
   // --- Glow effect for inactive/unclaimed/expired tokens ---
const userInitialsEl = document.getElementById("userInitials");
if (userInitialsEl) {
  // Check for unclaimed tokens (not active yet)
  const hasUnclaimed = Object.values(tokensAvailable || {}).length > 0;

  // Check for expired tokens (active but past expiresAt)
  const hasExpired = Object.values(tokens || {}).some(
    t => t.active && t.expiresAt && new Date(t.expiresAt) <= new Date()
  );

  // Remove any previous glow classes
  userInitialsEl.classList.remove("user-glow-warning", "user-glow-expired");

  // Add glow according to status
  if (hasExpired) {
    userInitialsEl.classList.add("user-glow-expired"); // 🔴 red glow
  } else if (hasUnclaimed) {
    userInitialsEl.classList.add("user-glow-warning"); // 🟡 gold glow
  }
}

        });

       // 🔔 Start listening for pendingTokens in real time
    watchPendingTokens(user.email);

      // Refresh book covers after token manager is initialized
      if (typeof createBookCovers === 'function') {
        createBookCovers();
      }
    // ✅ Show welcome dialog EVERY TIME user logs in (check localStorage)
if (!localStorage.getItem('welcomeShown')) {
  setTimeout(() => {
    showWelcomeDialog();
  }, 1000); // Show after 1 second delay
}
    } catch (err) { 
      console.error("token init error", err); 
      // Even if there's an error, mark access as ready to prevent infinite locking
      window.accessReady = true;
      window.dispatchEvent(new Event("access-ready"));
      
      // ✅ Show welcome dialog even if token init fails
      setTimeout(() => {
        showWelcomeDialog();
      }, 1000);
    }

    // show profile info
    let nickname = user.email.split("@")[0];
    try {
      const snap = await getDoc(doc(db, "users", user.email.toLowerCase()));
      if (snap.exists()) nickname = snap.data().nickname || nickname;
    } catch (err) {
      console.error("Error getting user doc:", err);
    }

    navWelcome && (navWelcome.textContent = `Halo, ${sanitizeInput(nickname)}!`);
    userInitials && (userInitials.textContent = getUserInitials(user.email));
    userEmail && (userEmail.textContent = user.email);

   // 🔑 Fetch tokens & show welcome dialog (only once per login session)
try {
  const snap = await getDoc(doc(db, "users", user.email.toLowerCase()));
  if (snap.exists()) {
    const data = snap.data();
    const tokens = {};
    let nearestExpiry = null;

    if (data.tokens) {
      for (const [key, value] of Object.entries(data.tokens)) {
        if (value.active && Date.now() < value.expiresAt) {
          tokens[key] = true;
          if (!nearestExpiry || value.expiresAt < nearestExpiry) {
            nearestExpiry = value.expiresAt;
          }
        }
      }
    }

   // ✅ Check for unclaimed tokens and update userInitials glow
    const hasUnclaimed = Object.values(data.tokens || {})
      .some(t => !t.active);
    
    const userInitialsEl = document.getElementById("userInitials");
    if (userInitialsEl) {
      if (hasUnclaimed) {
        userInitialsEl.classList.add("user-glow-warning");
      } else {
        userInitialsEl.classList.remove("user-glow-warning");
      }
    }
  }
} catch (err) {
  console.error("Error loading tokens:", err);
}


      // FIXED: Use only one admin check function
      const isAdmin = await isUserAdmin(); // This properly checks admin status
      
      if (isAdmin) {
        console.log("🛠️ User is admin - showing admin panel");
        showAdminPanel();
      } else {
        console.log("🛠️ User is not admin - hiding admin panel");
        hideAdminPanel();
      }
      
      closeAccessOverlay();
    } else {
      loginContainer && (loginContainer.style.display = "block");
      userMenuContainer && (userMenuContainer.style.display = "none");
      navWelcome && (navWelcome.textContent = "");
      
      // Clear token data when user signs out
      if (typeof clearTokens === 'function') {
        clearTokens();
      }
      
      // Refresh book covers to show locked state
      if (typeof createBookCovers === 'function') {
        createBookCovers();
      }
    }
  });
}



export async function registerUser(email, password, nickname = "") {
  console.log("Starting registration for:", email);

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Create empty user doc (tokens only come on login)
    await setDoc(doc(db, "users", email.toLowerCase()), {
      email: email.toLowerCase(),
      nickname: sanitizeInput(nickname || email.split("@")[0]),
      createdAt: serverTimestamp(),
      lastLogin: new Date().toISOString(),
      tokens: {},
    });

    console.log("✅ Created new user profile (no tokens yet)");

    return cred.user;
  } catch (err) {
    console.error("Registration failed:", err);
    alert("Registrasi gagal: " + (err.message || err));
    throw err;
  }
}


// ----------------- Login/Register/Logout -----------------
export async function loginUser(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", email.toLowerCase());
    const userDoc = await getDoc(userRef);

    let safeNickname = "";
    if (userDoc.exists()) {
      safeNickname = sanitizeInput(userDoc.data().nickname || "");
    }

    // --- Pending tokens with retry ---
    const pendingRef = doc(db, "pendingTokens", email.toLowerCase());
    let pendingDoc = null;

    // retry up to 3 times, with 300ms delay each
    for (let attempt = 1; attempt <= 3; attempt++) {
      pendingDoc = await getDoc(pendingRef);
      if (pendingDoc.exists()) break;
      console.log(`⏳ Pending tokens not found (try ${attempt}), retrying...`);
      await new Promise(res => setTimeout(res, 300));
    }

    let migratedTokens = {};
    if (pendingDoc.exists()) {
      let rawTokens = pendingDoc.data().tokens || {};
      console.log("📋 Found pending tokens:", rawTokens);

  const now = new Date();
for (const [contentId, token] of Object.entries(rawTokens)) {
  const duration = PRODUCT_CONFIG[contentId]?.durationDays || token.durationDays || 30;

  migratedTokens[contentId] = {
    grantedAt: now.toISOString(),
    expiresAt: null,     // only set after activation
    durationDays: duration,
    active: false,
  };
}
    }

    if (userDoc.exists()) {
      // Merge existing tokens + migrated tokens
      const existingData = userDoc.data();
      await updateDoc(userRef, {
        nickname: safeNickname,
        lastLogin: new Date().toISOString(),
        tokens: { ...(existingData.tokens || {}), ...migratedTokens },
      });
      console.log("✅ Updated existing user with migrated tokens");
    } else {
      // New user
      await setDoc(userRef, {
        email: email.toLowerCase(),
        nickname: safeNickname || email.split("@")[0],
        createdAt: serverTimestamp(),
        lastLogin: new Date().toISOString(),
        tokens: migratedTokens,
      });
      console.log("✅ Created new user with migrated tokens");
    }

    // Clean up only if migration succeeded
    if (pendingDoc.exists() && Object.keys(migratedTokens).length > 0) {
      await deleteDoc(pendingRef);
      console.log("🧹 Cleaned up pending tokens after migration");
    }

    // Initialize token manager
    await initTokenManager(cred.user);

    // Start watching for new tokens in real-time
watchPendingTokens(email);

   if (Object.keys(migratedTokens).length > 0) {
  const userSnap = await getDoc(userRef);
  const freshTokens = userSnap.exists() ? userSnap.data().tokens : {};
  showClaimDialog(email, freshTokens, "claim");
  sessionStorage.setItem("welcomeShown", "true");
}


    // Refresh book covers if function exists
    if (typeof createBookCovers === "function") {
      createBookCovers();
      console.log("🔄 Refreshed book covers");
    }

    return cred.user;
  } catch (err) {
    console.error("Login failed:", err);
    alert("Login gagal: " + (err.message || err));
    throw err;
  }
}

// ----------------- Welcome Dialog -----------------
function showWelcomeDialog() {
  // Remove any existing welcome dialog
  document.querySelectorAll('.welcome-dialog-overlay').forEach(el => el.remove());
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'welcome-dialog-overlay';
  
  // Create dialog
  const dialog = document.createElement('div');
  dialog.className = 'welcome-dialog';
  
  dialog.innerHTML = `
    <div class="welcome-content">
      <div class="welcome-icon">🎉</div>
      <h2>Selamat Datang di Pincil!</h2>
      <p>Jika kamu sudah membeli konten di Lynk, silakan klaim aksesnya dengan mengeklik inisial berwarna emas di navigasi bar.</p>
      <p>Terima kasih dan semoga hari belajarmu menyenangkan! 📚✨</p>
      <button class="welcome-close-btn">Mengerti</button>
    </div>
  `;
  
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  
  // Add event listener for close button
  dialog.querySelector('.welcome-close-btn').addEventListener('click', () => {
    overlay.remove();
    // Mark as shown for this session using localStorage (persists until browser close)
    localStorage.setItem('welcomeShown', 'true');
  });
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      localStorage.setItem('welcomeShown', 'true');
    }
  });
  
  // Auto-close after 8 seconds
  setTimeout(() => {
    if (document.body.contains(overlay)) {
      overlay.remove();
      localStorage.setItem('welcomeShown', 'true');
    }
  }, 8000);
}

// ----------------- Real-time pending token listener -----------------
let pendingUnsub = null;

export function watchPendingTokens(userEmail) {
  if (pendingUnsub) pendingUnsub(); // stop old listener

  const pendingRef = doc(db, "pendingTokens", userEmail.toLowerCase());

  pendingUnsub = onSnapshot(pendingRef, async (snap) => {
    if (!snap.exists()) return;

    const rawTokens = snap.data().tokens || {};
    if (Object.keys(rawTokens).length === 0) return;

    console.log("⚡ New pending tokens detected in real-time:", rawTokens);

    const userRef = doc(db, "users", userEmail.toLowerCase());
    const userSnap = await getDoc(userRef);
    const existing = userSnap.exists() ? (userSnap.data().tokens || {}) : {};

    const now = Date.now();
    const migrated = {};

    for (const [contentId, token] of Object.entries(rawTokens)) {
      migrated[contentId] = {
        active: false, // still needs claim
       durationDays: token.durationDays || PRODUCT_CONFIG[contentId]?.durationDays || 30,
        grantedAt: new Date(now).toISOString(),
          expiresAt: null
      };
    }

    await updateDoc(userRef, {
      tokens: { ...existing, ...migrated }
    });

    console.log("✅ Migrated new tokens instantly");

    await deleteDoc(pendingRef);

    // Trigger UI
    showClaimDialog(userEmail, { ...existing, ...migrated }, "claim");
  });
}

export async function activateToken(email, contentId, token) {
  const userRef = doc(db, "users", email.toLowerCase());
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;

  const data = snap.data();
  const now = new Date();
  const duration = token.durationDays || PRODUCT_CONFIG[contentId]?.durationDays || 30;

  const updates = {
    [`tokens.${contentId}`]: {
      grantedAt: token.grantedAt || now.toISOString(),
      expiresAt: new Date(now.getTime() + duration * 24 * 60 * 60 * 1000).toISOString(),
      durationDays: duration,
      active: true,
    },
    [`tokensAvailable.${contentId}`]: deleteField()
  };

  // --- Premium stacking --- FIXED CALCULATION ---
  let totalExtraDays = 0;
  
  // Add current book's duration
  if (contentId.startsWith("book-")) {
    totalExtraDays += duration;
  }
  
  // Add remaining days from other active books
  for (const [cid, t] of Object.entries(data.tokens || {})) {
    if (cid.startsWith("book-") && t.active && t.expiresAt && cid !== contentId) {
      const exp = new Date(t.expiresAt);
      if (exp > now) {
        // FIXED: Use Math.floor for accurate day calculation
        const daysRemaining = Math.floor((exp - now) / (1000 * 60 * 60 * 24));
        totalExtraDays += daysRemaining;
        console.log(`📚 Adding ${daysRemaining} days from ${cid}`);
      }
    }
  }
  
  if (totalExtraDays > 0) {
    // FIXED: Subtract 1 day to get exact 60 days for premium
    // This accounts for the inclusive counting issue
    const adjustedDays = Math.max(59, totalExtraDays - 1); // Ensure at least 59 days
    
    const premiumExpiry = new Date(now.getTime() + adjustedDays * 24 * 60 * 60 * 1000);
    
    updates[`tokens.premium`] = {
      grantedAt: data.tokens?.premium?.grantedAt || now.toISOString(),
      expiresAt: premiumExpiry.toISOString(),
      durationDays: adjustedDays,
      active: true,
    };
    
    console.log('🔧 Premium stacking calculation FIXED:', {
      now: now.toISOString(),
      totalExtraDays: totalExtraDays,
      adjustedDays: adjustedDays,
      premiumExpiry: premiumExpiry.toISOString(),
      expectedDays: Math.floor((premiumExpiry - now) / (1000 * 60 * 60 * 24))
    });
  }

  await updateDoc(userRef, updates);

  // ✅ return fresh tokens after update
  const newSnap = await getDoc(userRef);
  return newSnap.data().tokens || {};
}
 
// In the setOnTokensUpdated callback - ENHANCE THIS PART
setOnTokensUpdated((tokens, tokensAvailable) => {
  console.log("🌟 Tokens updated callback triggered:", tokens);
  console.log("📦 Tokens available (not yet claimed):", tokensAvailable);

  // --- Premium badge refresh ---
  const premium = tokens["premium"];
  const badge = document.querySelector("#premiumBadge");
  if (badge) {
    if (premium && premium.active && new Date(premium.expiresAt) > new Date()) {
      badge.textContent = "Premium Active";
      badge.classList.add("active");
    } else {
      badge.textContent = "Premium Expired";
      badge.classList.remove("active");
    }
  }

  // --- Auto-refresh book locks ---
  if (typeof createBookCovers === "function") {
    createBookCovers();
  }

  // --- Glow effect for unclaimed tokens ---
  const userInitialsEl = document.getElementById("userInitials");
  if (userInitialsEl) {
    // Check for unclaimed tokens (not active yet)
    const hasUnclaimed = Object.values(tokens || {}).some(t => !t.active) || 
                         Object.values(tokensAvailable || {}).length > 0;

    // Check for expired tokens (active but past expiresAt)
    const hasExpired = Object.values(tokens || {}).some(
      t => t.active && t.expiresAt && new Date(t.expiresAt) <= new Date()
    );

    // Remove any previous glow classes
    userInitialsEl.classList.remove("user-glow-warning", "user-glow-expired");

    // Add glow according to status
    if (hasExpired) {
      userInitialsEl.classList.add("user-glow-expired"); // 🔴 red glow
    } else if (hasUnclaimed) {
      userInitialsEl.classList.add("user-glow-warning"); // 🟡 gold glow
    }
  }
});

export async function logoutUser() {
  try {
    console.log('🚪 Logging out user...');
    
    // Clear all localStorage data
    localStorage.removeItem('userTokens');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userData');
     localStorage.removeItem('welcomeShown'); // Clear welcome flag on logout

    
    // Clear any Firebase auth data
    if (typeof clearTokens === 'function') {
      clearTokens();
    }
    
    // Dispatch logout event BEFORE signing out
    console.log('📢 Dispatching logout event');
    window.dispatchEvent(new CustomEvent('user-logged-out'));
    
    // Then sign out from Firebase
    await firebaseSignOut(auth);
    
    console.log('✅ User logged out successfully');
    
  } catch (err) {
    console.error("Logout failed:", err);
  }
}
export async function completeLynkRegistration(email, password, nickname = "") {
  try {
    // Create auth account
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", email.toLowerCase());

    // Create user document base (no tokens yet)
    await setDoc(userRef, {
      email: email.toLowerCase(),
      nickname: sanitizeInput(nickname || email.split("@")[0]),
      createdAt: serverTimestamp(),
      fromLynk: true,
      tokens: {}, // explicitly empty
    });

    console.log("✅ Lynk user created (tokens will migrate only on first login)");

    // IMPORTANT: Do not touch pendingTokens here anymore.
    // They will be picked up and migrated by loginUser.

    return cred.user;
  } catch (err) {
    console.error("Lynk registration failed:", err);
    throw err;
  }
}

function showAdminPanel() {
  const adminPanel = document.querySelector(".admin-only");
  if (adminPanel) {
    adminPanel.style.display = "block";
    console.log("✅ Admin panel shown");
  } else {
    console.log("❌ Admin panel element not found");
  }
}

// Also add this to hide admin panel on logout
function hideAdminPanel() {
  const adminPanel = document.querySelector(".admin-only");
  if (adminPanel) {
    adminPanel.style.display = "none";
  }
}


// ----------------- Export helpers -----------------
export { tokenHasAccess as hasAccess };
export { isUserAdmin }; 