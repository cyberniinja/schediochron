# /request-change

Document a targeted change request for an existing issue implementation.
This command is **planning-lock protected** — it writes only to the issue folder.
No source files may be modified while this command runs.

## Usage

```
/request-change {issue-folder}
```

**`issue-folder`**: the issue folder name under `.agents/issues/`, e.g. `42-fix-login`.
Can be omitted if there is exactly one issue folder with a non-applied change request.

## What This Command Does

1. **Reads context** from `.agents/issues/{issue-folder}/` (comprehension.md, planning.md, implementation.md if present)
2. **Asks** the developer to describe what needs to change and why
3. **Determines the next change request number** by counting existing `change-request-*.md` files
4. **Writes** `.agents/issues/{issue-folder}/change-request-{N}.md` using the template
5. **Sets** `.agents/.planning-active` to `change-request` (activates planning lock)
6. **Confirms** to the developer that the change request is ready for review
7. **Instructs** the developer to review the file and then run `/apply-change-request {issue-folder} {N}` when ready

## Planning Lock

The planning lock is **activated** at the start and remains active after this command.
It is only cleared when `/apply-change-request` begins implementation.

## Output

Creates `.agents/issues/{issue-folder}/change-request-{N}.md`.

## Next Step

Review the generated change request, then run:

```
/apply-change-request {issue-folder} {N}
```
