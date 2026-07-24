import { describe, expect, it } from 'bun:test';
import { app } from './app.js';

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await app.request('/health');

    expect(res.status).toBe(200);

    const body = (await res.json()) as { status: string; timestamp: string };
    expect(body.status).toBe('ok');
    expect(typeof body.timestamp).toBe('string');
  });
});

/**
 * Every operation in `openapi.yaml`, with the success status it documents.
 * A route that is missing, mounted on the wrong path, or bound to the wrong
 * method fails here rather than in the per-resource shape specs.
 */
const operations = [
  // The /auth operations are backed by the database (or, for logout,
  // authenticated) now, so they no longer return their documented status to
  // this unauthenticated, DB-less smoke table. Their routing, statuses, and
  // auth are covered end-to-end in routes/auth.spec.ts.
  { id: 'listUsers', method: 'GET', path: '/users', status: 200 },
  { id: 'getUser', method: 'GET', path: '/users/u-1', status: 200 },
  { id: 'updateUser', method: 'PATCH', path: '/users/u-1', status: 200 },
  {
    id: 'adminResetPassword',
    method: 'PATCH',
    path: '/users/u-1/password',
    status: 204,
  },

  // The /time-entries operations are authenticated now, so they no longer
  // return their documented status to this unauthenticated smoke table. Their
  // routing, statuses, and auth are covered end-to-end in time-entries.spec.ts.

  // The /teams operations are omitted here: they are real, auth-protected
  // endpoints (#32), so a bodyless, tokenless smoke request cannot reach their
  // documented success status. Their routing, status codes, and authorisation
  // are covered end-to-end in routes/teams.spec.ts.

  { id: 'getHoursReport', method: 'GET', path: '/reports/hours', status: 200 },
] as const;

describe('openapi.yaml operations', () => {
  it('covers every documented operation', () => {
    // Guards against an endpoint being dropped from the table along with its route.
    expect(operations).toHaveLength(5);
  });

  for (const { id, method, path, status } of operations) {
    it(`${id}: ${method} ${path} → ${status}`, async () => {
      const res = await app.request(path, { method });
      expect(res.status).toBe(status);
    });
  }

  for (const { id, method, path, status } of operations) {
    if (status === 204) {
      it(`${id}: ${method} ${path} sends no body`, async () => {
        const res = await app.request(path, { method });
        expect(await res.text()).toBe('');
      });
    } else {
      it(`${id}: ${method} ${path} sends JSON`, async () => {
        const res = await app.request(path, { method });
        expect(res.headers.get('content-type')).toContain('application/json');
      });
    }
  }
});

describe('unrouted requests', () => {
  it('returns the ErrorResponse envelope for an unknown path', async () => {
    const res = await app.request('/nope');

    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toContain('application/json');

    const body = (await res.json()) as { error: string };
    expect(typeof body.error).toBe('string');
  });

  it('returns 404 for a method the path does not define', async () => {
    // /health is defined for GET only and carries no data middleware, so a
    // DELETE exercises method-not-defined routing without touching the database.
    const res = await app.request('/health', { method: 'DELETE' });

    expect(res.status).toBe(404);
  });
});
