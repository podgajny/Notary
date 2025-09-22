/**
 * Interfejsy TypeScript dla systemu notatek
 */

export interface Note {
  /** Unikalny identyfikator notatki (UUID) */
  id: string;
  
  /** Tytuł notatki (wymagany, nie może być pusty) */
  title: string;
  
  /** Treść notatki (opcjonalna) */
  body: string;
  
  /** Data utworzenia w formacie ISO string */
  createdAt: string;
  
  /** Data ostatniej modyfikacji w formacie ISO string */
  updatedAt: string;
}

export interface Draft {
  /** Tytuł roboczej notatki */
  title: string;
  
  /** Treść roboczej notatki */
  body: string;
  
  /** Timestamp ostatniej modyfikacji roboczej notatki */
  lastModified: string;
}

export interface NoteFormData {
  /** Tytuł notatki z formularza */
  title: string;
  
  /** Treść notatki z formularza */
  body: string;
}

export interface CreateNotePayload {
  /** Tytuł nowej notatki (wymagany) */
  title: string;
  
  /** Treść nowej notatki (opcjonalna) */
  body: string;
}

export interface UpdateNotePayload {
  /** ID notatki do aktualizacji */
  id: string;
  
  /** Nowy tytuł notatki (opcjonalny) */
  title?: string;
  
  /** Nowa treść notatki (opcjonalna) */
  body?: string;
}

// Type guards dla bezpiecznego sprawdzania typów

export const isNote = (obj: any): obj is Note => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.body === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string'
  );
};

export const isDraft = (obj: any): obj is Draft => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.title === 'string' &&
    typeof obj.body === 'string' &&
    typeof obj.lastModified === 'string'
  );
};

export const isNoteFormData = (obj: any): obj is NoteFormData => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.title === 'string' &&
    typeof obj.body === 'string'
  );
};

// Utility types dla różnych scenariuszy

/** Note bez ID - dla tworzenia nowych notatek */
export type NoteWithoutId = Omit<Note, 'id'>;

/** Note tylko z wymaganymi polami */
export type MinimalNote = Pick<Note, 'id' | 'title' | 'createdAt' | 'updatedAt'>;

/** Częściowa notatka dla aktualizacji */
export type PartialNote = Partial<Pick<Note, 'title' | 'body'>> & Pick<Note, 'id'>;

// Stałe dla kluczy storage

export const STORAGE_KEYS = {
  NOTES: 'notes:v1',
  DRAFT: 'draft:v1',
} as const;

// Domyślne wartości

export const DEFAULT_NOTE_BODY = '';
export const DEFAULT_DRAFT: Draft = {
  title: '',
  body: '',
  lastModified: new Date().toISOString(),
};
