# Notary Vue - TDD + CI Setup

Vue 3 aplikacja z pełną konfiguracją TDD (Test-Driven Development) i CI/CD.

## 🚀 Quick Start

```bash
# Zainstaluj zależności
npm install

# Uruchom dev server
npm run dev

# Uruchom testy w watch mode
npm run test
```

## 🧪 Test-Driven Development

Ten projekt jest skonfigurowany do pracy z TDD. Zobacz przykłady w:

- `src/components/__tests__/NoteCounter.test.ts` - przykład TDD dla komponentu Vue
- `src/utils/__tests__/noteUtils.test.ts` - przykład TDD dla funkcji utility

### TDD Workflow

1. **RED ❌** - Napisz test, który się nie powiedzie
2. **GREEN ✅** - Napisz minimalną implementację
3. **REFACTOR 🔄** - Popraw kod zachowując testy

```bash
# Sprawdź status TDD - niektóre testy są RED (to jest OK!)
npm run test:run
```

## 🛠️ Dostępne Komendy

### Development

```bash
npm run dev          # Serwer deweloperski (port 5173)
npm run build        # Build produkcyjny
npm run preview      # Preview buildu
```

### Testy

```bash
npm run test         # Unit tests (watch mode)
npm run test:run     # Unit tests (single run)
npm run test:ui      # Unit tests (UI mode)
npm run test:coverage # Z pokryciem kodu

npm run test:e2e     # E2E tests (Playwright)
npm run test:e2e:ui  # E2E UI mode
```

### Quality

```bash
npm run lint         # TypeScript check
npm run lint:fix     # Formatowanie kodu
```

## 🔧 Stack Technologiczny

### Core

- **Vue 3** - Framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Styling

### Testing

- **Vitest** - Unit testing framework
- **Vue Test Utils** - Vue testing utilities
- **Playwright** - E2E testing
- **@testing-library/jest-dom** - Extended matchers

### CI/CD

- **GitHub Actions** - CI/CD pipeline
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting

## 📁 Struktura Projektu

```
src/
├── components/           # Komponenty Vue
│   ├── __tests__/       # Testy komponentów
│   └── *.vue
├── utils/               # Funkcje pomocnicze
│   ├── __tests__/       # Testy utility
│   └── *.ts
├── views/               # Komponenty stron
├── assets/              # Statyczne assety
└── __tests__/           # Testy główne

tests/
└── e2e/                 # Testy End-to-End

.github/
└── workflows/           # GitHub Actions
    ├── ci.yml          # Main CI/CD
    └── pr-validation.yml # PR validation

docs/                    # Dokumentacja
├── tdd-ci-setup.md     # Przewodnik TDD + CI
└── branch-protection-setup.md # Konfiguracja GitHub
```

## 🔄 CI/CD Pipeline

### Automatyczne Sprawdzenia

Każdy PR przechodzi przez:

- ✅ TypeScript type checking
- ✅ Unit tests (Vitest)
- ✅ Build verification
- ✅ E2E tests (opcjonalnie)
- ✅ Code formatting

### Branch Protection

Main branch jest chroniony i wymaga:

- ✅ Przejścia wszystkich testów
- ✅ Approval od innego developera
- ✅ Aktualnej wersji branch'a

## 🪝 Pre-commit Hooks

Przed każdym commitem automatycznie:

1. Formatuje kod (Prettier)
2. Sprawdza typy (TypeScript)
3. Uruchamia testy jednostkowe

## 📝 Konwencje

### Commit Messages

```bash
feat(component): dodaj nową funkcjonalność
fix(ui): napraw bug w komponencie
test(utils): dodaj testy dla funkcji
docs(readme): zaktualizuj dokumentację
```

### Testy

- Unit tests: `*.test.ts`
- E2E tests: `*.spec.ts`
- Test descriptions: "powinien [oczekiwane zachowanie]"

## 🎯 Przykład TDD w Praktyce

1. **Napisz test** (plik już istnieje):

   ```bash
   # src/utils/__tests__/noteUtils.test.ts
   # Testy dla funkcji formatNoteTitle, validateNoteData, etc.
   ```

2. **Uruchom test** (RED):

   ```bash
   npm run test:run
   # ❌ Error: Cannot resolve import "../noteUtils"
   ```

3. **Napisz implementację**:

   ```typescript
   // src/utils/noteUtils.ts
   export function formatNoteTitle(title: string): string {
     // Twoja implementacja
   }
   ```

4. **Uruchom test** (GREEN):
   ```bash
   npm run test:run
   # ✅ All tests passed
   ```

## 📚 Dokumentacja

- [TDD + CI Setup Guide](./docs/tdd-ci-setup.md)
- [Branch Protection Setup](./docs/branch-protection-setup.md)

## 🚀 Deployment

Projekt automatycznie deployuje się na Vercel po merge do `main` branch.

Wymagane zmienne środowiskowe w GitHub Secrets:

- `VERCEL_TOKEN`
- `ORG_ID`
- `PROJECT_ID`

## 🤝 Contributing

1. Stwórz feature branch: `git checkout -b feature/nazwa`
2. Napisz testy (TDD approach)
3. Implementuj funkcjonalność
4. Upewnij się że wszystkie testy przechodzą
5. Stwórz Pull Request

---

**Happy coding with TDD! 🧪✨**
