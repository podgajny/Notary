# Task List: Poprawka walidacji wymaganego pola tytułu (CMD-98)

Based on: [prd-poprawka-walidacji-tytulu.md](prd-poprawka-walidacji-tytulu.md)

## Relevant Files

- `src/components/NoteEditor.vue` - Main component containing the note creation form and validation logic
- `src/components/__tests__/NoteEditor.spec.ts` - Unit tests for NoteEditor component

### Notes

- Unit tests are placed alongside the component file in `__tests__/` directory
- Use `npm run test:run` to run all tests once
- Use `npm run test` to run tests in watch mode during development
- Run `npm run lint` for TypeScript type checking before committing

## TDD Workflow

Following the Red-Green-Refactor cycle from [tdd-ci-setup.md](tdd-ci-setup.md)

### Phase 1: RED ❌ - Write failing tests

- [x] 1.1 Update test: "powinien wyłączyć przycisk Save gdy tytuł jest pusty" to expect enabled button
- [x] 1.2 Add new test: "powinien nie wyświetlać błędu walidacji przy załadowaniu formularza"
- [x] 1.3 Update test expectations for button state with empty title
- [x] 1.4 Run tests and verify they fail (`npm run test`) - ✅ 3 tests failing as expected

### Phase 2: GREEN ✅ - Implement minimal code to pass tests

- [x] 2.1 Add `showTitleError` reactive state to NoteEditor.vue
- [x] 2.2 Update `isSaveDisabled` computed property (remove `isTitleEmpty` check)
- [ ] 2.3 Update template: change `v-if="isTitleEmpty"` to `v-if="showTitleError"`
- [ ] 2.4 Update `submit` function to set `showTitleError = true` on validation failure
- [ ] 2.5 Update title watcher to clear `showTitleError`
- [ ] 2.6 Run tests and verify they pass (`npm run test:run`)

### Phase 3: REFACTOR 🔄 - Improve code quality while keeping tests green

- [ ] 3.1 Review code for clarity and maintainability
- [ ] 3.2 Add code comments if needed (Polish, as per .cursorrules)
- [ ] 3.3 Verify TypeScript types are correct (`npm run lint`)
- [ ] 3.4 Run tests again to ensure still passing (`npm run test:run`)

### Phase 4: Manual Testing & Verification

- [ ] 4.1 Test Scenario 1: Clean initial state (no error on load, button enabled)
- [ ] 4.2 Test Scenario 2: Validation triggers on save (error appears, field focused)
- [ ] 4.3 Test Scenario 3: Error clears on input (type character, error disappears)
- [ ] 4.4 Test Scenario 4: Whitespace validation (spaces treated as empty)
- [ ] 4.5 Test Scenario 5: Successful save (with valid title)
- [ ] 4.6 Test responsive behavior (mobile, tablet, desktop)

### Phase 5: Pre-PR Checklist

- [ ] 5.1 All tests pass (`npm run test:run`)
- [ ] 5.2 TypeScript type checking passes (`npm run lint`)
- [ ] 5.3 Code is formatted (`npm run lint:fix`)
- [ ] 5.4 Review all changes in git diff
- [ ] 5.5 Commit with conventional commit message
- [ ] 5.6 Push and verify CI/CD pipeline passes
