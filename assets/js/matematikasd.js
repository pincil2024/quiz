document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded");
// Game State Variables
let questionCount = 0;
const totalQuestions = 5;
let correctAnswer = 0;
let currentMode = '';
let currentLevel = 1;
let randomImage;
let num1 = 0;
let num2 = 0;


// Emoji Options
const imageOptions = ['🌟', '🍎', '❤️', '💰', '💎', '🐶', '☁️', '🧸', '🌸', '🚗'];
const errorSound = new Audio("assets/sounds/Ooh.mp3");
const successSound = new Audio("assets/sounds/yay.mp3");
const correctSound = new Audio("assets/sounds/yay-success.mp3");
// Get Mode from URL
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');

document.getElementById('submit-btn').addEventListener('click', checkAnswer);



document.getElementById('fullscreenToggle').addEventListener('change', function() {
    const gameContainer = document.getElementById('game-container');
    
    if (this.checked) {
        // Enter fullscreen
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
            document.getElementById('pointer-hand').style.display = 'none';
        } else if (gameContainer.webkitRequestFullscreen) { /* Safari */
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.msRequestFullscreen) { /* IE11 */
            gameContainer.msRequestFullscreen();
        }
        
        // Optional: Adjust styles when in fullscreen
        gameContainer.classList.add('fullscreen-active');
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
            document.getElementById('pointer-hand').style.display = 'inline-flex';
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        
        // Optional: Revert styles when exiting fullscreen
        gameContainer.classList.remove('fullscreen-active');
    }
});

// Listen for fullscreen change events to keep toggle in sync
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const fullscreenToggle = document.getElementById('fullscreenToggle');
    fullscreenToggle.checked = !!document.fullscreenElement;
}
    
   
// Start the Game
startGame(mode);

function startGame(mode) {
    currentMode = mode;
    questionCount = 0;
    randomImage = getRandomImage(); // Set random image for consistency across questions
  
    document.getElementById('game-container').style.display = 'block';
    generateQuestion();
  

    document.getElementById('submit-btn').disabled = false; // Enable submit at game start

    document.getElementById('submit-btn').addEventListener('click', checkAnswer);
      document.getElementById('next-btn').removeEventListener('click', nextQuestion); // Ensure no duplicate listeners
    document.getElementById('next-btn').addEventListener('click', nextQuestion);    // Add event listener
     // Show "Go Back" button and handle redirection
 const goBackButton = document.getElementById('go-back-btn');
 goBackButton.style.display = 'inline-block';
 goBackButton.addEventListener('click', () => {
     window.location.href = 'sdmath.html'; // Replace with your operation selection page URL
 });
 const againButton = document.getElementById('again-btn');
 againButton.style.display = 'inline-block';
 againButton.addEventListener('click', () => {
    levelone();
 });
 const levelTwoButton = document.getElementById('level-two-btn');
 levelTwoButton.style.display = 'inline-block';
 levelTwoButton.addEventListener('click', () => {
    proceedToLevel2();
 });
 //const quizBtn = document.getElementById('quiz');
// quizBtn.style.display = 'inline-block';
// quizBtn.addEventListener('click', () => {
 //    window.location.href = 'mathQuiz.html'; // Replace with your operation selection page URL
// });
}
 
const answerInput = document.getElementById("answer");

// Device detection – safe & accurate
const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
          (navigator.maxTouchPoints > 0) ||
          (navigator.msMaxTouchPoints > 0));
};
if (!isTouchDevice()) {
  answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextBtn = document.getElementById('next-btn');
      const isNextVisible = nextBtn && nextBtn.style.display !== 'none' && !nextBtn.disabled;

      if (isNextVisible) {
        nextBtn.click();
      } else {
        document.getElementById('submit-btn').click();
      }
    }
  });
}


// Only prevent interaction on mobile
if (isTouchDevice()) {
  // Prevent mobile keyboard
  answerInput.addEventListener('focus', (e) => {
    e.preventDefault();
    answerInput.blur();
  });

  answerInput.addEventListener('touchstart', (e) => {
    e.preventDefault();
    answerInput.blur();
  });

 
}

// Numpad input logic (works on all devices)
document.querySelectorAll(".numpad-key").forEach(button => {
  button.addEventListener("click", () => {
    const value = button.textContent;
    if (value === "C") {
      answerInput.value = "";
    } else if (value === "←") {
      answerInput.value = answerInput.value.slice(0, -1);
    } else {
      answerInput.value += value;
    }
  });
});




  
function updateLevelDisplay(level) {
    const levelDisplay = document.getElementById('level-display');
    levelDisplay.textContent = `Level: ${level}`;
}

function proceedToLevel2() {
    currentLevel = 2; // Set to Level 2
    updateLevelDisplay(currentLevel); // Update the level display
    resetGame();
    // Update UI for Level 2
    const questionContainer = document.getElementById('question');
    questionContainer.textContent = "Level 2: Continue solving!";
    document.getElementById('emoji-container').style.display = 'none'; // Hide the emoji container
   generateQuestion(); // Use the same question generation logic

}
function generateQuestion() {
   
    const min = 1;
    const max = 10;
   
    // Randomize emoji for every question
    if (currentLevel === 1) {
        randomImage = getRandomImage();
    }

    switch (currentMode) {
        case 'addition':
            num1 = getRandomNumber(min, max);
            num2 = getRandomNumber(min, max);
            correctAnswer = num1 + num2;
            displayAdditionQuestion(num1, num2);
            break;

        case 'subtraction':
            num1 = getRandomNumber(min , max );
            num2 = getRandomNumber(min, num1); // Ensure num2 <= num1
            correctAnswer = num1 - num2;
            displaySubtractionQuestion(num1, num2);
            break;

            case 'multiplication':
                num1 = getRandomNumber(1, 5);
                num2 = getRandomNumber(1, 5);
                correctAnswer = num1 * num2;
                displayMultiplicationQuestion(num1, num2);
                break;

            case 'division':
                num2 = getRandomNumber(1, 5);
                num1 = num2 * getRandomNumber(1, 5); // Ensure num1 is divisible by num2
                correctAnswer = num1 / num2;
                displayDivisionQuestion(num1, num2);
                    break;
                
        default:
            console.error('Invalid mode!');
            return;
    }

    document.getElementById('submit-btn').disabled = false;
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus(); 
    
}

function displayAdditionQuestion(num1, num2) {
    document.getElementById('question').innerHTML = `${num1} + ${num2} = ?`;
    
    // Only show emojis for Level 1
    if (currentLevel === 1) {
        document.getElementById('emoji-container').innerHTML = `
            <div class="group1">${randomImage.repeat(num1)}</div> + 
            <div class="group2">${randomImage.repeat(num2)}</div>
        `;
        // Add animation when question appears
        animateEmojisAppear();
    }
}

// Animation function for when questions load
function animateEmojisAppear() {
    const emojis = document.querySelectorAll('.image, .emoji-content, .group1, .group2');
    
    emojis.forEach((emoji, index) => {
        // Reset any previous animations
        emoji.style.animation = 'none';
        
        // Trigger reflow
        void emoji.offsetWidth;
        
        // Add bounce animation with staggered delay
        emoji.style.animation = `emojiBounceIn 0.6s ease-out ${index * 0.1}s both`;
    });
}


function displaySubtractionQuestion(num1, num2) {
    document.getElementById('question').innerHTML = `${num1} - ${num2} = ?`;
   
   // Only show emojis for Level 1
   if (currentLevel === 1) {
    const totalEmojis = Array.from({ length: num1 }, (_, index) => {
        return index < num2
            ? `<span class="image strikethrough">${randomImage}</span>`
            : `<span class="image">${randomImage}</span>`;
    }).join('');

    document.getElementById('emoji-container').innerHTML = totalEmojis;
    animateEmojisAppear(); // Add animation when question appears
}
}

function displayMultiplicationQuestion(num1, num2) {
    // Display the multiplication question
    document.getElementById('question').innerHTML = `${num1} x ${num2} = ?`;
    // Only show emojis for Level 1
    if (currentLevel === 1) {
    document.getElementById('emoji-container').innerHTML = `
        <div style="font-size: 2rem;">${randomImage.repeat(num1 * num2)}</div>
    `;  // Generate emoji groups for multiplication

    let groups = '';
    for (let i = 0; i < num1; i++) {
        groups += `
            <div class="group-box">
                <div class="image-group">${randomImage.repeat(num2)}</div>
            </div>
        `;
    }
    
    // Inject groups into the emoji container
    const emojiContainer = document.getElementById('emoji-container');
    emojiContainer.innerHTML = groups;
  animateEmojisAppear(); // Add animation when question appears
 }
}





function displayDivisionQuestion(num1, num2) {
    document.getElementById('question').innerHTML = `${num1} ÷ ${num2} = ?`;
    
    // Only show emojis for Level 1
    if (currentLevel === 1) {
    document.getElementById('emoji-container').innerHTML = `<div class="image-group">${randomImage.repeat(num1)}</div>`;
  animateEmojisAppear(); // Add animation when question appears
}
}

    // NEW: Animation functions for emojis
    function animateEmojisAppear() {
        const emojis = document.querySelectorAll('.image, .image-group, .group-box');
        
        emojis.forEach((emoji, index) => {
            // Reset any previous animations
            emoji.style.animation = 'none';
            
            // Trigger reflow
            void emoji.offsetWidth;
            
            // Add bounce animation with staggered delay
            emoji.style.animation = `emojiBounceIn 0.6s ease-out ${index * 0.1}s both`;
        });
    }

    function animateCorrectAnswer() {
        const emojis = document.querySelectorAll('.image, .image-group, .group-box');
        
        emojis.forEach((emoji, index) => {
            // Reset any previous animations
            emoji.style.animation = 'none';
            
            // Trigger reflow
            void emoji.offsetWidth;
            
            // Add celebration animation
            emoji.style.animation = `emojiCelebrate 0.8s ease-in-out ${index * 0.05}s both`;
        });
    }

    function animateEmojisCombine() {
        const container = document.getElementById('emoji-container');
        container.style.animation = 'emojiCombine 1s ease-in-out both';
    }

// Update your existing animation handlers
    function handleDivisionAnimation(userAnswer) {
        const emojiContainer = document.getElementById('emoji-container');

        if (userAnswer !== correctAnswer) {
            errorSound.play();
            document.getElementById('response').innerText = "Incorrect, try again!";
            document.getElementById('response').className = "incorrect";
            return;
        }

        document.getElementById('response').innerText = "Betul! ";
        document.getElementById('response').className = "correct";
        correctSound.play();
        animateCorrectAnswer(); // Add celebration animation

        const emojisPerGroup = num2;
        emojiContainer.innerHTML = '';

        for (let i = 0; i < correctAnswer; i++) {
            const group = document.createElement('div');
            group.className = 'group-box';
            group.style.opacity = 0;
            group.style.transform = 'translateY(-20px)';

            group.innerHTML = `<div class="image-group">${randomImage.repeat(emojisPerGroup)}</div>`;
            emojiContainer.appendChild(group);

            setTimeout(() => {
                group.style.opacity = 1;
                group.style.transform = 'translateY(0)';
                group.style.animation = `emojiBounceIn 0.6s ease-out both`; // Add bounce animation
            }, i * 500);
        }

        setTimeout(() => {
            document.getElementById('question').innerHTML = `${num1} ÷ ${num2} = ${correctAnswer}`;
            document.getElementById('next-btn').style.display = 'block';
        }, correctAnswer * 500);
    }


function updateProgress() {
    // Correct progress display
    document.getElementById('progress-tracker').textContent = `${questionCount + 1}/${totalQuestions}`;
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('answer').value);
    const responseElement = document.getElementById('response');
    responseElement.textContent = '';
    responseElement.className = '';

    if (isNaN(userAnswer)) {
        errorSound.play();
        responseElement.textContent = 'Please enter a valid number!';
        responseElement.className = 'correct';
        return;
    }

    if (userAnswer === correctAnswer) {
        correctSound.play();
        responseElement.textContent = 'Betul! 🎉';
        responseElement.className = 'correct';

         // Replace '?' with the correct answer
         document.getElementById('question').textContent = 
         document.getElementById('question').textContent.replace('?', correctAnswer);

    
        if (currentLevel === 1){
        if (currentMode === 'division') {
            handleDivisionAnimation(userAnswer);       
        }else if (currentMode === 'subtraction') {
            handleSubtractionAnimation();
        }else if (currentMode === 'multiplication') {
            handleMultiplicationAnimation();
        }else  {
             handleAdditionAnimation();
            } 
        }
        document.getElementById('submit-btn').disabled = true; // Disable after correct answer
        setTimeout(() => {
            document.getElementById('next-btn').style.display = 'block';
        }, 1200);
        } else {
        errorSound.play();
        responseElement.textContent = 'Coba lagi! 😔';
        responseElement.className = 'incorrect';
        document.getElementById('answer').value = '';
        document.getElementById('answer').focus();
    }
}
let isProcessing = false;

function nextQuestion() {
    if (isProcessing) return; // Prevent multiple executions

    isProcessing = true; // Set flag to prevent repeated execution

    const nextButton = document.getElementById('next-btn');
    nextButton.disabled = true;

    if (questionCount < totalQuestions - 1) {
        questionCount++; // Increment the question count
        generateQuestion(); // Generate the next question
        document.getElementById('submit-btn').disabled = false; // Re-enable submit

        document.getElementById('response').textContent = '';
        document.getElementById('answer').value = '';
        setTimeout(() => {
            updateProgress();
            nextButton.style.display = 'none'; // Hide after generating the question
            nextButton.disabled = false; // Re-enable button for next use
            isProcessing = false; // Reset flag
        }, 500); // Adjust delay as necessary
    } else {
        endGame(); // End the game if all questions are answered
        isProcessing = false; // Reset flag when game ends
    }
}


function endGame() {
    // Show celebratory emojis for Level 1
    if (currentLevel === 1) {
        showCelebratoryEmojis();
    }

    successSound.play();

    // Show the dialog box after a short delay
    setTimeout(() => {
        const dialog = document.getElementById('congratulations-dialog');
        const restartButton = document.getElementById('restart-btn');
        const levelOneButton = document.getElementById('level-one-btn');
        const nextLevelButton = document.getElementById('next-level-btn');
        const closeButton = document.getElementById('close-btn');

        // Adjust button visibility based on the current level
        if (currentLevel === 1) {
            nextLevelButton.style.display = 'inline-block';
            restartButton.style.display = 'inline-block';
            levelOneButton.style.display = 'none';
        } else if (currentLevel === 2) {
            nextLevelButton.style.display = 'none';
            restartButton.style.display = 'inline-block';
            levelOneButton.style.display = 'inline-block';
        }

         // Detect fullscreen and append inside the fullscreen element
    let fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement) {
        fullscreenElement.appendChild(dialog);
    } else {
        document.body.appendChild(dialog);
    }

        // Add button click event listeners
        restartButton.onclick = resetGame;

        levelOneButton.onclick = () => {
           levelone();
            
        };

        nextLevelButton.onclick = () => {
            proceedToLevel2();
        };

        closeButton.onclick = () => {
            dialog.style.display = 'none';
            hideCelebratoryEmojis(); // Stop emojis if needed
        };

        dialog.style.display = 'block';
    }, 1000); // Adjust delay (in milliseconds) for dialog appearance
}
function levelone(){
    currentLevel = 1;
    updateLevelDisplay(currentLevel);
    resetGame();
    document.getElementById('emoji-container').style.display = 'block'; // show the emoji container
}


function resetGame() {
    // Stop emojis if the game is reset
    hideCelebratoryEmojis();

    // Reset game variables and UI
    questionCount = 0;
    correctAnswer = 0;

    document.getElementById('response').textContent = '';
    document.getElementById('answer').value = '';
    document.getElementById('emoji-container').innerHTML = '';
    document.getElementById('question').innerHTML = '';
    document.getElementById('progress-tracker').textContent = `0/${totalQuestions}`;

    const dialog = document.getElementById('congratulations-dialog');
    if (dialog) {
        dialog.style.display = 'none';
    }

    const nextButton = document.getElementById('next-btn');
    nextButton.style.display = 'none';
    nextButton.disabled = false;
    nextButton.removeEventListener('click', nextQuestion);
    nextButton.addEventListener('click', nextQuestion);

    startGame(currentMode);
}



let emojiInterval;

function showCelebratoryEmojis() {
    

    // Start generating emojis at intervals
    emojiInterval = setInterval(() => {
        const emoji = document.createElement('div');
        emoji.textContent = imageOptions[Math.floor(Math.random() * imageOptions.length)];
        emoji.className = 'celebration-emoji';
        emoji.style.left = Math.random() * 100 + 'vw';
        emoji.style.animationDelay = Math.random() * 1 + 's';
        document.getElementById('emoji-container').appendChild(emoji);


        // Remove emoji after it finishes falling
        setTimeout(() => {
            emoji.remove();
        }, 3000); // Matches the animation duration
    }, 200); // Adjust interval speed as needed
}

function hideCelebratoryEmojis() {
    clearInterval(emojiInterval); // Stop generating new emojis
    const emojis = document.querySelectorAll('.celebration-emoji');
    emojis.forEach((emoji) => emoji.remove()); // Remove existing emojis
}


function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomImage() {
    return imageOptions[Math.floor(Math.random() * imageOptions.length)];
}
function handleMultiplicationAnimation() {
        animateCorrectAnswer(); // Add celebration animation first
        
        setTimeout(() => {
            const emojiContainer = document.getElementById('emoji-container');
            const groups = emojiContainer.querySelectorAll('.group-box');

            // Clear the container and combine all emojis
            let combinedEmojis = '';
            groups.forEach((group) => {
                const emojiGroup = group.querySelector('.image-group').innerHTML;
                combinedEmojis += emojiGroup;
            });

            // Replace the container content with the combined emojis
            emojiContainer.innerHTML = `<div class="image">${combinedEmojis}</div>`;
            
            // Animate the combined emojis
            setTimeout(() => {
                animateEmojisCombine();
            }, 100);
        }, 1000);
    }

  
 function handleAdditionAnimation() {
    // First, animate the existing groups
    animateCorrectAnswer();
    
    setTimeout(() => {
        const emojiContainer = document.getElementById('emoji-container');
        const group1 = emojiContainer.querySelector('.group1');
        const group2 = emojiContainer.querySelector('.group2');

        if (!group1 || !group2) {
            document.getElementById('next-btn').style.display = 'block';
            return;
        }

        const group1Content = group1.innerHTML;
        const group2Content = group2.innerHTML;

        // Create a new container for combined emojis
        const combinedContainer = document.createElement('div');
        combinedContainer.className = 'combined-emojis';
        combinedContainer.innerHTML = group1Content + group2Content;
        
        // Clear the container and add the new combined element
        emojiContainer.innerHTML = '';
        emojiContainer.appendChild(combinedContainer);
        
        // Force reflow and animate the new element
        void combinedContainer.offsetWidth;
        combinedContainer.style.animation = 'emojiCombine 1s ease-in-out both';
            
        // Show the next button after animation
        document.getElementById('next-btn').style.display = 'block';
    }, 1000);
}

 function handleSubtractionAnimation() {
        animateCorrectAnswer(); // Add celebration animation first
        
        setTimeout(() => {
            const emojiContainer = document.getElementById('emoji-container');
            const nonStrikethroughEmojis = emojiContainer.querySelectorAll('.image:not(.strikethrough)');
            emojiContainer.innerHTML = '';

            const wrapper = document.createElement('div');
            wrapper.className = 'emoji-wrapper';
            nonStrikethroughEmojis.forEach(emoji => {
                wrapper.appendChild(emoji);
            });

            emojiContainer.appendChild(wrapper);
            
            // Animate the remaining emojis
            setTimeout(() => {
                const remainingEmojis = emojiContainer.querySelectorAll('.image');
                remainingEmojis.forEach((emoji, index) => {
                    emoji.style.animation = `emojiBounceIn 0.5s ease-out ${index * 0.1}s both`;
                });
            }, 100);

            // Show the next button after animation
            document.getElementById('next-btn').style.display = 'block';
        }, 1000);
    }


});