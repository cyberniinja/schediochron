# Phase 4: Verification ✅

**Goal**: Validate that the implementation meets all requirements and quality standards.

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

- Run the full test suite (`npx nx test`), not only the tests created during this task
- Run E2E tests if applicable (`npx nx e2e schediochron-e2e`)
- Ensure no existing tests have been broken by the changes

### 3. Check Code Quality

- Run type checking (`npx nx typecheck`)
- Run linting (`npx nx lint`)
- Run formatting check (`npx prettier --check .`)
- Fix any issues found and re-verify

### 4. Review Code Style

- Confirm the code follows project conventions from `agent-guidelines.md`
- Verify naming conventions, file structure, and component patterns are consistent
- Check that no unnecessary code, comments, or debug artifacts remain

### 5. Manual Verification

- If applicable, manually verify the feature works as expected (e.g., serve the app and test the UI)

## Expected Output

Save a file named `verification.md` in the task folder (e.g., `.agents/42-add-profile-component/verification.md`) containing:

- Requirements checklist — each requirement from `comprehension.md` marked as met or not met
- Test results (all tests, not just new ones)
- Type check, lint, and formatting results
- Code style review notes
- Any issues found and how they were resolved
- Overall verification status: **PASS** or **FAIL**

## Checklist

- [ ] All requirements from `comprehension.md` verified as met
- [ ] Full test suite passes (`npx nx test`)
- [ ] E2E tests pass (if applicable)
- [ ] Type checking passes (`npx nx typecheck`)
- [ ] Linting passes (`npx nx lint`)
- [ ] Code formatting is correct
- [ ] Code style follows project conventions
- [ ] No regressions introduced
- [ ] `verification.md` saved in the task folder
- [ ] Ready to move to Phase 5 (Reporting)

## When to Go Back

- If verification fails, return to Phase 3 to fix issues, then re-verify.
- Do not proceed to Phase 5 until all checks pass.
