const API_URL = 'http://localhost:3000/matches/stats'; // Replace with your actual backend URL

// Fetch matches and player stats from the backend
async function loadMatchStats() {
    const matchStatsContainer = document.getElementById('matchStatsContainer');

    // Clear previous matches to avoid duplication
    matchStatsContainer.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3000/matches/stats');
        if (!response.ok) throw new Error('Failed to fetch match stats.');

        const matchStats = await response.json();

        // Group player stats by match
        const matches = {};
        matchStats.forEach(stat => {
            if (!matches[stat.match_id]) {
                matches[stat.match_id] = {
                    name: stat.match_name,
                    date: stat.match_date,
                    players: [],
                };
            }
            matches[stat.match_id].players.push({
                id: stat.player_id,
                name: stat.player_name,
                position: stat.position,
                goals: stat.goals,
                assists: stat.assists,
                minutesPlayed: stat.minutes_played,
            });
        });

        // Display matches and player stats
        Object.entries(matches).forEach(([matchId, match]) => {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';

            const header = document.createElement('h3');
            header.innerText = `${match.name} (${new Date(match.date).toLocaleDateString()})`;
            matchCard.appendChild(header);

            // Add Delete Match Button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-match-button';
            deleteButton.innerText = 'Delete Match';
            deleteButton.onclick = () => deleteMatch(matchId);
            matchCard.appendChild(deleteButton);

            const playerList = document.createElement('ul');
            playerList.className = 'player-stats-list';

            match.players.forEach(player => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${player.name} (${player.position}) - Goals: ${player.goals}, Assists: ${player.assists}, Minutes Played: ${player.minutesPlayed}
                `;
                playerList.appendChild(listItem);
            });

            matchCard.appendChild(playerList);
            matchStatsContainer.appendChild(matchCard);
        });
    } catch (error) {
        console.error('Error loading match stats:', error);
        alert('Failed to load match stats. Please try again later.');
    }
}


// Delete an entire match
function deleteMatch(matchId) {
    if (confirm('Are you sure you want to delete this match? This action cannot be undone.')) {
        fetch(`http://localhost:3000/matches/${matchId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete the match.');
                alert('Match deleted successfully!');
                loadMatchStats(); // Reload the updated stats
            })
            .catch(error => console.error('Error deleting the match:', error));
    }
}

// Edit player stats
function editPlayerStat(playerId, matchId) {
    const newGoals = prompt('Enter new goals:', 0);
    const newAssists = prompt('Enter new assists:', 0);
    const newMinutesPlayed = prompt('Enter new minutes played:', 0);

    if (newGoals !== null && newAssists !== null && newMinutesPlayed !== null) {
        fetch(`http://localhost:3000/stats/${playerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                goals: parseInt(newGoals),
                assists: parseInt(newAssists),
                minutesPlayed: parseInt(newMinutesPlayed),
                matchId,
            }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update player stats.');
                alert('Player stats updated successfully!');
                loadMatchStats(); // Reload the updated stats
            })
            .catch(error => console.error('Error updating player stats:', error));
    }
}


// Change background color based on scroll position
document.addEventListener('scroll', () => {
    const scrollTop = window.scrollY; // Get vertical scroll position
    const documentHeight = document.body.scrollHeight - window.innerHeight; // Total scrollable height
    const scrollFraction = scrollTop / documentHeight; // Fraction of page scrolled

    // Generate a dynamic gradient based on the scroll fraction
    const startColor = [15, 32, 39]; // Dark teal (RGB)
    const endColor = [44, 83, 100]; // Light teal (RGB)

    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * scrollFraction);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * scrollFraction);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * scrollFraction);

    document.body.style.background = `rgb(${r}, ${g}, ${b})`;
});




// Load match stats on page load
document.addEventListener('DOMContentLoaded', loadMatchStats);

