import { describe, expect, it } from 'bun:test';
import {
  validateTeam,
  validateTimeEntry,
  validateUser,
} from '@schediochron/core';
import {
  ADMIN_SPEC,
  MEMBER_SPEC,
  SEED_PASSWORD,
  SEED_TEAM_NAME,
  buildSeedTimeEntries,
  buildTeam,
  buildUser,
} from './seed.js';

const ADMIN_ID = '11111111-1111-4111-8111-111111111111';
const MEMBER_ID = '22222222-2222-4222-8222-222222222222';
const NOW = new Date('2026-07-24T12:34:56.789Z');

describe('buildUser', () => {
  it('builds a valid admin user from its spec', () => {
    const user = buildUser(ADMIN_SPEC, NOW, ADMIN_ID);
    expect(validateUser(user).success).toBe(true);
    expect(user).toMatchObject({
      id: ADMIN_ID,
      username: 'admin',
      role: 'admin',
    });
  });

  it('builds a valid member user from its spec', () => {
    const user = buildUser(MEMBER_SPEC, NOW, MEMBER_ID);
    expect(validateUser(user).success).toBe(true);
    expect(user.role).toBe('member');
  });
});

describe('buildTeam', () => {
  it('builds a valid team with the admin as its only admin and both as members', () => {
    const team = buildTeam(ADMIN_ID, MEMBER_ID, NOW);
    expect(validateTeam(team).success).toBe(true);
    expect(team.name).toBe(SEED_TEAM_NAME);
    expect(team.adminIds).toEqual([ADMIN_ID]);
    expect(new Set(team.memberIds)).toEqual(new Set([ADMIN_ID, MEMBER_ID]));
  });
});

describe('buildSeedTimeEntries', () => {
  const entries = buildSeedTimeEntries(ADMIN_ID, MEMBER_ID, NOW);

  it('produces exactly one running entry across the seeded users (ADR-001)', () => {
    const running = entries.filter((e) => e.status === 'running');
    expect(running).toHaveLength(1);
    expect(running[0].userId).toBe(MEMBER_ID);
    expect(running[0].endTime).toBeNull();
  });

  it('produces several completed entries spread across days', () => {
    const completed = entries.filter((e) => e.status === 'completed');
    expect(completed.length).toBeGreaterThanOrEqual(4);
    const days = new Set(completed.map((e) => e.startTime.slice(0, 10)));
    expect(days.size).toBeGreaterThanOrEqual(3);
  });

  it('every entry satisfies validateTimeEntry', () => {
    for (const entry of entries) {
      expect(validateTimeEntry(entry).success).toBe(true);
    }
  });

  it('has non-overlapping completed intervals per user', () => {
    for (const userId of [ADMIN_ID, MEMBER_ID]) {
      const intervals = entries
        .filter((e) => e.userId === userId && e.endTime !== null)
        .map((e) => [Date.parse(e.startTime), Date.parse(e.endTime as string)])
        .sort((a, b) => a[0] - b[0]);
      for (let i = 1; i < intervals.length; i++) {
        expect(intervals[i][0]).toBeGreaterThanOrEqual(intervals[i - 1][1]);
      }
    }
  });
});

describe('seed constants', () => {
  it('exposes documented credentials', () => {
    expect(SEED_PASSWORD).toBe('password123');
    expect(ADMIN_SPEC.username).toBe('admin');
    expect(MEMBER_SPEC.username).toBe('member');
  });
});
