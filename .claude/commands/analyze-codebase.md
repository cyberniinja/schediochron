# /analyze-codebase

Generate a comprehensive analysis of a feature, area, or dataflow in the codebase.
Produces a standalone markdown document with mermaid diagrams.
Not tied to any issue — useful for onboarding, planning, or understanding before making changes.

## Usage

```
/analyze-codebase {topic} [--area {path}]
```

**`topic`**: what to analyze, e.g. `authentication`, `scheduling-engine`, `data-flow`.
**`--area {path}`**: optional path to focus the analysis, e.g. `apps/api/src/auth`.

## What This Command Does

1. **Explores** the relevant files and packages for the given topic
2. **Produces** a structured analysis document with:
   - **Overview**: what this area does and why
   - **Architecture diagram** (mermaid): component relationships
   - **Data flow diagram** (mermaid): how data moves through the system
   - **Key files**: annotated list of the most important files
   - **Entry points**: how the area is invoked (APIs, events, scheduled jobs, etc.)
   - **Dependencies**: external libraries and internal packages used
   - **Observations**: notable patterns, potential issues, or areas of complexity
3. **Writes** the document to: `.agents/analysis/{YYYY-MM-DD}-{topic}.md`
4. **Reports** the file path and a brief executive summary

## Output

`.agents/analysis/{YYYY-MM-DD}-{topic}.md` — standalone analysis document.

## Notes

- This command is **read-only** — it never modifies source files or issue folders.
- The `.agents/analysis/` directory is not tracked in version control by default.
  Add it to git if you want to keep analyses as team artifacts.
- For analysis that feeds into an issue plan, run this first, then reference the analysis
  document in your `comprehension.md`.
