# Agent Task Workflow

This document outlines the standardized workflow that agents should follow when handling tasks in the Schediochron project. Each task progresses through 5 phases: **Comprehension → Planning → Implementation → Verification → Reporting**.

## Workflow Overview

```
┌─────────────────┐
│ 1. COMPREHENSION│ ← Understand the task
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    2. PLANNING  │ ← Determine approach
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│ 3. IMPLEMENTATION│ ← Execute the plan
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  4. VERIFICATION │ ← Test and validate
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   5. REPORTING   │ ← Communicate results
└──────────────────┘
```

## Quick Reference

| Phase                 | Purpose                             | Duration  | Deliverable                               |
| --------------------- | ----------------------------------- | --------- | ----------------------------------------- |
| 1️⃣ **Comprehension**  | Understand requirements and context | 5-15 min  | Clear understanding, questions identified |
| 2️⃣ **Planning**       | Design the approach and strategy    | 5-20 min  | Plan document, task breakdown             |
| 3️⃣ **Implementation** | Execute the plan and make changes   | Variable  | Code changes, documentation updates       |
| 4️⃣ **Verification**   | Test and validate all changes       | 10-30 min | Test results, validation report           |
| 5️⃣ **Reporting**      | Summarize results and next steps    | 5-10 min  | Summary, commit messages, hand-off notes  |

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

**See**: `PHASE-01-COMPREHENSION.md`

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

**See**: `PHASE-02-PLANNING.md`

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

**See**: `PHASE-03-IMPLEMENTATION.md`

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

**See**: `PHASE-04-VERIFICATION.md`

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

**See**: `PHASE-05-REPORTING.md`

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

- `.copilot/agent-guidelines.md` — General working practices
- `.copilot/codebase.md` — Project structure reference

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
