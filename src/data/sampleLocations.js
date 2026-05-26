const sampleLocations = {
  'us:new york': {
    baseScore: 78,
    facts: ['NYC has extensive public transit access.', 'Strong volume of community support organizations.'],
    news: ['City expanded anti-harassment transit reporting tools.']
  },
  'us:atlanta': {
    baseScore: 74,
    facts: ['Atlanta has active civil rights and advocacy organizations.', 'Large metro area with varied neighborhood safety profiles.'],
    news: ['Local groups launched a safe-night transportation campaign.']
  },
  'us:san francisco': {
    baseScore: 81,
    facts: ['High density of community support services.', 'City has longstanding LGBTQ+ support networks.'],
    news: ['New city grants support anti-discrimination outreach.']
  },
  'country:canada': {
    baseScore: 80,
    facts: ['National legal protections for many minority groups.', 'Safety conditions still vary by province and city.'],
    news: ['Federal reporting pathways for hate incidents were expanded.']
  },
  'country:mexico': {
    baseScore: 63,
    facts: ['Urban/rural safety varies significantly by region.', 'Localized sources are important for current risk context.'],
    news: ['Several states added local traveler safety information portals.']
  },
  default: {
    baseScore: 68,
    facts: ['No specific city/country profile found yet.', 'Score currently uses baseline and identity-weight model only.'],
    news: ['Add trusted sources to improve this location profile.']
  }
};

module.exports = {
  sampleLocations
};
