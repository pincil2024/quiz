// fullscreen-module.js - Reusable Fullscreen Component
class FullscreenManager {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.isFullscreen = false;
        this.options = {
            enableSound: true,
            autoHideControls: true,
            mobileOrientation: false, // Changed default to false
            ...options
        };
        
        this.init();
    }

    init() {
        this.createFullscreenButton();
        this.setupEventListeners();
        this.updateFullscreenButton();
    }

    createFullscreenButton() {
        // Remove existing button if any
        const existingBtn = document.getElementById('fullscreenToggle');
        if (existingBtn) {
            existingBtn.remove();
        }

        const fullscreenControls = document.createElement('div');
        fullscreenControls.className = 'fullscreen-controls';
        fullscreenControls.innerHTML = `
            <button id="fullscreenToggle" class="fullscreen-btn">
                <span class="fullscreen-icon">⛶</span>
                <span class="fullscreen-text">Layar Penuh</span>
            </button>
        `;

        // Insert at the top of the container
        const container = document.getElementById(this.containerId);
        if (container) {
            container.insertBefore(fullscreenControls, container.firstChild);
        } else {
            document.body.insertBefore(fullscreenControls, document.body.firstChild);
        }

        // Add click event
        document.getElementById('fullscreenToggle').addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    toggleFullscreen() {
        const container = document.getElementById(this.containerId);
        
        if (!this.isFullscreen) {
            this.enterFullscreen(container);
        } else {
            this.exitFullscreen();
        }
    }

    enterFullscreen(element) {
        try {
            // Set dynamic background
            this.setFullscreenBackground(element);
            
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
            
            if (this.options.enableSound) {
                this.playSound('enter');
            }
        } catch (error) {
            console.error('Error entering fullscreen:', error);
            this.showMessage('Layar penuh tidak didukung di browser ini');
        }
    }

    setFullscreenBackground(element) {
        const backgrounds = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        ];
        
        const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        element.style.background = randomBackground;
        element.style.width = '100vw';
        element.style.height = '100vh';
        element.style.margin = '0';
        element.style.padding = '20px';
        element.style.boxSizing = 'border-box';
    }

    exitFullscreen() {
        try {
            // Remove fullscreen styling
            const element = document.getElementById(this.containerId);
            if (element) {
                element.style.background = '';
                element.style.width = '';
                element.style.height = '';
                element.style.margin = '';
                element.style.padding = '';
            }
            
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } catch (error) {
            console.error('Error exiting fullscreen:', error);
        }
    }

    setupEventListeners() {
        // Fullscreen change events
        document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('MSFullscreenChange', this.handleFullscreenChange.bind(this));

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeydown.bind(this));

        // Mobile touch events
        const fullscreenBtn = document.getElementById('fullscreenToggle');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.toggleFullscreen();
            });
        }

        // Orientation change event for better mobile support
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    }

    handleFullscreenChange() {
        this.isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        
        this.updateFullscreenButton();
        
        // Remove the orientation locking completely
        // Let users choose their preferred orientation
        
        if (this.isFullscreen) {
            this.showMessage('Layar penuh aktif! Putar perangkat untuk orientasi portrait atau landscape.');
        }
    }

    handleOrientationChange() {
        // Optional: Add responsive behavior based on orientation
        if (this.isFullscreen) {
            const orientation = screen.orientation ? screen.orientation.type : 'portrait-primary';
            
            if (orientation.includes('landscape')) {
                console.log('Landscape mode in fullscreen');
            } else {
                console.log('Portrait mode in fullscreen');
            }
        }
    }

    handleKeydown(event) {
        if (event.key === 'F11') {
            event.preventDefault();
            this.toggleFullscreen();
        }
        
        if (event.key === 'Escape' && this.isFullscreen) {
            this.exitFullscreen();
        }
    }

    updateFullscreenButton() {
        const fullscreenBtn = document.getElementById('fullscreenToggle');
        if (!fullscreenBtn) return;

        const icon = fullscreenBtn.querySelector('.fullscreen-icon');
        const text = fullscreenBtn.querySelector('.fullscreen-text');
        
        if (this.isFullscreen) {
            icon.textContent = '⛶';
            text.textContent = 'Keluar Layar Penuh';
            fullscreenBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e53)';
        } else {
            icon.textContent = '⛶';
            text.textContent = 'Layar Penuh';
            fullscreenBtn.style.background = 'linear-gradient(135deg, #4ecdc4, #2a9d8f)';
        }
    }

    // Removed the setupMobileOrientation method entirely
    // No more forced landscape locking

    playSound(type) {
        // You can customize sounds here
        const audio = new Audio();
        audio.src = type === 'enter' ? 'assets/sounds/robot_01.mp3' : 'assets/sounds/robot_01.mp3';
        audio.play().catch(() => {
            // Sound play failed, ignore
        });
    }

    showMessage(msg) {
        // Create a simple toast message
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            text-align: center;
            max-width: 80%;
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }

    // Public methods
    enable() {
        const btn = document.getElementById('fullscreenToggle');
        if (btn) btn.style.display = 'block';
    }

    disable() {
        const btn = document.getElementById('fullscreenToggle');
        if (btn) btn.style.display = 'none';
    }

    destroy() {
        // Clean up event listeners
        document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
        document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange);
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('orientationchange', this.handleOrientationChange);
        
        // Remove button
        const btn = document.getElementById('fullscreenToggle');
        if (btn) btn.remove();
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FullscreenManager;
} else {
    window.FullscreenManager = FullscreenManager;
}