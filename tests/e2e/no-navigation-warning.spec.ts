import { test, expect } from '@playwright/test';

test('E2E: no beforeunload warning thanks to auto-save', async ({ page, context }) => {
  // Zabezpieczenie: ustaw handler by wykryć ewentualny dialog
  let dialogShown = false;
  page.on('dialog', () => {
    dialogShown = true;
  });

  await page.goto('/');

  // Wpisz dane, ale nie zapisuj ręcznie
  await page.getByTestId('note-title-input').fill('Leave page test title');
  await page.getByTestId('note-body-textarea').fill('Leave page test body');

  // Poczekaj aż auto-save zapisze draft
  await page.waitForTimeout(2300);

  // Przejdź do innej strony (zewnętrzny URL) – nie powinno być beforeunload
  await page.goto('about:blank');

  // Zweryfikuj brak dialogu
  expect(dialogShown).toBe(false);
});


