/*global require, describe, beforeAll, afterAll, test, expect*/
const puppeteer = require('puppeteer');

describe('Shopping List E2E Test', () => {
    let browser;
    let page;

    // Set up Puppeteer browser before all tests
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Disable sandbox for compatibility
        });
        page = await browser.newPage();
    });

    // Close the browser after all tests
    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });

    test('Add a new item to the shopping list', async () => {
        // Open the frontend page
        await page.goto('http://10.212.26.123:8080/');
        
        // Generate a unique item name
        const uniqueItem = `Eggs ${Date.now()}`;
        
        // Type the unique item in the input field
        await page.type('#new-shopping-item', uniqueItem);
        
        // Click the 'Add Shopping Item' button
        await page.click('#add-shopping-item');
        
        // Wait until the item appears in the list
        await page.waitForFunction(
            (itemName) => {
                const items = Array.from(document.querySelectorAll('#shopping-list .shopping-item label'));
                return items.some(item => item.textContent === itemName);
            },
            {},
            uniqueItem
        );
    
        // Verify that the item was found in the list
        const itemExists = await page.evaluate((itemName) => {
            const items = Array.from(document.querySelectorAll('#shopping-list .shopping-item label'));
            return items.some(item => item.textContent === itemName);
        }, uniqueItem);
    
        expect(itemExists).toBe(true);
    });

    test('Check if an item can be marked as complete', async () => {
        // Open the frontend page
        await page.goto('http://10.212.26.123:8080/');

        // Locate the checkbox for the newly added item
        const checkboxSelector = '#shopping-list .shopping-item:last-child input[type="checkbox"]';
        await page.waitForSelector(checkboxSelector);

        // Mark item as complete
        await page.click(checkboxSelector);

        // Verify that the item has been marked as checked
        const isChecked = await page.$eval(checkboxSelector, checkbox => checkbox.checked);
        expect(isChecked).toBe(true);
    });

    test('Delete an item from the shopping list', async () => {
        // Open the frontend page
        await page.goto('http://10.212.26.123:8080/');

        // Generate a unique item name for deletion test
        const uniqueItem = `Milk ${Date.now()}`;

        // Add a new item for deletion
        await page.type('#new-shopping-item', uniqueItem);
        await page.click('#add-shopping-item');

        // Wait for the new item to appear
        await page.waitForFunction(
            (itemName) => {
                const items = Array.from(document.querySelectorAll('#shopping-list .shopping-item label'));
                return items.some(item => item.textContent === itemName);
            },
            {},
            uniqueItem
        );

        // Locate and click the delete button for the added item
        const deleteButtonSelector = '#shopping-list .shopping-item:last-child button';
        await page.waitForSelector(deleteButtonSelector);
        await page.click(deleteButtonSelector);

        // Verify the item is no longer in the list
        const itemExistsAfterDelete = await page.evaluate((itemName) => {
            const items = Array.from(document.querySelectorAll('#shopping-list .shopping-item label'));
            return items.some(item => item.textContent === itemName);
        }, uniqueItem);

        expect(itemExistsAfterDelete).toBe(false);
    });
});
