<template>
  <div class="note-editor">
    <Card class="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle class="flex items-center justify-between">
          <span>Nowa notatka</span>
          <div v-if="store.hasUnsavedChanges" class="flex items-center gap-2 text-sm text-muted-foreground">
            <div class="w-2 h-2 bg-yellow-500 rounded-full" />
            <span data-testid="unsaved-indicator">Niezapisane zmiany</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSave">
          <fieldset :disabled="store.isLoading" class="space-y-4">
            <legend class="sr-only">Nowa notatka</legend>
            
            <!-- Tytuł notatki -->
            <div class="space-y-2">
              <Input
                v-model="formData.title"
                data-testid="note-title-input"
                placeholder="Tytuł notatki..."
                aria-label="Tytuł notatki"
                :aria-describedby="showTitleError ? 'title-error' : undefined"
                :class="{ 'border-destructive': showTitleError }"
                @input="handleInput"
              />
              <div
                v-if="showTitleError"
                id="title-error"
                data-testid="title-helper-text"
                class="text-sm text-destructive"
              >
                Tytuł jest wymagany
              </div>
            </div>

            <!-- Treść notatki -->
            <div class="space-y-2">
              <Textarea
                v-model="formData.body"
                data-testid="note-body-textarea"
                placeholder="Treść notatki..."
                aria-label="Treść notatki"
                rows="8"
                class="resize-none"
                @input="handleInput"
              />
            </div>

            <!-- Komunikaty błędów -->
            <div v-if="store.error" data-testid="error-message" class="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {{ store.error }}
            </div>

            <!-- Komunikat sukcesu -->
            <div
              v-if="showSuccessMessage"
              data-testid="success-message"
              class="p-3 text-sm text-green-700 bg-green-50 rounded-md"
            >
              Notatka została zapisana pomyślnie!
            </div>
          </fieldset>
        </form>
      </CardContent>

      <CardFooter class="flex justify-between">
        <div class="text-sm text-muted-foreground">
          <span v-if="store.draft?.lastModified">
            Ostatnio zapisano: {{ formatDate(store.draft.lastModified) }}
          </span>
        </div>
        
        <div class="flex gap-2">
          <Button
            v-if="store.hasUnsavedChanges"
            variant="outline"
            @click="handleClear"
            :disabled="store.isLoading"
          >
            Wyczyść
          </Button>
          
          <Button
            data-testid="save-button"
            @click="handleSave"
            :disabled="!isValidForm || store.isLoading"
            class="min-w-[100px]"
          >
            <span v-if="store.isLoading">Zapisywanie...</span>
            <span v-else>Zapisz</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useNotesStore } from '../stores/notes.store';
import type { NoteFormData } from '../types';

// Komponenty UI
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Store
const store = useNotesStore();

// Formularz
const formData = ref<NoteFormData>({
  title: '',
  body: '',
});

// Stan komponentu
const showTitleError = ref(false);
const showSuccessMessage = ref(false);
const debounceTimer = ref<number | null>(null);

// Computed properties
const isValidForm = computed(() => {
  return formData.value.title.trim().length > 0;
});

// Formatowanie daty
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Obsługa wprowadzania danych
const handleInput = () => {
  // Ukryj błąd tytułu gdy użytkownik zaczyna pisać
  if (showTitleError.value && formData.value.title.trim()) {
    showTitleError.value = false;
  }

  // Ukryj komunikat sukcesu
  if (showSuccessMessage.value) {
    showSuccessMessage.value = false;
  }

  // Debounced auto-save
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }

  debounceTimer.value = window.setTimeout(async () => {
    if (formData.value.title.trim() || formData.value.body.trim()) {
      try {
        await store.saveDraft(formData.value);
      } catch (err) {
        console.error('Błąd podczas zapisywania draftu:', err);
      }
    }
  }, 2000);
};

// Obsługa zapisywania
const handleSave = async () => {
  console.log('handleSave called', { formData: formData.value, isValidForm: isValidForm.value });
  
  // Walidacja
  if (!isValidForm.value) {
    console.log('Form is not valid, showing title error');
    showTitleError.value = true;
    return;
  }

  try {
    console.log('Starting save process...', { draft: store.draft });
    
    // Użyj createNoteFromDraft jeśli draft istnieje, w przeciwnym razie createNote
    if (store.draft) {
      console.log('Creating note from draft');
      await store.createNoteFromDraft();
    } else {
      console.log('Creating new note', formData.value);
      await store.createNote(formData.value);
    }

    console.log('Note saved successfully');
    
    // Sukces - wyczyść formularz
    formData.value = { title: '', body: '' };
    showSuccessMessage.value = true;

    // Ukryj komunikat sukcesu po 3 sekundach
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);

  } catch (err) {
    console.error('Błąd podczas zapisywania notatki:', err);
    // Błąd jest obsługiwany przez store i wyświetlany w error message
  }
};

// Obsługa czyszczenia
const handleClear = async () => {
  formData.value = { title: '', body: '' };
  showTitleError.value = false;
  showSuccessMessage.value = false;
  
  try {
    await store.clearDraft();
  } catch (err) {
    console.error('Błąd podczas czyszczenia draftu:', err);
  }
};

// Ładowanie draftu przy montowaniu komponentu
onMounted(async () => {
  if (store.draft) {
    formData.value = {
      title: store.draft.title,
      body: store.draft.body,
    };
  }
});

// Obserwowanie zmian w draft ze store
watch(() => store.draft, (newDraft) => {
  if (newDraft && (!formData.value.title && !formData.value.body)) {
    formData.value = {
      title: newDraft.title,
      body: newDraft.body,
    };
  }
}, { immediate: true });

// Cleanup
onMounted(() => {
  return () => {
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value);
    }
  };
});
</script>

<style scoped>
.note-editor {
  @apply p-4;
}

/* Animacje dla komunikatów */
[data-testid="success-message"],
[data-testid="error-message"] {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fokus states dla dostępności */
input:focus-visible,
textarea:focus-visible {
  @apply ring-2 ring-ring ring-offset-2;
}

/* Disabled state */
fieldset:disabled {
  @apply opacity-60 pointer-events-none;
}
</style>
