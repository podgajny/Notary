# PRD: Note Detail View

## Introduction/Overview

Currently, notes in the Notary application display truncated content in the list view. Users cannot see the full content of longer notes without this limitation. This feature introduces a note detail view that displays the complete note content when a user clicks on a note in the list.

The note detail view will be displayed in a Dialog (modal) component, similar to the "Create note" interface, providing a consistent user experience. This initial implementation focuses on read-only viewing, with editing capabilities planned for future iterations.

**Problem it solves:** Users need to view the full content of their notes, especially when the content is longer than what fits in the truncated list view.

## Goals

1. Allow users to view the complete content of any note by clicking on it
2. Provide a consistent UI experience that matches the existing "Create note" interface
3. Implement proper accessibility features including keyboard navigation and focus management
4. Create a foundation for future editing, tagging, and deletion features

## User Stories

1. As a user, I want to click on a note in the list so that I can view its complete content
2. As a user, I want to see the note's creation date so that I know when it was created
3. As a user, I want to close the detail view by clicking outside the dialog, pressing ESC, or clicking an X button so that I can return to the note list
4. As a keyboard user, I want focus to be trapped within the dialog when it's open so that I can navigate it efficiently
5. As a keyboard user, I want focus to return to the clicked note when the dialog closes so that I don't lose my place in the list

## Functional Requirements

1. **Dialog Trigger:** Clicking on any note in the note list must open the note detail Dialog
2. **Dialog Component:** Must use shadcn-vue Dialog component with the following sub-components:
   - DialogContent
   - DialogHeader
   - DialogTitle
   - DialogDescription (optional, if needed)
3. **Content Display:**
   - Display the note title prominently in the DialogHeader
   - Display the full note body/content with preserved formatting (line breaks, whitespace)
   - Display the creation date below the content
4. **Dialog Sizing:** The Dialog should be similar in size to the "Create note" card component:
   - Use appropriate max-width (recommended: `max-w-2xl` or similar to maintain readability)
   - Adequate padding matching the card style (`p-6`)
5. **Close Mechanisms:** The Dialog must close when:
   - User clicks outside the DialogContent (on the overlay)
   - User clicks the X close button in the DialogHeader
   - User presses the ESC key
6. **Content Overflow:** If note content exceeds the Dialog height, it must scroll within the DialogContent area
7. **Read-Only Mode:** The title and body must be displayed as static text (not editable inputs) in this version
8. **Styling Consistency:**
   - Use TailwindCSS classes consistent with NoteEditor.vue
   - Match the visual styling of the "Create note" card (borders, shadows, spacing)
   - Label/field spacing should match the existing form patterns

## Non-Goals (Out of Scope)

1. Editing note content (planned for CMD-96)
2. Deleting notes (planned for CMD-95)
3. Adding or managing tags
4. Changing note metadata
5. Keyboard shortcuts beyond ESC to close
6. Multiple notes open simultaneously
7. Direct navigation between notes within the Dialog

## Design Considerations

### Component Structure

The implementation should create a new component: `NoteDetailDialog.vue`

### Visual Design

- **Layout:** Mirror the NoteEditor.vue card layout within the Dialog
- **Typography:**
  - Title: `text-lg font-semibold text-slate-900`
  - Body: Standard text styling with preserved whitespace
  - Creation date: `text-sm text-slate-600` (smaller, gray text)
- **Spacing:** Use `space-y-4` or `space-y-5` between sections
- **Dialog Styling:** Use shadcn-vue default Dialog styles with minimal customization

### Size Recommendation

Based on the NoteEditor.vue card (`p-6` padding, `max-w-5xl` container in HomeView), the Dialog should use:

- **Recommended max-width:** `max-w-2xl` (672px) - large enough for comfortable reading but not overwhelming
- **Padding:** `p-6` inside DialogContent to match the card style
- **Height:** Let content determine height up to a reasonable max (e.g., `max-h-[80vh]`) with internal scrolling

### Animation/Transition

Use shadcn-vue Dialog's default fade-in animation which is:

- Fast and snappy (typically 150-200ms)
- Follows modern web best practices
- Provides smooth user experience without feeling sluggish

## Technical Considerations

1. **Dependencies:**
   - Requires shadcn-vue Dialog component to be installed
   - Integrates with existing note list component (needs to be identified during implementation)
2. **Props:**
   - `note`: Object containing `{ id, title, body, createdAt }`
   - `isOpen`: Boolean to control Dialog visibility
   - Event emitter for `@close` or `@update:isOpen`
3. **Accessibility:**
   - Dialog must trap focus when open (handled by shadcn-vue Dialog by default)
   - Focus must return to the triggering note element when closed
   - Proper ARIA attributes (handled by shadcn-vue Dialog)
   - Close button must be keyboard accessible
4. **State Management:**
   - Parent component manages which note is selected
   - Parent component manages Dialog open/closed state
5. **Testing Strategy (TDD):**
   - Write tests for Dialog rendering with note data
   - Test all three close mechanisms (overlay click, X button, ESC key)
   - Test focus management (trap and return)
   - Snapshot tests for component structure

## Success Metrics

1. **Functionality:** Users can successfully view full note content for any note
2. **Accessibility:** Dialog passes keyboard navigation tests (focus trap and return)
3. **Performance:** Dialog opens and closes smoothly without noticeable lag
4. **Code Quality:** All tests pass, no linting errors, component follows existing patterns
5. **User Feedback:** No confusion about how to open or close the detail view

## Open Questions

1. ~~Should we show the creation date? → **Yes, display creation date**~~
2. ~~What happens with very long notes (thousands of lines)? → **Scrolling within Dialog with max-height**~~
3. Should there be a visual indicator on notes in the list that they are clickable (cursor pointer, hover effect)?
   - **Recommendation:** Add `cursor-pointer` and a subtle hover effect to note list items
4. Should the Dialog have a visual header/title area separate from the note title, or should the note title serve as the Dialog title?
   - **Recommendation:** Use the note title as the DialogTitle in the DialogHeader
5. Are there any character limits we should display (e.g., "Showing 500 of 10,000 characters")?
   - **Recommendation:** Display full content without limits for now

## Implementation Notes for Developer

### Component File Location

Create: `src/components/NoteDetailDialog.vue`

### Integration Point

Modify the note list component (to be determined during implementation) to:

1. Add click handlers to each note
2. Manage selected note state
3. Control Dialog open/closed state

### shadcn-vue Dialog Installation

If not already installed, run:

```bash
npx shadcn-vue@latest add dialog
```

### Example Usage Pattern

```vue
<template>
  <NoteDetailDialog
    :note="selectedNote"
    :is-open="isDialogOpen"
    @update:is-open="isDialogOpen = $event"
  />
</template>
```

### TDD Workflow

1. **RED:** Write failing tests for Dialog rendering, close behaviors, and focus management
2. **GREEN:** Implement minimal Dialog component to pass tests
3. **REFACTOR:** Polish styling, improve code structure
4. Run `npm run test:run` and `npm run lint` before committing
