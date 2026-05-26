const express = require('express');
const path = require('path');
const { sampleLocations } = require('./data/sampleLocations');
const { sourceRegistry } = require('./data/sourceRegistry');
const { calculateSafety } = require('./services/safetyService');
const { normalizeLocation } = require('./services/locationService');
const { updateFromSources, resolveSourceUrls } = require('./services/agentUpdater');

const US_LAT_MIN = 24;
const US_LAT_MAX = 49.5;
const US_LNG_MIN = -125;
const US_LNG_MAX = -66;

async function reverseGeocode({ lat, lng }) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(lat),
    lon: String(lng)
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: {
      'User-Agent': 'moderngreenbook-starter/0.1'
    }
  });

  if (!response.ok) {
    throw new Error(`Reverse geocode failed: ${response.status}`);
  }

  return response.json();
}

function inferLocationFromCoordinates({ lat, lng }) {
  const inUsBounds = lat >= US_LAT_MIN && lat <= US_LAT_MAX && lng >= US_LNG_MIN && lng <= US_LNG_MAX;
  if (inUsBounds) {
    return {
      scope: 'city',
      city: 'Unknown City',
      country: 'United States',
      countryCode: 'us',
      lookupKey: 'us:unknown city'
    };
  }
  return {
    scope: 'country',
    city: null,
    country: 'Unknown',
    countryCode: '',
    lookupKey: 'country:unknown'
  };
}

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use('/vendor/leaflet', express.static(path.join(__dirname, '..', 'node_modules', 'leaflet', 'dist')));

  // Starter behavior: keep profiles in-memory for easy local iteration.
  // Replace with a persistent datastore for production usage.
  const locations = { ...sampleLocations };

  app.get('/api/safety', async (req, res) => {
    try {
      const lat = Number(req.query.lat);
      const lng = Number(req.query.lng);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return res.status(400).json({ error: 'lat and lng query params are required numbers.' });
      }

      const identities = String(req.query.identities || '')
        .split(',')
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

      let location;
      try {
        const geocode = await reverseGeocode({ lat, lng });
        location = normalizeLocation(geocode);
      } catch (_error) {
        location = inferLocationFromCoordinates({ lat, lng });
      }
      const locationData = locations[location.lookupKey] || locations.default;
      const safety = calculateSafety({ baseScore: locationData.baseScore, identities });

      return res.json({
        location,
        requestedIdentities: identities,
        safety,
        facts: locationData.facts,
        news: locationData.news
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Unable to evaluate safety for this location right now.',
        detail: error.message
      });
    }
  });

  app.post('/api/agent/update', async (req, res) => {
    try {
      const { sourceIds } = req.body || {};
      let sources;
      try {
        sources = resolveSourceUrls(sourceIds, sourceRegistry);
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      const result = await updateFromSources({ sources, locations });
      return res.json({
        success: true,
        ...result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  return app;
}

module.exports = {
  createApp,
  reverseGeocode,
  inferLocationFromCoordinates
};
