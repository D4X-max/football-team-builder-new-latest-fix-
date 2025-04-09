const API_URL = 'http://localhost:3000'; // Replace with your backend URL

let selectedPlayersToSwap = []; // Store selected players for swapping

// Handle Player Selection for Swapping
function handlePlayerSelection(playerId, buttonElement) {
    // If the player is already selected, deselect them
    if (selectedPlayersToSwap.includes(playerId)) {
        selectedPlayersToSwap = selectedPlayersToSwap.filter(id => id !== playerId);
        buttonElement.classList.remove('selected'); // Remove visual highlight
        return;
    }

    // If less than 2 players are selected, add this player to the list
    if (selectedPlayersToSwap.length < 2) {
        selectedPlayersToSwap.push(playerId);
        buttonElement.classList.add('selected'); // Highlight selected player

        if (selectedPlayersToSwap.length === 2) {
            // Perform swap when two players are selected
            swapPlayers(selectedPlayersToSwap[0], selectedPlayersToSwap[1]);
        }
    }
}

// Perform Swap Request to Backend
async function swapPlayers(player1Id, player2Id) {
    try {
        const response = await fetch(`${API_URL}/swap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPlayerId: player1Id, newPlayerId: player2Id }),
        });

        if (!response.ok) throw new Error('Failed to swap players.');

        const result = await response.json();
        alert(result.message);

        // Refresh football field after swapping
        fetchPlayers(); // Ensure this function re-renders the football field with updated positions

        // Reset selection state
        selectedPlayersToSwap = [];
        document.querySelectorAll('.player-marker').forEach(button => button.classList.remove('selected'));
    } catch (error) {
        console.error('Error swapping players:', error);
        alert('Failed to swap players. Please try again.');
    }
}

// Fetch and Display Players on Football Field
async function fetchPlayers() {
    try {
        const response = await fetch(`${API_URL}/players`);
        if (!response.ok) throw new Error('Failed to fetch players.');

        const players = await response.json();
        displayPlayersOnField(players); // Ensure this function updates the field dynamically
    } catch (error) {
        console.error('Error fetching players:', error);
    }
}

// Display Players on Football Field
function displayPlayersOnField(players) {
    const footballField = document.getElementById('footballField');
    footballField.innerHTML = ''; // Clear previous field

    const formations = {
        '442': [
            { left: '50%', top: '85%' }, // Goalkeeper
            { left: '20%', top: '70%' }, // Left Defender
            { left: '40%', top: '70%' }, // Center Defender 1
            { left: '60%', top: '70%' }, // Center Defender 2
            { left: '80%', top: '70%' }, // Right Defender
            { left: '20%', top: '50%' }, // Left Midfielder
            { left: '40%', top: '50%' }, // Center Midfielder 1
            { left: '60%', top: '50%' }, // Center Midfielder 2
            { left: '80%', top: '50%' }, // Right Midfielder
            { left: '30%', top: '30%' }, // Left Forward
            { left: '70%', top: '30%' }  // Right Forward
        ]
    };

    const positions = formations['442']; // Default formation

    positions.forEach((pos, index) => {
        if (index >= players.length) return;

        const player = players[index];

        const marker = document.createElement('button');
        marker.className = 'player-marker';
        marker.style.position = "absolute";
        marker.style.left = pos.left;
        marker.style.top = pos.top;
        marker.style.transform = "translate(-50%, -50%)";
        marker.style.width = "40px";
        marker.style.height = "40px";
        marker.style.backgroundColor = "#007bff";
        marker.style.color = "white";
        marker.style.textAlign = "center";
        marker.style.lineHeight = "40px";
        marker.style.borderRadius = "50%";
        marker.style.fontWeight = "bold";

        marker.innerText = player.jersey_number;
        
       footballFiled.appendChild(marker)


