// checkAccess.js
document.addEventListener("DOMContentLoaded", () => {
  // Show loading message
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loadingMessage";
  loadingDiv.textContent = "🔐 Memeriksa akses Anda...";
  loadingDiv.style.cssText = `
    position:fixed;
    top:10px;
    left:50%;
    transform:translateX(-50%);
    background:#ffc107;
    padding:10px 20px;
    border-radius:8px;
    z-index:9999;
    font-weight:bold;
  `;
  document.body.appendChild(loadingDiv);

  // Wait for auth-ready event from auth-manager
  window.addEventListener("authReady", (e) => {
    const user = e.detail.user;
    const data = e.detail.userData;

    window.userHasDownloadAccess = false; // default

    if (!user || !data) {
      console.warn("🔒 User not logged in or user data missing.");
      hideLoading();
      return;
    }

    let accessUntil;
try {
  accessUntil = data.downloadAccessUntil?.toDate?.();
} catch (e) {
  console.warn("⛔ Gagal mengambil tanggal akses:", e);
}

if (accessUntil && accessUntil > new Date()) {
  window.userHasDownloadAccess = true;
  console.log("✅ Download access valid:", data.nickname || user.email);
} else {
  console.warn("⏳ Download access expired or missing.");
}

    const display = document.getElementById("displayUsername");
    if (display) display.textContent = data.nickname || user.email;

    hideLoading();
  });

  function hideLoading() {
    const msg = document.getElementById("loadingMessage");
    if (msg) msg.style.display = "none";
  }
});