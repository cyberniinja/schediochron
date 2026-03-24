# Guidelines for AI Agents Working on Schediochron

## Commands

### `/start-task`

Starts the agent workflow for a task. This is the entry point for all agent work.

**Usage:**

- `/start-task` — Start the workflow without context. The agent will ask the developer to describe the task before proceeding.
- `/start-task #42` — Start work on existing GitHub issue #42. The agent pulls the issue title, description, and labels from GitHub to populate Phase 1.
- `/start-task Add profile component` — Start work on a new task with a brief description. The agent creates a GitHub issue first, then proceeds with Phase 1.

**What the agent does:**

1. If no arguments are provided:
   - Ask the developer to describe the task
   - Do **not** create a GitHub issue yet — proceed through comprehension (analyze, clarify, evaluate size) first
   - Once the task is fully understood, create the issue with a clear, concise title and description derived from the comprehension phase
   - Then create the task folder and branch
2. If an issue number is provided (`#42`):
   - Fetch the issue details (title, description, labels) from GitHub
   - Derive the task type from the issue label (`feature`, `bug`, `chore`, `refactoring`)
   - If no type label exists, ask the developer to classify it
3. If a short description is provided (no issue number):
   - Use the description as a starting point for comprehension
   - Do **not** create a GitHub issue yet — proceed through comprehension (analyze, clarify, evaluate size) first
   - Once the task is fully understood, create the issue with the appropriate type label via `gh issue create`
   - Then create the task folder and branch
4. Proceed to Phase 1 (Comprehension) with the issue context

## Quick Start for Agents

### Prerequisites
- Understand Nx monorepo structure
- Familiar with React, TypeScript, and Vite
- Know basic git workflow

### Important Rules

1. **Always check before modifying**
   - Run `git status` to see current changes
   - Read related files in context
   - Don't break existing tests

2. **Type Safety First**
   - TypeScript strict mode is enforced
   - Always provide proper type annotations
   - Run `npx nx typecheck` after changes

3. **Code Quality**
   - Must pass linting: `bun nx lint`
   - Must pass testing: `bun nx test`
   - Code must be formatted: `bunx prettier --write <file>`
   - No console.error or console.warn in production code

4. **Commit Standards**
   - Format: `{type}(#{issueNr}): description` (e.g., `feat(#42): add profile component`)
   - Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`
   - Include the trailer: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

5. **React Component Best Practices**
   - Use functional components (no class components)
   - Use hooks for state and side effects
   - Props should be typed with TypeScript interfaces
   - Extract styles to separate SCSS files when possible

## Project Structure Reference

```
schediochron/
├── apps/
│   ├── schediochron/                    # Main React app
│   │   ├── src/
│   │   │   ├── main.tsx                 # Entry point
│   │   │   ├── app.tsx                  # Root component
│   │   │   ├── components/              # React components
│   │   │   ├── pages/                   # Page components
│   │   │   └── assets/                  # Static assets
│   │   ├── public/                      # Static files
│   │   ├── project.json                 # Nx project config
│   │   └── tsconfig.*.json
│   └── schediochron-e2e/                # Playwright tests
│       ├── src/
│       │   └── *.spec.ts                # Test files
│       └── playwright.config.ts         # Test config
├── nx.json                              # Workspace config
├── package.json                         # Root package.json
├── tsconfig.base.json                   # Shared TypeScript config
└── eslint.config.mjs                    # ESLint rules
```

## Common Commands for Agents

### Setup & Initialization
```bash
# Install dependencies
bun install

# Verify setup
bun nx graph
```

### Development
```bash
# Start dev server (http://localhost:4200)
bun nx serve schediochron

# Build production bundle
bun nx build schediochron

# Generate new component
bun nx generate @nx/react:component --project=schediochron --name=MyComponent
```

### Quality Assurance
```bash
# Lint all code
bun nx lint

# Type check all projects
bun nx typecheck

# Format code
bunx prettier --write .

# Run unit/integration tests
bun nx test

# Run E2E tests
bun nx e2e schediochron-e2e

# Run specific test file
bun nx test --testFile=src/components/MyComponent.spec.tsx
```

### Git Workflow

#### Branch Naming

Branches must follow the convention: `{type}/{issueNr}-{issueName}`

| Type           | Usage                              | Example                            |
| -------------- | ---------------------------------- | ---------------------------------- |
| `feature`      | New functionality                  | `feature/42-add-profile-component` |
| `bug`          | Bug fixes                          | `bug/17-fix-calendar-rendering`    |
| `chore`        | Maintenance, dependencies, tooling | `chore/88-update-dependencies`     |
| `refactoring`  | Code restructuring                 | `refactoring/23-extract-layout`    |

#### Commands
```bash
# Create and checkout branch
git checkout -b feature/42-add-profile-component

# Check status
git status

# Stage changes
git add <files>

# Commit with trailer
git commit -m "feat(#42): description"

# Push branch and open a pull request (all changes go through PRs)
git push origin <branch>
gh pr create --head <branch> --base main --title "feat(#42): description" --body "..."
```

> **Note:** Direct pushes to `main` are not allowed. All changes must go through a pull request.

## Testing Patterns

### Unit/Integration Tests (Vitest)
- Location: `**/*.spec.ts(x)` or `**/*.test.ts(x)`
- Use Testing Library for React component tests
- Mock external dependencies

### E2E Tests (Playwright)
- Location: `apps/schediochron-e2e/src/**/*.spec.ts`
- Test user flows, not implementation details
- Use page objects pattern for maintainability

## Error Handling

### Build Errors
1. Check TypeScript compilation: `bun nx typecheck`
2. Review error messages carefully
3. Check tsconfig files for strict settings
4. Ensure all imports are correct

### Test Failures
1. Run specific test with verbose output: `bun nx test --verbose`
2. Check test files for setup/teardown issues
3. Verify dependencies are installed: `bun install`
4. Check for missing mocks

### Linting Issues
1. Run linter to see all issues: `bun nx lint`
2. Auto-fix where possible: `bun nx lint --fix`
3. Apply Prettier: `bunx prettier --write <file>`

## Documentation

- **Codebase Overview**: `.copilot/codebase.md`
- **Nx Documentation**: https://nx.dev
- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev
- **TypeScript Documentation**: https://www.typescriptlang.org

## When to Ask for Help

- Architectural decisions
- Unclear requirements
- Scope ambiguity
- Dependency version conflicts
- Unusual error messages
