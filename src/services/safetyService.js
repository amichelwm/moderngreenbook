const identityWeights = {
  women: -4,
  lgbtq: -5,
  religious: -3,
  latinx: -4,
  black: -5
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function safetyLabel(score) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'moderate';
  return 'low';
}

function calculateSafety({ baseScore, identities = [] }) {
  const adjustment = identities.reduce((total, identity) => {
    return total + (identityWeights[identity] || 0);
  }, 0);

  const score = clamp(baseScore + adjustment, 0, 100);
  return {
    score,
    level: safetyLabel(score),
    adjustment
  };
}

module.exports = {
  calculateSafety,
  identityWeights,
  safetyLabel
};
