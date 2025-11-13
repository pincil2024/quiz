// content-ids.js
// Content ID mapping for your platform
const contentIds = {
  // Books
  'book-akubisamembaca': 'Aku Bisa Membaca',
  'book-belajarmembacadasar': 'Belajar Membaca Dasar',
  'book-anakpintar': 'Anak Pintar',
  'book-anakshaleh': 'Anak Shaleh',
  'book-forest-teamwork': 'The Forest Teamwork Day',
  'book-mimpiku-sekolah': 'Mimpiku, Sekolah untuk Semua',
  'book-gadis-kecil': 'Gadis Kecil dan Jendela ke Dunia',
  
  // Quizzes
  'quiz-english-level-1': 'English Level 1 Quiz',
  'quiz-english-level-2': 'English Level 2 Quiz',
  'quiz-bahasa-level-1': 'Bahasa Indonesia Level 1 Quiz',
  'quiz-bahasa-level-2': 'Bahasa Indonesia Level 2 Quiz',
  
  // Games
  'game-suku-kata': 'Game Suku Kata',
  'game-matching': 'Game Matching',
  'game-bubble': 'Game Bubble',
  'game-fill-blanks': 'Game Fill in Blanks'
};

// Product categories for token mapping
const productCategories = {
  'premium-books': 'Buku Premium',
  'premium-quizzes': 'Kuis Premium', 
  'premium-games': 'Game Premium',
  'premium-math': 'Matematika Premium',
  'premium-reading': 'Membaca Premium'
};

// Token prefix mapping
const tokenPrefixMap = {
  'book-': 'premium-books',
  'quiz-': 'premium-quizzes',
  'game-': 'premium-games',
  'math-': 'premium-math',
  'read-': 'premium-reading'
};

// Make available globally
window.contentIds = contentIds;
window.productCategories = productCategories;
window.tokenPrefixMap = tokenPrefixMap;