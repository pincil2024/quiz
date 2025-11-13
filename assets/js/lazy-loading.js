document.addEventListener("DOMContentLoaded", initializeLazyLoading);

function initializeLazyLoading() {
    const lazyElements = document.querySelectorAll('.lazy'); // Select all lazy elements

    const lazyLoad = (entry) => {
        const target = entry.target;
        console.log('Lazy loading element:', target);
        
        // Handle different types of lazy elements
        if (target.dataset.src) {
            // Case 1: Elements with data-src (lazy loading)
            if (target.tagName === 'IMG') {
                // Create a new image to preload
                const img = new Image();
                img.src = target.dataset.src;
                img.onload = () => {
                    target.src = target.dataset.src;
                    target.classList.add('loaded');
                    console.log('✅ Lazy image loaded:', target.dataset.src);
                };
                img.onerror = () => {
                    console.warn('❌ Failed to load lazy image:', target.dataset.src);
                };
            } else if (target.tagName === 'IFRAME') {
                target.src = target.dataset.src;
                target.classList.add('loaded');
            }
        } else if (target.dataset.bg) {
            // Case 2: Elements with data-bg for background images
            const img = new Image();
            img.src = target.dataset.bg;
            img.onload = () => {
                target.style.backgroundImage = `url(${target.dataset.bg})`;
                target.classList.add('loaded');
                console.log('✅ Lazy background image loaded:', target.dataset.bg);
            };
            img.onerror = () => {
                console.warn('❌ Failed to load background image:', target.dataset.bg);
            };
        } else if (target.tagName === 'IMG' && target.src) {
            // Case 3: Regular images with src that just need intersection observation
            // This handles your quiz images and other images with regular src attributes
            const img = new Image();
            img.src = target.src;
            img.onload = () => {
                target.classList.add('loaded');
                console.log('✅ Regular image loaded:', target.src);
            };
            img.onerror = () => {
                console.warn('❌ Failed to load regular image:', target.src);
                // Optional: hide broken images or show fallback
                // target.style.display = 'none';
            };
        } else if (target.tagName === 'BUTTON' && target.style.backgroundImage) {
            // Case 4: Buttons with inline background images
            const bgImage = target.style.backgroundImage;
            const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
            
            if (urlMatch && urlMatch[1]) {
                const imageUrl = urlMatch[1];
                const img = new Image();
                img.src = imageUrl;
                img.onload = () => {
                    target.classList.add('loaded');
                    console.log('✅ Button background image loaded:', imageUrl);
                };
                img.onerror = () => {
                    console.warn('❌ Failed to load button background image:', imageUrl);
                };
            }
        }
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                lazyLoad(entry);
                obs.unobserve(entry.target); // Stop observing once loaded
            }
        });
    }, {
        rootMargin: '100px', // Start loading 100px before element enters viewport
        threshold: 0.1
    });

    lazyElements.forEach(el => {
        console.log('Observing lazy element:', el);
        observer.observe(el);
    });

    // ✅ YouTube lazy loading using thumbnail
    document.querySelectorAll('.yt-lazy').forEach(container => {
        container.addEventListener('click', () => {
            const id = container.dataset.id;
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
            iframe.allow = "autoplay; encrypted-media";
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            iframe.width = container.dataset.width || "100%";
            iframe.height = container.dataset.height || "100%";
            container.innerHTML = "";
            container.appendChild(iframe);
        });
    });
}

// Function to create book elements with lazy-loaded images
function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.className = 'book-item';
    bookElement.innerHTML = `
        <div class="book-cover">
            <img 
                class="lazy" 
                data-src="${book.image}" 
                alt="${book.title}"
                width="200" 
                height="300"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3ELoading...%3C/text%3E%3C/svg%3E"
            >
            ${book.premium ? '<span class="premium-badge">Premium</span>' : ''}
        </div>
        <h3>${book.title}</h3>
        <div class="book-meta">
            <i class="${book.icon}"></i>
            ${book.locked ? '<span class="locked-indicator"><i class="fa fa-lock"></i></span>' : ''}
        </div>
    `;
    return bookElement;
}

// Example usage to render books
function renderBooks(books, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    books.forEach(book => {
        const bookElement = createBookElement(book);
        container.appendChild(bookElement);
    });
    
    // Re-initialize lazy loading for newly added elements
    setTimeout(() => {
        initializeLazyLoading();
    }, 100);
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize lazy loading
    initializeLazyLoading();
    
    // Add footer
    if (document.querySelector("footer")) {
        document.querySelector("footer").innerHTML = `
            <span> [ &copy; 2024 Pincil - All Rights Reserved]</span>
            <span>    <a href="privacy-policy.html"> [Privacy Policy]</a></span>
            <span>[Contact us at: <a href="mailto:pincil.pintarsikecil@gmail.com">pincil.pintarsikecil@gmail.com</a>]</span>
        `;
    }
});