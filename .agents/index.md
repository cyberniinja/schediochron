# Schediochron Agent Workflow Documentation Index

This directory contains comprehensive guidance for handling tasks in the Schediochron project.
All workflow skills live in `.agents/skills/` — self-contained, tool-agnostic markdown files.

## Quick Start

1. Read [AGENTS.md](../AGENTS.md) for the full skill index and invocation guidance
2. Read [workflow.md](workflow.md) to understand the 5-phase model
3. Invoke a skill to start a task: `work-issue #42` (or any description)

## Documentation Structure

| File | Purpose |
|------|---------|
| [../AGENTS.md](../AGENTS.md) | **Central skill index** — all 14 skills with descriptions and links |
| [workflow.md](workflow.md) | Phase-gate model, planning lock, workflow diagrams |
| [agent-guidelines.md](agent-guidelines.md) | Commit standards, branch naming, code quality rules |
| [codebase.md](codebase.md) | Technical reference for the Schediochron codebase |
| [config.json](config.json) | Machine-readable workspace configuration |

## Workflow Overview

```
work-issue / comprehend-issue  ← Phase 1 (planning lock ON)
plan-issue                     ← Phase 2 (planning lock ON)
implement-issue                ← Phase 3 (planning lock OFF)
verify-issue                   ← Phase 4
report-issue                   ← Phase 5 → PR opened
```

Each phase is **user-initiated** — the skill completes a phase and tells the developer which
skill to invoke next.

## File Directory

```
.agents/
├── index.md               This file
├── workflow.md            Phase-gate model and workflow diagrams
├── agent-guidelines.md    Commit standards, branch naming, code quality rules
├── codebase.md            Technical reference
├── config.json            Machine-readable workspace config
├── skills/
│   ├── work-issue.md                Entry point (Phase 1 + coordinator)
│   ├── comprehend-issue.md          Phase 1: understand task, activate planning lock
│   ├── plan-issue.md                Phase 2: design approach, produce plan
│   ├── implement-issue.md           Phase 3: deactivate lock, execute plan
│   ├── verify-issue.md              Phase 4: test & validate
│   ├── report-issue.md              Phase 5: compile report, open PR
│   ├── unlock.md                    Remove stale planning lock
│   ├── quick-implement.md           Fast path for 1–5 file changes
│   ├── review-code.md               Code review → review.md
│   ├── request-change.md            Document a targeted change request
│   ├── apply-change-request.md      Execute a reviewed change-request-N.md
│   ├── address-review-findings.md   Apply [FIX]/[SKIP]/[MANUAL] findings
│   ├── discuss-issue.md             Refine comprehension.md through Q&A
│   └── analyze-codebase.md          Codebase analysis with mermaid diagrams
├── templates/
│   ├── comprehension.md       Phase 1 output template
│   ├── planning.md            Phase 2 output template
│   ├── implementation.md      Phase 3 output template
│   ├── verification.md        Phase 4 output template
│   ├── report.md              Phase 5 output template
│   ├── change-request.md      Change request template
│   └── review-findings.md     Review findings template
├── issues/
│   └── {issueNr}-{issueName}/ Issue work folder (gitignored, created per task)
└── analysis/
    └── {YYYY-MM-DD}-{topic}.md Codebase analysis output (gitignored)
```

## Key Principles

1. **Phase-gated** — one phase at a time, developer controls progression
2. **Planning lock** — no source file edits during Phases 1 and 2
3. **Self-contained skills** — each skill file has everything needed to execute
4. **Tool-agnostic** — invoke skills however your tool supports it
