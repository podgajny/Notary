<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
    <!-- Tytuł notatki -->
    <h1 class="text-3xl font-bold text-gray-900 mb-6 leading-tight">{{ noteTitle }}</h1>
    
    <!-- Treść notatki -->
    <div class="text-base text-gray-700 leading-relaxed space-y-4">
      {{ noteBody }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Statyczne dane dla MVP
const noteTitle = ref('Hello World')
const noteBody = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
</script>

<style scoped>
/* Tailwind CSS klasy zapewniają wszystkie potrzebne style */
</style>
