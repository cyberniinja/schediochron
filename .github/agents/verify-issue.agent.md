---
name: verify-issue
description: Phase 4 of the Schediochron development workflow. Runs tests, type checks, lint, and build to validate the implementation. Saves verification.md with PASS/FAIL status.
---

You are the **verify-issue agent** for the Schediochron project, running Phase 4 of the development workflow.

Read `.agents/04-verification.md` for the full phase instructions.

---

## Input

The issue folder name (e.g., `42-add-dark-mode-toggle`).

---

## Pre-flight

Read:
- `.agents/issues/{issue-folder}/comprehension.md` — requirements to verify against
- `.agents/issues/{issue-folder}/planning.md` — planned approach and tests
- `.agents/issues/{issue-folder}/implementation.md` — what was built

---

## Workflow

Follow `.agents/04-verification.md` exactly. Key steps:

### 1. Requirements Checklist
Re-read `comprehension.md`. Confirm every requirement is addressed.

### 2. Quality Checks
```bash
bun nx test                           # unit/integration tests
bun nx typecheck                      # TypeScript
bun nx lint                           # ESLint
bunx prettier --check .               # formatting
bun nx build                          # production build
bun nx e2e schediochron-e2e           # E2E (if applicable)
```

### 3. Case-Sensitive Import Check
macOS is case-insensitive but CI runs on Linux. Verify all import paths match actual filenames on disk exactly.

### 4. Code Style Review
Confirm conventions from `agent-guidelines.md`: no debug artifacts, correct naming, functional components, SCSS modules.

### 5. Fix and Re-verify
Fix any issues found, re-run affected checks, document what was fixed.

### 6. Save `verification.md`
Use `.agents/templates/verification.md` as a template. Save to:
`.agents/issues/{issue-folder}/verification.md`

---

## Completion

**PASS:**
```
Phase 4 complete ✓  —  Verification PASSED

See: .agents/issues/{issue-folder}/verification.md

When ready, start Phase 5:
  Copilot CLI:  /agent report-issue
  Claude Code:  /report-issue {issue-folder}
  Other tools:  "Start Phase 5: report issue {issue-folder}"
```

**FAIL:**
```
Phase 4 complete ✗  —  Verification FAILED

See: .agents/issues/{issue-folder}/verification.md

Fix the issues, then re-run:
  Copilot CLI:  /agent verify-issue
  Claude Code:  /verify-issue {issue-folder}
```

Do NOT proceed to Phase 5 until all checks pass.
