<template>
  <div id="app" class="min-h-screen bg-background">
    <div class="container mx-auto py-8">
      <h1 class="text-3xl font-bold text-center mb-8">Notary - Notatki</h1>
      <HomeView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotesStore } from './stores/notes.store'
import HomeView from './views/HomeView.vue'

// Inicjalizuj store przy starcie aplikacji
const notesStore = useNotesStore()

onMounted(async () => {
  await notesStore.initialize()
})
</script>