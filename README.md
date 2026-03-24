# Schediochron

A time tracking application built with React, TypeScript, and Vite in an Nx monorepo.

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript 5.9
- **Bundler**: Vite 8
- **Monorepo**: Nx 22
- **Package Manager**: Bun
- **Styling**: SCSS Modules
- **Testing**: Vitest (unit/integration), Playwright (E2E)
- **Linting**: ESLint, Prettier

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Node.js](https://nodejs.org/) (for Nx CLI)

### Setup

```bash
# Install dependencies
bun install

# Start the dev server (http://localhost:4200)
npx nx serve schediochron
```

### Common Commands

```bash
# Build for production
npx nx build schediochron

# Run unit/integration tests
npx nx test

# Run E2E tests
npx nx e2e schediochron-e2e

# Lint
npx nx lint

# Type check
npx nx typecheck

# Format
npx prettier --write .
```

## Project Structure

```
schediochron/
├── apps/
│   ├── schediochron/           # Main React application
│   │   ├── src/
│   │   │   ├── main.tsx        # Entry point
│   │   │   ├── components/     # React components
│   │   │   ├── pages/          # Page components
│   │   │   └── assets/         # Static assets
│   │   └── project.json        # Nx project config
│   └── schediochron-e2e/       # Playwright E2E tests
├── .agents/                    # Agent workflow documentation
├── nx.json                     # Nx workspace config
├── tsconfig.base.json          # Shared TypeScript config
└── eslint.config.mjs           # ESLint config
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on issues, branches, commits, code quality, and versioning.

### AI Agents

This project includes structured agent workflow documentation in `.agents/`. See [`.agents/index.md`](.agents/index.md) for details.