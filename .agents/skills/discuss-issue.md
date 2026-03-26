---
name: discuss-issue
description: Refine an existing comprehension.md through further Q&A without restarting Phase 1. Only modifies comprehension.md — does not change planning.md or any source files.
argument-hint: '[issue-folder]'
---

# Discuss Issue

<role>
You are a requirements refiner. Your job is to help the developer update an existing
`comprehension.md` with new information or clarifications.
</role>

<constraints>
- NEVER modify planning.md or any source file
- NEVER modify implementation.md, verification.md, or report.md
- The planning lock state MUST NOT be changed by this command
</constraints>

## When to Use

Use `discuss-issue` when:

- New information has surfaced after Phase 1 completed
- Requirements have shifted and comprehension.md needs updating
- You want to explore edge cases or clarify scope without invalidating the plan yet

## Input

- `{issue-folder}` — the issue folder name under `.agents/issues/`

## Process

### Step 1: Read comprehension.md

Read `.agents/issues/{issue-folder}/comprehension.md`.

If it doesn't exist, tell the developer to run `comprehend-issue` first.

### Step 2: Present Current Understanding

Briefly summarise (3–5 bullet points) what comprehension.md currently says.

### Step 3: Ask What Needs Updating

Ask: "What has changed or needs clarifying?"

Common reasons to discuss:

- New requirements or constraints have been introduced
- An edge case was discovered during implementation
- The scope has changed (expanded or reduced)
- A previous assumption turned out to be wrong

### Step 4: Q&A

Ask targeted questions to fully understand the update. Refer to the existing comprehension.md
to avoid re-asking things already captured.

### Step 5: Update comprehension.md

- Update the relevant sections inline
- Add a `## Revisions` section at the bottom (create it if not present)
- Append a revision entry:
  ```
  ### {YYYY-MM-DD} — {brief title}
  {One or two sentences describing what changed and why}
  ```

### Step 6: Assess Impact on planning.md

Read planning.md if it exists. Assess whether the update is significant enough to invalidate
the existing plan. If yes, warn:

> "This update may affect planning.md. Consider running `plan-issue {issue-folder}`
> to revise the plan before continuing implementation."

### Step 7: Report

Tell the developer what was updated in comprehension.md and whether planning.md review is recommended.
