# 🌱 Jak pracować z GitHubem – instrukcja dla początkującego

## 1. Zasady ogólne
- **Każde zadanie = osobny branch.**  
- Na `main` **nigdy nie commitujesz bezpośrednio**.  
- Flow wygląda tak:  
  ```
  main → tworzysz branch → commitujesz zmiany → push → Pull Request → merge → usuwasz branch
  ```

---

## 2. Pierwsze przygotowanie
1. **Upewnij się, że main jest świeży**:
   ```bash
   git switch main
   git pull
   ```
2. **Utwórz nowy branch do zadania**:
   ```bash
   git switch -c feat/CMD-32-nazwa-zadania
   ```
   - `feat/` – nowa funkcja,  
   - `fix/` – poprawka,  
   - `chore/` – porządki,  
   - `CMD-32` – numer zadania z Linear,  
   - `nazwa-zadania` – krótki opis.

---

## 3. Praca nad plikami
1. Utwórz lub zmodyfikuj pliki w projekcie (np. `myfile.md`).  
2. Sprawdź status:
   ```bash
   git status
   ```
3. Dodaj zmiany do staging area:
   ```bash
   git add myfile.md
   # lub wszystkie zmiany:
   git add .
   ```
4. Commit:
   ```bash
   git commit -m "feat(CMD-32): dodaj nowy plik myfile.md"
   ```
   > Każdy commit = snapshot Twoich zmian. Zawsze dodawaj numer zadania.

---

## 4. Push na GitHuba
1. Pierwszy push dla nowego brancha:
   ```bash
   git push --set-upstream origin feat/CMD-32-nazwa-zadania   # to polecenie musisz podać tylko przy pierwszym pushu w ramach danego brancha. Potem wystarczy samo `git push`
   ```
   - `origin` = zdalne repo (GitHub),  
   - `--set-upstream` = zapamiętaj powiązanie lokalny ↔ zdalny branch.  
2. Kolejne push’e wystarczą krótsze:
   ```bash
   git push
   ```

---

## 5. Pull Request (PR)

### Tworzenie PR w GitHubie
- **PR = prośba o wciągnięcie Twoich zmian do `main`.**  
- Tworzy się go po pushu:
  - GitHub pokaże baner „Compare & pull request”,  
  - lub przez **Pull requests → New pull request**.  
- W PR podajesz (tworzysz go zazwyczaj w UI GitHuba po pushu, ale możesz też w Cursorze jeśli masz integrację z GitHub):
  - Tytuł: `feat(CMD-32): krótki opis`,  
  - Opis: co zostało zrobione, link do zadania Linear (`CMD-32`).  
- Po review i zielonych checkach → **Merge** (najlepiej Squash & merge).

### Tworzenie PR w Cursorze
1. Otwórz paletę poleceń w Cursorze (`Cmd+Shift+P` / `Ctrl+Shift+P`).
2. Wpisz: `Create Pull Request`.
3. Cursor zapyta Cię o branch źródłowy (np. `feat/CMD-32-nazwa-zadania`) i docelowy (`main`).
4. Wypełnij tytuł i opis PR (tak samo jak w GitHub UI).
5. Zatwierdź – PR zostanie utworzony bezpośrednio na GitHubie, a link pojawi się w Cursorze.

---

## 6. Po merge
1. Usuń branch na GitHubie (przycisk „Delete branch”).  
2. Usuń branch lokalnie:
   ```bash
   git switch main
   git pull
   git branch -d feat/CMD-32-nazwa-zadania
   ```
3. Kolejne zadanie = nowy branch od aktualnego `main`.

---

## 7. Przydatne komendy
- Sprawdzenie gałęzi:
  ```bash
  git branch --show-current
  ```
- Obejrzenie zmian w plikach:
  ```bash
  git diff              # różnice w plikach nie dodanych
  git diff --staged     # różnice już w staging area
  ```
- Cofnięcie pliku ze staging:
  ```bash
  git restore --staged myfile.md
  ```
- Cofnięcie zmian w pliku:
  ```bash
  git restore myfile.md
  ```

---

## 8. Najważniejsze zasady do zapamiętania
- **Commit = snapshot staging area** → zawsze poprzedzony `git add`.  
- **Push ≠ Merge** → `push` tylko wysyła zmiany na branch. Do `main` trafiają dopiero po **PR + merge**.  
- **Po merge zawsze usuwaj branch.**  
- **Nowy branch dla nowego zadania.**
