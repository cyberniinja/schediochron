import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'bun:test';
import type { SQL } from 'bun';
import type {
  AuthResponse,
  HoursReportDay,
  Team,
  TimeEntry,
  TokenPair,
} from '@schediochron/core';
import { createSqlClient, migrateUp } from '@schediochron/sql';
import { app } from './app.js';
import { createRepositories, setRepositories } from './repositories.js';

/**
 * Full-stack integration tests: the real Hono app driven over HTTP
 * (`app.request`) backed by the concrete PostgreSQL repositories and real
 * migrations — no fakes anywhere below the wire. They exercise the lifecycles
 * and the 409 invariant paths named in #35 end to end.
 *
 * A live database is required. The suite reads its connection string from
 * `INTEGRATION_DATABASE_URL` and, when that is absent, `describe.skipIf` skips
 * the whole block (hooks included) so the default `bun test` neither hangs nor
 * fails without a database. CI provisions a `postgres` service and sets the env
 * so these run there (see `.github/workflows/ci.yml`).
 *
 * Isolation: the schema is applied once in `beforeAll`; every table is truncated
 * before each test so cases never see one another's rows.
 */

const INTEGRATION_DATABASE_URL = process.env.INTEGRATION_DATABASE_URL;

describe.skipIf(!INTEGRATION_DATABASE_URL)('full-stack integration', () => {
  let sql: SQL;

  beforeAll(async () => {
    // Signing and verification only need a shared secret; the value is arbitrary.
    process.env.ACCESS_TOKEN_SECRET = 'integration-test-access-token-secret';
    sql = createSqlClient(INTEGRATION_DATABASE_URL);
    await migrateUp(sql);
    // Drive the app through the concrete PostgreSQL repositories.
    setRepositories(createRepositories(sql));
  });

  afterAll(async () => {
    setRepositories(undefined);
    await sql?.close();
  });

  beforeEach(async () => {
    await sql`TRUNCATE users, user_credentials, teams, team_members, time_entries, refresh_tokens RESTART IDENTITY CASCADE`;
  });

  // --- HTTP helpers --------------------------------------------------------

  /** Drives the app over HTTP, JSON-encoding the body and attaching a bearer. */
  async function request(
    path: string,
    init: { method?: string; body?: unknown; token?: string } = {},
  ): Promise<Response> {
    const headers: Record<string, string> = {};
    if (init.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    if (init.token !== undefined) {
      headers['Authorization'] = `Bearer ${init.token}`;
    }
    return app.request(path, {
      method: init.method ?? 'GET',
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
  }

  let userSeq = 0;

  /** Registers a fresh user and returns its auth response (user + tokens). */
  async function register(
    overrides: { username?: string; password?: string } = {},
  ): Promise<AuthResponse> {
    userSeq += 1;
    const res = await request('/auth/register', {
      method: 'POST',
      body: {
        username: overrides.username ?? `user_${userSeq}`,
        password: overrides.password ?? 'correct horse battery',
      },
    });
    expect(res.status).toBe(201);
    return (await res.json()) as AuthResponse;
  }

  // --- Auth lifecycle ------------------------------------------------------

  describe('auth lifecycle', () => {
    it('register -> login -> protected call -> refresh -> logout -> refresh 401', async () => {
      // Register.
      const registered = await register({ username: 'ada_lovelace' });
      expect(typeof registered.accessToken).toBe('string');
      expect(typeof registered.refreshToken).toBe('string');
      expect(
        (registered.user as unknown as Record<string, unknown>).passwordHash,
      ).toBeUndefined();

      // Login.
      const loginRes = await request('/auth/login', {
        method: 'POST',
        body: { username: 'ada_lovelace', password: 'correct horse battery' },
      });
      expect(loginRes.status).toBe(200);
      const login = (await loginRes.json()) as AuthResponse;

      // Call a protected endpoint with the access token.
      const protectedRes = await request('/time-entries', {
        token: login.accessToken,
      });
      expect(protectedRes.status).toBe(200);
      // ...and be rejected without it.
      const unauth = await request('/time-entries');
      expect(unauth.status).toBe(401);

      // Refresh rotates the token pair.
      const refreshRes = await request('/auth/refresh', {
        method: 'POST',
        body: { refreshToken: login.refreshToken },
      });
      expect(refreshRes.status).toBe(200);
      const refreshed = (await refreshRes.json()) as TokenPair;
      expect(refreshed.refreshToken).not.toBe(login.refreshToken);

      // Logout revokes the current refresh token.
      const logoutRes = await request('/auth/logout', {
        method: 'POST',
        token: refreshed.accessToken,
        body: { refreshToken: refreshed.refreshToken },
      });
      expect(logoutRes.status).toBe(204);

      // Refreshing the revoked token now fails.
      const afterLogout = await request('/auth/refresh', {
        method: 'POST',
        body: { refreshToken: refreshed.refreshToken },
      });
      expect(afterLogout.status).toBe(401);
    });
  });

  // --- Time entry lifecycle ------------------------------------------------

  describe('time entry lifecycle', () => {
    it('clock in -> clock out -> list -> update -> delete', async () => {
      const { accessToken } = await register();

      // Clock in.
      const startRes = await request('/time-entries/start', {
        method: 'POST',
        token: accessToken,
      });
      expect(startRes.status).toBe(201);
      const running = (await startRes.json()) as TimeEntry;
      expect(running.status).toBe('running');
      expect(running.endTime).toBeNull();

      // The running entry starts at the current minute and clock-out floors to
      // the current minute too, so back-date the start to make the stopped
      // interval a non-empty, non-overlapping [start, now) (ADR-001).
      await sql`UPDATE time_entries SET start_time = start_time - interval '30 minutes' WHERE id = ${running.id}`;

      // Clock out.
      const stopRes = await request('/time-entries/stop', {
        method: 'POST',
        token: accessToken,
      });
      expect(stopRes.status).toBe(200);
      const stopped = (await stopRes.json()) as TimeEntry;
      expect(stopped.status).toBe('completed');
      expect(stopped.endTime).not.toBeNull();

      // List.
      const listRes = await request('/time-entries', { token: accessToken });
      expect(listRes.status).toBe(200);
      const entries = (await listRes.json()) as TimeEntry[];
      expect(entries).toHaveLength(1);
      expect(entries[0].id).toBe(running.id);

      // Update.
      const patchRes = await request(`/time-entries/${running.id}`, {
        method: 'PATCH',
        token: accessToken,
        body: { note: 'refactored the parser' },
      });
      expect(patchRes.status).toBe(200);
      expect(((await patchRes.json()) as TimeEntry).note).toBe(
        'refactored the parser',
      );

      // Delete.
      const deleteRes = await request(`/time-entries/${running.id}`, {
        method: 'DELETE',
        token: accessToken,
      });
      expect(deleteRes.status).toBe(204);
      const afterDelete = await request(`/time-entries/${running.id}`, {
        token: accessToken,
      });
      expect(afterDelete.status).toBe(404);
    });

    it('rejects a second clock-in while one is running (409)', async () => {
      const { accessToken } = await register();

      const first = await request('/time-entries/start', {
        method: 'POST',
        token: accessToken,
      });
      expect(first.status).toBe(201);

      const second = await request('/time-entries/start', {
        method: 'POST',
        token: accessToken,
      });
      expect(second.status).toBe(409);
    });

    it('rejects a manual entry that overlaps an existing one (409)', async () => {
      const { accessToken } = await register();

      const first = await request('/time-entries', {
        method: 'POST',
        token: accessToken,
        body: {
          startTime: '2024-03-01T09:00:00Z',
          endTime: '2024-03-01T11:00:00Z',
        },
      });
      expect(first.status).toBe(201);

      const overlapping = await request('/time-entries', {
        method: 'POST',
        token: accessToken,
        body: {
          startTime: '2024-03-01T10:00:00Z',
          endTime: '2024-03-01T10:30:00Z',
        },
      });
      expect(overlapping.status).toBe(409);
    });
  });

  // --- Team lifecycle ------------------------------------------------------

  describe('team lifecycle', () => {
    it('create -> add member -> remove member -> delete', async () => {
      const owner = await register({ username: 'team_owner' });
      const member = await register({ username: 'team_member' });

      // Create — the creator becomes the sole admin and member.
      const createRes = await request('/teams', {
        method: 'POST',
        token: owner.accessToken,
        body: { name: 'Engineering' },
      });
      expect(createRes.status).toBe(201);
      const team = (await createRes.json()) as Team;
      expect(team.adminIds).toEqual([owner.user.id]);
      expect(team.memberIds).toEqual([owner.user.id]);

      // Add a member.
      const addRes = await request(`/teams/${team.id}/members`, {
        method: 'POST',
        token: owner.accessToken,
        body: { userId: member.user.id },
      });
      expect(addRes.status).toBe(200);
      expect(((await addRes.json()) as Team).memberIds).toContain(
        member.user.id,
      );

      // Remove the member.
      const removeRes = await request(
        `/teams/${team.id}/members/${member.user.id}`,
        { method: 'DELETE', token: owner.accessToken },
      );
      expect(removeRes.status).toBe(200);
      expect(((await removeRes.json()) as Team).memberIds).not.toContain(
        member.user.id,
      );

      // Delete — now that the owner is the only member.
      const deleteRes = await request(`/teams/${team.id}`, {
        method: 'DELETE',
        token: owner.accessToken,
      });
      expect(deleteRes.status).toBe(204);
      const afterDelete = await request(`/teams/${team.id}`, {
        token: owner.accessToken,
      });
      expect(afterDelete.status).toBe(404);
    });

    it('rejects removing the last admin (409)', async () => {
      const owner = await register({ username: 'sole_admin' });
      const member = await register({ username: 'plain_member' });

      const createRes = await request('/teams', {
        method: 'POST',
        token: owner.accessToken,
        body: { name: 'Ops' },
      });
      const team = (await createRes.json()) as Team;

      // A non-admin member exists, so the team is not empty — but the owner is
      // still its only admin (ADR-004).
      await request(`/teams/${team.id}/members`, {
        method: 'POST',
        token: owner.accessToken,
        body: { userId: member.user.id },
      });

      const removeAdmin = await request(
        `/teams/${team.id}/members/${owner.user.id}`,
        { method: 'DELETE', token: owner.accessToken },
      );
      expect(removeAdmin.status).toBe(409);
    });
  });

  // --- Reporting -----------------------------------------------------------

  describe('reporting', () => {
    it("sums each day's completed minutes across a window", async () => {
      const { accessToken } = await register();

      // Log completed entries across three distinct days.
      const manual = [
        // 2024-01-15: 120 minutes.
        { startTime: '2024-01-15T09:00:00Z', endTime: '2024-01-15T11:00:00Z' },
        // 2024-01-16: 30 + 120 = 150 minutes across two entries.
        { startTime: '2024-01-16T08:00:00Z', endTime: '2024-01-16T08:30:00Z' },
        { startTime: '2024-01-16T10:00:00Z', endTime: '2024-01-16T12:00:00Z' },
        // 2024-01-17: 45 minutes.
        { startTime: '2024-01-17T14:00:00Z', endTime: '2024-01-17T14:45:00Z' },
      ];
      for (const body of manual) {
        const res = await request('/time-entries', {
          method: 'POST',
          token: accessToken,
          body,
        });
        expect(res.status).toBe(201);
      }

      // `to` is the day after the last entry: the filter bounds `start_time <= to`.
      const reportRes = await request(
        '/reports/hours?from=2024-01-15&to=2024-01-18',
        { token: accessToken },
      );
      expect(reportRes.status).toBe(200);
      const report = (await reportRes.json()) as HoursReportDay[];

      const minutesByDate = new Map(
        report.map((day) => [day.date, day.totalMinutes]),
      );
      expect(minutesByDate.get('2024-01-15')).toBe(120);
      expect(minutesByDate.get('2024-01-16')).toBe(150);
      expect(minutesByDate.get('2024-01-17')).toBe(45);

      const total = report.reduce((sum, day) => sum + day.totalMinutes, 0);
      expect(total).toBe(315);
    });
  });
});
