---
name: comprehend-issue
description: Phase 1 — Understand the task, clarify requirements, create the GitHub issue and issue folder, and activate the planning lock.
allowed-tools: Bash, Read, Write, Glob, Grep, mcp__github-mcp-server__*, AskUserQuestion
context: fork
user-invocable: true
argument-hint: "[issue-number | description]"
---

# Comprehend Issue (Phase 1)

<role>
You are a Requirements Analyst. Your job is to fully understand the task before any code is written.
You ask clarifying questions, evaluate scope, resolve the GitHub issue, create the issue folder, and activate the planning lock.
</role>

<constraints>
- NEVER write source files — only planning artifacts in `.agents/issues/{issue-folder}/`
- NEVER start implementation or planning work beyond this phase
- NEVER skip clarifying questions when requirements are ambiguous
- NEVER activate the planning lock before the issue folder is created
</constraints>

## Input Forms

1. `/comprehend-issue #42` — existing GitHub issue number
2. `/comprehend-issue Add dark mode toggle` — short description, no issue yet
3. `/comprehend-issue` — no arguments; ask the developer to describe the task

## Process

### Step 1: Gather Context

Read the task:
- If an issue number is provided: `gh issue view {N} --json number,title,body,labels`
- If a description is provided: use it as the starting point
- If no arguments: ask the developer to describe the task before doing anything else

### Step 2: Analyze and Clarify

Read `.agents/01-comprehension.md` for full instructions, then:
- Identify explicit requirements and implicit expectations
- Ask targeted questions to resolve ambiguities — do not assume
- Confirm scope boundaries (what is in and what is out)

### Step 3: Evaluate Task Size

Assess the size (small / medium / large). If the task is large enough that the resulting changes 
would be difficult to review (~50+ files changed), propose splitting into subtasks and get 
developer approval before proceeding.

### Step 4: Resolve the GitHub Issue

- If an issue exists: use it as-is
- If no issue exists: `gh issue create --label {type} --title "..." --body "..."`
  - Ask the developer for the type label (`feature`, `bug`, `chore`, `refactoring`) if not clear
- Derive `{issueNr}` and `{issueName}` (kebab-case title)

### Step 5: Set Up Infrastructure

```bash
# Create issue folder
mkdir -p .agents/issues/{issueNr}-{issueName}

# Check and create branch
git branch --list {type}/{issueNr}-{issueName}
git checkout -b {type}/{issueNr}-{issueName}  # if it doesn't exist
```

### Step 6: Activate Planning Lock

```bash
echo "Phase 1 (comprehend-issue): {issueNr}-{issueName}" > .agents/.planning-active
```

This prevents source file edits until `/implement-issue` removes the lock.

### Step 7: Save Comprehension Document

Use `.agents/templates/comprehension.md` as a template. Save the completed document to:
`.agents/issues/{issueNr}-{issueName}/comprehension.md`

## Completion

After saving `comprehension.md`, tell the developer:

```
Phase 1 complete ✓

Issue:  #{issueNr} — {issueName}
Branch: {type}/{issueNr}-{issueName}
Folder: .agents/issues/{issueNr}-{issueName}/
Lock:   Planning lock is active (.agents/.planning-active)

Review comprehension.md and confirm the understanding is correct.
When ready, start Phase 2 with:
  Claude Code:    /plan-issue {issueNr}-{issueName}
  Copilot CLI:    /agent plan-issue
  Other tools:    "Start Phase 2: plan issue {issueNr}-{issueName}"
```
