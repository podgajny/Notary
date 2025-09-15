## Relevant Files

- `notary-vue/src/components/NoteDisplay.vue` - Main component that displays the single note with title and body content
- `notary-vue/src/components/ui/UiCard.vue` - shadcn/ui Card component for note container (if not already present)
- `notary-vue/src/App.vue` - Root application component that will render the NoteDisplay component
- `notary-vue/src/views/HomeView.vue` - Main view component that contains the note display
- `notary-vue/src/assets/main.css` - Main CSS file for any custom styles (already exists)
- `notary-vue/package.json` - Project dependencies and scripts configuration
- `notary-vue/vite.config.js` - Vite configuration file
- `notary-vue/tailwind.config.js` - TailwindCSS configuration with shadcn/ui integration

### Notes

- This is an MVP with static content, so no API calls or data persistence is required
- All components should use Vue 3 Composition API
- Comments in code should be written in Polish as per project requirements
- Focus on clean, minimal design using shadcn/ui components and TailwindCSS

## Tasks

- [ ] 1.0 Set up basic environment
  - [ ] 1.1 Navigate to notary-vue directory and run `npm install`
  - [ ] 1.2 Start development server with `npm run dev` to verify it works

- [ ] 2.0 Create and integrate the note display component
  - [ ] 2.1 Create `src/components/NoteDisplay.vue` with basic Vue 3 structure
  - [ ] 2.2 Add static content: title "Hello World" and lorem ipsum body
  - [ ] 2.3 Import NoteDisplay in `src/App.vue` and render it
  - [ ] 2.4 Test that the note displays in browser (unstyled)

- [ ] 3.0 Add minimal styling
  - [ ] 3.1 Add basic TailwindCSS classes for readable typography
  - [ ] 3.2 Test final result displays cleanly
