/*global require, describe, beforeAll, afterAll, test, expect, jest */
const mysql = require('mysql2/promise');
const axios = require('axios');

jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue([[{ id: 1, name: 'Mock Item', checked: false }]]), // Mocked DB response
    end: jest.fn().mockResolvedValue(),
  }),
}));

// Mock the axios module
jest.mock('axios');

describe('Backend-Database Integration Tests (with Mocked DB and API)', () => {
  let connection;

  beforeAll(async () => {
    connection = await mysql.createConnection();
    axios.get.mockResolvedValue({
      status: 200,
      data: [{ id: 1, name: 'Mock Item', checked: false }],
    }); // Mocked API response
  });

  afterAll(async () => {
    await connection.end();
  });

  test('Fetch items from database via API', async () => {
    const response = await axios.get('http://localhost:8080/shopping-items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data).toEqual([{ id: 1, name: 'Mock Item', checked: false }]);
  });
});
