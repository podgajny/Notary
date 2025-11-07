# GitHub Branch Protection Setup

## 🛡️ Branch Protection Rules Configuration

To ensure code quality and enforce test passing before merge, configure Branch Protection Rules in GitHub.

## 📋 Configuration Steps

### 1. Go to Repository Settings

1. Open your repository on GitHub
2. Click **Settings** (tab next to **Code**)
3. In the left menu select **Branches**

### 2. Add Branch Protection Rule

1. Click **Add rule**
2. In the **Branch name pattern** field enter: `main`

### 3. Configure Requirements

Check the following options:

#### ✅ Require a pull request before merging

- **Require approvals**: 1 (can be increased for larger teams)
- **Dismiss stale PR approvals when new commits are pushed**: ✅
- **Require review from code owners**: ✅ (if you have CODEOWNERS file)

#### ✅ Require status checks to pass before merging

- **Require branches to be up to date before merging**: ✅

After first CI run, add required status checks:

- `validate` (from PR Validation workflow)
- `test` (from main CI workflow)
- `e2e-test` (from main CI workflow)

#### ✅ Require conversation resolution before merging

Enforces resolution of all comments in PR.

#### ✅ Require signed commits (optional)

For greater security.

#### ✅ Require linear history

Enforces rebase instead of merge commits.

### 4. Additional Options

#### ✅ Include administrators

Rules also apply to repository administrators.

#### ✅ Allow force pushes → **Everyone** (DISABLE)

Blocks force push on protected branch.

#### ✅ Allow deletions (DISABLE)

Prevents accidental branch deletion.

## 🔄 Workflow After Configuration

### For Developer

1. **Create feature branch**

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Write tests (TDD)**

   ```bash
   npm run test
   ```

3. **Write code**

   ```bash
   # Implement functionality
   ```

4. **Commit with correct format**

   ```bash
   git commit -m "feat(component): add new feature"
   ```

5. **Push and create PR**

   ```bash
   git push origin feature/new-feature
   ```

6. **Wait for CI and review**
   - Status checks must be GREEN ✅
   - PR must be approved by another developer

### For Reviewer

1. **Code Review**
   - Check business logic
   - Check tests
   - Check documentation

2. **Check CI Status**
   - All tests passing ✅
   - Build succeeded ✅
   - No conflicts ✅

3. **Approve or Request Changes**

## ⚠️ What happens if...

### Tests don't pass

```
❌ Some checks were not successful
1 failing check

PR Validation / validate — The check suite has failed
```

**Solution**: Fix tests before merge.

### No approvals

```
❌ Review required
This branch requires approval from 1 reviewer
```

**Solution**: Ask a colleague for review.

### Branch is not up-to-date

```
❌ This branch is out-of-date with the base branch
```

**Solution**:

```bash
git checkout main
git pull
git checkout feature/branch
git rebase main
git push --force-with-lease
```

## 🚫 Status Checks - Required

After first CI run, add these status checks in GitHub:

### PR Validation Workflow

- `validate` - checks tests, linting, build

### Main CI Workflow

- `test` - unit tests
- `e2e-test` - E2E tests (optional)

### How to Add Status Checks

1. After first PR with CI, GitHub will show available checks
2. In Branch Protection Rules → **Require status checks**
3. Search and add required checks
4. Check **Require branches to be up to date**

## 📝 CODEOWNERS (Optional)

Create `.github/CODEOWNERS` for automatic review assignments:

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

### 1. Small, Atomic PRs

- One PR = one feature
- Maximum 400 lines of code
- Clear title and description

### 2. Quick Review

- Review within 24h
- Constructive comments
- Approve when everything is OK

### 3. Update Branch Protection

- Add new status checks when needed
- Adjust number of reviewers to team size
- Regularly review rules

## 🔧 Configuration Example

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

**Remember**: Branch Protection is not an obstacle, it's a quality guarantee! 🛡️
