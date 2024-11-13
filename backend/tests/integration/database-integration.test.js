/*global require, describe, beforeAll, afterAll, test, expect*/
const mysql = require('mysql2/promise');
const axios = require('axios');

describe('Backend-Database Integration Tests', () => {
    let connection;

    beforeAll(async () => {
        connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'backend_user',
            password: 'N0m!sSecurePwd123',
            database: 'food_db'
        });
    });

    afterAll(async () => {
        await connection.end();
    });

    test('Fetch items from database via API', async () => {
        const response = await axios.get('http://localhost:8080/shopping-items');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
    });
});
