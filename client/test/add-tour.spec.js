const { test, expect } = require('@playwright/test');

test.describe('AddTour Component E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/Home');

        await page.route('**/tour-categories', (route) =>
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    data: [
                        { id: 1, category_name: 'Adventure' },
                        { id: 2, category_name: 'Relaxation' },
                    ],
                }),
            })
        );
        await page.route('**/accommodations', (route) =>
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    data: [
                        { id: 1, name: 'Hotel A' },
                        { id: 2, name: 'Resort B' },
                    ],
                }),
            })
        );
        await page.route('**/regions', (route) =>
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    data: [
                        { id: 1, province: 'Bangkok' },
                        { id: 2, province: 'Chiang Mai' },
                    ],
                }),
            })
        );
        await page.route('**/upload', (route) =>
            route.fulfill({
                status: 200,
                body: JSON.stringify([{ id: 'img1' }]),
            })
        );
        await page.route('**/tours', (route) =>
            route.fulfill({
                status: 200,
                body: JSON.stringify({ success: true }),
            })
        );

        await page.getByRole('menuitem', { name: 'เข้าสู่ระบบ' }).click();
        await page.getByRole('textbox', { name: 'username' }).fill('admin');
        await page.getByRole('textbox', { name: 'Password' }).fill('123456');
        await page.getByRole('button', { name: 'Login' }).click();

        await page.getByRole('link', { name: 'Create' }).click();

        await expect(page.locator('div.ant-tabs-tab-active >> text="Create Tour"')).toBeVisible();
    });

    test('should fill and verify Tour Name input', async ({ page }) => {
        await page.waitForSelector('input[placeholder="กรอกชื่อทัวร์"]', { timeout: 60000 });

        const tourNameInput = page.getByRole('textbox', { name: 'กรอกชื่อทัวร์' });
        await tourNameInput.fill('Test Tour 2023');

        await expect(tourNameInput).toHaveValue('Test Tour 2023');
    });
});