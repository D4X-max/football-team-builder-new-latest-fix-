const API_URL = 'http://localhost:3000'; // Replace with your backend URL

// Handle Admin Login Form Submission
document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();

    if (!username || !password) {
        alert('Username and password are required.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Failed to login.');
        }

        const result = await response.json();
        
        alert(result.message);

        // Redirect to admin dashboard after successful login
        window.location.href = './index.html';
        
        document.getElementById('adminLoginForm').reset();
        
      }catch(error){
console.error("Error logging in",error)
}
})
