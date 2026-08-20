# Route matrix

`tests/e2e/route-matrix.e2e.ts` owns common coverage for routes discovered by `tests/e2e/_routeDiscovery.ts`.

Use the package scripts:

- `pnpm run test:e2e:boundaries` for the parallel matrix and verbose artifacts.
- `pnpm run test:e2e:failfast` for serial stop-on-first behavior.
- `E2E_PROBE_PATH=<path>` for one route.
- `E2E_PATH_PATTERN`, `E2E_PATH_LIMIT`, shards, and `E2E_START_PATH` for subsets.
- `E2E_MATRIX_ARTIFACTS=0` when artifacts are unnecessary.

Do not create another suite for shell, canonical URL, settlement, runtime diagnostics, or boundary failure. Distinct scenario owners include CORS, persistence, TanStack cold-cache and navigation stress, and the raw-payload ban.

For resolver-backed routes, assert cheap layout chrome first and allow the settled branch a timeout measured in minutes when upstream I/O requires it. If either data or an explicit error is permitted, combine the branches with locator `.or()` and require one to attach.
