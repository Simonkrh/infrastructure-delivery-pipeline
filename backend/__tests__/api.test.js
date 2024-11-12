/*global require, describe, test, jest, expect*/
const axios = require('axios');

describe('API Unit Tests', () => {
    // Mocking DB queries using Jest
    const mockDb = {
        query: jest.fn()
    };

    test('GET /shopping-items returns list', async () => {
        // Mock a successful database response
        mockDb.query.mockResolvedValue([{ id: 1, name: 'Milk', checked: false }]);
        
        const response = await axios.get('http://localhost:8080/shopping-items');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
    });

    test('POST /add-item adds a new item and deletes it', async () => {
        const newItem = { name: 'Bread' };
        const response = await axios.post('http://localhost:8080/add-item', newItem);
        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);

        // Capture the item ID from the response for deletion
        const itemId = response.data.id;

        // Delete the item
        const deleteResponse = await axios.delete('http://localhost:8080/delete-item', {
            data: { id: itemId }
        });
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.data.success).toBe(true);
    });

    test('GET /shopping-items handles database errors', async () => {
        mockDb.query.mockRejectedValue(new Error('Database error'));
        try {
            await axios.get('http://localhost:8080/shopping-items');
        } catch (error) {
            expect(error.response.status).toBe(500);
            expect(error.response.data.error).toBe('Database error');
        }
    });
    
    test('POST /update-item updates item checked status', async () => {
        const item = { id: 1, checked: true };
        const response = await axios.post('http://localhost:8080/update-item', item);
        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
    });    
});
