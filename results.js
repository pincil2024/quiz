document.addEventListener("DOMContentLoaded", () => {
    const score = sessionStorage.getItem("score"); // Get the score from session storage
    const results = JSON.parse(sessionStorage.getItem("results")) || []; // Get results from session storage
    const totalQuestions = results.length; // Total questions answered

    // Display score message in format "10/20"
    const scoreMessage = document.getElementById("scoreMessage");
    scoreMessage.innerHTML = `<h2>Your Score: ${score}/${totalQuestions}</h2>`; // Display the score
    
    const feedbackMessage = document.createElement("p");

// Set the feedback text based on the score
if (score >= 4) {
    feedbackMessage.textContent = "Excellent work!";
} else if (score >= 2) {
    feedbackMessage.textContent = "Good job, but there's room for improvement!";
} else {
    feedbackMessage.textContent = "Keep practicing!";
}

// Append the feedback message to the score container
scoreMessage.appendChild(feedbackMessage);
    // Display results list
    const resultsList = document.getElementById("resultsList");
    resultsList.innerHTML = results.map((result, index) => `
        <div class="result-item">
            <p>${index + 1}. ${result.question}</p>
            <p><strong>Your Answer:</strong> ${result.userAnswer}</p>
           <p><strong>Correct Answer:</strong> ${result.correctAnswer}</p>
           <p><a href="#" onclick="showExplanation(${index})">Penjelasan</a></p>
            <hr>
        </div>
    `).join('');

    // Store explanations in the window object for easy access
    window.explanations = results.map(r => r.explanation);

    // Add retake functionality
    document.getElementById("retakeBtn").addEventListener("click", () => {
        sessionStorage.removeItem("score"); // Clear score
        sessionStorage.removeItem("results"); // Clear results
        window.location.href = "index.html"; // Redirect to the quiz page
    });
});

// Function to show the explanation in a dialog
function showExplanation(index) {
    const dialog = document.getElementById("explanationDialog");
    const dialogContent = document.getElementById("dialogContent");
    const explanation = window.explanations[index];

    // Clear previous content and add the loading spinner
    dialogContent.innerHTML = '<div id="loadingSpinner"></div>';
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.style.display = "block"; // Show spinner

    // Check if explanation is a video link or text
    if (explanation.includes("http")) {
        // Create a new iframe with the video URL
        const videoIframe = document.createElement("iframe");
        videoIframe.width = "100%";
        videoIframe.height = "315";
        videoIframe.src = explanation;
        videoIframe.frameBorder = "0";
        videoIframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        videoIframe.allowFullscreen = true;

         // Hide the spinner when the iframe loads
         videoIframe.onload = () => {
            loadingSpinner.style.display = "none";
        };

        // Append the iframe to the dialog content
        dialogContent.appendChild(videoIframe);
    } else {
        dialogContent.textContent = explanation;
        loadingSpinner.style.display = "none";
    }

    dialog.showModal();
}

// Event listener to close the dialog and remove the video iframe
document.getElementById("closeDialog").addEventListener("click", () => {
    const dialog = document.getElementById("explanationDialog");
    const dialogContent = document.getElementById("dialogContent");

    // Clear the dialog content, which will remove the iframe and stop the video
    dialogContent.innerHTML = "";

    dialog.close();
});
// Event listener for the Retake Quiz button
document.getElementById("retakeExamBtn").addEventListener("click", () => {
    // Clear previous score and results data
    sessionStorage.removeItem("score");
    sessionStorage.removeItem("results");

    // Redirect to the quiz page to start over
    window.location.href = "index.html";
});