// fullscreen-toggle.js
function initBookFullscreen() {
  // Only initialize if we're on the book viewer page
  const container = document.getElementById('myCanvas1');
  if (!container) return;

  const pointer = document.getElementById('pointer-hand');
  const fullscreenToggle = document.getElementById('fullscreenToggle1');

  function handleFullscreenChange() {
    const isFullscreen = document.fullscreenElement === container;
    if (pointer) {
      pointer.textContent = isFullscreen ? '' : '👈';
    }
    if (fullscreenToggle) {
      fullscreenToggle.checked = isFullscreen;
    }
  }

  function toggleBookFullscreen() {
    const isFullscreen = document.fullscreenElement === container;

    if (!isFullscreen) {
      container.requestFullscreen?.().catch(err => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen?.();
    }
  }

  // Set up event listeners
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  fullscreenToggle?.addEventListener('click', toggleBookFullscreen);

  // Make the function available for onclick if needed
  window.initBookFullscreen = toggleBookFullscreen;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initBookFullscreen);