function toLookupKey(geo) {
  if (geo.countryCode === 'us') {
    return `us:${geo.city.toLowerCase()}`;
  }
  return `country:${geo.country.toLowerCase()}`;
}

function normalizeLocation(reverseGeocodeResponse) {
  const address = reverseGeocodeResponse.address || {};
  const countryCode = (address.country_code || '').toLowerCase();
  const city = address.city || address.town || address.village || address.county || 'unknown';
  const country = address.country || 'unknown';

  if (countryCode === 'us') {
    return {
      scope: 'city',
      city,
      country,
      countryCode,
      lookupKey: `us:${city.toLowerCase()}`
    };
  }

  return {
    scope: 'country',
    city: null,
    country,
    countryCode,
    lookupKey: `country:${country.toLowerCase()}`
  };
}

module.exports = {
  normalizeLocation,
  toLookupKey
};
