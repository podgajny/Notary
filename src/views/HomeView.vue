<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import NoteEditor from "../components/NoteEditor.vue";
import NoteList from "../components/NoteList.vue";
import ToolSidebar from "../components/ToolSidebar.vue";
import {
  NoteStoreError,
  useNotesStore,
  type Note,
} from "../stores/notes.store";

const notesStore = useNotesStore();
const loadErrorMessage = ref("");
const currentNote = ref<Note | null>(null);
const isSidebarCollapsed = ref(false);
const isToolSidebarCollapsed = ref(false);
const noteEditorRef = ref<InstanceType<typeof NoteEditor> | null>(null);

// Load sidebar state from localStorage on mount
onMounted(() => {
  fetchNotes();
  const savedState = localStorage.getItem("sidebarCollapsed");
  if (savedState !== null) {
    isSidebarCollapsed.value = savedState === "true";
  }
  const savedToolSidebarState = localStorage.getItem("toolSidebarCollapsed");
  if (savedToolSidebarState !== null) {
    isToolSidebarCollapsed.value = savedToolSidebarState === "true";
  }
});

const handleSave = async (input: { title: string; body: string }) => {
  if (currentNote.value) {
    // Update existing note
    await notesStore.updateNote({
      id: currentNote.value.id,
      title: input.title,
      body: input.body,
    });
    // Refresh notes to get updated note
    await fetchNotes();
    // Update currentNote to the updated version
    const updatedNote = notesStore.notes.find(
      (n) => n.id === currentNote.value!.id
    );
    if (updatedNote) {
      currentNote.value = updatedNote;
    }
  } else {
    // Create new note
    await notesStore.createNote(input);
    await fetchNotes();
    // Clear form after creating new note
    currentNote.value = null;
  }
};

const fetchNotes = async () => {
  loadErrorMessage.value = "";

  try {
    await notesStore.fetchNotes();
  } catch (error) {
    if (error instanceof NoteStoreError) {
      if (error.code === "STORAGE_READ_FAILED") {
        loadErrorMessage.value = "Could not load notes. Try again.";
        return;
      }

      loadErrorMessage.value = error.message;
      return;
    }

    loadErrorMessage.value = "Something went wrong. Try again.";
  }
};

const handleNoteClicked = (note: Note) => {
  currentNote.value = note;
};

const handleNewNote = () => {
  currentNote.value = null;
};

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  localStorage.setItem("sidebarCollapsed", isSidebarCollapsed.value.toString());
};

const toggleToolSidebar = () => {
  isToolSidebarCollapsed.value = !isToolSidebarCollapsed.value;
  localStorage.setItem(
    "toolSidebarCollapsed",
    isToolSidebarCollapsed.value.toString()
  );
};

const handleSaveClick = async () => {
  if (noteEditorRef.value) {
    await noteEditorRef.value.submit();
  }
};

const isSaving = computed(() => {
  return noteEditorRef.value?.isSaving ?? false;
});
</script>

<template>
  <main class="flex h-screen bg-slate-100">
    <aside
      class="relative border-r border-slate-200 bg-white transition-all duration-300"
      :class="isSidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80'"
    >
      <NoteList
        :notes="notesStore.notes"
        :is-loading="notesStore.isLoading"
        :load-error="loadErrorMessage"
        :current-note="currentNote"
        @note-clicked="handleNoteClicked"
      />
      <button
        v-if="!isSidebarCollapsed"
        type="button"
        class="absolute right-0 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-l-md border border-r-0 border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
        aria-label="Collapse sidebar"
        @click="toggleSidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </aside>
    <button
      v-if="isSidebarCollapsed"
      type="button"
      class="absolute left-0 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-r-md border border-l-0 border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
      aria-label="Expand sidebar"
      @click="toggleSidebar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
    <section class="flex flex-1 flex-col bg-slate-100">
      <div class="flex items-center gap-2 px-6 pt-6">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          @click="handleNewNote"
        >
          New Note
        </button>
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          :disabled="isSaving"
          @click="handleSaveClick"
        >
          <span v-if="isSaving">Saving…</span>
          <span v-else>Save</span>
        </button>
      </div>
      <div class="mt-6 flex-1 overflow-y-auto px-6 pb-6">
        <NoteEditor
          ref="noteEditorRef"
          :note="currentNote"
          :save-note="handleSave"
        />
      </div>
    </section>
    <aside
      class="relative border-l border-slate-200 bg-white transition-all duration-300"
      :class="isToolSidebarCollapsed ? 'w-0 overflow-hidden' : 'w-96'"
    >
      <ToolSidebar />
      <button
        v-if="!isToolSidebarCollapsed"
        type="button"
        class="absolute left-0 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-r-md border border-l-0 border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
        aria-label="Collapse tool sidebar"
        @click="toggleToolSidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </aside>
    <button
      v-if="isToolSidebarCollapsed"
      type="button"
      class="absolute right-0 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-l-md border border-r-0 border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
      aria-label="Expand tool sidebar"
      @click="toggleToolSidebar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  </main>
</template>
