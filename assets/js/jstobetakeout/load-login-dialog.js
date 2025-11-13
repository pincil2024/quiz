// assets/js/load-login-dialog.js
(function() {
    // Check if dialog already exists
    if (document.getElementById('loginDialog1')) return;
    
    // Create dialog HTML
    const dialogHTML = `
    <div id="loginDialog1" style="
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        color: black;
        padding: 20px 24px;
        border-radius: 12px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
        z-index: 9999;
        max-width: 90%;
        width: 400px;
        font-family: Arial, sans-serif;
        animation: fadeIn 0.3s ease-in-out;
    ">
        <p style="margin-bottom: 1em; font-size: 15px;">
            Akses hanya tersedia sebagai bonus untuk pengguna yang telah membeli produk digital di
            <a href="https://lynk.id/pintarsikecil" target="_blank" style="color: #007bff; text-decoration: underline;">
            lynk.id/pintarsikecil
            </a>.
            Terima kasih!
        </p>
        <div style="text-align: right;">
            <button id="closeLoginDialogBtn" style="
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            ">Tutup</button>
        </div>
    </div>
    <div id="loginDialogOverlay" style="
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9998;
    "></div>`;
    
    document.body.insertAdjacentHTML('beforeend', dialogHTML);

    // Initialize dialog functions
    window.showLoginDialog = function() {
        const dialog = document.getElementById('loginDialog1');
        const overlay = document.getElementById('loginDialogOverlay');
        if (dialog && overlay) {
            dialog.style.display = 'block';
            overlay.style.display = 'block';
        }
    };

    window.closeDialog = function() {
        const dialog = document.getElementById('loginDialog1');
        const overlay = document.getElementById('loginDialogOverlay');
        if (dialog && overlay) {
            dialog.style.display = 'none';
            overlay.style.display = 'none';
        }
    };

    // Setup close button
    const closeBtn = document.getElementById('closeLoginDialogBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDialog);
    }
    
    // Close when clicking overlay
    const overlay = document.getElementById('loginDialogOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeDialog);
    }
    
    console.log("Login dialog initialized");
})();