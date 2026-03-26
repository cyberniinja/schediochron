# /apply-change-request

Execute a reviewed `change-request-N.md` file.
This command reads the change request, deactivates the planning lock, and implements the changes.

## Usage

```
/apply-change-request {issue-folder} {N}
```

**`issue-folder`**: the issue folder name under `.agents/issues/`, e.g. `42-fix-login`.
**`N`**: the change request number to apply (e.g. `1`).

## What This Command Does

1. **Reads** `.agents/issues/{issue-folder}/change-request-{N}.md`
2. **Verifies** status is `reviewed` (not `draft` or already `applied`)
3. **Clears** `.agents/.planning-active` (deactivates planning lock)
4. **Implements** each step in the Implementation Steps section
5. **Verifies** the changes with `bun run typecheck` and affected `bun run test` suites
6. **Updates** the change request status to `applied`
7. **Commits** the changes following the conventional commit format:
   ```
   {type}({scope}): {summary} (resolves change-request-{N} for #{issueNumber})
   ```

## Guards

- Refuses to run if change request status is still `draft` — developer must review first
- Refuses to run if change request status is already `applied`
- If verification fails, keeps the planning lock cleared (implementation is in progress) and reports the failure

## Output

Source files changed per the change request. Change request status updated to `applied`. Commit created.
