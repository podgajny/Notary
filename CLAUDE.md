# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Notary Vue** - a Vue 3 application built with Vite, TypeScript, and TailwindCSS following TDD principles. It's a simple note display application designed as a learning project for Test-Driven Development and CI/CD practices.

## Essential Commands

### Development

```bash
npm run dev          # Development server (port 5173)
npm run build        # Production build (includes TypeScript compilation)
npm run preview      # Preview production build
```

### Testing & Quality Assurance

```bash
npm run test         # Unit tests in watch mode (Vitest)
npm run test:run     # Unit tests single run
npm run test:ui      # Unit tests with UI interface
npm run test:coverage # Unit tests with coverage report
npm run lint         # TypeScript type checking
npm run lint:fix     # Code formatting with Prettier
```

**Important**: Always run `npm run lint` and `npm run test:run` after making changes. These commands are enforced by CI/CD pipeline.

### Code Formatting (Prettier)

- **Purpose**: Automatically formats code to ensure consistent style across the project
- **Configuration**: Uses `.prettierrc.json` with explicit settings (double quotes, semicolons, 2-space indentation, trailing commas)
- **Plugin**: `prettier-plugin-tailwindcss` automatically sorts Tailwind CSS classes in recommended order
- **When it runs**:
  - Manually: `npm run lint:fix` formats all files in `src/`
  - Automatically: Before every commit via `lint-staged` (only on staged files)
- **Important for LLMs**:
  - **DO NOT** make purely stylistic changes (e.g., single vs. double quotes) unless correcting a Prettier violation
  - Prettier will normalize formatting on commit anyway
  - Preserve existing formatting style when modifying code
  - If you see inconsistent quotes/styles, assume Prettier will fix it
  - Trust the Prettier process - don't manually fix formatting issues

## Architecture & Code Structure

### Component Architecture

- **App.vue**: Root component that renders NoteDisplay
- **NoteDisplay.vue**: Main feature component displaying static note content
- Components follow Vue 3 Composition API with `<script setup>`
- All styling uses TailwindCSS utility classes

### Test Strategy

- **Unit tests**: Located in `__tests__/` directories alongside components
- **Test naming**: Use English descriptions starting with "should"
- **Snapshot tests**: Included to track component structure changes
- **TDD approach**: Write failing tests first, then implement features

### TypeScript Type Checking

- **Tool**: `vue-tsc` (Vue TypeScript compiler), NOT ESLint
- **Command**: `npm run lint` runs `vue-tsc --noEmit`
- **Purpose**: Checks TypeScript types without emitting files
- **When it runs**:
  - Manually: `npm run lint`
  - In CI/CD: Before every PR merge
- **Configuration**:
  - Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
  - Path alias `@/*` maps to `./src/*`
  - Vue 3 specific configuration with JSX preserve mode

### Styling System (from .cursorrules)

- **Primary**: TailwindCSS for all styling
- **Component library**: shadcn-vue components (when added)
- **Naming**: UI components have `Ui` prefix (UiButton, UiCard)
- **Class ordering**: Enforced by prettier-plugin-tailwindcss
- **Responsive**: Mobile-first approach with max 2 breakpoints per component
- **Limits**: Max 10 classes per element, max 3 nesting levels

### Build & Deployment

- **Build tool**: Vite with Vue plugin
- **Deployment**: Automated via Vercel on main branch
- **Bundle size limit**: 2MB (enforced by CI)
- **Node version**: 20.x LTS

## CI/CD Pipeline

### Automated Checks (on PR)

1. TypeScript type checking (`npm run lint`)
2. Unit tests execution (`npm run test:run`)
3. Build verification (`npm run build`)
4. Bundle size validation (<2MB)
5. Merge conflict detection

### Git Hooks (Husky)

- **What is Husky**: Tool that enables Git hooks (scripts that run at specific Git events)
- **Pre-commit hook**: Automatically runs `lint-staged` before every commit
- **How it works**:
  1. Developer runs `git commit`
  2. Husky intercepts and runs pre-commit hook
  3. `lint-staged` formats staged files with Prettier
  4. If formatting changes files, they're re-staged
  5. Commit proceeds with formatted code
- **Files processed**: `*.{vue,ts,js,json,md}`
- **Setup**: Husky is initialized via `npm run prepare` (runs automatically after `npm install`)

### Branch Protection

- Main branch requires PR approval
- All CI checks must pass before merge
- Up-to-date branch requirement enforced

## Development Workflow

### TDD Cycle

1. **RED**: Write failing test in `__tests__/` directory
2. **GREEN**: Implement minimal code to pass the test
3. **REFACTOR**: Improve code while keeping tests green

### Component Development

- Create component in appropriate directory under `src/components/`
- Write tests first following TDD principles
- Use existing patterns from NoteDisplay.vue as reference
- Follow Vue 3 Composition API with `<script setup>`

### Code Quality Standards

- Comments in English (as per .cursorrules)
- No arbitrary Tailwind values without TODO justification
- Extract repeated class combinations into components or @apply
- Maintain accessibility with focus-visible states and aria attributes

## Environment Setup

- **Node.js**: 20.x LTS required
- **Package manager**: npm (lock file committed)
- **Development port**: 5173 (Vite default)

## File Structure Context

```
src/
├── components/          # Vue components
│   ├── __tests__/      # Component tests
│   └── NoteDisplay.vue # Main feature component
├── assets/             # Static assets (CSS, images)
├── views/              # Page-level components
└── main.js            # Application entry point
```

## Important Notes for LLMs

### Formatting

- **DO NOT** change quote styles (`'` ↔ `"`) unless explicitly asked
- **DO NOT** add/remove semicolons unless fixing a Prettier error
- Prettier will normalize formatting on commit - trust the process
- If you see inconsistent formatting, it will be fixed by Prettier automatically
- When generating new code, match the existing file's style
- If unsure about style, use Prettier defaults (double quotes, semicolons)
- Always assume `npm run lint:fix` will be run before commit

### Code Generation

- When generating new code, match the existing file's style
- If unsure about style, use Prettier defaults (double quotes, semicolons)
- Always assume `npm run lint:fix` will be run before commit
- Don't spend tokens on formatting - Prettier handles it

### Testing

- Write tests in English with "should" prefix (e.g., "should render correctly")
- Follow TDD: RED → GREEN → REFACTOR
- Tests should be in `__tests__/` directories alongside source files
- Use descriptive test names that explain expected behavior
