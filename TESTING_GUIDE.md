# Complete Testing Guide

This guide explains how to run all tests (Backend Unit, Frontend Unit, and E2E tests).

## ⚠️ IMPORTANT: Always run commands from the correct directory!

---

## 1️⃣ Backend Unit Tests (Jest + Supertest)

### Location
- **Directory:** `/backend`
- **Test files:** `backend/__tests__/api.test.js`
- **Framework:** Jest + Supertest

### How to Run

```bash
# Navigate to backend directory first
cd backend

# Run all backend tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Expected Output
```
PASS __tests__/api.test.js
✓ GET /healthz returns status ok
✓ POST /api/projects creates new project
✓ POST /api/testers creates new tester
... (17 tests total)

Test Suites: 1 passed, 1 total
Tests: 17 passed, 17 total
```

---

## 2️⃣ Frontend Unit Tests (Vitest + React Testing Library)

### Location
- **Directory:** `/frontend`
- **Test files:** `frontend/src/__tests__/components/*.test.tsx`
- **Framework:** Vitest + React Testing Library

### How to Run

```bash
# Navigate to frontend directory first
cd frontend

# Run all frontend tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### ❌ Common Error (What You're Experiencing)

**WRONG - Running from root directory:**
```bash
# ❌ DON'T DO THIS
cd test-bug-management-system
npm test
# This will try to use Jest from root and fail!
```

**✅ CORRECT - Running from frontend directory:**
```bash
# ✅ DO THIS
cd test-bug-management-system/frontend
npm test
# This will use Vitest correctly!
```

### Expected Output
```
RUN  v3.2.4 /path/to/frontend

✓ src/__tests__/components/ProjectsTab.test.tsx (2 tests)
✓ src/__tests__/components/TestersTab.test.tsx (3 tests)
✓ src/__tests__/components/BugsTab.test.tsx (2 tests)
✓ src/__tests__/components/TestCasesTab.test.tsx (4 tests)
✓ src/__tests__/components/ReportsTab.test.tsx (2 tests)

Test Files  5 passed (5)
Tests  13 passed (13)
Duration  1.79s
```

---

## 3️⃣ End-to-End Tests (Playwright)

### Location
- **Directory:** `/` (root)
- **Test files:** `tests/e2e-complete.spec.ts`
- **Framework:** Playwright

### Prerequisites

**IMPORTANT:** Make sure both backend and frontend are running before E2E tests!

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm run dev

# Terminal 3: Run E2E tests (see below)
```

### How to Run

```bash
# Navigate to root directory
cd test-bug-management-system

# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test tests/e2e-complete.spec.ts

# Run with UI mode (interactive)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test by name
npx playwright test -g "should create a new project"

# Generate test report
npx playwright show-report
```

### Expected Output
```
Running 10 tests using 1 worker

✓ should display main navigation tabs
✓ should create a new project
✓ should create a new tester
✓ should navigate to and display test suites
✓ should navigate to and display test cases
✓ should navigate to bugs tab
✓ should display reports tab
✓ should display charts tab
✓ should handle bug creation workflow
✓ should navigate between all tabs smoothly

10 passed (30s)
```

---

## 🎯 Quick Command Reference

### Test Everything at Once

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd ../frontend && npm test

# E2E tests (make sure backend and frontend are running!)
cd .. && npx playwright test
```

### Or use this script (from root):

```bash
# Test backend
(cd backend && npm test)

# Test frontend
(cd frontend && npm test)

# Test E2E (requires backend + frontend running)
npx playwright test
```

---

## 📊 Test Coverage Summary

| Test Type | Location | Command | Tests |
|-----------|----------|---------|-------|
| Backend Unit | `/backend` | `npm test` | 17 tests |
| Frontend Unit | `/frontend` | `npm test` | 13 tests |
| E2E | `/` (root) | `npx playwright test` | 10 scenarios |
| **TOTAL** | - | - | **40 tests** |

---

## 🐛 Troubleshooting

### Error: "Cannot find module jest.js"

**Problem:** You're running `npm test` from the wrong directory (root instead of frontend)

**Solution:**
```bash
# Make sure you're in the frontend directory
pwd  # Should show: /path/to/test-bug-management-system/frontend
cd frontend  # If not already there
npm test
```

### Error: "page.goto: Target closed"

**Problem:** Backend or frontend not running for E2E tests

**Solution:**
```bash
# Start backend in one terminal
cd backend && npm start

# Start frontend in another terminal
cd frontend && npm run dev

# Then run E2E tests in third terminal
npx playwright test
```

### Error: "No tests found"

**Problem:** Test files not in expected location

**Solution:**
```bash
# Check frontend tests exist
ls frontend/src/__tests__/components/

# Check E2E tests exist
ls tests/e2e-complete.spec.ts
```

---

## 📁 Project Structure

```
test-bug-management-system/
├── backend/
│   ├── __tests__/              ← Backend unit tests
│   │   └── api.test.js
│   ├── jest.config.js
│   └── package.json            (has: "test": "jest --coverage")
│
├── frontend/
│   ├── src/
│   │   ├── __tests__/          ← Frontend unit tests
│   │   │   └── components/
│   │   │       ├── ProjectsTab.test.tsx
│   │   │       ├── TestersTab.test.tsx
│   │   │       ├── BugsTab.test.tsx
│   │   │       ├── TestCasesTab.test.tsx
│   │   │       └── ReportsTab.test.tsx
│   │   └── test/
│   │       └── setup.ts
│   ├── vite.config.ts
│   └── package.json            (has: "test": "vitest run")
│
├── tests/                      ← E2E tests
│   └── e2e-complete.spec.ts
│
├── playwright.config.ts
└── package.json                (has: Playwright config)
```

---

## ✅ Verification Checklist

Before running tests, verify:

- [ ] You're in the correct directory
- [ ] Dependencies are installed (`npm install` in backend and frontend)
- [ ] For E2E: Backend is running on http://localhost:3000
- [ ] For E2E: Frontend is running on http://localhost:5173
- [ ] Node.js version is compatible (v18 or higher recommended)

---

## 🎓 For Academic Report

When documenting tests in your report, include:

1. **Backend Tests:** Screenshot of `cd backend && npm test`
2. **Frontend Tests:** Screenshot of `cd frontend && npm test`
3. **E2E Tests:** Screenshot of `npx playwright test`
4. **Test Code:** Screenshots of test files
5. **Coverage Reports:** Screenshots from coverage folders

Remember: Always show the full terminal output including the directory path!

---

**Last Updated:** 2024-10-17
**Total Tests:** 40 (17 backend + 13 frontend + 10 E2E)
