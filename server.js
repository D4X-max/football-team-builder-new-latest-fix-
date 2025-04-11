
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const path = require('path');
const { exec } = require('child_process');


app.use(bodyParser.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'FootballTeamDB' // Replace with your database name
}); 

//--------------------------------------------------//
// Secret key for JWT
const SECRET_KEY = 'your_secret_key';

// POST /register - Register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO Users (username, password, role) VALUES (?, ?, "user")',
            [username, hashedPassword],
            (err) => {
                if (err) {
                    console.error('Error registering user:', err.message);
                    return res.status(500).json({ error: 'Failed to register user.' });
                }
                res.json({ message: 'User registered successfully!' });
            }
        );
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /login - Authenticate a user or admin
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    db.query(
        'SELECT * FROM Users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) {
                console.error('Error fetching user:', err.message);
                return res.status(500).json({ error: 'Failed to fetch user.' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid username or password.' });
            }

            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid username or password.' });
            }

            const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

            res.json({ message: 'Login successful!', token, role: user.role });
        }
    );
});

//-------------------------------------------------------------------//

app.get('/', (req, res) => {
    res.send('Welcome to the Football Team API!');
});

// Connect to MySQL database
db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1); // Exit the application if the database connection fails
    }
    console.log('✅ Connected to MySQL database.');
});

// Start server on configurable port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

app.post('/matches', (req, res) => {
    const { name, date } = req.body;

    db.query(
        'INSERT INTO Matches (name, date) VALUES (?, ?)',
        [name, date],
        (err, results) => {
            if (err) {
                console.error('Error creating match:', err.message);
                return res.status(500).json({ error: 'Failed to create match.' });
            }
            res.json({ message: 'Match created successfully!', id: results.insertId });
        }
    );
});
// DELETE /players/:id - Delete a player by ID
app.delete('/players/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Player ID is required.' });
    }

    db.query('DELETE FROM Players WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting player:', err.message);
            return res.status(500).json({ error: 'Failed to delete player.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Player not found.' });
        }

        res.json({ message: 'Player deleted successfully!' });
    });
});


// DELETE /matches/:id - Delete a match by ID
// DELETE /matches/:id - Delete a match by ID
app.delete('/matches/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Match ID is required.' });
    }

    // First, delete associated player stats for the match
    db.query('DELETE FROM PlayerStats WHERE match_id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting player stats for match:', err.message);
            return res.status(500).json({ error: 'Failed to delete player stats for the match.' });
        }

        // Then, delete the match itself
        db.query('DELETE FROM Matches WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Error deleting match:', err.message);
                return res.status(500).json({ error: 'Failed to delete match.' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Match not found.' });
            }

            res.json({ message: 'Match and associated stats deleted successfully!' });
        });
    });
});





//--------------------------------------------------------------------------------------------------//

app.post('/stats', (req, res) => {
    const statsData = req.body;

    if (!Array.isArray(statsData) || statsData.length === 0) {
        return res.status(400).json({ error: 'Player stats data is required.' });
    }

    // Prepare values for batch insertion
    const values = statsData.map(stat => [
        stat.matchId,
        stat.playerId,
        stat.goals,
        stat.assists,
        stat.minutesPlayed,
    ]);

    // Insert player stats into the database
    db.query(
        'INSERT INTO PlayerStats (match_id, player_id, goals, assists, minutes_played) VALUES ?',
        [values],
        (err) => {
            if (err) {
                console.error('Error inserting player stats:', err.message);
                return res.status(500).json({ error: 'Failed to update player stats.' });
            }

            res.json({ message: 'Player stats updated successfully!' });
        }
    );
});

// ------------------------------------------------------//
app.get('/matches/stats', (req, res) => {
    const query = `
        SELECT Matches.id AS match_id, Matches.name AS match_name, Matches.date AS match_date,
               Players.name AS player_name, Players.position, PlayerStats.goals, PlayerStats.assists, PlayerStats.minutes_played
        FROM Matches
        LEFT JOIN PlayerStats ON Matches.id = PlayerStats.match_id
        LEFT JOIN Players ON PlayerStats.player_id = Players.id
        ORDER BY Matches.date DESC, Players.name ASC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching match stats:', err.message);
            return res.status(500).json({ error: 'Failed to fetch match stats.' });
        }

        res.json(results);
    });
});
//----------------------------------------------//

//SWAPPING FUNCTION
app.post('/swap', async (req, res) => {
    const { currentPlayerId, newPlayerId } = req.body;

    if (!currentPlayerId || !newPlayerId) {
        return res.status(400).json({ error: 'Both player IDs are required.' });
    }

    try {
        // Fetch positions of both players
        const [rows] = await db.promise().query(
            'SELECT id, position FROM Players WHERE id IN (?, ?)',
            [currentPlayerId, newPlayerId]
        );

        if (rows.length !== 2) {
            return res.status(404).json({ error: 'One or both players not found.' });
        }

        const currentPlayerPosition = rows.find(row => row.id === currentPlayerId).position;
        const newPlayerPosition = rows.find(row => row.id === newPlayerId).position;

        // Swap positions in the database
        await db.promise().query(
            `UPDATE Players SET position = CASE 
                WHEN id = ? THEN ?
                WHEN id = ? THEN ?
            END WHERE id IN (?, ?)`,
            [currentPlayerId, newPlayerPosition, newPlayerId, currentPlayerPosition, currentPlayerId, newPlayerId]
        );

        res.json({ message: 'Players swapped successfully!' });
    } catch (error) {
        console.error('Error swapping players:', error.message);
        res.status(500).json({ error: 'Failed to swap players.' });
    }
});





// GET all players
app.get('/players', (req, res) => {
    db.query('SELECT * FROM Players', (err, results) => {
        if (err) {
            console.error('❌ Error fetching players:', err.message);
            return res.status(500).json({ error: 'Failed to fetch players.' });
        }
        res.json(results);
    });
});

//POST players query
app.post('/players', (req, res) => {
    const { name, position, age, jersey_number, nationality, height, weight, skills } = req.body;

    if (!name || !position || !age || !jersey_number) {
        return res.status(400).json({ error: 'Name, position, age, and jersey number are required.' });
    }

    db.query(
        'INSERT INTO Players (name, position, age, jersey_number, nationality, height, weight, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, position, age, jersey_number, nationality || null, height || null, weight || null, skills || null],
        (err, results) => {
            if (err) {
                console.error('Error adding player:', err.message);
                return res.status(500).json({ error: 'Failed to add player.' });
            }
            res.json({ message: 'Player added successfully!', id: results.insertId });
        }
    );
});



// GET a player by ID
app.get('/players/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM Players WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Error fetching player:', err.message);
            return res.status(500).json({ error: 'Failed to fetch player.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Player not found.' });
        }

        res.json(results[0]); // Return the first result (player details)
    });
});

// PUT (update) a player by ID
app.put('/players/:id', (req, res) => {
    const { id } = req.params;
    const { name, position, age, jersey_number, nationality, height, weight, skills } = req.body;

    if (!name || !position || !age || !jersey_number) {
        return res.status(400).json({ error: 'Name, position, age, and jersey number are required.' });
    }

    db.query(
        'UPDATE Players SET name = ?, position = ?, age = ?, jersey_number = ?, nationality = ?, height = ?, weight = ?, skills = ? WHERE id = ?',
        [name, position, age, jersey_number, nationality || null, height || null, weight || null, skills || null, id],
        (err) => {
            if (err) {
                console.error('Error updating player:', err.message);
                return res.status(500).json({ error: 'Failed to update player.' });
            }
            res.json({ message: 'Player updated successfully!' });
        }
    );
});


// DELETE /players/:id - Delete a player by ID
app.delete('/players/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Player ID is required.' });
    }

    db.query('DELETE FROM Players WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting player:', err.message);
            return res.status(500).json({ error: 'Failed to delete player.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Player not found.' });
        }

        res.json({ message: 'Player deleted successfully!' });
    });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server and open the user-login.html page in the browser
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    // Open the user-login.html page in the default browser
    const url = `file:///C:/Users/user/Documents/SQL/Mini-Projects-main-main/Mini-Projects-main-main/Mini-Projects-main/football-team-builder/user-login.html`;

    // Use platform-specific commands to open the browser
    const platform = process.platform;
    if (platform === 'win32') {
        exec(`start ${url}`); // Windows command
    } else if (platform === 'darwin') {
        exec(`open ${url}`); // macOS command
    } else if (platform === 'linux') {
        exec(`xdg-open ${url}`); // Linux command
    }
});

// Dummy admin credentials
const ADMIN_USERNAME = 'dhruvs';
const ADMIN_PASSWORD = 'pass123';

// Admin Login Route
app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;

    // Check if the provided credentials match the dummy credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return res.json({ message: 'Admin login successful!' });
    }

    // If credentials are incorrect
    res.status(401).json({ error: 'Invalid admin username or password.' });
});


/// admin dashboard
app.get('/users', (req, res) => {
    db.query('SELECT id, username, role, created_at FROM Users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).json({ error: 'Failed to fetch users.' });
        }

        res.json(results);
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    db.query('DELETE FROM Users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err.message);
            return res.status(500).json({ error: 'Failed to delete user.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ message: 'User deleted successfully!' });
    });
});










