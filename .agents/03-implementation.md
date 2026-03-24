# Phase 3: Implementation 💻

**Goal**: Execute the plan from Phase 2, step by step.

## Expected Input

- The completed `planning.md` from Phase 2
- The ordered list of implementation steps with dependencies
- The planned tests and what they should cover
- The developer-approved approach

## Behaviour

### 1. Follow the Plan

- Work through the implementation steps defined in `planning.md` in order
- Respect step dependencies — do not start a step until its dependencies are complete
- Implement the tests as defined in the plan
- If a step cannot be completed as planned, stop and consult the developer

### 2. Write Quality Code

- Follow project conventions documented in `agent-guidelines.md` and `codebase.md`
- Use functional components, TypeScript strict typing, and SCSS modules
- Write clean, readable code — only add comments where clarification is needed

### 3. Make Focused Commits

- Commit logical units of work as you complete each step
- Write clear, descriptive commit messages
- Include the `Co-authored-by` trailer

### 4. Track Progress

- Mark each step as complete as you go
- Note any deviations from the plan

## Expected Output

Save a file named `implementation.md` in the issue folder (e.g., `.agents/issues/42-add-profile-component/implementation.md`) containing:

- A log of each step completed, with notes on any deviations from the plan
- A list of commits made during implementation
- Any issues encountered and how they were resolved

## Checklist

- [ ] All implementation steps from `planning.md` completed in order
- [ ] Code follows project conventions
- [ ] Tests implemented as planned in Phase 2
- [ ] Commits made with clear messages and co-author trailer
- [ ] `implementation.md` saved in the issue folder
- [ ] Ready to move to Phase 4 (Verification)

## When to Go Back

- If implementation reveals that the plan is incomplete or incorrect, return to Phase 2 to revise.
- If the task requirements need re-evaluation, return to Phase 1.
