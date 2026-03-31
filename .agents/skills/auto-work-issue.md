---
name: auto-work-issue
description: Autonomous entry point for the 5-phase development workflow. Runs all phases end-to-end without human phase gates. Designed for GitHub Coding Agent assignments and other unattended contexts.
argument-hint: '[issue-number]'
---

# Auto Work Issue (Autonomous Agent Entry Point)

<role>
You are an autonomous software engineer executing the Schediochron 5-phase development workflow
without interactive phase gates. You run all phases sequentially, make reasoned decisions
independently, communicate progress via GitHub issue comments, and open a pull request when done.
This skill is designed for unattended contexts such as GitHub Copilot coding agent assignments.
</role>

<constraints>
- NEVER modify source files during Phases 1 or 2 (planning lock is still respected)
- NEVER skip the comprehension and planning phases — quality requires upfront thinking
- NEVER open a pull request without first passing typecheck, tests, and lint (Phase 4)
- If Phase 4 fails with errors that cannot be resolved, open a draft PR and document the
  blockers clearly in the PR description
</constraints>

## When to Use This Skill

Use this skill when you are running as an autonomous agent — for example, when GitHub assigns
you to an issue — with no human available to confirm phase transitions.

Use `work-issue` instead when a human is present and should confirm each phase gate.

## Autonomous Decision Rules

In interactive mode, several steps require human input. In autonomous mode, apply these rules:

**Ambiguities in requirements**:
- Post your questions as a comment on the GitHub issue:
  `gh issue comment {N} --body "..."`
- Then proceed with documented assumptions — do not block
- Prefix assumptions clearly in `comprehension.md`: "Assumed (no response yet): ..."

**Choosing an implementation approach** (Phase 2):
- Evaluate all proposed approaches against: simplicity, maintainability, test coverage
- Select the approach best aligned with existing codebase patterns
- Document the selection rationale in `planning.md`:
  "Autonomous selection: Approach N chosen because ..."

**Task size / subtask splits**:
- If the task is genuinely too large (50+ files or very large individual changes), split it
  into subtasks: run this skill recursively for each, then open a tracking issue for the parent
- Otherwise proceed as a single task — prefer one cohesive PR over premature splitting

**Label selection** (when creating a new issue):
- Infer the label from the issue content: `feature`, `bug`, `chore`, or `refactoring`

## Step 1: Resolve the Issue

Determine the issue to work on:

1. If an issue number is provided (e.g. `auto-work-issue 42` or assigned via GitHub):
   - Check if a folder starting with `42-` already exists under `.agents/issues/`
     - If yes: detect the current phase from artifacts present and resume from there
     - If no: proceed to Phase 1 with issue number `42`
   - Fetch issue details: `gh issue view {N} --json number,title,body,labels`

2. If invoked without a number (e.g. assigned as a GitHub coding agent):
   - Determine the issue number from the assignment context (issue number in the task/trigger)
   - Fetch it with `gh issue view {N} --json number,title,body,labels`

Post an opening comment on the issue to signal that work has started:

```bash
gh issue comment {N} --body "🤖 **Coding agent started**

I've been assigned to this issue and will work through it autonomously.
I'll post updates here as I progress through each phase.

Starting Phase 1 — Comprehension."
```

## Step 2: Phase 1 — Comprehension

Invoke the `comprehend-issue` skill with the issue number.

**Autonomous adaptations**:
- Skip interactive clarification questions — analyze the issue text deeply instead
- If genuinely ambiguous, post questions to the issue (see Autonomous Decision Rules above),
  then proceed with stated assumptions
- Do not split into subtasks without strong justification; prefer to proceed as one task

After Phase 1 completes, post a comment:

```bash
gh issue comment {N} --body "✅ **Phase 1 complete — Comprehension**

Folder: \`.agents/issues/{issueNr}-{issueName}/\`
Branch: \`{type}/{issueNr}-{issueName}\`

Moving to Phase 2 — Planning."
```

## Step 3: Phase 2 — Planning

Invoke the `plan-issue` skill with the issue folder name.

**Autonomous adaptations**:
- Design 2–3 approaches as normal, then select the best one autonomously (see Autonomous
  Decision Rules above) — do not pause for human selection
- Document the selection rationale clearly in `planning.md`

After Phase 2 completes, post a comment:

```bash
gh issue comment {N} --body "✅ **Phase 2 complete — Planning**

Approach selected: {brief description of chosen approach}

Moving to Phase 3 — Implementation."
```

## Step 4: Phase 3 — Implementation

Invoke the `implement-issue` skill with the issue folder name.

This phase clears the planning lock and writes source code. Follow `implement-issue` exactly.

After Phase 3 completes, post a comment:

```bash
gh issue comment {N} --body "✅ **Phase 3 complete — Implementation**

Commits made on branch \`{type}/{issueNr}-{issueName}\`.

Moving to Phase 4 — Verification."
```

## Step 5: Phase 4 — Verification

Invoke the `verify-issue` skill with the issue folder name.

If verification fails:
- Attempt to fix the failures (up to 3 retry cycles)
- If failures persist after retries, post a comment describing the blockers:
  ```bash
  gh issue comment {N} --body "⚠️ **Phase 4 — Verification issues**

  Some checks could not be resolved automatically. See details in \`.agents/issues/{folder}/verification.md\`.
  Opening a draft PR for human review."
  ```
- Proceed to Phase 5 and open a **draft** PR (see Step 6)

If verification passes, post a comment:

```bash
gh issue comment {N} --body "✅ **Phase 4 complete — Verification passed**

All checks passed. Moving to Phase 5 — Reporting."
```

## Step 6: Phase 5 — Reporting

Invoke the `report-issue` skill with the issue folder name.

If Phase 4 had unresolved failures, instruct `report-issue` to open the PR as a **draft** and
prefix the PR title with `[WIP]`.

After the PR is opened, post a final comment:

```bash
gh issue comment {N} --body "🎉 **Work complete — Pull Request opened**

PR: {pr-url}

All phases finished. The PR is ready for review."
```

## Resuming an In-Progress Workflow

If a folder already exists for the issue, determine the current phase from artifacts present:

| Artifact present                   | Resume at  |
| ---------------------------------- | ---------- |
| `comprehension.md` only            | Phase 2    |
| `comprehension.md` + `planning.md` | Phase 3    |
| `implementation.md` present        | Phase 4    |
| `verification.md` present          | Phase 5    |

Post a comment signalling the resume and which phase you are starting from.
