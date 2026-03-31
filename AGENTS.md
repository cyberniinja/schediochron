# Schediochron Agents Documentation

Skills live in `.agents/skills/`. Each skill is a self-contained markdown file that any AI tool
can read and follow — regardless of how you invoke it (slash command, natural language, planning
mode, or agent mode).

## GitHub Coding Agent

When you are invoked as a **GitHub Copilot coding agent** (assigned to a GitHub issue), follow
the `auto-work-issue` skill:

```
Read and follow: .agents/skills/auto-work-issue.md
```

This skill runs all 5 phases autonomously — comprehension, planning, implementation,
verification, and reporting — without requiring human confirmation at phase boundaries.
It posts progress updates as GitHub issue comments and opens a pull request when done.

**Summary of what you do when assigned to an issue:**

1. Post a start comment on the issue
2. Run Phase 1 (`comprehend-issue`): understand requirements, create issue folder and branch
3. Run Phase 2 (`plan-issue`): research codebase, design and select an approach
4. Run Phase 3 (`implement-issue`): write code and commit
5. Run Phase 4 (`verify-issue`): run typecheck, tests, lint — fix failures, retry up to 3×
6. Run Phase 5 (`report-issue`): open a pull request

See `.agents/skills/auto-work-issue.md` for the full protocol including autonomous decision
rules and how to handle ambiguous requirements.

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

| Skill              | File                                                                     | Phase       | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------ |
| `auto-work-issue`  | [.agents/skills/auto-work-issue.md](.agents/skills/auto-work-issue.md)   | Entry point | Autonomous 5-phase workflow for GitHub coding agent assignments — no human phase gates |
| `work-issue`       | [.agents/skills/work-issue.md](.agents/skills/work-issue.md)             | Entry point | Orchestrate the full 5-phase workflow; asks to continue at each phase boundary |
| `comprehend-issue` | [.agents/skills/comprehend-issue.md](.agents/skills/comprehend-issue.md) | Phase 1     | Understand the task, clarify requirements, activate planning lock              |
| `plan-issue`       | [.agents/skills/plan-issue.md](.agents/skills/plan-issue.md)             | Phase 2     | Design approaches, get developer decision, produce implementation plan         |
| `implement-issue`  | [.agents/skills/implement-issue.md](.agents/skills/implement-issue.md)   | Phase 3     | Deactivate lock, execute the plan, write code, commit                          |
| `verify-issue`     | [.agents/skills/verify-issue.md](.agents/skills/verify-issue.md)         | Phase 4     | Run tests, type checks, lint, build — save PASS/FAIL report                    |
| `report-issue`     | [.agents/skills/report-issue.md](.agents/skills/report-issue.md)         | Phase 5     | Compile report, open pull request                                              |
| `unlock`           | [.agents/skills/unlock.md](.agents/skills/unlock.md)                     | Utility     | Remove a stale planning lock                                                   |

### Utility Skills

| Skill                     | File                                                                                   | Description                                                       |
| ------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `quick-implement`         | [.agents/skills/quick-implement.md](.agents/skills/quick-implement.md)                 | Fast path for 1–5 file changes with a brief planning note         |
| `review-code`             | [.agents/skills/review-code.md](.agents/skills/review-code.md)                         | Review staged/branch/PR changes, produce annotatable `review.md`  |
| `request-change`          | [.agents/skills/request-change.md](.agents/skills/request-change.md)                   | Document a targeted change request (planning-lock protected)      |
| `apply-change-request`    | [.agents/skills/apply-change-request.md](.agents/skills/apply-change-request.md)       | Execute a reviewed `change-request-N.md`                          |
| `address-review-findings` | [.agents/skills/address-review-findings.md](.agents/skills/address-review-findings.md) | Apply `[FIX]`/`[SKIP]`/`[MANUAL]` annotations from `review.md`    |
| `discuss-issue`           | [.agents/skills/discuss-issue.md](.agents/skills/discuss-issue.md)                     | Refine `comprehension.md` through Q&A without restarting Phase 1  |
| `analyze-codebase`        | [.agents/skills/analyze-codebase.md](.agents/skills/analyze-codebase.md)               | Generate codebase analysis with mermaid diagrams                  |
| `verify-environment`      | [.agents/skills/verify-environment.md](.agents/skills/verify-environment.md)           | Pre-flight check — tools, deps, typecheck baseline, planning lock |

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

| File                                       | Purpose                                           |
| ------------------------------------------ | ------------------------------------------------- |
| [.agents/workflow.md](.agents/workflow.md) | Workflow diagrams and phase-gate model            |
| [.agents/codebase.md](.agents/codebase.md) | Technical reference for the Schediochron codebase |
| [.agents/config.json](.agents/config.json) | Machine-readable workspace configuration          |

## Templates

Issue folder artifacts use templates from `.agents/templates/`:

| Template             | Used by                              | Output                                                     |
| -------------------- | ------------------------------------ | ---------------------------------------------------------- |
| `comprehension.md`   | `comprehend-issue`, `discuss-issue`  | Requirements, assumptions, task size                       |
| `planning.md`        | `plan-issue`, `quick-implement`      | Approaches, chosen approach, steps, files, tests           |
| `implementation.md`  | `implement-issue`, `quick-implement` | Step log, commits, deviations                              |
| `verification.md`    | `verify-issue`                       | Requirements checklist, quality check results              |
| `report.md`          | `report-issue`                       | Summary, commits, PR body                                  |
| `change-request.md`  | `request-change`                     | Change description, affected components, steps, criteria   |
| `review-findings.md` | `review-code`                        | Findings with `[FIX]`/`[SKIP]`/`[MANUAL]` annotation slots |

Codebase analysis output (from `analyze-codebase`) goes to `.agents/analysis/{YYYY-MM-DD}-{topic}.md`.

## Isolated Environments (Codespaces)

The repo includes a `.devcontainer/devcontainer.json` for running agents in isolated, fully-equipped environments via GitHub Codespaces.

### What's pre-configured

- Node 22 + Bun installed
- GitHub CLI (`gh`) authenticated as the Codespace owner — **no manual login needed**
- Git identity pre-wired to your GitHub account
- Playwright Chromium installed for E2E tests
- Port 4200 forwarded for the dev server

### Recommended session start

```
verify-environment
```

Then once healthy:

- **Interactive** (human confirms each phase):
  ```
  work-issue #42
  ```

- **Autonomous** (all phases run automatically, progress posted to issue):
  ```
  auto-work-issue 42
  ```

### Starting a Codespace

```bash
gh codespace create --repo <owner>/schediochron --branch <branch>
gh codespace ssh
```

Or open in the browser via **Code → Codespaces → New codespace** on GitHub.

---

## Agent Development Reference

### Commit & Branch Standards

**Commit format**: `{type}(#{issueNr}): description`

Always include the co-author trailer:

```
Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

**Type mapping**: `feature` → `feat` | `bug` → `fix` | `chore` → `chore` | `refactoring` → `refactor`

**Branch naming**: `{type}/{issueNr}-{issueName}` (e.g. `refactoring/96-replace-agent-files`)

| Type          | Usage                              |
| ------------- | ---------------------------------- |
| `feature`     | New functionality                  |
| `bug`         | Bug fixes                          |
| `chore`       | Maintenance, dependencies, tooling |
| `refactoring` | Code restructuring                 |

### Quality Assurance Commands

```bash
bun nx run-many -t typecheck   # TypeScript type check (all projects)
bun nx run-many -t test        # Unit/integration tests
bun nx run-many -t lint        # ESLint
bun nx run-many -t lint --fix  # Auto-fix lint issues
bunx prettier --write .        # Format all files
bun nx e2e schediochron-e2e    # End-to-end tests (Playwright)
```

### Important Rules

- **TypeScript strict mode** is enforced — always provide proper type annotations
- **No `console.error` or `console.warn`** in production code
- **No direct pushes to `main`** — all changes go through a pull request
- **Never merge a pull request** — merging is a human-only action; always stop after opening the PR and wait for explicit developer instruction
- **Always run typecheck + test + lint** before committing

### Project Structure

```
schediochron/
├── apps/
│   ├── schediochron/          # Main React app (Vite + React + TypeScript)
│   │   └── src/
│   │       ├── components/    # React components
│   │       └── pages/         # Page components
│   └── schediochron-e2e/      # Playwright E2E tests
├── nx.json                    # Nx workspace config
├── package.json               # Root package.json (Bun)
└── tsconfig.base.json         # Shared TypeScript config
```

### Development Commands

```bash
bun install                    # Install dependencies
bun nx serve schediochron      # Dev server (http://localhost:4200)
bun nx build schediochron      # Production build
```

### Testing Patterns

- **Unit/integration**: Vitest — files named `*.spec.ts(x)` or `*.test.ts(x)`; use Testing Library for React components
- **E2E**: Playwright — located in `apps/schediochron-e2e/src/`; test user flows, not implementation details

### When to Ask for Help

- Architectural decisions or scope ambiguity
- Unclear or conflicting requirements
- Dependency version conflicts or unusual error messages
