# Phase 4: Verification ✅

**Goal**: Validate that the implementation meets all requirements and quality standards.

## How to Invoke

| Tool | Command |
|------|---------|
| Copilot CLI | `/agent verify-issue` |
| Claude Code | `/verify-issue {issueNr}-{issueName}` |
| Other tools | "Start Phase 4: verify issue {issueNr}-{issueName}" |

## Expected Input

- The completed `comprehension.md` from Phase 1 (requirements reference)
- The completed `planning.md` from Phase 2 (planned approach and tests)
- The completed `implementation.md` from Phase 3 (what was built)

## Behaviour

### 1. Verify Requirements

- Re-read `comprehension.md` and confirm that every requirement has been addressed
- Check that no requirements were missed or misinterpreted during implementation
- Verify that documented assumptions still hold

### 2. Run All Tests

- Run the full test suite (`bun nx test`), not only the tests created during this task
- Run E2E tests if applicable (`bun nx e2e schediochron-e2e`)
- Ensure no existing tests have been broken by the changes

### 3. Check Code Quality

- Run type checking (`bun nx typecheck`)
- Run linting (`bun nx lint`)
- Run formatting check (`bunx prettier --check .`)
- Run a production build (`bun nx build`) — catches errors that type checking alone may miss
- **Check for case-sensitive imports**: macOS is case-insensitive so broken imports pass locally but fail on Linux CI. Verify that all import paths exactly match the file/directory names on disk (e.g., `import './Layout.scss'` not `import './layout.scss'`).
- Fix any issues found and re-verify

### 4. Review Code Style

- Confirm the code follows project conventions from `agent-guidelines.md`
- Verify naming conventions, file structure, and component patterns are consistent
- Check that no unnecessary code, comments, or debug artifacts remain

### 5. Manual Verification

- If applicable, manually verify the feature works as expected (e.g., serve the app and test the UI)

## Expected Output

Save a file named `verification.md` in the issue folder (e.g., `.agents/issues/42-add-profile-component/verification.md`) containing:

- Requirements checklist — each requirement from `comprehension.md` marked as met or not met
- Test results (all tests, not just new ones)
- Type check, lint, and formatting results
- Code style review notes
- Any issues found and how they were resolved
- Overall verification status: **PASS** or **FAIL**

Use `.agents/templates/verification.md` as a template.

## Checklist

- [ ] All requirements from `comprehension.md` verified as met
- [ ] Full test suite passes (`bun nx test`)
- [ ] E2E tests pass (if applicable)
- [ ] Type checking passes (`bun nx typecheck`)
- [ ] Linting passes (`bun nx lint`)
- [ ] Production build succeeds (`bun nx build`)
- [ ] All import paths are case-correct (match actual filenames on disk)
- [ ] Code formatting is correct
- [ ] Code style follows project conventions
- [ ] No regressions introduced
- [ ] `verification.md` saved in the issue folder using the template
- [ ] Developer told to invoke Phase 5 when ready (only if PASS)
- [ ] **Stopped here** — do not proceed to Phase 5 without explicit developer instruction

## When to Go Back

- If verification fails, return to Phase 3 to fix issues, then re-verify.
- Do not proceed to Phase 5 until all checks pass.

## Next Phase

Tell the developer (only if PASS):
```
When ready, start Phase 5:
  Copilot CLI:  /agent report-issue
  Claude Code:  /report-issue {issueNr}-{issueName}
  Other tools:  "Start Phase 5: report issue {issueNr}-{issueName}"
```
