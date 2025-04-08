const API_URL = 'http://localhost:3000/players';
// Fetch player ID from URL query parameters
function getPlayerIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Fetch and display player details
async function loadPlayerProfile() {
    const playerId = getPlayerIdFromUrl();
    
    if (!playerId) {
        alert('No player ID found!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${playerId}`);
        if (!response.ok) throw new Error('Failed to fetch player data.');

        const player = await response.json();

        const profileCard = document.getElementById('playerProfile');
        
        profileCard.innerHTML = `
            <div class="card">
                <h1 class="animated-text">${player.name}</h1>
                <p class="animated-text">Position: ${player.position}</p>
                <p class="animated-text">Age: ${player.age}</p>
                <p class="animated-text">Jersey Number: ${player.jersey_number}</p>
                <p class="animated-text">Nationality: ${player.nationality || 'N/A'}</p>
                <p class="animated-text">Height: ${player.height ? `${player.height} cm` : 'N/A'}</p>
                <p class="animated-text">Weight: ${player.weight ? `${player.weight} kg` : 'N/A'}</p>
                <p class="animated-text">Skills: ${player.skills || 'N/A'}</p>
            </div>
        `;
        
        // Add delay for each animated text element
        const animatedElements = document.querySelectorAll('.animated-text');
        animatedElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.2}s`; // Stagger animations by 0.2 seconds
        });
        
    } catch (error) {
        console.error('Error fetching player profile:', error);
        alert('Failed to load player profile.');
    }
}

// Load player profile on page load
document.addEventListener('DOMContentLoaded', loadPlayerProfile);
