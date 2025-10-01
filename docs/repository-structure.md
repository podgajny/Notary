# Struktura Repozytorium - Notary Vue

Ten dokument opisuje strukturę repozytorium projektu Notary Vue oraz przeznaczenie poszczególnych folderów i plików.

## 📁 Główna Struktura Katalogów

```
Notary/
├── docs/                    # Dokumentacja projektu
├── src/                     # Kod źródłowy aplikacji
├── .github/                 # Konfiguracja GitHub Actions
├── .husky/                  # Git hooks
├── node_modules/            # Zależności npm (auto-generowane)
├── [pliki konfiguracyjne]   # Pliki konfiguracyjne projektu
└── README.md               # Główna dokumentacja projektu
```

---

## 📚 Folder `docs/`

Zawiera dokumentację projektu w formacie Markdown.

### Pliki:

- **`tdd-ci-setup.md`** - Przewodnik konfiguracji TDD (Test-Driven Development) i CI/CD
- **`branch-protection-setup.md`** - Instrukcje konfiguracji ochrony branchy w GitHub
- **`deployment-guide.md`** - Przewodnik deploymentu aplikacji
- **`prd-simple-note-display.md`** - Product Requirements Document dla wyświetlania notatek
- **`prd-vercel-deployment.md`** - PRD dla deploymentu na Vercel
- **`repository-structure.md`** - Ten dokument opisujący strukturę repo

### Folder `docs/prompts/`:

- **`create-prd.mdc`** - Szablon prompt do tworzenia PRD
- **`generate-tasks.mdc`** - Szablon prompt do generowania zadań
- **`process-task-list.mdc`** - Szablon prompt do przetwarzania listy zadań

### Pliki zadań:

- **`tasks-prd-simple-note-display.md`** - Lista zadań z PRD dla notatek
- **`tasks-prd-vercel-deployment.md`** - Lista zadań z PRD dla deploymentu

---

## 💻 Folder `src/` - Kod Źródłowy

Główny folder zawierający kod aplikacji Vue.js.

### Struktura:

```
src/
├── components/              # Komponenty Vue
│   ├── __tests__/          # Testy komponentów
│   ├── NoteDisplay.vue     # Komponent wyświetlania notatek
│   └── [inne komponenty]
├── views/                  # Komponenty stron/widoków
│   └── HomeView.vue        # Główna strona aplikacji
├── assets/                 # Statyczne zasoby
│   └── main.css           # Główne style CSS
├── __tests__/              # Testy główne aplikacji
│   └── App.test.ts        # Test głównego komponentu App
├── App.vue                 # Główny komponent aplikacji
├── main.js                 # Punkt wejścia aplikacji
└── vite-env.d.ts          # Definicje typów Vite
```

### Szczegółowy opis:

#### `src/components/`

Komponenty wielokrotnego użytku aplikacji Vue.

- **`NoteDisplay.vue`** - Komponent do wyświetlania pojedynczej notatki
- **`__tests__/`** - Folder z testami jednostkowymi komponentów
  - **`NoteDisplay.test.ts`** - Testy komponentu NoteDisplay
  - **`__snapshots__/`** - Snapshots testów dla weryfikacji zmian UI

#### `src/views/`

Komponenty reprezentujące pełne strony/widoki aplikacji.

- **`HomeView.vue`** - Główna strona aplikacji

#### `src/assets/`

Statyczne zasoby aplikacji (obrazy, style, czcionki).

- **`main.css`** - Główne style CSS z konfiguracją TailwindCSS i zmiennymi CSS

#### `src/__tests__/`

Testy na poziomie aplikacji.

- **`App.test.ts`** - Test głównego komponentu App
- **`__snapshots__/`** - Snapshots testów App

#### Pliki główne:

- **`App.vue`** - Główny komponent aplikacji Vue, zawiera routing i layout
- **`main.js`** - Punkt wejścia aplikacji, inicjalizuje Vue app
- **`vite-env.d.ts`** - Definicje typów TypeScript dla Vite

---

## ⚙️ Pliki Konfiguracyjne

### `package.json`

Główny plik konfiguracyjny projektu Node.js.

**Zawiera:**

- Metadane projektu (nazwa, wersja, autor)
- Lista zależności produkcyjnych i deweloperskich
- Skrypty npm (`dev`, `build`, `test`, `lint`)
- Konfiguracja lint-staged dla pre-commit hooks

**Kluczowe zależności:**

- **Vue 3** - Framework JavaScript
- **Vite** - Build tool i dev server
- **TypeScript** - Type safety
- **TailwindCSS** - Framework CSS
- **Vitest** - Framework testowy
- **Husky** - Git hooks

### `vite.config.js`

Konfiguracja Vite - build tool i development server.

**Ustawienia:**

- Plugin Vue.js
- Alias `@` dla ścieżki `./src`
- Konfiguracja testów (Vitest + jsdom)

### `tailwind.config.js`

Konfiguracja TailwindCSS - utility-first CSS framework.

**Zawiera:**

- Definicje kolorów (primary, secondary, destructive, etc.)
- Zmienne CSS dla themingu
- Border radius z custom properties
- Ścieżki do plików źródłowych

### `tsconfig.json`

Konfiguracja TypeScript dla projektu.

**Ustawienia:**

- Target ES2020
- Strict mode włączony
- Path mapping `@/*` → `./src/*`
- Konfiguracja dla bundlera (Vite)

### `tsconfig.node.json`

Konfiguracja TypeScript dla plików Node.js (Vite config, etc.).

### `postcss.config.js`

Konfiguracja PostCSS dla TailwindCSS i autoprefixer.

### `vercel.json`

Konfiguracja deploymentu na Vercel.

**Ustawienia:**

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

---

## 🔧 Folder `.github/` - GitHub Actions

Konfiguracja CI/CD pipeline w GitHub Actions.

### `workflows/`

- **`ci.yml`** - Główny workflow CI/CD (testy, build, deployment)
- **`pr-validation.yml`** - Workflow walidacji Pull Requestów

---

## 🪝 Folder `.husky/` - Git Hooks

Konfiguracja Git hooks używanych przez Husky.

### Struktura:

```
.husky/
├── _/                     # Pliki pomocnicze Husky
├── commit-msg             # Hook sprawdzający format commitów
└── pre-commit             # Hook uruchamiany przed commitem
```

**Pre-commit hook** wykonuje:

- Formatowanie kodu (Prettier)
- Sprawdzanie typów TypeScript
- Uruchamianie testów jednostkowych

---

## 📄 Pozostałe Pliki

### `index.html`

Główny plik HTML aplikacji - punkt wejścia dla Vite.

### `README.md`

Główna dokumentacja projektu z instrukcjami uruchomienia i użytkowania.

### `.gitignore`

Pliki i foldery ignorowane przez Git:

- `node_modules/` - zależności npm
- `dist/` - build output
- `.env*` - pliki środowiskowe
- Logi i pliki tymczasowe
- Coverage reports

### `package-lock.json`

Lockfile npm zapewniający deterministyczne instalacje zależności.

---

## 🚀 Workflow Development

### Uruchomienie projektu:

```bash
npm install    # Instalacja zależności
npm run dev    # Uruchomienie dev server (port 5173)
```

### Dostępne komendy:

- **`npm run dev`** - Development server
- **`npm run build`** - Build produkcyjny
- **`npm run test`** - Uruchomienie testów
- **`npm run lint`** - Sprawdzenie typów TypeScript
- **`npm run lint:fix`** - Formatowanie kodu

### TDD Workflow:

1. **RED** ❌ - Napisz test, który się nie powiedzie
2. **GREEN** ✅ - Napisz minimalną implementację
3. **REFACTOR** 🔄 - Popraw kod zachowując testy

---

## 📋 Konwencje

### Nazewnictwo:

- Komponenty Vue: PascalCase (`NoteDisplay.vue`)
- Pliki testów: `*.test.ts`
- Foldery: kebab-case lub snake_case

### Struktura testów:

- Testy komponentów: `src/components/__tests__/`
- Testy utility: `src/utils/__tests__/`
- Testy główne: `src/__tests__/`

### Commit messages:

```
feat(component): dodaj nową funkcjonalność
fix(ui): napraw bug w komponencie
test(utils): dodaj testy dla funkcji
docs(readme): zaktualizuj dokumentację
```

---

_Ten dokument powinien być aktualizowany przy zmianach w strukturze projektu._
