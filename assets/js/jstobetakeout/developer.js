document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);

  // Enable developer mode by query string or stored flag
  if (params.get("dev") === "true") {
    localStorage.setItem("pincilDevMode", "true");
  }

  const isDev = localStorage.getItem("pincilDevMode") === "true";

  if (isDev) {
    const devBtn = document.getElementById("resetDeviceBtn");
    if (devBtn) {
      devBtn.style.display = "inline-block";
      devBtn.addEventListener("click", () => {
        if (confirm("Reset device lock?")) {
          localStorage.removeItem("deviceRegistered");
          localStorage.removeItem("globalRegistered");
          localStorage.removeItem("pincilDeviceId");
          alert("✅ Device lock reset. Reloading...");
          location.reload();
        }
      });
    }
  }
});
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "d") {
    e.preventDefault();

    const current = localStorage.getItem("pincilDevMode") === "true";
    localStorage.setItem("pincilDevMode", String(!current));
    alert(`🔧 Developer Mode is now ${!current ? 'ON' : 'OFF'}. Reloading...`);
    location.reload();
  }
});
