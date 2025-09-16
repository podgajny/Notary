## Relevant Files

- `src/components/NoteDisplay.vue` - Main component that displays the single note with title and body content
- `src/components/ui/UiCard.vue` - shadcn/ui Card component for note container (if not already present)
- `src/App.vue` - Root application component that will render the NoteDisplay component
- `src/views/HomeView.vue` - Main view component that contains the note display
- `src/assets/main.css` - Main CSS file for any custom styles (already exists)
- `package.json` - Project dependencies and scripts configuration
- `vite.config.js` - Vite configuration file
- `tailwind.config.js` - TailwindCSS configuration with shadcn/ui integration

### Notes

- This is an MVP with static content, so no API calls or data persistence is required
- All components should use Vue 3 Composition API
- Comments in code should be written in Polish as per project requirements
- Focus on clean, minimal design using shadcn/ui components and TailwindCSS

## Tasks

- [x] 1.0 Set up basic environment
  - [x] 1.1 Navigate to project root directory and run `npm install`
  - [x] 1.2 Start development server with `npm run dev` to verify it works

- [x] 2.0 Create and integrate the note display component
  - [x] 2.1 Create `src/components/NoteDisplay.vue` with basic Vue 3 structure
  - [x] 2.2 Add static content: title "Hello World" and lorem ipsum body
  - [x] 2.3 Import NoteDisplay in `src/App.vue` and render it
  - [x] 2.4 Test that the note displays in browser (unstyled)

- [x] 3.0 Add minimal styling
  - [x] 3.1 Add basic TailwindCSS classes for readable typography
  - [x] 3.2 Test final result displays cleanly
