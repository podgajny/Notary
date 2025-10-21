import { defineStore } from 'pinia'
import { DbError, getNotes, setNotes, type StoredNote } from '../lib/db'

export type Note = StoredNote

export type CreateNoteInput = {
  title: string
  body: string
}

export class NoteStoreError extends Error {
  code: 'TITLE_REQUIRED' | 'STORAGE_READ_FAILED' | 'STORAGE_WRITE_FAILED'

  constructor(code: NoteStoreError['code'], message: string) {
    super(message)
    this.name = 'NoteStoreError'
    this.code = code
  }
}

const generateNoteId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

const sortNotesByUpdatedAtDesc = (notes: StoredNote[]): Note[] => {
  return [...notes].sort((a, b) => b.updatedAt - a.updatedAt)
}

const mapDbErrorToStoreError = (error: DbError, defaultCode: NoteStoreError['code']) => {
  if (error.code === 'DB_READ_FAILED' || error.code === 'DB_OPEN_FAILED') {
    return new NoteStoreError('STORAGE_READ_FAILED', 'Could not load notes')
  }

  if (error.code === 'DB_WRITE_FAILED') {
    return new NoteStoreError('STORAGE_WRITE_FAILED', 'Could not save. Try again.')
  }

  if (error.code === 'DB_UNAVAILABLE') {
    return new NoteStoreError(defaultCode, 'IndexedDB is not available in this browser')
  }

  return new NoteStoreError(defaultCode, error.message)
}

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
    isLoading: false,
  }),
  actions: {
    async fetchNotes() {
      this.isLoading = true

      try {
        const savedNotes = await getNotes()
        this.notes = sortNotesByUpdatedAtDesc(savedNotes)
      } catch (error) {
        if (error instanceof DbError) {
          throw mapDbErrorToStoreError(error, 'STORAGE_READ_FAILED')
        }

        throw error
      } finally {
        this.isLoading = false
      }
    },
    async createNote(input: CreateNoteInput) {
      const trimmedTitle = input.title.trim()

      if (!trimmedTitle) {
        throw new NoteStoreError('TITLE_REQUIRED', 'Title is required')
      }

      const now = Date.now()
      const newNote: Note = {
        id: generateNoteId(),
        title: trimmedTitle,
        body: input.body,
        tags: [],
        pinned: false,
        createdAt: now,
        updatedAt: now,
      }

      const previousNotes = this.notes
      const nextNotes = [newNote, ...previousNotes]

      this.notes = nextNotes

      try {
        await setNotes(nextNotes)
      } catch (error) {
        this.notes = previousNotes

        if (error instanceof DbError) {
          throw mapDbErrorToStoreError(error, 'STORAGE_WRITE_FAILED')
        }

        throw error
      }

      return newNote
    },
  },
})
