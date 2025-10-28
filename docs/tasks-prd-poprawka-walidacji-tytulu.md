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

## Tasks

- [ ] 1.0 Update NoteEditor component validation logic
- [ ] 2.0 Update NoteEditor component template
- [ ] 3.0 Update NoteEditor unit tests
- [ ] 4.0 Manual testing and verification
- [ ] 5.0 Clean up and final checks
