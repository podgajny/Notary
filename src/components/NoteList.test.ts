/**
 * Testy jednostkowe dla komponentu NoteList.vue
 * Testuje renderowanie, sortowanie i stany puste
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import NoteList from './NoteList.vue';
import { useNotesStore } from '../stores/notes.store';
import type { Note } from '../types';

// Mock komponentów UI
vi.mock('@/components/ui/card', () => ({
  Card: { name: 'Card', template: '<div class="card"><slot /></div>' },
  CardContent: { name: 'CardContent', template: '<div class="card-content"><slot /></div>' },
  CardHeader: { name: 'CardHeader', template: '<div class="card-header"><slot /></div>' },
  CardTitle: { name: 'CardTitle', template: '<div class="card-title"><slot /></div>' },
}));

// Przykładowe dane testowe
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Pierwsza notatka',
    body: 'Treść pierwszej notatki',
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-03T10:00:00.000Z', // Najnowsza
  },
  {
    id: '2',
    title: 'Druga notatka',
    body: 'Bardzo długa treść drugiej notatki, która powinna być obcięta w podglądzie. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: '2024-01-02T10:00:00.000Z',
    updatedAt: '2024-01-02T15:00:00.000Z', // Środkowa
  },
  {
    id: '3',
    title: 'Trzecia notatka',
    body: 'Krótka treść',
    createdAt: '2024-01-03T10:00:00.000Z',
    updatedAt: '2024-01-01T15:00:00.000Z', // Najstarsza
  },
];

describe('NoteList.vue', () => {
  let wrapper: any;
  let store: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useNotesStore();
  });

  describe('Renderowanie podstawowe', () => {
    it('renderuje się poprawnie z pustą listą notatek', () => {
      store.notes = [];
      
      wrapper = mount(NoteList);
      
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('[data-testid="note-list"]').exists()).toBe(true);
    });

    it('wyświetla komunikat o braku notatek gdy lista jest pusta', () => {
      store.notes = [];
      
      wrapper = mount(NoteList);
      
      const emptyState = wrapper.find('[data-testid="empty-state"]');
      expect(emptyState.exists()).toBe(true);
      expect(emptyState.text()).toContain('Brak notatek');
    });

    it('nie wyświetla komunikatu o braku notatek gdy są notatki', () => {
      store.notes = [mockNotes[0]];
      
      wrapper = mount(NoteList);
      
      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false);
    });
  });

  describe('Wyświetlanie notatek', () => {
    beforeEach(() => {
      store.notes = [...mockNotes];
      wrapper = mount(NoteList);
    });

    it('renderuje wszystkie notatki', () => {
      const noteItems = wrapper.findAll('[data-testid="note-item"]');
      expect(noteItems).toHaveLength(3);
    });

    it('wyświetla tytuły notatek', () => {
      const noteTitles = wrapper.findAll('[data-testid="note-title"]');
      expect(noteTitles).toHaveLength(3);
      
      expect(noteTitles[0].text()).toBe('Pierwsza notatka');
      expect(noteTitles[1].text()).toBe('Druga notatka');
      expect(noteTitles[2].text()).toBe('Trzecia notatka');
    });

    it('wyświetla podgląd treści notatek', () => {
      const notePreview = wrapper.findAll('[data-testid="note-preview"]');
      expect(notePreview).toHaveLength(3);
      
      expect(notePreview[0].text()).toBe('Treść pierwszej notatki');
      expect(notePreview[2].text()).toBe('Krótka treść');
    });

    it('wyświetla pełną treść notatek bez obcinania', () => {
      const notePreview = wrapper.findAll('[data-testid="note-preview"]');
      const longNotePreview = notePreview[1].text();
      
      // Sprawdź czy treść jest wyświetlana w pełni
      expect(longNotePreview).toBe(mockNotes[1].body);
      expect(longNotePreview).not.toContain('...');
    });

    it('wyświetla daty ostatniej modyfikacji', () => {
      const timestamps = wrapper.findAll('[data-testid="note-timestamp"]');
      expect(timestamps).toHaveLength(3);
      
      // Sprawdź czy są wyświetlane w formacie polskim
      timestamps.forEach(timestamp => {
        expect(timestamp.text()).toMatch(/\d{2}\.\d{2}\.\d{4}/); // Format DD.MM.YYYY
      });
    });
  });

  describe('Sortowanie notatek', () => {
    it('sortuje notatki według daty aktualizacji (najnowsze pierwsze)', () => {
      store.notes = [...mockNotes];
      wrapper = mount(NoteList);
      
      const noteTitles = wrapper.findAll('[data-testid="note-title"]');
      
      // Oczekiwana kolejność na podstawie updatedAt:
      // 1. "Pierwsza notatka" (2024-01-03T10:00:00.000Z)
      // 2. "Druga notatka" (2024-01-02T15:00:00.000Z)  
      // 3. "Trzecia notatka" (2024-01-01T15:00:00.000Z)
      expect(noteTitles[0].text()).toBe('Pierwsza notatka');
      expect(noteTitles[1].text()).toBe('Druga notatka');
      expect(noteTitles[2].text()).toBe('Trzecia notatka');
    });

    it('aktualizuje kolejność gdy zmieni się updatedAt', async () => {
      store.notes = [...mockNotes];
      wrapper = mount(NoteList);
      
      // Zmień updatedAt trzeciej notatki na najnowszą datę
      const updatedNote = { ...mockNotes[2], updatedAt: '2024-01-04T10:00:00.000Z' };
      store.notes = [mockNotes[0], mockNotes[1], updatedNote];
      
      await wrapper.vm.$nextTick();
      
      const noteTitles = wrapper.findAll('[data-testid="note-title"]');
      expect(noteTitles[0].text()).toBe('Trzecia notatka'); // Teraz pierwsza
    });
  });

  describe('Dynamiczne rozmiary kart', () => {
    beforeEach(() => {
      store.notes = [...mockNotes];
      wrapper = mount(NoteList);
    });

    it('stosuje różne klasy CSS w zależności od długości treści', () => {
      const noteItems = wrapper.findAll('[data-testid="note-item"]');
      
      // Krótka notatka (id: 3)
      const shortNote = noteItems.find(item => 
        item.find('[data-testid="note-title"]').text() === 'Trzecia notatka'
      );
      expect(shortNote.classes()).toContain('note-size-small');
      
      // Długa notatka (id: 2)
      const longNote = noteItems.find(item => 
        item.find('[data-testid="note-title"]').text() === 'Druga notatka'
      );
      expect(longNote.classes()).toContain('note-size-large');
    });

    it('klasyfikuje rozmiar notatki na podstawie długości treści', () => {
      const noteItems = wrapper.findAll('[data-testid="note-item"]');
      
      noteItems.forEach(item => {
        const classes = item.classes();
        const hasValidSizeClass = classes.some(cls => 
          ['note-size-small', 'note-size-medium', 'note-size-large'].includes(cls)
        );
        expect(hasValidSizeClass).toBe(true);
      });
    });
  });

  describe('Loading state', () => {
    it('wyświetla komunikat ładowania gdy store jest w stanie loading', () => {
      store.isLoading = true;
      store.notes = [];
      
      wrapper = mount(NoteList);
      
      const loadingState = wrapper.find('[data-testid="loading-state"]');
      expect(loadingState.exists()).toBe(true);
      expect(loadingState.text()).toContain('Ładowanie');
    });

    it('nie wyświetla komunikatu ładowania gdy loading jest false', () => {
      store.isLoading = false;
      store.notes = [];
      
      wrapper = mount(NoteList);
      
      expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(false);
    });
  });

  describe('Error state', () => {
    it('wyświetla komunikat błędu gdy store ma błąd', () => {
      store.error = 'Błąd podczas ładowania notatek';
      store.notes = [];
      
      wrapper = mount(NoteList);
      
      const errorState = wrapper.find('[data-testid="error-state"]');
      expect(errorState.exists()).toBe(true);
      expect(errorState.text()).toContain('Błąd podczas ładowania notatek');
    });

    it('nie wyświetla komunikatu błędu gdy nie ma błędu', () => {
      store.error = null;
      store.notes = [];
      
      wrapper = mount(NoteList);
      
      expect(wrapper.find('[data-testid="error-state"]').exists()).toBe(false);
    });
  });

  describe('Responsywność', () => {
    beforeEach(() => {
      store.notes = [...mockNotes];
      wrapper = mount(NoteList);
    });

    it('stosuje klasy responsywne do siatki notatek', () => {
      const noteGrid = wrapper.find('[data-testid="note-grid"]');
      expect(noteGrid.exists()).toBe(true);
      
      // Sprawdź czy ma klasy responsywne Tailwind
      const classes = noteGrid.classes().join(' ');
      expect(classes).toMatch(/grid.*gap.*md:/);
    });

    it('ma odpowiednie klasy dla mobile-first design', () => {
      const noteGrid = wrapper.find('[data-testid="note-grid"]');
      const classes = noteGrid.classes();
      
      // Sprawdź czy zaczyna od mobile (grid-cols-1) i ma breakpointy
      expect(classes.some(cls => cls.includes('grid-cols-1'))).toBe(true);
    });
  });

  describe('Integracja ze store', () => {
    it('reaguje na zmiany w store.notesSortedByDate', async () => {
      store.notes = [mockNotes[0]];
      wrapper = mount(NoteList);
      
      expect(wrapper.findAll('[data-testid="note-item"]')).toHaveLength(1);
      
      // Dodaj nową notatkę
      store.notes = [...mockNotes];
      await wrapper.vm.$nextTick();
      
      expect(wrapper.findAll('[data-testid="note-item"]')).toHaveLength(3);
    });

    it('używa computed property notesSortedByDate ze store', () => {
      store.notes = [...mockNotes];
      wrapper = mount(NoteList);
      
      // Sprawdź czy komponent korzysta z posortowanej listy
      const noteTitles = wrapper.findAll('[data-testid="note-title"]');
      expect(noteTitles[0].text()).toBe('Pierwsza notatka'); // Najnowsza updatedAt
    });
  });

  describe('Formatowanie daty', () => {
    it('formatuje daty w polskim formacie', () => {
      store.notes = [mockNotes[0]];
      wrapper = mount(NoteList);
      
      const timestamp = wrapper.find('[data-testid="note-timestamp"]');
      const timestampText = timestamp.text();
      
      // Sprawdź format DD.MM.YYYY HH:MM
      expect(timestampText).toMatch(/\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}/);
    });

    it('wyświetla różne daty dla różnych notatek', () => {
      store.notes = [...mockNotes];
      wrapper = mount(NoteList);
      
      const timestamps = wrapper.findAll('[data-testid="note-timestamp"]');
      const timestampTexts = timestamps.map(t => t.text());
      
      // Wszystkie timestamps powinny być różne
      const uniqueTimestamps = new Set(timestampTexts);
      expect(uniqueTimestamps.size).toBe(3);
    });
  });
});
