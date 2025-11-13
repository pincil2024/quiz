document.addEventListener("DOMContentLoaded", () => {
  // Enable dropdown functionality
  document.querySelectorAll('.dropdown-header').forEach(header => {
      header.addEventListener('click', () => {
          const parentPost = header.parentElement;
          parentPost.classList.toggle('open'); // Toggle the 'open' class
      });
  });


  });

 

