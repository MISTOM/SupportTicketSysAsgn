import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { Server } from 'node:http';
import 'dotenv/config';

const testDatabaseUrl = process.env['TEST_DATABASE_URL'];
if (!testDatabaseUrl) {
  throw new Error('Set TEST_DATABASE_URL to a dedicated PostgreSQL test database before running tests');
}
process.env['DATABASE_URL'] = testDatabaseUrl;

const [{ default: app }, { db }] = await Promise.all([
  import('./app'),
  import('./prisma/db'),
]);

let server: Server;
let baseUrl: string;
const createdIds: string[] = [];

before(async () => {
  server = app.listen(0);
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Could not determine the test server address');
  }
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  try {
    for (const id of createdIds) {
      await db.orm.public.Ticket.where({ id }).delete();
    }
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    await db.close();
  }
});

test('creates a ticket with default status and priority', async () => {
  const response = await fetch(`${baseUrl}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'API test ticket', description: 'Created by an integration test' }),
  });
  const ticket = await response.json();

  assert.equal(response.status, 201);
  createdIds.push(ticket.id);
  assert.equal(ticket.title, 'API test ticket');
  assert.equal(ticket.description, 'Created by an integration test');
  assert.equal(ticket.status, 'open');
  assert.equal(ticket.priority, 'low');

  const getResponse = await fetch(`${baseUrl}/tickets/${ticket.id}`);
  const fetchedTicket = await getResponse.json();

  assert.equal(getResponse.status, 200);
  assert.equal(fetchedTicket.id, ticket.id);
  assert.equal(fetchedTicket.title, ticket.title);
});

test('rejects a ticket without a title', async () => {
  const response = await fetch(`${baseUrl}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: 'No title' }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'title is required' });
});

test('returns ticket counts grouped by status', async () => {
  const beforeResponse = await fetch(`${baseUrl}/tickets/stats`);
  const beforeStats = await beforeResponse.json();

  const createResponse = await fetch(`${baseUrl}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Stats API test ticket', status: 'in_progress' }),
  });
  assert.equal(createResponse.status, 201);
  const createdTicket = await createResponse.json();
  createdIds.push(createdTicket.id);

  const statsResponse = await fetch(`${baseUrl}/tickets/stats`);
  const stats = await statsResponse.json();

  assert.equal(statsResponse.status, 200);
  assert.equal(stats.open, beforeStats.open);
  assert.equal(stats.in_progress, beforeStats.in_progress + 1);
  assert.equal(stats.closed, beforeStats.closed);
});
