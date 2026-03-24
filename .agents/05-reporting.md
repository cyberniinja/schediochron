# Phase 5: Reporting 📝

**Goal**: Communicate the results of the task clearly and concisely to the developer.

## Expected Input

- The completed `comprehension.md` from Phase 1
- The completed `planning.md` from Phase 2
- The completed `implementation.md` from Phase 3
- The completed `verification.md` from Phase 4

## Behaviour

### 1. Compile the Report

- Summarize what was accomplished
- Document any deviations from the original plan
- List all commits made
- Include verification results
- Note any remaining issues or follow-up work

### 2. Present to the Developer

- Deliver the report in a clear, structured format
- Highlight anything that needs the developer's attention
- Suggest next steps if applicable

## Report Format

The report should follow this structure:

```markdown
# Task Report: {issueNr} — {issueName}

## Summary
Brief description of what was done.

## Changes Made
- List of changes, grouped logically

## Commits
- `abc1234` — commit message
- `def5678` — commit message

## Deviations from Plan
- Any changes to the original plan and why

## Verification Results
- Tests: PASS / FAIL
- Type Check: PASS / FAIL
- Lint: PASS / FAIL
- Formatting: PASS / FAIL

## Remaining Issues
- Any known issues or follow-up work needed

## Next Steps
- Suggested follow-up tasks or improvements
```

## Expected Output

Save a file named `report.md` in the task folder (e.g., `.agents/42-add-profile-component/report.md`) containing the report in the format above.

Additionally, present the report summary directly to the developer in the conversation.

## Checklist

- [ ] Report compiled with all sections
- [ ] Deviations from plan documented
- [ ] Commits listed
- [ ] Verification results included
- [ ] Remaining issues noted
- [ ] `report.md` saved in the task folder
- [ ] Report presented to the developer
- [ ] Task complete
