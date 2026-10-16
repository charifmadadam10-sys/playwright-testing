import { test, expect } from '@playwright/test';
test('login', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.getByLabel('Username').fill('student');
    await page.getByLabel('Password').fill('Password123');
    await page.getByRole('button', { name: 'Submit' }).click();
    expect(page.url()).toBe('https://practicetestautomation.com/logged-in-successfully/');
})
test('login ID', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.locator('#username').fill('student');
    await page.locator('#password').fill('Password123');
    await page.locator('#submit').click();
    expect(page.url()).toBe('https://practicetestautomation.com/logged-in-successfully/');
})
test('codegen', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('student');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Password123');
  await page.getByRole('button', { name: 'Submit' }).click();
});

test('Usernamefalse', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');
  await page.getByRole('textbox', { name: 'Username' }).fill('charif');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password123');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('#error')).toHaveText('Your username is invalid!');
});
test('Passwordfalse', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');
  await page.getByRole('textbox', { name: 'Username' }).fill('student');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('#error')).toHaveText('Your password is invalid!');
});