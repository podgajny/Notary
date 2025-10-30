# PRD: Wydłużenie podglądu notatki (CMD-94)

## Introduction/Overview

Currently, the note preview in the NoteList component is limited to approximately 120 characters displayed on a single line with ellipsis. This makes it difficult to distinguish between short and long notes at a glance, and users cannot see enough context before deciding which note to interact with.

This feature extends the note preview to display up to 5 lines of text with automatic wrapping, allowing users to see more content directly in the list view. This improves content scanability and helps users quickly identify the notes they're looking for.

**Problem Statement:** Users cannot see enough note content in the list view to distinguish between notes effectively.

**Goal:** Extend the note body preview from 1 line (~120 characters) to up to 5 lines with text wrapping.

## Goals

1. Display up to 5 lines of note body text in the preview
2. Automatically wrap text to fit the container width (no horizontal scrolling)
3. Show ellipsis (...) when content exceeds 5 lines
4. Maintain visual consistency across all screen sizes (mobile and desktop)
5. Allow cards to dynamically adjust height based on content length
6. Preserve existing functionality and styling of the NoteList component

## User Stories

**As a** user viewing my notes list
**I want** to see more lines of content in each note preview
**So that** I can better distinguish between notes and understand their content without opening them

**As a** user with short notes (1-2 lines)
**I want** the preview to only show the actual content
**So that** extra white space isn't wasted

**As a** user with long notes (10+ lines)
**I want** to see the first 5 lines with an ellipsis
**So that** I know there's more content and can distinguish it from shorter notes

## Functional Requirements

1. **FR-1:** The note body preview MUST display up to 5 lines of text
2. **FR-2:** Text MUST wrap automatically based on the container width (no horizontal overflow)
3. **FR-3:** When note content exceeds 5 lines, an ellipsis (...) MUST be shown at the end of the 5th line
4. **FR-4:** For notes with fewer than 5 lines of content, the preview MUST only display the actual content height (not force 5 lines of space)
5. **FR-5:** The 120-character limit MUST be removed in favor of line-based truncation
6. **FR-6:** The preview line count MUST remain consistent at 5 lines across all responsive breakpoints (mobile, tablet, desktop)
7. **FR-7:** Card height MUST dynamically adjust based on preview content length (taller for longer notes)
8. **FR-8:** All existing styling (typography, spacing, colors) MUST be preserved
9. **FR-9:** The implementation MUST use CSS `line-clamp` with `overflow: hidden` for line truncation
10. **FR-10:** Existing tests for NoteList component MUST continue to pass

## Non-Goals (Out of Scope)

1. Adding a "Read more" link or button (no detail view exists yet - see CMD-93)
2. Making the preview clickable or interactive (separate feature)
3. Adding animation or transitions for expanding/collapsing
4. Implementing adaptive line counts per breakpoint (e.g., 3 lines on mobile, 5 on desktop)
5. Changing the note card layout, colors, or typography beyond the preview text
6. Showing line numbers or additional metadata
7. Implementing rich text formatting or markdown rendering in preview

## Design Considerations

### Current Implementation

- Note body preview shows first ~120 characters
- Single line display with `overflow: hidden` and `text-overflow: ellipsis`
- Located in `NoteList.vue` component

### Proposed Changes

- Replace character-based truncation with line-based truncation
- Use CSS properties:
  ```css
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-wrap: break-word;
  ```
- Maintain existing Tailwind utility classes for consistency

### Visual Examples

**Short note (2 lines):**

```
Title: Shopping List
Body:
Milk
Eggs
```

→ Shows 2 lines, card height adjusts accordingly

**Long note (10 lines):**

```
Title: Meeting Notes
Body:
Discussed Q4 roadmap with the team.
Key decisions: prioritize feature X,
defer feature Y to Q1 next year.
Action items: John to follow up with
design team, Sarah to update the...
```

→ Shows exactly 5 lines with ellipsis at end

### Responsive Behavior

- **Mobile (< 768px):** 5 lines
- **Tablet (768px - 1024px):** 5 lines
- **Desktop (> 1024px):** 5 lines
- Text wraps naturally based on container width at each breakpoint

## Technical Considerations

1. **Browser Support:** CSS `line-clamp` is well-supported in modern browsers (Chrome, Firefox, Safari, Edge)
2. **Fallback:** For older browsers, use standard `overflow: hidden` without line-clamp
3. **Testing:** Update existing snapshot tests to accommodate multi-line previews
4. **Component Location:** Changes confined to `NoteList.vue` component
5. **No Store Changes:** No modifications needed to Pinia store or data model
6. **Performance:** Line-clamp is performant; no JavaScript truncation logic needed
7. **Accessibility:** Ensure truncated text doesn't break screen reader functionality

### Dependencies

- None (self-contained change to NoteList component)

### Files to Modify

- `src/components/NoteList.vue` - Update body preview styling
- `src/components/__tests__/NoteList.spec.ts` - Update tests for multi-line preview

## Success Metrics

### Functional Success Criteria

1. **Verification:** Create 3 test notes:
   - Short note (1-2 lines): "Buy milk"
   - Medium note (3-4 lines): 50-80 words
   - Long note (10+ lines): 200+ words
2. **Expected Results:**
   - Short note: Shows actual content, no ellipsis, smaller card
   - Medium note: Shows full content, no ellipsis, medium card
   - Long note: Shows exactly 5 lines with ellipsis, taller card
3. **Visual Consistency:** Cards maintain consistent styling (fonts, colors, spacing)
4. **Responsive:** Behavior consistent across mobile, tablet, desktop viewports
5. **Tests:** All existing NoteList tests pass (update snapshots as needed)

### Qualitative Success

- Users can visually distinguish short notes from long notes at a glance
- List view provides more context without requiring note detail view
- No regression in loading performance or visual appearance

## Open Questions

1. **Future Consideration:** Should we add a visual indicator (like a "..." badge) to show there's more content beyond the preview? (Defer to later feature)
2. **Edge Case:** How should we handle notes with very long single words (e.g., URLs)? Current approach with `word-wrap: break-word` will break mid-word - is this acceptable?
3. **Testing:** Do we need visual regression tests or are unit/snapshot tests sufficient?

---

## Related Issues

- **Depends on:** None
- **Blocks:** CMD-93 (note detail view will eventually replace/complement this preview)
- **Related:** CMD-96, CMD-95 (editing/deletion will work with this improved preview)

## Timeline

- **Estimated Effort:** 2-4 hours (small improvement)
- **Complexity:** Low
- **Priority:** Medium (quick win, improves UX)
