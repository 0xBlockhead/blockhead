## Collections and data flow

Current data flow:

1. `$/schema/index.ts` registers entity definitions
2. `$/resolvers/index.ts` aggregates resolver modules
3. `$/routes/+layout.svelte` calls `createCollectionsFromSchema(...)` and exports the live collections
4. `$/views/`, `$/components/`, routes, and `$/collections/$queries.svelte.ts` consume those collections via `useLiveQuery`

Most live queries live in `.svelte` views, but there is also existing shared query state in `$/collections/$queries.svelte.ts`. Follow the nearest existing pattern instead of introducing a new abstraction layer just to satisfy a generic rule.

### TanStack DB OPFS persistence

`$/client/$client.svelte.ts` composes product TanStack DB collections in this order: `createCollection(...)` → `persistedCollectionOptions(...)` → `queryCollectionOptions(...)` for Entity/Field/Count Persisted collection, plus a local-only persisted `LoadedSubset` collection for durable subset-completion metadata.

Built-in TanStack behavior:

- `queryCollectionOptions({ syncMode: 'on-demand' })` turns each live-query subset into a TanStack Query observer and gives the query function `meta.loadSubsetOptions`.
- `persistedCollectionOptions(...)` hydrates matching rows from OPFS before delegating to the upstream on-demand loader.
- TanStack owns query keys, stale/cache state, row persistence, row ownership metadata for non-empty query results, collection metadata persistence, and OPFS hydration.
- `persistedGcTime: Number.POSITIVE_INFINITY` and `staleTime: Number.POSITIVE_INFINITY` mean persisted rows and query results should not expire during normal app use. Keep both infinite unless a replacement refresh/expiry path is verified against warm reloads; a finite `staleTime` has previously caused immediate warm-reload refetches.

Local collection query behavior:

- TanStack’s persisted wrapper still invokes each Persisted collection `queryFn` after OPFS hydration. The query function must therefore return hydrated rows or row-count-validated loaded-marker completion before resolver work when the requested completed subset is already durable.
- Entity/Field/Count `queryFn`s wait for `LoadedSubset` hydration, check matching Persisted collection rows, and only run resolvers when durable rows/markers cannot satisfy the subset. For Field and Count collection `queryFn`s, hydrated rows satisfy a request only when every requested compatible source is represented; lower-priority hydrated rows must not suppress a missing higher-priority compatible source. A nonzero loaded marker never proves a nonempty subset by itself; it can suppress resolver work only when the matching persisted row count is present. For rendered Count results, resource readiness must at least be priority-complete: do not settle from a lower-priority Count Row while an earlier compatible count source is still missing.
- After every successful remote subset load, including successful zero-row and partial-source-result loads, the query function writes a `LoadedSubset` row keyed by `collectionId` plus the canonical loaded key plus `rowCount`, and awaits OPFS persistence. This is required because Persisted collection rows alone cannot represent “this subset loaded and returned zero rows” or “this compatible source completed with no row,” while the row count prevents a marker from hiding missing persisted nonempty rows after reload.
- For a given page URL, the first fresh-browser load may run resolver-backed network work through Persisted collections. A refresh of that same page must resolve from persisted TanStack DB Persisted collection for every subset completed during the cold load, without replaying the same resolver-backed `collectionId` + `loadedKey` network work or the same catalog HTTP. New work is legitimate only when the warm page requests a subset that the cold load never completed.
- Keep collection query functions typed from package-provided TanStack types where possible, especially `LoadSubsetOptions` and TanStack Query Collection metadata. Avoid duplicating sync param/result shapes locally unless package types cannot express the boundary.
- Do not replace this collection-level logic with route/view-specific guards, manual preloads, in-memory caches, or raw provider-response persistence unless the Persisted collection invariant is explicitly changed.

Verification:

- Use `tests/e2e/tanstack-db-persistence.e2e.ts` for OPFS persistence checks. It clears OPFS, installs the client persistence probe (`window.__blockheadPersistenceProbe` / sessionStorage), cold-loads every discovered `+page` route, records cold `markLoaded` events, refreshes the same page, and asserts completed Entity/Field/Count Persisted collection subsets hydrate from OPFS without warm `remote` replay for the same `collectionId` + `loadedKey` or repeated catalog HTTP. The same file also keeps the direct `$client` EVM network probe and schema-version invalidation proof.
- **CI / pre-merge gate:** `pnpm run test:e2e:persistence` is the focused persistence gate with a dedicated dev server. For all discovered pages, run `E2E_PATH_PATTERN='.' pnpm run test:e2e:persistence`. Focus a single route with `E2E_PROBE_PATH=/network/eip155:1 pnpm exec playwright test tests/e2e/tanstack-db-persistence.e2e.ts -g "probe route"` or slice with `E2E_PATH_LIMIT=20`.
- Real-network suites may need provider-specific noise filtering for unrelated upstream 400/404/422/fetch failures.
- Current focused status must include the route-matrix refresh assertion. A narrow probe is acceptable while debugging only when the follow-up all-route gate is still required before closing persistence work.

Regression history (do not reintroduce):

1. **Finite `staleTime` / `persistedGcTime`** — TanStack Query background refetch bypasses `persistOnDemandSubsets` and repeats resolver HTTP on warm reload. Keep both `Number.POSITIVE_INFINITY` in `$collections.ts` unless a replacement refresh path is verified with `test:e2e:persistence`.
2. **`collectionSnapshotHasChanges` short-circuit without `everyListedSourceHydrated`** ([coins / `$$coins` thread](9bcb00da-fbfa-409d-8b45-31c2ec5ef194)) — Constants-only rows could satisfy a limited ordered snapshot while Coingecko (or other `Source in (…)`) never loaded; wrapper returned `true` and skipped remote fetch forever. Fix: require `everyListedSourceHydrated` before short-circuiting on snapshot changes; multi-source live queries must list **enabled** sources only (disabled providers never produce rows → subset never “complete”).
3. **Unfiltered catalog subsets** — Global `$$networks` and similar lists have `filters.length === 0`; `collectionHasHydratedSubset` alone is insufficient. `markLoaded()` must persist the `blockhead:loaded-subset:…` metadata marker after a successful remote load.
4. **`schemaVersion` bumps** (`+layout.svelte`) — intentional OPFS wipe; first visit after bump will refetch catalogs. Bump only when persisted row shape changes, not for unrelated features.
5. **Stale reused Vite dev server during Playwright** — `playwright.config.ts` notes mid-HMR `.svelte-kit/generated` can 500; use `PLAYWRIGHT_DEDICATED_SERVER=1` (or stop port 5173) for persistence runs. Page-wide warm reloads must not repeat resolver-backed work completed by the cold load; use the persistence probe’s `collectionId` + `loadedKey` replay check as the authoritative signal, with repeated catalog HTTP as an additional failure.
6. **Live `resolveLive` invalidations** — Voltaire block streams invalidate head block / tx lists; that is expected live refresh, not catalog persistence failure. Do not confuse with Chainlist / EthereumLists refetch.

Change checklist (any edit touching collections, layout persistence, or catalog field queries):

- Run `pnpm run test:e2e:persistence` after `$collections.ts`, `schemaVersion`, or Chainlist / EthereumLists field resolver changes.
- Never remove or route-around `persistOnDemandSubsets`; do not add view-local “already loaded” guards instead.
- New `Source in (…)` multi-provider field lists: filter to `enabledSources`; verify each listed source can hydrate rows for the subset.
- After schema/id shape changes: bump `schemaVersion` once and re-verify cold + warm reload.


---

## TanStack DB queries

- LIMIT and OFFSET require an ORDER BY clause to ensure deterministic results
