# /quick-implement

Fast path for small, well-understood tasks (1–5 files). Skips the full 5-phase workflow.
Uses a brief planning note and a mini planning lock for consistency, then implements.

## Usage

```
/quick-implement {issue-folder} "{brief description}"
```

**`issue-folder`**: can be an existing folder under `.agents/issues/` or a new name (e.g. `99-fix-typo`).
**`brief description`**: one sentence describing what to implement. Can be omitted and provided interactively.

## When to Use

Use `quick-implement` when:
- The task touches 1–5 files
- The change is clear and well-understood (no research needed)
- You don't want to go through the full comprehension → planning → implementation flow

Use the full 5-phase workflow instead when:
- The task is ambiguous or requires investigation
- More than ~5 files are affected
- The task has architectural implications

## What This Command Does

1. **Asks** the developer for a brief description if not provided
2. **Creates** (or opens) `.agents/issues/{issue-folder}/`
3. **Writes** a brief `planning.md` with: description, affected files, implementation steps
4. **Activates** the planning lock (`change-request` → brief)
5. **Asks** the developer to confirm the plan before proceeding
6. **On confirmation**: clears the planning lock and implements the changes
7. **Verifies** with `bun run typecheck` and affected tests
8. **Commits** using conventional commit format:
   ```
   {type}({scope}): {summary}
   
   Quick implementation for #{issueNumber}
   ```
9. **Reports** what was changed and verification results

## Output

Source files changed. `planning.md` and brief `implementation.md` written to issue folder. Commit created.
