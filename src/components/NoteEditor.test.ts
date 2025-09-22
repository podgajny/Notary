/**
 * Testy dla komponentu NoteEditor
 * Używa TDD - testy napisane przed implementacją komponentu
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { createMockNote, createMockDraft } from '../../tests/utils/indexeddb-mock';

// Import komponentu do testowania (będzie zaimplementowany w następnym kroku)
import NoteEditor from './NoteEditor.vue';

// Mock dla store
vi.mock('../stores/notes.store', () => ({
  useNotesStore: vi.fn(() => ({
    draft: null,
    isLoading: false,
    error: null,
    hasUnsavedChanges: false,
    saveDraft: vi.fn(),
    clearDraft: vi.fn(),
    createNote: vi.fn(),
    createNoteFromDraft: vi.fn(),
  })),
}));

describe('NoteEditor Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render with empty form initially', () => {
      const wrapper = mount(NoteEditor);

      // Sprawdź czy formularz jest pusty
      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const bodyTextarea = wrapper.find('[data-testid="note-body-textarea"]');

      expect(titleInput.element.value).toBe('');
      expect(bodyTextarea.element.value).toBe('');
    });

    it('should render with proper placeholders', () => {
      const wrapper = mount(NoteEditor);

      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const bodyTextarea = wrapper.find('[data-testid="note-body-textarea"]');

      expect(titleInput.attributes('placeholder')).toBe('Tytuł notatki...');
      expect(bodyTextarea.attributes('placeholder')).toBe('Treść notatki...');
    });

    it('should have save button initially disabled', () => {
      const wrapper = mount(NoteEditor);

      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.attributes('disabled')).toBeDefined();
    });

    it('should not show error message initially', () => {
      const wrapper = mount(NoteEditor);

      const errorMessage = wrapper.find('[data-testid="error-message"]');
      expect(errorMessage.exists()).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should enable save button when title is provided', async () => {
      const wrapper = mount(NoteEditor);

      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const saveButton = wrapper.find('[data-testid="save-button"]');

      // Wprowadź tytuł
      await titleInput.setValue('Test Title');

      expect(saveButton.attributes('disabled')).toBeUndefined();
    });

    it('should disable save button when title is empty', async () => {
      const wrapper = mount(NoteEditor);

      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const saveButton = wrapper.find('[data-testid="save-button"]');

      // Wprowadź i usuń tytuł
      await titleInput.setValue('Test Title');
      await titleInput.setValue('');

      expect(saveButton.attributes('disabled')).toBeDefined();
    });

    it('should disable save button when title contains only whitespace', async () => {
      const wrapper = mount(NoteEditor);

      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const saveButton = wrapper.find('[data-testid="save-button"]');

      await titleInput.setValue('   ');

      expect(saveButton.attributes('disabled')).toBeDefined();
    });

    it('should show helper text when title is empty and user tried to save', async () => {
      const wrapper = mount(NoteEditor);

      const saveButton = wrapper.find('[data-testid="save-button"]');
      await saveButton.trigger('click');

      const helperText = wrapper.find('[data-testid="title-helper-text"]');
      expect(helperText.exists()).toBe(true);
      expect(helperText.text()).toBe('Tytuł jest wymagany');
    });

    it('should allow body to be empty', async () => {
      const wrapper = mount(NoteEditor);

      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const saveButton = wrapper.find('[data-testid="save-button"]');

      await titleInput.setValue('Test Title');
      // Body pozostaje puste

      expect(saveButton.attributes('disabled')).toBeUndefined();
    });
  });

  describe('Draft Management', () => {
    it('should load draft data when component mounts', async () => {
      const mockStore = {
        draft: createMockDraft({ title: 'Draft Title', body: 'Draft Body' }),
        isLoading: false,
        error: null,
        hasUnsavedChanges: true,
        saveDraft: vi.fn(),
        clearDraft: vi.fn(),
        createNote: vi.fn(),
        createNoteFromDraft: vi.fn(),
      };

      const { useNotesStore } = await import('../stores/notes.store');
      vi.mocked(useNotesStore).mockReturnValue(mockStore);

      const wrapper = mount(NoteEditor);

      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const bodyTextarea = wrapper.find('[data-testid="note-body-textarea"]');

      expect(titleInput.element.value).toBe('Draft Title');
      expect(bodyTextarea.element.value).toBe('Draft Body');
    });

    it('should save draft automatically when typing (debounced)', async () => {
      const mockSaveDraft = vi.fn();
      const mockStore = {
        draft: null,
        isLoading: false,
        error: null,
        hasUnsavedChanges: false,
        saveDraft: mockSaveDraft,
        clearDraft: vi.fn(),
        createNote: vi.fn(),
        createNoteFromDraft: vi.fn(),
      };

      const { useNotesStore } = await import('../stores/notes.store');
      vi.mocked(useNotesStore).mockReturnValue(mockStore);

      const wrapper = mount(NoteEditor);
      const titleInput = wrapper.find('[data-testid="note-title-input"]');

      await titleInput.setValue('Test Title');

      // Poczekaj na debounce (może wymagać mockowania timers)
      await new Promise(resolve => setTimeout(resolve, 2100));

      expect(mockSaveDraft).toHaveBeenCalledWith({
        title: 'Test Title',
        body: '',
      });
    });

    it('should show unsaved changes indicator when draft exists', async () => {
      const mockStore = {
        draft: createMockDraft({ title: 'Draft Title', body: 'Draft Body' }),
        isLoading: false,
        error: null,
        hasUnsavedChanges: true,
        saveDraft: vi.fn(),
        clearDraft: vi.fn(),
        createNote: vi.fn(),
        createNoteFromDraft: vi.fn(),
      };

      const { useNotesStore } = await import('../stores/notes.store');
      vi.mocked(useNotesStore).mockReturnValue(mockStore);

      const wrapper = mount(NoteEditor);

      const unsavedIndicator = wrapper.find('[data-testid="unsaved-indicator"]');
      expect(unsavedIndicator.exists()).toBe(true);
      expect(unsavedIndicator.text()).toContain('Niezapisane zmiany');
    });
  });

  describe('Save Functionality', () => {
    it('should create new note when save button is clicked', async () => {
      const mockCreateNote = vi.fn().mockResolvedValue(createMockNote());
      const mockStore = {
        draft: null,
        isLoading: false,
        error: null,
        hasUnsavedChanges: false,
        saveDraft: vi.fn(),
        clearDraft: vi.fn(),
        createNote: mockCreateNote,
        createNoteFromDraft: vi.fn(),
      };

      const { useNotesStore } = await import('../stores/notes.store');
      vi.mocked(useNotesStore).mockReturnValue(mockStore);

      const wrapper = mount(NoteEditor);

      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const bodyTextarea = wrapper.find('[data-testid="note-body-textarea"]');
      const saveButton = wrapper.find('[data-testid="save-button"]');

      await titleInput.setValue('Test Title');
      await bodyTextarea.setValue('Test Body');
      await saveButton.trigger('click');

      expect(mockCreateNote).toHaveBeenCalledWith({
        title: 'Test Title',
        body: 'Test Body',
      });
    });

    it('should use createNoteFromDraft when draft exists', async () => {
      const mockCreateNoteFromDraft = vi.fn().mockResolvedValue(createMockNote());
      const mockStore = {
        draft: createMockDraft({ title: 'Draft Title', body: 'Draft Body' }),
        isLoading: false,
        error: null,
        hasUnsavedChanges: true,
        saveDraft: vi.fn(),
        clearDraft: vi.fn(),
        createNote: vi.fn(),
        createNoteFromDraft: mockCreateNoteFromDraft,
      };

      const { useNotesStore } = await import('../stores/notes.store');
      vi.mocked(useNotesStore).mockReturnValue(mockStore);

      const wrapper = mount(NoteEditor);
      const saveButton = wrapper.find('[data-testid="save-button"]');

      await saveButton.trigger('click');

      expect(mockCreateNoteFromDraft).toHaveBeenCalled();
    });

    it('should show loading state during save operation', async () => {
      const mockCreateNote = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      const mockStore = {
        draft: null,
        isLoading: true,
        error: null,
        hasUnsavedChanges: false,
        saveDraft: vi.fn(),
        clearDraft: vi.fn(),
        createNote: mockCreateNote,
        createNoteFromDraft: vi.fn(),
      };

      const { useNotesStore } = await import('../stores/notes.store');
      vi.mocked(useNotesStore).mockReturnValue(mockStore);

      const wrapper = mount(NoteEditor);

      const saveButton = wrapper.find('[data-testid="save-button"]');
      expect(saveButton.text()).toContain('Zapisywanie...');
      expect(saveButton.attributes('disabled')).toBeDefined();
    });

    it('should show success message after successful save', async () => {
      const mockCreateNote = vi.fn().mockResolvedValue(createMockNote());
      const mockStore = {
        draft: null,
        isLoading: false,
        error: null,
        hasUnsavedChanges: false,
        saveDraft: vi.fn(),
        clearDraft: vi.fn(),
        createNote: mockCreateNote,
        createNoteFromDraft: vi.fn(),
      };

      const { useNotesStore } = await import('../stores/notes.store');
      vi.mocked(useNotesStore).mockReturnValue(mockStore);

      const wrapper = mount(NoteEditor);

      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const saveButton = wrapper.find('[data-testid="save-button"]');

      await titleInput.setValue('Test Title');
      await saveButton.trigger('click');

      // Poczekaj na zakończenie operacji
      await wrapper.vm.$nextTick();

      const successMessage = wrapper.find('[data-testid="success-message"]');
      expect(successMessage.exists()).toBe(true);
      expect(successMessage.text()).toContain('Notatka została zapisana');
    });

    it('should clear form after successful save', async () => {
      const mockCreateNote = vi.fn().mockResolvedValue(createMockNote());
      const mockStore = {
        draft: null,
        isLoading: false,
        error: null,
        hasUnsavedChanges: false,
        saveDraft: vi.fn(),
        clearDraft: vi.fn(),
        createNote: mockCreateNote,
        createNoteFromDraft: vi.fn(),
      };

      const { useNotesStore } = await import('../stores/notes.store');
      vi.mocked(useNotesStore).mockReturnValue(mockStore);

      const wrapper = mount(NoteEditor);

      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const bodyTextarea = wrapper.find('[data-testid="note-body-textarea"]');
      const saveButton = wrapper.find('[data-testid="save-button"]');

      await titleInput.setValue('Test Title');
      await bodyTextarea.setValue('Test Body');
      await saveButton.trigger('click');

      // Poczekaj na zakończenie operacji
      await wrapper.vm.$nextTick();

      expect(titleInput.element.value).toBe('');
      expect(bodyTextarea.element.value).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should show error message when save fails', async () => {
      const mockCreateNote = vi.fn().mockRejectedValue(new Error('Save failed'));
      const mockStore = {
        draft: null,
        isLoading: false,
        error: 'Błąd podczas zapisywania notatki',
        hasUnsavedChanges: false,
        saveDraft: vi.fn(),
        clearDraft: vi.fn(),
        createNote: mockCreateNote,
        createNoteFromDraft: vi.fn(),
      };

      const { useNotesStore } = await import('../stores/notes.store');
      vi.mocked(useNotesStore).mockReturnValue(mockStore);

      const wrapper = mount(NoteEditor);

      const errorMessage = wrapper.find('[data-testid="error-message"]');
      expect(errorMessage.exists()).toBe(true);
      expect(errorMessage.text()).toContain('Błąd podczas zapisywania notatki');
    });

    it('should preserve form data when save fails', async () => {
      const mockCreateNote = vi.fn().mockRejectedValue(new Error('Save failed'));
      const mockStore = {
        draft: null,
        isLoading: false,
        error: 'Błąd podczas zapisywania notatki',
        hasUnsavedChanges: false,
        saveDraft: vi.fn(),
        clearDraft: vi.fn(),
        createNote: mockCreateNote,
        createNoteFromDraft: vi.fn(),
      };

      const { useNotesStore } = await import('../stores/notes.store');
      vi.mocked(useNotesStore).mockReturnValue(mockStore);

      const wrapper = mount(NoteEditor);

      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const bodyTextarea = wrapper.find('[data-testid="note-body-textarea"]');

      await titleInput.setValue('Test Title');
      await bodyTextarea.setValue('Test Body');

      // Form data powinny zostać zachowane po błędzie
      expect(titleInput.element.value).toBe('Test Title');
      expect(bodyTextarea.element.value).toBe('Test Body');
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels and ARIA attributes', () => {
      const wrapper = mount(NoteEditor);

      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const bodyTextarea = wrapper.find('[data-testid="note-body-textarea"]');

      expect(titleInput.attributes('aria-label')).toBe('Tytuł notatki');
      expect(bodyTextarea.attributes('aria-label')).toBe('Treść notatki');
    });

    it('should associate error messages with inputs via aria-describedby', async () => {
      const wrapper = mount(NoteEditor);

      const saveButton = wrapper.find('[data-testid="save-button"]');
      await saveButton.trigger('click');

      const titleInput = wrapper.find('[data-testid="note-title-input"]');
      const helperText = wrapper.find('[data-testid="title-helper-text"]');

      expect(titleInput.attributes('aria-describedby')).toContain(helperText.attributes('id'));
    });

    it('should have proper form structure with fieldset and legend', () => {
      const wrapper = mount(NoteEditor);

      const fieldset = wrapper.find('fieldset');
      const legend = wrapper.find('legend');

      expect(fieldset.exists()).toBe(true);
      expect(legend.exists()).toBe(true);
      expect(legend.text()).toBe('Nowa notatka');
    });
  });
});
