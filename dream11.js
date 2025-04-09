const API_URL = 'https://v3.football.api-sports.io/players'; // Replace with your actual API URL
const API_KEY = 'ebe8c831197308ae3201bacac8c1233c'; // Replace with your actual API key

// Fetch players from the API
async function fetchPlayersFromAPI() {
    try {
        const response = await fetch(`${API_URL}?league=39&season=2023`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-rapidapi-key': API_KEY,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch players.');

        const data = await response.json();

        // Pass all players to display function
        displayPlayers(data.response);
    } catch (error) {
        console.error('Error fetching players:', error);
        alert('Failed to fetch players. Please try again later.');
    }
}

// Display players in the Dream Team page
function displayPlayers(players) {
    const playerListContainer = document.getElementById('playerList');

    playerListContainer.innerHTML = ''; // Clear previous list

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

// Add a player to the Dream Team
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
document.addEventListener('DOMContentLoaded', fetchPlayersFromAPI);

