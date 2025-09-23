# Notary (Vue 3 + Vite)

Prosty, lokal-first notatnik działający w przeglądarce. Aplikacja używa IndexedDB do trwałego przechowywania danych na urządzeniu użytkownika.

## Tech stack
- Vue 3 + Vite
- Pinia (stan)
- idb-keyval (IndexedDB wrapper)
- TailwindCSS + shadcn-vue (UI)
- Vitest + Vue Test Utils (unit/integration)
- Playwright (e2e)

## Uruchomienie
```bash
npm install
npm run dev
```
Aplikacja dostępna pod `http://localhost:5173`.

## Model danych i persystencja
- Notatki są przechowywane w IndexedDB pod kluczem `notes:v1` jako tablica obiektów JSON (`Note`).
- Szkice (drafty) są przechowywane oddzielnie pod kluczem `draft:v1` jako pojedynczy obiekt (`Draft`).
- Warstwa dostępu: `src/lib/db.ts` (funkcje `getNotes`, `setNotes`, `getDraft`, `setDraft`, `clearDraft`).

### Auto‑save draft
- Edytor zapisuje szkic z opóźnieniem (debounce ~2s) podczas pisania.
- Szkic jest odtwarzany przy starcie aplikacji, jeśli formularz jest pusty.
- Zapis szkicu nie publikuje notatki – publikacja następuje dopiero po kliknięciu „Zapisz”.
- Po skutecznym zapisie notatki szkic jest czyszczony.

### Odporność i walidacja
- Pusta lista w przypadku błędów odczytu notatek (bez crasha UI).
- Walidacja tytułu (wymagany) – przycisk „Zapisz” jest nieaktywny, a pod polem pojawia się komunikat.
- W przypadku błędów zapisu wyświetlany jest komunikat w edytorze, a UI cofa optymistyczne zmiany.

## Testy
- Unit/integration:
  ```bash
  npm run test:unit
  ```
- E2E (Playwright):
  ```bash
  npm run test:e2e
  ```

## Konwencje UI
- Komponenty UI w `src/components/ui/*` (shadcn-vue), komponenty domenowe w `src/components/*`.
- Stylowanie Tailwind, brak wartości arbitralnych (chyba że uzasadnione).
- Dostępność: focus-visible, disabled z `cursor-not-allowed` i `opacity`.

## Ważne pliki
- `src/components/NoteEditor.vue` – edytor z walidacją i auto‑save draft.
- `src/components/NoteList.vue` – lista notatek, sortowanie po `updatedAt` i dynamiczne rozmiary kart.
- `src/stores/notes.store.ts` – Pinia store (CRUD, draft, inicjalizacja).
- `src/lib/db.ts` – API IndexedDB.

## Deploy (Vercel)
- Projekt zawiera `vercel.json`. Po wypchnięciu gałęzi utwórz podgląd (Preview).
