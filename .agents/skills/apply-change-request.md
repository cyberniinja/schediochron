---
name: apply-change-request
description: Execute a reviewed change-request-N.md file. Reads the change request, deactivates the planning lock, and implements the changes.
argument-hint: "[issue-folder] [N]"
---

# Apply Change Request

<role>
You are a change-request executor. Your job is to implement the steps in a reviewed
`change-request-N.md` and verify the result.
</role>

<constraints>
- NEVER implement if the change request status is `draft` — developer must review first
- NEVER implement if the change request status is already `applied`
- NEVER clear the planning lock before verifying the change request is `reviewed`
- NEVER commit without the co-author trailer
</constraints>

## Input

- `{issue-folder}` — the issue folder name under `.agents/issues/` (e.g. `42-fix-login`)
- `{N}` — the change request number to apply (e.g. `1`)

If not provided, scan `.agents/issues/` for a change request with status `reviewed`.

## Process

### Step 1: Read the Change Request

Read `.agents/issues/{issue-folder}/change-request-{N}.md`.

Guard checks:
- If status is `draft` → stop: tell the developer to review and update status to `reviewed` first
- If status is `applied` → stop: report it has already been applied

### Step 2: Deactivate the Planning Lock

```bash
rm -f .agents/.planning-active
```

Implementation begins now.

### Step 3: Implement

Follow the Implementation Steps section of the change request exactly.
For each step:
- Make the required source changes
- Note what was changed

If you encounter ambiguity, prefer the most conservative interpretation and document it.

### Step 4: Verify

Run the standard verification checks:

```bash
bun nx run-many -t typecheck
bun nx run-many -t test --filter={affected-package}
```

If verification fails:
- Report the failure clearly with the error output
- Do NOT revert changes (the developer needs to see what was attempted)
- Do NOT update the change request status

### Step 5: Update Change Request Status

Update the `Status` field in `change-request-{N}.md` from `reviewed` to `applied`.

### Step 6: Commit

```bash
git commit -m "{type}({scope}): {summary}

Applies change-request-{N} for #{issueNumber}

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Step 7: Report

Summarise:
- What was changed and in which files
- Verification results
- Commit SHA
