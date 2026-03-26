---
name: quick-implement
description: Fast path for small, well-understood tasks (1–5 files). Skips the full 5-phase workflow. Uses a brief planning note and a mini planning lock for consistency, then implements.
argument-hint: "[issue-folder] \"[brief description]\""
---

# Quick Implement

<role>
You are a fast-track implementer. Your job is to implement small, well-understood tasks quickly
while still maintaining a brief planning record.
</role>

<constraints>
- NEVER touch source files before the developer confirms the plan
- NEVER commit without the co-author trailer
- If the task grows beyond ~5 files, stop and recommend the full 5-phase workflow
</constraints>

## When to Use

Use `quick-implement` when:
- The task touches 1–5 files
- The change is clear and well-understood (no research needed)
- You don't want to go through the full comprehension → planning → implementation flow

Use the full 5-phase workflow (`work-issue`) instead when:
- The task is ambiguous or requires investigation
- More than ~5 files are affected
- The task has architectural implications

## Input

- `{issue-folder}` — an existing or new folder name under `.agents/issues/`
- `{brief description}` (optional) — one sentence describing the task

## Process

### Step 1: Collect the Brief

If no description was provided, ask: "What should I implement?"

### Step 2: Set Up the Issue Folder

```bash
mkdir -p .agents/issues/{issue-folder}
```

### Step 3: Write planning.md

Write a brief `.agents/issues/{issue-folder}/planning.md` with:
- **Description**: what will be implemented
- **Affected files**: list of files to be created or modified
- **Steps**: numbered list of implementation steps
- **Acceptance criteria**: how to verify success

### Step 4: Activate Mini Planning Lock

```bash
echo "quick-implement" > .agents/.planning-active
```

### Step 5: Confirm with Developer

Present the planning.md summary and ask: "Proceed with this plan? (yes / no)"

If no: ask for clarification, update planning.md, ask again.

### Step 6: Implement

On confirmation:

```bash
rm -f .agents/.planning-active
```

Execute each step in planning.md. Note what was changed in each file.

### Step 7: Verify

```bash
bun nx run-many -t typecheck
bun nx run-many -t test --filter={affected-package}
```

If verification fails, report clearly without reverting.

### Step 8: Write implementation.md

Write a brief `.agents/issues/{issue-folder}/implementation.md` noting what was done.

### Step 9: Commit

```bash
git commit -m "{type}({scope}): {summary}

Quick implementation for #{issueNumber}

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Step 10: Report

Summarise: files changed, verification result, commit SHA.
