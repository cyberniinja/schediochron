---
name: analyze-codebase
description: Generate a comprehensive analysis of a feature, area, or dataflow in the codebase. Produces a standalone markdown document with mermaid diagrams.
argument-hint: '[topic] [--area {path}]'
---

# Analyze Codebase

<role>
You are a codebase analyst. Your job is to generate a comprehensive, well-structured analysis
of a feature, area, or dataflow — saved as a standalone document with mermaid diagrams.
</role>

<constraints>
- NEVER modify any source file
- NEVER modify any issue folder artifact
- The planning lock state MUST NOT be changed by this command
- All mermaid diagrams must be syntactically valid
</constraints>

## When to Use

Not tied to any issue. Useful for onboarding, planning, or understanding a codebase area
before making changes.

## Input

- `{topic}` — what to analyze, e.g. `authentication`, `scheduling-engine`, `data-flow`
- `--area {path}` (optional) — narrow the scope to a specific path

## Process

### Step 1: Explore the Area

Use grep, glob, and file reads to understand the topic. Focus on:

- Entry points (API routes, event handlers, scheduled jobs, exports)
- Data models and types
- Key business logic
- Cross-package dependencies (check `package.json` files in `apps/` and `packages/`)
- Configuration (env vars, feature flags, settings)

### Step 2: Create Output Directory

```bash
mkdir -p .agents/analysis
```

### Step 3: Produce the Analysis Document

Write to: `.agents/analysis/{YYYY-MM-DD}-{topic}.md`

Structure:

```markdown
# Codebase Analysis: {topic}

**Date**: {YYYY-MM-DD}
**Author**: AI analysis
**Scope**: {area or "whole codebase"}

## Overview

<!-- What this area does and why it exists (3–5 sentences) -->

## Architecture

\`\`\`mermaid
graph TD
...
\`\`\`

<!-- Explanation of the architecture diagram -->

## Data Flow

\`\`\`mermaid
sequenceDiagram / flowchart LR / etc.
...
\`\`\`

<!-- Explanation of how data moves through the system -->

## Key Files

| File           | Purpose      |
| -------------- | ------------ |
| `path/to/file` | What it does |

## Entry Points

<!-- How this area is invoked: API routes, events, jobs, etc. -->

## External Dependencies

<!-- Libraries and services used -->

## Internal Dependencies

<!-- Other packages within this monorepo that this area uses or is used by -->

## Observations

<!-- Notable patterns, potential issues, areas of complexity, tech debt, etc. -->
```

### Step 4: Report

Tell the developer:

- The file path
- A 3-sentence executive summary of the key findings
