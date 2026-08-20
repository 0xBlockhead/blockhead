# CORS policy

Run the dedicated policy suite with `pnpm run test:e2e:cors`. It walks every discovered page route, waits for settlement, and observes a quiet window for late resolver fetches.

Useful narrowing:

- `E2E_PATH_LIMIT=20 pnpm run test:e2e:cors`
- `E2E_PROBE_PATH=/network/eip155:1 pnpm exec playwright test tests/e2e/cors-policy.e2e.ts -g 'probe route'`

Browser client code must not use bare `fetch` for provider origins that are not browser-CORS-safe. Use `getJson`, `getText`, or `corsFetch` from `src/lib/http.ts` with provider `origins`, or the documented `corsEnabled: false` escape hatch.

`corsEnabled` describes the upstream origin's real browser behavior. A false value routes browser requests through `/api-proxy/{absoluteUrl}` while SSR fetches directly. The origin must still appear in provider metadata so the server allow-list can admit it.

Add proxied hosts to the provider's source metadata or the relevant shared execution-RPC catalog. Keep the transport client on `corsFetch`; do not solve a CORS failure in a view or route.
