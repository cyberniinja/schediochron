---
name: work-issue
description: Entry point for the 5-phase development workflow. Accepts an issue number, a short description, or no arguments. Runs Phase 1 (Comprehension) and guides the developer through the remaining phases.
argument-hint: '[issue-number | description]'
---

# Work Issue (Workflow Entry Point)

<role>
You are the entry point for the Schediochron 5-phase development workflow. Your job is to run
Phase 1 (Comprehension) and then guide the developer through the remaining phases — each of
which the developer initiates explicitly.
</role>

This is a **phase-gated workflow**: you do not advance phases automatically. The developer
controls when each phase begins by explicitly invoking the next phase skill.

## Workflow Overview

```
Phase 1 — Comprehension   comprehend-issue   planning lock ON
Phase 2 — Planning        plan-issue         planning lock ON
Phase 3 — Implementation  implement-issue    planning lock OFF
Phase 4 — Verification    verify-issue
Phase 5 — Reporting       report-issue
```

## Entry Point

Determine the input form and act accordingly:

1. **`work-issue #42`** — an existing GitHub issue number is provided
   - Fetch the issue: `gh issue view 42 --json number,title,body,labels`
   - Derive the task type from the issue label (`feature`, `bug`, `chore`, `refactoring`)
   - If no type label exists, ask the developer to classify it

2. **`work-issue <description>`** — a short description was provided, no issue yet
   - Use the description as a starting point for Phase 1
   - Do **not** create a GitHub issue yet — complete comprehension first

3. **`work-issue`** — no arguments
   - Ask the developer to describe the task before doing anything else

## Phase 1 — Comprehension

Follow the `comprehend-issue` skill exactly. Key steps:

1. **Gather context** from the issue, description, or developer input
2. **Analyze and clarify** — ask targeted questions; do not assume
3. **Evaluate task size** — propose subtask split if ~50+ files would be affected
4. **Resolve the GitHub issue** — fetch or create with `gh issue create --label {type}`
5. **Create the issue folder**: `.agents/issues/{issueNr}-{issueName}/`
6. **Create the branch**: `{type}/{issueNr}-{issueName}`
7. **Activate the planning lock**:
   ```bash
   echo "Phase 1 (comprehend-issue): {issueNr}-{issueName}" > .agents/.planning-active
   ```
8. **Save `comprehension.md`** using `.agents/templates/comprehension.md` as a template

### Planning Lock

The planning lock (`.agents/.planning-active`) prevents source file edits during Phases 1 and 2:

- Enforced by skill instructions — do not write or edit source files while the lock is active
- Cleared automatically when Phase 3 (`implement-issue`) begins
- To manually clear a stale lock: run the `unlock` skill

**Do not modify source files in this phase.** Only write to `.agents/issues/{issueNr}-{issueName}/`.

## Key Rules

- **Always ask before assuming** — unclear requirements must be resolved in Phase 1
- **No direct pushes to `main`** — all changes go through a pull request
- **Do not skip verification** — a failing build or test suite must be fixed before reporting
- **Branch naming**: `{type}/{issueNr}-{issueName}` (e.g. `feature/42-add-profile-component`)
- **Commit format**: `{type}(#{issueNr}): description` (e.g. `feat(#42): add profile component`)
- **Type mapping**: `feature` → `feat`, `bug` → `fix`, `chore` → `chore`, `refactoring` → `refactor`

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

**Stop here.** Do not proceed to Phase 2 — wait for the developer to initiate it.
