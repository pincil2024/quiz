// booklist.js - UPDATED VERSION
const bookList = [
 
  { 
    title: "Aku Bisa Membaca", 
    file: "bank/akubisamembaca.json",
    icon: "fa-book-open",
    image: "assets/image-mainsukukata/BukuBelajarMembaca.png", // Add image path
    hasSpine: true,
    fullImage: false,
    contentId: "book-akubisamembaca",
    aliases: ["akubisamembaca"]
  },
  { 
    title: "Belajar Membaca Dasar", 
    file: "bank/belajarmembacaDasar.json",
    icon: "fa-spell-check",
    image: "assets/image-mainsukukata/bukumembacauntukpemula.png", // Add image path
    hasSpine: true,
    fullImage: false,
    public: true,
    premium: false,
    contentId: "book-belajarmembacadasar",
    aliases: ["belajarmembacad", "bmmd"]
  },
  { 
    title: "Anak Pintar", 
    file: "bank/anakpintar.json",
    icon: "fa-graduation-cap",
    image: "assets/image-mainsukukata/anakpintar.png", // Add image path
    hasSpine: true,
    fullImage: false,
    public: true,
    premium: false,
    contentId: "book-anakpintar",
    aliases: ["anakpintar"]
  },
  { 
    title: "Anak Shaleh", 
    file: "bank/anakshaleh.json",
    icon: "fa-mosque",
    image: "assets/image-mainsukukata/anakshaleh.png", // Add image path
    hasSpine: true,
    fullImage: false,
    public: true,
    premium: false,
    contentId: "book-anakshaleh",
    aliases: ["anaksholeh"]
  },
  { 
    title: "The Forest Teamwork Day", 
    file: "bank/animalworktogether.json",
    icon: "fa-paw",
    image: "assets/img/animalTeam/animalteamwork1.png", // Add image path
    hasSpine: true,
    fullImage: true,
    public: true,
    locked: true,
    contentId: "book-forest-teamwork",
    purchaseLink: "http://lynk.id/pintarsikecil/w1p3x5pje559",
    premium: true,
    aliases: ["animalworktogether", "forest", "teamwork"]
  },
  { 
    title: "Mimpiku, Sekolah untuk Semua", 
    file: "bank/soewardi.json",
    icon: "fa-school",
    image: "/assets/img/soewardi/soewardi1.png", // Add image path
    hasSpine: false,
    fullImage: true,
    public: true,
    locked: true,
    contentId: "book-mimpiku-sekolah",
    purchaseLink: "http://lynk.id/pintarsikecil/9j3mz66pegx3",
    premium: true,
    aliases: ["soewardi", "mimpiku"]
  },
  { 
    title: "Gadis Kecil dan Jendela ke Dunia", 
    file: "bank/gadisKecil.json",
    icon: "fa-solid fa-seedling",
    image: "/assets/img/kartini/kartini_1.png", // Add image path
    hasSpine: false,
    fullImage: true,
    public: false,
    locked: true,
    contentId: "book-gadis-kecil",
    purchaseLink: "http://lynk.id/pintarsikecil/nmjn9gdd4941",
    premium: true,
    aliases: ["kartini", "gadis"]
  }
];

// Function to normalize keys for matching
function normalizeKey(text) {
  return text.toLowerCase().replace(/[^\w]+/g, '');
}

// Function to find book by alias
function findBookByAlias(name) {
  const norm = normalizeKey(name);
  return bookList.find(book =>
    normalizeKey(book.title) === norm ||
    (book.aliases || []).some(alias => normalizeKey(alias) === norm)
  );
}

// Function to get content ID for a book
function getBookContentId(bookTitleOrAlias) {
  const book = findBookByAlias(bookTitleOrAlias);
  return book ? book.contentId || null : null;
}

// Function to check if a book is locked (simple version - for external use)
function isBookLockedSimple(bookTitleOrAlias) {
  const book = findBookByAlias(bookTitleOrAlias);
  if (!book) return true;
  
  // If user is admin, never lock anything
  if (localStorage.getItem('isAdmin') === 'true') {
    console.log("🔓 Admin override - book unlocked:", book.title);
    return false;
  }
  
  // Use token manager to check access
  if (window.tokenManager && window.tokenManager.hasAccessTo) {
    return !window.tokenManager.hasAccessTo(book.contentId);
  }
  
  return book.locked || false;
}

// Function to get purchase link for a book
function getBookPurchaseLink(bookTitleOrAlias) {
  const book = findBookByAlias(bookTitleOrAlias);
  return book ? book.purchaseLink || null : null;
}

// Make functions available globally
window.bookList = bookList;
window.getBookContentId = getBookContentId;
window.isBookLockedSimple = isBookLockedSimple; // Renamed to avoid conflict
window.getBookPurchaseLink = getBookPurchaseLink;