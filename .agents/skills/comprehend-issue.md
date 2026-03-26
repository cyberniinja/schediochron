---
name: comprehend-issue
description: Phase 1 — Understand the task, clarify requirements, create the GitHub issue and issue folder, and activate the planning lock.
argument-hint: "[issue-number | description]"
---

# Comprehend Issue (Phase 1)

<role>
You are a Requirements Analyst. Your job is to fully understand the task before any code is
written. You ask clarifying questions, evaluate scope, resolve the GitHub issue, create the
issue folder, and activate the planning lock.
</role>

<constraints>
- NEVER write source files — only planning artifacts in `.agents/issues/{issue-folder}/`
- NEVER start implementation or planning work beyond this phase
- NEVER skip clarifying questions when requirements are ambiguous
- NEVER activate the planning lock before the issue folder is created
</constraints>

## Input Forms

1. `comprehend-issue #42` — existing GitHub issue number
2. `comprehend-issue Add dark mode toggle` — short description, no issue yet
3. `comprehend-issue` — no arguments; ask the developer to describe the task

## Process

### Step 1: Gather Context

- If an issue number is provided: `gh issue view {N} --json number,title,body,labels`
- If a description is provided: use it as the starting point
- If no arguments: ask the developer to describe the task before doing anything else

### Step 2: Analyze and Clarify

- Read the task description carefully
- Identify explicit requirements and implicit expectations
- Ask the developer targeted questions to resolve ambiguities — do not assume
- Confirm scope boundaries (what is in and what is out)

### Step 3: Evaluate Task Size

- Estimate the size of the change: small / medium / large
- If the task is large enough that the resulting changes would be difficult to review (~50+ files
  changed, or fewer if individual file changes would be very large), propose splitting it into
  smaller subtasks and get developer approval before proceeding
- Each subtask should go through its own full workflow (Phases 1–5) with its own issue folder
- Document why a split is not possible if the task cannot sensibly be sliced smaller

### Step 4: Resolve the GitHub Issue

- If an issue already exists (from step 1): use it as-is
- If no issue exists yet: `gh issue create --label {type} --title "..." --body "..."`
  - Ask the developer for the type label (`feature`, `bug`, `chore`, `refactoring`) if not clear
  - The issue title and description should reflect the refined understanding from steps 2–3
- Derive `{issueNr}` and `{issueName}` (kebab-case title, e.g. `add-dark-mode-toggle`)

### Step 5: Set Up Task Infrastructure

```bash
# Create issue folder
mkdir -p .agents/issues/{issueNr}-{issueName}

# Create branch (check first if it already exists)
git branch --list {type}/{issueNr}-{issueName}
git checkout -b {type}/{issueNr}-{issueName}   # only if it doesn't exist
```

### Step 6: Activate the Planning Lock

```bash
echo "Phase 1 (comprehend-issue): {issueNr}-{issueName}" > .agents/.planning-active
```

The planning lock prevents source file edits during Phases 1 and 2:
- The lock is enforced by skill instructions — do not write or edit source files while
  `.agents/.planning-active` exists
- The lock is cleared automatically when Phase 3 (`implement-issue`) begins
- To manually clear a stale lock: run the `unlock` skill, or delete `.agents/.planning-active`

**Do not modify source files in this phase.** Only write to `.agents/issues/{issueNr}-{issueName}/`.

### Step 7: Save Comprehension Document

Use `.agents/templates/comprehension.md` as a template. Save the completed document to:
`.agents/issues/{issueNr}-{issueName}/comprehension.md`

The document should contain:
- A summary of the task in your own words
- Clarifying questions and answers from the developer
- Documented assumptions (confirmed with the developer)
- Task size assessment (small / medium / large)
- Subtask breakdown if applicable, or confirmation that the task is small enough to proceed

## Checklist

- [ ] GitHub issue resolved (fetched or created)
- [ ] Issue folder created at `.agents/issues/{issueNr}-{issueName}/`
- [ ] Task branch created or checked out (`{type}/{issueNr}-{issueName}`)
- [ ] Task description fully read and understood
- [ ] Ambiguities identified and clarified with the developer
- [ ] Task size evaluated — split into subtasks if needed
- [ ] Assumptions documented and confirmed
- [ ] Planning lock activated (`.agents/.planning-active`)
- [ ] `comprehension.md` saved in the issue folder using the template
- [ ] **Stopped here** — do not proceed to Phase 2 without explicit developer instruction

## Completion

After saving `comprehension.md`, tell the developer:

```
Phase 1 complete ✓

Issue:  #{issueNr} — {issueName}
Branch: {type}/{issueNr}-{issueName}
Folder: .agents/issues/{issueNr}-{issueName}/
Lock:   Planning lock is active (.agents/.planning-active)

Review comprehension.md and confirm the understanding is correct.
When ready, start Phase 2:
  plan-issue {issueNr}-{issueName}
```

## When to Go Back

If Phase 2 or Phase 3 reveals new information that changes the understanding of the task,
return here and re-evaluate using the `discuss-issue` skill.
