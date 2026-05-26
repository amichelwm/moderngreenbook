const net = require('node:net');

function isPrivateHost(hostname) {
  const lowerHost = hostname.toLowerCase();
  if (lowerHost === 'localhost') return true;

  const ipVersion = net.isIP(lowerHost);
  if (ipVersion === 4) {
    const [a, b] = lowerHost.split('.').map(Number);
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
  }
  if (ipVersion === 6 && lowerHost === '::1') return true;

  return false;
}

function validateSourceUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch (_error) {
    throw new Error(`Invalid source URL: ${value}`);
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('Source URL must use https.');
  }

  if (isPrivateHost(parsed.hostname)) {
    throw new Error('Private or localhost source URLs are not allowed.');
  }
}

function sanitizeRecord(record) {
  if (!record || typeof record !== 'object' || typeof record.key !== 'string') return null;
  return {
    key: record.key.toLowerCase(),
    baseScore: typeof record.baseScore === 'number' ? record.baseScore : 68,
    facts: Array.isArray(record.facts) ? record.facts : [],
    news: Array.isArray(record.news) ? record.news : []
  };
}

async function fetchSourceRecords(url) {
  validateSourceUrl(url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch source ${url}: ${response.status}`);
  }
  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error(`Invalid source format for ${url}: expected array`);
  }
  return payload.map(sanitizeRecord).filter(Boolean);
}

async function updateFromSources({ sources, locations }) {
  let updatedCount = 0;
  for (const source of sources) {
    const records = await fetchSourceRecords(source);
    for (const record of records) {
      locations[record.key] = {
        baseScore: record.baseScore,
        facts: record.facts,
        news: record.news
      };
      updatedCount += 1;
    }
  }
  return { updatedCount };
}

module.exports = {
  updateFromSources,
  sanitizeRecord,
  validateSourceUrl
};
