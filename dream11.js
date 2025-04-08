const API_FOOTBALL_URL = 'https://v3.football.api-sports.io/players/profiles';
const RAPIDAPI_KEY = 'ebe8c831197308ae3201bacac8c1233c'; // Replace with your actual API key

// Fetch player profiles from the API
async function fetchPlayerProfiles() {
    try {
        const response = await fetch(`${API_FOOTBALL_URL}?player=276`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-rapidapi-key': RAPIDAPI_KEY,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch player profiles.');

        const data = await response.json();
        displayPlayers(data.response); // Pass player data to display function
    } catch (error) {
        console.error('Error fetching player profiles:', error);
        alert('Failed to load player profiles. Please try again later.');
    }
}

// Display players in the Dream11 page
function displayPlayers(players) {
    const playerListContainer = document.getElementById('playerList');

    players.forEach(playerData => {
        const player = playerData.player;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <img src="${player.photo}" alt="${player.name}" style="width:50px; height:50px; border-radius:50%;">
            <span>${player.name} (${player.nationality}) - ${player.position}</span>
            <button onclick="addToDreamTeam('${player.name}')">Add to Dream Team</button>
        `;

        playerListContainer.appendChild(listItem);
    });
}

// Add a player to the dream team
function addToDreamTeam(playerName) {
    const dreamTeamContainer = document.getElementById('dreamTeam');

    if (dreamTeamContainer.childElementCount >= 11) {
        alert('You can only select 11 players for your dream team.');
        return;
    }

    const listItem = document.createElement('li');
    listItem.innerText = playerName;
    dreamTeamContainer.appendChild(listItem);
}

// Load players on page load
document.addEventListener('DOMContentLoaded', fetchPlayerProfiles);

