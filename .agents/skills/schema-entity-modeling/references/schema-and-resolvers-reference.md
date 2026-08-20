## Schema (`src/schema/**`)

Definitions in `$/schema/*.ts`; register in `$/schema/index.ts`. Entity definitions declare `selectors` before `fields`. Selectors are the only entity-addressing contract; there is no entity-level `id`, `identities`, or `lookups`. ArkType types selector fields and primitives; child rows use `$$…` entity-reference fields.

- Selectors represent unique entity-identifying field sets. Interop identifiers are separate selectors when they identify the same entity, not required payload fields on other selectors. If two selectors are derivable from each other, represent that with resolved fields and pure synchronous selector derivation/resolvers so the client can equate requests by the fields already resolved.
- Async/provider resolvers should use the most straightforward selector representation for that source. Do not repeat purely derivable interop calculations in every provider resolver when a pure synchronous selector resolver covers the transform.
- `EntityFieldCardinality.Zero` is a domain statement: assuming the field is resolvable, no value is acceptable and accurate for the subject matter. Never use `Zero` to mean a resolver/source may or may not support a field. If a resolver supports a field, its logic owns resolving that field's cardinality; unsupported fields are represented by absent resolver facets, not by schema cardinality.
- App views must treat schema cardinality as the resolved field contract: `One` fields render directly; `ZeroOrOne` fields may conditionally render based on absence; `Many` fields render as lists and condition sections on `.values.length`, not field existence. Keep optional chaining / `??` only where the schema or value type genuinely permits absence, and reserve value checks such as `null`, empty string, zero amount, or enum-specific cases for domain display semantics.
- Timestamped observations: As-of metrics (quotes, gas tiers, mempool counts, OHLC, …) live on `*_Timestamp` entities (`timestampMs` in the id; extra id keys when needed, e.g. `feedKey?`, candle `timeInterval`). Parents hold stable identity only—no snapshot scalars such as `price` or tiered gas on the header row. If an endpoint’s stats are deterministic for the entity id itself, such as Beaconcha.in epoch overview stats keyed by epoch rather than an observation time, model those fields on the owning entity instead of inventing a timestamp row.
- Resolvers / views: use one `defineResolver` per snapshot, with `fields` selectors for entity fields, list refs, counts, and live facets. When upstream exposes one stats clock, the timestamp selector field must match it. Latest row: sort `$$…` by `timestampMs`, nest `*_TimestampView`; history: `*_TimestampsView`.
- Examples: `MarketPrice` / `$$quotes` → `Market_Timestamp`; `Coin` / `$$timestamps` → `Coin_Timestamp`; `Market` → `Market_Timestamp`, `Market_TimeInterval_Timestamp`; `Network` / `$$gasEstimateTimestamps` → `Network_GasEstimate_Timestamp`, `$$txpoolTimestamps` → `Network_Txpool_Timestamp`; `Currency` / `$$timestamps` → `Currency_Timestamp`.
- Lifecycle timestamps: `createdAt`, `updatedAt`, etc. on sessions, social, bridges, ENS stay on the owning record—they are not metric streams.

Market graph notes: `$/constants/Market.ts`. Quote / OHLC UI: Entity views — Lens, liquidity, markets.


## Resolvers (`src/resolvers/**`)

Resolvers are the bridge between `sources/` and the TanStack DB collections.

	- Module shape:
		- Use `defineResolver` from `$/resolvers/$resolvers.ts`.
		- Each provider module exports only `default { source, resolvers }`; do not export individual resolvers for other modules to call.
	- Register new modules in `$/resolvers/index.ts`; each default export includes `source: Source`, and the registry filters modules by `enabledSources` from `$/sources/index.ts`.
- Source boundary:
	- Put all `fetch` / HTTP / provider transport logic under `src/sources/**`. Resolvers call source query functions; they do not fetch external URLs directly.
	- **singleFlight:** Do not use in `src/sources/**` (plain async `queries.ts` exports only—no `*Once` helpers or `export const x = singleFlight(fn)`). In `src/resolvers/**`, dedupe at the call site with `await singleFlight(queryFn)(...)`; do not bind `singleFlight(queryFn)` to a module-level constant.
	- In resolvers, do not top-level import `$/sources//queries.ts` or `$/sources//constants.ts`; load them with inline `await import(...)` inside each `resolve(...)`.
	- Resolver-only type imports for wire payloads should prefer `$/sources/**/types.ts` (or generated OpenAPI components), not `queries.ts`.
		- `ResolverContext` (from `$/resolvers/$resolvers.ts`) includes `publicEnv`, the per-source slice from `resolverPublicEnvBySource` or full `resolverPublicEnv`. `$/collections/$collections.ts` passes it on every `resolve()` call; prefer `context.publicEnv` over `import.meta.env` so behavior matches source gating.
	- Thread `context` into source queries when the upstream API supports filtering, sorting, or limits (`filters` / `sorts` / `limit`).
- Resolver boundaries:
	- `resolve(...)` returns schema-shaped field data, not raw wire payloads.
	- Keep resolver modules shaped around resolver entries, not shared mapper layers. Put source-to-schema mapping inline in the relevant `resolve(...)` body unless a helper is clearly justified and explicitly approved.
	- Prefer resolver bodies that visibly read as: validate supported scope, call the owning source query, return schema-shaped fields. Avoid wrapping / unwrapping / grouping / ungrouping indirection unless it is genuine domain normalization or shared transport behavior.
	- Trust generated/manual wire types, parser output, schema `ZeroOrOne`, and catalog types. Keep field omission and simple normalization at the return object: `...(value != null && { field: value })`. Avoid generic `optional*`, `finite*`, or runtime validation helpers around already typed values, and avoid calling the same parser/normalizer twice inside one spread.
- Do not add trivial id/entity constructor helpers (e.g. `fooEntityRef`, `barFromWireId`) that only wrap `{ [EntityMetaKey.Id]: { … } }` or a one-line null check. Inline those at the call site in `resolve` / field resolvers.
- Shared transport behavior belongs in `src/sources/**`; `src/lib/**` is only for cross-domain helpers that clear the 90% confidence bar.
- Do not use `typeof` / `Array.isArray` / similar runtime shape checks on provider wire data when generated or hand-written **wire types** already define the field (gql.tada fragments, OpenAPI components, `types.ts` aliases). Prefer null/empty checks, optional chaining, and domain validators (`hexLowerOfByteSize`, ArkType at boundaries). Same bar as **Linting and quality → Runtime shape guards**; `typeof` remains for environment probes (`window`, `document`, `globalThis`) and genuinely untyped scalars (e.g. GraphQL `BigInt` as `unknown` until normalized with `BigInt(String(value))`, not `typeof value === 'string'`).
- One resolver should make one primary upstream source request whenever feasible.
- Do not create resolver waterfalls. If a second request enriches only a specific field, move that work to a field resolver or the owning `sources/**/queries.ts` function.
- Do not call another resolver's `resolve(...)`. If two resolvers need the same provider data, both should call the appropriate source query, or the shared transport logic belongs in `src/sources/**`.
- **`Source.Constants_Internal`:** Checked-in catalogs in `src/constants/**` are the snapshot. Load them with inline `await import(...)` and return lookup hits; throw when the id is missing. Small synchronous joins from other catalog lookup maps are OK when a schema row is a view over linked catalog rows, but keep that logic visible in the specific resolver body or build it into the canonical catalog row. Do not add RPC or other remote fetches to fill gaps in static catalog fields at resolve time. Do not extract catalog resolve/enrich/denormalize layers into `src/lib/**` or module-scope helpers, and avoid `Promise.all` over catalog lists only to backfill static fields—build those fields when the catalog rows are constructed.
	- Entity snapshots vs field facets:
		- A resolver owns one snapshot fetch for an entity type and exposes entity fields through its `fields` selectors.
		- Field facets that return many entities should normally return entity IDs / references, not fully mapped child entities.
		- Use field facets for truly field-scoped data only; avoid repeating identical endpoint calls across many fields for one entity.
		- Entity field collections apply the same optional `Source` filter as entity collections when the live query includes a `Source` `in` clause, so field facets for disabled or filtered-out sources are not invoked.
	- Failure behavior:
		- A declared field facet is a compatibility promise. Do not declare a field facet that can only throw `unsupported`, `not implemented`, or “wrong selector” for the source surface. Omit unsupported facets from the resolver `fields` map.
		- Throw when a schema-valid selector is invalid for the resolver’s domain slice, such as the wrong chain family, market kind, realm/category, id shape, or provider mapping for this source. These are invalid selector requests for that resolver, not empty results.
		- For declared many-field facets, return `[]` when the source successfully determines that this supported parent has no child rows. Do not return `[]` for fetch/parse/auth failures, unsupported source scope, missing required source mapping, or a facet that the source never supports.
		- Return `undefined` only for optional schema fields after a successful supported lookup confirms that the upstream has no value, or for documented auth-optional degradation where the resolver can still satisfy the optional field contract. Required scalar/source invariant failures throw.
		- Do not `catch` and return empty data. Rethrow or wrap with `{ cause }` and a source-prefixed message.
		- Do not return partial placeholder entity rows (e.g. only `{ epoch }` when header fetch was skipped, or `{}` when REST base is missing).
	- Error messages: `` `{Source}_{Transport}: <predicate>` `` (e.g. `` `Blockscout_Rest: no Blockscout v2 explorer for chain ${chainId}` ``, `` `Coingecko_OpenApi: OHLC is spot-only` ``). Reuse the message already thrown by a sibling resolver on that source when possible.
	- Selector parameters: destructure selector fields in resolver callbacks unless forwarding the whole selector unchanged to a source query or using it as an opaque selector key. Avoid repeated property drilling like `entitySelector.foo` when the callback uses individual fields.
	- Count facets:
		- `resolveCount` is authoritative only when the source exposes a count endpoint/value or the resolver has a complete unwindowed result set. Do not use a paginated/windowed page length as an authoritative count.
		- Counts are always explicit resolver capabilities. The client never infers `totalCount` from loaded list length; a resolver with a provably complete snapshot declares `resolveCount` directly.
	- Source support metadata: source/provider constants or binding modules should own statically known network, chain, transport, API-family, operation-group, and feature coverage. Export row-derived O(1) lookup maps such as `*ByChainId` / `*ByNetworkKey`; do not export per-call support functions or scan binding arrays in resolver hot paths. Resolver predicates should consume those maps so unsupported surfaces are filtered before they look like runtime resolver failures.
- Live resolvers:
		- Optional `resolveLive` on a `defineResolver` field facet or projection-scoped root publisher handles push-driven refresh from WebSockets or streams.
		- Keep `resolve` as the snapshot implementation.
		- Live publishers use projection-scoped `fields` handles to replace field/count rows or invalidate active Persisted collection subsets without clearing the previous rows on refresh failure.
		- The Persisted collection `loadSubset`/`unloadSubset` lifecycle mounts live publishers. Root publishers are shared by source, resolver, projection, publisher, and parent selector; the last subscriber aborts and cleans up exactly once.
	- One live resolver may publish or invalidate sibling fields in the same projection, such as Voltaire's `Network.Evm` block stream refreshing blocks, transactions, contracts, and blobs.
