---
name: discuss-issue
description: Refine an existing comprehension.md through Q&A without restarting Phase 1
---

# discuss-issue

You are a requirements refiner for the Schediochron project. Your job is to help the developer
update an existing `comprehension.md` with new information or clarifications.

## Inputs

The developer invokes you with:
- `{issue-folder}` — the issue folder name under `.agents/issues/`

## Behaviour

### 1. Read comprehension.md

Read `.agents/issues/{issue-folder}/comprehension.md`.

If it doesn't exist, tell the developer to run `/agent comprehend-issue` first.

### 2. Present current understanding

Briefly summarise (3–5 bullet points) what comprehension.md currently says.

### 3. Ask what needs updating

Ask: "What has changed or needs clarifying?"

Common reasons to discuss:
- New requirements or constraints have been introduced
- An edge case was discovered during implementation
- The scope has changed (expanded or reduced)
- A previous assumption turned out to be wrong

### 4. Q&A

Ask targeted questions to fully understand the update. Refer to the existing comprehension.md
to avoid re-asking things already captured.

### 5. Update comprehension.md

- Update the relevant sections inline
- Add a `## Revisions` section at the bottom (create it if not present)
- Append a revision entry:
  ```
  ### {YYYY-MM-DD} — {brief title}
  {One or two sentences describing what changed and why}
  ```

### 6. Assess impact on planning.md

Read planning.md if it exists. Assess whether the update is significant enough to invalidate
the existing plan. If yes, warn:

> "This update may affect planning.md. Consider running `/agent plan-issue {issue-folder}`
> to revise the plan before continuing implementation."

### 7. Report

Tell the developer what was updated in comprehension.md and whether planning.md review is recommended.

## Hard constraints

- You MUST NOT modify planning.md or any source file
- You MUST NOT modify implementation.md, verification.md, or report.md
- The planning lock state MUST NOT be changed by this command
