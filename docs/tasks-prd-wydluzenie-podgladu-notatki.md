# Tasks: Wydłużenie podglądu notatki (CMD-94)

## Relevant Files

- `src/components/NoteList.vue` - Main component containing note preview display logic and styling
- `src/components/__tests__/NoteList.spec.ts` - Unit tests for NoteList component

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npm run test` to run tests in watch mode, or `npm run test:run` for a single test run.
- Use `npm run lint` for TypeScript type checking after making changes.

## Tasks

### RED Phase - Write Failing Tests

- [ ] 1.0 Add test case for long notes (10+ lines) - verify 5-line truncation with ellipsis
  - [ ] 1.1 Open `src/components/__tests__/NoteList.spec.ts`
  - [ ] 1.2 Create a new test case after the existing truncation tests (around line 141)
  - [ ] 1.3 Name the test "powinien wyświetlać maksymalnie 5 linii tekstu dla długich notatek"
  - [ ] 1.4 Create a mock note with body containing 10+ lines of text (each line should be short enough to not wrap on most screens, e.g., 30-40 characters per line)
  - [ ] 1.5 Mount the NoteList component with this long note
  - [ ] 1.6 Query the body preview element using `.text-slate-600` selector
  - [ ] 1.7 Add assertion to check that the element has CSS classes for line-clamp: expect element to have classes containing `line-clamp` or check computed styles
  - [ ] 1.8 Run `npm run test:run` to verify the test fails (it should fail because line-clamp is not implemented yet)

- [ ] 2.0 Update existing test for body preview truncation to expect line-based behavior instead of character-based
  - [ ] 2.1 Locate the test "powinien wyświetlać skróconą treść gdy jest długa" (line 120)
  - [ ] 2.2 Remove or comment out the assertion that checks for exactly 121 characters: `expect(bodyText).toHaveLength(121);`
  - [ ] 2.3 Keep the test for ellipsis presence: `expect(bodyText.endsWith("…")).toBe(true);`
  - [ ] 2.4 Update the test body text to be multi-line (10+ short lines) instead of one long line
  - [ ] 2.5 Add a comment explaining that truncation is now CSS-based (line-clamp) rather than character-based
  - [ ] 2.6 Run `npm run test:run` to see if the test still fails (expected, as implementation is not done)

### GREEN Phase - Implement to Pass Tests

- [ ] 3.0 Remove getBodyPreview() function that performs character-based truncation
  - [ ] 3.1 Open `src/components/NoteList.vue`
  - [ ] 3.2 Locate the `getBodyPreview` function (lines 30-35)
  - [ ] 3.3 Delete the entire `getBodyPreview` function
  - [ ] 3.4 Save the file

- [ ] 4.0 Update template to remove getBodyPreview() call and display note.body directly
  - [ ] 4.1 In `src/components/NoteList.vue`, locate the template section where body preview is rendered (line 64-65)
  - [ ] 4.2 Change `{{ getBodyPreview(note.body) }}` to `{{ note.body }}`
  - [ ] 4.3 Save the file

- [ ] 5.0 Add CSS classes to body preview paragraph for line-clamp styling
  - [ ] 5.1 In the template section of `src/components/NoteList.vue`, find the `<p>` tag that displays note.body (line 64)
  - [ ] 5.2 Update the class attribute from `class="mt-2 text-sm text-slate-600"` to include line-clamp utilities
  - [ ] 5.3 Add the following Tailwind classes: `line-clamp-5` (this is a built-in Tailwind utility)
  - [ ] 5.4 Final classes should be: `class="mt-2 text-sm text-slate-600 line-clamp-5"`
  - [ ] 5.5 Save the file
  - [ ] 5.6 Run `npm run test:run` to check if tests pass

### REFACTOR Phase - Verify and Clean Up

- [ ] 6.0 Run all tests and verify they pass
  - [ ] 6.1 Execute `npm run test:run` in the terminal
  - [ ] 6.2 Verify all tests pass, especially the updated truncation tests
  - [ ] 6.3 If any tests fail, review the error messages and fix accordingly
  - [ ] 6.4 Update snapshot tests if prompted (`npm run test:run -- -u`)

- [ ] 7.0 Run type checking
  - [ ] 7.1 Execute `npm run lint` in the terminal
  - [ ] 7.2 Verify no TypeScript errors are reported
  - [ ] 7.3 Fix any type errors if they appear (none expected for this change)

- [ ] 8.0 Manual verification with different note lengths in browser
  - [ ] 8.1 Start the development server: `npm run dev`
  - [ ] 8.2 Open the app in browser (http://localhost:5173)
  - [ ] 8.3 Create or view a note with 1-2 lines of text - verify it displays fully without ellipsis
  - [ ] 8.4 Create or view a note with 3-4 lines of text - verify it displays fully without ellipsis
  - [ ] 8.5 Create or view a note with 10+ lines of text - verify only 5 lines are visible with ellipsis
  - [ ] 8.6 Verify the card heights adjust appropriately (shorter for short notes, taller for long notes up to 5 lines)

- [ ] 9.0 Verify responsive behavior on mobile, tablet, and desktop viewports
  - [ ] 9.1 With dev server running, open browser DevTools (F12)
  - [ ] 9.2 Switch to responsive design mode (Ctrl+Shift+M or Cmd+Shift+M)
  - [ ] 9.3 Test at mobile width (375px) - verify 5-line truncation still works and text wraps properly
  - [ ] 9.4 Test at tablet width (768px) - verify 5-line truncation and text wrapping
  - [ ] 9.5 Test at desktop width (1440px) - verify 5-line truncation and text wrapping
  - [ ] 9.6 Verify no horizontal scrolling occurs at any breakpoint
