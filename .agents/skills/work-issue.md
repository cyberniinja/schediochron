---
name: work-issue
description: Entry point for the 5-phase development workflow. Accepts an issue number, a short description, or no arguments. Resolves the input, then orchestrates the workflow by invoking each phase skill in sequence.
argument-hint: '[issue-number | description]'
---

# Work Issue (Workflow Orchestrator)

<role>
You are the orchestrator of the Schediochron 5-phase development workflow. Your job is to
resolve the developer's input into the right starting point, then drive each phase by invoking
the corresponding skill. You do not implement any phase logic yourself — you delegate to the
phase skills and guide the developer through phase transitions.
</role>

This is a **phase-gated workflow**: after each phase completes, you ask the developer whether
to continue or whether they want to provide additional input or adjustments first. You do not
advance phases automatically.

## Workflow

```
Phase 1 — Comprehension   comprehend-issue   planning lock ON
Phase 2 — Planning        plan-issue         planning lock ON
Phase 3 — Implementation  implement-issue    planning lock OFF
Phase 4 — Verification    verify-issue
Phase 5 — Reporting       report-issue
```

Each phase is fully defined in its own skill file. This skill handles only the entry point and
phase transitions.

## Step 1: Resolve the Input

Determine the input form and act accordingly before invoking any phase skill:

1. **`work-issue #42`** or **`work-issue 42`** — issue number provided
   - Check if a folder starting with `42-` already exists under `.agents/issues/`
     - If yes: offer to continue from that folder (detect current phase, skip to it)
     - If no: proceed with Phase 1 using the issue number as input
   - Pass `42` as the argument to `comprehend-issue`

2. **`work-issue <description>`** — short description provided, no issue number
   - Pass the description as the argument to `comprehend-issue`
   - A GitHub issue will be created during Phase 1

3. **`work-issue`** — no arguments
   - Ask the developer: "What would you like to work on?"
   - Wait for a response, then treat the answer as a description (case 2)

## Step 2: Run Phase 1

Invoke the `comprehend-issue` skill with the resolved input. Follow its instructions exactly —
do not duplicate or summarise its steps here.

After Phase 1 completes, present the phase transition prompt from `comprehend-issue` verbatim,
then ask:

> "Phase 1 is complete. Shall I continue to Phase 2 (Planning), or would you like to review
> or adjust comprehension.md first?"

Wait for the developer's response before proceeding.

## Step 3: Run Phase 2

When the developer confirms, invoke the `plan-issue` skill with the issue folder name.

After Phase 2 completes, present the phase transition prompt from `plan-issue` verbatim,
then ask:

> "Phase 2 is complete. Shall I continue to Phase 3 (Implementation), or would you like to
> review or adjust planning.md first?"

Wait for the developer's response before proceeding.

## Step 4: Run Phase 3

When the developer confirms, invoke the `implement-issue` skill with the issue folder name.

After Phase 3 completes, present the phase transition prompt from `implement-issue` verbatim,
then ask:

> "Phase 3 is complete. Shall I continue to Phase 4 (Verification), or is there anything you
> want to adjust first?"

Wait for the developer's response before proceeding.

## Step 5: Run Phase 4

When the developer confirms, invoke the `verify-issue` skill with the issue folder name.

After Phase 4 completes, present the phase transition prompt from `verify-issue` verbatim,
then ask:

> "Phase 4 is complete. Shall I continue to Phase 5 (Reporting) and open the pull request?"

Wait for the developer's response before proceeding.

## Step 6: Run Phase 5

When the developer confirms, invoke the `report-issue` skill with the issue folder name.

## Phase Transition Rules

- Always present the completing phase's transition prompt verbatim before asking the
  continuation question — do not paraphrase or omit it.
- If the developer wants to provide more input or adjustments, incorporate the feedback,
  update the relevant artifact, then re-ask the continuation question.
- If the developer asks to re-run a phase, invoke that phase's skill again before moving on.

## Resuming an In-Progress Workflow

If a folder already exists for the requested issue, determine the current phase by checking
which artifacts are present:

| Artifact present                   | Resume at |
| ---------------------------------- | --------- |
| `comprehension.md` only            | Phase 2   |
| `comprehension.md` + `planning.md` | Phase 3   |
| `implementation.md` present        | Phase 4   |
| `verification.md` present          | Phase 5   |

Inform the developer of the detected phase and ask whether to resume from there or restart.
