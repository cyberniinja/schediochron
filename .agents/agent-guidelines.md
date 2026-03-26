# Guidelines for AI Agents Working on Schediochron

## Commands

### Phase Commands

Each phase is a separate command. Agents complete one phase and wait for the developer to initiate the next.

| Phase | Copilot CLI | Claude Code | Other tools |
|-------|-------------|-------------|-------------|
| 1 — Comprehension | `/agent work-issue` or `/agent comprehend-issue` | `/work-issue` or `/comprehend-issue` | "Start Phase 1: comprehend issue #N" |
| 2 — Planning | `/agent plan-issue` | `/plan-issue {folder}` | "Start Phase 2: plan issue {folder}" |
| 3 — Implementation | `/agent implement-issue` | `/implement-issue {folder}` | "Start Phase 3: implement issue {folder}" |
| 4 — Verification | `/agent verify-issue` | `/verify-issue {folder}` | "Start Phase 4: verify issue {folder}" |
| 5 — Reporting | `/agent report-issue` | `/report-issue {folder}` | "Start Phase 5: report issue {folder}" |
| Unlock | `/agent unlock` | `/unlock` | "Unlock the planning guard" |

### Planning Lock Convention

During Phases 1 and 2, the planning lock (`.agents/.planning-active`) must be respected:

- **Do not write or edit source files** while the lock file exists
- Only write to `.agents/issues/{issue-folder}/` during planning
- Use only Explore agents for codebase research during planning phases
- The lock is activated at the start of Phase 1 and cleared at the start of Phase 3

If you encounter a stale lock (planning phase was interrupted), use the unlock command to clear it.

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
   - Run `bun nx typecheck` after changes

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
