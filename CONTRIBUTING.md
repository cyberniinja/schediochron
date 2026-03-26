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

This project uses a skill-based AI agent workflow for structured development. Skills are
self-contained markdown files in [`.agents/skills/`](.agents/skills/) — each one describes a
phase or utility that any AI tool can read and follow.

### Quick Start

Invoke skills by name in your AI tool's chat or command interface:

```
work-issue #42          ← start the 5-phase workflow with an existing issue
work-issue              ← describe the task interactively
```

### The 5-Phase Workflow

Each phase is **user-initiated** — the skill completes a phase and tells you which to invoke next.

| Phase              | Skill                                  | Deliverable                              |
| ------------------ | -------------------------------------- | ---------------------------------------- |
| 1 — Comprehension  | `comprehend-issue [#N \| description]` | `comprehension.md`, planning lock active |
| 2 — Planning       | `plan-issue {folder}`                  | `planning.md`                            |
| 3 — Implementation | `implement-issue {folder}`             | Code changes, `implementation.md`        |
| 4 — Verification   | `verify-issue {folder}`                | `verification.md` (PASS/FAIL)            |
| 5 — Reporting      | `report-issue {folder}`                | `report.md`, pull request                |

### Planning Lock

Phases 1 and 2 activate a planning lock (`.agents/.planning-active`). While the lock is active,
**no source file edits are permitted** — only issue folder artifacts. Cleared by Phase 3.

To remove a stale lock: run the `unlock` skill.

### Utility Skills

| Skill                                             | Description                                          |
| ------------------------------------------------- | ---------------------------------------------------- |
| `quick-implement {folder} "{desc}"`               | Fast path for 1–5 file tasks                         |
| `review-code {folder} [--staged\|--branch\|--pr]` | Code review → annotatable `review.md`                |
| `request-change {folder}`                         | Document a targeted change (planning-lock protected) |
| `apply-change-request {folder} {N}`               | Execute a reviewed change request                    |
| `address-review-findings {folder}`                | Apply `[FIX]`/`[SKIP]`/`[MANUAL]` annotations        |
| `discuss-issue {folder}`                          | Refine requirements without restarting Phase 1       |
| `analyze-codebase {topic}`                        | Generate codebase analysis with mermaid diagrams     |

### Tool-Specific Setup (Optional)

Skills work via natural language out of the box. For slash command or skill-panel support,
copy skills to your tool's expected directory (both are gitignored):

- **Copilot CLI**: `.github/agents/` with `.agent.md` extension
- **Claude Code**: `.claude/commands/`

See [AGENTS.md](AGENTS.md) for the full skill index and more details.
