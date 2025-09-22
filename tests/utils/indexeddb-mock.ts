/**
 * Mock implementacja IndexedDB dla testów jednostkowych
 * Używa Map do symulacji przechowywania danych w pamięci
 */

interface MockStore {
  [key: string]: any;
}

class IndexedDBMock {
  private store: MockStore = {};

  // Symulacja idb-keyval API
  async get(key: string): Promise<any> {
    return this.store[key];
  }

  async set(key: string, value: any): Promise<void> {
    this.store[key] = value;
  }

  async del(key: string): Promise<void> {
    delete this.store[key];
  }

  async clear(): Promise<void> {
    this.store = {};
  }

  async keys(): Promise<string[]> {
    return Object.keys(this.store);
  }

  // Metody pomocnicze dla testów
  getStore(): MockStore {
    return { ...this.store };
  }

  setStore(newStore: MockStore): void {
    this.store = { ...newStore };
  }
}

// Globalna instancja mocka dla testów
export const mockIndexedDB = new IndexedDBMock();

// Funkcja do resetowania stanu między testami
export const resetMockIndexedDB = () => {
  mockIndexedDB.setStore({});
};

// Mock dla idb-keyval
export const mockIdbKeyval = {
  get: mockIndexedDB.get.bind(mockIndexedDB),
  set: mockIndexedDB.set.bind(mockIndexedDB),
  del: mockIndexedDB.del.bind(mockIndexedDB),
  clear: mockIndexedDB.clear.bind(mockIndexedDB),
  keys: mockIndexedDB.keys.bind(mockIndexedDB),
};

// Import typów z aplikacji
import type { Note, Draft } from '../../src/types';

// Typ guards i helpers dla testów
export const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: 'test-note-id',
  title: 'Test Note',
  body: 'Test note body content',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockDraft = (overrides: Partial<Draft> = {}): Draft => ({
  title: 'Draft title',
  body: 'Draft body content',
  lastModified: new Date().toISOString(),
  ...overrides,
});
