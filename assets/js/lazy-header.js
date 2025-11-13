// lazy-header.js
document.addEventListener("DOMContentLoaded", function () {
    // Mapping header IDs to background image URLs
    const headerImages = {
        header1: "/assets/img/banner1.png",
        header2: "/assets/img/tkbg.jpg",
        header3: "/assets/img/smabg.jpg",
        header4: "/assets/img/edubg1.png",
        header5: "/assets/img/sdbg.jpg",
    };

    const lazyHeaders = document.querySelectorAll(".lazyHeader");

    const lazyLoad = (header, imageUrl) => {
        if (imageUrl) {
            header.style.backgroundImage = `url(${imageUrl})`;
            header.style.backgroundSize = "cover"; // Ensure the image covers the container
            header.style.backgroundPosition = "center";
            header.style.backgroundRepeat = "no-repeat";
        }
    };

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const headerId = entry.target.id;
                    const imageUrl = headerImages[headerId];
                    lazyLoad(entry.target, imageUrl);
                    observer.unobserve(entry.target); // Stop observing once loaded
                }
            });
        },
        { rootMargin: "0px 0px 200px 0px" } // Adjust as needed
    );

    lazyHeaders.forEach((header) => observer.observe(header));
});


