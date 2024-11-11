/*global require*/
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 8080;

// Enable JSON parsing for request bodies 
app.use(express.json());

// CORS to allow access from both internal and external IPs
app.use(cors({
    origin: ['http://10.212.26.123', 'http://192.168.1.109'] 
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

// Endpoint to get shopping items
app.get('/shopping-items', (req, res) => {
    const query = 'SELECT * FROM food_items';
    pool.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }
        res.json(results);
    });
});

// Endpoint to add a new food item
app.post('/add-item', (req, res) => {
    const { name } = req.body; 
    const query = 'INSERT INTO food_items (name, checked) VALUES (?, false)';
    
    pool.query(query, [name], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }

        // Retrieve the new item ID
        const newItemId = results.insertId;

        // Construct the new item object to broadcast
        const newItem = {
            id: newItemId,
            name: name,
            checked: false
        };

        // Broadcast the new item to all WebSocket clients
        const update = JSON.stringify(newItem);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(update);
            }
        });

        res.status(200).json({ success: true, id: newItemId });
    });
});

// Endpoint to delete a shopping item
app.delete('/delete-item', (req, res) => {
    const { id } = req.body;
    const query = 'DELETE FROM food_items WHERE id = ?';

    pool.query(query, [id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }

        // Broadcast the deletion to all WebSocket clients
        const update = JSON.stringify({ id, deleted: true });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(update);
            }
        });

        res.status(200).json({ success: true });
    });
});

// Endpoint to update the checked status of a shopping item
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
