import { test as base, expect } from '@playwright/test';

// Enable touch support for this suite
const test = base.extend({
  contextOptions: async ({}, use) => {
    await use({ hasTouch: true });
  },
});

test.describe('Mobile responsiveness and touch interactions (CMD-76 / 6.6)', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 12/13/14

  test('Editor and list layout works on mobile and touch interactions succeed', async ({ page }) => {
    await page.goto('/');

    // Ensure single column grid on mobile when notes exist (md breakpoint starts at > mobile)
    const grid = page.getByTestId('note-grid');

    // Interact with inputs using touch-like events
    const title = page.getByTestId('note-title-input');
    const body = page.getByTestId('note-body-textarea');
    const save = page.getByTestId('save-button');

    await title.click();
    await title.fill('Mobile test note');
    await body.click();
    await body.fill('This is a body entered on mobile viewport.');

    // Touch target should be at least 44px tall
    const saveBox = await save.boundingBox();
    expect(saveBox).not.toBeNull();
    if (saveBox) {
      expect(saveBox.height).toBeGreaterThanOrEqual(44);
      expect(saveBox.width).toBeGreaterThanOrEqual(44);
    }

    await save.click();

    // Note should appear in the list at the top
    await expect(page.getByTestId('note-list')).toBeVisible();
    await expect(page.getByTestId('note-item').first()).toBeVisible();

    // When grid is visible, it should have one column on mobile (computed via CSS)
    // We cannot read computed grid template columns directly cross-browser reliably,
    // but we can ensure cards stack vertically by checking first two items Y positions.
    const items = page.getByTestId('note-item');
    const count = await items.count();
    if (count >= 2) {
      const box1 = await items.nth(0).boundingBox();
      const box2 = await items.nth(1).boundingBox();
      expect(box1 && box2).toBeTruthy();
      if (box1 && box2) {
        // In a single column, the second item should be below the first (higher y)
        expect(box2.y).toBeGreaterThan(box1.y + 10);
      }
    }
  });
});


