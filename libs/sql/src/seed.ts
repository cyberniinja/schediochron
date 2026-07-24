// Development seed data for a populated local environment.
//
// Running this against a fresh database gives a developer something to log into
// immediately after `docker compose up`: two users with known credentials, a
// team that contains both, and a handful of time entries spread across several
// days (several completed, exactly one still running).
//
// Two rules shape the script:
//
//  - Every row is built as a `@schediochron/core` model and run through that
//    model's validator *before* it is written. A fixture that would violate an
//    invariant fails loudly here rather than reaching the database — the cheapest
//    way to keep seed data from drifting away from the models (issue #72).
//  - It is idempotent. It detects what it already seeded (users by username,
//    the team by name, entries by owner) and skips rather than duplicating or
//    erroring, so it is safe to run repeatedly.
//
// This is dev tooling, not part of the package's public API, so it is not
// re-exported from `index.ts`. The pure builders are exported for unit testing.

import { randomUUID } from 'node:crypto';
import type { SQL } from 'bun';
import {
  type Team,
  type TimeEntry,
  type User,
  type UserRole,
  validateTeam,
  validateTimeEntry,
  validateUser,
} from '@schediochron/core';
import { createSqlClient } from './db.js';
import { migrateUp } from './migrate.js';
import { SqlPasswordCredentialStore } from './password-credential-store.js';
import { SqlTeamRepository } from './team-repository.js';
import { SqlTimeEntryRepository } from './time-entry-repository.js';
import { SqlUserRepository } from './user-repository.js';

/** The password every seeded user shares — documented in the README. */
export const SEED_PASSWORD = 'password123';

/** The team both seeded users belong to. */
export const SEED_TEAM_NAME = 'Demo Team';

/** A seeded user's fixed, human-facing identity. Ids are generated on create. */
interface UserSpec {
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
}

export const ADMIN_SPEC: UserSpec = {
  username: 'admin',
  displayName: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
};

export const MEMBER_SPEC: UserSpec = {
  username: 'member',
  displayName: 'Member User',
  email: 'member@example.com',
  role: 'member',
};

/** A pluggable id source so tests can build deterministic fixtures. */
type IdFactory = () => string;

/** Throws when a built fixture fails its model validator, naming the offender. */
function ensureValid<T>(
  result: { success: true; data: T } | { success: false; error: unknown },
  label: string,
): T {
  if (!result.success) {
    throw new Error(
      `Seed produced an invalid ${label}, refusing to write it: ${String(
        (result.error as { message?: string }).message ?? result.error,
      )}`,
    );
  }
  return result.data;
}

/** A `Date` at minute precision — seconds and milliseconds zeroed (ADR-001). */
function atMinute(
  now: Date,
  dayOffset: number,
  hour: number,
  minute: number,
): Date {
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() + dayOffset);
  d.setUTCHours(hour, minute, 0, 0);
  return d;
}

/** Builds a validated {@link User} model from its spec. */
export function buildUser(
  spec: UserSpec,
  now = new Date(),
  id = randomUUID(),
): User {
  const iso = now.toISOString();
  const user: User = {
    id,
    username: spec.username,
    displayName: spec.displayName,
    email: spec.email,
    role: spec.role,
    createdAt: iso,
    updatedAt: iso,
  };
  return ensureValid(validateUser(user), `user "${spec.username}"`);
}

/** Builds the validated {@link Team} model containing both seeded users. */
export function buildTeam(
  adminId: string,
  memberId: string,
  now = new Date(),
  id = randomUUID(),
): Team {
  const iso = now.toISOString();
  const team: Team = {
    id,
    name: SEED_TEAM_NAME,
    adminIds: [adminId],
    memberIds: [adminId, memberId],
    createdAt: iso,
    updatedAt: iso,
  };
  return ensureValid(validateTeam(team), `team "${SEED_TEAM_NAME}"`);
}

/**
 * Builds the validated sample entries: several completed sessions spread across
 * the preceding days for both users, plus a single running entry for the member.
 *
 * Exactly one entry across the two users has status `running` (ADR-001); the
 * per-user completed sessions never overlap. Every entry is run through
 * {@link validateTimeEntry} before it is returned.
 */
export function buildSeedTimeEntries(
  adminId: string,
  memberId: string,
  now = new Date(),
  nextId: IdFactory = randomUUID,
): TimeEntry[] {
  const iso = now.toISOString();

  const completed = (
    userId: string,
    start: Date,
    end: Date,
    note: string,
  ): TimeEntry => ({
    id: nextId(),
    userId,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    status: 'completed',
    note,
    createdAt: iso,
    updatedAt: iso,
  });

  const running = (userId: string, start: Date, note: string): TimeEntry => ({
    id: nextId(),
    userId,
    startTime: start.toISOString(),
    endTime: null,
    status: 'running',
    note,
    createdAt: iso,
    updatedAt: iso,
  });

  const entries: TimeEntry[] = [
    // Admin — completed sessions across four days, none overlapping.
    completed(
      adminId,
      atMinute(now, -4, 9, 0),
      atMinute(now, -4, 12, 30),
      'Sprint planning',
    ),
    completed(
      adminId,
      atMinute(now, -3, 13, 0),
      atMinute(now, -3, 17, 0),
      'Code review and pairing',
    ),
    completed(
      adminId,
      atMinute(now, -2, 8, 30),
      atMinute(now, -2, 11, 45),
      'API implementation',
    ),
    completed(
      adminId,
      atMinute(now, -1, 10, 0),
      atMinute(now, -1, 15, 30),
      'Documentation',
    ),

    // Member — completed sessions plus the one running entry (started today).
    completed(
      memberId,
      atMinute(now, -3, 9, 15),
      atMinute(now, -3, 12, 0),
      'Onboarding',
    ),
    completed(
      memberId,
      atMinute(now, -2, 13, 30),
      atMinute(now, -2, 17, 15),
      'Feature work',
    ),
    completed(
      memberId,
      atMinute(now, -1, 8, 45),
      atMinute(now, -1, 12, 15),
      'Bug fixing',
    ),
    running(memberId, atMinute(now, 0, 9, 0), 'Working on the time tracker'),
  ];

  return entries.map((entry, i) =>
    ensureValid(validateTimeEntry(entry), `time entry #${i + 1}`),
  );
}

/**
 * Ensures a user exists with the given spec and a known password. Returns the
 * existing row when one is already present (matched by username), so re-runs do
 * not duplicate; the password credential is always (re)written, since it is an
 * upsert and a pre-existing user may have had no credential.
 */
async function ensureUser(
  users: SqlUserRepository,
  credentials: SqlPasswordCredentialStore,
  spec: UserSpec,
): Promise<User> {
  const existing = await users.findByUsername(spec.username);
  const user = existing ?? (await users.create(buildUser(spec)));
  const passwordHash = await Bun.password.hash(SEED_PASSWORD);
  await credentials.set(user.id, passwordHash);
  console.info(
    existing
      ? `  · user "${spec.username}" already present (${user.id})`
      : `  + created user "${spec.username}" (${user.id})`,
  );
  return user;
}

/** Ensures the demo team exists, containing both users with the admin as admin. */
async function ensureTeam(
  teams: SqlTeamRepository,
  admin: User,
  member: User,
): Promise<Team> {
  const existing = (await teams.findByUserId(admin.id)).find(
    (t) => t.name === SEED_TEAM_NAME,
  );
  if (existing) {
    console.info(
      `  · team "${SEED_TEAM_NAME}" already present (${existing.id})`,
    );
    return existing;
  }
  const created = await teams.create(buildTeam(admin.id, member.id));
  console.info(`  + created team "${SEED_TEAM_NAME}" (${created.id})`);
  return created;
}

/**
 * Ensures the sample time entries exist. A user that already owns any entry is
 * left untouched, which keeps the "exactly one running entry" invariant intact
 * across re-runs and avoids tripping the one-running-per-user index.
 */
async function ensureTimeEntries(
  timeEntries: SqlTimeEntryRepository,
  admin: User,
  member: User,
): Promise<void> {
  const owners = [admin, member];
  const alreadySeeded = (
    await Promise.all(
      owners.map(
        async (u) => (await timeEntries.find({ userId: u.id })).length > 0,
      ),
    )
  ).some(Boolean);
  if (alreadySeeded) {
    console.info('  · time entries already present, skipping');
    return;
  }
  const entries = buildSeedTimeEntries(admin.id, member.id);
  for (const entry of entries) {
    await timeEntries.create(entry);
  }
  const running = entries.filter((e) => e.status === 'running').length;
  console.info(
    `  + created ${entries.length} time entries (${running} running)`,
  );
}

/**
 * Seeds the database behind `sql`. Applies any pending migrations first so the
 * schema is guaranteed to exist, then writes users, the team, and time entries
 * idempotently.
 */
export async function seed(sql: SQL): Promise<void> {
  console.info('Applying migrations…');
  const applied = await migrateUp(sql);
  console.info(
    applied.length
      ? `  applied ${applied.length} migration(s): ${applied.join(', ')}`
      : '  schema already up to date',
  );

  const users = new SqlUserRepository(sql);
  const credentials = new SqlPasswordCredentialStore(sql);
  const teams = new SqlTeamRepository(sql);
  const timeEntries = new SqlTimeEntryRepository(sql);

  console.info('Seeding users…');
  const admin = await ensureUser(users, credentials, ADMIN_SPEC);
  const member = await ensureUser(users, credentials, MEMBER_SPEC);

  console.info('Seeding team…');
  await ensureTeam(teams, admin, member);

  console.info('Seeding time entries…');
  await ensureTimeEntries(timeEntries, admin, member);

  console.info(
    `Done. Log in as "${ADMIN_SPEC.username}" or "${MEMBER_SPEC.username}" with password "${SEED_PASSWORD}".`,
  );
}

async function main(): Promise<void> {
  const sql = createSqlClient();
  try {
    await seed(sql);
  } finally {
    await sql.close();
  }
}

if (import.meta.main) {
  await main();
}
