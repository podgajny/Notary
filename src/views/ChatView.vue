<script setup lang="ts">
import { onMounted } from "vue";
import ChatInterface from "../components/ChatInterface.vue";
import { useNotesStore } from "../stores/notes.store";

const notesStore = useNotesStore();

onMounted(async () => {
  await notesStore.fetchNotes();
});
</script>

<template>
  <main class="min-h-screen bg-slate-100 py-10">
    <div class="mx-auto flex max-w-5xl flex-col gap-8 px-6">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-semibold text-slate-900">LLM Chat</h1>
          <p class="mt-2 text-sm text-slate-600">
            Discuss your notes with an AI assistant. API key configuration will
            be available here soon.
          </p>
        </div>
      </header>

      <div
        class="grid h-[calc(100vh-12rem)] grid-cols-1 gap-6 md:grid-cols-[60%_40%]"
      >
        <div class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <ChatInterface />
        </div>

        <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-slate-900">Notes</h2>
          <p class="mt-2 text-sm text-slate-600">
            Notes selection will be available here in the next phase.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
