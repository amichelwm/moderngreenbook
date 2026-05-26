const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeLocation } = require('../src/services/locationService');

test('normalizeLocation uses city scope for US', () => {
  const location = normalizeLocation({
    address: {
      country_code: 'us',
      city: 'Atlanta',
      country: 'United States'
    }
  });

  assert.equal(location.scope, 'city');
  assert.equal(location.lookupKey, 'us:atlanta');
});

test('normalizeLocation uses country scope for non-US', () => {
  const location = normalizeLocation({
    address: {
      country_code: 'ca',
      city: 'Toronto',
      country: 'Canada'
    }
  });

  assert.equal(location.scope, 'country');
  assert.equal(location.lookupKey, 'country:canada');
});
