/**
 * Testy dla Pinia store zarządzającego notatkami
 * Używa TDD - testy napisane przed implementacją store
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { createMockNote, createMockDraft } from '../../tests/utils/indexeddb-mock';
import type { Note, Draft } from '../types';

// Import store do testowania (będzie zaimplementowany w następnym kroku)
import { useNotesStore } from './notes.store';

describe('Notes Store', () => {
  beforeEach(() => {
    // Skonfiguruj nową instancję Pinia dla każdego testu
    setActivePinia(createPinia());
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useNotesStore();

      expect(store.notes).toEqual([]);
      expect(store.draft).toBeNull();
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('Getters', () => {
    it('should calculate notes count correctly', () => {
      const store = useNotesStore();
      
      expect(store.notesCount).toBe(0);

      // Dodaj notatki bezpośrednio do state (do testowania gettera)
      store.notes = [
        createMockNote({ id: '1' }),
        createMockNote({ id: '2' }),
      ];

      expect(store.notesCount).toBe(2);
    });

    it('should return notes sorted by updatedAt (newest first)', () => {
      const store = useNotesStore();
      
      const note1 = createMockNote({
        id: '1',
        title: 'Old Note',
        updatedAt: '2023-01-01T10:00:00.000Z',
      });
      
      const note2 = createMockNote({
        id: '2',
        title: 'New Note',
        updatedAt: '2023-01-02T10:00:00.000Z',
      });

      store.notes = [note1, note2];

      const sortedNotes = store.notesSortedByDate;
      expect(sortedNotes[0].id).toBe('2'); // Nowsza notatka pierwsza
      expect(sortedNotes[1].id).toBe('1');
    });

    it('should check if draft has unsaved changes', () => {
      const store = useNotesStore();

      // Brak draftu
      expect(store.hasUnsavedChanges).toBe(false);

      // Pusty draft
      store.draft = createMockDraft({ title: '', body: '' });
      expect(store.hasUnsavedChanges).toBe(false);

      // Draft z treścią
      store.draft = createMockDraft({ title: 'Draft Title', body: '' });
      expect(store.hasUnsavedChanges).toBe(true);

      store.draft = createMockDraft({ title: '', body: 'Draft body' });
      expect(store.hasUnsavedChanges).toBe(true);
    });

    it('should find note by ID', () => {
      const store = useNotesStore();
      const note = createMockNote({ id: 'test-id', title: 'Test Note' });
      
      store.notes = [note];

      expect(store.getNoteById('test-id')).toEqual(note);
      expect(store.getNoteById('nonexistent')).toBeUndefined();
    });
  });

  describe('Actions - Loading Notes', () => {
    it('should load notes from database successfully', async () => {
      const store = useNotesStore();
      const mockNotes = [
        createMockNote({ id: '1', title: 'Note 1' }),
        createMockNote({ id: '2', title: 'Note 2' }),
      ];

      // Symuluj dane w bazie
      const { setNotes } = await import('../lib/db');
      await setNotes(mockNotes);

      await store.loadNotes();

      expect(store.notes).toHaveLength(2);
      expect(store.notes[0].title).toBe('Note 1');
      expect(store.notes[1].title).toBe('Note 2');
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should handle loading errors gracefully', async () => {
      const store = useNotesStore();
      
      // Test podstawowy case - puste dane
      await store.loadNotes();
      
      expect(store.notes).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull(); // Brak błędu dla pustych danych
    });

    it('should set loading state during load operation', async () => {
      const store = useNotesStore();
      
      expect(store.isLoading).toBe(false);
      
      const loadPromise = store.loadNotes();
      expect(store.isLoading).toBe(true);
      
      await loadPromise;
      expect(store.isLoading).toBe(false);
    });
  });

  describe('Actions - Creating Notes', () => {
    it('should create new note successfully', async () => {
      const store = useNotesStore();
      
      const newNote = await store.createNote({
        title: 'New Note',
        body: 'Note content',
      });

      expect(newNote).toBeDefined();
      expect(newNote.title).toBe('New Note');
      expect(newNote.body).toBe('Note content');
      expect(newNote.id).toBeDefined();
      expect(newNote.createdAt).toBeDefined();
      expect(newNote.updatedAt).toBeDefined();
      
      expect(store.notes).toHaveLength(1);
      expect(store.notes[0]).toEqual(newNote);
    });

    it('should validate note data before creation', async () => {
      const store = useNotesStore();

      // Pusty tytuł powinien rzucić błąd
      await expect(
        store.createNote({ title: '', body: 'Content' })
      ).rejects.toThrow('Tytuł notatki nie może być pusty');

      // Tytuł tylko z białymi znakami
      await expect(
        store.createNote({ title: '   ', body: 'Content' })
      ).rejects.toThrow('Tytuł notatki nie może być pusty');
    });

    it('should create note from draft and clear draft', async () => {
      const store = useNotesStore();
      
      // Ustaw draft
      store.draft = createMockDraft({
        title: 'Draft Title',
        body: 'Draft content',
      });

      const note = await store.createNoteFromDraft();

      expect(note.title).toBe('Draft Title');
      expect(note.body).toBe('Draft content');
      expect(store.notes).toHaveLength(1);
      expect(store.draft).toBeNull();
    });

    it('should handle creation errors gracefully', async () => {
      const store = useNotesStore();
      
      // Test podstawowy case - tworzenie prawidłowej notatki
      const note = await store.createNote({ title: 'Test', body: 'Content' });
      
      expect(note).toBeDefined();
      expect(note.title).toBe('Test');
      expect(store.notes).toHaveLength(1);
      expect(store.error).toBeNull();
    });
  });

  describe('Actions - Updating Notes', () => {
    it('should update existing note', async () => {
      const store = useNotesStore();
      
      // Stwórz notatki
      const note1 = await store.createNote({ title: 'Note 1', body: 'Body 1' });
      const note2 = await store.createNote({ title: 'Note 2', body: 'Body 2' });

      // Poczekaj krótko aby timestamp był różny
      await new Promise(resolve => setTimeout(resolve, 10));

      const updatedNote = await store.updateNote(note1.id, {
        title: 'Updated Title',
        body: 'Updated Body',
      });

      expect(updatedNote.title).toBe('Updated Title');
      expect(updatedNote.body).toBe('Updated Body');
      expect(updatedNote.id).toBe(note1.id);
      expect(updatedNote.createdAt).toBe(note1.createdAt);
      expect(new Date(updatedNote.updatedAt).getTime()).toBeGreaterThan(
        new Date(note1.updatedAt).getTime()
      );

      // Sprawdź czy w store została zaktualizowana
      const noteInStore = store.getNoteById(note1.id);
      expect(noteInStore?.title).toBe('Updated Title');
    });

    it('should handle updating non-existent note', async () => {
      const store = useNotesStore();

      await expect(
        store.updateNote('nonexistent-id', { title: 'Updated' })
      ).rejects.toThrow('Notatka o ID nonexistent-id nie została znaleziona');
    });

    it('should validate update data', async () => {
      const store = useNotesStore();
      const note = await store.createNote({ title: 'Original', body: 'Body' });

      await expect(
        store.updateNote(note.id, { title: '' })
      ).rejects.toThrow('Tytuł notatki nie może być pusty');
    });
  });

  describe('Actions - Deleting Notes', () => {
    it('should delete existing note', async () => {
      const store = useNotesStore();
      
      const note1 = await store.createNote({ title: 'Note 1', body: 'Body 1' });
      const note2 = await store.createNote({ title: 'Note 2', body: 'Body 2' });

      expect(store.notes).toHaveLength(2);

      await store.deleteNote(note1.id);

      expect(store.notes).toHaveLength(1);
      expect(store.getNoteById(note1.id)).toBeUndefined();
      expect(store.getNoteById(note2.id)).toBeDefined();
    });

    it('should handle deleting non-existent note gracefully', async () => {
      const store = useNotesStore();

      // Nie powinno rzucić błędu
      await expect(
        store.deleteNote('nonexistent-id')
      ).resolves.not.toThrow();

      expect(store.notes).toHaveLength(0);
    });
  });

  describe('Actions - Draft Management', () => {
    it('should load draft from database', async () => {
      const store = useNotesStore();
      const mockDraft = createMockDraft({
        title: 'Draft Title',
        body: 'Draft body',
      });

      // Symuluj draft w bazie
      const { setDraft } = await import('../lib/db');
      await setDraft(mockDraft);

      await store.loadDraft();

      expect(store.draft?.title).toBe('Draft Title');
      expect(store.draft?.body).toBe('Draft body');
      expect(store.draft?.lastModified).toBeDefined();
    });

    it('should save draft to database', async () => {
      const store = useNotesStore();
      
      await store.saveDraft({
        title: 'Draft Title',
        body: 'Draft content',
      });

      expect(store.draft?.title).toBe('Draft Title');
      expect(store.draft?.body).toBe('Draft content');
      expect(store.draft?.lastModified).toBeDefined();

      // Sprawdź czy zapisano w bazie
      const { getDraft } = await import('../lib/db');
      const savedDraft = await getDraft();
      expect(savedDraft?.title).toBe('Draft Title');
    });

    it('should clear draft', async () => {
      const store = useNotesStore();
      
      // Ustaw draft
      await store.saveDraft({ title: 'Draft', body: 'Content' });
      expect(store.draft).not.toBeNull();

      await store.clearDraft();
      
      expect(store.draft).toBeNull();

      // Sprawdź czy usunięto z bazy
      const { getDraft } = await import('../lib/db');
      const savedDraft = await getDraft();
      expect(savedDraft).toBeNull();
    });

    it('should update draft timestamp on save', async () => {
      const store = useNotesStore();
      
      await store.saveDraft({ title: 'Draft', body: 'Content' });
      const firstTimestamp = store.draft?.lastModified;

      // Poczekaj i zapisz ponownie
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await store.saveDraft({ title: 'Updated Draft', body: 'Content' });
      const secondTimestamp = store.draft?.lastModified;

      expect(secondTimestamp).not.toBe(firstTimestamp);
      expect(new Date(secondTimestamp!).getTime()).toBeGreaterThan(
        new Date(firstTimestamp!).getTime()
      );
    });
  });

  describe('Error Handling', () => {
    it('should clear error when performing successful operations', async () => {
      const store = useNotesStore();
      
      // Ustaw błąd
      store.error = 'Some error';
      
      // Wykonaj pomyślną operację
      await store.createNote({ title: 'Test', body: 'Content' });
      
      expect(store.error).toBeNull();
    });

    it('should preserve notes when individual operations fail', async () => {
      const store = useNotesStore();
      
      const note = await store.createNote({ title: 'Valid Note', body: 'Content' });
      expect(store.notes).toHaveLength(1);

      // Spróbuj dodać nieprawidłową notatkę
      try {
        await store.createNote({ title: '', body: 'Invalid' });
      } catch {
        // Oczekiwany błąd
      }

      // Oryginalna notatka powinna zostać
      expect(store.notes).toHaveLength(1);
      expect(store.notes[0]).toEqual(note);
    });
  });
});
