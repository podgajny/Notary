# PRD: LLM Chat View - Phase 1 (Basic Chat Interface)

## Introduction/Overview

This feature introduces a new chat interface view in the Notary application that will eventually allow users to discuss their notes with an LLM (Large Language Model). Phase 1 focuses on creating the foundational UI structure and chat interface without LLM integration, establishing the layout and user interaction patterns that will be enhanced in subsequent phases.

**Problem it solves:** Users need a dedicated space to interact with an AI assistant about their notes. This phase establishes the visual foundation and navigation structure, allowing users to access the chat view and interact with a basic message interface.

**Goal:** Create a functional chat view with split-pane layout, message display, and input handling, ready for LLM integration in Phase 3.

## Goals

1. Create a new `/chat` route and view accessible from the main application
2. Implement a split-pane layout (chat interface on left, notes area placeholder on right)
3. Build a basic chat interface with message list and input field
4. Add temporary navigation from HomeView to ChatView
5. Ensure responsive design that works on mobile and desktop
6. Establish component structure that can be easily extended in future phases

## User Stories

1. As a user, I want to navigate to a chat view from the main notes view so that I can access the LLM chat interface
2. As a user, I want to see a chat interface with a message list and input field so that I can understand how the chat will work
3. As a user, I want to type messages and see them appear in the chat so that I can interact with the interface
4. As a mobile user, I want the chat interface to stack vertically so that it fits on my screen
5. As a desktop user, I want to see the chat and notes side-by-side so that I can efficiently use both areas

## Functional Requirements

1. **Route Configuration:**
   - Add `/chat` route to `src/router/index.js`
   - Route must render `ChatView.vue` component
   - Route must be accessible via navigation

2. **ChatView Component:**
   - Create `src/views/ChatView.vue` component
   - Implement split-pane layout using CSS Grid or Flexbox
   - Desktop layout: 60% chat interface (left), 40% notes area placeholder (right)
   - Mobile layout: Stack vertically (chat on top, notes below)
   - Responsive breakpoint: Use `md:` Tailwind class (768px) for desktop layout
   - Include header area with placeholder for API key input (will be implemented in Phase 3)

3. **ChatInterface Component:**
   - Create `src/components/ChatInterface.vue` component
   - Display scrollable message list area
   - Show user messages as message bubbles
   - Messages stored in component state (not persisted to storage)
   - Input field at the bottom for typing messages
   - Send button next to input field
   - Handle message submission (add message to list, clear input)

4. **Message Display:**
   - User messages displayed as message bubbles
   - Messages show in chronological order (oldest to newest)
   - Message list scrolls to bottom when new message is added
   - Visual distinction for user messages (styling to differentiate from future assistant messages)

5. **Navigation Button:**
   - Add button in `HomeView.vue` header (next to title)
   - Button text: "Chat" or "LLM Chat" or similar
   - Use Vue Router `RouterLink` for navigation
   - Style consistently with existing UI
   - Structure code to allow easy extraction to navigation panel in the future

6. **UI Components:**
   - Install missing shadcn/ui components if needed:
     - `UiButton` (for send button and navigation)
     - `UiInput` (for message input field)
   - Use existing shadcn/ui components where applicable
   - Follow project naming conventions (Ui prefix for shadcn components)

7. **Styling Requirements:**
   - Follow TailwindCSS conventions from project rules
   - Maximum 10 classes per element
   - Use `gap-*` for spacing instead of margins
   - Mobile-first responsive design
   - Maximum 3 nesting levels for containers
   - Use CSS variables for colors (--primary, --secondary, etc.)
   - Maintain consistency with HomeView styling

8. **Responsive Behavior:**
   - Mobile (< 768px): Chat and notes stack vertically
   - Desktop (≥ 768px): Chat and notes side-by-side
   - Chat interface maintains usability at all screen sizes
   - Input field remains accessible and properly sized

## Non-Goals (Out of Scope)

1. LLM API integration (planned for Phase 3)
2. Notes list with toggle functionality (planned for Phase 2)
3. API key input and management (planned for Phase 3)
4. Chat history persistence (planned for Phase 4)
5. Assistant message display (will be added in Phase 3)
6. Token counting or context management
7. Provider selection (OpenAI/Anthropic)
8. Error handling for API calls
9. Loading states for API requests
10. Settings view integration

## Design Considerations

### Layout Structure

```
ChatView
├── Header (placeholder for API key input in Phase 3)
└── Split Container
    ├── ChatInterface (60% on desktop)
    │   ├── Messages List (scrollable)
    │   └── Input Area (fixed at bottom)
    └── Notes Area Placeholder (40% on desktop)
```

### Component Hierarchy

- `ChatView.vue` (view component)
  - `ChatInterface.vue` (chat UI component)
  - Placeholder div/section for notes (will become `SelectableNoteList.vue` in Phase 2)

### Visual Design

- **Chat Messages:**
  - User messages: Right-aligned or distinct styling
  - Background color: Use `bg-primary` or `bg-slate-100`
  - Text color: `text-slate-900`
  - Padding: `p-3` or `p-4`
  - Border radius: `rounded-lg` or `rounded-md`
  - Max width: `max-w-[80%]` or similar for message bubbles

- **Input Area:**
  - Fixed at bottom of chat interface
  - Flex layout: Input field + Send button
  - Input field: Full width minus button space
  - Send button: Icon or text, consistent with project style

- **Split Layout:**
  - Desktop: `grid grid-cols-[60%_40%]` or `flex` with appropriate widths
  - Mobile: `flex flex-col`
  - Gap between panes: `gap-4` or `gap-6`

- **Header:**
  - Title: "Chat" or "LLM Chat"
  - Placeholder area for API key input (visible but non-functional in Phase 1)
  - Styling consistent with HomeView header

### Spacing and Sizing

- Container max-width: Match HomeView (`max-w-5xl` or similar)
- Padding: `p-6` for main container sections
- Message spacing: `space-y-2` or `space-y-3` between messages
- Input area padding: `p-4`

## Technical Considerations

### Dependencies

1. **Vue Router:** Already installed, used for routing
2. **shadcn/ui components:** May need to install `button` and `input` components
3. **Pinia:** Already installed, may be used for state management in future phases

### Component Props and Events

**ChatInterface.vue:**

- No props needed in Phase 1 (messages managed internally)
- No events needed in Phase 1 (no parent interaction required)

**ChatView.vue:**

- No props needed (view component)
- Uses `useNotesStore` to prepare for Phase 2 (fetch notes, but don't display yet)

### State Management

- Messages stored in `ref<Array<{ id: string; content: string; timestamp: number }>>` in ChatInterface component
- No global state needed in Phase 1
- Navigation state handled by Vue Router

### File Structure

```
src/
├── views/
│   ├── HomeView.vue (modify: add navigation button)
│   └── ChatView.vue (new)
├── components/
│   ├── ChatInterface.vue (new)
│   └── ui/ (may need to add button and input)
└── router/
    └── index.js (modify: add /chat route)
```

### Code Organization

- Follow existing project structure
- Use Vue 3 Composition API with `<script setup>`
- TypeScript types for message objects
- Component naming: PascalCase for domain components, Ui prefix for shadcn components

### Navigation Button Implementation

Structure the navigation button in HomeView to allow easy extraction:

```vue
<!-- Option 1: Inline component -->
<RouterLink to="/chat" class="...">Chat</RouterLink>

<!-- Option 2: Separate component (better for future extraction) -->
<NavigationButton to="/chat" label="Chat" />
```

Recommendation: Start with Option 1 (inline) for simplicity, but structure the styling in a way that makes extraction easy.

## Success Metrics

1. **Functionality:**
   - Users can navigate to `/chat` route from HomeView
   - Users can type and send messages
   - Messages appear in the chat interface
   - Input field clears after sending

2. **Layout:**
   - Split-pane layout works correctly on desktop
   - Layout stacks correctly on mobile
   - Chat interface is scrollable when messages overflow

3. **Code Quality:**
   - All tests pass (if tests are written)
   - No linting errors
   - Components follow project conventions
   - Code is structured for easy extension in future phases

4. **User Experience:**
   - Navigation is intuitive
   - Chat interface feels responsive
   - No visual glitches or layout issues
   - Consistent styling with rest of application

## Open Questions

1. Should the navigation button have an icon? → **Recommendation:** Start with text-only, add icon later if needed
2. What should the placeholder notes area show? → **Recommendation:** Empty state message like "Notes will appear here" or subtle background
3. Should we add any loading states in Phase 1? → **Recommendation:** No, not needed until API integration
4. Should messages have timestamps? → **Recommendation:** Not in Phase 1, can be added in Phase 3 or 4
5. Should we persist messages to localStorage in Phase 1? → **Recommendation:** No, that's planned for Phase 4

## Implementation Notes for Developer

### Step-by-Step Implementation

1. **Add Route:**

   ```javascript
   // src/router/index.js
   {
     path: "/chat",
     name: "chat",
     component: () => import("../views/ChatView.vue"),
   }
   ```

2. **Create ChatView.vue:**
   - Set up split-pane layout with Grid or Flexbox
   - Add header with placeholder for API key
   - Import and use ChatInterface component
   - Add placeholder div for notes area

3. **Create ChatInterface.vue:**
   - Set up message list with `ref` for messages array
   - Create input field and send button
   - Implement `handleSend` function
   - Add auto-scroll to bottom when new message added

4. **Add Navigation Button:**
   - Modify HomeView.vue header
   - Add RouterLink to `/chat`
   - Style consistently

5. **Install UI Components (if needed):**
   ```bash
   npx shadcn-vue@latest add button
   npx shadcn-vue@latest add input
   ```

### Example ChatInterface Structure

```vue
<script setup lang="ts">
import { ref } from "vue";

type Message = {
  id: string;
  content: string;
  timestamp: number;
};

const messages = ref<Message[]>([]);
const inputValue = ref("");

const handleSend = () => {
  if (!inputValue.value.trim()) return;

  messages.value.push({
    id: crypto.randomUUID(),
    content: inputValue.value.trim(),
    timestamp: Date.now(),
  });

  inputValue.value = "";
  // Auto-scroll to bottom
};
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex-1 overflow-y-auto">
      <!-- Messages list -->
    </div>
    <div class="border-t p-4">
      <!-- Input area -->
    </div>
  </div>
</template>
```

### Testing Considerations

- Test navigation from HomeView to ChatView
- Test message input and display
- Test responsive layout (resize browser window)
- Test scrolling behavior with many messages
- Verify no console errors

### Branch Strategy

- Create new branch based on `cmd-100` branch
- Branch name suggestion: `cmd-101-llm-chat-phase1` or similar
- This ensures all changes from `cmd-99` and `cmd-100` are included
