const API_URL = 'http://localhost:3000/players';
let allPlayers = []; // Store all players globally

// Fetch and display all players
async function fetchPlayers() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch players');
        allPlayers = await response.json();
        displayPlayers(allPlayers); // Display all players initially
    } catch (error) {
        console.error('Error fetching players:', error.message);
        document.getElementById('playersList').innerHTML = '<p class="error">Failed to load players.</p>';
    }
}

function displayPlayers(players) {
    const playersList = document.getElementById('playersList');

    if (players.length === 0) {
        playersList.innerHTML = '<p>No players found.</p>';
        return;
    }

    // Generate player cards with Edit and Delete buttons
    playersList.innerHTML = players.map(player => `
        <div class="player-card">
            <p><strong>${player.name}</strong></p>
            <p>Position: ${player.position}</p>
            <p>Age: ${player.age}</p>
            <p>Jersey #: ${player.jersey_number}</p>
            <!-- Edit and Delete Buttons -->
            <button onclick="editPlayer(${player.id})" class="edit-button">Edit</button>
            <button onclick="deletePlayer(${player.id})" class="delete-button">Delete</button>
        </div>
    `).join('');
}


// Edit a player by ID
function editPlayer(playerId) {
    const player = allPlayers.find(p => p.id === playerId); // Find the player by ID
    if (!player) {
        alert('Player not found!');
        return;
    }

    // Pre-fill the form fields with the player's current details
    document.getElementById('nameEdit').value = player.name;
    document.getElementById('positionEdit').value = player.position;
    document.getElementById('ageEdit').value = player.age;
    document.getElementById('jerseyEdit').value = player.jersey_number;
    document.getElementById('nationalityEdit').value = player.nationality || '';
    document.getElementById('heightEdit').value = player.height || '';
    document.getElementById('weightEdit').value = player.weight || '';
    document.getElementById('skillsEdit').value = player.skills || '';

    // Show the edit form
    document.getElementById('editFormContainer').style.display = 'block';

    // Add event listener for saving changes
    document.getElementById('saveEditButton').onclick = async () => {
        const updatedName = document.getElementById('nameEdit').value;
        const updatedPosition = document.getElementById('positionEdit').value;
        const updatedAge = parseInt(document.getElementById('ageEdit').value);
        const updatedJerseyNumber = parseInt(document.getElementById('jerseyEdit').value);
        const updatedNationality = document.getElementById('nationalityEdit').value;
        const updatedHeight = parseInt(document.getElementById('heightEdit').value);
        const updatedWeight = parseInt(document.getElementById('weightEdit').value);
        const updatedSkills = document.getElementById('skillsEdit').value;

        try {
            const response = await fetch(`${API_URL}/${playerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: updatedName,
                    position: updatedPosition,
                    age: updatedAge,
                    jersey_number: updatedJerseyNumber,
                    nationality: updatedNationality,
                    height: updatedHeight,
                    weight: updatedWeight,
                    skills: updatedSkills
                })
            });

            if (!response.ok) throw new Error('Failed to update player');

            alert('Player updated successfully!');
            document.getElementById('editFormContainer').style.display = 'none'; // Hide the form
            fetchPlayers(); // Refresh the list after editing
        } catch (error) {
            console.error('Error updating player:', error.message);
            alert('An error occurred while updating the player.');
        }
    };
}

// Delete a player by ID
async function deletePlayer(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete player");

        alert("Player deleted successfully!");
        fetchPlayers(); // Refresh the list after deletion
    } catch (error) {
        console.error("Error deleting player:", error.message);
    }
}

// Apply filters to the player list
async function applyFilters() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch players.');

        const players = await response.json();

        // Get filter values
        const nationalityFilter = document.getElementById('filterNationality').value.toLowerCase();
        const minHeightFilter = parseInt(document.getElementById('filterMinHeight').value) || 0;
        const maxHeightFilter = parseInt(document.getElementById('filterMaxHeight').value) || Infinity;
        const minWeightFilter = parseInt(document.getElementById('filterMinWeight').value) || 0;
        const maxWeightFilter = parseInt(document.getElementById('filterMaxWeight').value) || Infinity;

        // Apply filters
        const filteredPlayers = players.filter(player => {
            return (
                (!nationalityFilter || player.nationality.toLowerCase().includes(nationalityFilter)) &&
                (player.height >= minHeightFilter && player.height <= maxHeightFilter) &&
                (player.weight >= minWeightFilter && player.weight <= maxWeightFilter)
            );
        });

        displayPlayers(filteredPlayers); // Display filtered players
    } catch (error) {
        console.error('Error applying filters:', error);
        alert('Failed to apply filters. Please try again later.');
    }
}

// Attach event listener to the "Apply Filters" button
document.getElementById('applyFiltersButton').addEventListener('click', applyFilters);


// Filter players based on search query
function searchPlayers() {
    const query = document.getElementById('searchBar').value.toLowerCase();

    // Filter players by name or position
    const filteredPlayers = allPlayers.filter(player =>
        player.name.toLowerCase().includes(query) ||
        player.position.toLowerCase().includes(query)
    );

    displayPlayers(filteredPlayers); // Update displayed list
}

// Fetch players on page load
fetchPlayers();






