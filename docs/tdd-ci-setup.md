# TDD + CI Setup Guide

## 🎯 Goal

This document describes how to work with Test-Driven Development (TDD) and Continuous Integration (CI) in our Vue 3 project.

## 🔄 TDD Workflow - Red, Green, Refactor

### 1. RED ❌ - Write a test that will fail

```bash
# First write a test in the appropriate directory
# src/components/__tests__/NomeComponent.test.ts
# src/utils/__tests__/someUtils.test.ts

# Run tests - they should be RED (failing)
npm run test
```

### 2. GREEN ✅ - Write minimal implementation

```bash
# Write code that will make the test pass
# Don't worry about quality - goal is GREEN

# Run tests again
npm run test
```

### 3. REFACTOR 🔄 - Improve code while keeping tests GREEN

```bash
# Refactor code without changing functionality
# Tests should still pass

npm run test
```

## 🧪 Test Structure

```
src/
├── components/
│   ├── __tests__/
│   │   ├── Component.test.ts
│   │   └── AnotherComponent.test.ts
│   └── Component.vue
├── utils/
│   ├── __tests__/
│   │   └── utils.test.ts
│   └── utils.ts
└── __tests__/
    └── App.test.ts

tests/
└── e2e/
    ├── feature.spec.ts
    └── another-feature.spec.ts
```

## 📝 Test Conventions

### Naming

- Test files: `*.test.ts` (unit) or `*.spec.ts` (E2E)
- Describe blocks: component/function name
- Test cases: "should [expected behavior]"

### Unit test example

```typescript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import MyComponent from "../MyComponent.vue";

describe("MyComponent", () => {
  it("should render title", () => {
    const wrapper = mount(MyComponent, {
      props: { title: "Test Title" },
    });

    expect(wrapper.find("h1").text()).toBe("Test Title");
  });
});
```

## 🚀 Available Commands

### Unit Tests (Vitest)

```bash
npm run test          # Watch mode - runs automatically
npm run test:run      # Single run - for CI
npm run test:ui       # UI mode - visual interface
npm run test:coverage # With code coverage
```

### E2E Tests (Playwright)

```bash
npm run test:e2e        # Run all E2E tests
npm run test:e2e:ui     # UI mode for E2E
npm run test:e2e:report # Show test report
```

### Linting and Formatting

```bash
npm run lint          # Check TypeScript types
npm run lint:fix      # Fix formatting
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

1. **PR Validation** - runs on every PR
   - Type checking
   - Unit tests
   - Build check
   - E2E tests (optional)

2. **Main CI/CD** - runs on push to main/develop
   - All tests
   - Build
   - Deploy (main branch only)

### Branch Protection Configuration

In GitHub repository settings configure:

1. **Settings** → **Branches** → **Add rule**
2. **Branch name pattern**: `main`
3. Check:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ PR Validation / validate
   - ✅ Require pull request reviews

## 🪝 Pre-commit Hooks

### What happens before commit

```bash
# Automatically runs:
1. Prettier (code formatting)
2. TypeScript check
3. Unit tests

# If anything fails - commit will be rejected
```

### Format Commit Messages

We use Conventional Commits:

```bash
feat(auth): add user login
fix(ui): fix mobile responsiveness
docs(readme): update instructions
test(utils): add tests for formatting
chore(deps): update dependencies
```

## 🎯 TDD in Practice - Example

### Step 1: Write test (RED)

```typescript
// src/utils/__tests__/validator.test.ts
import { describe, it, expect } from "vitest";
import { validateEmail } from "../validator";

describe("validateEmail", () => {
  it("should accept valid email", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });

  it("should reject invalid email", () => {
    expect(validateEmail("invalid-email")).toBe(false);
  });
});
```

### Step 2: Run test (RED)

```bash
npm run test
# ❌ Error: Cannot resolve import "../validator"
```

### Step 3: Write minimal implementation (GREEN)

```typescript
// src/utils/validator.ts
export function validateEmail(email: string): boolean {
  return email.includes("@");
}
```

### Step 4: Run test (GREEN)

```bash
npm run test
# ✅ All tests passed
```

### Step 5: Refactor (GREEN)

```typescript
// src/utils/validator.ts
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

## 📋 Pre-PR Checklist

- [ ] All tests pass locally (`npm run test:run`)
- [ ] Code is formatted (`npm run lint:fix`)
- [ ] Tests added for new functionality
- [ ] E2E tests pass (if applicable)
- [ ] Commit messages in correct format
- [ ] PR has descriptive name and description

## 🐛 Troubleshooting

### "cleanup is not a function"

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### E2E tests not working

```bash
# Reinstall Playwright browsers
npx playwright install
```

### Pre-commit hook not working

```bash
# Reinstall husky
npm run prepare
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Docs](https://playwright.dev/)
- [TDD Best Practices](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

**Remember**: TDD is not just writing tests - it's a way of thinking about code. Start by defining what you expect, then write code that fulfills it.
