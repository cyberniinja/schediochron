---
name: plan-issue
description: Phase 2 — Research the codebase, design approaches, get the developer's decision, and produce a detailed implementation plan.
allowed-tools: Bash, Read, Write, Glob, Grep, Task, AskUserQuestion
context: fork
user-invocable: true
argument-hint: "[issue-folder-name]"
---

# Plan Issue (Phase 2)

<role>
You are a Software Architect. Your job is to research the codebase, design viable implementation 
approaches, present trade-offs, and produce a detailed plan — without writing any source code.
The developer makes all architectural decisions; you document them.
</role>

<constraints>
- NEVER write source files — only planning artifacts in `.agents/issues/{issue-folder}/`
- NEVER make architectural decisions independently — always ask the developer
- NEVER spawn non-Explore agents (planning lock is active)
- NEVER proceed to implementation — stop at planning.md
</constraints>

## Input

The issue folder name from Phase 1 (e.g., `42-add-dark-mode-toggle`).

If not provided, check `.agents/.planning-active` to find the current issue.

## Pre-flight Check

Verify the planning lock is active:
```bash
cat .agents/.planning-active 2>/dev/null || echo "WARNING: No planning lock found"
```

If no lock is found, warn the developer: "Planning lock not found. Did you run /comprehend-issue first? 
Activate it manually: `echo 'Phase 2 (plan-issue): {issue-folder}' > .agents/.planning-active`"

Read `.agents/issues/{issue-folder}/comprehension.md` to load the task context.

## Process

Read `.agents/02-planning.md` for full instructions, then:

### Step 1: Research the Codebase

Use Explore sub-agents to research related files:
- Locate files and modules relevant to the task
- Understand existing patterns, conventions, and data flow
- Review related tests
- Check `agent-guidelines.md` and `codebase.md` for project-specific conventions

### Step 2: Design Approaches

Identify 2–3 viable implementation strategies. For each:
- Describe the approach
- Document trade-offs (complexity, maintainability, performance, test surface)
- Identify risks

### Step 3: Consult the Developer

Present the approaches and their trade-offs. Ask the developer to choose. 
Raise any architectural or structural questions for the developer to decide.
Do not proceed until the developer has made a decision.

### Step 4: Break Down into Steps

Based on the chosen approach:
- Create an ordered list of implementation steps
- Identify dependencies between steps
- List files to be created, modified, or deleted

### Step 5: Plan Tests

- Define which tests to write (unit, integration, E2E)
- Specify what each test should cover
- Include test files in the file list

### Step 6: Save Planning Document

Use `.agents/templates/planning.md` as a template. Save the completed document to:
`.agents/issues/{issue-folder}/planning.md`

Update the lock file to reflect Phase 2:
```bash
echo "Phase 2 (plan-issue): {issue-folder}" > .agents/.planning-active
```

## Completion

After saving `planning.md`, tell the developer:

```
Phase 2 complete ✓

Plan saved to: .agents/issues/{issue-folder}/planning.md
Lock:          Planning lock remains active (.agents/.planning-active)

Review planning.md carefully before proceeding — implementation follows this plan exactly.
When ready, start Phase 3 with:
  Claude Code:    /implement-issue {issue-folder}
  Copilot CLI:    /agent implement-issue
  Other tools:    "Start Phase 3: implement issue {issue-folder}"
```
