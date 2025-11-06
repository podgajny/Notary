# Task List: Note Detail View Implementation

Based on PRD: [prd-note-detail-view.md](tasks/prd-note-detail-view.md)

## Relevant Files

- `src/components/NoteDetailDialog.vue` - New Dialog component for displaying full note content
- `src/components/__tests__/NoteDetailDialog.spec.ts` - Unit tests for NoteDetailDialog component
- `src/components/NoteList.vue` - Existing note list component, needs modification to trigger Dialog
- `src/components/__tests__/NoteList.spec.ts` - Existing tests, needs updates for click handling
- `src/components/ui/dialog/` - shadcn-vue Dialog components (to be installed)

### Notes

- Unit tests should be placed in `__tests__/` directory alongside the code files (e.g., `src/components/__tests__/NoteDetailDialog.spec.ts`)
- Use `npm run test` to run tests in watch mode during development
- Use `npm run test:run` to run all tests once (for CI or final verification)
- Run `npm run lint` for TypeScript type checking before committing
- Follow TDD Red-Green-Refactor cycle: Write failing test → Implement minimal code → Refactor

## Tasks

### 1.0 Install and configure shadcn-vue Dialog component

- [ ] 1.1 Run `npx shadcn-vue@latest add dialog` to install Dialog component
- [ ] 1.2 Verify Dialog component files are created in `src/components/ui/dialog/`
- [ ] 1.3 Check that all Dialog sub-components are available (Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger)

### 2.0 RED: Write failing tests for NoteDetailDialog component

- [ ] 2.1 Create test file `src/components/__tests__/NoteDetailDialog.spec.ts`
- [ ] 2.2 Write test: "powinien renderować tytuł notatki w DialogTitle"
- [ ] 2.3 Write test: "powinien renderować treść notatki z zachowaniem formatowania"
- [ ] 2.4 Write test: "powinien renderować datę utworzenia w formacie czytelnym dla użytkownika"
- [ ] 2.5 Write test: "powinien wyświetlić Dialog gdy isOpen jest true"
- [ ] 2.6 Write test: "powinien ukryć Dialog gdy isOpen jest false"
- [ ] 2.7 Write test: "powinien emitować zdarzenie 'update:isOpen' z wartością false gdy użytkownik zamyka Dialog"
- [ ] 2.8 Write test: "powinien zawierać przycisk zamykający (X button)"
- [ ] 2.9 Write snapshot test for component structure
- [ ] 2.10 Run tests and verify they fail (RED phase)

### 3.0 GREEN: Implement NoteDetailDialog component to pass tests

- [ ] 3.1 Create component file `src/components/NoteDetailDialog.vue`
- [ ] 3.2 Import shadcn-vue Dialog components (Dialog, DialogContent, DialogHeader, DialogTitle)
- [ ] 3.3 Define component props: `note` (object with id, title, body, createdAt), `isOpen` (boolean)
- [ ] 3.4 Define emits: `update:isOpen`
- [ ] 3.5 Implement Dialog structure with DialogContent, DialogHeader, and DialogTitle
- [ ] 3.6 Display note title in DialogTitle
- [ ] 3.7 Display note body with preserved formatting (use `white-space: pre-wrap` or similar)
- [ ] 3.8 Display creation date formatted with human-readable format
- [ ] 3.9 Implement close button in DialogHeader
- [ ] 3.10 Handle Dialog close events (emit `update:isOpen` with false)
- [ ] 3.11 Run tests and verify they pass (GREEN phase)

### 4.0 REFACTOR: Polish NoteDetailDialog styling and structure

- [ ] 4.1 Add proper TailwindCSS classes for Dialog sizing (`max-w-2xl`)
- [ ] 4.2 Add padding to DialogContent (`p-6`)
- [ ] 4.3 Style title section with `text-lg font-semibold text-slate-900`
- [ ] 4.4 Style body section with proper typography and `whitespace-pre-wrap`
- [ ] 4.5 Style creation date with `text-sm text-slate-600`
- [ ] 4.6 Add spacing between sections (`space-y-4` or `space-y-5`)
- [ ] 4.7 Add max-height and scrolling for content (`max-h-[80vh] overflow-y-auto`)
- [ ] 4.8 Verify Dialog uses default shadcn-vue animations
- [ ] 4.9 Add labels like "Created:" before the date for clarity
- [ ] 4.10 Run tests to ensure refactoring doesn't break functionality
- [ ] 4.11 Run `npm run lint` to check TypeScript types

### 5.0 RED: Write failing tests for note click handling in NoteList

- [ ] 5.1 Read existing `src/components/__tests__/NoteList.spec.ts` to understand current tests
- [ ] 5.2 Write test: "powinien emitować zdarzenie 'note-clicked' z obiektem notatki gdy użytkownik kliknie notatkę"
- [ ] 5.3 Write test: "powinien dodać cursor-pointer do elementów notatek"
- [ ] 5.4 Write test: "powinien wyświetlić hover effect na notatkach"
- [ ] 5.5 Run tests and verify new tests fail (RED phase)

### 6.0 GREEN: Implement click handlers and state management in NoteList

- [ ] 6.1 Read existing `src/components/NoteList.vue` to understand current structure
- [ ] 6.2 Add `@click` handler to note elements that emits 'note-clicked' event with note object
- [ ] 6.3 Define emits in component setup for 'note-clicked' event
- [ ] 6.4 Update parent component (likely `src/views/HomeView.vue`) to handle 'note-clicked' event
- [ ] 6.5 Add state management in parent for `selectedNote` (ref)
- [ ] 6.6 Add state management in parent for `isDialogOpen` (ref)
- [ ] 6.7 Implement handler that sets selectedNote and opens Dialog
- [ ] 6.8 Import and add NoteDetailDialog component to parent template
- [ ] 6.9 Pass selectedNote and isDialogOpen props to NoteDetailDialog
- [ ] 6.10 Handle Dialog close event to update isDialogOpen
- [ ] 6.11 Run tests and verify they pass (GREEN phase)

### 7.0 REFACTOR: Improve integration and add visual feedback

- [ ] 7.1 Add `cursor-pointer` class to note elements in NoteList
- [ ] 7.2 Add hover effect classes (e.g., `hover:bg-slate-50` or `hover:shadow-md`)
- [ ] 7.3 Ensure transitions are smooth on hover (add `transition` classes if needed)
- [ ] 7.4 Verify accessibility: keyboard users can navigate to notes with Tab
- [ ] 7.5 Verify accessibility: pressing Enter on focused note opens Dialog
- [ ] 7.6 Test focus management: focus returns to clicked note after Dialog closes
- [ ] 7.7 Run all tests to ensure refactoring works correctly
- [ ] 7.8 Run `npm run lint` for final type checking

### 8.0 Final verification: Run all tests and quality checks

- [ ] 8.1 Run `npm run test:run` to execute all tests once
- [ ] 8.2 Verify all 55+ tests pass (including new tests)
- [ ] 8.3 Run `npm run lint` to verify no TypeScript errors
- [ ] 8.4 Run `npm run build` to ensure production build works
- [ ] 8.5 Run `npm run dev` and manually test Dialog functionality
- [ ] 8.6 Test: Click on note opens Dialog with full content
- [ ] 8.7 Test: Click outside Dialog closes it
- [ ] 8.8 Test: Click X button closes Dialog
- [ ] 8.9 Test: Press ESC key closes Dialog
- [ ] 8.10 Test: Content scrolls properly for long notes
- [ ] 8.11 Test: Focus returns to note after Dialog closes
- [ ] 8.12 Verify no console errors or warnings
