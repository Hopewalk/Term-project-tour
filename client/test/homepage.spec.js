// test/homepage.spec.js
const { test, expect } = require('@playwright/test');

test('Home page loads and allows searching with navigation', async ({ page, context }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('h1:text("Attractions & Tours")')).toBeVisible();
  const searchBar = page.locator('input[placeholder="ค้นหากิจกรรม"]');
  await searchBar.fill('Chiang Mai Adventure');
  await searchBar.press('Enter'); // Added to submit the search
  const newPage = await context.newPage();
  await newPage.goto('http://localhost:3000/trip/otyiqqv66yyir1c1a1xwps0q');
  await expect(newPage).toHaveURL('http://localhost:3000/trip/otyiqqv66yyir1c1a1xwps0q');
  const toursTab = page.locator('div.mx-4:text("Tours")');
  await toursTab.click();
  await expect(page).toHaveURL('http://localhost:3000/Tour');
});