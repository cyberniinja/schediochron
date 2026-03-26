---
name: implement-issue
description: Phase 3 — Deactivate the planning lock, execute the implementation plan step by step, write code, and commit.
argument-hint: '[issue-folder-name]'
---

# Implement Issue (Phase 3)

<role>
You are a Software Engineer. Your job is to execute the implementation plan exactly as designed.
You write quality code, make focused commits, and track progress against the plan.
</role>

<constraints>
- NEVER skip steps from planning.md — if a step cannot be done as planned, stop and consult the developer
- NEVER make unplanned architectural changes — follow the plan or ask first
- NEVER commit without the co-author trailer
</constraints>

## Input

The issue folder name (e.g. `42-add-dark-mode-toggle`).

If not provided, check `.agents/.planning-active` to find the current issue.

If an explicit argument was provided but no matching folder exists under `.agents/issues/`, tell
the developer: "No folder found matching '{arg}'. Available issue folders:" — list the output of
`ls .agents/issues/` — and ask which to use. Wait for confirmation before proceeding.

## Pre-flight Check

Load context:

```bash
cat .agents/.planning-active 2>/dev/null
```

Read:

- `.agents/issues/{issue-folder}/comprehension.md` — requirements reference
- `.agents/issues/{issue-folder}/planning.md` — the plan to execute

Confirm all required planning artifacts exist before proceeding.

## Process

### Step 1: Deactivate the Planning Lock

```bash
rm -f .agents/.planning-active
rm -f .agents/.planning-block-count
```

The planning lock is now off. Source file editing is permitted.

### Step 2: Execute the Plan

Work through each step in `planning.md` in order:

- Respect step dependencies — do not start a step until its prerequisites are complete
- Write functional components with TypeScript strict typing
- Use SCSS modules for styles
- No `console.error` or `console.warn` in production code
- Follow conventions in `AGENTS.md` (Agent Development Reference) and `.agents/codebase.md`
- If a step cannot be completed as planned, stop and consult the developer

### Step 3: Implement Tests

Write tests as planned in Phase 2:

- Unit/integration tests: `**/*.spec.ts(x)` or `**/*.test.ts(x)` using Vitest + Testing Library
- E2E tests: `apps/schediochron-e2e/src/**/*.spec.ts` using Playwright

### Step 4: Commit Logical Units

After each meaningful step, commit:

```bash
git add {files}
git commit -m "{type}(#{issueNr}): {description}

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

Commit type mapping:

- `feature` label → `feat`
- `bug` label → `fix`
- `chore` label → `chore`
- `refactoring` label → `refactor`

### Step 5: Save Implementation Log

Use `.agents/templates/implementation.md` as a template. Save the completed log to:
`.agents/issues/{issue-folder}/implementation.md`

The log should contain:

- Each step completed, with notes on any deviations from the plan
- All commits made during implementation
- Any issues encountered and how they were resolved

## Checklist

- [ ] Planning lock deactivated (`rm .agents/.planning-active`)
- [ ] All implementation steps from `planning.md` completed in order
- [ ] Code follows project conventions from `AGENTS.md` (Agent Development Reference)
- [ ] Tests implemented as planned in Phase 2
- [ ] Commits made with clear messages and co-author trailer
- [ ] `implementation.md` saved in the issue folder using the template
- [ ] **Stopped here** — do not proceed to Phase 4 without explicit developer instruction

## Completion

After saving `implementation.md`, tell the developer:

```
Phase 3 complete ✓

Planning lock deactivated.
Implementation log: .agents/issues/{issue-folder}/implementation.md

When ready, start Phase 4:
  verify-issue {issue-folder}
```
