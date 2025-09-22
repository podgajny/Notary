# PRD: Creating Simple Text Notes

## Introduction/Overview

This feature introduces the ability for users to create simple text notes in a local-first application. Users can capture thoughts quickly without requiring authentication or internet connectivity. Notes are stored locally using IndexedDB and persist across browser sessions. This represents the first major functionality after the walking skeleton, establishing core patterns for data modeling, state management, persistence, and testing that will be reused in future features.

The feature solves the problem of quickly capturing thoughts and information without the friction of sign-ups, logins, or internet dependency.

## Goals

1. Enable users to create and persist simple text notes locally without authentication
2. Establish local-first architecture using IndexedDB for offline-capable note storage  
3. Implement core data patterns (state management, persistence, validation) for future feature development
4. Provide immediate visual feedback when notes are saved successfully
5. Prevent data loss through auto-save drafts and navigation warnings
6. Ensure notes persist across browser sessions and page refreshes

## User Stories

**As a** user **I want** to create a simple text note **so that** I can capture thoughts quickly without signing in.

**As a** user **I want** my notes to be saved locally **so that** I can access them without internet connectivity.

**As a** user **I want** to see my saved notes in a list **so that** I can review what I've previously written.

**As a** user **I want** to be warned before losing unsaved changes **so that** I don't accidentally lose my work.

**As a** user **I want** my draft changes to be preserved if I refresh the page **so that** I can continue editing where I left off.

## Functional Requirements

1. **Note Creation Interface**
   - The system must provide a title input field (required) with placeholder "Title"
   - The system must provide a body textarea field (optional) with placeholder "Write your note…"
   - The system must provide a Save button that is disabled when title is empty
   - The system must display validation helper text "Title is required" when save is attempted with empty title

2. **Note Persistence**
   - The system must save notes to IndexedDB using the key namespace `notes:v1`
   - Each note must have: id (UUID), title (string), body (string), createdAt (timestamp), updatedAt (timestamp)
   - The system must generate unique IDs using `crypto.randomUUID()` with fallback
   - The system must update timestamps automatically on creation

3. **Note Display**
   - The system must display saved notes in a list format, newest first (by updatedAt)
   - Note cards must dynamically adjust height to accommodate content
   - The system must use shadcn default UI components for consistent styling
   - The system must show notes immediately after saving (optimistic UI)

4. **Auto-save and Draft Management**
   - The system must auto-save drafts to separate storage (`drafts:v1`) as user types
   - Auto-save must be debounced to avoid excessive storage writes
   - Drafts must not overwrite published notes until Save button is clicked
   - The system must restore unsaved drafts when returning to edit after page refresh

5. **Navigation Protection**
   - The system must show browser confirmation dialog when user tries to leave with unsaved changes
   - Warning message must be: "You have unsaved changes. Are you sure you want to leave?"
   - Protection must apply to page refresh, tab close, and navigation attempts

6. **User Feedback**
   - The system must show loading state on Save button for ~200ms (optimistic)
   - The system must display "Note saved" toast message on successful save
   - The system must display "Could not save. Try again." error message on storage failure
   - Error messages must appear inline near the Save button

7. **Data Management**
   - The system must implement read/write operations: `getNotes()`, `setNotes()`, `getDraft()`, `setDraft()`
   - The system must handle storage errors gracefully without crashing
   - The system must use version suffixes (`v1`) to enable future data migrations

## Non-Goals (Out of Scope)

- Note editing/deletion functionality
- Note pinning, tagging, or categorization
- Search functionality
- Backup/restore capabilities
- User authentication or sync
- Feature flags system (to be added later)
- Advanced UI styling beyond shadcn defaults
- Text wrapping optimization
- Success metrics and analytics (private project scope)

## Design Considerations

- **UI Framework**: Use shadcn-vue default components for consistent styling
- **Layout**: Single page (`/`) with editor at top and note list below
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Visual Hierarchy**: Clear separation between editor and note list areas
- **Card Design**: Dynamic height cards that adapt to content length
- **Loading States**: Subtle loading indicators that don't disrupt user flow

## Technical Considerations

- **State Management**: Pinia store (`src/stores/notes.store.ts`) for centralized state
- **Database**: IndexedDB via `idb-keyval` library for simple key-value storage
- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite for development and building
- **Dependencies**: Minimal external dependencies (`pinia`, `idb-keyval`)
- **Browser Support**: Modern browsers with IndexedDB support
- **Performance**: Debounced auto-save to prevent excessive storage operations

## Success Metrics

Given the private project scope (2 users), success will be measured qualitatively:

- **Functionality**: All acceptance criteria pass in development and production environments
- **Usability**: Users can create notes quickly without friction
- **Reliability**: Notes persist across sessions without data loss
- **Performance**: Auto-save operates smoothly without noticeable delays

## Open Questions

1. **Auto-save timing**: What debounce delay should be used for auto-save? (Suggested: 1-2 seconds)
2. **Storage limits**: Should we implement storage quota monitoring for future scalability?
3. **Error recovery**: Beyond showing error messages, should we implement retry mechanisms?
4. **Draft cleanup**: Should old drafts be automatically cleaned up after a certain period?

---

*This PRD is based on Linear issue CMD-76 and incorporates clarifications about dynamic note sizing, auto-save functionality, navigation protection, and scope limitations for the MVP release.*
