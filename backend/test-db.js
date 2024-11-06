const mysql = require('mysql2');

console.log("Attempting to connect to MySQL...");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'backend_user',
    password: 'N0m!sSecurePwd123',
    database: 'food_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting:', err.stack);
        return;
    }
    console.log('Connected as id', db.threadId);
    db.end((endErr) => {
        if (endErr) console.error('Error ending connection:', endErr.stack);
        else console.log('Connection ended successfully.');
    });
});
