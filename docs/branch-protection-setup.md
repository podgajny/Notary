# GitHub Branch Protection Setup

## 🛡️ Konfiguracja Branch Protection Rules

Aby zapewnić jakość kodu i wymusić przejście testów przed mergem, skonfiguruj Branch Protection Rules w GitHub.

## 📋 Kroki Konfiguracji

### 1. Przejdź do Settings Repository

1. Otwórz swoje repozytorium na GitHub
2. Kliknij **Settings** (zakładka obok **Code**)
3. W lewym menu wybierz **Branches**

### 2. Dodaj Branch Protection Rule

1. Kliknij **Add rule**
2. W polu **Branch name pattern** wpisz: `main`

### 3. Skonfiguruj Wymagania

Zaznacz następujące opcje:

#### ✅ Require a pull request before merging

- **Require approvals**: 1 (można zwiększyć dla większych zespołów)
- **Dismiss stale PR approvals when new commits are pushed**: ✅
- **Require review from code owners**: ✅ (jeśli masz CODEOWNERS file)

#### ✅ Require status checks to pass before merging

- **Require branches to be up to date before merging**: ✅

Po pierwszym uruchomieniu CI, dodaj wymagane status checks:

- `validate` (z PR Validation workflow)
- `test` (z głównego CI workflow)
- `e2e-test` (z głównego CI workflow)

#### ✅ Require conversation resolution before merging

Wymusza rozwiązanie wszystkich komentarzy w PR.

#### ✅ Require signed commits (opcjonalnie)

Dla większego bezpieczeństwa.

#### ✅ Require linear history

Wymusza rebase zamiast merge commits.

### 4. Dodatkowe Opcje

#### ✅ Include administrators

Zasady dotyczą również adminów repozytorium.

#### ✅ Allow force pushes → **Everyone** (WYŁĄCZ)

Blokuje force push na protected branch.

#### ✅ Allow deletions (WYŁĄCZ)

Uniemożliwia przypadkowe usunięcie branch'a.

## 🔄 Workflow po Konfiguracji

### Dla Developera

1. **Stwórz branch z feature**

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Napisz testy (TDD)**

   ```bash
   npm run test
   ```

3. **Napisz kod**

   ```bash
   # Implementuj funkcjonalność
   ```

4. **Commit z prawidłowym formatem**

   ```bash
   git commit -m "feat(component): dodaj nową funkcjonalność"
   ```

5. **Push i stwórz PR**

   ```bash
   git push origin feature/new-feature
   ```

6. **Czekaj na CI i review**
   - Status checks muszą być GREEN ✅
   - PR musi być zaapprowane przez innego developera

### Dla Reviewera

1. **Code Review**
   - Sprawdź logikę biznesową
   - Sprawdź testy
   - Sprawdź dokumentację

2. **Sprawdź CI Status**
   - Wszystkie testy przechodzą ✅
   - Build się udał ✅
   - Nie ma konfliktów ✅

3. **Approve lub Request Changes**

## ⚠️ Co się stanie jeśli...

### Testy nie przechodzą

```
❌ Some checks were not successful
1 failing check

PR Validation / validate — The check suite has failed
```

**Rozwiązanie**: Napraw testy przed mergem.

### Brak approvals

```
❌ Review required
This branch requires approval from 1 reviewer
```

**Rozwiązanie**: Poproś kolegę o review.

### Branch nie jest up-to-date

```
❌ This branch is out-of-date with the base branch
```

**Rozwiązanie**:

```bash
git checkout main
git pull
git checkout feature/branch
git rebase main
git push --force-with-lease
```

## 🚫 Status Checks - Wymagane

Po pierwszym uruchomieniu CI, dodaj te status checks w GitHub:

### PR Validation Workflow

- `validate` - sprawdza testy, linting, build

### Main CI Workflow

- `test` - testy jednostkowe
- `e2e-test` - testy E2E (opcjonalnie)

### Jak dodać Status Checks

1. Po pierwszym PR z CI, GitHub pokaże dostępne checks
2. W Branch Protection Rules → **Require status checks**
3. Wyszukaj i dodaj wymagane checks
4. Zaznacz **Require branches to be up to date**

## 📝 CODEOWNERS (Opcjonalnie)

Stwórz `.github/CODEOWNERS` dla automatycznych review assignments:

```
# Global owners
* @username1 @username2

# Frontend specific
src/components/ @frontend-team
src/views/ @frontend-team

# Backend specific
src/api/ @backend-team
src/utils/ @backend-team

# Documentation
docs/ @tech-writers
*.md @tech-writers

# CI/CD
.github/ @devops-team
```

## 🎯 Best Practices

### 1. Małe, Atomiczne PR

- Jeden PR = jedna funkcjonalność
- Maksymalnie 400 linii kodu
- Jasny tytuł i opis

### 2. Szybkie Review

- Review w ciągu 24h
- Konstruktywne komentarze
- Approve gdy wszystko OK

### 3. Aktualizuj Branch Protection

- Dodawaj nowe status checks gdy potrzeba
- Dostosuj liczbę reviewerów do zespołu
- Regularnie przeglądaj zasady

## 🔧 Przykład Konfiguracji

```json
{
  "protection": {
    "required_status_checks": {
      "strict": true,
      "checks": [
        { "context": "validate" },
        { "context": "test" },
        { "context": "e2e-test" }
      ]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "required_approving_review_count": 1,
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": true
    },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false
  }
}
```

---

**Pamiętaj**: Branch Protection to nie przeszkoda, to gwarancja jakości! 🛡️
