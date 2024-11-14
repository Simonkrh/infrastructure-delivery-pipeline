/*global require, describe, beforeAll, afterAll, test, expect*/
const puppeteer = require('puppeteer');

describe('Shopping List E2E Test', () => {
    let browser;
    let page;

    // Set up Puppeteer browser before all tests
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']  // Disable sandbox for compatibility
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
    
        // Wait for the new item to appear in the shopping list
        await page.waitForSelector('#shopping-list .shopping-item');
    
        // Search for the item by its unique name in the shopping list
        const itemExists = await page.evaluate((itemName) => {
            const items = Array.from(document.querySelectorAll('#shopping-list .shopping-item label'));
            return items.some(item => item.textContent === itemName);
        }, uniqueItem);
    
        // Verify that the item was found in the list
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
});
