# Schediochron Agent Workflow Documentation Index

Welcome! This directory contains comprehensive guidance for handling tasks in the Schediochron project.

## 📚 Documentation Structure

### Quick Start

- **[WORKFLOW.md](WORKFLOW.md)** - Overview of the 5-phase workflow
  - Visual diagram showing workflow progression
  - When to use each phase
  - Common patterns

### Supporting Documentation

- **[agent-guidelines.md](agent-guidelines.md)** - General best practices
- **[codebase.md](codebase.md)** - Technical codebase reference
- **[config.json](config.json)** - Machine-readable workspace configuration

## 🎯 How to Use This Documentation

### Starting a Task

1. Read [WORKFLOW.md](WORKFLOW.md) to understand the process
2. Follow each phase in order (Phase 1 → Phase 5)

### By Task Type

- **Building a new feature** → Full workflow phases 1-5
- **Fixing a bug** → All phases (bug fix section in phase 3)
- **Refactoring code** → All phases (refactoring pattern in phase 2)
- **Quick typo fix** → Skip to phase 4 for verification

## 📊 Workflow Overview

```
USER REQUEST
      ↓
┌─────────────────────────────────────────────┐
│ PHASE 1: COMPREHENSION                      │
│ ✓ Understand requirements                   │
│ ✓ Ask clarifying questions                  │
│ ✓ Research codebase                         │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│ PHASE 2: PLANNING                           │
│ ✓ Design approach                           │
│ ✓ Break down into steps                     │
│ ✓ Identify risks                            │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│ PHASE 3: IMPLEMENTATION                     │
│ ✓ Write code                                │
│ ✓ Add tests                                 │
│ ✓ Make commits                              │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│ PHASE 4: VERIFICATION                       │
│ ✓ Run all tests                             │
│ ✓ Type check                                │
│ ✓ Manual testing                            │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│ PHASE 5: REPORTING                          │
│ ✓ Summarize work                            │
│ ✓ Show verification results                 │
│ ✓ Suggest next steps                        │
└──────────────┬──────────────────────────────┘
               ↓
          COMPLETE
```

## 🔑 Key Principles

### For All Phases

1. **Quality First** - Don't skip verification or tests
2. **Clear Communication** - Document decisions and reasoning
3. **Systematic Approach** - Follow the phases in order
4. **Early Clarification** - Ask questions in Phase 1, not later
5. **Thorough Testing** - Verify before reporting

### Per Phase Focus

- **Phase 1**: Be thorough in understanding
- **Phase 2**: Think before coding
- **Phase 3**: Follow conventions and best practices
- **Phase 4**: Be comprehensive, don't skip steps
- **Phase 5**: Be clear and honest about results

## 📖 Reading Order

### First Time Using This Workflow

1. Start here (this file)
2. Read [WORKFLOW.md](WORKFLOW.md)
3. Start a task and follow Phase 1

### For Specific Phases

- Each phase file is self-contained
- Includes examples and templates
- Has checklists to verify completion

### For Reference

- [codebase.md](codebase.md) - Understand the project
- [agent-guidelines.md](agent-guidelines.md) - General best practices

## ❓ Common Questions

**Q: Do I have to follow all 5 phases?**  
A: For new features and bug fixes, yes. For small well-understood tasks (1–5 files), use `/quick-implement` instead.

**Q: What if I get stuck on a phase?**  
A: Review the phase guide, check troubleshooting section, ask for help.

**Q: Can I go back to previous phases?**  
A: Yes! If Phase 3 reveals new info, go back to Phase 1 or 2.

**Q: What if verification fails?**  
A: Don't move forward. Fix issues and re-verify before reporting.

## 🚀 Ready to Start?

1. **Start Here**: Read [WORKFLOW.md](WORKFLOW.md)
2. **First Task**: Go through Phase 1 with your task
3. **Need Help?**: Reference the specific phase guide
4. **Best Practices**: Check [agent-guidelines.md](agent-guidelines.md)

---

## 📁 File Directory

```
.agents/
├── workflow.md                Phase-command model, planning lock, diagrams
├── 01-comprehension.md        Phase 1: understand the task, activate planning lock
├── 02-planning.md             Phase 2: design the approach
├── 03-implementation.md       Phase 3: deactivate lock, execute the plan
├── 04-verification.md         Phase 4: test & validate
├── 05-reporting.md            Phase 5: compile report, open PR
├── agent-guidelines.md        Commit standards, branch naming, code quality rules
├── codebase.md                Technical reference
├── config.json                Machine-readable workspace config
├── templates/
│   ├── comprehension.md       Phase 1 output template
│   ├── planning.md            Phase 2 output template
│   ├── implementation.md      Phase 3 output template
│   ├── verification.md        Phase 4 output template
│   ├── report.md              Phase 5 output template
│   ├── change-request.md      Change request template (request-change utility)
│   └── review-findings.md     Review findings template with [FIX]/[SKIP]/[MANUAL] slots
├── issues/
│   └── {issueNr}-{issueName}/ Issue work folder (created per task)
└── analysis/
    └── {YYYY-MM-DD}-{topic}.md Codebase analysis output (analyze-codebase utility)

.github/agents/
├── work-issue.agent.md               Entry point agent (Phase 1 + coordinator)
├── comprehend-issue.agent.md         Phase 1 standalone agent
├── plan-issue.agent.md               Phase 2 standalone agent
├── implement-issue.agent.md          Phase 3 standalone agent
├── verify-issue.agent.md             Phase 4 standalone agent
├── report-issue.agent.md             Phase 5 standalone agent
├── unlock.agent.md                   Remove stale planning lock
├── request-change.agent.md           Document a targeted change request
├── apply-change-request.agent.md     Execute a reviewed change-request-N.md
├── review-code.agent.md              Vendor-agnostic code review → review.md
├── address-review-findings.agent.md  Apply [FIX]/[SKIP]/[MANUAL] findings
├── quick-implement.agent.md          Fast path for 1–5 file changes
├── discuss-issue.agent.md            Refine comprehension.md through Q&A
└── analyze-codebase.agent.md         Codebase analysis with mermaid diagrams

.claude/
├── settings.json              Claude Code hook configuration
├── commands/
│   ├── comprehend-issue.md    /comprehend-issue slash command (Phase 1)
│   ├── plan-issue.md          /plan-issue slash command (Phase 2)
│   ├── implement-issue.md     /implement-issue slash command (Phase 3)
│   ├── verify-issue.md        /verify-issue slash command (Phase 4)
│   ├── report-issue.md        /report-issue slash command (Phase 5)
│   ├── unlock.md              /unlock slash command
│   ├── request-change.md      /request-change slash command
│   ├── apply-change-request.md /apply-change-request slash command
│   ├── review-code.md         /review-code slash command
│   ├── address-review-findings.md /address-review-findings slash command
│   ├── quick-implement.md     /quick-implement slash command
│   ├── discuss-issue.md       /discuss-issue slash command
│   └── analyze-codebase.md    /analyze-codebase slash command
└── hooks/
    ├── plan-guard.js          PreToolUse hook: hard planning lock enforcement
    └── statusline.js          Status line: model | directory | context usage
```

## 🎓 Summary

This workflow provides a structured approach to handling tasks:

| Phase                 | Goal                  |
| --------------------- | --------------------- |
| 1️⃣ **Comprehension**  | Understand what to do |
| 2️⃣ **Planning**       | Design how to do it   |
| 3️⃣ **Implementation** | Do the work           |
| 4️⃣ **Verification**   | Verify it works       |
| 5️⃣ **Reporting**      | Communicate results   |

Follow this workflow for consistent, high-quality results.
