import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotesStore, NoteStoreError, type CreateNoteInput } from '../notes.store'
import { DbError } from '../../lib/db'

// Mock the database functions
vi.mock('../../lib/db', () => ({
  getNotes: vi.fn(),
  setNotes: vi.fn(),
  DbError: class MockDbError extends Error {
    code: string
    constructor(code: string, message: string) {
      super(message)
      this.code = code
    }
  },
}))

import { getNotes, setNotes, DbError } from '../../lib/db'

describe('notes.store.ts - Pinia store for notes', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('NoteStoreError', () => {
    it('powinien utworzyć błąd z odpowiednim kodem i wiadomością', () => {
      // Act
      const error = new NoteStoreError('TITLE_REQUIRED', 'Title is required')
      
      // Assert
      expect(error.name).toBe('NoteStoreError')
      expect(error.code).toBe('TITLE_REQUIRED')
      expect(error.message).toBe('Title is required')
      expect(error).toBeInstanceOf(Error)
    })

    it('powinien obsługiwać wszystkie typy kodów błędów', () => {
      // Test all error codes
      const errorCodes = ['TITLE_REQUIRED', 'STORAGE_READ_FAILED', 'STORAGE_WRITE_FAILED'] as const
      
      errorCodes.forEach(code => {
        const error = new NoteStoreError(code, `Error for ${code}`)
        expect(error.code).toBe(code)
        expect(error.message).toBe(`Error for ${code}`)
      })
    })
  })

  describe('fetchNotes', () => {
    it('powinien załadować notatki z bazy danych', async () => {
      // Arrange
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          body: 'Body 1',
          tags: [],
          pinned: false,
          createdAt: 1000,
          updatedAt: 2000,
        },
        {
          id: '2',
          title: 'Note 2',
          body: 'Body 2',
          tags: [],
          pinned: false,
          createdAt: 500,
          updatedAt: 3000,
        },
      ]
      vi.mocked(getNotes).mockResolvedValue(mockNotes)
      
      const store = useNotesStore()
      
      // Act
      await store.fetchNotes()
      
      // Assert
      expect(getNotes).toHaveBeenCalledOnce()
      expect(store.notes).toHaveLength(2)
      // Notes should be sorted by updatedAt descending (newest first)
      expect(store.notes[0].id).toBe('2') // updatedAt: 3000
      expect(store.notes[1].id).toBe('1') // updatedAt: 2000
      expect(store.isLoading).toBe(false)
    })

    it('powinien ustawić isLoading na true podczas ładowania', async () => {
      // Arrange
      let resolvePromise: (value: any) => void
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })
      vi.mocked(getNotes).mockReturnValue(promise)
      
      const store = useNotesStore()
      
      // Act
      const fetchPromise = store.fetchNotes()
      
      // Assert - isLoading should be true during fetch
      expect(store.isLoading).toBe(true)
      
      // Complete the fetch
      resolvePromise!([])
      await fetchPromise
      
      expect(store.isLoading).toBe(false)
    })

    it('powinien rzucić NoteStoreError gdy odczyt z bazy się nie powiedzie', async () => {
      // Arrange
      const dbError = new DbError('DB_READ_FAILED', 'Database read failed')
      vi.mocked(getNotes).mockRejectedValue(dbError)
      
      const store = useNotesStore()
      
      // Act & Assert
      await expect(store.fetchNotes()).rejects.toThrow(NoteStoreError)
      await expect(store.fetchNotes()).rejects.toThrow('Could not load notes')
      expect(store.isLoading).toBe(false)
    })

    it('powinien rzucić NoteStoreError gdy baza danych nie jest dostępna', async () => {
      // Arrange
      const dbError = new DbError('DB_UNAVAILABLE', 'IndexedDB not available')
      vi.mocked(getNotes).mockRejectedValue(dbError)
      
      const store = useNotesStore()
      
      // Act & Assert
      await expect(store.fetchNotes()).rejects.toThrow(NoteStoreError)
      await expect(store.fetchNotes()).rejects.toThrow('IndexedDB is not available in this browser')
    })
  })

  describe('createNote', () => {
    it('powinien utworzyć nową notatkę z prawidłowymi danymi', async () => {
      // Arrange
      const input: CreateNoteInput = {
        title: 'Test Note',
        body: 'Test body content',
      }
      vi.mocked(setNotes).mockResolvedValue(undefined)
      
      const store = useNotesStore()
      
      // Act
      const result = await store.createNote(input)
      
      // Assert
      expect(result.title).toBe('Test Note')
      expect(result.body).toBe('Test body content')
      expect(result.id).toBeDefined()
      expect(result.tags).toEqual([])
      expect(result.pinned).toBe(false)
      expect(typeof result.createdAt).toBe('number')
      expect(typeof result.updatedAt).toBe('number')
      expect(result.createdAt).toBe(result.updatedAt)
      
      // Check that note was added to store
      expect(store.notes).toHaveLength(1)
      expect(store.notes[0]).toStrictEqual(result)
      
      // Check that setNotes was called
      expect(setNotes).toHaveBeenCalledWith([result])
    })

    it('powinien przyciąć tytuł i utworzyć notatkę', async () => {
      // Arrange
      const input: CreateNoteInput = {
        title: '  Test Note  ',
        body: 'Test body',
      }
      vi.mocked(setNotes).mockResolvedValue(undefined)
      
      const store = useNotesStore()
      
      // Act
      const result = await store.createNote(input)
      
      // Assert
      expect(result.title).toBe('Test Note') // Should be trimmed
      expect(setNotes).toHaveBeenCalledWith([result])
    })

    it('powinien rzucić błąd gdy tytuł jest pusty', async () => {
      // Arrange
      const input: CreateNoteInput = {
        title: '',
        body: 'Test body',
      }
      
      const store = useNotesStore()
      
      // Act & Assert
      await expect(store.createNote(input)).rejects.toThrow(NoteStoreError)
      await expect(store.createNote(input)).rejects.toThrow('Title is required')
      expect(store.notes).toHaveLength(0)
    })

    it('powinien rzucić błąd gdy tytuł zawiera tylko spacje', async () => {
      // Arrange
      const input: CreateNoteInput = {
        title: '   ',
        body: 'Test body',
      }
      
      const store = useNotesStore()
      
      // Act & Assert
      await expect(store.createNote(input)).rejects.toThrow(NoteStoreError)
      await expect(store.createNote(input)).rejects.toThrow('Title is required')
    })

    it('powinien cofnąć zmiany w store gdy zapis do bazy się nie powiedzie', async () => {
      // Arrange
      const input: CreateNoteInput = {
        title: 'Test Note',
        body: 'Test body',
      }
      const dbError = new DbError('DB_WRITE_FAILED', 'Write failed')
      vi.mocked(setNotes).mockRejectedValue(dbError)
      
      const store = useNotesStore()
      
      // Act & Assert
      await expect(store.createNote(input)).rejects.toThrow(NoteStoreError)
      await expect(store.createNote(input)).rejects.toThrow('Could not save. Try again.')
      
      // Store should be reverted to previous state
      expect(store.notes).toHaveLength(0)
    })

    it('powinien dodać nową notatkę na początku listy', async () => {
      // Arrange
      const existingNote = {
        id: 'existing',
        title: 'Existing Note',
        body: 'Existing body',
        tags: [],
        pinned: false,
        createdAt: 1000,
        updatedAt: 1000,
      }
      
      const input: CreateNoteInput = {
        title: 'New Note',
        body: 'New body',
      }
      
      vi.mocked(setNotes).mockResolvedValue(undefined)
      
      const store = useNotesStore()
      store.notes = [existingNote] // Set initial state
      
      // Act
      const result = await store.createNote(input)
      
      // Assert
      expect(store.notes).toHaveLength(2)
      expect(store.notes[0]).toStrictEqual(result) // New note should be first
      expect(store.notes[1]).toStrictEqual(existingNote) // Existing note should be second
    })
  })

  describe('generateNoteId', () => {
    it('powinien generować unikalne ID dla notatek', async () => {
      // Arrange
      const input: CreateNoteInput = {
        title: 'Test Note',
        body: 'Test body',
      }
      vi.mocked(setNotes).mockResolvedValue(undefined)
      
      const store = useNotesStore()
      
      // Act
      const result1 = await store.createNote(input)
      const result2 = await store.createNote({ ...input, title: 'Another Note' })
      
      // Assert
      expect(result1.id).toBeDefined()
      expect(result2.id).toBeDefined()
      expect(result1.id).not.toBe(result2.id)
    })
  })
})
