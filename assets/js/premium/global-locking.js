// assets/premium/global-locking.js - SIMPLIFIED VERSION
class GlobalLocker {
  constructor() {
    this.initialized = false;
    this.observer = null;
    this.lastTokenCheck = null;
    this.init();
  }

  async init() {
    if (this.initialized) return;
    
    console.log("🔒 GlobalLocker initializing...");
    await this.waitForDependencies();
    
    // Initial scan
    this.scanAndLockContent();
    
    // Setup ongoing monitoring
    this.setupMutationObserver();
    
    // Subscribe to token updates
    if (window.tokenManager && typeof window.tokenManager.subscribe === "function") {
      this._unsubscribeTokenSub = window.tokenManager.subscribe(() => {
        console.log("🔁 GlobalLocker received token update, refreshing locks");
        this.lastTokenCheck = Date.now();
        setTimeout(() => this.scanAndLockContent(), 100);
      });
    }

    // Listen for auth state changes
    this.setupAuthListener();

    // Periodic refresh
    setInterval(() => {
      this.scanAndLockContent();
    }, 10000);

    this.initialized = true;
    console.log("🔒 Global locking system initialized");
  }

  setupAuthListener() {
    // Listen for custom auth events
    window.addEventListener('user-logged-out', () => {
      console.log('🔐 Custom logout event received - LOCKING ALL CONTENT');
      setTimeout(() => {
        this.forceLockAllContent();
      }, 300);
    });

    window.addEventListener('user-logged-in', () => {
      console.log('🔐 Custom login event received - checking access');
      setTimeout(() => {
        this.scanAndLockContent();
      }, 500);
    });

    // Also check every few seconds as backup
    setInterval(() => {
      this.scanAndLockContent();
    }, 5000);
  }

  async waitForDependencies() {
    const maxWaitTime = 10000;
    const start = Date.now();
    
    while (Date.now() - start < maxWaitTime) {
      if (window.tokenManager && typeof window.tokenManager.hasAccessTo === "function") {
        console.log("✅ TokenManager loaded for global locker");
        return true;
      }
      await new Promise(r => setTimeout(r, 200));
    }
    
    console.warn("⚠️ TokenManager not loaded, proceeding with localStorage fallback");
    return false;
  }

  scanAndLockContent() {
    const now = Date.now();
    if (this.lastTokenCheck && now - this.lastTokenCheck < 500) {
      return;
    }
    this.lastTokenCheck = now;
    
    console.log("🔍 Scanning for premium content to lock...");
    
    const isLoggedIn = this.isUserLoggedIn();
    console.log('👤 User logged in:', isLoggedIn);
    
    // If user is NOT logged in, LOCK EVERYTHING immediately
    if (!isLoggedIn) {
      console.log('🔒 User not logged in - LOCKING ALL CONTENT');
      this.forceLockAllContent();
      return;
    }
    
    // User is logged in - check specific access
    console.log('🔑 User logged in - checking premium access');
    this.checkPremiumAccess();
  }

  // NEW: Force lock everything (used when logging out)
  forceLockAllContent() {
    console.log('🔒 FORCE LOCKING ALL CONTENT');
    
    // Lock all premium content
    const premiumElems = document.querySelectorAll('[data-lock-type="premium-content"]');
    premiumElems.forEach(el => {
      console.log('🔒 Locking premium element:', el);
      this.lockElement(el);
    });
    
    // Lock all books
    const bookElems = document.querySelectorAll('[data-book-id]');
    bookElems.forEach(el => {
      console.log('🔒 Locking book element:', el);
      this.lockElement(el);
    });
  }

  checkPremiumAccess() {
    const hasPremiumAccess = this.hasAccessTo("premium");
    console.log('🔑 Premium access result:', hasPremiumAccess);
    
    // Lock/unlock premium content
    const premiumElems = document.querySelectorAll('[data-lock-type="premium-content"]');
    premiumElems.forEach(el => {
      if (hasPremiumAccess) {
        this.unlockElement(el);
      } else {
        this.lockElement(el);
      }
    });
    
    // Lock/unlock books
    const bookElems = document.querySelectorAll('[data-book-id]');
    bookElems.forEach(el => {
      const bookId = el.getAttribute('data-book-id');
      const isLocked = this.isBookLocked(bookId);
      
      if (isLocked) {
        this.lockElement(el);
      } else {
        this.unlockElement(el);
      }
    });
  }

  // SIMPLIFIED: Check if user is logged in
  isUserLoggedIn() {
    try {
      // Check multiple indicators
      const userTokens = localStorage.getItem("userTokens");
      const hasTokens = userTokens && userTokens !== "{}" && userTokens !== "null";
      
      const userData = localStorage.getItem('userData');
      const hasUserData = userData && userData !== "null";
      
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      
      // User is logged in if they have any session indicator
      const loggedIn = hasTokens || hasUserData || isAdmin;
      
      console.log('🔐 Login check:', {
        hasTokens,
        hasUserData, 
        isAdmin,
        loggedIn
      });
      
      return loggedIn;
      
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  hasAccessTo(accessRule) {
    try {
      // Check admin first
      if (this.isUserAdmin()) {
        console.log(`🔓 Admin access for ${accessRule}`);
        return true;
      }

      // Check if user is logged in
      if (!this.isUserLoggedIn()) {
        console.log(`🔒 No access for ${accessRule} - user not logged in`);
        return false;
      }

      let hasAccess = false;
      
      // Use token manager
      if (window.tokenManager && typeof window.tokenManager.hasAccessTo === "function") {
        hasAccess = window.tokenManager.hasAccessTo(accessRule);
        console.log(`🔑 TokenManager result for ${accessRule}:`, hasAccess);
      } else {
        // Fallback to localStorage
        const tokens = JSON.parse(localStorage.getItem("userTokens") || "{}");
        const token = tokens[accessRule];
        hasAccess = token && token.active && new Date(token.expiresAt) > new Date();
        console.log(`🔑 LocalStorage result for ${accessRule}:`, hasAccess);
      }

      return hasAccess;
      
    } catch (error) {
      console.error("❌ Error checking access:", error);
      return false;
    }
  }

  isBookLocked(bookId) {
    try {
      if (this.isUserAdmin()) {
        return false;
      }

      if (!this.isUserLoggedIn()) {
        return true;
      }
      
      const hasBookAccess = this.hasAccessTo(bookId);
      const hasPremiumAccess = this.hasAccessTo("premium");
      const isUnlocked = hasBookAccess || hasPremiumAccess;
      
      return !isUnlocked;
      
    } catch (error) {
      console.error("❌ Error checking book lock:", error);
      return true;
    }
  }

  isUserAdmin() {
    if (!this.isUserLoggedIn()) {
      return false;
    }
    return localStorage.getItem("isAdmin") === "true";
  }

  lockElement(element) {
    if (element.classList.contains("locked-content")) return;
    
    console.log("🔒 Locking element:", element);
    element.classList.add("locked-content");

    
    const wrapper = this.ensureWrapper(element);
if (element.tagName.toLowerCase() === "button") {
  element.parentElement.style.display = "inline-block";
}

    const overlay = document.createElement("div");
    overlay.className = "locked-overlay";
    overlay.innerHTML = `
      <div class="lock-icon">🔒</div>
      <div class="lock-text">Premium Content</div>
      <button class="unlock-btn">Buka Akses</button>
    `;
    wrapper.appendChild(overlay);

    const unlockBtn = overlay.querySelector('.unlock-btn');
    unlockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showPremiumModal();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.showPremiumModal();
      }
    });

    wrapper.style.position = wrapper.style.position || "relative";
  }

  unlockElement(element) {
    let wrapper = element;
    if (element.parentElement?.classList?.contains("locker-wrapper")) {
      wrapper = element.parentElement;
    }
    
    wrapper.querySelectorAll(".locked-overlay").forEach(o => o.remove());
    element.classList.remove("locked-content");
    console.log("🔓 Unlocked element:", element);
  }

  showPremiumModal() {
    let modal = document.querySelector("#premium-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "premium-modal";
      modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-box">
          <h2>Buku Premium</h2>
          <p>Beli versi PDF (bisa dicetak) di lynk.id untuk membuka versi digital produk.</p>
          <p>Ingin semua buku, kuis dan konten ini terbuka sekaligus? Pilih paket All Access 30 Hari.</p>
          <p>Klik Beli Sekarang untuk diarahkan ke lynk.id.</p>
          <div class="modal-actions">
            <button class="btn-cancel">Nanti Saja</button>
            <button class="btn-buy">Beli Sekarang</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector(".btn-cancel").addEventListener("click", () => {
        modal.style.display = "none";
      });
      
      modal.querySelector(".btn-buy").addEventListener("click", () => {
        window.location.href = "https://lynk.id/pintarsikecil";
      });
      
      modal.querySelector(".modal-backdrop").addEventListener("click", () => {
        modal.style.display = "none";
      });
    }
    modal.style.display = "flex";
  }

  ensureWrapper(element) {
    if (element.parentElement?.classList?.contains("locker-wrapper")) {
      return element.parentElement;
    }
    const wrapper = document.createElement("div");
    wrapper.className = "locker-wrapper";
    wrapper.style.display = getComputedStyle(element).display === "inline" ? "inline-block" : "block";
    wrapper.style.position = getComputedStyle(element).position === "static" ? "relative" : getComputedStyle(element).position;
    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
    return wrapper;
  }

  setupMutationObserver() {
    let timeout;
    this.observer = new MutationObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => this.scanAndLockContent(), 500);
    });
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  refreshLocks() {
    console.log("🔄 Manually refreshing global locks");
    this.scanAndLockContent();
  }
}

// Initialize immediately
console.log("🚀 Starting GlobalLocker...");
const globalLocker = new GlobalLocker();
window.globalLocker = globalLocker;

// Listen for global events
window.addEventListener("tokenManagerReady", () => {
  console.log("🎯 Token manager ready event received");
  setTimeout(() => globalLocker.refreshLocks(), 500);
});

window.addEventListener("access-ready", () => {
  console.log("🎯 Access ready event received");
  setTimeout(() => globalLocker.refreshLocks(), 500);
});

// Manual refresh for debugging
window.debugRefreshLocks = function() {
  console.log('🔄 Manual lock refresh triggered');
  globalLocker.refreshLocks();
};

// Force initial check after page load
window.addEventListener('load', () => {
  console.log('📄 Page loaded, checking locks...');
  setTimeout(() => globalLocker.scanAndLockContent(), 1000);
});





// Inject CSS (keep your existing CSS)
if (!document.querySelector("#global-locker-styles")) {
  const styles = document.createElement("style");
  styles.id = "global-locker-styles";
  styles.textContent = `
   .locker-wrapper {
  position: relative !important;
  display: contents; /* ✅ keeps layout exactly as before */
}

    .locked-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10; /* no need for 10000 */
  border-radius: inherit;
}

    .locked-overlay .lock-icon { font-size: 1.5em; margin-bottom: 4px; }
    .locked-overlay .lock-text { font-size: 1em; margin-top: 5px;   }
   .locked-overlay .unlock-btn {
  margin-top: 10px;
  padding: 8px 12px;
  background: #ff6b35;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  display: block;          /* ✅ button now respects container width */
  width: 100%;             /* ✅ fits the overlay width */
  max-width: 160px;        /* ✅ optional: cap width so it doesn’t stretch too far */
  margin-left: auto;       /* ✅ centers horizontally */
  margin-right: auto;

  white-space: normal;     /* ✅ allows wrapping */
  word-wrap: break-word;   /* ✅ breaks long words */
  overflow: hidden;
  text-align: center;      /* ✅ centers text lines */
  line-height: 1.3;
  box-sizing: border-box;  /* ✅ ensures padding doesn’t break width */
}


    #premium-modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 20000;
      align-items: center; justify-content: center;
      font-family: sans-serif;
    }
    #premium-modal .modal-backdrop {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 20001;
    }
    #premium-modal .modal-box {
      position: relative;
      background: #fff; color: #333;
      border-radius: 10px; padding: 20px;
      width: 90%; max-width: 400px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 20002;
    }
  #premium-modal .modal-actions button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
  margin: 0 5px;

 
}

    #premium-modal .btn-cancel { background: #f1f1f1; color: #333; }
    #premium-modal .btn-cancel:hover { background: #ddd; }
    #premium-modal .btn-buy { background: #ff6b6b; color: #fff;}
    #premium-modal .btn-buy:hover { background: #e65050; }
  `;
  document.head.appendChild(styles);
}