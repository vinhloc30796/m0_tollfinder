### Development — Worker + WASM + D1 (local)

This project uses a Cloudflare Worker with a WebAssembly module for compute (p95/availability) and D1 for storage. Follow these steps to run locally and see data in your local D1 database.

#### Prerequisites
- Node.js 18+, `pnpm`
- Wrangler v4 (`pnpm dlx wrangler --version`)
- TinyGo for building WASM (`tinygo version`)

#### 1) Apply D1 migrations
```bash
pnpm d1:migrate
```

This creates the required tables (e.g., `metrics_raw`, `metrics_agg`).

#### 2) Configure environment variables

Vars are defined in `apps/wrangler.jsonc` under `vars`. Update endpoint URLs as needed:
```jsonc
"vars": {
  // Endpoints to probe (comma-separated keys)
  "HL_ENDPOINTS": "ticker,orderbook,trades",
  // Provide URLs for each key above
  "HL_TICKER_URL": "https://example.com/api/ticker",
  "HL_ORDERBOOK_URL": "https://example.com/api/orderbook",
  "HL_TRADES_URL": "https://example.com/api/trades",
  // Optional region tag stored in the DB
  "REGION": "local"
}
```

Set the secret token used by the ingestion endpoint (for `/ingest` route):
```bash
wrangler secret put INGEST_TOKEN --config apps/wrangler.jsonc
# e.g., enter: dev
```

#### 3) Run the Worker locally with cron
```bash
wrangler dev --config apps/wrangler.jsonc --persist --test-scheduled
```

Notes:
- `--persist` enables a local D1 SQLite database under `.wrangler`.
- `--test-scheduled` triggers the cron handler on startup; it also runs per the schedule (every minute).

#### 4) Inspect local D1 data
```bash
pnpm d1:stdin
-- then in the sqlite shell:
SELECT * FROM metrics_raw  ORDER BY ts_ms DESC LIMIT 5;
SELECT * FROM metrics_agg  ORDER BY ts_ms DESC LIMIT 5;
```

#### 5) Manually trigger cron during local dev
You can test scheduled events without waiting for the minute tick by hitting the special route exposed by Wrangler or the Cloudflare Vite plugin:

```bash
# Trigger once (Wrangler dev default port)
curl "http://localhost:5173/cdn-cgi/handler/scheduled"

# Trigger with an explicit cron pattern
curl "http://localhost:5173/cdn-cgi/handler/scheduled?cron=*+*+*+*+*"

# Trigger with an explicit time (epoch seconds)
curl "http://localhost:5173/cdn-cgi/handler/scheduled?cron=*+*+*+*+*&time=1745856238"
```

If you are using the Cloudflare Vite plugin dev server directly, replace the port (e.g., `5173`) as needed.

#### 6) Useful endpoints during dev
- Health: `GET /health`
- Snapshot (for Grafana/tests): `GET /snapshot?endpoint=ticker&window=30m`
- Ingest (optional manual test): `POST /ingest` with `Authorization: Bearer <INGEST_TOKEN>` and body `[{ ts_ms, endpoint, p95_ms, availability_pct, samples, region }]`.

#### Troubleshooting
- If WASM fails to load, ensure `pnpm cron:build` ran and `wasm_modules.METRICS_WASM` path matches `dist/compute/metrics.wasm`.
- If no rows appear, verify your `HL_*_URL` values are reachable and `HL_ENDPOINTS` keys match the provided URLs.
- Re-run `wrangler dev` with `--test-scheduled` to trigger the cron immediately.


