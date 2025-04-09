const MATCH_API_URL = 'http://localhost:3000/matches'; // Replace with your backend URL

// Fetch and display all matches with stats
async function loadMatchStats() {
    const matchStatsContainer = document.getElementById('matchStatsContainer');

    try {
        const response = await fetch(`${MATCH_API_URL}/stats`);
        if (!response.ok) throw new Error('Failed to fetch match stats.');

        const matches = await response.json();

        // Group matches by ID
        const groupedMatches = {};
        matches.forEach(match => {
            if (!groupedMatches[match.match_id]) {
                groupedMatches[match.match_id] = { ...match, players: [] };
            }
            groupedMatches[match.match_id].players.push(match);
        });

        // Render matches and their stats
        matchStatsContainer.innerHTML = '';
        
        Object.values(groupedMatches).forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            
            matchCard.innerHTML = `
                <h3>${match.match_name} (${new Date(match.match_date).toLocaleDateString()})</h3>
                <ul class="player-stats-list">
                    ${match.players.map(player => `
                        <li>${player.player_name} (${player.position}) - Goals: ${player.goals}, Assists: ${player.assists}, Minutes Played: ${player.minutes_played}</li>
                    `).join('')}
                </ul>
                <button class="delete-button" onclick="deleteMatch(${match.match_id})">Delete Match</button>
            `;

            matchStatsContainer.appendChild(matchCard);
        });
    } catch (error) {
        console.error('Error loading match stats:', error);
        alert('Failed to load match stats. Please try again.');
    }
}

// Delete a match by ID
async function deleteMatch(matchId) {
    try {
        const response = await fetch(`${MATCH_API_URL}/${matchId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete match.');

        alert('Match deleted successfully!');
        
        // Refresh the match list after deletion
        loadMatchStats();
    } catch (error) {
        console.error('Error deleting match:', error);
        alert('Failed to delete match. Please try again.');
    }
}

// Load matches on page load
document.addEventListener('DOMContentLoaded', loadMatchStats);



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






