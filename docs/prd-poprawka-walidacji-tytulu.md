# PRD: Poprawka walidacji wymaganego pola tytułu (CMD-98)

## Introduction/Overview

Currently, the note editor displays a "Title is required" warning message immediately when the form loads, even when the user hasn't interacted with it yet. This creates a poor user experience as the warning appears before the user has had a chance to make any mistakes. Additionally, the Save button is disabled when the title field is empty, preventing users from even attempting to save.

This improvement changes the validation behavior to only show the warning when the user actively tries to save a note without a title, following standard form validation patterns where errors appear in response to user actions.

**Problem Statement:** The "Title is required" warning displays prematurely (on page load) instead of in response to a validation failure, creating a negative first impression and confusing users who haven't yet interacted with the form.

**Goal:** Implement reactive validation that only shows errors when users attempt to submit invalid data, while keeping the Save button enabled to allow the validation to trigger.

## Goals

1. Remove the premature "Title is required" warning that displays on page load
2. Enable the Save button at all times (except during the saving process)
3. Show the "Title is required" warning only when user clicks Save with an empty title
4. Automatically clear the warning when user starts typing in the title field
5. Focus the title input field when validation fails to reduce friction
6. Maintain all existing functionality (save success, error handling, form reset)
7. Preserve visual appearance of all UI elements

## User Stories

**As a** user creating a new note
**I want** the form to appear clean without error messages when it first loads
**So that** I have a welcoming, positive experience and don't feel like I've made a mistake before starting

**As a** user who forgets to add a title
**I want** to see a clear validation message when I click Save
**So that** I understand what's required and can quickly fix the issue

**As a** user who sees a validation error
**I want** the error to disappear as soon as I start typing
**So that** I get immediate feedback that I'm fixing the problem

**As a** user who sees a validation error
**I want** the title field to be automatically focused
**So that** I can immediately start typing without additional clicks

## Functional Requirements

### Validation Behavior

1. **FR-1:** The "Title is required" warning MUST NOT be displayed when the form first loads (even though title is empty)
2. **FR-2:** The "Title is required" warning MUST be displayed only after the user clicks the Save button while the title field is empty or contains only whitespace
3. **FR-3:** When the validation warning is displayed and the user types any character in the title field, the warning MUST immediately disappear
4. **FR-4:** When validation fails (empty title on save attempt), the title input field MUST automatically receive focus

### Button State Management

5. **FR-5:** The Save button MUST be enabled when the form loads (not disabled due to empty title)
6. **FR-6:** The Save button MUST remain enabled at all times EXCEPT when actively saving (isSaving = true)
7. **FR-7:** The Save button MUST be disabled only during the saving process to prevent duplicate submissions

### Form Submission Logic

8. **FR-8:** When the Save button is clicked with an empty or whitespace-only title:
   - The form MUST NOT call the `saveNote` function
   - The "Title is required" warning MUST be displayed
   - The title input field MUST receive focus
9. **FR-9:** When the Save button is clicked with a valid title (non-empty after trimming):
   - The form MUST proceed with the normal save process
   - No validation warning should be shown

### Edge Cases

10. **FR-10:** Title fields containing only whitespace (spaces, tabs, newlines) MUST be treated as empty and trigger validation
11. **FR-11:** Validation errors MUST be cleared when switching from empty to any non-empty value (even before trimming)
12. **FR-12:** The body field MUST remain optional with no validation requirements

### Existing Functionality Preservation

13. **FR-13:** All existing features MUST continue to work:
    - Success message display after successful save
    - Error message display for save failures
    - Form reset after successful save
    - Disabled state during save operation
    - Trimming of title before submission
    - Focus on title field after form reset

## Non-Goals (Out of Scope)

1. Adding validation for the body field (remains optional)
2. Adding real-time validation as user types (validation only triggers on Save click)
3. Showing validation warning on blur of title field (only on Save click)
4. Adding character count or length validation for title
5. Implementing "touched" field state tracking
6. Adding visual styling changes to the error message
7. Implementing multiple validation rules or custom validation messages
8. Adding keyboard shortcuts for form submission (Enter key, etc.)

## Design Considerations

### Current Implementation Analysis

**Location:** [NoteEditor.vue](src/components/NoteEditor.vue)

**Current behavior (lines 162-164):**

```vue
<p v-if="isTitleEmpty" class="mt-1 text-sm text-red-600">
  {{ TITLE_REQUIRED_COPY }}
</p>
```

- Shows warning whenever `isTitleEmpty` computed property is true
- This is true on page load since title starts as empty string

**Current button state (lines 38-39, 185):**

```vue
const isSaveDisabled = computed(() => isSaving.value || isTitleEmpty.value); ...
:disabled="isSaveDisabled"
```

- Button disabled when title is empty OR during save operation

### Proposed Changes

**1. Add validation state tracking:**

```typescript
const showTitleError = ref(false);
```

**2. Update error display condition:**

```vue
<p v-if="showTitleError" class="mt-1 text-sm text-red-600">
  {{ TITLE_REQUIRED_COPY }}
</p>
```

**3. Simplify button disabled condition:**

```typescript
const isSaveDisabled = computed(() => isSaving.value);
// Remove isTitleEmpty check
```

**4. Update submit function to set validation state:**

```typescript
const submit = async () => {
  if (isTitleEmpty.value) {
    showTitleError.value = true;
    focusTitleInput();
    return;
  }

  // ... rest of save logic
};
```

**5. Update title watcher to clear validation error:**

```typescript
watch(title, () => {
  if (showTitleError.value) {
    showTitleError.value = false;
  }
  // ... existing logic
});
```

### Visual Behavior Flow

**Scenario 1: Happy Path (with title)**

1. User opens form → No warning shown, Save button enabled ✅
2. User types title "Shopping List" → No warning shown ✅
3. User types body "Milk, Eggs" → No warning shown ✅
4. User clicks Save → Success message "Note saved", form clears ✅

**Scenario 2: Validation Trigger (without title)**

1. User opens form → No warning shown, Save button enabled ✅
2. User types body "Some content" → No warning shown ✅
3. User clicks Save without title → "Title is required" warning appears, focus moves to title field ✅
4. User types "T" in title → Warning disappears immediately ✅
5. User types "itle" → No warning shown ✅
6. User clicks Save → Success message, form clears ✅

**Scenario 3: Whitespace Edge Case**

1. User opens form → No warning shown ✅
2. User types " " (spaces) in title → No warning shown ✅
3. User clicks Save → "Title is required" warning appears (trimmed title is empty) ✅
4. User types "T" → Warning disappears ✅

## Technical Considerations

### Implementation Details

1. **New State Variable:** Add `showTitleError` ref to track whether validation error should be displayed
2. **Computed Property Update:** Modify `isSaveDisabled` to only check `isSaving`, removing `isTitleEmpty` check
3. **Template Update:** Change error display condition from `v-if="isTitleEmpty"` to `v-if="showTitleError"`
4. **Submit Function Update:** Set `showTitleError.value = true` when validation fails
5. **Watcher Update:** Clear `showTitleError.value = false` when title changes (existing watcher already clears errors)

### Test Updates Required

Based on [NoteEditor.spec.ts](src/components/__tests__/NoteEditor.spec.ts), the following tests will need updates:

**Tests that will FAIL and need updates:**

1. **Line 63-74:** `"powinien wyłączyć przycisk Save gdy tytuł jest pusty"`
   - Currently expects button to be disabled when title is empty
   - Needs to change: button should be enabled even when title is empty

2. **Line 76-87:** `"powinien włączyć przycisk Save gdy tytuł jest wypełniony"`
   - Currently tests that button enables when title is filled
   - May need adjustment since button is now always enabled

3. **Line 37-47:** `"powinien wyświetlać błąd gdy tytuł jest pusty"`
   - Currently expects error to show when title is empty
   - Needs to verify error shows only AFTER form submission attempt

**Tests that should PASS without changes:**

- Form rendering tests (lines 13-35)
- Save function invocation tests (lines 89-127)
- Save process tests (lines 129-187)
- Error handling tests (lines 189-228)
- Accessibility tests (lines 253-275)

**New test needed:**

- Test that error does NOT appear on initial page load

### Dependencies

- **No external dependencies:** Changes are isolated to NoteEditor component
- **No store changes:** Validation is purely UI-level logic
- **No API changes:** Backend validation remains unchanged

### Files to Modify

1. **[src/components/NoteEditor.vue](src/components/NoteEditor.vue)**
   - Add `showTitleError` reactive state
   - Update `isSaveDisabled` computed property
   - Update `submit` function to set validation state and focus input
   - Update template to use `showTitleError` instead of `isTitleEmpty`
   - Update title watcher to clear `showTitleError`

2. **[src/components/**tests**/NoteEditor.spec.ts](src/components/__tests__/NoteEditor.spec.ts)**
   - Update tests that check button disabled state
   - Add test for no error on initial load
   - Update validation error display tests

## Success Metrics

### Functional Success Criteria

**Test Scenario 1: Clean initial state**

1. Open the note editor
2. **Expected:** No "Title is required" message visible
3. **Expected:** Save button is enabled (not grayed out)

**Test Scenario 2: Validation triggers on save**

1. Click Save button without entering a title
2. **Expected:** "Title is required" message appears below title field
3. **Expected:** Title input field receives focus (cursor is in the field)
4. **Expected:** `saveNote` function was NOT called

**Test Scenario 3: Error clears on input**

1. Follow Scenario 2 to trigger validation error
2. Type any character in the title field
3. **Expected:** "Title is required" message disappears immediately

**Test Scenario 4: Whitespace validation**

1. Enter only spaces/tabs in title field
2. Click Save
3. **Expected:** "Title is required" message appears (whitespace treated as empty)

**Test Scenario 5: Successful save**

1. Enter title "Test Note"
2. Click Save
3. **Expected:** No error message, success message appears, form resets

**Test Scenario 6: Save button always enabled**

1. Open form, verify button enabled
2. Type in title, verify button still enabled
3. Clear title, verify button still enabled
4. During save operation, verify button disabled (only during save)

### Automated Test Success

- Run `npm run test:run`
- All tests MUST pass
- Code coverage MUST maintain current levels

### Manual Testing Checklist

- [ ] Form loads with no error messages
- [ ] Save button is enabled on load
- [ ] Clicking Save with empty title shows error
- [ ] Error appears below title field in red text
- [ ] Title field receives focus when validation fails
- [ ] Error disappears when typing first character
- [ ] Whitespace-only title triggers validation
- [ ] Valid submission works correctly
- [ ] Success/error messages still work
- [ ] Form resets after successful save
- [ ] Button only disables during save operation

## Open Questions

1. **Q:** Should we add a subtle visual indicator (like red border) to the title input field when validation fails?
   - **A:** Out of scope for this PR. Current implementation only shows text error message. Can be considered in a future enhancement.

2. **Q:** Should validation also trigger on form blur (when user clicks outside the form)?
   - **A:** No, validation should only trigger on Save button click. Keep it simple.

3. **Q:** What if we want to add more validation rules in the future (e.g., max length)?
   - **A:** The proposed implementation with `showTitleError` state can be extended to `validationErrors` object in the future, but that's out of scope for this improvement.

4. **Q:** Should we track which fields the user has "touched" (interacted with)?
   - **A:** Not needed for this implementation. Current approach is simpler and sufficient.

---

## Related Issues

- **Issue:** [CMD-98](https://linear.app/cmdenter/issue/CMD-98/poprawka-do-wymaganych-pol)
- **Related:** CMD-96 (Edit note) - may use similar validation pattern
- **Related:** CMD-97 (Unsaved changes warning) - interaction with form state

## Timeline

- **Estimated Effort:** 2-3 hours
  - Implementation: 1 hour
  - Test updates: 1 hour
  - Manual testing: 30 minutes
- **Complexity:** Low (isolated component change)
- **Priority:** Medium (UX improvement, not critical bug)
- **Risk:** Low (well-defined change, existing tests will catch regressions)
