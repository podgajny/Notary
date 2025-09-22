import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import HomeView from '../../src/views/HomeView.vue';
import { resetMockIndexedDB } from '../utils/indexeddb-mock';

// Mock idb-keyval with a local in-memory store to avoid hoisting issues
vi.mock('idb-keyval', () => {
  const store = new Map<string, any>();
  return {
    get: async (key: string) => store.get(key),
    set: async (key: string, value: any) => {
      store.set(key, value);
    },
    del: async (key: string) => {
      store.delete(key);
    },
  };
});

describe('Integration: NoteEditor + NoteList', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    resetMockIndexedDB();
  });

  it('creates a note via NoteEditor and renders it in NoteList', async () => {
    const wrapper = mount(HomeView);

    // Poczekaj na inicjalizację store (initialize w onMounted)
    await wrapper.vm.$nextTick();

    const titleInput = wrapper.find('[data-testid="note-title-input"]');
    const bodyTextarea = wrapper.find('[data-testid="note-body-textarea"]');
    const saveButton = wrapper.find('[data-testid="save-button"]');

    await titleInput.setValue('Integracyjny tytuł');
    await bodyTextarea.setValue('Integracyjna treść');
    await saveButton.trigger('click');

    // Poczekaj na zapis i re-render
    await wrapper.vm.$nextTick();
    await new Promise(r => setTimeout(r));

    const noteItems = wrapper.findAll('[data-testid="note-item"]');
    expect(noteItems.length).toBeGreaterThan(0);

    const firstTitle = wrapper.find('[data-testid="note-title"]');
    expect(firstTitle.text()).toContain('Integracyjny tytuł');
  });
});


