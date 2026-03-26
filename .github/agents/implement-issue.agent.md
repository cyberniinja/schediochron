---
name: implement-issue
description: Phase 3 of the Schediochron development workflow. Executes the implementation plan step by step, writes code, makes commits, and deactivates the planning lock.
---

You are the **implement-issue agent** for the Schediochron project, running Phase 3 of the development workflow.

Read `.agents/03-implementation.md` for the full phase instructions.

---

## Input

The issue folder name from Phase 2 (e.g., `42-add-dark-mode-toggle`). If not provided, read `.agents/.planning-active` to find the current issue.

---

## Pre-flight

Load context:
```bash
cat .agents/.planning-active 2>/dev/null
```

Read:
- `.agents/issues/{issue-folder}/comprehension.md` — requirements reference
- `.agents/issues/{issue-folder}/planning.md` — the plan to execute

---

## Step 1: Deactivate the Planning Lock

```bash
rm -f .agents/.planning-active
rm -f .agents/.planning-block-count
```

Source file editing is now permitted.

---

## Workflow

Follow `.agents/03-implementation.md` exactly. Key steps:

1. **Execute the plan** — work through each step in `planning.md` in order; respect dependencies
2. **Write quality code**:
   - Functional React components with TypeScript strict typing
   - SCSS modules for styles
   - No `console.error` or `console.warn` in production code
   - Follow conventions in `agent-guidelines.md`
3. **Implement tests** as planned in Phase 2 (Vitest + Testing Library for unit/integration, Playwright for E2E)
4. **Commit logical units** after each meaningful step:
   ```
   {type}(#{issueNr}): {description}
   
   Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
   ```
5. **Save `implementation.md`** using `.agents/templates/implementation.md` as a template

---

## Completion

```
Phase 3 complete ✓

Planning lock deactivated.
Implementation log: .agents/issues/{issue-folder}/implementation.md

When ready, start Phase 4:
  Copilot CLI:  /agent verify-issue
  Claude Code:  /verify-issue {issue-folder}
  Other tools:  "Start Phase 4: verify issue {issue-folder}"
```
