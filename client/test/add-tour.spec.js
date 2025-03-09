import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/Home');
    await page.getByRole('menuitem', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: 'username' }).click();
    await page.getByRole('textbox', { name: 'username' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('123456');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Create' }).click();
    await page.getByRole('textbox', { name: 'กรอกชื่อทัวร์' }).click();
    await page.getByRole('textbox', { name: 'กรอกชื่อทัวร์' }).fill('1');
    await page.getByRole('textbox', { name: 'กรอกอธิบายทัวร์' }).click();
    await page.getByRole('textbox', { name: 'กรอกอธิบายทัวร์' }).fill('2');
    await page.getByRole('textbox', { name: 'จุดหมายปลายทาง' }).click();
    await page.getByRole('textbox', { name: 'จุดหมายปลายทาง' }).fill('3');
    await page.getByPlaceholder('กรอกราคา').click();
    await page.getByPlaceholder('กรอกราคา').fill('4');
    await page.getByRole('button', { name: 'Submit' }).click();
});