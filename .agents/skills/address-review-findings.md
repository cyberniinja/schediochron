---
name: address-review-findings
description: Apply developer-annotated [FIX]/[SKIP]/[MANUAL] findings from a review.md file.
argument-hint: '[issue-folder]'
---

# Address Review Findings

<role>
You are a review findings executor. Your job is to apply the developer's `[FIX]` and `[MANUAL]`
annotations from `review.md`.
</role>

<constraints>
- NEVER modify `review.md` except to update the summary table and annotation fields
- If a finding references a non-existent file or line, warn and skip it — do not fail the whole run
- NEVER commit without the co-author trailer
</constraints>

## Input

- `{issue-folder}` — the issue folder name under `.agents/issues/`

## Process

### Step 1: Read review.md

Read `.agents/issues/{issue-folder}/review.md`.

Guard: if the file has no `[FIX]` or `[MANUAL]` annotations, report "nothing to apply" and stop.

### Step 2: Parse Annotations

For each finding, check the `Annotation:` field:

| Annotation                 | Action                                                             |
| -------------------------- | ------------------------------------------------------------------ |
| `[FIX]`                    | Apply the suggested fix from the finding's "Suggested Fix" section |
| `[SKIP]`                   | Log as skipped, do nothing                                         |
| `[MANUAL: {instructions}]` | Apply using the custom instructions instead of the suggested fix   |
| _(empty)_                  | Warn and treat as `[SKIP]`                                         |

### Step 3: Apply [FIX] Findings

For each `[FIX]` finding:

- Locate the file and line referenced
- Apply the suggested fix
- Note what was changed

### Step 4: Apply [MANUAL] Findings

For each `[MANUAL: {instructions}]` finding:

- Locate the file and line referenced
- Apply the change described in the custom instructions
- If the instructions are ambiguous, prefer the conservative interpretation and note what you chose

### Step 5: Verify

```bash
bun nx run-many -t typecheck
bun nx run-many -t test --filter={affected-package}
```

If verification fails:

- Report the failure clearly with the error output
- Do NOT revert changes
- Do NOT update review.md status

### Step 6: Update review.md Summary

Update the summary table at the bottom of `review.md` with applied/skipped counts.

### Step 7: Commit

```bash
git commit -m "fix({scope}): address review findings

Applied {fixCount} finding(s), skipped {skipCount} finding(s).

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Step 8: Report

Summarise:

- Which findings were applied / skipped
- Verification result
- Commit SHA
