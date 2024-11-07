const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 

const app = express();
const port = 3000;

// Use CORS to allow requests from frontend
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
    console.log("Received request for /food-items");

    const query = 'SELECT * FROM food_items';
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }
        console.log("Successfully fetched food items:", results);
        res.json(results);
    });
});

// Add a health check endpoint to test the database connection status
app.get('/health', (req, res) => {
    pool.query('SELECT 1', (err, results) => {
        if (err) {
            console.error('Health check failed:', err);
            res.status(500).json({ error: 'Database connection error', details: err.message });
        } else {
            console.log('Health check successful');
            res.status(200).json({ status: 'OK' });
        }
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
