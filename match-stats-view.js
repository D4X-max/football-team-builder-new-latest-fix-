const API_URL = 'http://localhost:3000/matches/stats'; // Replace with your actual backend URL

// Fetch matches and player stats from the backend
async function loadMatchStats() {
    const matchStatsContainer = document.getElementById('matchStatsContainer');

    try {
        const response = await fetch(API_URL);
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
                name: stat.player_name,
                position: stat.position,
                goals: stat.goals,
                assists: stat.assists,
                minutesPlayed: stat.minutes_played,
            });
        });

        // Display matches and player stats
        Object.values(matches).forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';

            const header = document.createElement('h3');
            header.innerText = `${match.name} (${new Date(match.date).toLocaleDateString()})`;
            matchCard.appendChild(header);

            const playerList = document.createElement('ul');
            playerList.className = 'player-stats-list';

            match.players.forEach(player => {
                const listItem = document.createElement('li');
                listItem.innerText = `${player.name} (${player.position}) - Goals: ${player.goals}, Assists: ${player.assists}, Minutes Played: ${player.minutesPlayed}`;
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
