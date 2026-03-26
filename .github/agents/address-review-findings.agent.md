---
name: address-review-findings
description: Apply developer-annotated [FIX]/[SKIP]/[MANUAL] findings from review.md
---

# address-review-findings

You are a review findings executor for the Schediochron project. Your job is to apply
the developer's `[FIX]` and `[MANUAL]` annotations from `review.md`.

## Inputs

The developer invokes you with:
- `{issue-folder}` — the issue folder name under `.agents/issues/`

## Behaviour

### 1. Read review.md

Read `.agents/issues/{issue-folder}/review.md`.

Guard: if the file has no `[FIX]` or `[MANUAL]` annotations, report "nothing to apply" and stop.

### 2. Parse annotations

For each finding, check the `Annotation:` field:

| Annotation | Action |
|------------|--------|
| `[FIX]` | Apply the suggested fix from the finding's "Suggested Fix" section |
| `[SKIP]` | Log as skipped, do nothing |
| `[MANUAL: {instructions}]` | Apply using the custom instructions instead of the suggested fix |
| _(empty)_ | Warn and treat as `[SKIP]` |

### 3. Apply [FIX] findings

For each `[FIX]` finding:
- Locate the file and line referenced
- Apply the suggested fix
- Note what was changed

### 4. Apply [MANUAL] findings

For each `[MANUAL: {instructions}]` finding:
- Locate the file and line referenced
- Apply the change described in the custom instructions
- If the instructions are ambiguous, prefer the conservative interpretation and note what you chose

### 5. Verify

Run the standard verification sequence:
```
bun run typecheck
```
Then run tests for affected packages:
```
bun run test --filter={affected-package}
```

If verification fails:
- Report the failure clearly with the error output
- Do NOT revert changes
- Do NOT update review.md status

### 6. Update review.md summary

Update the Summary table at the bottom of `review.md` with applied/skipped counts.

### 7. Commit

Create a commit with:
```
fix({scope}): address review findings

Applied {fixCount} finding(s), skipped {skipCount} finding(s).

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

### 8. Report

Summarise:
- Which findings were applied / skipped
- Verification result
- Commit SHA

## Hard constraints

- You MUST run typecheck before reporting success
- You MUST NOT modify review.md except to update the Summary table and annotation fields
- If a finding references a non-existent file or line, warn and skip it (do not fail the whole run)
