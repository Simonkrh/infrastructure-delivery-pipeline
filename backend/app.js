const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 

const app = express();
const port = 3000;

// Use CORS to allow requests from frontend
app.use(cors({
    origin: 'http://10.212.26.123' 
}));

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'backend_user',
    password: 'N0m!sSecurePwd123',
    database: 'food_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Endpoint to get food items
app.get('/food-items', (req, res) => {
    const query = 'SELECT * FROM food_items';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
