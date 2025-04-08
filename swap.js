const SWAP_API_URL = 'http://localhost:3000/swap'; // API URL for /swap

// Open swap modal for a specific player ID
function openSwapModal(currentPlayerId) {
    const modal = document.getElementById('swapModal');
    const playerList = document.getElementById('playerList');

    modal.style.display = 'block'; // Show modal

    // Fetch all players from the database
    fetch('http://localhost:3000/players')
        .then(response => response.json())
        .then(players => {
            playerList.innerHTML = ''; // Clear previous list

            players.forEach(player => {
                const listItem = document.createElement('li');
                listItem.innerText = `${player.name} (${player.position})`;
                listItem.style.cursor = 'pointer'; // Make it look clickable
                listItem.style.padding = '10px'; // Add spacing for better UI
                listItem.style.borderBottom = '1px solid #ddd'; // Add a separator

                // Add click event for swapping players
                listItem.onclick = () => {
                    swapPlayer(currentPlayerId, player.id); // Pass both current and selected player IDs
                };

                playerList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching players:', error));
}

// Close swap modal
function closeSwapModal() {
    const modal = document.getElementById('swapModal');
    modal.style.display = 'none'; // Hide modal
}

// Swap two players by their IDs
function swapPlayer(currentPlayerId, newPlayerId) {
    fetch(SWAP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPlayerId, newPlayerId })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to swap players');

        alert('Players swapped successfully!');
        
        closeSwapModal(); // Close modal after swapping
        
        fetchPlayers(); // Refresh field after swapping
    })
    .catch(error => console.error('Error swapping players:', error));
}
