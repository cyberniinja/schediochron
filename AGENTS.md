# Schediochron Agents Documentation

The `.agents` directory contains comprehensive guidance for handling tasks in the Schediochron project. All agents should follow the 5-phase workflow and consult the relevant files below.

## Workflow

Tasks follow five ordered phases. Read the corresponding file for each phase before proceeding:

| File | Phase | Purpose |
|------|-------|---------|
| [.agents/01-comprehension.md](.agents/01-comprehension.md) | Phase 1 | Understand the task and ask clarifying questions |
| [.agents/02-planning.md](.agents/02-planning.md) | Phase 2 | Design the approach and break down implementation steps |
| [.agents/03-implementation.md](.agents/03-implementation.md) | Phase 3 | Execute the plan, write code, make commits |
| [.agents/04-verification.md](.agents/04-verification.md) | Phase 4 | Run tests, type checks, and validate results |
| [.agents/05-reporting.md](.agents/05-reporting.md) | Phase 5 | Communicate results and suggest next steps |

## Supporting Documentation

| File | Purpose |
|------|---------|
| [.agents/workflow.md](.agents/workflow.md) | Overview of the full 5-phase workflow with diagrams |
| [.agents/agent-guidelines.md](.agents/agent-guidelines.md) | General best practices for all agents |
| [.agents/codebase.md](.agents/codebase.md) | Technical reference for the Schediochron codebase |
| [.agents/config.json](.agents/config.json) | Machine-readable workspace configuration (commands, projects) |
| [.agents/index.md](.agents/index.md) | Full documentation index with reading guide and FAQ |

## Custom Agents

| File | Purpose |
|------|---------|
| [.github/agents/work-issue.agent.md](.github/agents/work-issue.agent.md) | **work-issue** — invokable via `/agent` in Copilot CLI; runs the full 5-phase workflow for a GitHub issue |

## Quick Start

1. Use `/agent` in Copilot CLI and select **work-issue**, or type `Use the work-issue agent` in a prompt
2. Alternatively, read [.agents/workflow.md](.agents/workflow.md) and follow phases manually
3. Begin with [.agents/01-comprehension.md](.agents/01-comprehension.md) for every task
4. Progress through phases in order — do not skip ahead
5. Refer to [.agents/codebase.md](.agents/codebase.md) and [.agents/agent-guidelines.md](.agents/agent-guidelines.md) as needed throughout
