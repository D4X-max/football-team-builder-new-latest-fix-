// Dummy credentials for validation
const validUsername = "admin";
const validPassword = "password123";

// Handle form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from refreshing the page

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validate credentials
    if (username === validUsername && password === validPassword) {
        // Redirect to index.html
        window.location.href = "./index.html";
    } else {
        // Show error message
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent = "Invalid username or password. Please try again.";
        errorMessage.style.color = "red"; // Make the text red for visibility
    }
});

// Clear error message when typing
document.getElementById("username").addEventListener("input", clearErrorMessage);
document.getElementById("password").addEventListener("input", clearErrorMessage);

function clearErrorMessage() {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = ""; // Clear the error message
}



