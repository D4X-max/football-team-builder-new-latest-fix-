// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error(await response.text());

        alert('Login successful!');
        window.location.href = './index.html'; // Redirect to index page
    } catch (error) {
        document.getElementById('loginError').innerText = error.message || 'Login failed.';
    }
});

// Handle Registration
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error(await response.text());

        alert('Registration successful!');
        window.location.href = './login.html'; // Redirect to login page
    } catch (error) {
        document.getElementById('registerError').innerText = error.message || 'Registration failed.';
    }
});
