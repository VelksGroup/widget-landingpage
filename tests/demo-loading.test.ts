import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error', optimizeDeps: { noDiscovery: true } });
after(async () => vite.close());
const { fetchDemoBySlug } = await vite.ssrLoadModule('/src/demo/fetchDemo.ts') as typeof import('../src/demo/fetchDemo');

const site = {
  id: 'demo-1', slug: 'augusto-concept', status: 'published', locale: 'pt-PT', language: 'pt',
  identity: { companyName: 'Augusto Concept' }, content: { tagline: 'Teste' },
  contact: {}, proof: {}, accent: {}, conversion: { mode: 'quote', allowEmptySelection: true, primaryChannel: 'whatsapp' },
  og: { title: 'Teste', description: 'Teste', image: '' }, enable_three: false,
};

function mockClient(
  siteResponses: Array<{ data: typeof site | null; error: unknown }>,
  offeringsResponse: { data: unknown[] | null; error: unknown } = { data: [{ id: 'one', title: 'Pintura', selectable: true }], error: null },
  assetsResponse: { data: unknown[] | null; error: unknown } = { data: [{ id: 'hero', kind: 'hero', url: '/hero.jpg', sort_order: 0 }], error: null },
) {
  const calls: Array<{ table: string; filters: Array<[string, string]> }> = [];
  const client = {
    from(table: string) {
      const call = { table, filters: [] as Array<[string, string]> };
      calls.push(call);
      const query = {
        select() { return query; },
        eq(column: string, value: string) { call.filters.push([column, value]); return query; },
        maybeSingle() { return Promise.resolve(siteResponses.shift() ?? { data: site, error: null }); },
        order() { return Promise.resolve(table === 'demo_offerings' ? offeringsResponse : assetsResponse); },
      };
      return query;
    },
  };
  return { client: client as never, calls };
}

const options = (client: never) => ({ client, retryDelay: async () => {} });

test('published demo loads anonymously and keeps the published filter', async () => {
  const { client, calls } = mockClient([{ data: site, error: null }]);
  const result = await fetchDemoBySlug('augusto-concept', options(client));
  assert.equal(result.kind, 'found');
  if (result.kind === 'found') {
    assert.equal(result.demo.identity.companyName, 'Augusto Concept');
    assert.equal(result.demo.offerings.length, 1);
    assert.equal(result.demo.assets.length, 1);
  }
  assert.deepEqual(calls[0].filters, [['slug', 'augusto-concept'], ['status', 'published']]);
});

test('missing or unpublished demo stays inaccessible without retry', async () => {
  const { client, calls } = mockClient([{ data: null, error: null }]);
  assert.deepEqual(await fetchDemoBySlug('missing', options(client)), { kind: 'not_found' });
  assert.equal(calls.length, 1);
});

test('transient network error retries and recovers', async () => {
  const { client, calls } = mockClient([
    { data: null, error: { message: 'Failed to fetch' } },
    { data: site, error: null },
  ]);
  const result = await fetchDemoBySlug('augusto-concept', options(client));
  assert.equal(result.kind, 'found');
  assert.equal(calls.filter((call) => call.table === 'demo_sites').length, 2);
});

test('persistent transient error stops after three attempts', async () => {
  const { client, calls } = mockClient(Array.from({ length: 3 }, () => ({ data: null, error: { code: '503' } })));
  const result = await fetchDemoBySlug('augusto-concept', options(client));
  assert.equal(result.kind, 'error');
  if (result.kind === 'error') assert.deepEqual({ stage: result.stage, code: result.code, transient: result.transient }, { stage: 'site', code: '503', transient: true });
  assert.equal(calls.length, 3);
});

test('non-transient Supabase error does not retry', async () => {
  const { client, calls } = mockClient([{ data: null, error: { code: '42501', message: 'Permission denied' } }]);
  const result = await fetchDemoBySlug('augusto-concept', options(client));
  assert.equal(result.kind, 'error');
  if (result.kind === 'error') assert.equal(result.code, '42501');
  assert.equal(calls.length, 1);
});

test('failed offerings and assets are errors, not a missing or incomplete demo', async () => {
  for (const table of ['demo_offerings', 'demo_assets']) {
    const failed = { data: null, error: { code: '42501' } };
    const healthy = { data: [], error: null };
    const { client } = mockClient([{ data: site, error: null }], table === 'demo_offerings' ? failed : healthy, table === 'demo_assets' ? failed : healthy);
    const result = await fetchDemoBySlug('augusto-concept', options(client));
    assert.equal(result.kind, 'error');
    if (result.kind === 'error') assert.equal(result.stage, table === 'demo_offerings' ? 'offerings' : 'assets');
  }
});

test('an empty partial response is a loading error', async () => {
  const { client } = mockClient([{ data: site, error: null }], { data: null, error: null });
  const result = await fetchDemoBySlug('augusto-concept', options(client));
  assert.equal(result.kind, 'error');
  if (result.kind === 'error') assert.deepEqual({ stage: result.stage, code: result.code }, { stage: 'offerings', code: 'EMPTY_RESPONSE' });
});

test('a new user retry can recover after an exhausted load', async () => {
  const { client, calls } = mockClient([
    ...Array.from({ length: 3 }, () => ({ data: null, error: { code: '503' } })),
    { data: site, error: null },
  ]);
  assert.equal((await fetchDemoBySlug('augusto-concept', options(client))).kind, 'error');
  assert.equal((await fetchDemoBySlug('augusto-concept', options(client))).kind, 'found');
  assert.equal(calls.filter((call) => call.table === 'demo_sites').length, 4);
});
