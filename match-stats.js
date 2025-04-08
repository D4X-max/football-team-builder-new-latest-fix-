let currentMatchId = null; // Store the ID of the created match

// Create a new match
document.getElementById('createMatchForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const matchName = document.getElementById('matchName').value;
    const matchDate = document.getElementById('matchDate').value;

    try {
        const response = await fetch('http://localhost:3000/matches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: matchName, date: matchDate }),
        });

        if (!response.ok) throw new Error('Failed to create match.');

        const match = await response.json();
        currentMatchId = match.id; // Store the created match ID

        alert(`Match "${matchName}" created successfully!`);
        
        // Show the player stats section
        document.getElementById('createMatchContainer').style.display = 'none'; // Hide match creation form
        document.getElementById('playerStatsContainer').style.display = 'block'; // Show player stats section

        // Load players for updating stats
        loadPlayersForStats();
    } catch (error) {
        console.error('Error creating match:', error);
        alert('Failed to create match. Please try again.');
    }
});

// Load players for updating stats
async function loadPlayersForStats() {
    try {
        const response = await fetch('http://localhost:3000/players'); // Fetch all players
        if (!response.ok) throw new Error('Failed to fetch players.');

        const players = await response.json();
        const playerStatsList = document.getElementById('playerStatsList');
        
        playerStatsList.innerHTML = ''; // Clear previous list

        players.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            
            playerCard.innerHTML = `
                <h3>${player.name} (${player.position})</h3>
                <p>Jersey #: ${player.jersey_number}</p>
                Goals:
                <input type="number" id="goals-${player.id}" placeholder="Goals" min="0">
                Assists:
                <input type="number" id="assists-${player.id}" placeholder="Assists" min="0">
                Minutes Played:
                <input type="number" id="minutes-${player.id}" placeholder="Minutes Played" min="0">
            `;

            playerStatsList.appendChild(playerCard);
        });
    } catch (error) {
        console.error('Error fetching players:', error);
        alert('Failed to load players. Please try again.');
    }
}


// Save player stats for the current match
document.getElementById('saveStatsButton').addEventListener('click', async () => {
    const playerStatsList = document.getElementById('playerStatsList');
    
    const statsData = Array.from(playerStatsList.children).map(listItem => {
        const playerId = listItem.querySelector('[id^=goals-]').id.split('-')[1];
        
        return {
            playerId,
            goals: parseInt(document.getElementById(`goals-${playerId}`).value) || 0,
            assists: parseInt(document.getElementById(`assists-${playerId}`).value) || 0,
            minutesPlayed: parseInt(document.getElementById(`minutes-${playerId}`).value) || 0,
            matchId: currentMatchId,
        };
    });

    try {
        const response = await fetch('http://localhost:3000/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(statsData),
        });

        if (!response.ok) throw new Error('Failed to update player stats.');

        alert('Player stats updated successfully!');
        
        // Redirect back to home page or reset form
        window.location.href = './index.html';
    } catch (error) {
        console.error('Error saving stats:', error);
        alert('Failed to save player stats. Please try again.');
    }
});


