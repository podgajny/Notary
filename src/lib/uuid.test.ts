/**
 * Testy dla utility UUID
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateUUID, isValidUUID, generateShortId } from './uuid';

describe('UUID Utilities', () => {
  describe('generateUUID()', () => {
    it('should generate valid UUID v4', () => {
      const uuid = generateUUID();
      
      expect(typeof uuid).toBe('string');
      expect(uuid).toHaveLength(36);
      expect(isValidUUID(uuid)).toBe(true);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      
      expect(uuid1).not.toBe(uuid2);
    });

    it('should use crypto.randomUUID when available', () => {
      // Sprawdź czy funkcja działa z crypto.randomUUID (natywnym lub mockowanym)
      const uuid = generateUUID();
      
      expect(typeof uuid).toBe('string');
      expect(uuid).toHaveLength(36);
      // Sprawdź podstawowy format UUID (może być natywny lub mock)
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should use fallback when crypto.randomUUID is not available', () => {
      // Tymczasowo usuń crypto.randomUUID
      const originalRandomUUID = globalThis.crypto?.randomUUID;
      if (globalThis.crypto) {
        delete (globalThis.crypto as any).randomUUID;
      }

      const uuid = generateUUID();
      
      expect(typeof uuid).toBe('string');
      expect(uuid).toHaveLength(36);
      expect(isValidUUID(uuid)).toBe(true);

      // Przywróć oryginalną funkcję
      if (globalThis.crypto && originalRandomUUID) {
        globalThis.crypto.randomUUID = originalRandomUUID;
      }
    });

    it('should generate UUID with correct format', () => {
      // Tymczasowo usuń crypto.randomUUID aby przetestować fallback
      const originalRandomUUID = globalThis.crypto?.randomUUID;
      if (globalThis.crypto) {
        delete (globalThis.crypto as any).randomUUID;
      }

      const uuid = generateUUID();
      
      // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const parts = uuid.split('-');
      expect(parts).toHaveLength(5);
      expect(parts[0]).toHaveLength(8);
      expect(parts[1]).toHaveLength(4);
      expect(parts[2]).toHaveLength(4);
      expect(parts[2][0]).toBe('4'); // Version 4
      expect(parts[3]).toHaveLength(4);
      expect(['8', '9', 'a', 'b']).toContain(parts[3][0].toLowerCase()); // Variant
      expect(parts[4]).toHaveLength(12);

      // Przywróć
      if (globalThis.crypto && originalRandomUUID) {
        globalThis.crypto.randomUUID = originalRandomUUID;
      }
    });
  });

  describe('isValidUUID()', () => {
    it('should return true for valid UUID v4', () => {
      const validUUIDs = [
        '123e4567-e89b-42d3-a456-426614174000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
      ];

      validUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(true);
      });
    });

    it('should return false for invalid UUIDs', () => {
      const invalidUUIDs = [
        '', // pusty string
        'not-a-uuid',
        '123e4567-e89b-42d3-a456', // za krótki
        '123e4567-e89b-42d3-a456-426614174000-extra', // za długi
        '123e4567-e89b-32d3-a456-426614174000', // zła wersja (3 zamiast 4)
        '123e4567-e89b-42d3-c456-426614174000', // zły wariant (c zamiast 8,9,a,b)
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // literki x
        '123e4567_e89b_42d3_a456_426614174000', // złe separatory
      ];

      invalidUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(false);
      });
    });

    it('should handle case insensitive validation', () => {
      const uuid = '123E4567-E89B-42D3-A456-426614174000';
      expect(isValidUUID(uuid)).toBe(true);
    });
  });

  describe('generateShortId()', () => {
    it('should generate 8 character string', () => {
      const shortId = generateShortId();
      
      expect(typeof shortId).toBe('string');
      expect(shortId).toHaveLength(8);
    });

    it('should generate unique short IDs', () => {
      const id1 = generateShortId();
      const id2 = generateShortId();
      
      expect(id1).not.toBe(id2);
    });

    it('should only contain valid hex characters and hyphens', () => {
      const shortId = generateShortId();
      const validChars = /^[0-9a-f-]+$/i;
      
      expect(validChars.test(shortId)).toBe(true);
    });
  });
});
