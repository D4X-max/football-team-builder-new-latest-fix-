const API_URL = 'http://localhost:3000/players';
const API_URL2 = 'http://localhost:3000'


// Fetch and display players on the football field
async function fetchPlayers() {
    const response = await fetch(API_URL);
    const players = await response.json();
    
    displayPlayersOnField(players, '442'); // Default formation is 4-4-2
}
// Add a new player
const addPlayerForm = document.getElementById('addPlayerForm');
addPlayerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const name = document.getElementById('name').value;
    const position = document.getElementById('position').value;
    const age = parseInt(document.getElementById('age').value);
    const jerseyNumber = parseInt(document.getElementById('jersey_number').value);
    const nationality = document.getElementById('nationality').value;
    const height = parseInt(document.getElementById('height').value);
    const weight = parseInt(document.getElementById('weight').value);
    const skills = document.getElementById('skills').value; // Comma-separated string

    try {
        // Send POST request to add the player
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                position,
                age,
                jersey_number: jerseyNumber,
                nationality,
                height,
                weight,
                skills
            })
        });

        if (response.ok) {
            alert('Player successfully added!');

            // Clear the form fields
            addPlayerForm.reset();

            // Refresh the player list or update the UI
            fetchPlayers();
        } else {
            alert('Failed to add player. Please check your input and try again.');
        }
    } catch (error) {
        console.error('Error adding player:', error);
        alert('An error occurred while adding the player. Please try again later.');
    }
});



let selectedPlayers = []; // Store selected players for swapping

function displayPlayersOnField(players, formationKey) {
    const footballField = document.getElementById('footballField');
    footballField.innerHTML = ''; // Clear previous players

    // Define formations with proper positioning
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
        ],
        '433': [
            { left: '50%', top: '85%' }, // Goalkeeper
            { left: '20%', top: '70%' }, // Left Defender
            { left: '40%', top: '70%' }, // Center Defender 1
            { left: '60%', top: '70%' }, // Center Defender 2
            { left: '80%', top: '70%' }, // Right Defender
            { left: '30%', top: '50%' }, // Left Midfielder
            { left: '50%', top: '50%' }, // Center Midfielder
            { left: '70%', top: '50%' }, // Right Midfielder
            { left: '20%', top: '30%' }, // Left Forward
            { left: '50%', top: '30%' }, // Center Forward
            { left: '80%', top: '30%' }  // Right Forward
        ],
        '352': [
            { left: '50%', top: '85%' }, // Goalkeeper
            { left: '25%', top: '70%' }, // Left Center Back
            { left: '50%', top: '70%' }, // Center Back
            { left: '75%', top: '70%' }, // Right Center Back
            { left: '20%', top: '50%' }, // Left Midfielder
            { left: '40%', top: '50%' }, // Left Center Midfielder
            { left: '60%', top: '50%' }, // Right Center Midfielder
            { left: '80%', top: '50%' }, // Right Midfielder
            { left: '40%', top: '30%' }, // Left Forward
            { left: '60%', top: '30%' }, // Right Forward
            { left: '50%', top: '30%' }  // Center Forward
        ]
    };

    const positions = formations[formationKey];

    if (!positions) {
        console.error(`Formation "${formationKey}" not found.`);
        return;
    }

    positions.forEach((pos, index) => {
        if (index >= players.length) return; // Skip if there are more positions than players

        const player = players[index];

        // Create player marker (button)
        const marker = document.createElement('button');
        marker.className = 'player-marker';
        marker.style.position = "absolute";
        marker.style.left = pos.left;
        marker.style.top = pos.top;
        marker.style.transform = "translate(-50%, -50%)"; // Center the marker at the position
        marker.style.width = "40px";
        marker.style.height = "40px";
        marker.style.backgroundColor = "#007bff"; /* Blue color for players */
        marker.style.color = "red";
        marker.style.textAlign = "center";
        marker.style.lineHeight = "20px";
        marker.style.borderRadius = "40%"; /* Circular shape */
        marker.style.fontWeight = "bold";
        marker.innerText = player.jersey_number;

        // Add click event to view player profile
        marker.onclick = () => viewPlayerProfile(player.id);

        // Add click event to open swap modal/dropdown
        marker.onclick = () => openSwapModal(player.id);

        footballField.appendChild(marker);

        // Create player name label below the marker
        const nameLabel = document.createElement('div');
        nameLabel.className = 'player-name';
        nameLabel.style.position = "absolute";
        nameLabel.style.left = pos.left;
        nameLabel.style.top = `calc(${pos.top} + 45px)`; /* Position below the marker */
        nameLabel.style.transform = "translate(-50%, -50%)"; /* Center the text */
        nameLabel.style.color = "white"; /* Dark text color */
        nameLabel.style.fontSize = "14px"; /* Smaller font size */
        nameLabel.innerText = player.name;

        footballField.appendChild(nameLabel);

        const profileButton = document.createElement('button');
        profileButton.className = 'view-profile-button';
        profileButton.innerText = 'View Profile';
        profileButton.style.position = "absolute";
        profileButton.style.left = pos.left;
        profileButton.style.top = `calc(${pos.top} + -40px)`; // Position below the player's name label
        profileButton.style.transform = "translate(-50%, -50%)";
        
        // Redirect to profile.html with player ID as query parameter
        profileButton.onclick = () => {
            window.location.href = `./profile.html?id=${player.id}`;
        };

        footballField.appendChild(profileButton);
    });
}

function viewPlayerProfile(playerId) {
    window.location.href = `./profile.html?id=${playerId}`; // Redirect to profile.html with player ID
}


// Fetch and display substitutes on the bench
// Display substitute players as buttons
function displaySubstitutes(players) {
    const substituteButtons = document.getElementById('substituteButtons');
    substituteButtons.innerHTML = ''; // Clear previous substitutes

    // Filter players not in starting 11 (substitutes)
    const substitutes = players.slice(11); // Assuming first 11 are starters

    substitutes.forEach(player => {
        const button = document.createElement('button');
        button.className = 'substitute-button';
        button.innerText = `${player.name} (${player.position})`;
        button.style.margin = '5px'; // Add spacing between buttons

        // Add click event for selecting a substitute
        button.onclick = () => {
            alert(`Selected ${player.name} as a substitute.`);
            closeSwapModal(player.id); // Open swap modal with selected substitute
        };

        substituteButtons.appendChild(button);
    });
}

// Fetch players and display both field players and substitutes
async function fetchPlayers() {
    try {
        const response = await fetch(API_URL);
        const players = await response.json();

        displayPlayersOnField(players, '442'); // Default formation is 4-4-2
        displaySubstitutes(players); // Display substitutes on the bench
    } catch (error) {
        console.error('Error fetching players:', error);
    }
}

function goToPrintPage() {
    // Fetch current team data from the API
    fetch(API_URL)
        .then(response => response.json())
        .then(players => {
            // Save the current team data in localStorage
            localStorage.setItem('teamFormation', JSON.stringify(players));

            // Redirect to print.html
            window.location.href = './print.html';
        })
        .catch(error => console.error('Error fetching team data for print:', error));
}





function applyFormation() {
    const formationSelect = document.getElementById('formation'); // Get the dropdown element
    const selectedFormation = formationSelect.value; // Get the selected formation value

    fetch(API_URL)
        .then(response => response.json())
        .then(players => {
            displayPlayersOnField(players, selectedFormation); // Update field with new formation
        })
        .catch(error => console.error('Error fetching players for formation:', error));
}

function openSwapModal(currentPlayerId) {
    const modal = document.getElementById('swapModal');
    const playerList = document.getElementById('playerList');

    modal.style.display = 'block'; // Show modal

    // Fetch all players from the database
    fetch(API_URL)
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





function swapPlayer(currentPlayerId, newPlayerId) {
    fetch(`${API_URL}/swap`, {
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


function saveTeam() {
    fetch(API_URL)
        .then(response => response.json())
        .then(players => {
            // Get the first 11 players (playing 11)
            const playing11 = players.slice(0, 11);

            // Retrieve existing teams from localStorage
            let savedTeams = JSON.parse(localStorage.getItem('savedTeams')) || [];

            // Add the new team to the list of saved teams
            savedTeams.push({
                id: Date.now(), // Unique ID for each team
                date: new Date().toLocaleString(), // Save timestamp
                players: playing11
            });

            // Save the updated list of teams back to localStorage
            localStorage.setItem('savedTeams', JSON.stringify(savedTeams));

            alert('Team saved successfully!');
        })
        .catch(error => console.error('Error saving team:', error));
}

// Attach event listener to "Save Team" button
document.getElementById('saveTeamButton').addEventListener('click', saveTeam);



// Update the list of players in the UI
function updatePlayersList(players) {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = ''; // Clear previous list

    players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-card';
        playerDiv.innerHTML = `
            <p><strong>${player.name}</strong></p>
            <p>Position: ${player.position}</p>
            <p>Age: ${player.age}</p>
            <p>Jersey #: ${player.jersey_number}</p>
            <button onclick="deletePlayer(${player.id})" class="delete-button">Delete</button>
        `;
        playersList.appendChild(playerDiv);
    });
}
//API FETCHING
function fetchPlayersFromExternalAPI() {
    fetch('https://api-football-v1.p.rapidapi.com/v3/players?league=39&season=2023', {
        method: 'GET',
        mode: 'no-cors', // Add this option to bypass CORS restrictions
        headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': 'your-api-key', // Replace with your actual API key
        },
    })
    .then(response => {
        console.log(response); // Note: Response will be opaque due to no-cors
    })
    .catch(error => console.error('Error fetching players:', error));
}


// Delete a player by ID
async function deletePlayer(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete player");

        alert("Player deleted successfully!");
        fetchPlayers(); // Refresh the list and field after deletion
    } catch (error) {
        console.error("Error deleting player:", error.message);
    }
}

let captain = null; // Store captain
let viceCaptain = null; // Store vice-captain

// Show player list in a modal
function showPlayerList(role) {
    const modal = document.getElementById('playerSelectionModal');
    const playerList = document.getElementById('playerSelectionList');

    modal.style.display = 'block'; // Show modal

    // Fetch all players from the database
    fetch(API_URL)
        .then(response => response.json())
        .then(players => {
            playerList.innerHTML = ''; // Clear previous list

            players.forEach(player => {
                const listItem = document.createElement('li');
                listItem.innerText = `${player.name} (${player.position}) - Jersey #: ${player.jersey_number}`;
                listItem.style.cursor = 'pointer'; // Make it look clickable

                // Add click event to assign captain or vice-captain
                listItem.onclick = () => assignLeadership(player, role);

                playerList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching players:', error));
}

// Assign leadership (captain or vice-captain)
function assignLeadership(player, role) {
    if (role === 'captain') {
        captain = player;
        document.getElementById('captainName').innerText = `${player.name} (${player.position})`;
        alert(`${player.name} has been assigned as Captain.`);
    } else if (role === 'viceCaptain') {
        viceCaptain = player;
        document.getElementById('viceCaptainName').innerText = `${player.name} (${player.position})`;
        alert(`${player.name} has been assigned as Vice-Captain.`);
    }

    closePlayerSelectionModal(); // Close the modal after assigning
}

// Close the player selection modal
function closePlayerSelectionModal() {
    const modal = document.getElementById('playerSelectionModal');
    modal.style.display = 'none'; // Hide modal
}


///SWAPPING BRUTHA

let selectedPlayerToSwap = null; // Store the first selected player for swapping

// Show player list in a modal
function showSwapModal() {
    const modal = document.getElementById('swapModal');
    const playerList = document.getElementById('swapPlayerList');

    modal.style.display = 'block'; // Show modal

    // Fetch all players from the database
    fetch(API_URL)
        .then(response => response.json())
        .then(players => {
            playerList.innerHTML = ''; // Clear previous list

            players.forEach(player => {
                const listItem = document.createElement('li');
                listItem.innerText = `${player.name} (${player.position}) - Jersey #: ${player.jersey_number}`;
                listItem.style.cursor = 'pointer'; // Make it look clickable

                // Add click event to select player for swapping
                listItem.onclick = () => selectPlayerForSwap(player);

                playerList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching players:', error));
}

function closeSwapModal() {
    const modal = document.getElementById('swapModal');
    modal.style.display = 'none'; // Hide modal
    selectedPlayerToSwap = null; // Reset selection when closing
}

function selectPlayerForSwap(player) {
    if (!selectedPlayerToSwap) {
        // Store the first selected player
        selectedPlayerToSwap = player;
        alert(`${player.name} selected as the first player. Now select another player to swap.`);
    } else {
        // Perform the swap with the second selected player
        swapPlayers(selectedPlayerToSwap, player);
        selectedPlayerToSwap = null; // Reset after swapping
    }
}


// Swap two players
function swapPlayers(player1, player2) {
    fetch(`${API_URL2}/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            currentPlayerId: player1.id,
            newPlayerId: player2.id,
        }),
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to swap players.');

            alert(`${player1.name} swapped with ${player2.name}.`);
            closeSwapModal(); // Close modal after swapping
            fetchPlayers(); // Refresh field after swapping
        })
        .catch(error => console.error('Error swapping players:', error));
}









// Fetch players on page load
fetchPlayers();





