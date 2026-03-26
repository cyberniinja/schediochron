# Contributing to Schediochron

Thank you for contributing! This guide covers the conventions and standards for working on this project.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed

### Setup

```bash
bun install
bun nx serve schediochron
```

### Secrets

This project uses FontAwesome Pro, which requires an auth token. Secrets are managed with [direnv](https://direnv.net/), which automatically loads per-project environment variables without polluting your shell profile.

1. Install direnv and add the hook to your shell:

   ```bash
   brew install direnv
   echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc  # or ~/.bashrc
   source ~/.zshrc
   ```

2. Copy `.envrc.example` to `.envrc` and fill in your token:

   ```bash
   cp .envrc.example .envrc
   # edit .envrc and add your FontAwesome token
   direnv allow
   ```

3. Copy `bunfig.toml.example` to `bunfig.toml` — it reads the token from the environment:

   ```bash
   cp bunfig.toml.example bunfig.toml
   ```

4. Install dependencies:
   ```bash
   bun install
   ```

## Issues

### Creating Issues

Every task should have a GitHub issue. Issues must include a **type label** (`feature`, `bug`, `chore`, `refactoring`).

#### Feature Request

```markdown
## Description

A clear and concise description of the feature.

## Motivation

Why is this feature needed? What problem does it solve?

## Proposed Solution

How should this feature work?

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Additional Context

Any mockups, screenshots, or references.
```

#### Bug Report

```markdown
## Description

A clear and concise description of the bug.

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. See error

## Expected Behaviour

What should happen.

## Actual Behaviour

What actually happens.

## Environment

- Browser:
- OS:

## Additional Context

Screenshots, error logs, or stack traces.
```

#### Chore / Refactoring

```markdown
## Description

A clear and concise description of the task.

## Motivation

Why is this change needed?

## Scope

What is affected by this change?

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
```

### Issue Labels

| Label         | Usage                              | Colour |
| ------------- | ---------------------------------- | ------ |
| `feature`     | New functionality                  | Green  |
| `bug`         | Bug fixes                          | Red    |
| `chore`       | Maintenance, dependencies, tooling | Yellow |
| `refactoring` | Code restructuring                 | Blue   |

## Branches

### Naming Convention

```
{type}/{issueNr}-{issueName}
```

| Type          | Usage                              | Example                            |
| ------------- | ---------------------------------- | ---------------------------------- |
| `feature`     | New functionality                  | `feature/42-add-profile-component` |
| `bug`         | Bug fixes                          | `bug/17-fix-calendar-rendering`    |
| `chore`       | Maintenance, dependencies, tooling | `chore/88-update-dependencies`     |
| `refactoring` | Code restructuring                 | `refactoring/23-extract-layout`    |

## Commits

### Message Format

```
{type}(#{issueNr}): description
```

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`

Example: `feat(#42): add profile component`

### Co-authored Commits

When working with AI agents, include the trailer:

```
Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

## Versioning

Tags follow monorepo-scoped semantic versioning:

```
schediochron@{major}.{minor}.{patch}
```

- **major** — breaking changes
- **minor** — new features (backward-compatible)
- **patch** — bug fixes, chores, refactoring

Tagging is handled by CI/CD on merges to `main`.

## Code Quality

All contributions must pass before merging:

```bash
bun nx test           # Unit/integration tests
bun nx lint           # Linting
bun nx typecheck      # Type checking
bun prettier --check . # Formatting
```

### Code Standards

- TypeScript strict mode is enforced
- Use functional React components (no class components)
- Use hooks for state and side effects
- Props must be typed with TypeScript interfaces
- Styles in separate SCSS module files
- No `console.error` or `console.warn` in production code

## AI Agents

This project uses a structured **5-phase workflow** for AI-assisted development. Every non-trivial task moves through five explicit phases — Comprehension, Planning, Implementation, Verification, and Reporting — each started by you, the developer. The AI agent completes a phase and then waits for your command to continue.

Detailed agent documentation lives in [`.agents/`](.agents/index.md).

### Quick Start

Pick your tool and run the entry-point command to begin Phase 1 on a task:

**Copilot CLI**

```
/agent work-issue #42
```

**Claude Code**

```
/work-issue #42
```

**Other tools** (opencode, Cursor, etc.)

```
Start Phase 1: comprehend issue #42
```

Replace `#42` with your issue number, or pass a short description, or omit the argument entirely — the agent will ask.

### The 5 Phases

Each phase is explicitly started by you. The agent finishes the phase and tells you the exact command to run next.

| Phase             | Purpose                                | Copilot CLI               | Claude Code                 | Other tools                                 | Deliverable                |
| ----------------- | -------------------------------------- | ------------------------- | --------------------------- | ------------------------------------------- | -------------------------- |
| 1️⃣ Comprehension  | Understand requirements, clarify scope | `/agent comprehend-issue` | `/comprehend-issue`         | `"Start Phase 1: comprehend issue #N"`      | `comprehension.md`         |
| 2️⃣ Planning       | Design approach, break down steps      | `/agent plan-issue`       | `/plan-issue {folder}`      | `"Start Phase 2: plan issue {folder}"`      | `planning.md`              |
| 3️⃣ Implementation | Write code, make commits               | `/agent implement-issue`  | `/implement-issue {folder}` | `"Start Phase 3: implement issue {folder}"` | Code + `implementation.md` |
| 4️⃣ Verification   | Run tests, lint, type-check            | `/agent verify-issue`     | `/verify-issue {folder}`    | `"Start Phase 4: verify issue {folder}"`    | `verification.md`          |
| 5️⃣ Reporting      | Summarise results, open PR             | `/agent report-issue`     | `/report-issue {folder}`    | `"Start Phase 5: report issue {folder}"`    | `report.md` + pull request |

Each task gets its own folder under `.agents/issues/{issueNr}-{issueName}/` where all phase artifacts are saved.

#### Phase details

**1 — Comprehension**: The agent reads the issue (or takes a description), asks clarifying questions, estimates task size, creates a GitHub issue if needed, sets up the task branch, and documents everything in `comprehension.md`. Activates the planning lock.

**2 — Planning**: The agent researches the codebase, proposes implementation approaches, asks you to choose one, then writes a detailed step-by-step plan to `planning.md`. No source files are touched.

**3 — Implementation**: The planning lock is cleared. The agent executes the plan step by step, making focused commits along the way, and saves a log to `implementation.md`.

**4 — Verification**: The agent runs the full quality suite — tests, lint, type-check — and records results in `verification.md` (PASS or FAIL). Any failures are fixed before moving on.

**5 — Reporting**: The agent compiles a summary of all work done, lists commits, and opens a pull request against `main`.

### Planning Lock

During Phases 1 and 2, a **planning lock** (`⁠.agents/.planning-active`) prevents source file edits. This ensures implementation never starts until requirements and approach are fully agreed.

- **Claude Code**: hard enforcement via a PreToolUse hook — source file writes are blocked automatically
- **Copilot CLI / other tools**: soft enforcement via agent instructions

The lock is cleared automatically when Phase 3 starts. If a planning phase was interrupted and the lock is stale, clear it with:

| Tool        | Command                                    |
| ----------- | ------------------------------------------ |
| Copilot CLI | `/agent unlock`                            |
| Claude Code | `/unlock`                                  |
| Other       | Delete `.agents/.planning-active` manually |

### Utility Commands

These commands complement the 5-phase workflow for targeted tasks outside the main sequence.

| Utility              | Copilot CLI                      | Claude Code                                        | Purpose                                                          |
| -------------------- | -------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------- |
| Quick Implement      | `/agent quick-implement`         | `/quick-implement {folder} "{desc}"`               | Fast path for small 1–5 file changes with a mini planning lock   |
| Request Change       | `/agent request-change`          | `/request-change {folder}`                         | Document a targeted change request (planning-lock protected)     |
| Apply Change Request | `/agent apply-change-request`    | `/apply-change-request {folder} {N}`               | Execute a reviewed `change-request-N.md`                         |
| Review Code          | `/agent review-code`             | `/review-code {folder} [--staged\|--branch\|--pr]` | Review changes and produce an annotatable `review.md`            |
| Address Findings     | `/agent address-review-findings` | `/address-review-findings {folder}`                | Apply `[FIX]`/`[SKIP]`/`[MANUAL]` annotations from `review.md`   |
| Discuss Issue        | `/agent discuss-issue`           | `/discuss-issue {folder}`                          | Refine `comprehension.md` through Q&A without restarting Phase 1 |
| Analyze Codebase     | `/agent analyze-codebase`        | `/analyze-codebase {topic}`                        | Generate a codebase analysis document with architecture diagrams |

**Change request flow:**

```
/agent request-change {folder}      ← writes change-request-N.md (lock active)
  ↓  review + annotate
/agent apply-change-request {folder} N  ← implements + verifies + commits
```

**Code review flow:**

```
/agent review-code {folder}              ← produces review.md with findings
  ↓  annotate each finding [FIX]/[SKIP]/[MANUAL]
/agent address-review-findings {folder}  ← applies annotations + verifies + commits
```
