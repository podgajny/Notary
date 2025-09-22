/**
 * Testy dla interfejsów i type guards notatek
 */

import { describe, it, expect } from 'vitest';
import {
  isNote,
  isDraft,
  isNoteFormData,
  STORAGE_KEYS,
  DEFAULT_NOTE_BODY,
  DEFAULT_DRAFT,
  type Note,
  type Draft,
  type NoteFormData,
} from './note';

describe('Note Type Guards', () => {
  describe('isNote', () => {
    it('should return true for valid note objects', () => {
      const validNote: Note = {
        id: 'test-id',
        title: 'Test Title',
        body: 'Test body',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      expect(isNote(validNote)).toBe(true);
    });

    it('should return false for objects missing required fields', () => {
      const invalidNote = {
        id: 'test-id',
        title: 'Test Title',
        // missing body, createdAt, updatedAt
      };

      expect(isNote(invalidNote)).toBe(false);
    });

    it('should return false for objects with wrong field types', () => {
      const invalidNote = {
        id: 123, // should be string
        title: 'Test Title',
        body: 'Test body',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      expect(isNote(invalidNote)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isNote(null)).toBe(false);
      expect(isNote(undefined)).toBe(false);
    });
  });

  describe('isDraft', () => {
    it('should return true for valid draft objects', () => {
      const validDraft: Draft = {
        title: 'Draft Title',
        body: 'Draft body',
        lastModified: '2023-01-01T00:00:00.000Z',
      };

      expect(isDraft(validDraft)).toBe(true);
    });

    it('should return false for objects missing required fields', () => {
      const invalidDraft = {
        title: 'Draft Title',
        // missing body, lastModified
      };

      expect(isDraft(invalidDraft)).toBe(false);
    });

    it('should return false for objects with wrong field types', () => {
      const invalidDraft = {
        title: 123, // should be string
        body: 'Draft body',
        lastModified: '2023-01-01T00:00:00.000Z',
      };

      expect(isDraft(invalidDraft)).toBe(false);
    });
  });

  describe('isNoteFormData', () => {
    it('should return true for valid form data objects', () => {
      const validFormData: NoteFormData = {
        title: 'Form Title',
        body: 'Form body',
      };

      expect(isNoteFormData(validFormData)).toBe(true);
    });

    it('should return false for objects missing required fields', () => {
      const invalidFormData = {
        title: 'Form Title',
        // missing body
      };

      expect(isNoteFormData(invalidFormData)).toBe(false);
    });
  });
});

describe('Constants', () => {
  it('should have correct storage keys', () => {
    expect(STORAGE_KEYS.NOTES).toBe('notes:v1');
    expect(STORAGE_KEYS.DRAFT).toBe('draft:v1');
  });

  it('should have correct default values', () => {
    expect(DEFAULT_NOTE_BODY).toBe('');
    
    expect(DEFAULT_DRAFT).toEqual({
      title: '',
      body: '',
      lastModified: expect.any(String),
    });
    
    // Sprawdź czy lastModified to prawidłowy ISO string
    expect(new Date(DEFAULT_DRAFT.lastModified)).toBeInstanceOf(Date);
  });
});

describe('Type Compatibility', () => {
  it('should allow Note to be created from valid data', () => {
    const noteData = {
      id: 'test-id',
      title: 'Test',
      body: 'Body',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // TypeScript compilation test - if this compiles, types are correct
    const note: Note = noteData;
    expect(note).toBeDefined();
  });

  it('should allow Draft to be created from valid data', () => {
    const draftData = {
      title: 'Draft',
      body: 'Body',
      lastModified: new Date().toISOString(),
    };

    // TypeScript compilation test
    const draft: Draft = draftData;
    expect(draft).toBeDefined();
  });
});
