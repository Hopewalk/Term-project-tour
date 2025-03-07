import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/Home");
  await page.getByRole("menuitem", { name: "เข้าสู่ระบบ" }).click();
  await page.getByRole("textbox", { name: "username" }).click();
  await page.getByRole("textbox", { name: "username" }).fill("admin");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("123456");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Edit Tours" }).click();
  await page.locator(".ant-btn").first().click();
  await page.getByPlaceholder("Price").click();
  await page.getByPlaceholder("Price").fill("600000");
  await page.getByRole("textbox", { name: "Tour Name" }).click();
  await page
    .getByRole("textbox", { name: "Tour Name" })
    .fill("Trang Island Hopeless");
  await page.locator(".ant-select-selection-overflow").click();
  await page.getByText("Package with Accommodation", { exact: true }).click();
  await page.locator(".ant-select-selection-overflow").click();
  await page.locator(".ant-select-selection-overflow").click();
  await page.getByText("Recommend", { exact: true }).click();
  await page.getByLabel("Edit Tour").getByText("Category").click();
  await page.getByRole("button", { name: "Save" }).click();
});
