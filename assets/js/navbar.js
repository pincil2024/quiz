// assets/js/navbar.js
// Loads navbar.html, wires up UI and auth listeners

import { setupAuthUI, initAuthStateListener, logoutUser, activateToken } from "./auth-manager.js";
import { auth, subscribeTokens, ensureAccessReady } from "./token-manager.client.js";
import { showClaimDialog } from "./token-ui.js";
import { onAuthStateChanged } from "./firebase-init.js";

// Utility
function safeId(id) {
  return document.getElementById(id);
}

// Insert navbar and then wire up everything
async function loadNavbar() {
  const navbarEl = safeId("navbar");
  if (!navbarEl) {
    console.error("No #navbar element found - please add <div id='navbar'></div> to your page.");
    return;
  }

  try {
    const res = await fetch("navbar.html");
    const html = await res.text();
    navbarEl.innerHTML = html;
    document.dispatchEvent(new Event("navbarLoaded"));
    initNavbarFunctionality();

    try {
      setupAuthUI();
      initAuthStateListener();
    } catch (e) {
      console.error("Auth UI setup failed:", e);
    }
  } catch (err) {
    console.error("Error loading navbar:", err);
  }
}

function initNavbarFunctionality() {
  // Dropdown toggles
  const dropdowns = document.querySelectorAll(".dropdown");
  const closeAll = () => {
    dropdowns.forEach(d => {
      const m = d.querySelector(".dropdown-menu");
      if (m) {
        m.classList.remove("show");
        m.style.display = "none";
      }
    });
  };

  dropdowns.forEach(d => {
    const toggle = d.querySelector(".dropdown-toggle");
    const menu = d.querySelector(".dropdown-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const showing = menu.classList.contains("show");
      closeAll();
      if (!showing) {
        menu.classList.add("show");
        menu.style.display = "block";
      }
    });

    d.addEventListener("mouseenter", () => (d.style.backgroundColor = "#f0f0f0"));
    d.addEventListener("mouseleave", () => (d.style.backgroundColor = ""));
  });

  document.addEventListener("click", (ev) => {
    if (!ev.target.closest(".dropdown")) closeAll();
  });

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") closeAll();
  });

  // Mobile toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("show"));
  }

  // Active link highlight
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href")?.split("/").pop();
    if (href === current) {
      a.classList.add("active");
      a.style.color = "#007bff";
      a.setAttribute("aria-current", "page");
    } else {
      a.classList.remove("active");
      a.style.color = "";
      a.removeAttribute("aria-current");
    }
  });

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });
  }
}

// Run on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
});

// Export for manual call if needed
export { loadNavbar };

// ----------------------------
// Reactive Access Management
// ----------------------------
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.log("👋 User logged out — locking premium");
    document.body.classList.remove("premium-active");
    return;
  }

  console.log("👤 User logged in:", user.email);
  await ensureAccessReady();
  await new Promise(r => setTimeout(r, 200)); // small safety delay

  const updateAccessUI = () => {
    if (window.tokenManager?.hasAccessTo("premium")) {
      console.log("✅ Premium unlocked (reactive)");
      document.body.classList.add("premium-active");
    } else {
      console.log("🔒 Premium locked (reactive)");
      document.body.classList.remove("premium-active");
    }
  };

  // Initial check + reactive updates
  updateAccessUI();
  window.tokenManager?.subscribe?.(() => updateAccessUI());
});

// ----------------------------
// Token Banner + Claim UI
// ----------------------------
function initTokenUI() {
  const myTokensBtn = document.getElementById("myTokensBtn");
  const tokenBanner = document.getElementById("tokenBanner");
  const openBtn = document.getElementById("openClaimDialogBtn");
  const closeBtn = document.getElementById("closeBannerBtn");

  if (!myTokensBtn || !tokenBanner) return;

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      tokenBanner.style.display = "none";
      return;
    }

    subscribeTokens(user.email, (tokens, tokensAvailable) => {
      const hasUnclaimed = Object.keys(tokensAvailable).length > 0;
      tokenBanner.style.display = hasUnclaimed ? "block" : "none";

      const allTokens = { ...tokens, ...tokensAvailable };
      myTokensBtn.onclick = () =>
        showClaimDialog(user.email, allTokens, "claim", activateToken);
      openBtn.onclick = () =>
        showClaimDialog(user.email, allTokens, "claim", activateToken);
      closeBtn.onclick = () => (tokenBanner.style.display = "none");
    });
  });
}

// Call after navbar loads
document.addEventListener("navbarLoaded", () => {
  initTokenUI();
});
