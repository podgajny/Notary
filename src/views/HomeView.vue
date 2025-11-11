<script setup lang="ts">
import { onMounted, ref } from "vue";
import NoteEditor from "../components/NoteEditor.vue";
import NoteList from "../components/NoteList.vue";
import {
  NoteStoreError,
  useNotesStore,
  type Note,
} from "../stores/notes.store";

const notesStore = useNotesStore();
const loadErrorMessage = ref("");
const currentNote = ref<Note | null>(null);
const isSidebarCollapsed = ref(false);

// Load sidebar state from localStorage on mount
onMounted(() => {
  fetchNotes();
  const savedState = localStorage.getItem("sidebarCollapsed");
  if (savedState !== null) {
    isSidebarCollapsed.value = savedState === "true";
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
      class="absolute left-0 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-r-md border border-l-0 border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
      aria-label="Expand sidebar"
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
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
    <section class="flex flex-1 flex-col bg-slate-100">
      <div class="px-6 pt-6">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          @click="handleNewNote"
        >
          New Note
        </button>
      </div>
      <div class="flex-1 overflow-y-auto px-6 pb-6">
        <NoteEditor :note="currentNote" :save-note="handleSave" />
      </div>
    </section>
  </main>
</template>
