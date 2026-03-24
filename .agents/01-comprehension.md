# Phase 1: Comprehension 📖

**Goal**: Fully understand the task before writing any code.

## Expected Input

A `/start-task` command in one of three forms (see `agent-guidelines.md` for details):

- `/start-task #42` — existing issue number
- `/start-task Add profile component` — short description, no issue yet
- `/start-task` — no arguments, agent asks the developer

## Behaviour

### 1. Gather Context

- If an issue number was provided: fetch the issue title, description, and labels from GitHub
- If a short description was provided: use it as the starting point
- If no arguments were provided: ask the developer to describe the task

### 2. Analyze and Clarify

- Read the task description carefully
- Identify explicit requirements and implicit expectations
- Ask the developer targeted questions to resolve ambiguities
- Do not make assumptions about unclear requirements
- Confirm scope boundaries (what is in and what is out)

### 3. Evaluate Task Size

- Estimate the ballpark size of the change (small, medium, large)
- If the task is large enough that the resulting changes would be difficult to review (roughly >50 files changed, or fewer if individual file changes are expected to be very large), propose splitting it into smaller subtasks
- Each subtask should go through its own full workflow (Phases 1–5) with its own task folder
- Present the proposed subtasks to the developer for approval
- There can be exceptions if the task cannot sensibly be sliced smaller — document why

### 4. Resolve the GitHub Issue

- If an issue already exists (from step 1): use it as-is
- If no issue exists yet: create one now via `gh issue create --label {type}`
  - The issue title and description should reflect the refined understanding from steps 2–3, producing a clear and concise issue
  - Ask the developer for the task type label (`feature`, `bug`, `chore`, `refactoring`) if not already known
- Derive the `{issueNr}` and `{issueName}` from the resolved issue

### 5. Set Up Task Infrastructure

- Create a folder inside `.agents/` named `{issueNr}-{issueName}` (e.g., `.agents/42-add-profile-component/`)
- Check if the correct branch already exists and switch to it
- If not, create a new branch: `{type}/{issueNr}-{issueName}`
  - The type is derived from the issue label
  - See `agent-guidelines.md` for the full branch naming reference

### 6. Document Understanding

- Summarize the task in your own words
- Note any assumptions made and confirm them with the developer
- Include the task size assessment and any subtask breakdown

## Expected Output

Save a file named `comprehension.md` in the task folder (e.g., `.agents/42-add-profile-component/comprehension.md`) containing:

- A summary of the task in the agent's own words
- Clarifying questions and answers from the user
- Documented assumptions
- Task size assessment (small / medium / large)
- Subtask breakdown if applicable, or confirmation that the task is small enough to proceed as a single unit

## Checklist

- [ ] GitHub issue resolved (fetched or created)
- [ ] Task folder created at `.agents/{issueNr}-{issueName}/`
- [ ] Task branch created or checked out (`{type}/{issueNr}-{issueName}`)
- [ ] Task description fully read and understood
- [ ] Ambiguities identified and clarified with the user
- [ ] Task size evaluated — split into subtasks if needed
- [ ] Assumptions documented and confirmed
- [ ] `comprehension.md` saved in the task folder
- [ ] Ready to move to Phase 2 (Planning)

## When to Go Back

- If Phase 2 or Phase 3 reveals new information that changes the understanding of the task, return here and re-evaluate.
