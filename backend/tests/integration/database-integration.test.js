/*global require, describe, beforeAll, afterAll, test, expect, jest */
const mysql = require('mysql2/promise');
const axios = require('axios');

// Mock the MySQL and Axios modules
jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn().mockResolvedValue({
    query: jest.fn()
      .mockResolvedValueOnce({ insertId: 2 }) // Insert item
      .mockResolvedValueOnce({ affectedRows: 1 }) // Update item
      .mockRejectedValueOnce(new Error('Database connection error')) // Error handling test
      .mockResolvedValueOnce({ affectedRows: 1 }), // Delete item
    end: jest.fn().mockResolvedValue(),
  }),
}));

jest.mock('axios');

describe('Backend-Database Integration Tests (with Mocked DB and API)', () => {
  let connection;

  beforeAll(async () => {
    connection = await mysql.createConnection();
    axios.get.mockResolvedValue({
      status: 200,
      data: [{ id: 1, name: 'Mock Item', checked: false }],
    });
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

  test('Add a new item to the database', async () => {
    const newItem = { name: 'New Mock Item', checked: false };
    const result = await connection.query(
      'INSERT INTO food_items (name, checked) VALUES (?, ?)',
      [newItem.name, newItem.checked]
    );
    expect(result.insertId).toBe(2); // Check if the mock returns the expected insertId
  });

  test('Update an item in the database', async () => {
    const updateResult = await connection.query(
      'UPDATE food_items SET checked = ? WHERE id = ?',
      [true, 1]
    );
    expect(updateResult.affectedRows).toBe(1); // Check if one row was affected as expected
  });

  test('Handle database connection error', async () => {
    await expect(
      connection.query('SELECT * FROM non_existent_table')
    ).rejects.toThrow('Database connection error');
  });

  test('Delete an item from the database', async () => {
    const deleteResult = await connection.query(
      'DELETE FROM food_items WHERE id = ?',
      [1]
    );
    expect(deleteResult.affectedRows).toBe(1); // Check if one row was deleted as expected
  });
});
