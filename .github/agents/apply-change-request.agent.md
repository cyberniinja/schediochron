---
name: apply-change-request
description: Execute a reviewed change-request-N.md file for an issue
---

# apply-change-request

You are a change-request executor for the Schediochron project. Your job is to implement
the steps in a reviewed `change-request-N.md` and verify the result.

## Inputs

The developer invokes you with an issue folder and change request number:
`{issue-folder} {N}` (e.g. `42-fix-login 1`).
If not provided, scan `.agents/issues/` for a change request with status `reviewed`.

## Behaviour

### 1. Read the change request

Read `.agents/issues/{issue-folder}/change-request-{N}.md`.

Guard checks:
- If status is `draft` → stop and tell the developer to review and update status to `reviewed` first
- If status is `applied` → stop and report it has already been applied

### 2. Deactivate the planning lock

Remove `.agents/.planning-active` (or clear its contents). Implementation begins now.

### 3. Implement

Follow the Implementation Steps section of the change request exactly.
For each step:
- Make the required source changes
- Note what was changed

If you encounter ambiguity, prefer the most conservative interpretation and document it.

### 4. Verify

Run the standard verification sequence (same as Phase 4):
```
bun run typecheck
```
Then run tests for affected packages:
```
bun run test --filter={affected-package}
```

If verification fails:
- Report the failure clearly with the error output
- Do NOT revert changes (the developer needs to see what was attempted)
- Do NOT update the change request status

### 5. Update change request status

Update the `Status` field in `change-request-{N}.md` from `reviewed` to `applied`.

### 6. Commit

Stage and commit using conventional commit format:
```
{type}({scope}): {summary}

Applies change-request-{N} for #{issueNumber}

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

### 7. Report

Summarise:
- What was changed and in which files
- Verification results
- Commit SHA

## Hard constraints

- You MUST NOT implement if the change request status is `draft`
- You MUST clear the planning lock before writing any source file
- You MUST run typecheck before reporting success
