function loadSavedTeams() {
    const savedTeamsContainer = document.getElementById('savedTeamsContainer');

    // Retrieve all saved teams from localStorage
    const savedTeams = JSON.parse(localStorage.getItem('savedTeams')) || [];

    // Clear the container before re-rendering
    savedTeamsContainer.innerHTML = '';

    if (savedTeams.length === 0) {
        savedTeamsContainer.innerHTML = '<p>No teams have been saved yet.</p>';
        return;
    }

    // Display each team
    savedTeams.forEach((team, index) => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'saved-team';

        // Team header with date and index
        const teamHeader = document.createElement('h3');
        teamHeader.innerText = `Team ${index + 1} (Saved on: ${team.date})`;
        teamDiv.appendChild(teamHeader);

        // List of players in the team
        const playerList = document.createElement('ul');
        playerList.className = 'team-list';

        team.players.forEach(player => {
            const listItem = document.createElement('li');
            listItem.innerText = `${player.name} (${player.position}) - Jersey #: ${player.jersey_number}`;
            playerList.appendChild(listItem);
        });

        teamDiv.appendChild(playerList);

        // Add Remove Team Button
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove Team';
        removeButton.className = 'remove-team-button';
        removeButton.onclick = () => removeTeam(index); // Pass the index of the team to be removed
        teamDiv.appendChild(removeButton);

        savedTeamsContainer.appendChild(teamDiv);
    });
}


function removeTeam(teamIndex) {
    // Retrieve all saved teams from localStorage
    let savedTeams = JSON.parse(localStorage.getItem('savedTeams')) || [];

    // Remove the selected team by index
    if (teamIndex >= 0 && teamIndex < savedTeams.length) {
        savedTeams.splice(teamIndex, 1);

        // Save the updated list back to localStorage
        localStorage.setItem('savedTeams', JSON.stringify(savedTeams));

        // Reload the teams to update the UI
        loadSavedTeams();

        alert('Team removed successfully!');
    } else {
        alert('Invalid team index.');
    }
}

loadSavedTeams();


