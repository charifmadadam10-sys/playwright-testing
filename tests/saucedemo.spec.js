import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');

})
// test('test', async ({ page }) => {
//   await page.goto('https://www.saucedemo.com/');
//   await page.locator('[data-test="username"]').click();
//   await page.locator('[data-test="username"]').fill('standard_user');
//   await page.locator('[data-test="password"]').click();
//   await page.locator('[data-test="password"]').fill('secret_sauce');
//   await page.locator('[data-test="login-button"]').click();
//   await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
//   await page.locator('[data-test="shopping-cart-link"]').click();
//   await page.locator('[data-test="item-quantity"]').click();
// });
test('verify item quantity', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1');

    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');

    await page.locator('[data-test="firstName"]').fill('charif');
    await page.locator('[data-test="lastName"]').fill('madadam');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1');

    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
});