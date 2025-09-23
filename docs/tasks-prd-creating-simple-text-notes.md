# Task List: Creating Simple Text Notes (CMD-76)

Based on PRD: `prd-creating-simple-text-notes.md`
Linear Issue: CMD-76
Approach: Test-Driven Development (TDD)

## Relevant Files

- `src/stores/notes.store.ts` - Pinia store for centralized note state management, including CRUD operations and draft handling.
- `src/stores/notes.store.test.ts` - Unit tests for the notes store.
- `src/lib/db.ts` - IndexedDB wrapper using idb-keyval for persistent storage operations.
- `src/lib/db.test.ts` - Unit tests for database operations.
- `src/components/NoteEditor.vue` - Main editor component with title/body inputs, validation, and save functionality.
- `src/components/NoteEditor.test.ts` - Unit and integration tests for the editor component.
- `src/components/NoteList.vue` - Component to display saved notes in chronological order with dynamic sizing.
- `src/components/NoteList.test.ts` - Unit tests for the note list component.
- `src/components/ui/UiButton.vue` - shadcn-vue button component (if not already present).
- `src/components/ui/UiCard.vue` - shadcn-vue card component for note display (if not already present).
- `src/components/ui/UiInput.vue` - shadcn-vue input component (if not already present).
- `src/components/ui/UiTextarea.vue` - shadcn-vue textarea component (if not already present).
- `src/views/HomeView.vue` - Main route view integrating editor and note list.
- `tests/e2e/note-creation.spec.ts` - End-to-end tests for complete note creation workflow.
- `tests/e2e/note-persistence.spec.ts` - End-to-end tests for note persistence and draft recovery.
 - `tests/e2e/mobile-responsiveness.spec.ts` - End-to-end tests for mobile responsiveness and touch interactions.

### Notes

- Unit tests should be placed alongside the code files they are testing using Vitest.
- Integration tests will use Vue Test Utils with Vitest.
- End-to-end tests will use Playwright.
- Use `npm run test:unit` for unit tests, `npm run test:e2e` for end-to-end tests.
- Follow TDD approach: write tests first, then implement functionality.

## Tasks

- [x] 1.0 Setup Testing Infrastructure and Data Layer
  - [x] 1.1 Install and configure required dependencies (`pinia`, `idb-keyval`)
  - [x] 1.2 Setup Vitest configuration for unit tests if not already present
  - [x] 1.3 Setup Playwright configuration for e2e tests if not already present
  - [x] 1.4 Create test utilities and mocks for IndexedDB operations
  - [x] 1.5 Define TypeScript interfaces for Note and Draft types

- [x] 2.0 Implement Core Data Management (Store + Persistence)
  - [x] 2.1 **TDD**: Write tests for `src/lib/db.ts` - test getNotes(), setNotes(), getDraft(), setDraft()
  - [x] 2.2 Implement `src/lib/db.ts` - IndexedDB wrapper using idb-keyval with error handling
  - [x] 2.3 **TDD**: Write tests for notes store - test create(), state management, validation
  - [x] 2.4 Implement `src/stores/notes.store.ts` - Pinia store with Note type and CRUD operations
  - [x] 2.5 Add UUID generation utility with crypto.randomUUID() and fallback
  - [x] 2.6 Test error scenarios - storage failures, invalid data handling

- [x] 3.0 Create Note Editor Component with Validation
  - [x] 3.1 Add required shadcn-vue UI components (Button, Input, Textarea, Card) if missing
  - [x] 3.2 **TDD**: Write tests for NoteEditor.vue - form validation, save button states
  - [x] 3.3 Implement `src/components/NoteEditor.vue` - title/body inputs with placeholders
  - [x] 3.4 Add form validation - disable save when title empty, show helper text
  - [x] 3.5 Implement save functionality with loading states and success feedback
  - [x] 3.6 Add error handling for save failures with inline error messages
  - [x] 3.7 Test component integration with store actions

- [x] 4.0 Implement Note Display and List Management
  - [x] 4.1 **TDD**: Write tests for NoteList.vue - rendering, sorting, empty states
  - [x] 4.2 Implement `src/components/NoteList.vue` - display notes newest first (by updatedAt)
  - [x] 4.3 Create dynamic card sizing that adapts to content length
  - [x] 4.4 Add proper timestamp formatting and display
  - [x] 4.5 Implement optimistic UI updates when new notes are saved
  - [x] 4.6 Test list rendering with various note content lengths

- [x] 5.0 Add Auto-save and Navigation Protection Features
  - [x] 5.1 **TDD**: Write tests for draft auto-save functionality with debouncing
  - [x] 5.2 Implement auto-save drafts to separate storage (`drafts:v1` namespace)
  - [x] 5.3 Add debounced auto-save (1-2 second delay) to prevent excessive writes
  - [x] 5.4 **TDD**: Write tests for navigation protection and draft recovery
  - [x] 5.5 ~~Implement beforeunload event handler for unsaved changes warning~~ (Skipped - auto-save makes this unnecessary)
  - [x] 5.6 Add draft recovery on component mount after page refresh
  - [x] 5.7 Ensure drafts don't overwrite published notes until Save is clicked

- [x] 6.0 Integration and End-to-End Testing
  - [x] 6.1 Write integration tests - NoteEditor + NoteList interaction
  - [x] 6.2 Write e2e test: Create note, verify it appears, reload page, verify persistence
  - [x] 6.3 Write e2e test: Auto-save draft, refresh page, verify draft recovery
  - [x] 6.4 Write e2e test: Navigation warning when leaving with unsaved changes
  - [x] 6.5 Write e2e test: Storage failure simulation and error message display
  - [x] 6.6 Test mobile responsiveness and touch interactions

- [ ] 7.0 Final Integration and Documentation
  - [x] 7.1 Update `src/views/HomeView.vue` to integrate NoteEditor and NoteList
  - [x] 7.2 Ensure proper component styling with Tailwind CSS and shadcn-vue
  - [x] 7.3 Add proper Polish comments throughout the codebase
  - [x] 7.4 Run all tests and ensure 100% pass rate
  - [x] 7.5 Update README.md with local storage information and draft system explanation
  - [x] 7.6 Verify all acceptance criteria from CMD-76 are met
  - [x] 7.7 Test deployment on Vercel preview environment

---

*Phase 2: Detailed sub-tasks generated following TDD approach. Each major implementation step is preceded by writing tests first, ensuring robust code coverage and adherence to the acceptance criteria from CMD-76.*
