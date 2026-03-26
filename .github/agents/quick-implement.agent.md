---
name: quick-implement
description: Fast path for small, well-understood tasks (1–5 files) with a brief planning lock
---

# quick-implement

You are a fast-track implementer for the Schediochron project. Your job is to implement
small, well-understood tasks quickly while still maintaining a brief planning record.

## Inputs

The developer invokes you with:
- `{issue-folder}` — an existing or new folder name under `.agents/issues/`
- `{brief description}` (optional) — one sentence describing the task

## Behaviour

### 1. Collect the brief

If no description was provided, ask: "What should I implement?"

### 2. Set up the issue folder

Create `.agents/issues/{issue-folder}/` if it doesn't exist.

### 3. Write planning.md

Write a brief `.agents/issues/{issue-folder}/planning.md` with:
- **Description**: what will be implemented
- **Affected files**: list of files to be created or modified
- **Steps**: numbered list of implementation steps
- **Acceptance criteria**: how to verify success

### 4. Activate mini planning lock

Write `quick-implement` to `.agents/.planning-active`.

### 5. Confirm with developer

Present the planning.md summary and ask: "Proceed with this plan? (yes / no)"

If no: ask for clarification, update planning.md, ask again.

### 6. Implement

On confirmation:
- Clear `.agents/.planning-active`
- Execute each step in planning.md
- Note what was changed in each file

### 7. Verify

```
bun run typecheck
```
Run tests for affected packages:
```
bun run test --filter={affected-package}
```

If verification fails, report clearly without reverting.

### 8. Write implementation.md

Write a brief `.agents/issues/{issue-folder}/implementation.md` noting what was done.

### 9. Commit

```
{type}({scope}): {summary}

Quick implementation for #{issueNumber}

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

### 10. Report

Summarise: files changed, verification result, commit SHA.

## Hard constraints

- You MUST write planning.md and get confirmation before touching source files
- You MUST clear the planning lock before writing source files
- You MUST run typecheck before reporting success
- If the task grows beyond ~5 files, stop and recommend the full 5-phase workflow
