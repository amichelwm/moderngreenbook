const test = require('node:test');
const assert = require('node:assert/strict');
const { sanitizeRecord, validateSourceUrl, resolveSourceUrls } = require('../src/services/agentUpdater');

test('sanitizeRecord normalizes key and defaults missing fields', () => {
  const record = sanitizeRecord({ key: 'US:AUSTIN' });
  assert.deepEqual(record, {
    key: 'us:austin',
    baseScore: 68,
    facts: [],
    news: []
  });
});

test('sanitizeRecord rejects invalid records', () => {
  assert.equal(sanitizeRecord(null), null);
  assert.equal(sanitizeRecord({}), null);
});

test('validateSourceUrl accepts https public URL', () => {
  assert.doesNotThrow(() => validateSourceUrl('https://example.com/feed.json'));
});

test('validateSourceUrl rejects insecure and localhost URLs', () => {
  assert.throws(() => validateSourceUrl('http://example.com/feed.json'));
  assert.throws(() => validateSourceUrl('https://localhost/feed.json'));
  assert.throws(() => validateSourceUrl('https://127.0.0.1/feed.json'));
});

test('resolveSourceUrls resolves IDs from registry', () => {
  const urls = resolveSourceUrls(['demo'], { demo: 'https://example.com/feed.json' });
  assert.deepEqual(urls, ['https://example.com/feed.json']);
});

test('resolveSourceUrls rejects unknown IDs', () => {
  assert.throws(() => resolveSourceUrls(['missing'], { demo: 'https://example.com/feed.json' }));
});
