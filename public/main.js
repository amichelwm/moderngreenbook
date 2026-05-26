const map = L.map('map').setView([39.8283, -98.5795], 4);
const results = document.getElementById('results');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker;

function selectedIdentities() {
  return Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map((node) => node.value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeListToHtml(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

map.on('click', async (event) => {
  const identities = selectedIdentities();
  const params = new URLSearchParams({
    lat: String(event.latlng.lat),
    lng: String(event.latlng.lng),
    identities: identities.join(',')
  });

  results.innerHTML = 'Loading safety context...';

  if (marker) {
    marker.remove();
  }
  marker = L.marker([event.latlng.lat, event.latlng.lng]).addTo(map);

  try {
    const response = await fetch(`/api/safety?${params.toString()}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unknown API error');

    const locationText =
      data.location.scope === 'city'
        ? `${data.location.city}, ${data.location.country}`
        : data.location.country;

    results.innerHTML = `
      <p><strong>Location:</strong> ${escapeHtml(locationText)} (${escapeHtml(data.location.scope)} scope)</p>
      <p><strong>Safety score:</strong> ${data.safety.score}/100 (${data.safety.level})</p>
      <p><strong>Selected identities:</strong> ${escapeHtml(data.requestedIdentities.join(', ') || 'none')}</p>
      <p><strong>Facts</strong></p>
      ${safeListToHtml(data.facts)}
      <p><strong>News</strong></p>
      ${safeListToHtml(data.news)}
    `;
  } catch (error) {
    results.innerHTML = `<p style="color:#b00;"><strong>Error:</strong> ${escapeHtml(error.message)}</p>`;
  }
});
