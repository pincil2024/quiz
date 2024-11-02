let questions = [];
let score = 0;
let timer; // Timer variable

// Load questions from JSON and start quiz
async function loadQuestions() {
    const response = await fetch('questions.json');
    questions = await response.json();
    questions = questions.sort(() => Math.random() - 0.5).slice(0, 20);
    displayQuestions();
}


function displayQuestions() {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = "";

    questions.forEach((question, index) => {
        const questionElement = document.createElement("div");
        questionElement.innerHTML = `
            <p>${index + 1}. ${question.question}</p>
            ${question.options.map((option) => `
                <label>
                    <input type="radio" name="question${index}" value="${option}">
                    ${option}
                </label><br>
            `).join('')}
        `;
        quizContainer.appendChild(questionElement);
    });

}

function startTimer() {
    const timeLimit = 1 * 60; // 20 minutes in seconds
    let timeRemaining = timeLimit;

    timer = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById("timer").textContent = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            openTimeUpDialog();
        }

        timeRemaining--;
    }, 1000);
}

function openTimeUpDialog() {
    const dialog = document.getElementById("timeUpDialog");
    dialog.showModal();
}

function submitQuiz() {
    clearInterval(timer); // Clear the timer when submitting
    const answers = document.querySelectorAll("input[type='radio']:checked");
    let results = [];
    score = 0;

    questions.forEach((question, index) => {
        const userAnswer = Array.from(answers).find(a => a.name === `question${index}`)?.value || "No Answer";
        if (userAnswer === question.correct) score++;

        results.push({
            question: question.question,
            correctAnswer: question.correct,
            userAnswer: userAnswer,
            explanation: question.explanation
        });
    });

    // Save score and results to sessionStorage and log them
    sessionStorage.setItem("score", score);
    sessionStorage.setItem("results", JSON.stringify(results));

    // Redirect to results page
    window.location.href = "results.html";
}

// Retake the quiz
function retakeQuiz() {
    window.location.href = "index.html"; // Redirect to quiz page
}

// Load questions and attach submit button listener on page load
document.addEventListener("DOMContentLoaded", () => {
    loadQuestions();
    document.getElementById("againBtn").addEventListener("click", submitQuiz);
    document.getElementById("retakeBtn").addEventListener("click", retakeQuiz);
    document.getElementById("submitBtn").addEventListener("click", submitQuiz);
});
// Show the welcome dialog box on page load
document.addEventListener("DOMContentLoaded", () => {
    const welcomeDialog = document.getElementById("welcomeDialog");
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
let timerInterval; // Declare timerInterval in the global scope

function startTimer(duration) {
    let timeRemaining = duration * 60; // Convert minutes to seconds
    const timerDisplay = document.getElementById("timerDisplay"); // Make sure there's an element for the timer display
    
    const timerInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval); // Stop timer when time is up
            showTimeUpDialog(); // Show time-up dialog
        }
        
        timeRemaining--;
    }, 1000);
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
        // Submit quiz logic here
        window.location.href = "results.html";
    });

    document.getElementById("retakeQuizBtn").addEventListener("click", () => {
        timeUpDialog.close();
        window.location.href = "index.html"; // Restart quiz
    });
}

