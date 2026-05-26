const test = require('node:test');
const assert = require('node:assert/strict');
const { inferLocationFromCoordinates } = require('../src/app');

test('inferLocationFromCoordinates returns US city scope inside US bounds', () => {
  const location = inferLocationFromCoordinates({ lat: 33.749, lng: -84.388 });
  assert.equal(location.scope, 'city');
  assert.equal(location.country, 'United States');
  assert.equal(location.lookupKey, 'us:unknown city');
});

test('inferLocationFromCoordinates returns country scope outside US bounds', () => {
  const location = inferLocationFromCoordinates({ lat: 51.507, lng: -0.127 });
  assert.equal(location.scope, 'country');
  assert.equal(location.country, 'Unknown');
});
