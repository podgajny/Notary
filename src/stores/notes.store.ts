/**
 * Pinia store do zarządzania notatkami
 * Obsługuje CRUD operacje, drafty i stan aplikacji
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getNotes, setNotes, getDraft, setDraft, clearDraft as clearDraftDB } from '../lib/db';
import { generateUUID } from '../lib/uuid';
import type { Note, Draft, CreateNotePayload, UpdateNotePayload, NoteFormData } from '../types';

export const useNotesStore = defineStore('notes', () => {
  // State
  const notes = ref<Note[]>([]);
  const draft = ref<Draft | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const notesCount = computed(() => notes.value.length);

  const notesSortedByDate = computed(() => {
    return [...notes.value].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  });

  const hasUnsavedChanges = computed(() => {
    if (!draft.value) return false;
    return draft.value.title.trim() !== '' || draft.value.body.trim() !== '';
  });

  const getNoteById = computed(() => {
    return (id: string) => notes.value.find(note => note.id === id);
  });

  // Actions - Utility
  function clearError() {
    error.value = null;
  }

  function setError(message: string) {
    error.value = message;
  }

  // Helper function to convert reactive notes array to plain objects for IndexedDB
  function getPlainNotes(): Note[] {
    return notes.value.map(note => ({
      id: note.id,
      title: note.title,
      body: note.body,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));
  }

  function validateNoteData(data: { title?: string; body?: string }) {
    if (data.title !== undefined) {
      const trimmedTitle = data.title.trim();
      if (trimmedTitle === '') {
        throw new Error('Tytuł notatki nie może być pusty');
      }
    }
  }

  // Actions - Loading
  async function loadNotes() {
    isLoading.value = true;
    clearError();

    try {
      const loadedNotes = await getNotes();
      notes.value = loadedNotes;
    } catch (err) {
      console.error('Błąd podczas ładowania notatek:', err);
      setError('Błąd podczas ładowania notatek');
      notes.value = []; // Fallback do pustej tablicy
    } finally {
      isLoading.value = false;
    }
  }

  // Actions - Creating Notes
  async function createNote(payload: CreateNotePayload): Promise<Note> {
    clearError();
    validateNoteData(payload);

    const now = new Date().toISOString();
    const newNote: Note = {
      id: generateUUID(),
      title: payload.title.trim(),
      body: payload.body || '',
      createdAt: now,
      updatedAt: now,
    };

    try {
      // Dodaj do lokalnego state (optimistic update)
      notes.value.push(newNote);

      // Zapisz do bazy danych
      await setNotes(getPlainNotes());

      return newNote;
    } catch (err) {
      // Cofnij optimistic update w przypadku błędu
      notes.value = notes.value.filter(note => note.id !== newNote.id);
      
      console.error('Błąd podczas tworzenia notatki:', err);
      setError('Błąd podczas tworzenia notatki');
      throw err;
    }
  }

  async function createNoteFromDraft(): Promise<Note> {
    if (!draft.value) {
      throw new Error('Brak draftu do zapisania');
    }

    const note = await createNote({
      title: draft.value.title,
      body: draft.value.body,
    });

    // Wyczyść draft po pomyślnym zapisaniu
    await clearDraft();

    return note;
  }

  // Actions - Updating Notes
  async function updateNote(id: string, updates: Partial<UpdateNotePayload>): Promise<Note> {
    clearError();
    validateNoteData(updates);

    const noteIndex = notes.value.findIndex(note => note.id === id);
    if (noteIndex === -1) {
      throw new Error(`Notatka o ID ${id} nie została znaleziona`);
    }

    const originalNote = notes.value[noteIndex];
    const updatedNote: Note = {
      ...originalNote,
      ...updates,
      id, // Zachowaj oryginalne ID
      createdAt: originalNote.createdAt, // Zachowaj datę utworzenia
      updatedAt: new Date().toISOString(), // Zaktualizuj timestamp
    };

    try {
      // Optimistic update
      notes.value[noteIndex] = updatedNote;

      // Zapisz do bazy danych
      await setNotes(getPlainNotes());

      return updatedNote;
    } catch (err) {
      // Cofnij optimistic update
      notes.value[noteIndex] = originalNote;
      
      console.error('Błąd podczas aktualizacji notatki:', err);
      setError('Błąd podczas aktualizacji notatki');
      throw err;
    }
  }

  // Actions - Deleting Notes
  async function deleteNote(id: string): Promise<void> {
    clearError();

    const noteIndex = notes.value.findIndex(note => note.id === id);
    if (noteIndex === -1) {
      // Nie rzucaj błędu - usuwanie nieistniejącej notatki jest bezpieczne
      return;
    }

    const noteToDelete = notes.value[noteIndex];

    try {
      // Optimistic update
      notes.value.splice(noteIndex, 1);

      // Zapisz do bazy danych
      await setNotes(getPlainNotes());
    } catch (err) {
      // Cofnij optimistic update
      notes.value.splice(noteIndex, 0, noteToDelete);
      
      console.error('Błąd podczas usuwania notatki:', err);
      setError('Błąd podczas usuwania notatki');
      throw err;
    }
  }

  // Actions - Draft Management
  async function loadDraft(): Promise<void> {
    clearError();

    try {
      const loadedDraft = await getDraft();
      draft.value = loadedDraft;
    } catch (err) {
      console.error('Błąd podczas ładowania draftu:', err);
      draft.value = null; // Fallback
    }
  }

  async function saveDraft(data: NoteFormData): Promise<void> {
    clearError();

    const draftToSave: Draft = {
      title: data.title,
      body: data.body,
      lastModified: new Date().toISOString(),
    };

    try {
      // Aktualizuj lokalny state
      draft.value = draftToSave;

      // Zapisz do bazy danych
      await setDraft(draftToSave);
    } catch (err) {
      console.error('Błąd podczas zapisywania draftu:', err);
      setError('Błąd podczas zapisywania draftu');
      throw err;
    }
  }

  async function clearDraft(): Promise<void> {
    clearError();

    try {
      // Wyczyść lokalny state
      draft.value = null;

      // Usuń z bazy danych
      await clearDraftDB();
    } catch (err) {
      console.error('Błąd podczas czyszczenia draftu:', err);
      // Nie rzucaj błędu - czyszczenie draftu nie powinno blokować aplikacji
    }
  }

  // Actions - Initialization
  async function initialize(): Promise<void> {
    await Promise.all([
      loadNotes(),
      loadDraft(),
    ]);
  }

  return {
    // State
    notes,
    draft,
    isLoading,
    error,

    // Getters
    notesCount,
    notesSortedByDate,
    hasUnsavedChanges,
    getNoteById,

    // Actions
    loadNotes,
    createNote,
    createNoteFromDraft,
    updateNote,
    deleteNote,
    loadDraft,
    saveDraft,
    clearDraft,
    initialize,
    clearError,
  };
});
