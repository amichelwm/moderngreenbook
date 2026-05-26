# moderngreenbook

A starter application inspired by *The Negro Motorist Green Book* that provides safety context by location and identity.

## What this starter includes

- A clickable map UI (Leaflet + OpenStreetMap tiles)
- Identity profile selection (women, LGBTQ+, religious minorities, latinx, Black)
- Safety lookup API:
  - **US locations** are normalized at **city** level
  - **Non-US locations** are normalized at **country** level
- Starter "agentic updater" endpoint that ingests configured source IDs and merges updated location data
- Sample city/country data, news items, and facts

## Run locally

```bash
npm install
npm test
npm start
```

Then open `http://localhost:3000`.

## API

### `GET /api/safety?lat=<number>&lng=<number>&identities=women,lgbtq`

Returns:

- resolved location scope (`city` for US, `country` otherwise)
- safety score + label
- news + facts for that place

### `POST /api/agent/update`

Body:

```json
{
  "sourceIds": ["demo"]
}
```

This is a starter workflow for an agentic pipeline. It fetches JSON records from configured HTTPS sources in `src/data/sourceRegistry.js` and merges them into the in-memory dataset.
