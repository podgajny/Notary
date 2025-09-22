import { test, expect } from '@playwright/test';

test('E2E: auto-save draft and recovery after refresh', async ({ page }) => {
  await page.goto('/');

  const draftTitle = 'E2E Draft Title';
  const draftBody = 'E2E Draft Body';

  // Wpisz dane do edytora, ale nie zapisuj
  await page.getByTestId('note-title-input').fill(draftTitle);
  await page.getByTestId('note-body-textarea').fill(draftBody);

  // Poczekaj na debounce auto-save (2s) + bufor
  await page.waitForTimeout(2300);

  // Sprawdź wskaźnik niezapisanych zmian (draft istnieje)
  await expect(page.getByTestId('unsaved-indicator')).toBeVisible();

  // Odśwież stronę
  await page.reload();

  // Po odświeżeniu formularz powinien zostać odtworzony z draftu
  await expect(page.getByTestId('note-title-input')).toHaveValue(draftTitle);
  await expect(page.getByTestId('note-body-textarea')).toHaveValue(draftBody);
});


