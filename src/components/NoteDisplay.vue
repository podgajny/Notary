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
const noteTitle = ref('TEST: Zmieniony tytuł notatki - wersja testowa2')
const noteBody = ref('Dobry wieczór. Coś się... coś się popsuło i nie było mnie słychać, to powtórzę jeszcze raz. Wynik wyborczy KWW Stonogi to jest jakaś porażka, ja myślę że to polskie, kurwa głupie społeczeństwo, te kurwa banda imbecyli która głosowała na tych kurwów karakanów z PiSu to jest jakieś kurwa nieporozumienie. Jeśli tyle dla was znaczy... jeśli tyle dla was znaczy, ludzie takie zaangażowanie społeczne, jak moje gdzie postawiłem moją rodzinę, moje życie prywatne, biznes, wszystko inne i dla was tylko znaczyło to pierdolone 70 czy 80 tysięcy głosów, to was powinno się jebać kurwa, tak się powinno was jebać, jak tylko was może jebać PiS.')
</script>

<style scoped>
/* Tailwind CSS klasy zapewniają wszystkie potrzebne style */
</style>
