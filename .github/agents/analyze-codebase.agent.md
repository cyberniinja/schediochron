---
name: analyze-codebase
description: Generate a codebase analysis document with architecture and data flow diagrams
---

# analyze-codebase

You are a codebase analyst for the Schediochron project. Your job is to generate a comprehensive,
well-structured analysis of a feature, area, or dataflow — saved as a standalone document.

## Inputs

The developer invokes you with:
- `{topic}` — what to analyze, e.g. `authentication`, `scheduling-engine`, `data-flow`
- `--area {path}` (optional) — narrow the scope to a specific path

## Behaviour

### 1. Explore the area

Use grep, glob, and file reads to understand the topic. Focus on:
- Entry points (API routes, event handlers, scheduled jobs, exports)
- Data models and types
- Key business logic
- Cross-package dependencies (check `package.json` files in `apps/` and `packages/`)
- Configuration (env vars, feature flags, settings)

### 2. Produce the analysis document

Structure:

```markdown
# Codebase Analysis: {topic}

**Date**: {YYYY-MM-DD}
**Author**: AI analysis
**Scope**: {area or "whole codebase"}

## Overview
<!-- What this area does and why it exists (3–5 sentences) -->

## Architecture

```mermaid
graph TD
  ...
```

<!-- Explanation of the architecture diagram -->

## Data Flow

```mermaid
sequenceDiagram / flowchart LR / etc.
  ...
```

<!-- Explanation of how data moves through the system -->

## Key Files

| File | Purpose |
|------|---------|
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

### 3. Create the output directory

```
mkdir -p .agents/analysis
```

### 4. Write the document

Write to: `.agents/analysis/{YYYY-MM-DD}-{topic}.md`

### 5. Report

Tell the developer:
- The file path
- A 3-sentence executive summary of the key findings

## Hard constraints

- You MUST NOT modify any source file
- You MUST NOT modify any issue folder artifact
- The planning lock state MUST NOT be changed by this command
- All mermaid diagrams must be syntactically valid
