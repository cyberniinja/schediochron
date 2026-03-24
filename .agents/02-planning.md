# Phase 2: Planning 📋

**Goal**: Design the approach and plan the implementation before writing code.

## Expected Input

- The completed `comprehension.md` from Phase 1
- A confirmed understanding of the task requirements

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

## Expected Output

Save a file named `planning.md` in the issue folder (e.g., `.agents/issues/42-add-profile-component/planning.md`) containing:

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
- [ ] `planning.md` saved in the issue folder
- [ ] Ready to move to Phase 3 (Implementation)

## When to Go Back

- If research reveals that the task requirements are unclear or incomplete, return to Phase 1 and re-clarify with the user.
