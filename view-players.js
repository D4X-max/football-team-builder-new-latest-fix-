const API_URL = 'http://localhost:3000/players'; // Replace with your backend URL

// Fetch and display all players
async function fetchPlayers() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch players.');

        const players = await response.json();
        displayPlayers(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        alert('Failed to load players. Please try again.');
    }
}

// Display players in the UI
function displayPlayers(players) {
    const playerListContainer = document.getElementById('playerList');
    playerListContainer.innerHTML = ''; // Clear previous list

    players.forEach(player => {
        const listItem = document.createElement('div');
        listItem.className = 'player-item';
        listItem.innerHTML = `
            <p>${player.name} (${player.position}) - Jersey #: ${player.jersey_number}</p>
            <button class="delete-button" onclick="deletePlayer(${player.id})">Delete</button>
        `;

        playerListContainer.appendChild(listItem);
    });
}

// Delete a player by ID
async function deletePlayer(playerId) {
    try {
        const response = await fetch(`${API_URL}/${playerId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete player.');

        alert('Player deleted successfully!');
        
        // Refresh the player list after deletion
        fetchPlayers();
    } catch (error) {
        console.error('Error deleting player:', error);
        alert('Failed to delete player. Please try again.');
    }
}

// Load players on page load
document.addEventListener('DOMContentLoaded', fetchPlayers);
