# Schediochron Codebase Guide

## Overview

Schediochron is an Nx monorepo containing a React application with Playwright E2E tests. Built with TypeScript, Vite, and managed with Bun.

## Architecture

### Monorepo Structure

- **Framework**: Nx 22.6.0
- **Package Manager**: Bun
- **TypeScript Version**: ~5.9.3

### Projects

#### apps/schediochron

- **Type**: React Application
- **Bundler**: Vite
- **Styling**: SCSS
- **Testing**: Vitest
- **Main Entry**: src/main.tsx
- **Build Output**: dist/

#### apps/schediochron-e2e

- **Type**: E2E Tests
- **Framework**: Playwright
- **Configuration**: playwright.config.ts
- **Tests**: src/\*_/_.spec.ts

## Key Technologies

### Runtime Dependencies

- React 19.2.4
- React Router DOM 7.13.1
- FontAwesome (SVG Core + React)
- Awesome.me Kit

### Development Stack

- **Bundler**: Vite 8.0.0
- **Testing**:
  - Vitest 4.1.0 (unit/integration)
  - Playwright 1.58.2 (E2E)
  - Testing Library (React + DOM)
- **Linting**: ESLint 10.0.3
- **Formatting**: Prettier 3.8.1
- **CSS**: SASS 1.98.0
- **Type Checking**: TypeScript ~5.9.3

## Development Commands

### Local Development

```bash
# Start dev server
bun nx serve schediochron

# Build for production
bun nx build schediochron
```

### Testing & Quality

```bash
# Run tests
bun nx test

# Run E2E tests
bun nx e2e schediochron-e2e

# Lint code
bun nx lint

# Type check
bun nx typecheck
```

### Utilities

```bash
# View project graph
bun nx graph

# Show available tasks for a project
bun nx show project schediochron

# List all projects
bun nx list
```

## Code Style & Conventions

### TypeScript

- **Version**: ~5.9.3
- **Strict Mode**: Enforced via tsconfig
- **Base Config**: tsconfig.base.json (root-level)
- **App Config**: apps/schediochron/tsconfig.app.json

### ESLint Rules

- Config: eslint.config.mjs (ESLint 9+ flat config)
- Plugins: react, react-hooks, jsx-a11y, import, typescript-eslint, prettier
- No conflicts with Prettier

### Formatting

- **Tool**: Prettier 3.8.1
- **Config**: .prettierrc
- **Ignored Files**: .prettierignore

### Styling

- **Language**: SCSS
- **Default Style** for generated components: SCSS modules

## File Locations

### Configuration Files

- `nx.json` - Nx workspace configuration, plugins, and task defaults
- `package.json` - Root workspace definition with workspaces array
- `tsconfig.base.json` - Shared TypeScript base configuration
- `tsconfig.json` - Root TypeScript configuration
- `.eslintrc.json` - ESLint configuration (if present)
- `eslint.config.mjs` - ESLint flat config (new format)
- `.prettierrc` - Prettier configuration
- `vitest.workspace.ts` - Vitest workspace configuration

### Build & Runtime

- `bun.lockb` - Bun lock file (binary format)
- `bunfig.toml` - Bun configuration
- `node_modules/` - Installed dependencies (symlinked with Bun)

### VS Code

- `.vscode/` - Editor settings and extensions recommendations

## Important Notes

### Nx Cloud

- Connected to Nx Cloud (ID: 69145ce4ad961419787ef44d)
- CI/CD pipeline configured: .github/workflows/ci.yml

### Versioning and Tags

- Tags follow monorepo-scoped semantic versioning: `{project}@{major}.{minor}.{patch}`
  - **major** — breaking changes (e.g., `schediochron@2.0.0`)
  - **minor** — new features, backward-compatible (e.g., `schediochron@1.3.0`)
  - **patch** — bug fixes, chores, refactoring (e.g., `schediochron@1.2.1`)
- Tagging is handled by CI/CD on merges to `main`, not by agents

### Package Manager

- **Primary**: Bun (faster node package manager)
- Dependencies in `package.json` use standard npm format
- Lock file: `bun.lockb` (binary, managed by Bun)
