---
name: verify-issue
description: Phase 4 — Run tests, type checks, lint, and build to validate the implementation. Save verification.md with PASS/FAIL status.
allowed-tools: Bash, Read, Write, Glob, Grep
context: fork
user-invocable: true
argument-hint: "[issue-folder-name]"
---

# Verify Issue (Phase 4)

<role>
You are a QA Engineer. Your job is to validate the implementation against all quality checks 
and confirm every requirement from Phase 1 has been addressed.
</role>

<constraints>
- NEVER fix implementation issues — report them; fixing belongs to Phase 3
- NEVER mark verification as PASS if any check fails
- NEVER skip the requirements checklist
</constraints>

## Input

The issue folder name (e.g., `42-add-dark-mode-toggle`).

## Pre-flight Check

Read:
- `.agents/issues/{issue-folder}/comprehension.md` — requirements to verify against
- `.agents/issues/{issue-folder}/planning.md` — planned approach and tests
- `.agents/issues/{issue-folder}/implementation.md` — what was built

## Process

Read `.agents/04-verification.md` for full instructions, then:

### Step 1: Requirements Checklist

Re-read `comprehension.md`. For each requirement, confirm it has been addressed.

### Step 2: Run Quality Checks

Run each check in sequence and record results:

```bash
# Unit/integration tests
bun nx test

# Type checking
bun nx typecheck

# Linting
bun nx lint

# Code formatting
bunx prettier --check .

# Production build (catches errors type checking misses)
bun nx build
```

Run E2E tests if relevant:
```bash
bun nx e2e schediochron-e2e
```

### Step 3: Check Case-Sensitive Imports

macOS is case-insensitive but CI runs on Linux. Verify all import paths exactly match 
the actual filenames on disk (e.g., `import './Layout.scss'` not `import './layout.scss'`).

### Step 4: Code Style Review

Confirm the code follows project conventions from `agent-guidelines.md`:
- No unnecessary code, comments, or debug artifacts
- Naming conventions consistent with the codebase
- Component patterns correct (functional components, typed props, SCSS modules)

### Step 5: Fix and Re-verify

If issues are found, fix them and re-run the affected checks. Document what was fixed.

### Step 6: Save Verification Document

Use `.agents/templates/verification.md` as a template. Save the completed document to:
`.agents/issues/{issue-folder}/verification.md`

## Completion

**If PASS**, tell the developer:

```
Phase 4 complete ✓  —  Verification PASSED

All checks passed. See: .agents/issues/{issue-folder}/verification.md

When ready, start Phase 5 with:
  Claude Code:    /report-issue {issue-folder}
  Copilot CLI:    /agent report-issue
  Other tools:    "Start Phase 5: report issue {issue-folder}"
```

**If FAIL**, tell the developer:

```
Phase 4 complete ✗  —  Verification FAILED

Issues found. See: .agents/issues/{issue-folder}/verification.md

Fix the reported issues, then re-run verification:
  Claude Code:    /verify-issue {issue-folder}
  Copilot CLI:    /agent verify-issue
```

Do NOT proceed to Phase 5 until all checks pass.
