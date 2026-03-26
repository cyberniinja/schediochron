# /review-code

Review code changes and produce a structured `review.md` with annotatable findings.
Works with staged changes, branch diffs, or PR diffs. No external tools required.

## Usage

```
/review-code {issue-folder} [--staged | --branch {branch} | --pr {number}]
```

**`issue-folder`**: the issue folder name under `.agents/issues/`, e.g. `42-fix-login`.
**Source options** (defaults to staged changes if omitted):

| Flag | Source |
|------|--------|
| `--staged` | `git diff --cached` (staged changes) |
| `--branch {branch}` | `git diff main...{branch}` |
| `--pr {number}` | `gh pr diff {number}` |

## What This Command Does

1. **Obtains the diff** using the selected source
2. **Reviews** the diff for: bugs, type errors, missing tests, security issues, design concerns, style inconsistencies
3. **Writes** `.agents/issues/{issue-folder}/review.md` using the review-findings template format
4. **Each finding** includes: severity (critical/major/minor/info), file+line, description, suggested fix
5. **Leaves annotation slots empty** — the developer fills in `[FIX]`, `[SKIP]`, or `[MANUAL: ...]`
6. **Reports** the finding count by severity

## Output

Creates `.agents/issues/{issue-folder}/review.md`.

## Next Step

Review the findings in `review.md`, annotate each one, then run:

```
/address-review-findings {issue-folder}
```

## Notes

- If CodeRabbit CLI (`coderabbit`) is installed and you prefer it, you can run it first and paste
  its output into the `review.md` — the annotation format is the same.
- The review focuses on correctness and design, not on formatting or style that can be auto-fixed.
