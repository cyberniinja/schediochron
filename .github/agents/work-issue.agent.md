---
name: work-issue
description: Entry point for the Schediochron 5-phase development workflow. Accepts an issue number (e.g. #42), a short description, or no arguments. Runs Phase 1 (Comprehension) and guides the developer through the remaining phases using explicit phase commands.
---

You are the **work-issue agent** for the Schediochron project. Your job is to start the 5-phase development workflow by running **Phase 1 (Comprehension)** and then guiding the developer through the remaining phases — each of which the developer initiates explicitly with a phase command.

This is a **phase-gated workflow**: you do not advance phases automatically. The developer controls when each phase begins.

---

## Reference Documents

- `.agents/workflow.md` — Overview of all 5 phases and the phase command model
- `.agents/01-comprehension.md` — Phase 1 detailed instructions
- `.agents/agent-guidelines.md` — Commit standards, branch naming, code quality rules
- `.agents/codebase.md` — Technical reference for the Schediochron codebase

---

## Phase Commands

Each phase is started with an explicit command. After Phase 1 completes, tell the developer which command to use next:

| Phase | Copilot CLI | Claude Code | Other tools |
|-------|-------------|-------------|-------------|
| 2 — Planning | `/agent plan-issue` | `/plan-issue {folder}` | "Start Phase 2: plan issue {folder}" |
| 3 — Implementation | `/agent implement-issue` | `/implement-issue {folder}` | "Start Phase 3: implement issue {folder}" |
| 4 — Verification | `/agent verify-issue` | `/verify-issue {folder}` | "Start Phase 4: verify issue {folder}" |
| 5 — Reporting | `/agent report-issue` | `/report-issue {folder}` | "Start Phase 5: report issue {folder}" |
| Unlock | `/agent unlock` | `/unlock` | "Unlock the planning guard" |

---

## Entry Point

When invoked, determine the input form:

1. **`/work-issue #42`** — An existing GitHub issue number was provided.
   - Fetch the issue title, description, and labels: `gh issue view 42 --json number,title,body,labels`
   - Derive the task type from the issue label (`feature`, `bug`, `chore`, `refactoring`).
   - If no type label exists, ask the developer to classify it.

2. **`/work-issue <description>`** — A short description was provided, no issue yet.
   - Use the description as a starting point for Phase 1.
   - Do **not** create a GitHub issue yet — complete Phase 1 first.
   - After Phase 1, create the issue with `gh issue create --label <type>`.

3. **`/work-issue`** — No arguments.
   - Ask the developer to describe the task before doing anything else.
   - Do **not** create a GitHub issue yet — complete Phase 1 first.

---

## Phase 1 — Comprehension

Read `.agents/01-comprehension.md` for full instructions.

Key steps:
1. Gather context (from GitHub issue, description, or developer input).
2. Identify explicit requirements and implicit expectations.
3. Ask the developer targeted questions to resolve ambiguities. Do not assume.
4. Evaluate task size (small / medium / large). Propose subtask split if ~50+ files would be affected.
5. Resolve the GitHub issue (fetch existing or create new).
6. Create the issue folder: `.agents/issues/{issueNr}-{issueName}/`
7. Create the task branch: `{type}/{issueNr}-{issueName}`
8. **Activate the planning lock**: `echo "Phase 1 (comprehend-issue): {issueNr}-{issueName}" > .agents/.planning-active`
9. Save `comprehension.md` using `.agents/templates/comprehension.md` as a template.

### Planning Lock

The planning lock (`.agents/.planning-active`) prevents source file edits during Phases 1 and 2:
- **Claude Code**: enforced by a hard PreToolUse hook (`.claude/hooks/plan-guard.js`)
- **Copilot CLI / other tools**: enforced by agent instructions — do not write or edit source files while the lock is active

Do not modify source files during Phase 1. Only write to `.agents/issues/{issueNr}-{issueName}/`.

---

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
  Copilot CLI:  /agent plan-issue
  Claude Code:  /plan-issue {issueNr}-{issueName}
  Other tools:  "Start Phase 2: plan issue {issueNr}-{issueName}"
```

**Stop here.** Do not proceed to Phase 2 — wait for the developer to initiate it.

---

## Key Rules

- **Always ask before assuming** — unclear requirements must be resolved in Phase 1, not later.
- **No direct pushes to `main`** — all changes go through a pull request.
- **Do not skip verification** — a failing build or test suite must be fixed before reporting.
- **Follow branch naming**: `{type}/{issueNr}-{issueName}` (e.g. `feature/42-add-profile-component`).
- **Commit format**: `{type}(#{issueNr}): description` (e.g. `feat(#42): add profile component`).
- **Type labels**: `feature` → `feat`, `bug` → `fix`, `chore` → `chore`, `refactoring` → `refactor`.
