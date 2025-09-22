/**
 * Warstwa bazy danych - wrapper dla IndexedDB używający idb-keyval
 * Obsługuje operacje CRUD dla notatek i roboczych wersji
 */

import { get, set, del } from 'idb-keyval';
import { isNote, isDraft, STORAGE_KEYS } from '../types';
import type { Note, Draft } from '../types';

/**
 * Pobiera wszystkie notatki z IndexedDB
 * @returns Promise<Note[]> - tablica notatek, pusta jeśli brak danych
 */
export async function getNotes(): Promise<Note[]> {
  try {
    const storedNotes = await get(STORAGE_KEYS.NOTES);
    
    // Brak danych - zwróć pustą tablicę
    if (!storedNotes) {
      return [];
    }

    // Sprawdź czy to tablica
    if (!Array.isArray(storedNotes)) {
      console.warn('Nieprawidłowe dane notatek w storage, resetowanie...');
      await set(STORAGE_KEYS.NOTES, []);
      return [];
    }

    // Filtruj tylko prawidłowe notatki
    const validNotes = storedNotes.filter((note: any) => {
      const isValid = isNote(note);
      if (!isValid) {
        console.warn('Nieprawidłowa notatka odfiltrowana:', note);
      }
      return isValid;
    });

    return validNotes;
  } catch (error) {
    console.error('Błąd podczas pobierania notatek:', error);
    
    // W przypadku błędu zwróć pustą tablicę
    return [];
  }
}

/**
 * Zapisuje tablicę notatek do IndexedDB
 * @param notes - tablica notatek do zapisania
 */
export async function setNotes(notes: Note[]): Promise<void> {
  // Walidacja danych wejściowych
  if (!Array.isArray(notes)) {
    throw new Error('setNotes(): notes musi być tablicą');
  }

  // Walidacja każdej notatki
  for (const note of notes) {
    if (!isNote(note)) {
      throw new Error(`setNotes(): nieprawidłowa notatka: ${JSON.stringify(note)}`);
    }
  }

  try {
    await set(STORAGE_KEYS.NOTES, notes);
  } catch (error) {
    console.error('Błąd podczas zapisywania notatek:', error);
    throw error; // Przekaż błąd dalej
  }
}

/**
 * Pobiera roboczą wersję notatki z IndexedDB
 * @returns Promise<Draft | null> - draft lub null jeśli nie istnieje
 */
export async function getDraft(): Promise<Draft | null> {
  try {
    const storedDraft = await get(STORAGE_KEYS.DRAFT);
    
    // Brak danych
    if (!storedDraft) {
      return null;
    }

    // Walidacja struktury draftu
    if (!isDraft(storedDraft)) {
      console.warn('Nieprawidłowy draft w storage, usuwanie...');
      await del(STORAGE_KEYS.DRAFT);
      return null;
    }

    return storedDraft;
  } catch (error) {
    console.error('Błąd podczas pobierania draftu:', error);
    return null;
  }
}

/**
 * Zapisuje roboczą wersję notatki do IndexedDB
 * @param draft - draft do zapisania
 */
export async function setDraft(draft: Draft): Promise<void> {
  // Walidacja danych wejściowych
  if (!isDraft(draft)) {
    throw new Error(`setDraft(): nieprawidłowy draft: ${JSON.stringify(draft)}`);
  }

  try {
    // Aktualizuj timestamp lastModified
    const draftToSave: Draft = {
      ...draft,
      lastModified: new Date().toISOString(),
    };

    await set(STORAGE_KEYS.DRAFT, draftToSave);
  } catch (error) {
    console.error('Błąd podczas zapisywania draftu:', error);
    throw error;
  }
}

/**
 * Usuwa roboczą wersję notatki z IndexedDB
 */
export async function clearDraft(): Promise<void> {
  try {
    await del(STORAGE_KEYS.DRAFT);
  } catch (error) {
    console.error('Błąd podczas usuwania draftu:', error);
    // Nie rzucaj błędu - czyszczenie draftu nie powinno blokować aplikacji
  }
}

/**
 * Sprawdza czy IndexedDB jest dostępne
 * @returns boolean - true jeśli IndexedDB jest dostępne
 */
export function isIndexedDBAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * Inicjalizuje bazę danych - sprawdza dostępność i tworzy podstawową strukturę
 */
export async function initializeDB(): Promise<void> {
  if (!isIndexedDBAvailable()) {
    console.warn('IndexedDB niedostępne - aplikacja będzie działać bez persystencji');
    return;
  }

  try {
    // Sprawdź czy można zapisać i odczytać dane
    const testKey = 'db-test';
    const testValue = { test: true };
    
    await set(testKey, testValue);
    const retrieved = await get(testKey);
    await del(testKey);
    
    if (JSON.stringify(retrieved) !== JSON.stringify(testValue)) {
      throw new Error('Test zapisu/odczytu nie powiódł się');
    }
    
    console.log('Baza danych zainicjalizowana pomyślnie');
  } catch (error) {
    console.error('Błąd inicjalizacji bazy danych:', error);
    throw error;
  }
}
