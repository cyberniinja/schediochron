# Agent Task Workflow

This document outlines the standardized workflow that agents should follow when handling tasks in the Schediochron project. Each task progresses through 5 phases: **Comprehension → Planning → Implementation → Verification → Reporting**.

Each phase is **user-initiated** — the agent completes a phase and tells the developer which command to run next. The developer controls when each phase begins.

## Workflow Overview

```
┌─────────────────┐
│ 1. COMPREHENSION│ ← /work-issue or /comprehend-issue
└────────┬────────┘
         │ developer invokes Phase 2
         ▼
┌─────────────────┐
│    2. PLANNING  │ ← /plan-issue
└────────┬────────┘         PLANNING LOCK ACTIVE (Phases 1 & 2)
         │ developer invokes Phase 3
         ▼
┌──────────────────┐
│ 3. IMPLEMENTATION│ ← /implement-issue  (lock deactivated at start)
└────────┬─────────┘
         │ developer invokes Phase 4
         ▼
┌──────────────────┐
│  4. VERIFICATION │ ← /verify-issue
└────────┬─────────┘
         │ developer invokes Phase 5
         ▼
┌──────────────────┐
│   5. REPORTING   │ ← /report-issue
└──────────────────┘
```

## Phase Skills

Each phase is started by invoking the corresponding skill. Skill files live in `.agents/skills/`.

| Phase              | Skill                                  | Description                                            |
| ------------------ | -------------------------------------- | ------------------------------------------------------ |
| Entry              | `work-issue [#N \| description]`       | Start the workflow with an issue number or description |
| 1 — Comprehension  | `comprehend-issue [#N \| description]` | Understand task, activate planning lock                |
| 2 — Planning       | `plan-issue {folder}`                  | Design approach, produce plan                          |
| 3 — Implementation | `implement-issue {folder}`             | Execute plan, write code, commit                       |
| 4 — Verification   | `verify-issue {folder}`                | Run checks, save PASS/FAIL report                      |
| 5 — Reporting      | `report-issue {folder}`                | Compile report, open PR                                |
| Utility            | `unlock`                               | Remove a stale planning lock                           |

Invoke skills however your tool supports it: slash commands, natural language, planning mode, or
agent mode. See `AGENTS.md` for the full skill index and tool-specific setup guidance.

## Planning Lock

Phases 1 and 2 activate a **planning lock** that prevents source file edits:

- **Lock file**: `.agents/.planning-active` (created by Phase 1, cleared by Phase 3)
- **Enforcement**: soft enforcement via skill instructions — do not write source files while the lock file exists
- **Allowed during planning**: reads, codebase exploration, writes to `.agents/issues/{issue-folder}/` only
- **Stale lock**: run the `unlock` skill, or delete `.agents/.planning-active` manually

## Quick Reference

| Phase                 | Purpose                             | Deliverable                              |
| --------------------- | ----------------------------------- | ---------------------------------------- |
| 1️⃣ **Comprehension**  | Understand requirements and context | `comprehension.md`, planning lock active |
| 2️⃣ **Planning**       | Design the approach and strategy    | `planning.md`                            |
| 3️⃣ **Implementation** | Execute the plan and make changes   | Code changes, `implementation.md`        |
| 4️⃣ **Verification**   | Test and validate all changes       | `verification.md` (PASS/FAIL)            |
| 5️⃣ **Reporting**      | Summarize results and open PR       | `report.md`, pull request                |

## When to Use This Workflow

✅ **Always use this workflow for:**

- New features
- Bug fixes
- Refactoring tasks
- Documentation updates
- Configuration changes
- Infrastructure/setup tasks

⚡ **Adapt workflow for:**

- Quick fixes (may condense phases)
- Urgent issues (prioritize verification)
- Exploratory tasks (emphasize comprehension)

❌ **Don't use for:**

- Simple one-line typo fixes
- Reading/viewing code only
- General inquiries

## Detailed Phases

### Phase 1: Comprehension 📖

**Goal**: Fully understand what needs to be done

**See**: [`.agents/skills/comprehend-issue.md`](.agents/skills/comprehend-issue.md)

**Key Actions:**

- Read and analyze the task description
- Identify requirements and success criteria
- Clarify ambiguities with user if needed
- Research existing related code/documentation
- Document assumptions

**Output:**

- Clear understanding of the task
- List of clarifying questions (if any)
- Identified resources/files to modify

---

### Phase 2: Planning 📋

**Goal**: Design the approach before coding

**See**: [`.agents/skills/plan-issue.md`](.agents/skills/plan-issue.md)

**Key Actions:**

- Analyze current state of the codebase
- Design implementation approach
- Break down into concrete steps
- Identify potential risks/challenges
- Create task breakdown with dependencies
- Get approval for significant changes

**Output:**

- Implementation plan
- Task checklist
- Identified files to modify
- Risk mitigation strategy

---

### Phase 3: Implementation 💻

**Goal**: Execute the plan with quality code

**See**: [`.agents/skills/implement-issue.md`](.agents/skills/implement-issue.md)

**Key Actions:**

- Follow the plan systematically
- Write clean, well-typed code
- Follow project conventions
- Add appropriate tests
- Update documentation as needed
- Make focused, logical commits

**Output:**

- Code changes
- Test updates/additions
- Documentation updates
- Commits with proper messages

---

### Phase 4: Verification ✅

**Goal**: Ensure all changes work correctly

**See**: [`.agents/skills/verify-issue.md`](.agents/skills/verify-issue.md)

**Key Actions:**

- Run all tests (unit, integration, E2E)
- Type check and lint
- Manual testing if applicable
- Check for breaking changes
- Verify performance if relevant
- Create verification report

**Output:**

- Test results
- Verification checklist completed
- List of any issues found
- Regression test results

---

### Phase 5: Reporting 📝

**Goal**: Communicate the work and results

**See**: [`.agents/skills/report-issue.md`](.agents/skills/report-issue.md)

**Key Actions:**

- Summarize what was accomplished
- Document any deviations from plan
- List commits made
- Identify any remaining issues
- Provide hand-off notes for follow-up
- Suggest next steps if applicable

**Output:**

- Summary report
- Commit log
- Test results summary
- Recommendations for follow-up

---

## Best Practices

### ⏱️ Time Management

- Don't rush comprehension—it's worth taking time to understand fully
- Planning prevents costly rework later
- Implementation should flow smoothly if planning is solid
- Always allocate time for verification (don't skip!)
- Keep reporting concise but complete

### 🎯 Documentation

- Write down assumptions during comprehension
- Create a plan document before coding (especially for complex tasks)
- Document decisions and trade-offs made
- Keep test results for reporting

### 🔄 Iterative Approach

- If planning reveals new info, go back to comprehension
- If implementation hits blockers, revisit the plan
- If verification fails, fix and re-verify (don't just move on)

### 👥 Communication

- Ask for clarification immediately if needed
- Report blockers and issues early
- Include user in significant decisions
- Provide clear summaries in reports

## Common Patterns

### Quick Bug Fix

1. **Comprehension**: Understand what's broken
2. **Planning**: Identify the fix location
3. **Implementation**: Make the fix
4. **Verification**: Run tests, verify fix
5. **Reporting**: Summary of changes

### New Feature Development

1. **Comprehension**: Full requirements gathering
2. **Planning**: Detailed design document
3. **Implementation**: Code + tests + docs
4. **Verification**: Comprehensive testing
5. **Reporting**: Summary and hand-off

### Refactoring Task

1. **Comprehension**: Understand current code
2. **Planning**: Refactoring strategy
3. **Implementation**: Refactor code
4. **Verification**: Tests pass, no behavior change
5. **Reporting**: Summary

---

## Related Resources

- `.agents/skills/` — Canonical skill files for all phases and utilities
- `AGENTS.md` — Agent Development Reference (commit standards, branch naming, QA commands)
- `.agents/codebase.md` — Project structure reference

## Questions?

If you're unsure about a task or workflow:

- Review the specific phase documentation
- Check the task checklists
- Reference the codebase guide
- Ask the user for clarification

---

**Last Updated**: March 19, 2026  
**Applies To**: All agents working on Schediochron  
**Use**: Read through phases as needed during task execution
