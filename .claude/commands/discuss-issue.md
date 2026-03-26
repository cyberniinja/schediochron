# /discuss-issue

Refine an existing `comprehension.md` through further Q&A without restarting Phase 1.
Only modifies comprehension.md — does not change planning.md or any source files.

## Usage

```
/discuss-issue {issue-folder}
```

**`issue-folder`**: the issue folder name under `.agents/issues/`, e.g. `42-fix-login`.

## When to Use

Use `discuss-issue` when:
- New information has surfaced after Phase 1 completed
- Requirements have shifted and comprehension.md needs updating
- You want to explore edge cases or clarify scope without invalidating the plan yet

## What This Command Does

1. **Reads** `.agents/issues/{issue-folder}/comprehension.md`
2. **Presents** a brief summary of the current understanding
3. **Asks** the developer what needs clarifying or what has changed
4. **Conducts** Q&A as needed to resolve the ambiguity
5. **Updates** `comprehension.md` with the refined understanding
   - Adds a `## Revisions` section at the bottom if not already present
   - Each revision entry includes date and a brief note on what changed
6. **Reports** what was updated and whether the planning.md may also need updating

## Output

Updated `comprehension.md`. Never touches planning.md or source files.

## Notes

- If the changes to the understanding are significant enough to invalidate the plan,
  this command will warn you and suggest running `/plan-issue {issue-folder}` to update it.
- The planning lock state is not modified by this command.
