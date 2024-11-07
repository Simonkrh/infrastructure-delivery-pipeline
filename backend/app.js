const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 8080;

// Use CORS to allow requests from the frontend
app.use(cors({
    origin: 'http://10.212.26.123'
}));

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'backend_user',
    password: 'N0m!sSecurePwd123',
    database: 'food_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Endpoint to get food items
app.get('/food-items', (req, res) => {
    const query = 'SELECT * FROM food_items';
    pool.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }
        res.json(results);
    });
});

// Endpoint to update the checked status of a food item
app.use(express.json()); // For parsing JSON body in requests
app.post('/update-item', (req, res) => {
    const { id, checked } = req.body;
    const query = 'UPDATE food_items SET checked = ? WHERE id = ?';
    pool.query(query, [checked, id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }

        // Broadcast the update to all WebSocket clients
        const update = JSON.stringify({ id, checked });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(update);
            }
        });

        res.status(200).json({ success: true });
    });
});

// Setup WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(port, () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
