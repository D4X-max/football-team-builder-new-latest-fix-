const API_URL = 'http://localhost:3000'; // Replace with your backend URL
// register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!username || !password) {
        alert('Username and password are required.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Failed to register.');
        }

        const result = await response.json();
        alert(result.message);
        document.getElementById('registerForm').reset();
    } catch (error) {
        console.error('Error registering:', error);
        alert(error.message);
    }
});


// Handle User Login Form Submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`http://localhost:3000/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error('Failed to login.');

        const result = await response.json();
        
        alert(result.message);
        
        if (result.role === "user") window.location.href = './index.html';
        
      }catch(error){
console.error("Error logging in",error)
}
})
