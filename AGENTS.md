# Schediochron Agents Documentation

Skills live in `.agents/skills/`. Each skill is a self-contained markdown file that any AI tool
can read and follow — regardless of how you invoke it (slash command, natural language, planning
mode, or agent mode).

## How to Invoke a Skill

Ask your AI tool to run a skill by name or description. Examples:

```
comprehend-issue #42
```

```
run the plan-issue skill for 42-add-dark-mode
```

```
Start Phase 3: implement issue 42-add-dark-mode
```

The AI reads `.agents/skills/{name}.md` and follows the instructions. No wrappers or setup required.

## Tool-Specific Setup (Optional)

If your tool supports dedicated skill or command directories, you can place copies of the skill
files there to enable slash command or skill-panel invocation:

- **Copilot CLI**: copy skills to `.github/agents/` with `.agent.md` extension and YAML frontmatter
- **Claude Code**: copy skills to `.claude/commands/` for `/skill-name` slash commands
- **OpenCode**: place skills where your tool expects slash commands

Both `.github/agents/` and `.claude/` are gitignored — add your own copies locally.

## Planning Lock

Phases 1 and 2 activate a planning lock (`.agents/.planning-active`) that prevents source file edits.
Enforced by skill instructions: **do not write or edit source files while the lock is active**.

- Created by `comprehend-issue` (Phase 1) and updated by `plan-issue` (Phase 2)
- Cleared by `implement-issue` (Phase 3) before any source file is touched
- Manually cleared by running the `unlock` skill

## Skills

### Phase Skills

| Skill | File | Phase | Description |
|-------|------|-------|-------------|
| `work-issue` | [.agents/skills/work-issue.md](.agents/skills/work-issue.md) | Entry point | Start the 5-phase workflow with an issue number, description, or no args |
| `comprehend-issue` | [.agents/skills/comprehend-issue.md](.agents/skills/comprehend-issue.md) | Phase 1 | Understand the task, clarify requirements, activate planning lock |
| `plan-issue` | [.agents/skills/plan-issue.md](.agents/skills/plan-issue.md) | Phase 2 | Design approaches, get developer decision, produce implementation plan |
| `implement-issue` | [.agents/skills/implement-issue.md](.agents/skills/implement-issue.md) | Phase 3 | Deactivate lock, execute the plan, write code, commit |
| `verify-issue` | [.agents/skills/verify-issue.md](.agents/skills/verify-issue.md) | Phase 4 | Run tests, type checks, lint, build — save PASS/FAIL report |
| `report-issue` | [.agents/skills/report-issue.md](.agents/skills/report-issue.md) | Phase 5 | Compile report, open pull request |
| `unlock` | [.agents/skills/unlock.md](.agents/skills/unlock.md) | Utility | Remove a stale planning lock |

### Utility Skills

| Skill | File | Description |
|-------|------|-------------|
| `quick-implement` | [.agents/skills/quick-implement.md](.agents/skills/quick-implement.md) | Fast path for 1–5 file changes with a brief planning note |
| `review-code` | [.agents/skills/review-code.md](.agents/skills/review-code.md) | Review staged/branch/PR changes, produce annotatable `review.md` |
| `request-change` | [.agents/skills/request-change.md](.agents/skills/request-change.md) | Document a targeted change request (planning-lock protected) |
| `apply-change-request` | [.agents/skills/apply-change-request.md](.agents/skills/apply-change-request.md) | Execute a reviewed `change-request-N.md` |
| `address-review-findings` | [.agents/skills/address-review-findings.md](.agents/skills/address-review-findings.md) | Apply `[FIX]`/`[SKIP]`/`[MANUAL]` annotations from `review.md` |
| `discuss-issue` | [.agents/skills/discuss-issue.md](.agents/skills/discuss-issue.md) | Refine `comprehension.md` through Q&A without restarting Phase 1 |
| `analyze-codebase` | [.agents/skills/analyze-codebase.md](.agents/skills/analyze-codebase.md) | Generate codebase analysis with mermaid diagrams |

## Workflow

```
work-issue #42            ← Phase 1 (planning lock ON)
  ↓ developer invokes Phase 2
plan-issue {folder}       ← Phase 2 (planning lock ON)
  ↓ developer invokes Phase 3
implement-issue {folder}  ← Phase 3 (planning lock OFF, source changes permitted)
  ↓ developer invokes Phase 4
verify-issue {folder}     ← Phase 4
  ↓ developer invokes Phase 5
report-issue {folder}     ← Phase 5 → opens PR
```

Each phase is **user-initiated** — the skill completes a phase and tells the developer which
skill to invoke next. The developer controls progression.

## Utility Flows

### Change Request Flow

```
request-change {folder}          ← writes change-request-N.md (lock active)
  ↓  developer reviews + sets status: reviewed
apply-change-request {folder} N  ← implements + verifies + commits (lock cleared)
```

### Review Flow

```
review-code {folder}                  ← produces review.md with findings
  ↓  developer annotates [FIX]/[SKIP]/[MANUAL]
address-review-findings {folder}      ← applies annotations + verifies + commits
```

## Supporting Documentation

| File | Purpose |
|------|---------|
| [.agents/workflow.md](.agents/workflow.md) | Workflow diagrams and phase-gate model |
| [.agents/agent-guidelines.md](.agents/agent-guidelines.md) | Commit standards, branch naming, code quality rules |
| [.agents/codebase.md](.agents/codebase.md) | Technical reference for the Schediochron codebase |
| [.agents/config.json](.agents/config.json) | Machine-readable workspace configuration |

## Templates

Issue folder artifacts use templates from `.agents/templates/`:

| Template | Used by | Output |
|----------|---------|--------|
| `comprehension.md` | `comprehend-issue`, `discuss-issue` | Requirements, assumptions, task size |
| `planning.md` | `plan-issue`, `quick-implement` | Approaches, chosen approach, steps, files, tests |
| `implementation.md` | `implement-issue`, `quick-implement` | Step log, commits, deviations |
| `verification.md` | `verify-issue` | Requirements checklist, quality check results |
| `report.md` | `report-issue` | Summary, commits, PR body |
| `change-request.md` | `request-change` | Change description, affected components, steps, criteria |
| `review-findings.md` | `review-code` | Findings with `[FIX]`/`[SKIP]`/`[MANUAL]` annotation slots |

Codebase analysis output (from `analyze-codebase`) goes to `.agents/analysis/{YYYY-MM-DD}-{topic}.md`.
