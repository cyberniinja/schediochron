# Schediochron Roadmap

> **Track progress on the [Schediochron Roadmap project board →](https://github.com/users/cyberniinja/projects/2)**

---

## Vision

Schediochron is a **free, open-source, modular, self-hostable time management platform** for any team.

The problem we're solving: teams are paying a lot of money for time management software they could run themselves for free. Schediochron aims to make setting up a complete time management system as easy as possible — no vendor lock-in, no subscriptions, no compromises.

**Guiding principles:**
- **Modular by design** — pick only the parts you need
- **Open source (MIT)** — free forever
- **Developer-first** — easy to self-host, integrate, and extend
- **Accessible to all** — quickstart bundles for non-technical teams (coming later)

---

## Module Architecture

Schediochron is composed of independently usable packages:

| Package | Purpose |
|---------|---------|
| `@schediochron/core` | Baseline interfaces, data models, and core business logic |
| `@schediochron/sql` | PostgreSQL (and SQL-compatible) database adapter |
| `@schediochron/mongo` | MongoDB database adapter |
| `@schediochron/react` | React component library |
| `@schediochron/vue` | Vue component library |
| `@schediochron/api` | REST API server |
| `@schediochron/cli` | Command-line interface |
| `@schediochron/mcp` | MCP (Model Context Protocol) server |

Pre-configured bundles and Docker images will be provided for common stacks to get up and running quickly with sensible defaults.

---

## Audience

- **Primary (now):** Developers and technical teams who want to self-host a time management system
- **Future:** Non-technical teams via pre-built quickstart bundles and hosted guides

---

## Milestones

### v0.2 — Architecture Foundation
Establish the modular monorepo structure that everything else builds on.

- Restructure monorepo around the package architecture above
- Extract `@schediochron/core` — shared data models and interfaces
- Refactor the current React prototype into `@schediochron/react` as a proper component library

### v0.3 — First Stack
Implement the first complete technology stack: **React + PostgreSQL + REST API**.

- `@schediochron/sql` — PostgreSQL adapter implementing `@schediochron/core` interfaces
- `@schediochron/api` — REST API server
- Wire the three packages together into a working, functional time management system

### v0.4 — Configuration & Composition
Define how Schediochron modules are composed into a complete system.

- Design and implement the configuration concept
- Ship the first full application bundle (React + PostgreSQL + REST API)
- Document how to assemble a custom stack from individual packages

### v0.5 — Ecosystem Expansion
Expand the ecosystem beyond the initial reference stack.

- `@schediochron/mongo` — MongoDB adapter
- `@schediochron/cli` — CLI for managing time entries and system admin
- `@schediochron/mcp` — MCP server for AI tooling integration
- `@schediochron/vue` — Vue component library

### v1.0 — General Availability
Production-ready release for teams of all sizes.

- Pre-configured Docker images and quickstart bundles
- Full documentation and onboarding guides for technical and non-technical users
- Stable public API with versioning guarantees
- Accessibility compliance

---

## Current State

**Version:** 0.1.x (prototype)

The current codebase is a React UI prototype demonstrating the calendar-based time tracking interface. It has no data persistence or backend. It will be refactored into `@schediochron/react` in v0.2.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to get involved.
Issues and feature requests are tracked on [GitHub Issues](https://github.com/cyberniinja/schediochron/issues).
The full roadmap is maintained on the [project board](https://github.com/users/cyberniinja/projects/2).
