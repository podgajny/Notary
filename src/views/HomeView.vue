<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import NoteEditor from "../components/NoteEditor.vue";
import NoteList from "../components/NoteList.vue";
import NoteDetailDialog from "../components/NoteDetailDialog.vue";
import {
  NoteStoreError,
  useNotesStore,
  type Note,
} from "../stores/notes.store";

const notesStore = useNotesStore();
const loadErrorMessage = ref("");
const selectedNote = ref<Note | null>(null);
const isDialogOpen = ref(false);

const handleSave = async (input: { title: string; body: string }) => {
  await notesStore.createNote(input);
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
  selectedNote.value = note;
  isDialogOpen.value = true;
};

onMounted(() => {
  fetchNotes();
});
</script>

<template>
  <main class="min-h-screen bg-slate-100 py-10">
    <div class="mx-auto flex max-w-5xl flex-col gap-8 px-6">
      <header>
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-semibold text-slate-900">Notary</h1>
          <RouterLink
            to="/chat"
            class="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Chat
          </RouterLink>
        </div>
        <p class="mt-2 text-slate-600">
          Lightweight notes app, starting with local-first creation. This page
          now shows the editor and list scaffolds we will flesh out next.
        </p>
      </header>
      <NoteEditor :save-note="handleSave" />
      <NoteList
        :notes="notesStore.notes"
        :is-loading="notesStore.isLoading"
        :load-error="loadErrorMessage"
        @note-clicked="handleNoteClicked"
      />
      <NoteDetailDialog
        v-if="selectedNote"
        :note="selectedNote"
        :is-open="isDialogOpen"
        @update:is-open="isDialogOpen = $event"
      />
    </div>
  </main>
</template>
