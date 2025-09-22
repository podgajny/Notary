<template>
  <div class="note-list" data-testid="note-list">
    <!-- Loading state -->
    <div
      v-if="store.isLoading"
      data-testid="loading-state"
      class="flex items-center justify-center p-8 text-muted-foreground"
    >
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        <span>Ładowanie notatek...</span>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="store.error"
      data-testid="error-state"
      class="p-4 text-sm text-destructive bg-destructive/10 rounded-md"
    >
      {{ store.error }}
    </div>

    <!-- Empty state -->
    <div
      v-else-if="store.notesSortedByDate.length === 0"
      data-testid="empty-state"
      class="text-center p-8 text-muted-foreground"
    >
      <div class="space-y-2">
        <h3 class="text-lg font-medium">Brak notatek</h3>
        <p>Rozpocznij pisanie swojej pierwszej notatki powyżej.</p>
      </div>
    </div>

    <!-- Notes grid -->
    <div
      v-else
      data-testid="note-grid"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <Card
        v-for="note in store.notesSortedByDate"
        :key="note.id"
        :class="[
          'note-item transition-all duration-200 hover:shadow-md cursor-pointer',
          getNoteItemSizeClass(note)
        ]"
        data-testid="note-item"
      >
        <CardHeader class="pb-2">
          <CardTitle
            data-testid="note-title"
            class="text-base font-medium line-clamp-2"
          >
            {{ note.title }}
          </CardTitle>
        </CardHeader>

        <CardContent class="space-y-3">
          <!-- Note preview -->
          <p
            data-testid="note-preview"
            :class="[
              'text-sm text-muted-foreground leading-relaxed',
              getNotePreviewClass(note)
            ]"
            v-if="note.body && note.body.trim()"
          >
            {{ getPreviewText(note.body) }}
          </p>

          <!-- Timestamp -->
          <div
            data-testid="note-timestamp"
            class="text-xs text-muted-foreground pt-2 border-t"
          >
            {{ formatDate(note.updatedAt) }}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNotesStore } from '../stores/notes.store';
import type { Note } from '../types';

// Komponenty UI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Store
const store = useNotesStore();

// Stałe dla dynamicznego rozmiaru kart
const CONTENT_LENGTH_SMALL = 100;
const CONTENT_LENGTH_LARGE = 200;

/**
 * Formatuje datę w polskim formacie
 */
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Zwraca pełną treść notatki (bez skracania)
 */
const getPreviewText = (body: string): string => {
  return body || '';
};

/**
 * Zwraca klasę CSS dla rozmiaru karty notatki
 */
const getNoteItemSizeClass = (note: Note): string => {
  const contentLength = note.title.length + note.body.length;
  
  if (contentLength <= CONTENT_LENGTH_SMALL) {
    return 'note-size-small';
  } else if (contentLength <= CONTENT_LENGTH_LARGE) {
    return 'note-size-medium';
  } else {
    return 'note-size-large';
  }
};

/**
 * Zwraca klasę CSS dla podglądu tekstu (bez ograniczania wysokości)
 */
const getNotePreviewClass = (note: Note): string => {
  // Zwróć podstawowe klasy bez line-clamp - pozwól na pełne wyświetlanie
  return 'whitespace-pre-wrap';
};
</script>

<style scoped>
.note-list {
  @apply w-full;
}

/* Dynamiczne rozmiary kart - pozwól na naturalne dopasowanie */
.note-size-small {
  @apply min-h-[100px];
}

.note-size-medium {
  @apply min-h-[120px];
}

.note-size-large {
  @apply min-h-[140px];
}

/* Line clamp utilities - fallback jeśli Tailwind nie ma line-clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-6 {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hover effects */
.note-item:hover {
  transform: translateY(-1px);
}

/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
