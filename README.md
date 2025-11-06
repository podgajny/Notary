# Notary Vue - Local-First Notes App

Vue 3 application for creating notes with local data storage. Built using TDD (Test-Driven Development) and CI/CD.

## ✨ Features

- **Note creation** - Add title and note content
- **Local storage** - Data saved in browser's IndexedDB
- **Responsive design** - Works on all devices
- **Form validation** - Data correctness checking
- **Error handling** - User-friendly error messages

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run tests in watch mode
npm run test
```

## 📝 How it works

1. **Creating a note**: Enter a title (required) and note content, then click "Save"
2. **Local storage**: Notes are automatically saved in browser's IndexedDB
3. **Display**: All notes appear below the form, sorted from newest
4. **Persistence**: Notes remain after page refresh - data is stored locally

### Architecture

- **Vue 3** + **Composition API** - modern framework
- **Pinia** - application state management
- **Vue Router** - navigation between pages
- **IndexedDB** - local data storage
- **TailwindCSS** - component styling
- **Vitest** - unit testing

## 🧪 Test-Driven Development

This project is configured to work with TDD. See examples in:

- `src/components/__tests__/NoteEditor.spec.ts` - note editor component tests
- `src/components/__tests__/NoteList.spec.ts` - note list component tests
- `src/stores/__tests__/notes.store.spec.ts` - Pinia store tests

### TDD Workflow

1. **RED ❌** - Write a test that will fail
2. **GREEN ✅** - Write minimal implementation
3. **REFACTOR 🔄** - Improve code while keeping tests passing

```bash
# Check TDD status - some tests are RED (that's OK!)
npm run test:run
```

## 🛠️ Available Commands

### Development

```bash
npm run dev          # Development server (port 5173)
npm run build        # Production build
npm run preview      # Preview build
```

### Tests

```bash
npm run test         # Unit tests (watch mode)
npm run test:run     # Unit tests (single run)
npm run test:ui      # Unit tests (UI mode)
npm run test:coverage # With code coverage

npm run test:e2e     # E2E tests (Playwright)
npm run test:e2e:ui  # E2E UI mode
```

### Quality

```bash
npm run lint         # TypeScript check
npm run lint:fix     # Code formatting
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

## 📁 Project Structure

```
src/
├── components/           # Vue components
│   ├── __tests__/       # Component tests
│   ├── NoteEditor.vue   # Note creation form
│   └── NoteList.vue     # Note list display
├── stores/              # Pinia store
│   ├── __tests__/       # Store tests
│   └── notes.store.ts   # Notes management store
├── lib/                 # Database layer
│   ├── __tests__/       # Database tests
│   └── db.ts           # IndexedDB wrapper
├── views/               # Page components
│   └── HomeView.vue     # Main application page
├── router/              # Routing configuration
│   └── index.js         # Route definitions
├── assets/              # Static assets
└── __tests__/           # Main tests

docs/                    # Documentation
├── tdd-ci-setup.md     # TDD + CI guide
└── branch-protection-setup.md # GitHub configuration
```

## 🔄 CI/CD Pipeline

### Automatic Checks

Every PR goes through:

- ✅ TypeScript type checking
- ✅ Unit tests (Vitest)
- ✅ Build verification
- ✅ E2E tests (optional)
- ✅ Code formatting

### Branch Protection

Main branch is protected and requires:

- ✅ All tests passing
- ✅ Approval from another developer
- ✅ Up-to-date branch version

## 🪝 Pre-commit Hooks

Before each commit automatically:

1. Formats code (Prettier)
2. Checks types (TypeScript)
3. Runs unit tests

## 📝 Conventions

### Commit Messages

```bash
feat(component): add new feature
fix(ui): fix bug in component
test(utils): add tests for function
docs(readme): update documentation
```

### Tests

- Unit tests: `*.test.ts`
- E2E tests: `*.spec.ts`
- Test descriptions: "should [expected behavior]"

## 🎯 TDD Example in Practice

1. **Write test** (file already exists):

   ```bash
   # src/utils/__tests__/noteUtils.test.ts
   # Tests for formatNoteTitle, validateNoteData functions, etc.
   ```

2. **Run test** (RED):

   ```bash
   npm run test:run
   # ❌ Error: Cannot resolve import "../noteUtils"
   ```

3. **Write implementation**:

   ```typescript
   // src/utils/noteUtils.ts
   export function formatNoteTitle(title: string): string {
     // Your implementation
   }
   ```

4. **Run test** (GREEN):
   ```bash
   npm run test:run
   # ✅ All tests passed
   ```

## 📚 Documentation

- [TDD + CI Setup Guide](./docs/tdd-ci-setup.md)
- [Branch Protection Setup](./docs/branch-protection-setup.md)

## 🚀 Deployment

Project automatically deploys to Vercel after merge to `main` branch.

Required environment variables in GitHub Secrets:

- `VERCEL_TOKEN`
- `ORG_ID`
- `PROJECT_ID`

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Write tests (TDD approach)
3. Implement functionality
4. Make sure all tests pass
5. Create Pull Request

---

**Happy coding with TDD! 🧪✨**
