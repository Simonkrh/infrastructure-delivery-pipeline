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

        // Type a new item in the input field
        await page.type('#new-shopping-item', 'Eggs');

        // Click the 'Add Shopping Item' button
        await page.click('#add-shopping-item');

        // Wait for the new item to appear in the shopping list
        await page.waitForSelector('#shopping-list .shopping-item');

        // Verify the item appears in the list
        const itemText = await page.$eval('#shopping-list .shopping-item:last-child label', el => el.textContent);
        expect(itemText).toBe('Eggs');
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
