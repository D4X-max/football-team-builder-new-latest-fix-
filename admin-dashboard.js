const API_URL = 'http://localhost:3000'; // Replace with your backend URL

// Handle "Go Back to Login" Button Click
document.getElementById('backToLoginButton').addEventListener('click', () => {
    window.location.href = './user-login.html'; // Redirect to the login page
});

// Fetch all users and display them in the table
async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) throw new Error('Failed to fetch users.');

        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users. Please try again later.');
    }
}

// Display users in the table
function displayUsers(users) {
    const userTableBody = document.querySelector('#userTable tbody');
    userTableBody.innerHTML = ''; // Clear previous rows

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${new Date(user.created_at).toLocaleString()}</td>
            <td><button onclick="deleteUser(${user.id})" class="delete-button">Delete</button></td>
        `;

        userTableBody.appendChild(row);
    });
}

// Delete a user by ID
async function deleteUser(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete user.');

        const result = await response.json();
        alert(result.message);

        // Refresh the user list after deletion
        fetchUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
    }
}

// Load users on page load
document.addEventListener('DOMContentLoaded', fetchUsers);
