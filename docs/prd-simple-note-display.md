# PRD: Simple Note Display MVP

## Introduction/Overview

This feature creates a minimal single-page notetaking application MVP that displays one static note. The primary purpose is to serve as a learning exercise for coding while establishing the foundation for a personal notetaking system. The app will display a single note with a title and body content in a clean, minimal interface.

## Goals

1. Create a functional single-page Vue 3 application that displays one note
2. Establish a solid technical foundation using Vue 3 + Vite + shadcn/ui + TailwindCSS
3. Provide a working local development environment
4. Create a minimal, clean user interface following shadcn design principles
5. Serve as a learning exercise for modern web development practices

## User Stories

- **As a user, I want to see a note displayed on the page so that I can remind myself about the contents of this one particular note**
- **As a developer, I want a clean codebase foundation so that I can easily extend the application with additional features later**

## Functional Requirements

1. The application must display a single note with two components:
   - A title field showing "Hello World"
   - A body field containing lorem ipsum text
2. The application must use Vue 3 with Vite as the build tool
3. The application must use shadcn/ui components for UI elements
4. The application must use TailwindCSS for styling
5. The application must follow a minimal design aesthetic
6. The application must run locally on the default port (5173)
7. The note content must be static/hardcoded for this MVP
8. All code comments must be written in Polish

## Non-Goals (Out of Scope)

- Editing functionality
- Multiple notes support
- Data persistence or storage
- User authentication
- Note creation or deletion
- Search functionality
- Labels or categorization
- Server deployment
- Responsive design optimization (basic responsiveness acceptable)

## Design Considerations

- Use shadcn/ui design system for consistent, minimal aesthetics
- Follow the established UI conventions from the project's .cursorrules
- Implement a clean, distraction-free layout focused on content readability
- Use appropriate typography hierarchy (title should be prominent, body readable)
- Maintain sufficient white space for a clean appearance
- Ensure proper focus states and accessibility basics

## Technical Considerations

- Must use Vue 3 Composition API
- Build system: Vite
- UI Framework: shadcn/ui components (with Ui prefix)
- Styling: TailwindCSS with established color tokens
- Project structure should follow the established conventions:
  - `src/components/ui/*` for shadcn components
  - `src/components/*` for domain components
  - `src/lib/*` for utilities
- Code should be structured to easily accommodate future features like editing and multiple notes

## Success Metrics

- Application successfully runs locally without errors
- Single note displays correctly with title and body
- Code follows established project conventions and style guidelines
- Foundation is extensible for planned future features
- Development environment is properly configured and functional

## Open Questions

- Should the note be displayed in a card component or as plain text?
- What specific lorem ipsum length is preferred for the body content?
- Should we include any basic navigation structure for future expansion?
