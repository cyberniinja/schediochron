# ADR-003: Authentication Flow

**Status**: Accepted  
**Date**: 2026-03-26  
**Issue**: [#15 — define user and authentication model](https://github.com/mjorn/schediochron/issues/15)

---

## Context

`@schediochron/api` requires a canonical specification of how users authenticate before any auth
endpoints can be implemented. Without a shared, written specification, token formats, flow
semantics, and error contracts will diverge across implementation boundaries.

This ADR defines the JWT-based authentication flow for the MVP. It references [ADR-002](./ADR-002-user-model.md)
for the user data model. Implementers of `@schediochron/api` auth endpoints should derive their
work directly from this document.

### Key constraints

- Authentication is **username + password** only for MVP. OAuth, SSO, and magic-link flows are
  out of scope.
- **Invite-based team joining is out of scope for MVP.** User accounts are created directly by
  an admin or via the registration endpoint.
- Token lifetimes (TTLs) are **configuration concerns** — not specified in this ADR. The
  implementation must expose them as configurable values (e.g. environment variables or a config
  file).

---

## Decision

### Token Strategy

Authentication uses a **dual-token JWT scheme**:

| Token           | Purpose                                          | Storage          |
| --------------- | ------------------------------------------------ | ---------------- |
| Access token    | Short-lived; included in every API request       | Client-side only |
| Refresh token   | Long-lived; used to obtain a new access token    | Server-side + client-side |

**Access tokens** are signed JWTs. They carry the user's `id`, `username`, and `role` as claims.
They are stateless — the server does not store them.

**Refresh tokens** are opaque random tokens stored server-side. Server-side storage is required
to support revocation (logout). The storage mechanism (e.g. database table, Redis) is left to
the implementer. On each successful refresh, the server may rotate the refresh token (issue a
new one and invalidate the old); rotation is recommended but left as an implementation choice.

### Token Claims (Access Token)

```typescript
interface AccessTokenPayload {
  sub: string;      // user id (UUID v4)
  username: string;
  role: UserRole;   // "admin" | "member" — see ADR-002
  iat: number;      // issued-at (Unix timestamp)
  exp: number;      // expiry (Unix timestamp); TTL is configurable
}
```

---

## Authentication Flows

### Registration — `POST /auth/register`

Creates a new user account. The account is active immediately — no email verification is
required for MVP.

**Request body**:

```typescript
{
  username: string;      // required; see ADR-002 for format rules
  password: string;      // required; min 8 characters
  displayName?: string;  // optional
  email?: string;        // optional; see note on password reset below
}
```

**Success** (`201 Created`):

```typescript
{
  user: User;            // see ADR-002 (passwordHash excluded)
  accessToken: string;
  refreshToken: string;
}
```

**Errors**:

| Status | Condition |
| ------ | --------- |
| `400`  | Validation failure (username format, password too short, etc.) |
| `409`  | `username` or `email` already taken |

---

### Login — `POST /auth/login`

Authenticates an existing user with username and password.

**Request body**:

```typescript
{
  username: string;
  password: string;
}
```

**Success** (`200 OK`):

```typescript
{
  user: User;            // see ADR-002 (passwordHash excluded)
  accessToken: string;
  refreshToken: string;
}
```

**Errors**:

| Status | Condition |
| ------ | --------- |
| `400`  | Missing or malformed request body |
| `401`  | Invalid username or password (do not distinguish between the two) |

---

### Token Refresh — `POST /auth/refresh`

Exchanges a valid refresh token for a new access token.

**Request body**:

```typescript
{
  refreshToken: string;
}
```

**Success** (`200 OK`):

```typescript
{
  accessToken: string;
  refreshToken: string;  // may be a new token if rotation is implemented, or the same token
}
```

**Errors**:

| Status | Condition |
| ------ | --------- |
| `400`  | Missing or malformed request body |
| `401`  | Refresh token not found, expired, or already revoked |

---

### Logout — `POST /auth/logout`

Revokes the current refresh token server-side. The access token is not invalidated (it is
stateless); its remaining TTL is the effective logout grace period.

**Request body**:

```typescript
{
  refreshToken: string;
}
```

**Success** (`204 No Content`): *(empty body)*

**Errors**:

| Status | Condition |
| ------ | --------- |
| `400`  | Missing or malformed request body |
| `401`  | Refresh token not found (treat as already logged out — acceptable to return `204` instead) |

---

### Admin Password Reset — `PATCH /users/:id/password`

Allows an `admin` to set a new password for any user. Requires a valid access token with
`role = "admin"`. No email required.

**Request body**:

```typescript
{
  newPassword: string;   // min 8 characters
}
```

**Success** (`204 No Content`): *(empty body)*

**Errors**:

| Status | Condition |
| ------ | --------- |
| `400`  | Validation failure |
| `401`  | Missing or invalid access token |
| `403`  | Caller is not an admin |
| `404`  | User not found |

> **Side effect**: all existing refresh tokens for the target user should be revoked on password
> reset, forcing re-authentication.

---

## Email-Optional Implications

`email` is optional on the user account (see ADR-002). This is a deliberate privacy-by-default
design: Schediochron does not require operators to collect email addresses.

The consequence for authentication:

- **Users with `email` set**: a self-service password reset flow (e.g. email link) *may* be
  implemented in a future release.
- **Users without `email`**: self-service password reset is **not possible** in MVP. An admin
  must use the admin password reset endpoint on their behalf.

**Operators must inform their users** of this trade-off at the point of registration: providing
an email enables future self-service account recovery; omitting it means recovery requires admin
intervention.

---

## Consequences

This ADR enables:

- **`@schediochron/api` auth endpoints**: the five flows above define the full MVP auth surface.
  Implementers should handle all documented error cases.
- **Token validation middleware**: access tokens carry `sub`, `username`, and `role` — middleware
  can extract role for authorisation without a database lookup.
- **`@schediochron/sql` refresh token table**: needs at minimum `token` (unique), `userId`,
  `expiresAt`, and `revokedAt` (nullable) columns.
- **Future self-service password reset**: the optional `email` field and the note above leave a
  clear extension point without requiring a model change.

Future changes to the auth flow (e.g. OAuth, magic links, MFA) require a new ADR or an amendment
to this one.
