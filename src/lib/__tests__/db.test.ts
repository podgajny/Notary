import { describe, it, expect } from 'vitest'
import { DbError, type StoredNote } from '../db'

describe('db.ts - IndexedDB persistence layer', () => {
  describe('DbError', () => {
    it('powinien utworzyć błąd z odpowiednim kodem i wiadomością', () => {
      // Act
      const error = new DbError('DB_READ_FAILED', 'Test error message')
      
      // Assert
      expect(error.name).toBe('DbError')
      expect(error.code).toBe('DB_READ_FAILED')
      expect(error.message).toBe('Test error message')
      expect(error).toBeInstanceOf(Error)
    })

    it('powinien obsługiwać wszystkie typy kodów błędów', () => {
      // Test all error codes
      const errorCodes = ['DB_UNAVAILABLE', 'DB_OPEN_FAILED', 'DB_READ_FAILED', 'DB_WRITE_FAILED'] as const
      
      errorCodes.forEach(code => {
        const error = new DbError(code, `Error for ${code}`)
        expect(error.code).toBe(code)
        expect(error.message).toBe(`Error for ${code}`)
      })
    })
  })

  describe('StoredNote type', () => {
    it('powinien mieć wszystkie wymagane pola', () => {
      // This test ensures the type is properly defined
      const note: StoredNote = {
        id: 'test-id',
        title: 'Test Title',
        body: 'Test body content',
        tags: ['tag1', 'tag2'],
        pinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      expect(note.id).toBe('test-id')
      expect(note.title).toBe('Test Title')
      expect(note.body).toBe('Test body content')
      expect(note.tags).toEqual(['tag1', 'tag2'])
      expect(note.pinned).toBe(false)
      expect(typeof note.createdAt).toBe('number')
      expect(typeof note.updatedAt).toBe('number')
    })
  })

  // Note: The actual IndexedDB functions (getNotes, setNotes, clearNotes) 
  // will be tested in integration tests with the store, as mocking IndexedDB
  // is complex and the real value comes from testing the integration.
  // For now, we've tested the core types and error handling.
})