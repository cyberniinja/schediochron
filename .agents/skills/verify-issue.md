---
name: verify-issue
description: Phase 4 — Run tests, type checks, lint, and build to validate the implementation. Save verification.md with PASS/FAIL status.
argument-hint: '[issue-folder-name]'
---

# Verify Issue (Phase 4)

<role>
You are a QA Engineer. Your job is to validate the implementation against all quality checks
and confirm every requirement from Phase 1 has been addressed.
</role>

<constraints>
- NEVER mark verification as PASS if any check fails
- NEVER skip the requirements checklist
- If issues are found, fix them and re-run the affected checks before saving verification.md
</constraints>

## Input

The issue folder name (e.g. `42-add-dark-mode-toggle`).

If not provided, scan `.agents/issues/` and use the most recently modified folder.

If an explicit argument was provided but no matching folder exists under `.agents/issues/`, tell
the developer: "No folder found matching '{arg}'. Available issue folders:" — list the output of
`ls .agents/issues/` — and ask which to use. Wait for confirmation before proceeding.

## Pre-flight Check

Read:

- `.agents/issues/{issue-folder}/comprehension.md` — requirements to verify against
- `.agents/issues/{issue-folder}/planning.md` — planned approach and tests
- `.agents/issues/{issue-folder}/implementation.md` — what was built

## Process

### Step 1: Requirements Checklist

Re-read `comprehension.md`. For each requirement, confirm it has been addressed. Note any gaps.

### Step 2: Run Quality Checks

Run each check in sequence and record results:

```bash
# Unit/integration tests
bun nx run-many -t test

# Type checking
bun nx run-many -t typecheck

# Linting
bun nx run-many -t lint

# Code formatting
bunx prettier --check .

# Production build (catches errors type checking may miss)
bun nx run-many -t build
```

Run E2E tests if the changes affect user flows:

```bash
bun nx e2e schediochron-e2e
```

### Step 3: Check Case-Sensitive Imports

macOS is case-insensitive but CI runs on Linux. Verify that all import paths exactly match the
actual filenames on disk (e.g. `import './Layout.scss'` not `import './layout.scss'`).

### Step 4: Code Style Review

Confirm the code follows project conventions from `AGENTS.md` (Agent Development Reference):

- No unnecessary code, comments, or debug artifacts
- Naming conventions consistent with the codebase
- Component patterns correct (functional components, typed props, SCSS modules)

### Step 5: Fix and Re-verify

If issues are found, fix them and re-run the affected checks. Document what was fixed in the
verification document.

### Step 6: Save Verification Document

Use `.agents/templates/verification.md` as a template. Save the completed document to:
`.agents/issues/{issue-folder}/verification.md`

The document should contain:

- Requirements checklist — each requirement marked as met or not met
- Test results (all tests, not just new ones)
- Type check, lint, and formatting results
- Code style review notes
- Any issues found and how they were resolved
- Overall verification status: **PASS** or **FAIL**

## Checklist

- [ ] All requirements from `comprehension.md` verified as met
- [ ] Full test suite passes
- [ ] E2E tests pass (if applicable)
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Production build succeeds
- [ ] All import paths are case-correct
- [ ] Code formatting is correct
- [ ] Code style follows project conventions
- [ ] No regressions introduced
- [ ] `verification.md` saved in the issue folder using the template
- [ ] **Stopped here** — do not proceed to Phase 5 without explicit developer instruction

## Completion

**If PASS**, tell the developer:

```
Phase 4 complete ✓  —  Verification PASSED

All checks passed. See: .agents/issues/{issue-folder}/verification.md

When ready, start Phase 5:
  report-issue {issue-folder}
```

**If FAIL**, tell the developer:

```
Phase 4 complete ✗  —  Verification FAILED

Issues found. See: .agents/issues/{issue-folder}/verification.md

Fix the reported issues, then re-run verification:
  verify-issue {issue-folder}
```

Do NOT proceed to Phase 5 until all checks pass.

## When to Go Back

If verification fails, return to Phase 3 to fix the issues, then re-run verification.
