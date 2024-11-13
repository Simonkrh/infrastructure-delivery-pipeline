/*global require, describe, beforeAll, afterAll, test, expect, jest */
const axios = require('axios');

// Mock mysql2/promise
jest.mock('mysql2/promise', () => {
  return {
    createConnection: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue([[{ id: 1, name: 'Mock Item', checked: false }]]), // Mocked response
      end: jest.fn().mockResolvedValue(),
    }),
  };
});

const mysql = require('mysql2/promise');

describe('Backend-Database Integration Tests (with Mocked DB)', () => {
  let connection;

  beforeAll(async () => {
    // Using the mocked connection here
    connection = await mysql.createConnection();
  });

  afterAll(async () => {
    await connection.end(); // Ends the mocked connection
  });

  test('Fetch items from database via API', async () => {
    // Mock axios call to simulate backend API request
    const response = await axios.get('http://localhost:8080/shopping-items');
    
    // Expectations based on the mock data
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data).toEqual([{ id: 1, name: 'Mock Item', checked: false }]);
  });
});
