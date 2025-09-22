<script setup lang="ts">
import { onMounted } from 'vue'
import NoteEditor from '../components/NoteEditor.vue'
import NoteList from '../components/NoteList.vue'
import { useNotesStore } from '../stores/notes.store'

// Inicjalizacja store
const store = useNotesStore()

onMounted(async () => {
  // Załaduj notatki i drafty przy starcie aplikacji
  await store.initialize()
})
</script>

<template>
  <main class="container mx-auto py-8 px-4 space-y-8">
    <!-- Edytor notatek -->
    <section>
      <NoteEditor />
    </section>

    <!-- Lista notatek -->
    <section>
      <NoteList />
    </section>
  </main>
</template>
