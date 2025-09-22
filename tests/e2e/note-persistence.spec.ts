import { test, expect } from '@playwright/test';

test('E2E: creates a note and persists after reload', async ({ page }) => {
  await page.goto('/');

  // Wprowadź dane notatki
  const title = 'E2E Tytuł notatki';
  const body = 'E2E Treść notatki';

  await page.getByTestId('note-title-input').fill(title);
  await page.getByTestId('note-body-textarea').fill(body);

  // Zapisz
  await page.getByTestId('save-button').click();

  // Sprawdź, że notatka pojawiła się na liście
  await expect(page.getByTestId('note-list')).toBeVisible();
  await expect(page.getByTestId('note-title').first()).toContainText(title);

  // Odśwież stronę
  await page.reload();

  // Po odświeżeniu notatka nadal jest widoczna
  await expect(page.getByTestId('note-list')).toBeVisible();
  await expect(page.getByTestId('note-title').first()).toContainText(title);
});


