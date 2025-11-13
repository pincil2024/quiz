document.addEventListener("DOMContentLoaded", () => {
    const score = sessionStorage.getItem("score"); // Get the score from session storage
    const results = JSON.parse(sessionStorage.getItem("results")) || []; // Get results from session storage
    const totalQuestions = results.length; // Total questions answered

    // Display score message in format "10/20"
    const scoreMessage = document.getElementById("scoreMessage");
    scoreMessage.innerHTML = `<h2>Your Score: ${score}/${totalQuestions}</h2>`; // Display the score
    
    const feedbackMessage = document.createElement("p");

// Set the feedback text based on the score
if (score >= 10) {
    feedbackMessage.textContent = "Excellent work!";
} else if (score >= 8) {
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
        <p>Penjelasan:</p>
        <ul>
            <li><a href="#" onclick="showExplanation('sederhana', ${index})">Sederhana</a></li>
            ${result.explanation.rinci ? `<li><a href="#" onclick="showExplanation('rinci', ${index})">Rinci</a></li>` : ''}
            ${result.explanation.video_url ? `<li><a href="#" onclick="showExplanation('video', ${index})">Video</a></li>` : ''}
        </ul>
        <hr>
    </div>
`).join('');
    // Store explanations in the window object for easy access
    window.explanations = results;

    // Add retake functionality
    document.getElementById("retakeBtn").addEventListener("click", () => {
        sessionStorage.removeItem("score"); // Clear score
        sessionStorage.removeItem("results"); // Clear results
        window.location.href = "index.html"; // Redirect to the quiz page
    });
});
function showExplanation(type, index) {
    const dialogContent = document.getElementById("dialogContent");
    const explanationData = window.explanations[index].explanation;
    dialogContent.innerHTML = ""; // Clear previous content

    // Spinner setup
    const loadingSpinner = document.createElement("div");
    loadingSpinner.id = "loadingSpinner";
    loadingSpinner.style.display = "block";
    loadingSpinner.innerHTML = `<div class="spinner"></div>`;
    dialogContent.appendChild(loadingSpinner);

    if (type === "video" && explanationData.video_url) {
        // Lazy-load video iframe
        const videoIframe = document.createElement("iframe");
        videoIframe.width = "100%";
        videoIframe.height = "315";
        videoIframe.loading = "lazy"
        videoIframe.src = explanationData.video_url;
        videoIframe.frameBorder = "0";
        videoIframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        videoIframe.allowFullscreen = true;

        // Show video when iframe is loaded
        videoIframe.onload = () => {
            loadingSpinner.style.display = "none";
            videoIframe.style.display = "block";
        };

        dialogContent.appendChild(videoIframe);
    }  else if (type === "sederhana" && Array.isArray(explanationData.sederhana)) {
        // Display 'sederhana' explanation as formatted text
        const textContent = explanationData.sederhana.map(line => `<p>${line}</p>`).join("");
        dialogContent.innerHTML = textContent;
        loadingSpinner.style.display = "none"; // Hide spinner
    } else if (type === "rinci" && Array.isArray(explanationData.sederhana)) {
        // Display 'rinci' explanation as text
        const textContent = explanationData.rinci.map(line => `<p>${line}</p>`).join("");
        dialogContent.innerHTML = textContent;
        loadingSpinner.style.display = "none"; // Hide spinner
    } else {
        // Handle cases where explanation is unavailable
        dialogContent.innerHTML = "<p>No explanation available for this type.</p>";
        loadingSpinner.style.display = "none"; // Hide spinner
    }
 // Show dialog
    const explanationDialog = document.getElementById("explanationDialog");
    explanationDialog.showModal();

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
    window.location.href = "quiz.html";
});
