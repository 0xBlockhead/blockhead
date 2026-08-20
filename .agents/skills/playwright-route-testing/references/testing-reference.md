## Testing

- Vitest (`pnpm run test:unit`, or `pnpm test` for unit + Playwright): configured in `vite.config.ts` as two projects:
	- client (browser + Playwright provider): `src/**/*.svelte.{test,spec}.{js,ts}` (excludes `src/lib/server/**`)
	- server (node): `src/**/*.{test,spec}.{js,ts}` excluding the svelte browser test glob above
- Playwright E2E (`pnpm run test:e2e`): `playwright.config.ts` uses `testMatch: '**/*.e2e.{ts,js}'` and starts preview via `npm run build && npm run preview` on port 4173.

### Playwright E2E — placement and naming

- Co-locate with the route under test: put `*.e2e.ts` in the same folder as that route’s `+page.svelte` / `+layout.svelte` (e.g. `src/routes/(explore)/proposals/proposals.e2e.ts` beside `+page.svelte`).
- Do not use a `+` prefix on E2E files (e.g. not `+page.e2e.ts`). SvelteKit treats `+`-prefixed files as route modules and will error.
- File names only need to match `**/*.e2e.ts` — e.g. `proposals.e2e.ts` or `page.svelte.e2e.ts` (demo). Pick a name that identifies the route when many tests live nearby.
- Invoking tests: prefer a stable fragment (e.g. `pnpm exec playwright test proposals.e2e`) so shells do not have to quote path segments with parentheses like `(explore)`.

### Playwright E2E — `data-e2e`

- Add `data-e2e="…"` sparingly for one-off nodes used only by E2E (not for layout/theme). Prefer `getByRole` / label / text / stable `id` / `#main` / `class` selectors / `data-scroll-marker-label` (carousel sections) first. Examples: `#network-summary-head-block` and `.network-view-carousel-groups` / `.network-view-collapsible-*` on `NetworkView.svelte` (replacing scattered `data-e2e` on the same layout); `#nav-menu` (`Navigation.svelte`).

### Playwright E2E — assertions

- `<details>` / collapsed UI: Copy inside a closed `<details>` (or similar) is often attached but not visible to Playwright. For “data loaded” checks on that content, prefer `expect(locator).toBeAttached()` (optionally with a long `timeout`) instead of relying only on `toBeVisible()`.
- Resolver / network latency: Pages backed by `resolveEntity` or external HTTP may need timeouts on the order of minutes (e.g. `120_000` ms) for the “settled” assertion, while still asserting a cheap invariant first (nav link, layout chrome).
- Success vs failure: When the UI shows either a happy path or an explicit error string, use `.or()` on locators and assert one branch is attached once the async work finishes.

### Playwright E2E — cross-route matrix

- **`tests/e2e/route-matrix.e2e.ts`** is the one owner for shell (`#main`), canonical URL, settlement, runtime diagnostics, and boundary failure across discovered `+page` routes (`tests/e2e/_routeDiscovery.ts`).
- Modes, not separate suites: `pnpm run test:e2e:boundaries` (parallel matrix + verbose artifacts), `pnpm run test:e2e:failfast` (`E2E_FAILFAST=1` serial stop-on-first), `E2E_PROBE_PATH`, `E2E_PATH_PATTERN` / `E2E_PATH_LIMIT` / shards / `E2E_START_PATH`, `E2E_MATRIX_ARTIFACTS=0`.
- Distinct remaining scenario tests: CORS (`cors-policy.e2e.ts`), persistence (`tanstack-db-persistence.e2e.ts`), TanStack cold-cache/navigation-stress (`tanstack-cache-pages.e2e.ts`), raw-payload ban (`app-generated-routes.e2e.ts`).

### Playwright E2E — CORS policy

- **`pnpm run test:e2e:cors`** — `tests/e2e/cors-policy.e2e.ts` walks **every discovered `+page` route** (same `_routeDiscovery.ts` as the route matrix), uses `waitUntil: 'load'`, `assertMainSettled`, optional `networkidle`, then a **quiet window** (`E2E_CORS_QUIET_MS`, default 4s) so late resolver fetches surface CORS console errors. Other e2e suites filter that copy as upstream noise; this suite is the dedicated regression gate.
- Subset: `E2E_PATH_LIMIT=20 pnpm run test:e2e:cors`. Single route: `E2E_PROBE_PATH=/network/eip155:1 pnpm exec playwright test tests/e2e/cors-policy.e2e.ts -g "probe route"`.
- **Fix pattern (browser client code):** never bare `fetch('https://…')` for provider HTTP when the origin is not browser-CORS-safe. Use `getJson` / `getText` / exported **`corsFetch`** from `$/lib/http.ts` with either:
	- **`origins`:** readonly `SourceOrigin[]` from the provider definition (`origin` + `corsEnabled`) — same list seeds `/api-proxy/` allow-list in `hooks.server.ts`; or
	- **`corsEnabled: false`:** escape hatch for one-off absolute URLs (still requires the origin on a provider `origins` row for proxying).
- **`corsEnabled` must match reality** — if the browser console shows CORS blocks for an origin marked `true`, flip it to `false` and route through the proxy. Catalog execution RPC hosts: `$/constants/ExecutionRpcOrigins.ts` (Voltaire provider + `jsonRpc` client).
- When `corsEnabled: false`, the browser routes through `/api-proxy/{absoluteUrl}`; SSR keeps direct `fetch`. When `corsEnabled: true`, the browser uses direct cross-origin `fetch` (public RPCs, CORS-enabled APIs).
- Adding a new proxied host: extend the provider’s `origins` in `src/sources/<Provider>/index.ts` (or shared constants), then wire the transport client through `corsFetch` / `getJson`.
