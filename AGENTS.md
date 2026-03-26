# Schediochron Agents Documentation

The `.agents` directory contains comprehensive guidance for handling tasks in the Schediochron project. All agents should follow the 5-phase workflow. Each phase is **user-initiated** — agents complete a phase and tell the developer which command to run next.

## Phase Commands

| Phase | Copilot CLI | Claude Code | Other tools |
|-------|-------------|-------------|-------------|
| 1 — Comprehension | `/agent work-issue` or `/agent comprehend-issue` | `/work-issue` or `/comprehend-issue` | "Start Phase 1: comprehend issue #N" |
| 2 — Planning | `/agent plan-issue` | `/plan-issue {folder}` | "Start Phase 2: plan issue {folder}" |
| 3 — Implementation | `/agent implement-issue` | `/implement-issue {folder}` | "Start Phase 3: implement issue {folder}" |
| 4 — Verification | `/agent verify-issue` | `/verify-issue {folder}` | "Start Phase 4: verify issue {folder}" |
| 5 — Reporting | `/agent report-issue` | `/report-issue {folder}` | "Start Phase 5: report issue {folder}" |
| Unlock | `/agent unlock` | `/unlock` | "Unlock the planning guard" |

## Planning Lock

Phases 1 and 2 activate a planning lock (`.agents/.planning-active`) that prevents source file edits:
- **Claude Code**: hard enforcement via `.claude/hooks/plan-guard.js` (PreToolUse hook)
- **Copilot CLI / other tools**: soft enforcement via agent instructions
- Cleared automatically when Phase 3 starts; manually with `/unlock` or `/agent unlock`

## Phase Documentation

| File | Phase | Purpose |
|------|-------|---------|
| [.agents/01-comprehension.md](.agents/01-comprehension.md) | Phase 1 | Understand the task, clarify requirements, activate planning lock |
| [.agents/02-planning.md](.agents/02-planning.md) | Phase 2 | Design the approach and break down implementation steps |
| [.agents/03-implementation.md](.agents/03-implementation.md) | Phase 3 | Deactivate lock, execute the plan, write code, make commits |
| [.agents/04-verification.md](.agents/04-verification.md) | Phase 4 | Run tests, type checks, and validate results |
| [.agents/05-reporting.md](.agents/05-reporting.md) | Phase 5 | Compile report, open pull request |

## Supporting Documentation

| File | Purpose |
|------|---------|
| [.agents/workflow.md](.agents/workflow.md) | Phase-command model, planning lock, workflow diagrams |
| [.agents/agent-guidelines.md](.agents/agent-guidelines.md) | Commit standards, branch naming, code quality rules |
| [.agents/codebase.md](.agents/codebase.md) | Technical reference for the Schediochron codebase |
| [.agents/config.json](.agents/config.json) | Machine-readable workspace configuration |
| [.agents/index.md](.agents/index.md) | Full documentation index |

## Templates

Issue folder artifacts use templates from `.agents/templates/`:

| Template | Used by | Output |
|----------|---------|--------|
| `comprehension.md` | Phase 1, discuss-issue | Requirements, assumptions, task size |
| `planning.md` | Phase 2, quick-implement | Approaches, chosen approach, steps, files, tests |
| `implementation.md` | Phase 3, quick-implement | Step log, commits, deviations |
| `verification.md` | Phase 4 | Requirements checklist, quality check results |
| `report.md` | Phase 5 | Summary, commits, PR body |
| `change-request.md` | request-change | Change description, affected components, steps, criteria |
| `review-findings.md` | review-code | Findings with `[FIX]`/`[SKIP]`/`[MANUAL]` annotation slots |

Codebase analysis output (from `analyze-codebase`) goes to `.agents/analysis/{YYYY-MM-DD}-{topic}.md`.

## Utility Commands

Utility commands operate outside the phase sequence. They complement the workflow without replacing it.

| Utility | Copilot CLI | Claude Code | Purpose |
|---------|-------------|-------------|---------|
| Request Change | `/agent request-change` | `/request-change {folder}` | Document a targeted change request (planning-lock protected) |
| Apply Change Request | `/agent apply-change-request` | `/apply-change-request {folder} {N}` | Execute a reviewed `change-request-N.md` |
| Review Code | `/agent review-code` | `/review-code {folder} [--staged\|--branch\|--pr]` | Review changes and produce annotatable `review.md` |
| Address Findings | `/agent address-review-findings` | `/address-review-findings {folder}` | Apply `[FIX]`/`[SKIP]`/`[MANUAL]` annotations from `review.md` |
| Quick Implement | `/agent quick-implement` | `/quick-implement {folder} "{description}"` | Fast path for 1–5 file changes (mini planning lock) |
| Discuss Issue | `/agent discuss-issue` | `/discuss-issue {folder}` | Refine `comprehension.md` through Q&A without restarting |
| Analyze Codebase | `/agent analyze-codebase` | `/analyze-codebase {topic} [--area {path}]` | Generate codebase analysis with mermaid diagrams |

### Change Request Flow

```
/request-change {folder}          ← writes change-request-N.md (lock active)
  ↓  developer reviews + sets status: reviewed
/apply-change-request {folder} N  ← implements + verifies + commits (lock cleared)
```

### Review Flow

```
/review-code {folder}                  ← produces review.md with findings
  ↓  developer annotates [FIX]/[SKIP]/[MANUAL]
/address-review-findings {folder}      ← applies annotations + verifies + commits
```

## Copilot CLI Agents

### Phase Agents

| File | Purpose |
|------|---------|
| [.github/agents/work-issue.agent.md](.github/agents/work-issue.agent.md) | **work-issue** — entry point; runs Phase 1 and guides developer through remaining phases |
| [.github/agents/comprehend-issue.agent.md](.github/agents/comprehend-issue.agent.md) | **comprehend-issue** — Phase 1 standalone agent |
| [.github/agents/plan-issue.agent.md](.github/agents/plan-issue.agent.md) | **plan-issue** — Phase 2 standalone agent |
| [.github/agents/implement-issue.agent.md](.github/agents/implement-issue.agent.md) | **implement-issue** — Phase 3 standalone agent |
| [.github/agents/verify-issue.agent.md](.github/agents/verify-issue.agent.md) | **verify-issue** — Phase 4 standalone agent |
| [.github/agents/report-issue.agent.md](.github/agents/report-issue.agent.md) | **report-issue** — Phase 5 standalone agent |
| [.github/agents/unlock.agent.md](.github/agents/unlock.agent.md) | **unlock** — removes stale planning lock |

### Utility Agents

| File | Purpose |
|------|---------|
| [.github/agents/request-change.agent.md](.github/agents/request-change.agent.md) | **request-change** — document a change request (planning-lock protected) |
| [.github/agents/apply-change-request.agent.md](.github/agents/apply-change-request.agent.md) | **apply-change-request** — execute a reviewed change-request-N.md |
| [.github/agents/review-code.agent.md](.github/agents/review-code.agent.md) | **review-code** — vendor-agnostic code review → `review.md` |
| [.github/agents/address-review-findings.agent.md](.github/agents/address-review-findings.agent.md) | **address-review-findings** — apply annotated review findings |
| [.github/agents/quick-implement.agent.md](.github/agents/quick-implement.agent.md) | **quick-implement** — fast path for 1–5 file changes |
| [.github/agents/discuss-issue.agent.md](.github/agents/discuss-issue.agent.md) | **discuss-issue** — refine comprehension.md through Q&A |
| [.github/agents/analyze-codebase.agent.md](.github/agents/analyze-codebase.agent.md) | **analyze-codebase** — codebase analysis with mermaid diagrams |

## Claude Code Commands

Claude Code users can invoke phases and utilities directly with slash commands from `.claude/commands/`:

**Phase commands**: `/comprehend-issue` · `/plan-issue` · `/implement-issue` · `/verify-issue` · `/report-issue` · `/unlock`

**Utility commands**: `/request-change` · `/apply-change-request` · `/review-code` · `/address-review-findings` · `/quick-implement` · `/discuss-issue` · `/analyze-codebase`

The Claude Code setup also includes a hard planning lock via `.claude/hooks/plan-guard.js`.

## Quick Start

1. **Copilot CLI**: `/agent work-issue #42` (or with a description, or no arguments)
2. **Claude Code**: `/work-issue #42`
3. **Other tools**: "Start Phase 1: comprehend issue #42"
4. After each phase, the agent tells you the exact command to continue
5. Progress through phases in order — each one requires your explicit invocation
