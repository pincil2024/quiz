let questions = [];
let userAnswers = []; // Array to store user answers
let score = 0;
let currentQuestionIndex = 0; // Track the current question index
let timerInterval; // Timer interval for countdown

// Load questions from JSON and start quiz
async function loadQuestions() {
    const response = await fetch('bank/questions.json');
    const allQuestions = await response.json();
    questions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 20); // Randomize and pick 15 questions
    userAnswers = new Array(questions.length).fill(null); // Initialize user answers array
   displayQuestion(currentQuestionIndex); // Display the first question
    updateProgress(); // Update progress display
}

// Display a single question based on the current index
function displayQuestion(index) {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = ""; // Clear previous question

    const question = questions[index];
    const questionElement = document.createElement("div");
    questionElement.innerHTML = `
       <h3>Question ${index + 1}/${questions.length}:</h3>
        <p>${index + 1}.${question.question}</p>
         ${question.options.map((option) => `
            <label>

                <input type="radio" name="question" value="${option}" 
                    ${userAnswers[index] === option ? 'checked' : ''}>
                ${option}
            </label><br>
        `).join('')}
    `;
    quizContainer.appendChild(questionElement);

    updateNavigationButtons(index); // Update navigation buttons
    updateProgress(); // Update progress display
}

// Save user's answer for the current question
function saveUserAnswer() {
    const selectedOption = document.querySelector(`input[name="question"]:checked`);
    if (selectedOption) {
        userAnswers[currentQuestionIndex] = selectedOption.value; // Save the answer
    }
}

function updateProgress() {
    const progress = document.getElementById("progress");
    const answeredCount = userAnswers.filter(answer => answer !== null).length;
    progress.textContent = `Answered: ${answeredCount}/${questions.length}`;

    // Check if all questions are answered
    const submitBtn = document.getElementById("submitBtn");
    if (answeredCount === questions.length) {
        submitBtn.style.display = "flex"; // Show submit button
    } else {
        submitBtn.style.display = "none"; // Hide submit button
    }
   // Attach event listener for submit button
   submitBtn.addEventListener("click", submitQuiz);
        
    
}

// Update navigation buttons
function updateNavigationButtons(index) {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    // Enable/disable buttons based on question index
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === questions.length - 1 ? "Submit" : "Next";
}

// Event listeners for navigation buttons
document.getElementById("prevBtn").addEventListener("click", () => {
    saveUserAnswer(); // Save the current answer
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
});

document.getElementById("nextBtn").addEventListener("click", () => {
    saveUserAnswer(); // Save the current answer
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    } else {
        // Submit the quiz
        submitQuiz();
    }
});
// Load questions on page load
document.addEventListener("DOMContentLoaded", () => {
    loadQuestions();
    document.getElementById("retakeBtn").addEventListener("click", retakeQuiz);
    document.getElementById("submitBtn").addEventListener("click", submitQuiz);
});

// Show the welcome dialog box on page load
document.addEventListener("DOMContentLoaded", () => {
    const welcomeDialog = document.getElementById("welcomeDialog");
    welcomeDialog.id = "welcomeDialog"; // Assign an ID
    const enableTimerCheckbox = document.getElementById("enableTimer");
    const timerOptions = document.getElementById("timerOptions");
    const timerDurationInput = document.getElementById("timerDuration");
    const startQuizBtn = document.getElementById("startQuizBtn");
    
    // Show dialog box
    welcomeDialog.showModal();

    // Show/hide timer options based on checkbox
    enableTimerCheckbox.addEventListener("change", () => {
        timerOptions.style.display = enableTimerCheckbox.checked ? "block" : "none";
    });

    // Start quiz button click event
    startQuizBtn.addEventListener("click", () => {
        welcomeDialog.close(); // Close welcome dialog

        const isTimerEnabled = enableTimerCheckbox.checked;
        const timerDuration = parseInt(timerDurationInput.value, 10); // Parse input as integer

       
        // Get timer settings
        if (isTimerEnabled && timerDuration > 0) {
            startTimer(timerDuration); // Start timer if enabled and duration is valid
        } else {
            // If no timer is enabled, proceed directly to the quiz
            loadQuestions(); // This function should load the questions for the quiz
        }
    });
});

// Timer function
function startTimer(duration) {
    let timeRemaining = duration * 60; // Convert minutes to seconds
    const timerDisplay = document.getElementById("timer");

    timer = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            showTimeUpDialog();
        }

        timeRemaining--;
    }, 1000);
}

// Show "time up" dialog
function showTimeUpDialog() {
    const timeUpDialog = document.createElement("dialog");
     // If dialog already exists, remove it to avoid duplication
     if (timeUpDialog) {
        timeUpDialog.remove();
    }
    timeUpDialog.innerHTML = `
        <h2>Time's Up!</h2>
        <p>Your time is up. Would you like to submit or retake the quiz?</p>
        <button id="submitQuizBtn">Submit</button>
        <button id="retakeQuizBtn">Retake</button>
    `;
    document.body.appendChild(timeUpDialog);
    timeUpDialog.showModal();

    // Event listeners for submit and retake buttons
    document.getElementById("submitQuizBtn").addEventListener("click", () => {
        timeUpDialog.close();
        finalizeQuizSubmission();
    });

    document.getElementById("retakeQuizBtn").addEventListener("click", () => {
        timeUpDialog.close();
        resetQuiz(); // Reset and start the quiz from the beginning
    });
}

function resetQuiz() {
    console.log("Resetting quiz...");

    // Reset variables
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(null); // Reset answers array
    score = 0;

   

    // Close and remove the confirmation dialog if it exists
    const confirmationDialog = document.getElementById("confirmationDialog");
    if (confirmationDialog) {
        confirmationDialog.close();
        confirmationDialog.remove();
    }

    // Reload questions and reset UI
    loadQuestions();

      // Reset progress display
      const progress = document.getElementById("progress");
      progress.textContent = `Answered: 0/${questions.length}`;
  
      // Reopen the welcome dialog
      const welcomeDialog = document.getElementById("welcomeDialog");
      if (welcomeDialog) {
          welcomeDialog.showModal();
      }
    }


// Start timer
function startTimer(duration) {
    clearInterval(timerInterval); // Clear any existing timer
    let timeRemaining = duration * 60; // Convert minutes to seconds
    const timerDisplay = document.getElementById("timer");

    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `Time Remaining: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            showTimeUpDialog();
        }

        timeRemaining--;
    }, 1000);
}

// Submit quiz
function submitQuiz() {
    // Check for unanswered questions
    const unansweredQuestions = [];
    questions.forEach((_, index) => {
        if (!userAnswers[index]) { // Check if the answer is not saved
            unansweredQuestions.push(index + 1); // Add the question number
        }
    });

    // If there are unanswered questions, show a confirmation dialog
    if (unansweredQuestions.length > 0) {
        const confirmationDialog = document.createElement("dialog");
        confirmationDialog.innerHTML = `
            <h3>Unanswered Questions</h3>
            <p>The following questions have not been answered: ${unansweredQuestions.join(", ")}</p>
            <p>Are you sure you want to submit the quiz?</p>
            <button id="confirmSubmitBtn">Yes, Submit</button>
            <button id="cancelSubmitBtn">No, Go Back</button>
        `;
        document.body.appendChild(confirmationDialog);
        confirmationDialog.showModal();

        // Event listener for "Yes, Submit"
        document.getElementById("confirmSubmitBtn").addEventListener("click", () => {
            confirmationDialog.close();
            confirmationDialog.remove();
            finalizeQuizSubmission();
        });

        // Event listener for "No, Go Back"
        document.getElementById("cancelSubmitBtn").addEventListener("click", () => {
            confirmationDialog.close();
            confirmationDialog.remove();
        });

        return; // Stop further submission
    } const confirmationDialog = document.createElement("dialog");
    confirmationDialog.innerHTML = `
        <h3>Are you sure you want to submit the quiz?</h3>
        <button id="confirmSubmitBtn">Yes, Submit</button>
        <button id="cancelSubmitBtn">No, Go Back</button>
    `;
    document.body.appendChild(confirmationDialog);
    confirmationDialog.showModal();

    // Event listener for "Yes, Submit"
    document.getElementById("confirmSubmitBtn").addEventListener("click", () => {
        confirmationDialog.close();
        confirmationDialog.remove();
        finalizeQuizSubmission();
    });

    // Event listener for "No, Go Back"
    document.getElementById("cancelSubmitBtn").addEventListener("click", () => {
        confirmationDialog.close();
        confirmationDialog.remove();
    });

    return; // Stop further submission

}

function finalizeQuizSubmission() {
    saveUserAnswer(); // Ensure the last answer is saved
    clearInterval(timerInterval); // Clear the timer when submitting
    let results = [];
    score = 0;

    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index] || "No Answer";
        if (userAnswer === question.correct) score++;

        results.push({
            question: question.question,
            correctAnswer: question.correct,
            userAnswer: userAnswer,
            explanation: question.explanation
        });
    });

    sessionStorage.setItem("score", score);
    sessionStorage.setItem("results", JSON.stringify(results));

    window.location.href = "results.html"; // Redirect to results page
}

// Show "time up" dialog
function showTimeUpDialog() {
    const timeUpDialog = document.createElement("dialog");
    timeUpDialog.innerHTML = `
        <h2>Time's Up!</h2>
        <p>Your time is up. Would you like to submit or retake the quiz?</p>
        <button id="submitQuizBtn">Submit</button>
        <button id="retakeQuizBtn">Retake</button>
    `;
    document.body.appendChild(timeUpDialog);
    timeUpDialog.showModal();

    // Event listeners for submit and retake buttons
    document.getElementById("submitQuizBtn").addEventListener("click", () => {
        timeUpDialog.close();
        finalizeQuizSubmission();
    });

    document.getElementById("retakeQuizBtn").addEventListener("click", () => {
        timeUpDialog.close();
        resetQuiz(); // Reset and start the quiz from the beginning
    });
   
}
document.addEventListener("DOMContentLoaded", () => {
    const welcomeText = document.querySelector(".welcome-text");
    const toText = document.querySelector(".to-text");
    const pincilText = document.querySelector(".pincil-text");

    // Define the strings to display
    const welcomeString = "Let's";
    const toString = "Level";
    const pincilString = "Up";

    let welcomeIndex = 0;

    const typeWriter = setInterval(() => {
        if (welcomeIndex < welcomeString.length) {
            // Type the "Welcome" string
            welcomeText.textContent += welcomeString[welcomeIndex];
        } else if (welcomeIndex === welcomeString.length) {
            // Display and animate the "to" text
            toText.classList.add("zoom-out");
            toText.textContent = toString;
        } else if (
            welcomeIndex >= welcomeString.length + 1 &&
            welcomeIndex < welcomeString.length + 1 + pincilString.length
        ) {
            // Type the "Pincil" string
            pincilText.textContent += pincilString[welcomeIndex - (welcomeString.length + 1)];
        } else {
            // Clear the interval when done
            clearInterval(typeWriter);
        }
        welcomeIndex++;
    }, 150);
});