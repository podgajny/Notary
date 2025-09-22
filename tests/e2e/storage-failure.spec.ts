import { test, expect } from '@playwright/test';

test('E2E: storage failure shows inline error message', async ({ page }) => {
  // Symuluj niedostępność IndexedDB zanim aplikacja się załaduje
  await page.addInitScript(() => {
    // @ts-ignore
    delete (window as any).indexedDB;
  });

  await page.goto('/');

  // Wprowadź dane i spróbuj zapisać
  await page.getByTestId('note-title-input').fill('Failing save');
  await page.getByTestId('save-button').click();

  // Oczekuj komunikatu błędu w edytorze
  const error = page.getByTestId('error-message');
  await expect(error).toBeVisible();
  await expect(error).toContainText('Błąd podczas');
});


