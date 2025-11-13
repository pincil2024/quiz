// token-ui.js - FINAL FIXED VERSION
export function showClaimDialog(userEmail, tokens = {}, mode = "claim", activateTokenFn) {
  // Remove any existing overlay + dialog
  document.body.querySelectorAll(".claim-dialog-overlay").forEach(d => d.remove());

  // Overlay
  const overlay = document.createElement("div");
  overlay.id = "claim-dialog-overlay";
  overlay.classList.add("claim-dialog-overlay");

  // Dialog
  const dialog = document.createElement("div");
  dialog.classList.add("claim-dialog");

  let html = `<h2>Available Tokens</h2><ul>`;
  Object.entries(tokens).forEach(([contentId, token]) => {
    const status = token.active ? "✅ Active" : "⏳ Inactive";

    let extraInfo = "";
    if (token.active && token.expiresAt) {
      extraInfo = `<div id="countdown-${contentId}" class="countdown-text"></div>`;
    }

    html += `<li>
      <strong>${contentId}</strong> - ${status}
      ${token.active ? extraInfo : `<button data-id="${contentId}">Claim</button>`}
    </li>`;
  });

  html += "</ul>";
  html += `<button id="closeDialogBtn">Close</button>`;
  dialog.innerHTML = html;

  // Wire claim buttons
  dialog.querySelectorAll("button[data-id]").forEach(btn => {
    btn.onclick = async () => {
      const contentId = btn.getAttribute("data-id");
      const token = tokens[contentId];

      if (activateTokenFn) {
        const updatedTokens = await activateTokenFn(userEmail, contentId, token);
        showClaimDialog(userEmail, updatedTokens, "claim", activateTokenFn);
      }

      overlay.remove();
    };
  });

  // Attach countdown for each active token
  Object.entries(tokens).forEach(([contentId, token]) => {
    if (token.active && token.expiresAt) {
      const countdownEl = dialog.querySelector(`#countdown-${contentId}`);
      if (countdownEl) {
        renderCountdown(token, countdownEl, contentId);
      }
    }
  });

  // Close button
  dialog.querySelector("#closeDialogBtn").onclick = () => overlay.remove();

  // Append dialog to overlay, then to body
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
}

function renderCountdown(token, countdownEl, contentId) {
  if (!token?.active || !token?.expiresAt) return;

  let interval;

  function updateCountdown() {
    const daysRemaining = calculateExactDaysRemaining(token.expiresAt, contentId);

    if (daysRemaining <= 0) {
      countdownEl.textContent = "⏰ Akses sudah kedaluwarsa.";
      clearInterval(interval);
      return;
    }
    
    countdownEl.textContent = `Sisa waktu: ${daysRemaining} hari`;
  }

  updateCountdown();
  interval = setInterval(updateCountdown, 60 * 60 * 1000);
}

// FIXED: Correct days calculation that accounts for inclusive counting
function calculateExactDaysRemaining(expiryDateString, contentId = '') {
  const now = new Date();
  const expiry = new Date(expiryDateString);
  
  // FIX: Calculate the difference in milliseconds and convert to days
  const diffMs = expiry - now;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // Use Math.ceil instead of Math.floor
  
  // Debug logging for premium token
  if (contentId === 'premium') {
    console.log('🔍 PREMIUM COUNTDOWN DEBUG:', {
      contentId: contentId,
      now: now.toString(),
      expiry: expiry.toString(),
      diffMs: diffMs,
      days: days,
      calculation: `From ${now.toISOString()} to ${expiry.toISOString()} = ${days} days`
    });
  }
  
  return Math.max(0, days);
}