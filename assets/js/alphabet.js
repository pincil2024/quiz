
// 🔓 create once, at the very top
let unlockedAudio = (src) => new Audio(src);

// unlock on first touch
document.addEventListener('pointerdown', () => {
  document.querySelectorAll('audio').forEach(a =>
    a.play().then(() => a.pause()).catch(() => {})
  );
  // preload helper
  unlockedAudio = (src) => {
    const audio = new Audio(src);
    audio.load();
    return audio;
  };
}, { once: true });


// Background music setup - moved to global scope
let bgMusic;
// Add this with your other global variables
let selectedSubject = 'default'; // or whatever default subject you want

document.addEventListener("DOMContentLoaded", () => {
    console.log('Script loaded and DOM fully parsed');
    
   
    
   const overlay = document.getElementById('overlay');
    const dialog = document.getElementById('dialog');
    const dialogContent = document.getElementById('dialogContent');
    const closeDialog = document.getElementById('closeDialog');
    const closeDialogSukukata = document.getElementById('closeDialog-sukukata');

  const backButtons = document.querySelectorAll('.back-to-menu-container');
    backButtons.forEach(button => {
        
        button.addEventListener('click', handleGameBack);
    });
   
  // Initialize audio
    const bgMusic = new Audio('https://pincil.id/assets/audio/kids-music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    bgMusic.autoplay = false;

    // Set defaults on page load
    if (localStorage.getItem("effectsEnabled") === null) {
        localStorage.setItem("effectsEnabled", "true");
    }
    if (localStorage.getItem("bgMusicEnabled") === null) {
        localStorage.setItem("bgMusicEnabled", "false"); // Default to OFF
    }

    // Apply stored preferences
    document.getElementById('effectsToggle').checked = localStorage.getItem("effectsEnabled") === "true";
    document.getElementById('bgMusicToggle').checked = localStorage.getItem("bgMusicEnabled") === "true";

    // Track current section
    let currentSection = '';

    // Modified music toggle handler
    document.getElementById('bgMusicToggle').addEventListener('change', function() {
        const shouldPlay = this.checked;
        localStorage.setItem("bgMusicEnabled", shouldPlay.toString());
        
        // Only play/pause if we're in the game section
        if (currentSection === 'sectionGames') {
            if (shouldPlay) {
                bgMusic.play().catch(e => console.log("Playback failed:", e));
            } else {
                bgMusic.pause();
                bgMusic.currentTime = 0;
            }
        }
    });


// Toggle sound effects
document.getElementById('effectsToggle').addEventListener('change', function () {
    localStorage.setItem("effectsEnabled", this.checked);
});

// Toggle background music
document.getElementById('bgMusicToggle').addEventListener('change', function () {
    localStorage.setItem("bgMusicEnabled", this.checked);
    this.checked ? bgMusic.play() : bgMusic.pause();
});

document.addEventListener("fullscreenchange", () => {
  if (mirrorEl && document.fullscreenElement) {
    document.fullscreenElement.appendChild(mirrorEl);
  }
});
 

 // Event delegation for syllable and word clicks
 document.addEventListener('click', function (event) {
    const target = event.target;

    // Check if the clicked element has a data-syllable attribute
    if (target.classList.contains('clickable') && target.hasAttribute('data-syllable')) {
        const syllable = target.getAttribute('data-syllable');
        playSyllableSound(syllable);
    }

    // Check if the clicked element has a data-word attribute
    if (target.classList.contains('clickable') && target.hasAttribute('data-word')) {
        const word = target.getAttribute('data-word');
        playWordSound(word);
    }
});
  
    // Main menu buttons
  
  
  
    document.getElementById('showAbcSong').addEventListener('click', () => showSection('abcSong'));
    document.getElementById('showAlphabet').addEventListener('click', () => showSection('alphabet'));
    document.getElementById('showVokal').addEventListener('click', () => showSection('vokal'));
    document.getElementById('showSukukata').addEventListener('click', () => showSection('sukukata'));
    document.getElementById('showGames').addEventListener('click', () => showSection('sectionGames'));

    

     // Alphabet section buttons
     document.getElementById('showAlphabetCarouselBtn').addEventListener('click', showAlphabetCarousel);
     document.getElementById('showAlphabetGridBtn').addEventListener('click', showAlphabetGrid);
     document.getElementById('prevAlphabetBtn').addEventListener('click', prevAlphabet);
     document.getElementById('nextAlphabetBtn').addEventListener('click', nextAlphabet);
    
     // Vokal section buttons
     document.getElementById('showVokalCarouselBtn').addEventListener('click', showVokalCarousel);
     document.getElementById('showVokalGridBtn').addEventListener('click', showVokalGrid);
     document.getElementById('prevVokalBtn').addEventListener('click', prevVokal);
     document.getElementById('nextVokalBtn').addEventListener('click', nextVokal);
 
     // Sukukata section buttons
     document.getElementById('showSukukataCarouselBtn').addEventListener('click', showSukukataCarousel);
     document.getElementById('showSukukataGridBtn').addEventListener('click', showSukukataGrid);
     document.getElementById('showSukukataEquationBtn').addEventListener('click', showSukukataEquation);
     document.getElementById('prevSyllableBtn').addEventListener('click', prevSyllable);
     document.getElementById('nextSyllableBtn').addEventListener('click', nextSyllable);
     document.getElementById('showMatchingGame').addEventListener('click', showMatchingGame);
     document.getElementById('showSukukataGame').addEventListener('click', showSukukataGame);
      document.getElementById('showFillBlanksGame').addEventListener('click', showFillBlanksGame);

     document.getElementById('popup-button').addEventListener('click', restartGame);
     document.getElementById('gobackSukukata').addEventListener('click', goBackToSukukataMain);


   
        document.getElementById("level1-btn").addEventListener("click", () => selectLevel(1));
        document.getElementById("level2-btn").addEventListener("click", () => selectLevel(2));
        document.getElementById("backToMenu").addEventListener('click', backToMenu);
     // Sound elements
        const errorSound = unlockedAudio("assets/sounds/Ooh.mp3");
const successSound = unlockedAudio("assets/sounds/pincil.mp3");
const correctSound = unlockedAudio("assets/sounds/yay-success.mp3");
  

        // DOM elements
        const progressTracker = document.getElementById("progress-tracker");
        const balloonContainer = document.getElementById("balloon-container");
        const popupModal = document.getElementById("popup-modal");
        const popupContent = document.getElementById("popup-content");
       


        // Bubble game button
    const showBubbleGameBtn = document.getElementById("showBubbleGame");
    if (showBubbleGameBtn) {
        showBubbleGameBtn.addEventListener("click", showBubbleGame);
    }
    
   

  
    
    // Fullscreen functionality for bubble game
    document.querySelectorAll('[data-fullscreen="bubbleGameContainer"]').forEach(btn => {
        btn.addEventListener('click', () => toggleFullscreen(document.getElementById("bubbleGameContainer")));
    });
      
     // Fullscreen functionality for main-container
    document.querySelectorAll('[data-fullscreen="main-container"]').forEach(btn => {
        btn.addEventListener('click', () => toggleFullscreen(document.getElementById("main-container")));
    });
     
        
     // Sukukata syllable items
     const syllableItems = document.querySelectorAll('#sukukata-Syllables .grid-item');
     syllableItems.forEach(item => {
         item.addEventListener('click', () => {
             const syllable = item.getAttribute('data-syllable');
             showSukukataOptions(syllable);
         });
     });
    
     
     let isAlphabetGridLoaded = false;
    let isVokalGridLoaded = false;
    let currentAlphabetIndex = 0;
    let currentLevel = 1;
    let currentQuestionIndex = 0;
    let selectedQuestions = [];
    let syllableBank = [];
    let dropBoxes = [];
    let placedSyllables = [];



    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const vokals = ['A', 'I', 'U', 'E', 'O'];

    const sukukataTambahan = {
"Ba": [
    { firstSyllables: "ba", secondSyllables: "ba", answer: "baba" },
    { firstSyllables: "i", secondSyllables: "bu", answer: "ibu" },
    { firstSyllables: "o", secondSyllables: "bo", answer: "obo" },
    { firstSyllables: "bu", secondSyllables: "bu", answer: "bubu" },
    { firstSyllables: "bo", secondSyllables: "bo", answer: "bobo" },
    { firstSyllables: "bi", secondSyllables: "bo", answer: "bibo" },
    { firstSyllables: "be", secondSyllables: "be", answer: "bebe" },
    { firstSyllables: "u", secondSyllables: "bi", answer: "ubi" },
    { firstSyllables: "a", secondSyllables: "bi", answer: "abi" }
],
"Ca": [
    { firstSyllables: "ca", secondSyllables: "ca", answer: "caca" },
    { firstSyllables: "i", secondSyllables: "ci", answer: "ici" },
    { firstSyllables: "co", secondSyllables: "ba", answer: "coba" },
    { firstSyllables: "co", secondSyllables: "co", answer: "coco" },
    { firstSyllables: "ba", secondSyllables: "ca", answer: "baca" },
    { firstSyllables: "ci", secondSyllables: "bi", answer: "cibi" },
    { firstSyllables: "ci", secondSyllables: "ci", answer: "cici" },
    { firstSyllables: "a", secondSyllables: "ce", answer: "ace" },
    { firstSyllables: "cu", secondSyllables: "cu", answer: "cucu" }
],
"Da": [
    { firstSyllables: "da", secondSyllables: "da", answer: "dada" },
    { firstSyllables: "ba", secondSyllables: "di", answer: "badi" },
    { firstSyllables: "e", secondSyllables: "do", answer: "edo" },
    { firstSyllables: "a", secondSyllables: "de", answer: "ade" },
    { firstSyllables: "da", secondSyllables: "du", answer: "dadu" },
    { firstSyllables: "e", secondSyllables: "di", answer: "edi" },
    { firstSyllables: "di", secondSyllables: "ba", answer: "diba" },
    { firstSyllables: "i", secondSyllables: "de", answer: "ide" },
    { firstSyllables: "di", secondSyllables: "ca", answer: "dica" }
],
"Fa": [
    { firstSyllables: "fa", secondSyllables: "fa", answer: "fafa" },
    { firstSyllables: "fo", secondSyllables: "ci", answer: "foci" },
    { firstSyllables: "fu", secondSyllables: "fu", answer: "fufu" },
    { firstSyllables: "fi", secondSyllables: "fa", answer: "fifa" },
    { firstSyllables: "fe", secondSyllables: "bi", answer: "febi" },
    { firstSyllables: "fi", secondSyllables: "ba", answer: "fiba" },
    { firstSyllables: "a", secondSyllables: "fu", answer: "afu" },
    { firstSyllables: "di", secondSyllables: "fa", answer: "difa" },
    { firstSyllables: "fi", secondSyllables: "bi", answer: "fibi" }
],
"Ga": [
    { firstSyllables: "ga", secondSyllables: "ga", answer: "gaga" },
    { firstSyllables: "ba", secondSyllables: "go", answer: "bago" },
    { firstSyllables: "ga", secondSyllables: "ca", answer: "gaca" },
    { firstSyllables: "go", secondSyllables: "de", answer: "gode" },
    { firstSyllables: "ci", secondSyllables: "gu", answer: "cigu" },
    { firstSyllables: "da", secondSyllables: "gu", answer: "dagu" },
    { firstSyllables: "gi", secondSyllables: "gi", answer: "gigi" },
    { firstSyllables: "gi", secondSyllables: "bi", answer: "gibi" },
    { firstSyllables: "ge", secondSyllables: "ge", answer: "gege" }
],
"Ha": [
    { firstSyllables: "ha", secondSyllables: "ha", answer: "haha" },
    { firstSyllables: "ha", secondSyllables: "ci", answer: "haci" },
    { firstSyllables: "ba", secondSyllables: "hu", answer: "bahu" },
    { firstSyllables: "fi", secondSyllables: "hi", answer: "fihi" },
    { firstSyllables: "o", secondSyllables: "ho", answer: "oho" },
    { firstSyllables: "da", secondSyllables: "hi", answer: "dahi" },
    { firstSyllables: "hi", secondSyllables: "ho", answer: "hiho" },
    { firstSyllables: "he", secondSyllables: "bo", answer: "hebo" },
    { firstSyllables: "a", secondSyllables: "ha", answer: "aha" }
],
"Ja": [
    { firstSyllables: "ba", secondSyllables: "ju", answer: "baju" },
    { firstSyllables: "ja", secondSyllables: "he", answer: "jahe" },
    { firstSyllables: "ji", secondSyllables: "ho", answer: "jiho" },
    { firstSyllables: "fi", secondSyllables: "ji", answer: "fiji" },
    { firstSyllables: "i", secondSyllables: "ja", answer: "ija" },
    { firstSyllables: "jo", secondSyllables: "jo", answer: "jojo" },
    { firstSyllables: "ja", secondSyllables: "di", answer: "jadi" },
    { firstSyllables: "je", secondSyllables: "ga", answer: "jega" },
    { firstSyllables: "ju", secondSyllables: "do", answer: "judo" }
],
"Ka": [
    { firstSyllables: "ji", secondSyllables: "ka", answer: "jika" },
    { firstSyllables: "ka", secondSyllables: "ki", answer: "kaki" },
    { firstSyllables: "ki", secondSyllables: "ko", answer: "kiko" },
    { firstSyllables: "ka", secondSyllables: "ca", answer: "kaca" },
    { firstSyllables: "ka", secondSyllables: "do", answer: "kado" },
    { firstSyllables: "ku", secondSyllables: "da", answer: "kuda" },
    { firstSyllables: "ke", secondSyllables: "ju", answer: "keju" },
    { firstSyllables: "ki", secondSyllables: "ba", answer: "kiba" },
    { firstSyllables: "ku", secondSyllables: "ku", answer: "kuku" }
],
"La": [
    { firstSyllables: "hi", secondSyllables: "lo", answer: "hilo" },
    { firstSyllables: "lu", secondSyllables: "lu", answer: "lulu" },
    { firstSyllables: "li", secondSyllables: "da", answer: "lida" },
    { firstSyllables: "la", secondSyllables: "ci", answer: "laci" },
    { firstSyllables: "la", secondSyllables: "gi", answer: "lagi" },
    { firstSyllables: "lo", secondSyllables: "la", answer: "lola" },
    { firstSyllables: "le", secondSyllables: "le", answer: "lele" },
    { firstSyllables: "la", secondSyllables: "li", answer: "lali" }
],
"Ma": [
    { firstSyllables: "bi", secondSyllables: "mo", answer: "bimo" },
    { firstSyllables: "a", secondSyllables: "mi", answer: "ami" },
    { firstSyllables: "me", secondSyllables: "mo", answer: "memo" },
    { firstSyllables: "ka", secondSyllables: "mi", answer: "kami" },
    { firstSyllables: "ma", secondSyllables: "hi", answer: "mahi" },
    { firstSyllables: "mu", secondSyllables: "da", answer: "muda" },
    { firstSyllables: "ma", secondSyllables: "mi", answer: "mami" },
    { firstSyllables: "me", secondSyllables: "ga", answer: "mega" },
    { firstSyllables: "mu", secondSyllables: "ka", answer: "muka" }
],
"Na": [
    { firstSyllables: "da", secondSyllables: "ni", answer: "dani" },
    { firstSyllables: "nu", secondSyllables: "nu", answer: "nunu" },
    { firstSyllables: "ni", secondSyllables: "la", answer: "nila" },
    { firstSyllables: "di", secondSyllables: "na", answer: "dina" },
    { firstSyllables: "ji", secondSyllables: "ni", answer: "jini" },
    { firstSyllables: "ni", secondSyllables: "mo", answer: "nimo" },
    { firstSyllables: "ne", secondSyllables: "ne", answer: "nene" },
    { firstSyllables: "ja", secondSyllables: "ni", answer: "jani" },
    { firstSyllables: "no", secondSyllables: "na", answer: "nona" }
],
"Pa": [
    { firstSyllables: "o", secondSyllables: "po", answer: "opo" },
    { firstSyllables: "pa", secondSyllables: "lu", answer: "palu" },
    { firstSyllables: "pi", secondSyllables: "pi", answer: "pipi" },
    { firstSyllables: "a", secondSyllables: "pa", answer: "apa" },
    { firstSyllables: "pa", secondSyllables: "pa", answer: "papa" },
    { firstSyllables: "po", secondSyllables: "la", answer: "pola" },
    { firstSyllables: "pi", secondSyllables: "pa", answer: "pipa" },
    { firstSyllables: "pe", secondSyllables: "na", answer: "pena" },
    { firstSyllables: "pu", secondSyllables: "ma", answer: "puma" }
],
"Ra": [
    { firstSyllables: "ka", secondSyllables: "ri", answer: "kari" },
    { firstSyllables: "ro", secondSyllables: "da", answer: "roda" },
    { firstSyllables: "re", secondSyllables: "re", answer: "rere" },
    { firstSyllables: "qo", secondSyllables: "ra", answer: "qora" },
    { firstSyllables: "ra", secondSyllables: "me", answer: "rame" },
    { firstSyllables: "ri", secondSyllables: "ca", answer: "rica" },
    { firstSyllables: "re", secondSyllables: "la", answer: "rela" },
    { firstSyllables: "ru", secondSyllables: "ru", answer: "ruru" },
    { firstSyllables: "ri", secondSyllables: "ri", answer: "riri" }
],
"Sa": [
    { firstSyllables: "da", secondSyllables: "si", answer: "dasi" },
    { firstSyllables: "su", secondSyllables: "si", answer: "susi" },
    { firstSyllables: "si", secondSyllables: "la", answer: "sila" },
    { firstSyllables: "sa", secondSyllables: "ma", answer: "sama" },
    { firstSyllables: "se", secondSyllables: "gi", answer: "segi" },
    { firstSyllables: "so", secondSyllables: "da", answer: "soda" },
    { firstSyllables: "se", secondSyllables: "ri", answer: "seri" },
    { firstSyllables: "sa", secondSyllables: "ku", answer: "saku" },
    { firstSyllables: "so", secondSyllables: "na", answer: "sona" }
],
"Ta": [
    { firstSyllables: "pi", secondSyllables: "ta", answer: "pita" },
    { firstSyllables: "tu", secondSyllables: "ti", answer: "tuti" },
    { firstSyllables: "te", secondSyllables: "ma", answer: "tema" },
    { firstSyllables: "ta", secondSyllables: "li", answer: "tali" },
    { firstSyllables: "ta", secondSyllables: "ta", answer: "tata" },
    { firstSyllables: "te", secondSyllables: "ri", answer: "teri" },
    { firstSyllables: "te", secondSyllables: "di", answer: "tedi" },
    { firstSyllables: "qi", secondSyllables: "to", answer: "qito" },
    { firstSyllables: "ti", secondSyllables: "to", answer: "tito" }
],
"Va": [
    { firstSyllables: "a", secondSyllables: "va", answer: "ava" },
    { firstSyllables: "vu", secondSyllables: "va", answer: "vuva" },
    { firstSyllables: "ve", secondSyllables: "ti", answer: "veti" },
    { firstSyllables: "ti", secondSyllables: "vi", answer: "tivi" },
    { firstSyllables: "va", secondSyllables: "va", answer: "vava" },
    { firstSyllables: "vi", secondSyllables: "ta", answer: "vita" },
    { firstSyllables: "ve", secondSyllables: "ku", answer: "veku" },
    { firstSyllables: "vu", secondSyllables: "vu", answer: "vuvu" },
    { firstSyllables: "vi", secondSyllables: "vo", answer: "vivo" }
],
"Wa": [
    { firstSyllables: "de", secondSyllables: "wi", answer: "dewi" },
    { firstSyllables: "wo", secondSyllables: "wu", answer: "wowu" },
    { firstSyllables: "we", secondSyllables: "la", answer: "wela" },
    { firstSyllables: "sa", secondSyllables: "wi", answer: "sawi" },
    { firstSyllables: "wa", secondSyllables: "ba", answer: "waba" },
    { firstSyllables: "we", secondSyllables: "wi", answer: "wewi" },
    { firstSyllables: "wa", secondSyllables: "wi", answer: "wawi" },
    { firstSyllables: "i", secondSyllables: "wa", answer: "iwa" },
    { firstSyllables: "wi", secondSyllables: "lo", answer: "wilo" }
],
"Ya": [
    { firstSyllables: "sa", secondSyllables: "ya", answer: "saya" },
    { firstSyllables: "yu", secondSyllables: "ni", answer: "yuni" },
    { firstSyllables: "yi", secondSyllables: "yi", answer: "yiyi" },
    { firstSyllables: "ta", secondSyllables: "yo", answer: "tayo" },
    { firstSyllables: "ye", secondSyllables: "ti", answer: "yeti" },
    { firstSyllables: "yo", secondSyllables: "yo", answer: "yoyo" },
    { firstSyllables: "ye", secondSyllables: "ye", answer: "yeni" },
    { firstSyllables: "ya", secondSyllables: "na", answer: "yana" },
    { firstSyllables: "yu", secondSyllables: "di", answer: "yudi" }
],
"Za": [
    { firstSyllables: "i", secondSyllables: "zi", answer: "izi" },
    { firstSyllables: "zu", secondSyllables: "ma", answer: "zuma" },
    { firstSyllables: "ze", secondSyllables: "na", answer: "zena" },
    { firstSyllables: "mi", secondSyllables: "zo", answer: "mizo" },
    { firstSyllables: "zi", secondSyllables: "pi", answer: "zipi" },
    { firstSyllables: "za", secondSyllables: "zi", answer: "zazi" },
    { firstSyllables: "ze", secondSyllables: "zi", answer: "zezi" },
    { firstSyllables: "zo", secondSyllables: "la", answer: "zola" },
    { firstSyllables: "zu", secondSyllables: "le", answer: "zule" }
],
"Ia": [
    { firstSyllables: "s", secondSyllables: "ia", answer: "sia" },
    { firstSyllables: "d", secondSyllables: "ia", answer: "dia" },
    { firstSyllables: "ce", secondSyllables: "r", thirdSyllables: "ia", answer: "ceria" },
    { firstSyllables: "ki", secondSyllables: "m", thirdSyllables: "ia", answer: "kimia" },
    { firstSyllables: "po", secondSyllables: "lio", answer: "polio" },
    { firstSyllables: "ka", secondSyllables: "lio", answer: "kalio" },
    { firstSyllables: "au", secondSyllables: "d",thirdSyllables: "io", answer: "audio" },
    { firstSyllables: "ra", secondSyllables: "d",thirdSyllables: "io", answer: "radio" },
    { firstSyllables: "du", secondSyllables: "n",thirdSyllables: "ia", answer: "dunia" }
],
"Ua": [
    { firstSyllables: "k", secondSyllables: "ua",  answer: "kua" },
    { firstSyllables: "t",  secondSyllables: "ua",answer: "tua" },
    { firstSyllables: "s", secondSyllables: "uo", answer: "suo" },
    { firstSyllables: "ke", secondSyllables: "d", thirdSyllables: "ua", answer: "kedua" },
    { firstSyllables: "g", secondSyllables: "ua", answer: "gua" },
    { firstSyllables: "a", secondSyllables: "l",thirdSyllables: "uo", answer: "aluo" },
    { firstSyllables: "ke", secondSyllables: "t",thirdSyllables: "ua", answer: "ketua" },
    { firstSyllables: "o", secondSyllables: "r", thirdSyllables: "ang",fourthSyllables: "t",fifthSyllables: "ua",answer: "orangtua" },
    { firstSyllables: "d", secondSyllables: "uo", answer: "duo" },
    { firstSyllables: "i", secondSyllables: "gua", thirdSyllables: "na",answer: "iguana" }
],
"Ang": [
    { firstSyllables: "a", secondSyllables: "b",thirdSyllables: "ang",  answer: "abang" },
    { firstSyllables: "wa",  secondSyllables: "r", thirdSyllables: "ung",answer: "warung" },
    { firstSyllables: "be", secondSyllables: "n", thirdSyllables: "ang", answer: "benang" },
    { firstSyllables: "a", secondSyllables: "s", thirdSyllables: "ong",answer: "asong" },
    { firstSyllables: "bo", secondSyllables: "r", thirdSyllables: "ong",answer: "borong" },
    { firstSyllables: "lo", secondSyllables: "t", thirdSyllables: "eng", answer: "loteng" },
    { firstSyllables: "ma", secondSyllables: "n", thirdSyllables: "c", fourthSyllables: "ing", answer: "mancing" },
    { firstSyllables: "gu", secondSyllables: "n", thirdSyllables: "t", fourthSyllables: "ing", answer: "gunting" },
    { firstSyllables: "pa", secondSyllables: "y", thirdSyllables: "ung", answer: "payung" }
],
"Nya": [
    { firstSyllables: "nya", secondSyllables: "nyi",   answer: "nyanyi" },
    { firstSyllables: "nyi",  secondSyllables: "ma", thirdSyllables: "k", answer: "nyimak" },
    { firstSyllables: "nyo", secondSyllables: "nya", answer: "nyonya" },
    { firstSyllables: "pe", secondSyllables: "nyu", answer: "penyu" },
    { firstSyllables: "u", secondSyllables: "nyu", answer: "unyu" },
    { firstSyllables: "nye", secondSyllables: "la", thirdSyllables: "m", answer: "nyelam" },
    { firstSyllables: "o", secondSyllables: "ra",thirdSyllables: "nye", answer: "oranye" },
    { firstSyllables: "nye", secondSyllables: "nya",thirdSyllables: "k", answer: "nyenyak" },
    { firstSyllables: "po", secondSyllables: "nyo", answer: "ponyo" }
],
"Nga": [
    { firstSyllables: "bu", secondSyllables: "nga",  answer: "bunga" },
    { firstSyllables: "a",  secondSyllables: "ngi", thirdSyllables: "n",answer: "angin" },
    { firstSyllables: "de", secondSyllables: "ngung",  answer: "dengung" },
    { firstSyllables: "si", secondSyllables: "nga", answer: "singa" },
    { firstSyllables: "le", secondSyllables: "nga", answer: "lenga" },
    { firstSyllables: "u", secondSyllables: "ngu", answer: "ungu" },
    { firstSyllables: "ngo", secondSyllables: "pi", answer: "ngopi" },
    { firstSyllables: "nge", secondSyllables: "bu", thirdSyllables: "t", answer: "ngebut" },
    { firstSyllables: "wa", secondSyllables: "ngi", answer: "wangi" }
]
};

const indonesianEmojis = {
'A': [['📩', 'Amplop'], ['🍎', 'Apel'], ['💧', 'Air'],['🦢','Angsa']],
'B': [['🌸', 'Bunga'],['🦆', 'Bebek'], ['⚽', 'Bola'], ['📖', 'Buku'], ['🦉', 'Burung Hantu'], ['🏄', 'berselancar'], ['🦗', 'Belalang']],
'C': [['🦎', 'Cicak'], ['🪱', 'Cacing'], ['🌶', 'Cabai']],
'D': [['🍖', 'Daging'], ['🍈', 'Durian'],['🐑', 'Domba'], ['👩‍🦲', 'Dahi'], ['🩺👨‍⚕️👩‍⚕️', 'Dokter'],['🍃', 'Daun'],['🥁', 'Drum']],
'E': [['🍦', 'Es'], ['🦅', 'Elang'], ['🧊', 'Es Batu'], ['🚜', 'Ekskavator']],
'F': [['🎥', 'Film'],  ['🔬', 'Fisika'], ['🎯', 'Fokus']],
'G': [['🎸', 'Gitar'], ['🐘', 'Gajah'], ['➖', 'Garis'], ['🥛', 'Gelas']],
'H': [['🚏', 'Halte'], ['🐯', 'Harimau'], ['🎼', 'Harmoni']],
'I': [['🏰', 'Istana'], ['👩', 'Ibu'], ['🐟', 'Ikan'], ['🎀', 'Ikat']],
'J': [['🌽', 'Jagung'], ['🍄', 'Jamur'], ['🧥', 'Jaket'], ['🪡', 'Jarum'],['🐾', 'Jejak']],
'K': [['🦘', 'Kanguru'], ['🌫️', 'Kabut'], ['🪞', 'Kaca'], ['🖇', 'Klip'], ['🐇', 'Kelinci']],
'L': [['🗄', 'Laci'], ['🦔', 'Landak'], ['💡', 'Lampu']],
'M': [['🥭', 'Mangga'], ['🐒', 'Monyet'], ['🧲', 'Magnet'], ['🍯', 'Madu'],['🌞', 'Matahari']],
'N': [['🍚', 'Nasi'],  ['🐉', 'Naga'], ['🍍', 'Nanas']],
'O': [['🔥', 'Obor'], ['🪐', 'Orbit'], ['🔧', 'Obeng'], ['💊', 'Obat']],
'P': [['✏', 'Pensil'], ['🍳', 'Panci'], ['🥧', 'Puding'], ['🏹', 'Panah'],['🐋', 'Paus'],['🌴', 'Pohon']],
'Q': [['<img src="/assets/image-mainsukukata/qatar.png" alt="qatar" width="40" draggable="false">', 'Qatar']],
'R': [['👑', 'Raja'], ['🍞', 'Roti'], ['🦌', 'Rusa'],['🏸', 'Raket'], [' ⛓️', 'Rantai'], [' 🚀', 'Roket']],
'S': [['🐄', 'Sapi'], ['🦭', 'Singa Laut'], ['🩴', 'Sandal'], ['🦁', 'Singa'],['🚲', 'Sepeda'],['🧹','Sapu']],
'T': [['🎋', 'Tebu'], ['🐿️', 'Tupai'], ['🌊', 'Tsunami']],
'U': [['🐛', 'Ulat'],['🐍', 'Ular'],['🐫', 'Unta'],['🦐', 'Udang'], ['🍠', 'Ubi']],
'V': [['🏐', 'Voli'], ['🏺', 'Vas'], ['🌋', 'Vulkanik']],
'W': [['🌅', 'Warna'],['🥕', 'Wortel'],['🎢🎡', 'Wahana']],
'X': [['<img src="/assets/image-mainsukukata/xilofon.png" alt="zebra" width="40" draggable="false">', 'Xilofon'], ['<img src="/assets/image-mainsukukata/xenon.png" alt="zebra" width="40">', 'Xenon']],
'Y': [['🪀', 'Yoyo'], ['🥋', 'Yudo']],
'Z': [['<img src="/assets/image-mainsukukata/zebra.png" alt="zebra" width="40" draggable="false">', 'Zebra' ], ['🫒', 'Zaitun']]
};

const sukuKataKata = {
    'Ba': ['ba','bi','bu','be','bo'],
    'Ca': ['ca','ci','cu','ce','co'],
    'Da': ['da','di','du','de','do'],
    'Fa': ['fa','fi','fu','fe','fo'],
    'Ga': ['ga','gi','gu','ge','go'],
    'Ha': ['ha','hi','hu','he','ho'],
    'Ja': ['ja','ji','ju','je','jo'],
    'Ka': ['ka','ki','ku','ke','ko'],
    'La': ['la','li','lu','le','lo'],
    'Ma': ['ma','mi','mu','me','mo'],
    'Na': ['na','ni','nu','ne','no'],
    'Pa': ['pa','pi','pu','pe','po'],
    'Ra': ['ra','ri','ru','re','ro'],
    'Sa': ['sa','si','su','se','so'],
    'Ta': ['ta','ti','tu','te','to'],
    'Va': ['va','vi','vu','ve','vo'],
    'Wa': ['wa','wi','wu','we','wo'],
    'Ya': ['ya','yi','yu','ye','yo'],
    'Za': ['za','zi','zu','ze','zo'],
    'Ang': ['ang','ing','ung','eng','ong'],
    'Nga': ['nga','ngi','ngu','nge','ngo'],
    'Nya': ['nya','nyi','nyu','nye','nyo'],
    'Ia': ['ia','io'],
    'Ua': ['ua','uo','ui']
    };


const syllableSounds = {
'A': 'assets/audio/a.mp3','B': 'assets/audio/b.mp3','C': 'assets/audio/c.mp3','D': 'assets/audio/d.mp3',
'E': 'assets/audio/e.mp3','F': 'assets/audio/f.mp3','G': 'assets/audio/g.mp3','H': 'assets/audio/h.mp3',
'I': 'assets/audio/i.mp3','J': 'assets/audio/j.mp3','K': 'assets/audio/k.mp3','L': 'assets/audio/l.mp3',
'M': 'assets/audio/m.mp3','N': 'assets/audio/n.mp3','O': 'assets/audio/o.mp3','P': 'assets/audio/p.mp3',
'Q': 'assets/audio/q.mp3','R': 'assets/audio/r.mp3','S': 'assets/audio/s.mp3','T': 'assets/audio/t.mp3',
'U': 'assets/audio/u.mp3','V': 'assets/audio/v.mp3','W': 'assets/audio/w.mp3','X': 'assets/audio/x.mp3',
'Y': 'assets/audio/y.mp3','Z': 'assets/audio/z.mp3','Ba': 'assets/audio/ba.mp3','Bi': 'assets/audio/bi.mp3',
'Bu': 'assets/audio/bu.mp3','Be': 'assets/audio/be.mp3','Bo': 'assets/audio/bo.mp3','Ca': 'assets/audio/ca.mp3',
'Ci': 'assets/audio/ci.mp3','Cu': 'assets/audio/cu.mp3','Ce': 'assets/audio/ce.mp3','Co': 'assets/audio/co.mp3',
'Da': 'assets/audio/da.mp3','Di': 'assets/audio/di.mp3','Du': 'assets/audio/du.mp3','De': 'assets/audio/de.mp3',
'Do': 'assets/audio/do.mp3','Fa': 'assets/audio/fa.mp3','Fi': 'assets/audio/fi.mp3','Fu': 'assets/audio/fu.mp3',
'Fe': 'assets/audio/fe.mp3','Fo': 'assets/audio/fo.mp3','Ga': 'assets/audio/ga.mp3','Gi': 'assets/audio/gi.mp3',
'Gu': 'assets/audio/gu.mp3','Ge': 'assets/audio/ge.mp3','Go': 'assets/audio/go.mp3','Ha': 'assets/audio/ha.mp3',
'Hi': 'assets/audio/hi.mp3','Hu': 'assets/audio/hu.mp3','He': 'assets/audio/he.mp3','Ho': 'assets/audio/ho.mp3',
'Ja': 'assets/audio/ja.mp3','Ji': 'assets/audio/ji.mp3','Ju': 'assets/audio/ju.mp3','Je': 'assets/audio/je.mp3',
'Jo': 'assets/audio/jo.mp3','Ka': 'assets/audio/ka.mp3','Ki': 'assets/audio/ki.mp3','Ku': 'assets/audio/ku.mp3',
'Ke': 'assets/audio/ke.mp3','Ko': 'assets/audio/ko.mp3','La': 'assets/audio/la.mp3','Li': 'assets/audio/li.mp3',
'Lu': 'assets/audio/lu.mp3','Le': 'assets/audio/le.mp3','Lo': 'assets/audio/lo.mp3','Ma': 'assets/audio/ma.mp3',
'Mi': 'assets/audio/mi.mp3','Mu': 'assets/audio/mu.mp3','Me': 'assets/audio/me.mp3','Mo': 'assets/audio/mo.mp3',
'Na': 'assets/audio/na.mp3','Ni': 'assets/audio/ni.mp3','Nu': 'assets/audio/nu.mp3','Ne': 'assets/audio/ne.mp3',
'No': 'assets/audio/no.mp3','Pa': 'assets/audio/pa.mp3','Pi': 'assets/audio/pi.mp3','Pu': 'assets/audio/pu.mp3',
'Pe': 'assets/audio/pe.mp3','Po': 'assets/audio/po.mp3','Qa': 'assets/audio/da.mp3','Qi': 'assets/audio/ci.mp3',
'Qu': 'assets/audio/cu.mp3','Qe': 'assets/audio/ce.mp3','Qo': 'assets/audio/co.mp3','Ra': 'assets/audio/ra.mp3',
'Ri': 'assets/audio/ri.mp3','Ru': 'assets/audio/ru.mp3','Re': 'assets/audio/re.mp3','Ro': 'assets/audio/ro.mp3',
'Sa': 'assets/audio/sa.mp3','Si': 'assets/audio/si.mp3','Su': 'assets/audio/su.mp3','Se': 'assets/audio/se.mp3',
'So': 'assets/audio/so.mp3',
'Ta': 'assets/audio/ta.mp3',
'Ti': 'assets/audio/ti.mp3',
'Tu': 'assets/audio/tu.mp3',
'Te': 'assets/audio/te.mp3',
'To': 'assets/audio/to.mp3',
'Va': 'assets/audio/va.mp3',
'Vi': 'assets/audio/vi.mp3',
'Vu': 'assets/audio/vu.mp3',
'Ve': 'assets/audio/ve.mp3',
'Vo': 'assets/audio/vo.mp3',
'Wa': 'assets/audio/wa.mp3',
'Wi': 'assets/audio/wi.mp3',
'Wu': 'assets/audio/wu.mp3',
'We': 'assets/audio/we.mp3',
'Wo': 'assets/audio/wo.mp3',
'Ya': 'assets/audio/ya.mp3',
'Yi': 'assets/audio/yi.mp3',
'Yu': 'assets/audio/yu.mp3',
'Ye': 'assets/audio/ye.mp3',
'Yo': 'assets/audio/yo.mp3',
'Za': 'assets/audio/za.mp3',
'Zi': 'assets/audio/zi.mp3',
'Zu': 'assets/audio/zu.mp3',
'Ze': 'assets/audio/ze.mp3',
'Zo': 'assets/audio/zo.mp3',
'Au': 'assets/audio/au.mp3',
'Ang': 'assets/audio/ang.mp3',
'Ing': 'assets/audio/ing.mp3',
'Ung': 'assets/audio/ung.mp3',
'Eng': 'assets/audio/eng.mp3',
'Ong': 'assets/audio/ong.mp3',
'Ia': 'assets/audio/ia.mp3',
'Io': 'assets/audio/io.mp3',
'Nya': 'assets/audio/nya.mp3',
'Nyi': 'assets/audio/nyi.mp3',
'Nyu': 'assets/audio/nyu.mp3',
'Nye': 'assets/audio/nye.mp3',
'Nyo': 'assets/audio/nyo.mp3',
'Ua': 'assets/audio/ua.mp3',
'Uo': 'assets/audio/uo.mp3',
'Ui': 'assets/audio/ui.mp3',
'Nga': 'assets/audio/nga.mp3',
'Ngi': 'assets/audio/ngi.mp3',
'Ngu': 'assets/audio/ngu.mp3',
'Nge': 'assets/audio/nge.mp3',
'Ngo': 'assets/audio/ngo.mp3',
'Ngung': 'assets/audio/ngung.mp3',
'Bang': 'assets/audio/bang.mp3',
'Bau': 'assets/audio/bau.mp3',
'Bek': 'assets/audio/bek.mp3',
'Bing': 'assets/audio/bing.mp3',
'Bra': 'assets/audio/bra.mp3',
'Dok': 'assets/audio/dok.mp3',
'Es': 'assets/audio/es.mp3',
'Gam': 'assets/audio/gam.mp3',
'Gloo': 'assets/audio/gloo.mp3',
'Gua': 'assets/audio/gua.mp3',
'Guin': 'assets/audio/guin.mp3',
'Jah': 'assets/audio/jah.mp3',
'Kam': 'assets/audio/kam.mp3',
'Ker': 'assets/audio/ker.mp3',
'Kus': 'assets/audio/kus.mp3',
'Lang': 'assets/audio/lang.mp3',
'Lar': 'assets/audio/lar.mp3',
'Mau': 'assets/audio/mau.mp3',
'Mer': 'assets/audio/mer.mp3',
'Mia': 'assets/audio/mia.mp3',
'Mon': 'assets/audio/mon.mp3',
'Mut': 'assets/audio/mut.mp3',
'Pen': 'assets/audio/pen.mp3',
'Ring': 'assets/audio/ring.mp3',
'Tik': 'assets/audio/tik.mp3',
'Tor': 'assets/audio/tor.mp3',
'Us': 'assets/audio/us.mp3',
'Vul': 'assets/audio/vul.mp3',
'Yung': 'assets/audio/yung.mp3',
'Nik': 'assets/audio/nik.mp3',
'Wor': 'assets/audio/wor.mp3',
'Lio': 'assets/audio/lio.mp3',

// Add sounds for all syllables
};

const wordSounds = {
'baba': 'assets/audio/baba.mp3','bebe': 'assets/audio/bebe.mp3','bobo': 'assets/audio/bobo.mp3',
'ubi': 'assets/audio/ubi.mp3','bibo': 'assets/audio/bibo.mp3','abi': 'assets/audio/abi.mp3',
'obo': 'assets/audio/obo.mp3','ibu': 'assets/audio/ibu.mp3','bubu': 'assets/audio/bubu.mp3',
'caca': 'assets/audio/caca.mp3','ici': 'assets/audio/ici.mp3','coba': 'assets/audio/coba.mp3',
'coco': 'assets/audio/coco.mp3','cibi': 'assets/audio/cibi.mp3','cici': 'assets/audio/cici.mp3',
'ace': 'assets/audio/ace.mp3','cucu': 'assets/audio/cucu.mp3','baca': 'assets/audio/baca.mp3',
'dada': 'assets/audio/dada.mp3','badi': 'assets/audio/badi.mp3','edo': 'assets/audio/edo.mp3',
'edi': 'assets/audio/edi.mp3','diba': 'assets/audio/diba.mp3','dica': 'assets/audio/dica.mp3',
'ade': 'assets/audio/ade.mp3','dadu': 'assets/audio/dadu.mp3','ide': 'assets/audio/ide.mp3',
'fafa': 'assets/audio/fafa.mp3','fiba': 'assets/audio/fiba.mp3','foci': 'assets/audio/foci.mp3',
'afu': 'assets/audio/afu.mp3','fufu': 'assets/audio/fufu.mp3','difa': 'assets/audio/difa.mp3',
'fifa': 'assets/audio/fifa.mp3','fibi': 'assets/audio/fibi.mp3','febi': 'assets/audio/febi.mp3,',
'gaga': 'assets/audio/gaga.mp3','dagu': 'assets/audio/dagu.mp3','bago': 'assets/audio/bago.mp3',
'gigi': 'assets/audio/gigi.mp3','gaca': 'assets/audio/gaca.mp3','gibi': 'assets/audio/gibi.mp3',
'gode': 'assets/audio/gode.mp3','gege': 'assets/audio/gege.mp3','cigu': 'assets/audio/cigu.mp3',
'haha': 'assets/audio/haha.mp3,','dahi': 'assets/audio/dahi.mp3','haci': 'assets/audio/haci.mp3',
'hiho': 'assets/audio/hiho.mp3','bahu': 'assets/audio/bahu.mp3','hebo': 'assets/audio/hebo.mp3',
'fihi': 'assets/audio/fihi.mp3','aha': 'assets/audio/aha.mp3','oho': 'assets/audio/oho.mp3',
'baju': 'assets/audio/baju.mp3','jojo': 'assets/audio/jojo.mp3','jahe': 'assets/audio/jahe.mp3',
'jadi': 'assets/audio/jadi.mp3','jiho': 'assets/audio/jiho.mp3','jega': 'assets/audio/jega.mp3',
'fiji': 'assets/audio/fiji.mp3','judo': 'assets/audio/judo.mp3','ija': 'assets/audio/ija.mp3',
'jika': 'assets/audio/jika.mp3','kuda': 'assets/audio/kuda.mp3','kaki': 'assets/audio/kaki.mp3',
'keju': 'assets/audio/keju.mp3','kiko': 'assets/audio/kiko.mp3','kiba': 'assets/audio/kiba.mp3',
'kaca': 'assets/audio/kaca.mp3','kuku': 'assets/audio/kuku.mp3','kado': 'assets/audio/kado.mp3',
'hilo': 'assets/audio/hilo.mp3','lola': 'assets/audio/lola.mp3','lulu': 'assets/audio/lulu.mp3',
'lele': 'assets/audio/lele.mp3','lida': 'assets/audio/lida.mp3','lali': 'assets/audio/lali.mp3',
'laci': 'assets/audio/laci.mp3','lagi': 'assets/audio/lagi.mp3','kado': 'assets/audio/kado.mp3',
'bimo': 'assets/audio/bimo.mp3','muda': 'assets/audio/muda.mp3','ami': 'assets/audio/ami.mp3',
'mami': 'assets/audio/mami.mp3','memo': 'assets/audio/memo.mp3','mega': 'assets/audio/mega.mp3',
'kami': 'assets/audio/kami.mp3','muka': 'assets/audio/muka.mp3','mahi': 'assets/audio/mahi.mp3',
'dani': 'assets/audio/dani.mp3','nimo': 'assets/audio/nimo.mp3','nunu': 'assets/audio/nunu.mp3',
'nene': 'assets/audio/nene.mp3','nila': 'assets/audio/nila.mp3','jani': 'assets/audio/jani.mp3',
'dina': 'assets/audio/dina.mp3','nona': 'assets/audio/nona.mp3','jini': 'assets/audio/jini.mp3',
'opo': 'assets/audio/opo.mp3','pola': 'assets/audio/pola.mp3','palu': 'assets/audio/palu.mp3',
'pipa': 'assets/audio/pipa.mp3','pipi': 'assets/audio/pipi.mp3','pena': 'assets/audio/pena.mp3',
'apa': 'assets/audio/apa.mp3','puma': 'assets/audio/puma.mp3','papa': 'assets/audio/papa.mp3',
'kari': 'assets/audio/kari.mp3','rica': 'assets/audio/rica.mp3','roda': 'assets/audio/roda.mp3',
'rela': 'assets/audio/rela.mp3','rere': 'assets/audio/rere.mp3','ruru': 'assets/audio/ruru.mp3',
'qora': 'assets/audio/qora.mp3','riri': 'assets/audio/riri.mp3','rame': 'assets/audio/rame.mp3',
'dasi': 'assets/audio/dasi.mp3','soda': 'assets/audio/soda.mp3','susu': 'assets/audio/susu.mp3',
'seri': 'assets/audio/seri.mp3','sila': 'assets/audio/sila.mp3','saku': 'assets/audio/saku.mp3',
'sama': 'assets/audio/sama.mp3','sona': 'assets/audio/sona.mp3','segi': 'assets/audio/segi.mp3',
'pita': 'assets/audio/pita.mp3','teri': 'assets/audio/teri.mp3','tutu': 'assets/audio/tutu.mp3',
'tedi': 'assets/audio/tedi.mp3','tema': 'assets/audio/tema.mp3','qito': 'assets/audio/qito.mp3',
'tali': 'assets/audio/tali.mp3','tito': 'assets/audio/tito.mp3','tata': 'assets/audio/tata.mp3',
'ava': 'assets/audio/ava.mp3','vita': 'assets/audio/vita.mp3','vuva': 'assets/audio/vuva.mp3',
'veku': 'assets/audio/veku.mp3','veti': 'assets/audio/veti.mp3','vuvu': 'assets/audio/vuvu.mp3',
'tivi': 'assets/audio/tivi.mp3','vivo': 'assets/audio/vivo.mp3','vava': 'assets/audio/vava.mp3',
'dewi': 'assets/audio/dewi.mp3','wewi': 'assets/audio/wewi.mp3','wowu': 'assets/audio/wowu.mp3',
'wawi': 'assets/audio/wawi.mp3','wela': 'assets/audio/wela.mp3','iwa': 'assets/audio/iwa.mp3',
'sawi': 'assets/audio/sawi.mp3','wilo': 'assets/audio/wilo.mp3','waba': 'assets/audio/waba.mp3',
'saya': 'assets/audio/saya.mp3','yoyo': 'assets/audio/yoyo.mp3','yuni': 'assets/audio/yuni.mp3',
'yeni': 'assets/audio/yeni.mp3','yiyi': 'assets/audio/yiyi.mp3','yana': 'assets/audio/yana.mp3',
'tayo': 'assets/audio/tyo.mp3','yudi': 'assets/audio/yudi.mp3','yeti': 'assets/audio/yeti.mp3',
'izi': 'assets/audio/izi.mp3','zazi': 'assets/audio/zazi.mp3','zuma': 'assets/audio/zuma.mp3',
'zezi': 'assets/audio/zezi.mp3','zena': 'assets/audio/zena.mp3','zola': 'assets/audio/zola.mp3',
'mizo': 'assets/audio/mizo.mp3','zule': 'assets/audio/zule.mp3','zipi': 'assets/audio/zipi.mp3',
'asia': 'assets/audio/asia.mp3','audio': 'assets/audio/audio.mp3','kedua': 'assets/audio/kedua.mp3',
'ceria': 'assets/audio/ceria.mp3','radio': 'assets/audio/radio.mp3','orangtua': 'assets/audio/orangtua.mp3',
'dia': 'assets/audio/dia.mp3','dunia': 'assets/audio/dunia.mp3','tua': 'assets/audio/tua.mp3',
'kimia': 'assets/audio/kimia.mp3','kua': 'assets/audio/kua.mp3','gua': 'assets/audio/gua.mp3',
'aluo': 'assets/audio/aluo.mp3','bintang': 'assets/audio/bintang.mp3','dorong': 'assets/audio/dorong.mp3',
'duo': 'assets/audio/duo.mp3','benang': 'assets/audio/benang.mp3','mancing': 'assets/audio/mancing.mp3',
'ketua': 'assets/audio/ketua.mp3','asong': 'assets/audio/asong.mp3','gunting': 'assets/audio/gunting.mp3',
'abang': 'assets/audio/abang.mp3','borong': 'assets/audio/borong.mp3','baling': 'assets/audio/baling.mp3',
'loteng': 'assets/audio/loteng.mp3','nyanyi': 'assets/audio/nyanyi.mp3','ponyo': 'assets/audio/ponyo.mp3',
'obeng': 'assets/audio/obeng.mp3','nyenyak': 'assets/audio/nyenyak.mp3','unyu': 'assets/audio/unyu.mp3',
'payung': 'assets/audio/payung.mp3','penyu': 'assets/audio/penyu.mp3','nyonya': 'assets/audio/nyonya.mp3',
'warung': 'assets/audio/warung.mp3','nyimak': 'assets/audio/nyimak.mp3','nyelam': 'assets/audio/nyelam.mp3',
'oranye': 'assets/audio/oranye.mp3','angin': 'assets/audio/yudi.mp3','ngebut': 'assets/audio/ngebut.mp3',
'bunga': 'assets/audio/bunga.mp3','wangi': 'assets/audio/zazi.mp3','ngopi': 'assets/audio/ngopi.mp3',
'singa': 'assets/audio/singa.mp3','ungu': 'assets/audio/ungu.mp3','gua': 'assets/audio/guo.mp3',
'lenga': 'assets/audio/lenga.mp3','dengung': 'assets/audio/dengung.mp3','iguana': 'assets/audio/iguana.mp3',
// Add sounds for all words
};
const syllableGradients = {
"Ba": "linear-gradient(135deg, #1e3c72, #f2fcfe)", // Gradient blue
"Ca": "linear-gradient(135deg, #00b4db, #0083b0)", // Gradient cyan
"Da": "linear-gradient(135deg, #6a11cb, #2575fc)", // Gradient purple-blue
"Fa": "linear-gradient(135deg, #ff416c, #ff4b2b)", // Gradient red-orange
"Ga": "linear-gradient(135deg, #1d976c, #93f9b9)", // Gradient green
"Ha": "linear-gradient(135deg, #ff7e5f, #feb47b)", // Gradient orange
"Ja": "linear-gradient(135deg, #8e2de2, #4a00e0)", // Gradient purple
"Ka": "linear-gradient(135deg, #f12711, #f5af19)", // Gradient red-yellow
"La": "linear-gradient(135deg, #00c6ff, #0072ff)", // Gradient blue
"Ma": "linear-gradient(135deg, #ff6f61, #ffcc67)", // Gradient coral
"Na": "linear-gradient(135deg, #ff9a9e, #fad0c4)", // Gradient pink
"Pa": "linear-gradient(135deg, #4e54c8, #8f94fb)", // Gradient indigo
"Ra": "linear-gradient(135deg, #ff758c, #ff7eb3)", // Gradient magenta
"Sa": "linear-gradient(135deg, #654ea3, #eaafc8)", // Gradient purple-pink
"Ta": "linear-gradient(135deg, #1a2a6c, #b21f1f)", // Gradient navy-red
"Va": "linear-gradient(135deg, #00b09b, #96c93d)", // Gradient green-yellow
"Wa": "linear-gradient(135deg, #ff5f6d, #ffc371)", // Gradient orange-pink
"Ya": "linear-gradient(135deg, #f46b45, #eea849)", // Gradient orange-yellow
"Za": "linear-gradient(135deg, #1c92d2, #f2fcfe)",  // Gradient blue-white
"Ang": "linear-gradient(135deg, #1a2a6c, #b21f1f)", // Gradient navy-red
"Nya": "linear-gradient(135deg, #00b09b, #96c93d)", // Gradient green-yellow
"Nga": "linear-gradient(135deg, #ff5f6d, #ffc371)", // Gradient orange-pink
"Ia": "linear-gradient(135deg, #f46b45, #eea849)", // Gradient orange-yellow
"Ua": "linear-gradient(135deg, #1c92d2, #f2fcfe)"  // Gradient blue-white
};
const elementColors = {
"Ba": { grid: { background: "#1e3c72", outline: "#ffffff" }, display: { background: "#2a5298", text: "#ffffff" }, dialog: { background: "#1e3c72", text: "#ffffff" } },
"Ca": { grid: { background: "#00b4db", outline: "#ffffff" }, display: { background: "#0083b0", text: "#ffffff" }, dialog: { background: "#00b4db", text: "#ffffff" } },
"Da": { grid: { background: "#6a11cb", outline: "#ffffff" }, display: { background: "#2575fc", text: "#ffffff" }, dialog: { background: "#6a11cb", text: "#ffffff" } },
"Fa": { grid: { background: "#ff416c", outline: "#ffffff" }, display: { background: "#ff4b2b", text: "#ffffff" }, dialog: { background: "#ff416c", text: "#ffffff" } },
"Ga": { grid: { background: "#1d976c", outline: "#ffffff" }, display: { background: "#93f9b9", text: "#000000" }, dialog: { background: "#1d976c", text: "#ffffff" } },
"Ha": { grid: { background: "#ff7e5f", outline: "#ffffff" }, display: { background: "#feb47b", text: "#000000" }, dialog: { background: "#ff7e5f", text: "#ffffff" } },
"Ja": { grid: { background: "#8e2de2", outline: "#ffffff" }, display: { background: "#4a00e0", text: "#ffffff" }, dialog: { background: "#8e2de2", text: "#ffffff" } },
"Ka": { grid: { background: "#f12711", outline: "#ffffff" }, display: { background: "#f5af19", text: "#000000" }, dialog: { background: "#f12711", text: "#ffffff" } },
"La": { grid: { background: "#00c6ff", outline: "#ffffff" }, display: { background: "#0072ff", text: "#ffffff" }, dialog: { background: "#00c6ff", text: "#ffffff" } },
"Ma": { grid: { background: "#ff6f61", outline: "#ffffff" }, display: { background: "#ffcc67", text: "#000000" }, dialog: { background: "#ff6f61", text: "#ffffff" } },
"Na": { grid: { background: "#ff9a9e", outline: "#ffffff" }, display: { background: "#fad0c4", text: "#000000" }, dialog: { background: "#ff9a9e", text: "#ffffff" } },
"Pa": { grid: { background: "#4e54c8", outline: "#ffffff" }, display: { background: "#8f94fb", text: "#ffffff" }, dialog: { background: "#4e54c8", text: "#ffffff" } },
"Ra": { grid: { background: "#ff758c", outline: "#ffffff" }, display: { background: "#ff7eb3", text: "#000000" }, dialog: { background: "#ff758c", text: "#ffffff" } },
"Sa": { grid: { background: "#654ea3", outline: "#ffffff" }, display: { background: "#eaafc8", text: "#000000" }, dialog: { background: "#654ea3", text: "#ffffff" } },
"Ta": { grid: { background: "#1a2a6c", outline: "#ffffff" }, display: { background: "#b21f1f", text: "#ffffff" }, dialog: { background: "#1a2a6c", text: "#ffffff" } },
"Va": { grid: { background: "#00b09b", outline: "#ffffff" }, display: { background: "#96c93d", text: "#000000" }, dialog: { background: "#00b09b", text: "#ffffff" } },
"Wa": { grid: { background: "#ff5f6d", outline: "#ffffff" }, display: { background: "#ffc371", text: "#000000" }, dialog: { background: "#ff5f6d", text: "#ffffff" } },
"Ya": { grid: { background: "#f46b45", outline: "#ffffff" }, display: { background: "#eea849", text: "#000000" }, dialog: { background: "#f46b45", text: "#ffffff" } },
"Za": { grid: { background: "#1c92d2", outline: "#ffffff" }, display: { background: "#f2fcfe", text: "#000000" }, dialog: { background: "#1c92d2", text: "#ffffff" } },
"Ang": { grid: { background: "#1a2a6c", outline: "#ffffff" }, display: { background: "#b21f1f", text: "#ffffff" }, dialog: { background: "#1a2a6c", text: "#ffffff" } },
"Nya": { grid: { background: "#00b09b", outline: "#ffffff" }, display: { background: "#96c93d", text: "#000000" }, dialog: { background: "#00b09b", text: "#ffffff" } },
"Nga": { grid: { background: "#ff5f6d", outline: "#ffffff" }, display: { background: "#ffc371", text: "#000000" }, dialog: { background: "#ff5f6d", text: "#ffffff" } },
"Ia": { grid: { background: "#f46b45", outline: "#ffffff" }, display: { background: "#eea849", text: "#000000" }, dialog: { background: "#f46b45", text: "#ffffff" } },
"Ua": { grid: { background: "#1c92d2", outline: "#ffffff" }, display: { background: "#f2fcfe", text: "#000000" }, dialog: { background: "#1c92d2", text: "#ffffff" } }

};

const syllableImages = {
"Ba": {
    carousel: "assets/image-mainsukukata/bola.png",
    grid: "assets/image-mainsukukata/biru.png",
    equation: "assets/image-mainsukukata/balloon.svg"
},
"Ca": {
    carousel: "assets/img/fruits/ceri.png",
    grid: "assets/img/fruits/cempedak.png",
    equation: "assets/image-mainsukukata/celana.png"
},
"Da": {
    carousel: "assets/image-mainsukukata/domba.png",
    grid: "assets/img/fruits/duku.png",
    equation: "assets/img/fruits/durian.png"
},
"Fa": {
    carousel: "assets/image-mainsukukata/fisika.png",
    grid: "assets/image-mainsukukata/fokus.png",
    equation: "assets/image-mainsukukata/film.png"
},
"Ga": {
    carousel: "assets/image-mainsukukata/gajah.png",
    grid: "assets/image-mainsukukata/gajah.png",
    equation: "assets/image-mainsukukata/gajah.png"
},
"Ha": {
    carousel: "assets/image-mainsukukata/harimau.png",
    grid: "assets/image-mainsukukata/harimau.png",
    equation: "assets/image-mainsukukata/harimau.png"
},
"Ja": {
    carousel: "assets/img/fruits/jambu.png",
    grid: "assets/img/fruits/jeruk.png",
    equation: "assets/image-mainsukukata/jaringan.png"
},
"Ka": {
    carousel: "assets/image-mainsukukata/kacamata.png",
    grid: "assets/image-mainsukukata/kambing.png",
    equation: "assets/image-mainsukukata/kamera.png"
},
"La": {
    carousel: "assets/img/shapes/lemari.png",
    grid: "assets/img/shapes/laptop.png",
    equation: "assets/img/shapes/layanglayang.png"
},
"Ma": {
    carousel: "assets/image-mainsukukata/merpati.png",
    grid: "assets/image-mainsukukata/monyet.png",
    equation: "assets/image-mainsukukata/menara.png"
},
"Na": {
    carousel: "assets/img/fruits/nanas.png",
    grid: "assets/img/fruits/nangka.png",
    equation: "assets/img/fruits/nanas.png"
},
"Pa": {
    carousel: "assets/image-mainsukukata/paus.png",
    grid: "assets/image-mainsukukata/payung.png",
    equation: "assets/image-mainsukukata/penguin.png"
},
"Ra": {
    carousel: "assets/image-mainsukukata/roda.png",
    grid: "assets/image-mainsukukata/rubah.png",
    equation: "assets/image-mainsukukata/resleting.png"
},
"Sa": {
    carousel: "assets/image-mainsukukata/semut.png",
    grid: "assets/image-mainsukukata/sepatu.png",
    equation: "assets/image-mainsukukata/sepeda.png"
},
"Ta": {
    carousel: "assets/image-mainsukukata/tikus.png",
    grid: "assets/image-mainsukukata/televisi.png",
    equation: "assets/image-mainsukukata/tikus.png"
},
"Va": {
    
    carousel: "assets/image-mainsukukata/vas.png",
    grid: "assets/image-mainsukukata/voli.png",
    equation: "assets/image-mainsukukata/vulkanik.png"
},
"Wa": {
    carousel: "assets/image-mainsukukata/wahana.png",
    grid: "assets/image-mainsukukata/wortel.png",
    equation: "assets/image-mainsukukata/warna.png"
},
"Ya": {
    carousel: "assets/image-mainsukukata/yoyo.png",
    grid: "assets/image-mainsukukata/yoyo.png",
    equation: "assets/image-mainsukukata/yoyo.png"
},
"Za": {
    carousel: "assets/image-mainsukukata/zebra.png",
    grid: "assets/image-mainsukukata/zebra.png",
    equation: "assets/image-mainsukukata/zebra.png"
},
"Nya": {
    carousel: "assets/img/squirel/squirrelnyanyi.png",
    grid: "assets/img/squirel/squirrelnyelam.png",
    equation: "assets/image-mainsukukata/nyamuk.png"
},
"Ang": {
    carousel: "assets/image-mainsukukata/angsa.png",
    grid: "assets/image-mainsukukata/angklung.png",
    equation: "assets/image-mainsukukata/angsa.png" 
},
"Nga": {
    carousel: "assets/img/english/flower.png",
    grid: "assets/img/squirel/squirrelngopi.png",
    equation: "assets/img/english/flower.png" 
},
"Ia": {
    carousel: "assets/image-mainsukukata/kimia.png",
    grid: "assets/image-mainsukukata/radio.png",
    equation: "assets/image-mainsukukata/kimia.png" 
},
"Ua": {
    carousel: "assets/image-mainsukukata/uang.png" ,
    grid:  "assets/image-mainsukukata/buah.png" ,
    equation: "assets/image-mainsukukata/iguana.png" 
}
};
// Level questions
const level1Questions = [
    { word: "baca", syllables: ["ba", "ca"], dataSrc: "assets/image-mainsukukata/baca.png" },
    { word: "baju", syllables: ["ba", "ju"], dataSrc: "assets/image-mainsukukata/baju.png" },
    { word: "kuda", syllables: ["ku", "da"], dataSrc: "assets/image-mainsukukata/kuda.png" },
    { word: "buku", syllables: ["bu", "ku"], dataSrc: "assets/image-mainsukukata/buku.png" },
    { word: "biru", syllables: ["bi", "ru"], dataSrc: "assets/image-mainsukukata/biru.png" },
    { word: "bola", syllables: ["bo", "la"], dataSrc: "assets/image-mainsukukata/bola.png" },
    { word: "celana", syllables: ["ce", "la","na"], dataSrc: "assets/image-mainsukukata/celana.png" },
    { word: "ibu", syllables: ["i", "bu"], dataSrc: "assets/image-mainsukukata/ibu.png" },
    { word: "kamera", syllables: ["ka", "me","ra"], dataSrc: "assets/image-mainsukukata/kamera.png" },
    { word: "keju", syllables: ["ke", "ju"], dataSrc: "assets/image-mainsukukata/keju.png" },
    { word: "kelapa", syllables: ["ke", "la","pa"], dataSrc: "assets/image-mainsukukata/kelapa.png" },
    { word: "kemeja", syllables: ["ke", "me","ja"], dataSrc: "assets/image-mainsukukata/kemeja.png" },
    { word: "komodo", syllables: ["ko", "mo","do"], dataSrc: "assets/image-mainsukukata/komodo.png" },
    { word: "menara", syllables: ["me", "na","ra"], dataSrc: "assets/image-mainsukukata/menara.png" },
    { word: "pepaya", syllables: ["pe", "pa","ya"], dataSrc: "assets/image-mainsukukata/pepaya.png" },
    { word: "perahu", syllables: ["pe", "ra","hu"], dataSrc: "assets/image-mainsukukata/perahu.png" },
    { word: "petani", syllables: ["pe", "ta","ni"], dataSrc: "assets/image-mainsukukata/petani.png" },
    { word: "roda", syllables: ["ro", "da"], dataSrc: "assets/image-mainsukukata/roda.png" },
    { word: "sepatu", syllables: ["se", "pa","tu"], dataSrc: "assets/image-mainsukukata/sepatu.png" },
    { word: "sepeda", syllables: ["se", "pe","da"], dataSrc: "assets/image-mainsukukata/sepeda.png" },
    { word: "televisi", syllables: ["te", "le","vi","si"], dataSrc: "assets/image-mainsukukata/televisi.png" },
    { word: "ubi", syllables: ["u", "bi"], dataSrc: "assets/image-mainsukukata/ubi.png" },
    { word: "yoyo", syllables: ["yo", "yo"], dataSrc: "assets/image-mainsukukata/yoyo.png" },
    { word: "fisika", syllables: ["fi", "si","ka"], dataSrc: "assets/image-mainsukukata/fisika.png" },
    { word: "voli", syllables: ["vo", "li"], dataSrc: "assets/image-mainsukukata/voli.png" },
    
];

const level2Questions = [
    { word: "Eskavator", syllables: ["Es", "ka", "va", "tor"], dataSrc: "assets/image-mainsukukata/eskavator.png" },
    { word: "Eskalator", syllables: ["Es", "ka", "la", "tor"], dataSrc: "assets/image-mainsukukata/eskelator.png" },
    { word: "Bebek", syllables: ["Be", "bek"], dataSrc: "assets/image-mainsukukata/bebek.png" },
    { word: "Elang", syllables: ["E", "lang"], dataSrc: "assets/image-mainsukukata/elang.png" },
    { word: "Gambang", syllables: ["Gam", "bang"], dataSrc: "assets/image-mainsukukata/gambang.png" },
    { word: "Harimau", syllables: ["Ha", "ri", "mau"], dataSrc: "assets/image-mainsukukata/harimau.png" },
    { word: "Igloo", syllables: ["I", "gloo"], dataSrc: "assets/image-mainsukukata/igloo.png" },
    { word: "Gajah", syllables: ["Ga", "jah"], dataSrc: "assets/image-mainsukukata/gajah.png" },
    { word: "Iguana", syllables: ["I", "gua", "na"], dataSrc: "assets/image-mainsukukata/iguana.png" },
    { word: "Itik", syllables: ["I", "tik"], dataSrc: "assets/image-mainsukukata/itik.png" },
    { word: "Jaring", syllables: ["Ja", "ring"], dataSrc: "assets/image-mainsukukata/jaringan.png" },
    { word: "Kambing", syllables: ["Kam", "bing"], dataSrc: "assets/image-mainsukukata/kambing.png" },
    { word: "Kelinci", syllables: ["Ke", "lin","ci"], dataSrc: "assets/image-mainsukukata/kelinci.png" },
    { word: "Kerbau", syllables: ["Ker", "bau"], dataSrc: "assets/image-mainsukukata/kerbau.png" },
    { word: "kodok", syllables: ["Ko", "dok"], dataSrc: "assets/image-mainsukukata/kodok.png" },
    { word: "Merpati", syllables: ["Mer", "pa","ti"], dataSrc: "assets/image-mainsukukata/merpati.png" },
    { word: "Monyet", syllables: ["Mon", "yet"], dataSrc: "assets/image-mainsukukata/monyet.png" },
    { word: "Nyamuk", syllables: ["Nya", "muk"], dataSrc: "assets/image-mainsukukata/nyamuk.png" },
    { word: "Paus", syllables: ["Pa", "us"], dataSrc: "assets/image-mainsukukata/paus.png" },
    { word: "Payung", syllables: ["Pa", "yung"], dataSrc: "assets/image-mainsukukata/payung.png" },
    { word: "Penguin", syllables: ["Pen", "guin"], dataSrc: "assets/image-mainsukukata/penguin.png" },
    { word: "Semut", syllables: ["Se", "mut"], dataSrc: "assets/image-mainsukukata/semut.png" },
    { word: "Tikus", syllables: ["Ti", "kus"], dataSrc: "assets/image-mainsukukata/tikus.png" },
    { word: "Ular", syllables: ["U", "lar"], dataSrc: "assets/image-mainsukukata/ular.png" },
    { word: "Zebra", syllables: ["Ze", "bra"], dataSrc: "assets/image-mainsukukata/zebra.png" },
    { word: "Fokus", syllables: ["Fo", "kus"], dataSrc: "assets/image-mainsukukata/fokus.png" },
    { word: "Vulkanik", syllables: ["Vul","ka", "nik"], dataSrc: "assets/image-mainsukukata/vulkanik.png" },
    { word: "Wortel", syllables: ["Wor", "tel"], dataSrc: "assets/image-mainsukukata/wortel.png" },
    
];

// Track current section

function showSection(sectionId) {
      const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
   // Show the selected section
   const selectedSection = document.getElementById(sectionId);
   if (selectedSection) {
       selectedSection.style.display = 'block';
    
     }
       
      // Hide main menu
    document.querySelector('.main-menu').style.display = 'none';

    const secondaryHeader = document.querySelector('.secondaryHeader');
    if (selectedSection){
        secondaryHeader.style.display = 'flex';
        }else {
            secondaryHeader.style.display = 'none';
        }


    const mainButtons = document.querySelector('.mainButtons');
if (selectedSection && mainButtons) {
    mainButtons.style.display = 'inline-flex'; // or 'block' if you're stacking vertically
} else {
    mainButtons.style.display = 'none';
}
     // Hide all sukukata-related elements when switching sections
   if (sectionId !== 'sukukata') {
   
       document.getElementById('sukukata-Syllables').style.display = 'none';
       document.getElementById('sukukataOptions').style.display = 'none';
       document.getElementById('sukukataCarousel').style.display = 'none';
       document.getElementById('sukukataGrid').style.display = 'none';
       document.getElementById('sukukataEquation').style.display = 'none';
      
   } else {
       // When switching to the sukukata section, reset its state
       document.getElementById('sukukata-Syllables').style.display = 'grid';
       document.getElementById('sukukataOptions').style.display = 'none';
       document.getElementById('sukukataCarousel').style.display = 'none';
       document.getElementById('sukukataGrid').style.display = 'none';
       document.getElementById('sukukataEquation').style.display = 'none';
       document.getElementById('carouselImage').style.display = 'none';
       document.getElementById('gridImage').style.display = 'none';
       document.getElementById('equationImage').style.display = 'none';
       
      
   }
   if (sectionId !=='sectionGames'){
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('post').style.display = 'none';
    document.getElementById('post2').style.display = 'none';
    document.getElementById('post3').style.display = 'none';
    document.getElementById('post4').style.display = 'none';
    document.getElementById('main-suku-kata').style.display = 'none';
    document.getElementById('bubbleGameContainer').style.display = 'none';

    bgMusic.pause(); // Stop music when leaving sectionGames
    document.getElementById('bgMusicToggle').checked = false;
    localStorage.setItem("bgMusicEnabled", "false");
    bgMusic.currentTime = 0; // Ensure it resets

}else {
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('main-suku-kata').style.display = 'none';
     document.getElementById('bubbleGameContainer').style.display = 'none';
    document.getElementById('post').style.display = 'flex';
    document.getElementById('post2').style.display = 'flex';
     document.getElementById('post3').style.display = 'flex';
     document.getElementById('post4').style.display = 'flex';
     document.getElementById('back-to-menu-container').style.display = 'none';
       // ✅ Auto-check the slider and play music
       document.getElementById('bgMusicToggle').checked = true;
       localStorage.setItem("bgMusicEnabled", "true");

    bgMusic.play(); // Play music if toggle is ON
    
if (currentLetterAudio) {
    currentLetterAudio.pause();
    currentLetterAudio.currentTime = 0;
} 
}
currentSection = sectionId;

}
// ✅ Prevent music from playing unexpectedly if a section is clicked before sectionGames
document.addEventListener("click", function () {
    if (localStorage.getItem("bgMusicEnabled") === "false") {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
}, { once: true }); // Only runs once

// Add ripple effects to both buttons
document.querySelectorAll('.mainContainer[data-fullscreen], #back-to-menu-container').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode === this) {
                this.removeChild(ripple);
            }
        }, 600);
    });
});

function backToMenu() {
    document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    document.querySelector('.main-menu').style.display = 'block';

    // Restore headers
    document.getElementById('secondaryHeader').style.display = 'flex';
    document.getElementById('navbar').style.display = 'block';

    // Hide mainButtons again
    const mainButtons = document.querySelector('.mainButtons');
    if (mainButtons) mainButtons.style.display = 'none';

    // Exit fullscreen
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }

    // Stop music
    bgMusic.pause();
    document.getElementById('bgMusicToggle').checked = false;
    localStorage.setItem("bgMusicEnabled", "false");
    bgMusic.currentTime = 0;
}


//Sukukata
let currentSyllableGroup = null; // Stores the selected syllable group (e.g., 'Ba')
let currentSyllableIndex = 0; // Tracks the current syllable index in the carousel

function showSukukataOptions(suku) {
    console.log(`showSukukataOptions called with: ${suku}`);

    // Hide the sukukata-Syllables grid
    document.getElementById('sukukata-Syllables').style.display = 'none';

    // Show the sukukataOptions
    document.getElementById('sukukataOptions').style.display = 'block';
    document.getElementById('sukukataCarousel').style.display = 'block'; // Hide carousel
    document.getElementById('carouselImage').style.display = 'block'; // Hide carousel
    document.getElementById('sukukataGrid').style.display = 'none'; // Hide grid
    document.getElementById('sukukataEquation').style.display = 'none'; // Hide equation

    // Store the selected syllable group
    currentSyllableGroup = suku;
    console.log(`Selected syllable group: ${currentSyllableGroup}`);

    // Reset the carousel index
    currentSyllableIndex = 0;

    // Update the carousel display with the first syllable of the new group
    updateSyllableDisplay();

    // Update images based on the selected syllable group
    const images = syllableImages[suku];
    if (images) {
        console.log("Updating images:", images); // Debugging: Log the image paths
        document.getElementById('carouselImage').src = images.carousel;
        document.getElementById('gridImage').src = images.grid;
        document.getElementById('equationImage').src = images.equation;
    
    }else {
        console.error("No images found for the selected syllable group:", suku);
        // Clear images if no images are found
        document.getElementById('carouselImage').src = "";
        document.getElementById('gridImage').src = "";
        document.getElementById('equationImage').src = "";
    }


    // Apply colors based on the selected syllable group
    const colors = elementColors[suku];
    if (colors) {
        // Apply colors to grid items
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach(item => {
            item.style.background = colors.grid.background;
            item.style.border = `2px solid ${colors.grid.outline}`;
        });

        // Apply colors to sukukataDisplay
        const syllableDisplay = document.getElementById('sukukataDisplay');
        syllableDisplay.style.background = colors.display.background;
        syllableDisplay.style.color = colors.display.text;

        // Apply colors to dialogs
        const dialogs = document.querySelectorAll('#syllableDialog, #equationDialog');
        dialogs.forEach(dialog => {
            dialog.style.background = colors.dialog.background;
            dialog.style.color = colors.dialog.text;
        });
    }

    // Apply gradient background to the carousel
    const gradient = syllableGradients[suku];
    if (gradient) {
        document.getElementById('sukukata').style.background = gradient;
    }
}


function updateSyllableDisplay() {
          
const syllableDisplay = document.getElementById('sukukataDisplay');
if (currentSyllableGroup && sukuKataKata[currentSyllableGroup]) {
    syllableDisplay.textContent = sukuKataKata[currentSyllableGroup][currentSyllableIndex];
    const colors = elementColors[currentSyllableGroup];
    if (colors) {
        syllableDisplay.style.background = colors.display.background;
        syllableDisplay.style.color = colors.display.text;
    }
    playSyllableSound(sukuKataKata[currentSyllableGroup][currentSyllableIndex]); // Play sound for the current syllable
} else {
    syllableDisplay.textContent = ''; // Clear display if no valid group
    console.error('No syllable group selected or invalid group.');
}
}

function showSukukataCarousel() {


if (!currentSyllableGroup || !sukuKataKata[currentSyllableGroup]) {
    console.error('No syllable group selected or invalid group.');
    return; // Exit the function if no valid group is selected
}

// Hide other sections
document.getElementById('sukukataGrid').style.display = 'none';
document.getElementById('sukukataEquation').style.display = 'none';

// Show the carousel
document.getElementById('sukukataCarousel').style.display = 'block';

document.getElementById('equationImage').style.display = 'none';
document.getElementById('gridImage').style.display = 'none';
document.getElementById('carouselImage').style.display = 'block';



// Reset the carousel index
currentSyllableIndex = 0;

// Update the carousel display with the first syllable
updateSyllableDisplay();
}

function prevSyllable() {
if (!currentSyllableGroup || !sukuKataKata[currentSyllableGroup]) {
    console.error('No syllable group selected or invalid group.');
    return; // Exit the function if no valid group is selected
}

// Move to the previous syllable
currentSyllableIndex = (currentSyllableIndex - 1 + sukuKataKata[currentSyllableGroup].length) % sukuKataKata[currentSyllableGroup].length;
updateSyllableDisplay();


}

function nextSyllable() {
if (!currentSyllableGroup || !sukuKataKata[currentSyllableGroup]) {
    console.error('No syllable group selected or invalid group.');
    return; // Exit the function if no valid group is selected
}

// Move to the next syllable
currentSyllableIndex = (currentSyllableIndex + 1) % sukuKataKata[currentSyllableGroup].length;
updateSyllableDisplay();


}

function showSukukataGrid() {
    stopCurrentAudio();
const sukukataGrid = document.getElementById('sukukataGrid');
sukukataGrid.innerHTML = ''; // Clear previous content

if (!currentSyllableGroup || !sukuKataKata[currentSyllableGroup]) {
    console.error('No syllable group selected.');
    return; // Exit if no valid selection
}

const syllables = sukuKataKata[currentSyllableGroup];
const colors = elementColors[currentSyllableGroup];

syllables.forEach(syllable => {
    const div = document.createElement('div');
    div.className = 'grid-item';
    div.textContent = syllable;
    div.style.background = colors.grid.background; // Apply grid background
    div.style.border = `2px solid ${colors.grid.outline}`; // Apply grid outline

    // Add click event to show the dialog and play sound
    div.onclick = function () {
        showSukukataDialog(syllable);
        getContrastColor();
    };

    sukukataGrid.appendChild(div);
});

// Show the grid section
document.getElementById('sukukataCarousel').style.display = 'none';
document.getElementById('sukukataGrid').style.display = 'grid'; // Ensure the grid container is visible
document.getElementById('sukukataEquation').style.display = 'none';

// Ensure the grid image is visible
document.getElementById('gridImage').style.display = 'block';
document.getElementById('carouselImage').style.display = 'none';
document.getElementById('equationImage').style.display = 'none';
console.log("Grid image path:", document.getElementById('gridImage').src); // Debugging: Log the image path
}

function showSukukataEquation() {
const sukukataEquation = document.getElementById('sukukataEquation');
sukukataEquation.innerHTML = ''; // Clear previous content

if (!currentSyllableGroup || !sukukataTambahan[currentSyllableGroup]) {
    console.error('No syllable group selected.');
    return; // Exit if no valid selection
}

const equations = sukukataTambahan[currentSyllableGroup];
const colors = elementColors[currentSyllableGroup];

equations.forEach(equation => {
    const div = document.createElement('div');
    div.className = 'grid-item';
    div.textContent = equation.answer;
    div.style.background = colors.grid.background; // Apply grid background
    div.style.border = `2px solid ${colors.grid.outline}`; // Apply grid outline

    // Add click event to show the dialog with the full equation
    div.onclick = function () {
      
        showEquationDialog(equation);
        
    };
    

    sukukataEquation.appendChild(div);
});

// Show the equation section
document.getElementById('sukukataCarousel').style.display = 'none';
document.getElementById('sukukataGrid').style.display = 'none';
document.getElementById('sukukataEquation').style.display = 'grid'; // Ensure the equation container is visible

// Ensure the equation image is visible
document.getElementById('equationImage').style.display = 'block';
document.getElementById('gridImage').style.display = 'none';
document.getElementById('carouselImage').style.display = 'none';
console.log("Equation image path:", document.getElementById('equationImage').src); // Debugging: Log the image path
}

function goBackToSukukataMain() {
    // Hide all sub-sections
    document.getElementById('sukukataOptions').style.display = 'none';
    document.getElementById('sukukataCarousel').style.display = 'none';
    document.getElementById('sukukataGrid').style.display = 'none';
    document.getElementById('sukukataEquation').style.display = 'none';
    document.getElementById('carouselImage').style.display = 'none';
    document.getElementById('gridImage').style.display = 'none';
    document.getElementById('equationImage').style.display = 'none';
    
    // Show the main syllables grid again
    document.getElementById('sukukata-Syllables').style.display = 'grid';

    // Optionally reset the gradient or background
    document.getElementById('sukukata').style.background = '';
}

function showSukukataDialog(syllable) {
const dialog = document.getElementById('syllableDialog');
const textElement = document.getElementById('syllableText');


// Set the syllable text
textElement.textContent = syllable.toLowerCase();

// Play syllable sound
playSyllableSound(syllable);

// Apply gradient background to the dialog
const gradient = syllableGradients[currentSyllableGroup];
if (gradient) {
    dialog.style.background = gradient;
}

// Show dialog
dialog.style.display = 'block';

closeDialogSukukata.addEventListener('click', () => {
    dialog.style.display = 'none';
});

// Detect fullscreen and append inside the fullscreen element
    let fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement) {
        fullscreenElement.appendChild(dialog);
    } else {
        document.body.appendChild(dialog);
    }

}

function showEquationDialog(equation) {
    const dialog = document.getElementById('equationDialog');
    const textElement = document.getElementById('equationText');

    // Build an array of syllable spans dynamically
    const syllableSpans = [];

    // Always add the first and second syllables
    if (equation.firstSyllables) {
        syllableSpans.push(`<span class="clickable" data-syllable="${equation.firstSyllables}">${equation.firstSyllables}</span>`);
    }

    if (equation.secondSyllables) {
        syllableSpans.push(`<span class="clickable" data-syllable="${equation.secondSyllables}">${equation.secondSyllables}</span>`);
    }

    // Optionally add third, fourth, and fifth if they exist
    if (equation.thirdSyllables) {
        syllableSpans.push(`<span class="clickable" data-syllable="${equation.thirdSyllables}">${equation.thirdSyllables}</span>`);
    }

    if (equation.fourthSyllables) {
        syllableSpans.push(`<span class="clickable" data-syllable="${equation.fourthSyllables}">${equation.fourthSyllables}</span>`);
    }

    if (equation.fifthSyllables) {
        syllableSpans.push(`<span class="clickable" data-syllable="${equation.fifthSyllables}">${equation.fifthSyllables}</span>`);
    }

    // Create the answer span
    const answerWord = `<span class="clickable" data-word="${equation.answer}">${equation.answer}</span>`;

    // Join the syllables with "+" and display them
    textElement.innerHTML = `${syllableSpans.join(" + ")} = ${answerWord}`;

    // Apply gradient background to the dialog (based on first syllable)
    const baseKey = equation.firstSyllables.charAt(0).toUpperCase() + equation.firstSyllables.slice(1);
    const gradient = syllableGradients[baseKey];
    if (gradient) {
        dialog.style.background = gradient;
    }

    // Show dialog
    dialog.style.display = 'block';

    // Detect fullscreen and append inside the fullscreen element
    let fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement) {
        fullscreenElement.appendChild(dialog);
    } else {
        document.body.appendChild(dialog);
    }
}


function playSyllableSound(syllable) {
    const isEffectsOn = localStorage.getItem("effectsEnabled") === "true";
    if (isEffectsOn) {
        const syllableKey = syllable.charAt(0).toUpperCase() + syllable.slice(1);
        if (syllableSounds[syllableKey]) {
            const audio = unlockedAudio(syllableSounds[syllableKey]);
            audio.play().catch(console.warn);
        } else {
            console.warn(`No sound found for syllable: ${syllable}`);
        }
    }
}







// Close dialog event listener
const closeDialogEquation = document.getElementById('closeDialogEquation');
closeDialogEquation.addEventListener('click', () => {
    const dialog = document.getElementById('equationDialog');
    dialog.style.display = 'none';
});

function getContrastColor(gradient) {
// Extract the dominant color from the gradient (first color in the gradient)
const color = gradient.match(/#[0-9a-fA-F]{6}/)[0];
const hex = color.replace('#', '');
const r = parseInt(hex.substring(0, 2), 16);
const g = parseInt(hex.substring(2, 4), 16);
const b = parseInt(hex.substring(4, 6), 16);

// Calculate luminance
const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

// Return white or black based on luminance
return luminance > 0.5 ? '#000000' : '#ffffff';
}


//Alphabet
function stopCurrentAudio() {
    if (currentLetterAudio) {
        currentLetterAudio.pause();
        currentLetterAudio.currentTime = 0;
        currentLetterAudio = null;
    }
}

function showAlphabetCarousel() {
    stopCurrentAudio(); // Stop any playing sound
    document.getElementById('carousel').style.display = 'flex';
    document.getElementById('alphabetGrid').style.display = 'none';
}

function prevAlphabet() {
    currentAlphabetIndex = (currentAlphabetIndex - 1 + alphabet.length) % alphabet.length;
    updateAlphabetDisplay(); // ✅ This already calls playLetterSound()
}


function nextAlphabet() {
    currentAlphabetIndex = (currentAlphabetIndex + 1) % alphabet.length;
    updateAlphabetDisplay(); // ✅ This already calls playLetterSound()
}


function showAlphabetGrid() {
    stopCurrentAudio();
    if (!isAlphabetGridLoaded) {
        const alphabetGrid = document.getElementById('alphabetGrid');
        alphabetGrid.innerHTML = ''; // Clear previous content
        alphabet.forEach(letter => {
            const div = document.createElement('div');
            div.className = 'grid-item';

            // Get a random emoji or image
            const [content, word] = getRandomEmoji(letter);
            if (typeof content === 'string' && (content.endsWith('.png') || content.endsWith('.jpg'))) {
                div.innerHTML = `<img src="${content}" alt="${word}" width="60" draggable="false"><br>${letter}`;
            } else {
                div.innerHTML = `<span class="emoji">${content}</span><br>${letter}`;
            }

            div.addEventListener('click', () => {
                showDialogWithAnimation(letter, letter.toLowerCase(), content);
                playLetterSound(letter);
            });

            alphabetGrid.appendChild(div);
        });
        isAlphabetGridLoaded = true;
    }
    document.getElementById('alphabetGrid').style.display = 'grid';
    document.getElementById('carousel').style.display = 'none';
}
function updateAlphabetDisplay() {
    const currentLetter = alphabet[currentAlphabetIndex];

    // Update the displayed letter
    alphabetDisplay.textContent = currentLetter;

    // Get a random emoji or image for the current letter
    const emojiContainer = document.getElementById('emojiDisplay');
    if (indonesianEmojis[currentLetter] && indonesianEmojis[currentLetter].length > 0) {
        const randomIndex = Math.floor(Math.random() * indonesianEmojis[currentLetter].length);
        const [content, word] = indonesianEmojis[currentLetter][randomIndex];

        // Check if content is an image path (e.g., ends with .png or .jpg)
        if (typeof content === 'string' && (content.endsWith('.png') || content.endsWith('.jpg') || content.endsWith('.jpeg'))) {
            emojiContainer.innerHTML = `<img src="${content}" alt="${word}" width="80" draggable="false"><br><span>${word}</span>`;
        } else {
            emojiContainer.innerHTML = `<span class="emoji">${content}</span><br><span>${word}</span>`;
        }
    } else {
        emojiContainer.innerHTML = ''; // Clear if no emoji or image found
    }

    // Play sound for the current letter
    playLetterSound(currentLetter);
}

if (typeof content === 'string' && (content.endsWith('.png') || content.endsWith('.jpg'))) {
    console.log('Image path:', content); // <-- Debug log
    emojiContainer.innerHTML = `<img src="${content}" alt="${word}" width="80" draggable="false"><br><span>${word}</span>`;
}
  

//Vokals

function showVokalCarousel() {
    stopCurrentAudio(); // Stop any playing sound
    document.getElementById('vokalCarousel').style.display = 'block';
    document.getElementById('vokalGrid').style.display = 'none';
}
       

      let currentVokalIndex = 0;
    

    function prevVokal() {
        currentVokalIndex = (currentVokalIndex - 1 + vokals.length) % vokals.length;
        updateVokalDisplay();

          // Play sound for the current letter
const currentLetter = vokals[currentVokalIndex];
playLetterSound(currentLetter);
      
    }

    function nextVokal() {
        currentVokalIndex = (currentVokalIndex + 1) % vokals.length;
        updateVokalDisplay();

          // Play sound for the current letter
const currentLetter = vokals[currentVokalIndex];
playLetterSound(currentLetter);

    }

    function updateVokalDisplay() {
        const vokalDisplay = document.getElementById('vokalDisplay');
        vokalDisplay.textContent = vokals[currentVokalIndex];
    }



function showVokalGrid() {
if (!isVokalGridLoaded) {
    const vokalGrid = document.getElementById('vokalGrid');
    
    vokalGrid.innerHTML = ''; // Clear previous content
    vokals.forEach(vokal => {
        const div = document.createElement('div');
        div.className = 'grid-item';
        const [emoji] = getRandomEmoji(vokal);
        div.innerHTML = `<span class="emoji">${emoji}</span><br> ${vokal}`;
        div.addEventListener('click', () => showDialogWithAnimation(vokal, vokal.toLowerCase(), emoji));
        vokalGrid.appendChild(div);
    });
    isVokalGridLoaded = true;
}
document.getElementById('vokalGrid').style.display = 'grid';
document.getElementById('vokalCarousel').style.display = 'none';

}


//dialogs for Alphabet and vokal

const animations = ['bounce', 'zoom-in', 'zoom-out', 'shake','left', 'top', 'right','fade-in','fade-out'];

function getRandomEmoji(letter) {
const emojis = indonesianEmojis[letter] || [['❓', 'Tidak diketahui']];
return emojis[Math.floor(Math.random() * emojis.length)];
}

function getRandomAnimation() {
return animations[Math.floor(Math.random() * animations.length)];
}



function showDialogWithAnimation(upper, lower, emoji) {
const emojiData = indonesianEmojis[upper].find(e => e[0] === emoji) || [emoji, 'Tidak diketahui'];
const [emojiChar, emojiName] = emojiData;
const letterAnimation = 'zoom-in';
const randomEmojiAnimation = getRandomAnimation();

dialogContent.innerHTML = `<div class='large-letter ${letterAnimation}'>${upper}${lower}</div>
                           <div class='emoji ${randomEmojiAnimation}'>${emojiChar}<br><span class='emoji-name'>${emojiName}</span></div>`;
overlay.style.display = 'block';
dialog.style.display = 'block';
animateDialog();

// Play sound for the clicked letter
playLetterSound(upper);
// Detect fullscreen and append inside the fullscreen element
    let fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement) {
        fullscreenElement.appendChild(dialog);
    } else {
        document.body.appendChild(dialog);
    }

}
let currentLetterAudio = null; // Track currently playing audio




function playLetterSound(letter) {
    try {
        const isEffectsOn = localStorage.getItem("effectsEnabled") === "true";
        if (!isEffectsOn) return;

        const upperCaseLetter = letter.toUpperCase();
        const audioPath = `assets/audio/${upperCaseLetter}.mp3`;

        // Stop any currently playing letter sound
        if (currentLetterAudio) {
            currentLetterAudio.pause();
            currentLetterAudio.currentTime = 0;
        }

        currentLetterAudio = unlockedAudio(audioPath);
        currentLetterAudio.play().catch(err => console.warn(`Audio play error: ${err.message}`));

    } catch (err) {
        console.error("Error in playLetterSound:", err);
    }
}


function animateDialog() {
const letters = document.querySelector('.large-letter');
const emoji = document.querySelector('.emoji');

const randomAnimation = getRandomAnimation();
letters.style.animation = `fade-in 1s infinite`;
emoji.style.animation = `${randomAnimation} 1.5s infinite`;
}


closeDialog.addEventListener('click', () => {
    overlay.style.display = 'none';
    dialog.style.display = 'none';
});

overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
    dialog.style.display = 'none';
});

// Display balloons with floating animations
function displayBalloons() {
    const balloonContainer = document.getElementById("balloon-container");
    balloonContainer.style.display = "block";
    balloonContainer.innerHTML = "";

    for (let i = 0; i < 10; i++) { // Adjust number of balloons as needed
        const balloon = document.createElement("div");
        balloon.classList.add("balloon");

        // Randomize horizontal position for natural effect
        balloon.style.left = `${Math.random() * 10 + 40}%`; // Range between 10%-90% width

        // Randomly assign animation type and duration for variety
        const animations = ["floatUp", "floatUpLeft", "floatUpRight", "floatUpSlow", "floatUpFast"];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        const duration = `${Math.random() * 5 + 7}s`; // Random duration between 7s and 12s

        balloon.style.animationName = randomAnimation;
        balloon.style.animationDuration = duration;
        balloon.style.animationDelay = `${Math.random() * 2}s`; // Random delay for staggered start

        balloonContainer.appendChild(balloon);

        // Add pop effect on click
        balloon.onclick = () => {
            balloon.classList.add("pop");
            document.getElementById("pop-sound").play();
            setTimeout(() => balloon.remove(), 300); // Remove balloon after pop effect
        };
        
    }
    setTimeout(() => {
        document.getElementById("popup-button").classList.add("show");
    }, 4000); // Adjust this delay to match balloon display duration

}

//matching game
  

const gameContainer = document.getElementById("matchingGame");
const levelTitle = document.getElementById("levelTitle");


let cardPairs = 5; // Start with 5 pairs (10 cards)

function generateCards() {
 
    initializeMatchingGame();
    gameContainer.innerHTML = "";
    let selectedPairs = [];
    let lettersUsed = new Set();

     // Set card pairs based on level
    if (currentLevel === 3) {
        cardPairs = 10; // 20 cards (10 pairs)
    } else if (currentLevel === 4) {
        cardPairs = 12; // 24 cards (12 pairs)
    } else if (currentLevel === 5) {
        cardPairs = 14; // 28 cards (14 pairs)
    } else {
        cardPairs = 5 + (currentLevel * 2); // Default progression for other levels
    }

    // Set class based on level
    gameContainer.className = "game-board";
    if (currentLevel <= 2) {
        gameContainer.classList.add("level-1-2");
    } else if (currentLevel === 3) {
        gameContainer.classList.add("level-3");
    } else {
        gameContainer.classList.add("level-4-5");
    }

    while (selectedPairs.length < cardPairs * 2) {
        const letters = Object.keys(indonesianEmojis);
        let letter = letters[Math.floor(Math.random() * letters.length)];

        if (!indonesianEmojis[letter] || lettersUsed.has(letter)) continue;

        let items = indonesianEmojis[letter];
        let randomItem = items[Math.floor(Math.random() * items.length)];

        // Create display content
        let displayContent;
        if (randomItem[0].includes('<img')) {
            displayContent = document.createElement('div');
            displayContent.className = 'image-content';
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = randomItem[0];
            
            while (tempDiv.firstChild) {
                displayContent.appendChild(tempDiv.firstChild);
            }
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'emoji-name';
            nameSpan.textContent = randomItem[1];
            displayContent.appendChild(nameSpan);
        } else {
            displayContent = document.createElement('div');
            displayContent.className = 'emoji-content';
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'emoji-symbol';
            emojiSpan.textContent = randomItem[0];
            displayContent.appendChild(emojiSpan);
            const nameSpan = document.createElement('span');
            nameSpan.className = 'emoji-name';
            nameSpan.textContent = randomItem[1];
            displayContent.appendChild(nameSpan);
        }

        if (currentLevel % 2 === 1) {
            selectedPairs.push([letter, randomItem[1]]);
            selectedPairs.push([displayContent, randomItem[1]]);
        } else {
            selectedPairs.push([letter, randomItem[1]]);
            selectedPairs.push([letter.toLowerCase(), randomItem[1]]);
        }

        lettersUsed.add(letter);
    }

    totalCards = selectedPairs.length;
    matchedPairs = 0;
    selectedPairs.sort(() => Math.random() - 0.5);

    // Calculate rows and columns based on level
    let rows, columns;
    if (currentLevel <= 2) {
        rows = 2;
    } else if (currentLevel === 3) {
        rows = 3;
    } else {
        rows = 4; // Levels 4-5 will have 4 rows
    }
    columns = Math.ceil(totalCards / rows);

    // Apply grid layout
    gameContainer.style.gridTemplateColumns = `repeat(${columns}, minmax(50px, .5fr))`;
    gameContainer.style.gridTemplateRows = `repeat(${rows}, minmax(70px, .5fr))`;

    // Create cards
    selectedPairs.forEach(([value, match]) => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.dataset.match = match;
        
        let cardInner = document.createElement("div");
        cardInner.classList.add("card-inner");
        
        let cardFront = document.createElement("div");
        cardFront.classList.add("card-front");
        cardFront.textContent = "?";
        
        let cardBack = document.createElement("div");
        cardBack.classList.add("card-back");
        
        if (value instanceof HTMLElement) {
            cardBack.appendChild(value.cloneNode(true));
        } else {
            const letterDisplay = document.createElement('div');
            letterDisplay.className = 'letter-display';
            letterDisplay.textContent = value;
            cardBack.appendChild(letterDisplay);
        }
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        card.addEventListener("click", flipCard);
        gameContainer.appendChild(card);
    });
}
let flippedCards = [];
function flipCard() {
    if (flippedCards.length >= 2 || this.classList.contains("flipped") || this.classList.contains("matched")) return;

    this.classList.add("flipped");
    flippedCards.push(this);

    // Check if it's a letter card or emoji card
    const cardBack = this.querySelector('.card-back');
    const isLetterCard = cardBack.querySelector('.letter-display'); // Letter cards have this class
    const isEmojiCard = cardBack.querySelector('.emoji-content') || cardBack.querySelector('.image-content'); // Emoji cards have these

    // Play appropriate sound
    setTimeout(() => {
        if (isLetterCard) {
            // Play letter sound (original behavior)
            const letter = cardBack.textContent.trim()[0].toLowerCase();
            if (letter) playLetterSound(letter);
        } 
        else if (isEmojiCard) {
            // Play word sound (new behavior)
            const word = this.dataset.match;
            if (word) playWordSound(word);
        }
    }, 200);

    if (flippedCards.length === 2) setTimeout(checkMatch, 500);
}

function checkMatch() {
    let [card1, card2] = flippedCards;
    const isMatch = card1.dataset.match === card2.dataset.match && card1 !== card2;

    if (isMatch) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchedPairs++;
        
        if (matchedPairs === cardPairs) {
            confetti();
            setTimeout(showLevelCompletePopup, 2000);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
        }, 1000);
    }
    flippedCards = [];
}

async function playWordSound(word) {
  const isEffectsOn = localStorage.getItem("effectsEnabled") === "true";
  if (!isEffectsOn) return;

  const subject = (selectedSubject || "countries").toLowerCase();
  const normalizedWord = word.toLowerCase();
  const audioPath = `assets/audio/${subject}/${normalizedWord}.mp3`;
  const fallbackPath = `assets/audio/${normalizedWord}.mp3`;

  try {
    // Check if the subject-specific audio exists
    const res = await fetch(audioPath);
    const pathToPlay = res.ok ? audioPath : fallbackPath;

    const audioRes = await fetch(pathToPlay);
    if (!audioRes.ok) throw new Error("Audio file not found");

    const audio = unlockedAudio(pathToPlay);
    await audio.play().catch(() => console.warn(`Couldn't play: ${pathToPlay}`));
  } catch (err) {
    console.warn(`Audio missing for "${word}", using fallback or skipping.`);
  }
}


function showLevelCompletePopup() {
    // Remove existing popup if it exists
    let existingPopup = document.getElementById("popup-modal");
    if (existingPopup) existingPopup.remove();

    // Different images for each level
    const levelImages = {
        1: '/assets/img/squirel/squirelboy.png',
        2: '/assets/img/squirel/squirelboybagus.png',
        3: '/assets/img/squirel/squirelgirl1.png',
        4: '/assets/img/squirel/squirelboyHebat.png',
        5: '/assets/img/squirel/squirelgirljuara.png'
    };
    
    // Create popup structure
    const popup = document.createElement("div");
    popup.id = "popup-modal";
    popup.className = "popup show";
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-image-container">
                <img data-src="${levelImages[currentLevel]}" alt="Level ${currentLevel} Complete" class="lazy">
            </div>
            <h3>Level ${currentLevel} Complete!</h3>
            <p>Great job! What would you like to do next?</p>
            <div class="popup-buttons">
                <button id="restartLevelButton">Repeat Level</button>
                <button id="nextLevelButton">Next Level</button>
            </div>
        </div>
    `;

    // Append to DOM first
    let fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement) {
        fullscreenElement.appendChild(popup);
    } else {
        document.body.appendChild(popup);
    }

    // Manually trigger lazy load after DOM insertion
    const lazyImage = popup.querySelector('.lazy');
    if (lazyImage) {
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.onload = () => {
            lazyImage.style.opacity = 1;
        };
        lazyImage.style.transition = 'opacity 0.3s';
        lazyImage.style.opacity = 0;
    }

    // Add event listeners
    document.getElementById("restartLevelButton").addEventListener("click", restartLevel);
    document.getElementById("nextLevelButton").addEventListener("click", nextLevel);
}


function restartLevel() {
    closePopup();
    generateCards(); // Regenerate the same level
}


function nextLevel() {
    closePopup();
    currentLevel++;
    cardPairs += 2;
    if (currentLevel === 2) {
        levelTitle.textContent = `Level ${currentLevel}: Cocokkan Huruf Besar & Huruf Kecil`;
    } else if (currentLevel >= 3) {
        levelTitle.textContent = `Level ${currentLevel}: Cocokkan Huruf, Emoji & Nama`;
    }
    generateCards();
}
function resetGame() {
    closePopup();
    currentLevel = 1;
    cardPairs = 5;
    levelTitle.textContent = `Level ${currentLevel}: Cocokkan Huruf & Emoji`;
    balloonContainer.style.display = "none";
    generateCards();
}
function closePopup() {
    const popup = document.querySelector(".popup");
    if (popup) popup.remove();
    balloonContainer.style.display = "none";
}

document.addEventListener("DOMContentLoaded", generateCards);

function showMatchingGame(){
    stopCurrentAudio();
    resetGame();
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById("bubbleGameContainer").style.display = 'none';
    document.getElementById('post').style.display = 'none';
    document.getElementById('post2').style.display = 'none';
    document.getElementById('post3').style.display = 'none';
    document.getElementById('post4').style.display = 'none'; 
    document.getElementById('main-suku-kata').style.display='none';
      document.getElementById('secondaryHeader').style.display='none';
    document.getElementById('back-to-menu-container').style.display = 'block';
    document.getElementById('navbar').style.display = 'none';

 }

window.addEventListener('resize', function() {
    if (currentLevel >= 4) {
        generateCards(); // Redraw cards on resize for levels 4-5
    }
});


// main suku kata

// Global variables
let popupTimeout;
let draggingElement = null;
let touchStartTime = 0;
let touchStartX = 0;
let touchStartY = 0;
let activeDropTarget = null;
let isDragging = false; 
let mirrorEl = null; // For the ghost preview


// Initialize drag system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for drag operations
    const style = document.createElement('style');
    style.textContent = `
        .syllable.dragging {
            opacity: 0.5;
        }
        .drop-box.highlight {
            background-color: rgba(100, 200, 100, 0.3);
            border: 2px dashed #4CAF50;
        }
    `;
    document.head.appendChild(style);
});
  
  function selectLevel(level) {
    currentLevel = level;
    selectedQuestions = selectRandomQuestions(level === 1 ? level1Questions : level2Questions, 10);
    currentQuestionIndex = 0;
    document.getElementById("level-selection").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    loadQuestion();
}

function selectLevelHome() {
    balloonContainer.classList.add("balloon-hidden");
    balloonContainer.innerHTML = "";
    popupModal.classList.remove("show");
    document.getElementById("level-selection").style.display = "block";
    document.getElementById("game-container").style.display = "none";
}

function selectRandomQuestions(questions, count) {
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Handle level selection
document.querySelectorAll(".level-btn").forEach((btn) =>
    btn.addEventListener("pointerdown", function() {
        selectLevel(parseInt(this.dataset.level));
    })
);
  

  // Update hint image with fade effect
// Improved loadQuestion for WebView compatibility
function loadQuestion() {
    if (!selectedQuestions[currentQuestionIndex]) return;
    
    const question = selectedQuestions[currentQuestionIndex];
    syllableBank = shuffleArray([...question.syllables]);
    dropBoxes = new Array(syllableBank.length).fill("");
    placedSyllables = new Array(syllableBank.length).fill(false);

    const syllableBankEl = document.getElementById("syllable-bank");
    const dropAreaEl = document.getElementById("drop-area");
    const hintImageEl = document.getElementById("hint-image");

    if (!syllableBankEl || !dropAreaEl || !hintImageEl) return;

    // Clear previous elements
    syllableBankEl.innerHTML = "";
    dropAreaEl.innerHTML = "";
    hintImageEl.innerHTML = "";

    // Update progress
    if (progressTracker) {
        progressTracker.textContent = `${currentQuestionIndex + 1}/${selectedQuestions.length}`;
    }


    // Load hint image
    const hintImage = document.createElement("img");
    hintImage.src = question.dataSrc;
    hintImage.alt = `${question.word} image`;
    hintImage.className = "hint-image";
    hintImage.style.opacity = "0";
    
    hintImage.onload = () => {
        hintImage.style.transition = "opacity 0.5s";
        hintImage.style.opacity = "1";
    };
    hintImageEl.appendChild(hintImage);
        lazyLoadImages(); // Ensure lazy loading is triggered

    // Create syllable elements with enhanced mobile handling
    syllableBank.forEach((syllable, index) => {
        const syllableEl = document.createElement("div");
        syllableEl.className = "syllable";
        syllableEl.textContent = syllable;
        syllableEl.dataset.index = index;
        
        // Make element draggable for desktop
        syllableEl.draggable = true;
        
        // Desktop drag events
        syllableEl.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData("text", index);
            e.target.classList.add('dragging');
        });
        
        syllableEl.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            isDragging = false; 
        });
        
       // Mobile touch events
        syllableEl.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            touchStartTime = Date.now();
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            draggingElement = null;
            isDragging = false;
            e.preventDefault();
            // ✅ Create mirror clone for mobile
            if (mirrorEl) mirrorEl.remove();
            mirrorEl = e.target.cloneNode(true);
            mirrorEl.style.position = "fixed";
            mirrorEl.style.left = `${touch.clientX}px`;
            mirrorEl.style.top = `${touch.clientY}px`;
            mirrorEl.style.transform = "translate(-50%, -50%) scale(1.2)";
            mirrorEl.style.opacity = "0.8";
            mirrorEl.style.pointerEvents = "none";
            mirrorEl.style.zIndex = "9999";
            mirrorEl.classList.add("mirror-drag");
            // ✅ Append the mirror inside the current fullscreen element or fallback to body
            const fullscreenEl = document.fullscreenElement || document.body;
            fullscreenEl.appendChild(mirrorEl);

        }, { passive: false });
        
        
        syllableEl.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const moveX = touch.clientX - touchStartX;
            const moveY = touch.clientY - touchStartY;
            
            // Start drag if movement exceeds threshold
            if (Math.abs(moveX) > 10 || Math.abs(moveY) > 10) {
                draggingElement = index;
                isDragging = true;
                e.target.classList.add('dragging');
                
                // Update drop target highlighting
                const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
                const dropBox = elementUnderTouch?.closest('.drop-box');
                
                // Clear previous highlights
                document.querySelectorAll('.drop-box.highlight').forEach(box => {
                    if (box !== dropBox) box.classList.remove('highlight');
                });
                
                // Highlight current drop target
                if (dropBox) {
                    dropBox.classList.add('highlight');
                    activeDropTarget = dropBox;
                } else {
                    activeDropTarget = null;
                }
            }
            // ✅ Move mirror element along with touch
if (mirrorEl) {
  mirrorEl.style.left = `${touch.clientX}px`;
  mirrorEl.style.top = `${touch.clientY}px`;
}

            e.preventDefault();
        }, { passive: false });
        
          syllableEl.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            const elapsed = Date.now() - touchStartTime;
            
            // Handle drop if we were dragging
            if (isDragging && activeDropTarget) {
                const dropBoxIndex = parseInt(activeDropTarget.dataset.index);
                handleDropAction(dropBoxIndex, draggingElement);
            } 
            else if (elapsed < 200 && !isDragging) {
                toggleClicked.call(e.target, e);
            }
            
            // Clean up
            e.target.classList.remove('dragging');
            document.querySelectorAll('.drop-box.highlight').forEach(box => {
                box.classList.remove('highlight');
            });
            draggingElement = null;
            activeDropTarget = null;
            isDragging = false;
            // Remove ghost preview (mirror element)
if (mirrorEl) {
  mirrorEl.style.transition = "opacity 0.2s";
  mirrorEl.style.opacity = "0";
  setTimeout(() => {
    mirrorEl.remove();
    mirrorEl = null;
  }, 200);
}


            e.preventDefault();
        }, { passive: false });
        
        // Click handling for desktop
       syllableEl.addEventListener('click', function(e) {
            if (!isDragging) {
                toggleClicked(e);
            }
        });
        
        
        syllableBankEl.appendChild(syllableEl);
    });

    // Create drop areas with mobile support
    dropBoxes.forEach((_, index) => {
        const dropBox = document.createElement("div");
        dropBox.className = "drop-box";
        dropBox.dataset.index = index;
        
        // Desktop drop events
        dropBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.target.classList.add('highlight');
        });
        
        dropBox.addEventListener('dragleave', (e) => {
            e.target.classList.remove('highlight');
        });
        
        dropBox.addEventListener('drop', (e) => {
            e.preventDefault();
            e.target.classList.remove('highlight');
            const syllableIndex = e.dataTransfer.getData("text");
            handleDropAction(index, syllableIndex);
        });
        
        dropAreaEl.appendChild(dropBox);

        // Add operator between boxes
        if (index < dropBoxes.length - 1) {
            const plusSign = document.createElement("span");
            plusSign.className = "plus-sign";
            plusSign.textContent = "+";
            dropAreaEl.appendChild(plusSign);
        } else {
            const equalsSign = document.createElement("span");
            equalsSign.className = "equals-sign";
            equalsSign.textContent = "=";
            dropAreaEl.appendChild(equalsSign);
        }
    });

    // Answer container
    const answerContainer = document.createElement("div");
    answerContainer.id = "answer-container";
    answerContainer.className = "answer-container";
    dropAreaEl.appendChild(answerContainer);
}


// Fixed toggleClicked function
function toggleClicked(e) {
    if (e) e.preventDefault();
    
    // Remove all 'clicked' classes
    document.querySelectorAll(".syllable.clicked").forEach(el => {
        el.classList.remove("clicked");
    });
    
    // Add to current element if not already clicked
    if (!this.classList.contains("clicked")) {
        this.classList.add("clicked");
    }
}
// Unified drop handling
function handleDropAction(dropBoxIndex, syllableIndex) {
    const question = selectedQuestions[currentQuestionIndex];
    
    if (!question || !question.syllables) return;

    if (syllableBank[syllableIndex] === question.syllables[dropBoxIndex] && !placedSyllables[dropBoxIndex]) {
        dropBoxes[dropBoxIndex] = syllableBank[syllableIndex];
        
        const dropBoxesEl = document.querySelectorAll(".drop-box");
        if (dropBoxesEl[dropBoxIndex]) {
            dropBoxesEl[dropBoxIndex].textContent = dropBoxes[dropBoxIndex];
        }
        
        placedSyllables[dropBoxIndex] = true;
        
        const syllableEls = document.querySelectorAll(".syllable");
        if (syllableEls[syllableIndex]) {
            syllableEls[syllableIndex].classList.add("hidden");
        }
        
        const answerContainer = document.getElementById("answer-container");
        if (answerContainer) {
            answerContainer.textContent = dropBoxes.join("");
        }
        
        playSyllableSound(dropBoxes[dropBoxIndex]);
        
      // Check if all syllables placed
if (dropBoxes.every(syllable => syllable !== "")) {
    setTimeout(() => {
        if (correctSound) correctSound.play();
        
        // Play the word sound when answer is complete
        const question = selectedQuestions[currentQuestionIndex];
        if (question && question.word) {
            playWordSound(question.word);
        }
        
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < selectedQuestions.length) {
                loadQuestion();
            } else {
                endGame();
            }
        }, 2000); // Increased delay to hear the word sound
    }, 500);
}
    } else {
        showPopup("Coba lagi!", "error");
        if (errorSound) errorSound.play();
    }
}


document.addEventListener("fullscreenchange", () => {
    let popup = document.getElementById("popup-modal");
    let balloonContainer = document.getElementById("balloon-container");
    let confettiContainer = document.getElementById("confettiContainer");

    const container = document.fullscreenElement || document.body;

    if (popup && !container.contains(popup)) {
        container.appendChild(popup);
    }

    if (balloonContainer && !container.contains(balloonContainer)) {
        container.appendChild(balloonContainer);
    }

    if (confettiContainer && !container.contains(confettiContainer)) {
        container.appendChild(confettiContainer);
    }

    console.log("Fullscreen mode changed, popups repositioned!");
});






// Show popup for feedback
function showPopup(message, type) {
    popupContent.className = `popup-message ${type}`;
    popupContent.textContent = message;
    popupModal.classList.add("show");

       if (popupTimeout) clearTimeout(popupTimeout);
    setTimeout(() => {
        popupModal.classList.remove("show");
    }, 2000);

}

// End game function
function endGame() {
    showPopup("Pintar!", "success");
    successSound.play();

    setTimeout(displayBalloons, 500);
    document.getElementById("game-container").style.opacity = "1"; 
    
}




// Lazy load images with IntersectionObserver
function lazyLoadImages() {
    const images = document.querySelectorAll("img[data-src]");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // Load the image
                observer.unobserve(img); // Stop observing this image
            }
        });
    });

    images.forEach(img => observer.observe(img));
}

// Ensure this function is called after images are added to the DOM
lazyLoadImages();

// Reset the game for replay
function restartGame() {
    balloonContainer.classList.add("balloon-hidden");
    balloonContainer.innerHTML = "";
    popupModal.classList.remove("show");
    selectLevelHome();
    const popupButton = document.getElementById("popup-button");
    popupButton.classList.remove("show"); 
}

// Shuffle array for syllable bank
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function toggleClicked(e) {
  e.preventDefault();
  const isAlreadyClicked = this.classList.contains("clicked");

  // Remove all 'clicked' classes
  document.querySelectorAll(".syllable").forEach((el) => el.classList.remove("clicked"));

  // Reapply only if it wasn't already selected
  if (!isAlreadyClicked) {
    this.classList.add("clicked");
  }
}

function handleGameBack() {
 // Stop all intervals and audios
    stopCurrentAudio(); // if you have this
    clearInterval(timerId); // important for fill-in-the-blanks

    // Reset fill-in-the-blanks game state if needed
    filled = {};
    selIdx = null;
    time = 0;
    // Exit fullscreen if active
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
    
    // Clear any popups
    const popupModal = document.getElementById('popup-modal');
    if (popupModal) popupModal.remove();
    
    // Hide balloons if any
    const balloonContainer = document.getElementById('balloon-container');
    if (balloonContainer) {
        balloonContainer.style.display = 'none';
        balloonContainer.innerHTML = '';
    }
    
      // Matching Game Reset
    if (document.getElementById('gameContainer').style.display === 'block') {
        document.getElementById('gameContainer').style.display = 'none';
        document.getElementById('matchingGame').innerHTML = '';
        document.getElementById('levelTitle').textContent = 'Level 1: Match Emojis & Words';
        if (typeof resetMatchingGame === 'function') resetMatchingGame();
    }
     // Syllable Game Reset
    if (document.getElementById('main-suku-kata').style.display === 'block') {
        document.getElementById('main-suku-kata').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('hint-image').innerHTML = '';
        document.getElementById('syllable-bank').innerHTML = '';
        document.getElementById('drop-area').innerHTML = '';
        document.getElementById('level-selection').style.display = 'block';
   
        if (typeof restartGame === 'function') restartGame();
    }
    // Bubble Game Reset
    if (document.getElementById('bubbleGameContainer').style.display === 'block') {
        document.getElementById('bubbleGameContainer').style.display = 'none';
        const canvas = document.getElementById('bubbleCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (window.bubbleGameLoop) cancelAnimationFrame(window.bubbleGameLoop);
    }
    // Fill in the Blanks Game Reset
    if (document.getElementById('fillBlanksGameContainer').style.display === 'block') {
        document.getElementById('fillBlanksGameContainer').style.display = 'none';
        clearInterval(timerId);
        timerId = null;
        time = 0;
        filled = {};
        selIdx = null;
        qs = [];
        idx = 0;
        score = 0;

        document.getElementById('letterChoices').innerHTML = '';
        document.getElementById('wordWithBlanks').innerHTML = '';
        document.getElementById('fillBlanksImage').src = '';
        document.getElementById('fillBlanksProgress').textContent = '';
        document.getElementById('fillBlanksFeedback').textContent = '';
        document.getElementById('fillBlanksTimer').textContent = '';
        document.getElementById('fillBlanksSubmit').style.display = 'none';
        document.getElementById('fillBlanksSubmit').disabled = false;
        document.getElementById('nextFillBlanksQuestion').style.display = 'none';
        document.getElementById('fillBlanksEndModal').style.display = 'none';
    }
    
    // Show the main menu
    showSection('sectionGames');
}

function resetMatchingGame() {
    currentLevel = 1;
    cardPairs = 5;
    levelTitle.textContent = `Level ${currentLevel}: Cocokkan Huruf & Emoji`;
    flippedCards = [];
    matchedPairs = 0;
}

// Make sure this is called when the game loads
function initializeMatchingGame() {
    // Existing matching game initialization code...
    
    // Add back button listener
    const backButton = document.getElementById('goback');
    if (backButton) {
        backButton.addEventListener('click', handleGameBack);
    }
}

// Add this at the bottom of your JavaScript file
document.addEventListener('click', function(event) {
    if (event.target.id === 'goback' || event.target.closest('#goback')) {
        handleGameBack();
    }
});


function showSukukataGame(){
    stopCurrentAudio();
    restartGame();
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById("bubbleGameContainer").style.display = 'none';
    document.getElementById('post').style.display = 'none';
    document.getElementById('post2').style.display = 'none';
    document.getElementById('post3').style.display = 'none';
     document.getElementById('post4').style.display = 'none'; 

    document.getElementById('main-suku-kata').style.display='block';
     document.getElementById('secondaryHeader').style.display='none';
    document.getElementById('back-to-menu-container').style.display = 'block';
    document.getElementById('navbar').style.display = 'none';
}

// Enhanced fullscreen functionality for all buttons
function toggleFullscreen(button) {
    const targetId = button.getAttribute('data-fullscreen');
    const targetElement = document.getElementById(targetId);
    const icon = button.querySelector('.fullscreen-icon') || button;

    if (!targetElement) return;

    const isFullscreen = 
        document.fullscreenElement === targetElement ||
        document.webkitFullscreenElement === targetElement ||
        document.msFullscreenElement === targetElement;

    if (isFullscreen) {
        // Exit fullscreen
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        
        // Change icon back to fullscreen
        if (icon) icon.textContent = '🔲';
    } else {
        // Enter fullscreen
        if (targetElement.requestFullscreen) targetElement.requestFullscreen();
        else if (targetElement.webkitRequestFullscreen) targetElement.webkitRequestFullscreen();
        else if (targetElement.msRequestFullscreen) targetElement.msRequestFullscreen();
        
        // Change icon to exit fullscreen
        if (icon) icon.textContent = '❐';
    }
}

// Update all fullscreen icons with better visual feedback
function updateFullscreenIcons() {
    const fullscreenElement = 
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement;

    document.querySelectorAll('[data-fullscreen]').forEach(button => {
        const targetId = button.getAttribute('data-fullscreen');
        const icon = button.querySelector('.fullscreen-icon') || button;
        const isTargetFullscreen = fullscreenElement?.id === targetId;

        if (icon) {
            icon.textContent = isTargetFullscreen ? '❐' : '🔲';
            button.style.animation = isTargetFullscreen ? 'none' : 'pulse-glow 2s infinite, bounce-gentle 3s infinite';
        }
    });
}

// Add click handler with ripple effect to all fullscreen buttons
document.querySelectorAll('[data-fullscreen]').forEach(button => {
    button.addEventListener('click', function(e) {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode === this) {
                this.removeChild(ripple);
            }
        }, 600);
        
        toggleFullscreen(button);
    });
});

// Add ripple effect to back buttons as well
document.querySelectorAll('.back-to-menu-container').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode === this) {
                this.removeChild(ripple);
            }
        }, 600);
    });
});

// Enhanced event listeners for fullscreen changes
document.addEventListener('fullscreenchange', updateFullscreenIcons);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcons);
document.addEventListener('msfullscreenchange', updateFullscreenIcons);

// Initialize all fullscreen buttons on page load
document.addEventListener('DOMContentLoaded', function() {
    updateFullscreenIcons();
    
    // Add specific styling based on section
    const sections = ['vokal', 'sukukata', 'sectionGames'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const fullscreenBtn = section.querySelector('[data-fullscreen]');
            if (fullscreenBtn) {
                // Add specific class for section-based styling
                fullscreenBtn.classList.add(`fullscreen-${sectionId}`);
            }
        }
    });
});

// Handle escape key to exit fullscreen
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        updateFullscreenIcons();
    }
});

// Enhanced event listeners for fullscreen changes
document.addEventListener('fullscreenchange', updateFullscreenIcons);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcons);
document.addEventListener('msfullscreenchange', updateFullscreenIcons);

// Add click handler with ripple effect
document.querySelectorAll('[data-fullscreen]').forEach(button => {
    button.addEventListener('click', function(e) {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;
        
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        toggleFullscreen(button);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


// Update your showBubbleGame function to this single version:
function showBubbleGame() {
    stopCurrentAudio();
    restartGame();
    
    // Hide all other game sections
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('post').style.display = 'none';
    document.getElementById('post2').style.display = 'none';
    document.getElementById('post3').style.display = 'none';
      document.getElementById('post4').style.display = 'none'; 

    document.getElementById('main-suku-kata').style.display = 'none';
      document.getElementById('secondaryHeader').style.display='none';
    document.getElementById('back-to-menu-container').style.display = 'block';
    document.getElementById('navbar').style.display = 'none';

    
    // Show the bubble game container
    const bubbleGameContainer = document.getElementById("bubbleGameContainer");
    if (bubbleGameContainer) {
        bubbleGameContainer.style.display = "block";
        initializeBubbleGame();
    }
}

function initializeBubbleGame() {
    const canvas = document.getElementById("bubbleCanvas");
    if (!canvas) {
        console.error("Bubble canvas not found");
        return;
    }
    
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const bubbles = [];
    const fallingEmojis = [];
    let animationId = null;
    let bubbleInterval = null;

    // Adjust canvas size to fit container
    function resizeCanvas() {
        const container = canvas.parentElement;
        if (!container) return;
        
        canvas.width = container.clientWidth * 0.9;
        canvas.height = Math.min(500, window.innerHeight * 0.7);
    }
    
    // Optimized Bubble Class
    class Bubble {
        constructor(x, y, radius, letter) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.letter = letter.toUpperCase();
            this.dy = -2;
            this.gradient = null;
        }

        createGradient(ctx) {
            const gradient = ctx.createRadialGradient(
                this.x, this.y, this.radius * 0.3,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(1, 'rgba(0, 150, 255, 0.7)');
            return gradient;
        }

        draw(ctx) {
            // Create gradient only once per bubble
            if (!this.gradient) {
                this.gradient = this.createGradient(ctx);
            }
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.gradient;
            ctx.fill();
            
            // Add border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw letter
            ctx.fillStyle = '#2c3e50';
            ctx.font = `bold ${this.radius * 0.6}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.letter, this.x, this.y);
            ctx.restore();
        }

        move() {
            this.y += this.dy;
        }

        isClicked(mx, my) {
            return Math.sqrt((mx - this.x) ** 2 + (my - this.y) ** 2) < this.radius;
        }
    }

    // Optimized Falling Emoji Class
    class FallingEmoji {
        constructor(x, y, emojiData) {
            this.x = x;
            this.y = y;
            this.emoji = emojiData[0];
            this.label = emojiData[1];
            this.dy = 3;
            this.size = 30;
            this.alpha = 1;
            this.fadeSpeed = 0.02;
            this.imageElement = null;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            
            // Add shadow for better visibility
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetY = 2;
            
            if (this.emoji.startsWith('<img')) {
                if (!this.imageElement) {
                    this.imageElement = new Image();
                    const srcMatch = this.emoji.match(/src="([^"]*)"/);
                    if (srcMatch && srcMatch[1]) {
                        this.imageElement.src = srcMatch[1];
                    }
                }
                
                if (this.imageElement && this.imageElement.complete) {
                    ctx.drawImage(this.imageElement, 
                                this.x - this.size/2, 
                                this.y - this.size/2, 
                                this.size, 
                                this.size);
                }
            } else {
                ctx.font = `${this.size}px Arial`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(this.emoji, this.x, this.y);
            }
            
            // Draw label with contrast
            ctx.font = "14px Arial";
            ctx.fillStyle = "#333";
            ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
            ctx.shadowBlur = 2;
            ctx.fillText(this.label, this.x, this.y + this.size + 10);
            
            ctx.restore();
        }

        move() {
            this.y += this.dy;
            this.alpha -= this.fadeSpeed;
            return this.alpha > 0;
        }
    }

    function createBubble() {
        const x = Math.random() * canvas.width;
        const radius = Math.random() * 30 + 20;
        const letter = letters[Math.floor(Math.random() * letters.length)];
        bubbles.push(new Bubble(x, canvas.height, radius, letter));
    }

    function animate() {
        // Clear the canvas efficiently
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw bubbles
        for (let i = bubbles.length - 1; i >= 0; i--) {
            bubbles[i].move();
            bubbles[i].draw(ctx);
            if (bubbles[i].y + bubbles[i].radius < 0) {
                bubbles.splice(i, 1);
            }
        }
        
        // Update and draw falling emojis
        for (let i = fallingEmojis.length - 1; i >= 0; i--) {
            const shouldKeep = fallingEmojis[i].move();
            fallingEmojis[i].draw(ctx);
            if (!shouldKeep) {
                fallingEmojis.splice(i, 1);
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }

    function handleCanvasClick(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        for (let i = bubbles.length - 1; i >= 0; i--) {
            if (bubbles[i].isClicked(mx, my)) {
                playLetterSound(bubbles[i].letter);
                
                const emojiOptions = indonesianEmojis[bubbles[i].letter];
                if (emojiOptions?.length) {
                    const randomEmoji = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
                    fallingEmojis.push(new FallingEmoji(bubbles[i].x, bubbles[i].y, randomEmoji));
                }
                
                bubbles.splice(i, 1);
                break; // Only pop one bubble per click
            }
        }
    }

   

    // Initialize the game
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    canvas.removeEventListener("click", handleCanvasClick);
    canvas.addEventListener("click", handleCanvasClick);
    
    // Start game elements
    bubbleInterval = setInterval(createBubble, 1000);
    animate();
    
    // Cleanup function
    return function cleanup() {
        cancelAnimationFrame(animationId);
        clearInterval(bubbleInterval);
        window.removeEventListener('resize', resizeCanvas);
        canvas.removeEventListener("click", handleCanvasClick);
    };
}


//show fill in the blank Game


/***** CONFIG *****/
const WORDS_BY_SUBJECT = {
  animals: ['domba', 'gajah', 'harimau', 'bebek','burung hantu', 'cacing','cicak','elang',
    'kelinci','kuda','landak','monyet','paus','rusa', 'sapi', 'singa laut','singa',
    'Tupai', 'udang','ular','unta','zebra'
  ],
  english: ['book', 'desk', 'chair', 'lamp', 'bed', 'pen', 'pencil',
     'eraser', 'ruler', 'notebook', 'table', 'door', 'window', 'bag',
      'shoes', 'shirt', 'hat', 'glasses', 'clock', 'mirror', 'fan', 'computer',
       'mouse', 'keyboard', 'phone', 'television', 'couch', 'carpet', 'bottle', 
       'cup', 'plate', 'spoon', 'fork', 'knife', 'umbrella', 'bicycle', 'motorcycle', 
       'car', 'bus', 'train', 'airplane', 'boat', 'bridge', 'road', 'building', 'tower',
        'tree', 'flower', 'grass', 'stone', 'cloud'],
  fruits: ['apel', 'jeruk', 'pisang', 'mangga','nanas','manggis'],
  countries: ['Pakistan', 'Afganistan', 'Afrika Selatan', 'Aljazair','Amerika Serikat','Arab Saudi','Armenia',
                'Bangladesh', 'Belgia', 'Curaçao', 'Estonia', 'Filipina',
                'Guatemala','Indonesia','Inggris', 'Irak', 'Iran', 'Kamboja',
                'Korea Selatan','Lebanon','Nepal', 'Oman', 'Palestina','Portugal'
                ,'Singapura', 'Spanyol', 'Sri Lanka', 'Thailand', 'Tiongkok', 'Tunisia',
                'Turki', 'Ukraina','Uni Emirat Arab','Uzbekistan','Vietnam','Yordania'
  ]
};
async function getImagePath(word) {
  const subjectPath = `assets/img/${selectedSubject}/${word}.png`;
  const fallbackPath = `assets/image-mainsukukata/${word}.png`;

  return new Promise((resolve) => {
    const img = new Image();
    // Avoid unnecessary 404 spam by testing existence
fetch(subjectPath)
  .then(res => {
    if (res.ok) {
      resolve(subjectPath);
    } else {
      tryEmojiOrFallback();
    }
  })
  .catch(() => tryEmojiOrFallback());


  
function tryEmojiOrFallback() {
  const emojiEntry = indonesianEmojis[word[0].toUpperCase()]?.find(([_, label]) =>
    label.toLowerCase() === word.toLowerCase()
  );
  if (emojiEntry) {
    resolve(`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><text y='50%' x='50%' dominant-baseline='middle' text-anchor='middle' font-size='64'>${emojiEntry[0]}</text></svg>`);
  } else {
    resolve(fallbackPath);
  }
}


    img.onload = () => resolve(subjectPath);
    img.onerror = () => {
      // Try emoji fallback
      const emojiEntry = indonesianEmojis[word[0].toUpperCase()]?.find(([_, label]) =>
        label.toLowerCase() === word.toLowerCase()
      );
      if (emojiEntry) {
        resolve(`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><text y='50%' x='50%' dominant-baseline='middle' text-anchor='middle' font-size='64'>${emojiEntry[0]}</text></svg>`);
      } else {
        resolve(fallbackPath);
      }
    };
  });
}


/***** BUILD ROUND *****/
async function buildRound() {
  const words = WORDS_BY_SUBJECT[selectedSubject] || [];
  qs = await Promise.all(
    shuffle([...words])
      .slice(0, MAX_QUESTIONS)
      .map(async w => {
        const missingIndices = makeMissing(w.length, w);
        return {
          word: w,
          arr: w.split(''),
          img: await getImagePath(w),
          missing: missingIndices,
          choices: makeChoices(w, missingIndices) // Pass missing indices here
        };
      })
  );
}

const MAX_QUESTIONS = 5;
const ROUND_TIME_S  = 60;


/***** STATE *****/
let selectedSubject = null;   // default
let qs      = [];
let idx     = 0;
let score   = 0;
let selIdx  = null;
let filled  = {};
let time    = 0;
let timerId = null;
let hiScore = +localStorage.getItem('fillBlanksHigh') || 0;




// Enable "Mulai" after selecting subject
document.querySelectorAll('.subject-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.subject-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedSubject = card.dataset.subject;
    document.getElementById('startFillBlanksBtn').disabled = false;
  });
});

// Start game when "Mulai" is clicked
document.getElementById('startFillBlanksBtn').addEventListener('click', () => {
  if (!selectedSubject) return;

  // Hide selector and show game
  document.getElementById('subjectSelectorPanel').style.display = 'none';
  document.getElementById('fillBlanksGameArea').style.display = 'block';

  startRound(); // this uses selectedSubject internally
});

/***** HELPERS *****/
const shuffle = a => a.sort(()=>0.5-Math.random());

function missingCount(len) {
  if (len <= 4) return 1;      // 1 blank
  if (len <= 6) return 2;      // 2 blanks
  return 3;                    // 3 blanks
}
function makeMissing(len, word) {
  const s = new Set();
  while (s.size < missingCount(len)) {
    const i = Math.floor(Math.random() * len);
    if (word[i] !== ' ') s.add(i); // ✅ skip spaces
  }
  return [...s];
}



function makeChoices(word, missingIndices) {
  // Get the actual missing letters (preserving original case)
  const missingLetters = missingIndices.map(i => word[i]).filter(c => c !== ' ');

  // Get all unique letters from the word (excluding spaces)
  const uniqueWordLetters = [...new Set(word.replace(/\s+/g, '').split(''))];

  // Start with the missing letters (must be included)
  const choices = [...new Set(missingLetters)];

  // Add other letters from the word until we reach 4 letters
  const remainingLetters = uniqueWordLetters.filter(l => !choices.includes(l));
  while (choices.length < 4 && remainingLetters.length > 0) {
    const randomIndex = Math.floor(Math.random() * remainingLetters.length);
    choices.push(remainingLetters[randomIndex]);
    remainingLetters.splice(randomIndex, 1);
  }

  // If still not enough, add random letters (not in word, preserving case)
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  while (choices.length < 4) {
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!uniqueWordLetters.includes(randomLetter) && !choices.includes(randomLetter)) {
      choices.push(randomLetter);
    }
  }

  return shuffle(choices);
}

function filledAll(q){return q.missing.every(i=>filled[i]);}




/***** START *****/
function startRound(diff='easy'){
  buildRound(diff);
  idx=0;score=0;filled={};selIdx=null;
  time=ROUND_TIME_S; updateTimer();
  clearInterval(timerId); timerId=setInterval(tick,1000);
  playWordSound('siap_mulai');
  setTimeout(renderQ,1200);
  document.getElementById('hsVal').textContent=hiScore;
  document.getElementById('fillBlanksGameContainer').style.display='block';
}

/***** TIMER *****/
function tick(){time--; updateTimer(); if(time<=0){finish(true);}}
function updateTimer(){document.getElementById('fillBlanksTimer').textContent=`⏰ ${time}s`;}

/***** RENDER *****/
function renderQ() {
  const q = qs[idx];
  filled = {};
  selIdx = null;

  document.getElementById('fillBlanksProgress').textContent =
    `(${selectedSubject}) Soal ${idx + 1} / ${MAX_QUESTIONS}`;

  // ✅ Lazy load image
  const imgEl = document.getElementById('fillBlanksImage');
  imgEl.classList.add('lazy');
  imgEl.dataset.src = q.img;
  imgEl.src = ''; // clear old src
  imgEl.onerror = () => {
  spinner.style.display = 'none';
  console.warn('❌ Image failed to load:', q.img);
};

  if (typeof initializeLazyLoading === "function") initializeLazyLoading();

  // ✅ Word blanks rendering
  document.getElementById('wordWithBlanks').innerHTML = q.arr.map((c, i) => {
    if (c === ' ') return `<span class="letter-space">&nbsp;</span>`;
    if (q.missing.includes(i)) return `<span class="blank" data-i="${i}">__</span>`;
    return `<span class="filled">${c}</span>`;
  }).join('');

  document.querySelectorAll('.blank').forEach(sp => sp.onclick = () => selectBlank(+sp.dataset.i));

  const wrap = document.getElementById('letterChoices');
  wrap.innerHTML = '';
  q.choices.forEach(l => {
    const b = document.createElement('button');
    b.textContent = l;
    b.className = 'letter-btn';
    b.onclick = () => pickLetter(l);
    wrap.appendChild(b);
  });
  document.querySelectorAll('.letter-btn').forEach(btn => btn.disabled = false);

  document.getElementById('fillBlanksFeedback').textContent = '';
  const submitBtn = document.getElementById('fillBlanksSubmit');
  submitBtn.style.display = 'none';
  submitBtn.disabled = false;

  document.getElementById('nextFillBlanksQuestion').style.display = 'none';
}


function selectBlank(i){selIdx=i;document.querySelectorAll('.blank').forEach(s=>s.classList.toggle('active-blank',+s.dataset.i===i));}
function pickLetter(l){const fb=document.getElementById('fillBlanksFeedback');if(selIdx===null){fb.textContent='👉 Pilih kotak kosong dulu!';fb.style.color='orange';return;}const sp=document.querySelector(`.blank[data-i="${selIdx}"]`);sp.textContent=l;sp.classList.add('filled-temp');filled[selIdx]=l;selIdx=null;document.querySelectorAll('.blank').forEach(s=>s.classList.remove('active-blank'));playLetterSound(l);if(filledAll(qs[idx]))document.getElementById('fillBlanksSubmit').style.display='inline-block';}

/***** SUBMIT *****/
document.getElementById('fillBlanksSubmit').onclick = () => {
  // Show custom confirm instead of native confirm()
  const overlay = document.getElementById('confirmOverlay');
  overlay.style.display = 'flex';

  // “Ya” handler
  document.getElementById('confirmYes').onclick = () => {
    overlay.style.display = 'none';
    gradeAnswer();          // ⬅︎ put the old grading code in this function
  };

  // “Batal” handler
  document.getElementById('confirmNo').onclick = () => {
    overlay.style.display = 'none';
  };
  // Detect fullscreen and append inside the fullscreen element
    let fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement) {
        fullscreenElement.appendChild(overlay);
    } else {
        document.body.appendChild(overlay);
    }
};

// Put your old grading logic into its own function
function gradeAnswer() {
  const q = qs[idx];
  let ok  = true;

  q.missing.forEach(i => {
    const sp = document.querySelector(`.blank[data-i="${i}"]`);
   if ((q.arr[i] !== ' ') && filled[i] === q.arr[i]) {
      sp.classList.add('correct');
    } else {
      sp.classList.add('wrong');
      ok = false;
    }
  });

  const fb = document.getElementById('fillBlanksFeedback');
  if (ok) {
  fb.textContent = '🎉 Benar!';
  fb.style.color = 'green';
  score++;
  playWordSound(q.word);
} else {
 const correctWord = q.word;
fb.innerHTML = `❌ Salah! <br><span style="color:green;">Jawaban yang benar: <strong>${correctWord}</strong></span>`;
  fb.style.color = 'red';
  errorSound.play();
}


  document.querySelectorAll('.letter-btn').forEach(b => (b.disabled = true));
  document.getElementById('fillBlanksSubmit').disabled = true;
  document.getElementById('nextFillBlanksQuestion').style.display = 'inline-block';
}

/***** NEXT *****/
document.getElementById('nextFillBlanksQuestion').onclick=()=>{if(idx<MAX_QUESTIONS-1){idx++;renderQ();}else finish(false);} 

/***** FINISH *****/
function finish(timeUp) {
  clearInterval(timerId);

  document.getElementById('letterChoices').innerHTML = '';
  document.getElementById('wordWithBlanks').innerHTML = '';
  document.getElementById('fillBlanksImage').src = '';
  document.getElementById('fillBlanksProgress').textContent = '';

  let txt = `Skor: ${score}/${MAX_QUESTIONS}` + (timeUp ? ' – Waktu habis!' : '');
  const endModal = document.getElementById('fillBlanksEndModal');
  const endImage = document.getElementById('resultImage'); // ← this is your image element

  if (score > hiScore) {
    hiScore = score;
    localStorage.setItem('fillBlanksHigh', hiScore);
    txt += `<br>🏆 Rekor baru!`;
    document.getElementById('hsVal').textContent = hiScore;
  }

  document.getElementById('fillBlanksEndText').innerHTML = txt;

  // Set image based on score
  if (score <= 2) {
    endImage.src = 'assets/img/squirel/squirelgirlohoo.png';
    endImage.alt = 'Try Again';
  } else if (score <= 4) {
     endImage.src = 'assets/img/squirel/squirelboyhore.png';
     endImage.alt = 'Try Again';
  } else {
      endImage.src = 'assets/img/squirel/squirelgirljuara.png';
    endImage.alt = 'Well Done!';
    confetti();
  }

  endImage.style.display = 'block';
  endModal.style.display = 'flex';

  let fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (fullscreenElement) {
    fullscreenElement.appendChild(endModal);
  } else {
    document.body.appendChild(endModal);
  }
}



/***** PLAY AGAIN *****/
document.getElementById('fillBlanksPlayAgain').onclick=()=>{
    const endModal = document.getElementById('fillBlanksEndModal');
    endModal.style.display='none';confetti();
    startRound();
};

/***** CONFETTI *****/
function confetti() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;

  for (let i = 0; i < 100; i++) {
    const d = document.createElement('div');
    d.className = 'confetto';

    // Position across the whole screen
    d.style.left = Math.random() * 100 + 'vw';
    d.style.top = '-10px';

    // Random color
    d.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;

    // Random size
    const size = 6 + Math.random() * 4;
    d.style.width = `${size}px`;
    d.style.height = `${size}px`;

    // Timing
    d.style.animationDelay = `${Math.random() * 0.5}s`;
    d.style.animationDuration = `${1.5 + Math.random()}s`;

    container.appendChild(d);
    setTimeout(() => d.remove(), 3000);
  }
}
document.getElementById('backToSubjectsBtn').addEventListener('click', () => {
  clearInterval(timerId); // Stop timer
  document.getElementById('fillBlanksGameArea').style.display = 'none';
  document.getElementById('subjectSelectorPanel').style.display = 'flex';

  // Optional: reset game state
  document.getElementById('wordWithBlanks').innerHTML = '';
  document.getElementById('letterChoices').innerHTML = '';
  document.getElementById('fillBlanksImage').src = '';
  document.getElementById('fillBlanksProgress').textContent = '';
  document.getElementById('fillBlanksFeedback').textContent = '';
  document.getElementById('fillBlanksSubmit').style.display = 'none';
  document.getElementById('nextFillBlanksQuestion').style.display = 'none';
});



function showFillBlanksGame() {
    // Stop any audio that might still be playing
    stopCurrentAudio();
    
    // Reset any game state/timers you reuse across games
    restartGame();
 /* ───── Show only the Fill‑in‑the‑Blanks container ───── */
    document.getElementById('fillBlanksGameContainer').style.display = 'block';

    /* ───── Hide every other game / menu section ───── */
    document.getElementById('gameContainer').style.display       = 'none';   // matching‑game
    document.getElementById('bubbleGameContainer').style.display = 'none';   // bubble‑pop
    document.getElementById('main-suku-kata').style.display      = 'none';   // suku‑kata
    document.getElementById('post').style.display                = 'none';   // menu card 1
    document.getElementById('post2').style.display               = 'none';   // menu card 2
    document.getElementById('post3').style.display               = 'none';   // menu card 3
    document.getElementById('post4').style.display               = 'none';   // menu card 3
    document.getElementById('secondaryHeader').style.display     = 'none';   // if you have one
    document.getElementById('back-to-menu-container').style.display = 'block';
    document.getElementById('navbar').style.display              = 'none';
    
}
document.querySelectorAll('.buttonGame').forEach(btn => {
  const bg = btn.getAttribute('data-bg');
  if (bg) {
    btn.style.backgroundImage = `url('${bg}')`;
  }
});

window.addEventListener("authReady", (e) => console.log("authReady on this page:", e.detail));
firebase.auth().onAuthStateChanged(u => console.log("onAuthStateChanged:", u));



});
