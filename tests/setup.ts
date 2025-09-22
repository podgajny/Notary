/**
 * Konfiguracja testów - automatyczne mocki i setup
 */

import { beforeEach, vi } from 'vitest';
import { mockIdbKeyval, resetMockIndexedDB } from './utils/indexeddb-mock';

// Mock idb-keyval w całej aplikacji testowej
vi.mock('idb-keyval', () => mockIdbKeyval);

// Reset IndexedDB mock przed każdym testem
beforeEach(() => {
  resetMockIndexedDB();
  vi.clearAllMocks();
});

// Mock crypto.randomUUID dla starszych środowisk
if (!globalThis.crypto) {
  globalThis.crypto = {
    randomUUID: () => `mock-uuid-${Math.random().toString(36).substr(2, 9)}`,
  } as Crypto;
} else if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = () => `mock-uuid-${Math.random().toString(36).substr(2, 9)}`;
}
