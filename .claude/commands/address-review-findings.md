# /address-review-findings

Apply developer-annotated findings from a `review.md` file.
The developer annotates each finding with `[FIX]`, `[SKIP]`, or `[MANUAL: instructions]`
before running this command.

## Usage

```
/address-review-findings {issue-folder}
```

**`issue-folder`**: the issue folder name under `.agents/issues/`, e.g. `42-fix-login`.

## Annotation Format

The developer edits `review.md` and adds ONE annotation per finding:

| Annotation | Meaning |
|------------|---------|
| `[FIX]` | Apply the suggested fix exactly as written |
| `[SKIP]` | Ignore this finding (intentional or not applicable) |
| `[MANUAL: {instructions}]` | Apply with the provided custom instructions instead |

Findings with no annotation are treated as `[SKIP]` with a warning.

## What This Command Does

1. **Reads** `.agents/issues/{issue-folder}/review.md`
2. **Validates** that all findings have an annotation (warns on missing ones)
3. **For each `[FIX]` finding**: applies the suggested fix
4. **For each `[MANUAL: ...]` finding**: applies the fix using the custom instructions
5. **For each `[SKIP]` finding**: logs it as skipped
6. **Verifies** all changes with `bun run typecheck` and affected test suites
7. **Updates** the review.md summary table with applied/skipped counts
8. **Commits** addressed findings with:
   ```
   fix({scope}): address review findings for #{issueNumber}
   ```

## Guards

- Refuses to run if no `[FIX]` or `[MANUAL]` annotations are present (nothing to do)
- If verification fails, reports clearly without reverting (developer must resolve manually)

## Output

Source files updated. `review.md` summary updated. Commit created for addressed findings.
