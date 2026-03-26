# ADR-004: Team Data Model

**Status**: Accepted  
**Date**: 2026-03-26  
**Issue**: [#16 — define team model](https://github.com/mjorn/schediochron/issues/16)

---

## Context

Schediochron supports team-based time tracking. Before any persistence layer or domain
interfaces can be implemented, a canonical definition of what a **team** is — and how
membership and admin roles work — must be written down.

This ADR is the single source of truth for the team model. Implementers of the persistence
layer and `@schediochron/core` TypeScript interfaces should derive their work directly from
this document.

---

## Decision

### Field Specification

| Field       | Type                       | Nullable | Constraints                                                |
| ----------- | -------------------------- | -------- | ---------------------------------------------------------- |
| `id`        | `string` (UUID v4)         | No       | Immutable after creation                                   |
| `name`      | `string`                   | No       | 1–255 characters; leading/trailing whitespace trimmed      |
| `adminIds`  | `string[]` (UUID v4 array) | No       | Non-empty; each entry must reference an existing user      |
| `memberIds` | `string[]` (UUID v4 array) | No       | Non-empty; every entry in `adminIds` must also appear here |
| `createdAt` | `string` (ISO 8601 UTC)    | No       | Set by persistence layer; immutable                        |
| `updatedAt` | `string` (ISO 8601 UTC)    | No       | Updated by persistence layer on every write                |

### Membership Model

`memberIds` represents **all participants** of a team — both regular members and admins.
`adminIds` is a subset of `memberIds` that identifies users with administrative privileges.

```
memberIds = all team participants (regular members + admins)
adminIds  ⊆ memberIds
```

This means:

- Every admin is also a member.
- Assigning a user as admin requires two writes: add to `adminIds` and (if not already present)
  to `memberIds`. Both must succeed atomically.
- Removing a user from the team requires removing them from both arrays if they appear in both.

### Team Creation

When a team is created:

1. The creating user is automatically added to both `adminIds` and `memberIds`.
2. A team cannot be created without an initial admin — the creator is always that admin.

### Admin Rules

| Operation                  | Rule                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| Assign admin               | Add `userId` to `adminIds`; ensure `userId` is also in `memberIds`                           |
| Remove admin               | Remove `userId` from `adminIds`; **blocked if they are the last admin**                      |
| Add member                 | Add `userId` to `memberIds` only (no admin privileges)                                       |
| Remove member              | Remove `userId` from both `memberIds` and `adminIds`; **blocked if removing the last admin** |
| Check admin status         | `adminIds.includes(userId)`                                                                  |
| List all team participants | `memberIds`                                                                                  |

### Multi-Team Membership

A user may belong to any number of teams simultaneously. There is no global limit. Team
membership is managed per-team — being a member or admin of one team has no effect on another.

### No Invite Flow (MVP)

In the MVP, only admins may add or remove members. There is no invite link, invite token, or
self-join mechanism. Future versions (hosted / pre-built) may introduce invite-based joining
as a separate feature.

---

## TypeScript Type Preview

Implementers of `@schediochron/core` should use these names and types verbatim.

```typescript
export interface Team {
  id: string; // UUID v4; immutable
  name: string; // 1–255 characters
  adminIds: string[]; // UUID v4 refs; non-empty; subset of memberIds
  memberIds: string[]; // UUID v4 refs; non-empty; includes all admins
  createdAt: string; // ISO 8601 UTC
  updatedAt: string; // ISO 8601 UTC
}
```

---

## Validation Rules

### Per-field constraints

| Field       | Rule                                                                        |
| ----------- | --------------------------------------------------------------------------- |
| `id`        | Valid UUID v4                                                               |
| `name`      | Non-empty string after trimming; max 255 characters                         |
| `adminIds`  | Non-empty array; each entry is a valid UUID v4 referencing an existing user |
| `memberIds` | Non-empty array; each entry is a valid UUID v4 referencing an existing user |

### Invariants

These invariants must hold on every write:

1. **Admin subset**: every entry in `adminIds` must also appear in `memberIds`.
2. **At least one admin**: `adminIds.length >= 1` at all times.
3. **Atomic admin assignment**: adding a user to `adminIds` and `memberIds` (if absent) must be
   a single atomic operation. Partial writes are invalid.

Violating any invariant is a hard error.

---

## Consequences

This ADR enables:

- **`@schediochron/core` TypeScript interfaces**: implementers copy field names, types, and
  nullability rules directly from the TypeScript type preview above.
- **Persistence layer**: the field table maps 1:1 to table columns. The "at least one admin"
  invariant suggests a check constraint or application-layer guard on `adminIds`. The admin-subset
  invariant suggests a foreign-key-style cross-array check (or a join table in a relational schema).
- **Zod validation schemas**: the per-field constraints and invariants section maps directly to
  Zod refinements (`.min(1)` on arrays, `.refine()` for the subset check).
- **REST API contracts**: `POST /teams`, `PATCH /teams/:id/members`, and `PATCH /teams/:id/admins`
  can derive their request/response shapes from this model.

If future requirements add more roles (e.g. `"viewer"`, `"billing-admin"`), the two-array model
should be migrated to a unified members-with-role structure (Option B from the planning phase).
A new ADR or amendment would be required at that point.
