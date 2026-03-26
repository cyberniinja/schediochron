# ADR-002: User Data Model

**Status**: Accepted  
**Date**: 2026-03-26  
**Issue**: [#15 — define user and authentication model](https://github.com/mjorn/schediochron/issues/15)

---

## Context

`@schediochron/core` requires a canonical definition of what a **user** is before any persistence
layer (`@schediochron/sql`), API (`@schediochron/api`), or auth flow (ADR-003) can be implemented.
Without a shared, written specification, field names, nullability rules, and uniqueness constraints
will diverge across implementation boundaries.

This ADR is the single source of truth for the user data model. Implementers of the user table,
core interfaces, and API user-management endpoints should derive their work directly from this
document.

### Privacy design

Schediochron is self-hosted. The **operator** (the team or individual running the instance) is
the data controller under applicable privacy regulations (e.g. GDPR), not the Schediochron
project. The user model is designed with **privacy by default**: only `username` is required.
`email` is intentionally optional — see the field table below and the note on password reset in
ADR-003.

Operators should inform their users of what data is collected and what functionality depends on
providing an email address.

---

## Decision

### Field Specification

| Field          | Type                    | Nullable | Constraints                                                     |
| -------------- | ----------------------- | -------- | --------------------------------------------------------------- |
| `id`           | `string` (UUID v4)      | No       | Immutable after creation                                        |
| `username`     | `string`                | No       | Unique system-wide; immutable after creation; see format rules  |
| `displayName`  | `string` \| null        | Yes      | Shown in UI instead of `username` when present; max 100 chars   |
| `email`        | `string` \| null        | Yes      | Unique system-wide when present; enables self-service pwd reset |
| `role`         | `"admin"` \| `"member"` | No       | System-level role; see role definitions below                   |
| `passwordHash` | `string`                | No       | Output of a password hashing function; never exposed via API    |
| `createdAt`    | `string` (ISO 8601 UTC) | No       | Set by persistence layer; immutable                             |
| `updatedAt`    | `string` (ISO 8601 UTC) | No       | Updated by persistence layer on every write                     |

### Role Definitions

```
"admin"   — can manage users and teams; has full access to all resources on the instance
"member"  — can log time; access is limited to their own time entries
```

No other role values exist in MVP. Additional roles (e.g. `"manager"`, `"viewer"`) are out of
scope.

---

## TypeScript Type Preview

Implementers of `@schediochron/core` should use these names and types verbatim.

```typescript
export type UserRole = 'admin' | 'member';

export interface User {
  id: string; // UUID v4
  username: string; // unique, immutable
  displayName: string | null;
  email: string | null;
  role: UserRole;
  createdAt: string; // ISO 8601 UTC
  updatedAt: string; // ISO 8601 UTC
}
```

`passwordHash` is **not** a field on `User`. It lives only in the persistence layer and is never
returned by the API.

---

## Validation Rules

### Per-field constraints

| Field          | Rule                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------- |
| `id`           | Valid UUID v4                                                                             |
| `username`     | 3–50 characters; only alphanumeric, hyphens, and underscores; case-insensitive uniqueness |
| `displayName`  | UTF-8 string, 1–100 characters; empty string is **not** allowed — use `null`              |
| `email`        | Valid RFC 5321 email address; case-insensitive uniqueness; empty string not allowed       |
| `role`         | One of `"admin"`, `"member"`                                                              |
| `passwordHash` | Non-empty string produced by the chosen hashing library; algorithm left to implementer    |

### Password hashing

Passwords must be stored as a hashed value. The specific algorithm and cost parameters are left
to the implementer. At minimum, the chosen algorithm must be a slow, cryptographic password
hashing function (e.g. bcrypt, Argon2, scrypt) — MD5, SHA-1, and SHA-256 are explicitly
**not** acceptable.

### Uniqueness invariants

1. `username` is unique across all users (case-insensitive).
2. `email` is unique across all users (case-insensitive) when present. Two users may each have
   `email = null` — `null` does not count as a duplicate.

---

## Consequences

This ADR enables:

- **`@schediochron/core` TypeScript interfaces**: implementers copy field names, types, and
  nullability rules directly from the TypeScript type preview above. `passwordHash` belongs only
  in the persistence-layer type, not in `User`.
- **`@schediochron/sql` schema**: the field table maps 1:1 to table columns; the case-insensitive
  uniqueness constraints suggest a unique index on `LOWER(username)` and a partial unique index
  on `LOWER(email) WHERE email IS NOT NULL`.
- **`@schediochron/api` user endpoints**: `GET /users/:id` and `PATCH /users/:id` can derive
  their response shapes from the `User` interface. `passwordHash` must never appear in any API
  response.
- **ADR-003 (Authentication Flow)**: the auth flow references the `username`, `email`,
  `passwordHash`, and `role` fields defined here.

Future changes to the model (e.g. adding profile picture, timezone preference, or team
membership) require a new ADR or an amendment to this one.
