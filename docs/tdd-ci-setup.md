# TDD + CI Setup Guide

## 🎯 Cel

Ten dokument opisuje jak pracować z Test-Driven Development (TDD) i Continuous Integration (CI) w naszym projekcie Vue 3.

## 🔄 TDD Workflow - Red, Green, Refactor

### 1. RED ❌ - Napisz test, który się nie powiedzie

```bash
# Najpierw napisz test w odpowiednim katalogu
# src/components/__tests__/NomeComponent.test.ts
# src/utils/__tests__/someUtils.test.ts

# Uruchom testy - powinny być RED (nieudane)
npm run test
```

### 2. GREEN ✅ - Napisz minimalną implementację

```bash
# Napisz kod, który sprawi że test przejdzie
# Nie przejmuj się jakością - cel to GREEN

# Uruchom testy ponownie
npm run test
```

### 3. REFACTOR 🔄 - Popraw kod zachowując testy GREEN

```bash
# Refaktoryzuj kod bez zmiany funkcjonalności
# Testy powinny nadal przechodzić

npm run test
```

## 🧪 Struktura Testów

```
src/
├── components/
│   ├── __tests__/
│   │   ├── Component.test.ts
│   │   └── AnotherComponent.test.ts
│   └── Component.vue
├── utils/
│   ├── __tests__/
│   │   └── utils.test.ts
│   └── utils.ts
└── __tests__/
    └── App.test.ts

tests/
└── e2e/
    ├── feature.spec.ts
    └── another-feature.spec.ts
```

## 📝 Konwencje Testów

### Nazewnictwo

- Pliki testów: `*.test.ts` (unit) lub `*.spec.ts` (E2E)
- Describe blocks: nazwa komponentu/funkcji
- Test cases: "powinien [oczekiwane zachowanie]"

### Przykład testu jednostkowego

```typescript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import MyComponent from "../MyComponent.vue";

describe("MyComponent", () => {
  it("powinien renderować tytuł", () => {
    const wrapper = mount(MyComponent, {
      props: { title: "Test Title" },
    });

    expect(wrapper.find("h1").text()).toBe("Test Title");
  });
});
```

## 🚀 Dostępne Komendy

### Testy Jednostkowe (Vitest)

```bash
npm run test          # Watch mode - uruchamia się automatycznie
npm run test:run      # Single run - do CI
npm run test:ui       # UI mode - wizualny interface
npm run test:coverage # Z pokryciem kodu
```

### Testy E2E (Playwright)

```bash
npm run test:e2e        # Uruchom wszystkie testy E2E
npm run test:e2e:ui     # UI mode dla E2E
npm run test:e2e:report # Pokaż raport z testów
```

### Linting i Formatowanie

```bash
npm run lint          # Sprawdź typy TypeScript
npm run lint:fix      # Popraw formatowanie
```

## 🔄 CI/CD Pipeline

### Workflow na GitHub Actions

1. **PR Validation** - uruchamia się przy każdym PR
   - Type checking
   - Unit tests
   - Build check
   - E2E tests (opcjonalnie)

2. **Main CI/CD** - uruchamia się przy push do main/develop
   - Wszystkie testy
   - Build
   - Deploy (tylko main branch)

### Konfiguracja Branch Protection

W ustawieniach repozytorium GitHub ustaw:

1. **Settings** → **Branches** → **Add rule**
2. **Branch name pattern**: `main`
3. Zaznacz:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ PR Validation / validate
   - ✅ Require pull request reviews

## 🪝 Pre-commit Hooks

### Co się dzieje przed commitem

```bash
# Automatycznie uruchamiają się:
1. Prettier (formatowanie kodu)
2. TypeScript check
3. Unit tests

# Jeśli cokolwiek się nie powiedzie - commit zostanie odrzucony
```

### Format Commit Messages

Używamy Conventional Commits:

```bash
feat(auth): dodaj logowanie użytkownika
fix(ui): napraw responsywność na mobile
docs(readme): zaktualizuj instrukcje
test(utils): dodaj testy dla formatowania
chore(deps): zaktualizuj zależności
```

## 🎯 TDD w Praktyce - Przykład

### Krok 1: Napisz test (RED)

```typescript
// src/utils/__tests__/validator.test.ts
import { describe, it, expect } from "vitest";
import { validateEmail } from "../validator";

describe("validateEmail", () => {
  it("powinien zaakceptować prawidłowy email", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });

  it("powinien odrzucić nieprawidłowy email", () => {
    expect(validateEmail("invalid-email")).toBe(false);
  });
});
```

### Krok 2: Uruchom test (RED)

```bash
npm run test
# ❌ Error: Cannot resolve import "../validator"
```

### Krok 3: Napisz minimalną implementację (GREEN)

```typescript
// src/utils/validator.ts
export function validateEmail(email: string): boolean {
  return email.includes("@");
}
```

### Krok 4: Uruchom test (GREEN)

```bash
npm run test
# ✅ All tests passed
```

### Krok 5: Refaktoryzuj (GREEN)

```typescript
// src/utils/validator.ts
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

## 📋 Checklist przed PR

- [ ] Wszystkie testy przechodzą lokalnie (`npm run test:run`)
- [ ] Kod jest sformatowany (`npm run lint:fix`)
- [ ] Dodano testy dla nowej funkcjonalności
- [ ] E2E testy przechodzą (jeśli dotyczy)
- [ ] Commit messages w prawidłowym formacie
- [ ] PR ma opisową nazwę i opis

## 🐛 Troubleshooting

### "cleanup is not a function"

```bash
# Usuń node_modules i zainstaluj ponownie
rm -rf node_modules package-lock.json
npm install
```

### Testy E2E nie działają

```bash
# Reinstaluj Playwright browsers
npx playwright install
```

### Pre-commit hook nie działa

```bash
# Reinstaluj husky
npm run prepare
```

## 📚 Dodatkowe Zasoby

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Docs](https://playwright.dev/)
- [TDD Best Practices](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

**Pamiętaj**: TDD to nie tylko pisanie testów - to sposób myślenia o kodzie. Zacznij od określenia czego oczekujesz, a potem napisz kod, który to spełni.
