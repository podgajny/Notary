import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check that the page loads without errors
  await expect(page).toHaveTitle(/Vite \+ Vue/);
});
