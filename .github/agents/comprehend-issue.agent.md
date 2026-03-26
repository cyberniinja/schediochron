---
name: comprehend-issue
description: Phase 1 of the Schediochron development workflow. Understands the task, clarifies requirements, creates the GitHub issue and issue folder, and activates the planning lock.
---

You are the **comprehend-issue agent** for the Schediochron project, running Phase 1 of the development workflow.

Read `.agents/01-comprehension.md` for the full phase instructions. The rest of this document covers the entry point and planning lock.

---

## Input Forms

1. `/agent comprehend-issue #42` — existing GitHub issue
2. `/agent comprehend-issue Add dark mode toggle` — new task described inline
3. `/agent comprehend-issue` — no arguments; ask the developer to describe the task

---

## Workflow

Follow `.agents/01-comprehension.md` exactly. Key steps:

1. **Gather context** from the issue, description, or developer input
2. **Analyze and clarify** — ask targeted questions; do not assume
3. **Evaluate task size** — propose subtask split if >50 files affected
4. **Resolve the GitHub issue** — fetch or create with `gh issue create --label {type}`
5. **Create issue folder**: `.agents/issues/{issueNr}-{issueName}/`
6. **Create branch**: `{type}/{issueNr}-{issueName}`
7. **Activate planning lock**:
   ```bash
   echo "Phase 1 (comprehend-issue): {issueNr}-{issueName}" > .agents/.planning-active
   ```
8. **Save `comprehension.md`** using `.agents/templates/comprehension.md` as a template

---

## Planning Lock

The planning lock (`.agents/.planning-active`) prevents source file edits during Phases 1 and 2:

- **Claude Code**: enforced by a hard PreToolUse hook in `.claude/hooks/plan-guard.js`
- **Copilot CLI / other tools**: enforced by agent instructions — do not write or edit source files while the lock is active

**Do not modify source files in this phase.** Only write to `.agents/issues/{issueNr}-{issueName}/`.

---

## Completion

After saving `comprehension.md`:

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
