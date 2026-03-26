# ADR-001: Time Entry Data Model

**Status**: Accepted  
**Date**: 2026-03-26  
**Issue**: [#14 — define time entry data model](https://github.com/mjorn/schediochron/issues/14)

---

## Context

`@schediochron/core` requires a canonical definition of what a **time entry** is before any
persistence layer (`@schediochron/sql`, issue #25) or domain interfaces (`@schediochron/core`
TypeScript interfaces, issue #19) can be implemented. Without a shared, written specification,
field names, nullability rules, validation constraints, and overlap semantics will diverge across
implementation boundaries.

This ADR is the single source of truth for the time entry model. Implementers of issues #19 and
#25 should derive their work directly from this document.

---

## Decision

### Field Specification

| Field       | Type                            | Nullable | Constraints                                                   |
| ----------- | ------------------------------- | -------- | ------------------------------------------------------------- |
| `id`        | `string` (UUID v4)              | No       | Immutable after creation                                      |
| `userId`    | `string` (UUID v4)              | No       | References the owning user; immutable after creation          |
| `startTime` | `string` (ISO 8601 UTC)         | No       | Seconds zeroed — minute precision enforced at input layer     |
| `endTime`   | `string` (ISO 8601 UTC) \| null | Yes      | `null` when the entry is running; seconds zeroed when present |
| `status`    | `"running"` \| `"completed"`    | No       | Must be consistent with `endTime` (see invariants below)      |
| `note`      | `string` \| null                | Yes      | Max 255 characters; `null` if not provided                    |
| `createdAt` | `string` (ISO 8601 UTC)         | No       | Set by persistence layer; immutable                           |
| `updatedAt` | `string` (ISO 8601 UTC)         | No       | Updated by persistence layer on every write                   |

### Entry Status Enum

```
"running"   — entry is open; endTime is null; clock-out has not occurred
"completed" — entry is closed; endTime is set; startTime < endTime
```

No other status values exist in MVP. Future statuses (e.g. `"deleted"`, `"amended"`) are out of
scope.

### Derived Fields

`duration` is **not stored**. It is always computed on demand:

```
duration = endTime - startTime   (in milliseconds, or formatted as hh:mm)
```

`duration` is undefined for running entries.

---

## TypeScript Type Preview

Implementers of `@schediochron/core` (#19) should use these names and types verbatim.

```typescript
export type TimeEntryStatus = 'running' | 'completed';

export interface TimeEntry {
  id: string;
  userId: string;
  startTime: string; // ISO 8601 UTC, seconds zeroed
  endTime: string | null; // ISO 8601 UTC, seconds zeroed; null when running
  status: TimeEntryStatus;
  note: string | null; // max 255 characters
  createdAt: string; // ISO 8601 UTC
  updatedAt: string; // ISO 8601 UTC
}
```

`duration` is not a field on `TimeEntry`. When needed, compute it via a helper function.

---

## Validation Rules

### Per-field constraints

| Field       | Rule                                                                              |
| ----------- | --------------------------------------------------------------------------------- |
| `id`        | Valid UUID v4                                                                     |
| `userId`    | Valid UUID v4; must reference an existing user                                    |
| `startTime` | Valid ISO 8601 UTC timestamp; seconds component must be `00`                      |
| `endTime`   | Valid ISO 8601 UTC timestamp; seconds component must be `00`; must be > startTime |
| `status`    | One of `"running"`, `"completed"`                                                 |
| `note`      | UTF-8 string, max 255 characters; empty string is **not** allowed — use `null`    |

### Status/endTime invariants

These two rules must hold on every write:

1. `status === "running"` ↔ `endTime === null`
2. `status === "completed"` ↔ `endTime` is a valid ISO 8601 UTC timestamp

Violating either invariant is a hard error.

### One running entry per user

A user may have **at most one** running entry at any time. Attempting to create a second running
entry while one is already open is a hard block enforced at the application layer.

### Overlap rule (completed entries)

Two completed entries for the same user may not overlap in time. The interval is **half-open**:
`[startTime, endTime)`.

Two entries **overlap** when:

```
A.startTime < B.endTime  AND  B.startTime < A.endTime
```

Entries that share only an endpoint (e.g. one ends at 10:30 and the next starts at 10:30) do
**not** overlap.

Overlap is checked at the application layer:

- On **create** (manual entry): validate against all existing completed entries for the user.
- On **clock-out** (running → completed): validate the `[startTime, now)` interval against all
  existing completed entries for the user.

**Running entries are excluded** from overlap validation. Their interval is open-ended until
clock-out.

### Time precision

Seconds are always truncated (floored) to zero at the input layer before persistence:

```
23:40:59 → 23:40:00 (stored as "...T23:40:00Z")
```

---

## Consequences

This ADR enables:

- **#19** (`@schediochron/core` TypeScript interfaces): implementers copy field names, types, and
  nullability rules directly from the TypeScript type preview above.
- **#25** (`@schediochron/sql` schema): the field table above maps 1:1 to table columns; the
  one-running-entry invariant suggests a partial unique index on `(userId, status)` where
  `status = 'running'`.
- **Zod validation schemas**: the per-field constraints and invariants section maps directly to
  Zod refinements.
- **REST API contracts**: `POST /time-entries` and `PATCH /time-entries/:id/clock-out` can derive
  their request/response shapes from this model.

Future changes to the model (e.g. adding project association, a billable flag, or soft-delete
semantics) require a new ADR or an amendment to this one.
