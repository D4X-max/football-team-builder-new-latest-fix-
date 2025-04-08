
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'FootballTeamDB' // Replace with your database name
});

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


app.post('/swap', (req, res) => {
    const { currentPlayerId, newPlayerId } = req.body;

    db.query(
        `UPDATE Players SET position =
         CASE WHEN id=? THEN (SELECT position FROM Players WHERE id=?)
              WHEN id=? THEN (SELECT position FROM Players WHERE id=?) END 
         WHERE id IN (?, ?)`,
         [currentPlayerId, newPlayerId, newPlayerId, currentPlayerId, currentPlayerId, newPlayerId],
         (err) => {
             if (err) return res.status(500).json({ message: 'Failed to swap players.' });
             res.json({ message: 'Players swapped successfully!' });
         }
     );
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


// DELETE a player by ID
app.delete('/players/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Players WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('❌ Error deleting player:', err.message);
            return res.status(500).json({ error: 'Failed to delete player.' });
        }
        res.json({ message: 'Player deleted successfully!' });
    });
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found.' });
});









