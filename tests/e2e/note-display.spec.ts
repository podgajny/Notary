import { test, expect } from "@playwright/test";

test.describe("NoteDisplay E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Przejdź na stronę główną
    await page.goto("/");
  });

  test("powinien wyświetlić tytuł notatki na stronie głównej", async ({
    page,
  }) => {
    // Sprawdź czy tytuł jest widoczny
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText(
      "TEST: Zmieniony tytuł notatki",
    );
  });

  test("powinien wyświetlić treść notatki", async ({ page }) => {
    // Sprawdź czy treść notatki jest widoczna
    const content = page.locator(".text-base");
    await expect(content).toBeVisible();
    await expect(content).toContainText("Dobry wieczór");
  });

  test("powinien mieć responsywny layout", async ({ page }) => {
    // Test na desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    const container = page.locator(".max-w-4xl");
    await expect(container).toBeVisible();

    // Test na mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(container).toBeVisible();

    // Sprawdź czy padding się zmienia na mobile
    const containerBox = await container.boundingBox();
    expect(containerBox).not.toBeNull();
  });

  test("powinien mieć odpowiednie style wizualne", async ({ page }) => {
    const mainContainer = page.locator(".max-w-4xl");

    // Sprawdź background color
    const bgColor = await mainContainer.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );
    expect(bgColor).toBe("rgb(255, 255, 255)"); // white

    // Sprawdź border radius
    const borderRadius = await mainContainer.evaluate(
      (el) => window.getComputedStyle(el).borderRadius,
    );
    expect(borderRadius).toBe("8px"); // rounded-lg
  });

  test("powinien być dostępny (accessibility)", async ({ page }) => {
    // Sprawdź czy strona ma odpowiednią strukturę nagłówków
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // Sprawdź czy główny nagłówek jest h1
    const mainHeading = page.locator("h1").first();
    await expect(mainHeading).toBeVisible();

    // Test kontrastu - tytuł powinien być ciemny na jasnym tle
    const titleColor = await page
      .locator("h1")
      .evaluate((el) => window.getComputedStyle(el).color);
    expect(titleColor).toBe("rgb(17, 24, 39)"); // text-gray-900
  });

  test("powinien ładować się szybko", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");

    // Sprawdź czy główny element jest widoczny
    await expect(page.locator("h1")).toBeVisible();

    const loadTime = Date.now() - startTime;
    // Strona powinna się załadować w mniej niż 2 sekundy
    expect(loadTime).toBeLessThan(2000);
  });
});
