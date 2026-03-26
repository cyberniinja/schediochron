# Phase 2: Planning 📋

**Goal**: Design the approach and plan the implementation before writing code.

## How to Invoke

| Tool | Command |
|------|---------|
| Copilot CLI | `/agent plan-issue` |
| Claude Code | `/plan-issue {issueNr}-{issueName}` |
| Other tools | "Start Phase 2: plan issue {issueNr}-{issueName}" |

## Expected Input

- The completed `comprehension.md` from Phase 1
- A confirmed understanding of the task requirements
- Planning lock active (`.agents/.planning-active`)

## Behaviour

### 1. Research the Codebase

- Locate files and modules related to the task
- Understand existing patterns, conventions, and data flow
- Review relevant tests to understand expected behaviour
- Check `codebase.md` and `agent-guidelines.md` for project-specific context

### 2. Design Possible Approaches

- Identify multiple viable implementation strategies
- Document trade-offs for each approach (complexity, maintainability, performance, etc.)
- Identify potential risks for each approach

### 3. Consult the Developer

- Present the proposed approaches and their trade-offs to the developer
- Ask the developer to choose the preferred approach
- Raise any architectural or structural questions for the developer to decide
- Do not make architectural decisions independently — the developer has the final say

### 4. Break Down into Steps

- Based on the chosen approach, create a concrete, ordered list of implementation steps
- Identify dependencies between steps
- Note which files will be created, modified, or deleted

### 5. Plan Tests

- Define which tests need to be written (unit, integration, E2E)
- Specify what each test should cover
- Include test files in the list of files to be created

## Planning Lock

The planning lock remains active during Phase 2. **Do not modify source files** — only write to `.agents/issues/{issue-folder}/`. Planning artifacts must be saved inside the issue folder.

If the lock is missing, activate it before proceeding:
```bash
echo "Phase 2 (plan-issue): {issueNr}-{issueName}" > .agents/.planning-active
```

## Expected Output

Save a file named `planning.md` in the issue folder using `.agents/templates/planning.md` as a template. The file should contain:

- The proposed approaches with trade-offs
- The developer's chosen approach and reasoning
- Answers to architectural and structural questions from the developer
- An ordered list of implementation steps with dependencies
- Files to be created, modified, or deleted
- Tests to be written, with what each test should cover
- Identified risks and mitigation strategies

## Checklist

- [ ] Codebase researched for related code and conventions
- [ ] Multiple approaches designed and documented with trade-offs
- [ ] Approaches presented to the developer for decision
- [ ] Architectural and structural questions answered by the developer
- [ ] Steps broken down with dependencies identified
- [ ] Files to modify listed
- [ ] Risks identified and mitigations planned
- [ ] Tests planned — what to test and where
- [ ] Planning lock still active (`.agents/.planning-active`)
- [ ] `planning.md` saved in the issue folder using the template
- [ ] Developer told to invoke Phase 3 when ready
- [ ] **Stopped here** — do not proceed to Phase 3 without explicit developer instruction

## Next Phase

Tell the developer:
```
When ready, start Phase 3:
  Copilot CLI:  /agent implement-issue
  Claude Code:  /implement-issue {issueNr}-{issueName}
  Other tools:  "Start Phase 3: implement issue {issueNr}-{issueName}"
```
