const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateSafety, safetyLabel } = require('../src/services/safetyService');

test('calculateSafety applies identity adjustments', () => {
  const result = calculateSafety({ baseScore: 80, identities: ['women', 'lgbtq'] });
  assert.equal(result.adjustment, -9);
  assert.equal(result.score, 71);
  assert.equal(result.level, 'moderate');
});

test('safetyLabel returns expected buckets', () => {
  assert.equal(safetyLabel(85), 'high');
  assert.equal(safetyLabel(65), 'moderate');
  assert.equal(safetyLabel(20), 'low');
});
