## Sources (`src/sources/**`)

The repo uses `src/sources/**` for external I/O, source metadata registration, generated wire artifacts, proxy/live delivery metadata, and provider transport code.

Source binding model:

- `SourceProvider` is the owner/operator/project/local subsystem.
- `Source` is resolver-visible provenance and source-priority identity. It is not an endpoint, API family, generated client, or browser delivery mode.
- `SourceBinding` is the executable join across independent axes: `source`, `target`, `endpoints`, `wireProtocol`, `apiFamily`, `operationGroups`, `delivery`, `credentials`, and generated/checked-in `artifacts`.
- Do not add `SourceSurface`, `SourceContract`, or endpoint-family enums that combine independent axes.
- A `Source` can have multiple bindings; a binding can have multiple endpoint candidates; one endpoint can support multiple bindings.
- CORS belongs only to HTTP endpoint reality. Proxy behavior belongs only to `SourceDelivery`.
- WebSocket proxying is modeled as `SourceDelivery.RemoteLive` through SvelteKit `query.live`, not `/api-proxy` and not CORS.
- OpenAPI and GraphQL schemas/types are binding artifacts, not source identities.
- GitHub/GitLab are shared hosts unless the product explicitly models them as providers.
- EVM JSON-RPC, Git object, BitTorrent DHT, content gateways, Nostr relays, and common REST envelopes are shared interfaces/protocols, not providers.

File ownership:

- `src/sources/Source.ts` exports the `Source` enum.
- `src/sources/SourceProvider.ts` exports the `SourceProvider` enum and `SourceProviderDefinition`.
- `src/sources/SourceBinding.ts` exports source binding axes and `SourceBinding`.
- `src/sources/$sources.ts` holds source env compatibility helpers and lightweight source/provider definition helpers.
- `src/sources/index.ts` is browser-safe and must not import `queries.ts`, heavy runtime clients, generated runtime clients, private env, or server-only modules.
- `src/sources/index.server.ts` owns server/local binding indexes, private env gating, HTTP proxy allow-list data, and remote live binding indexes.
- `src/sources/_runtime/**` owns source-runtime delivery bridges such as HTTP proxying and `query.live`.
- `src/sources/_shared/hosts/**` owns reusable host clients such as GitHub/GitLab HTTP.
- `src/sources/_shared/wire/**` owns reusable envelope/serialization mechanics such as JSON-RPC 2.0, GraphQL HTTP, REST JSON, and bencode.
- `src/sources/_shared/interfaces/**` owns reusable API/protocol families such as EVM execution JSON-RPC, Etherscan module/action, Blockscout REST v2, content gateways, Git object, BitTorrent, and Nostr relay.
- Provider roots (`src/sources/<Provider>/index.ts`) must stay lightweight: provider label, source rows, and binding rows only.
- Provider runtime code lives under `src/sources/<Provider>/<EndpointKind>/<ApiFamily>/` when the channel/interface distinction matters.
- `src/constants/**` may hold protocol/catalog/reference rows, but executable endpoint candidates, API origins, gateway origins, RPC URLs, and source-client base URLs live in `src/sources/**`.

Env and credentials:

- `SourceCredentialScope.PublicConfig` is the only browser-safe env scope and uses `PUBLIC_*`.
- `SourceCredentialScope.RuntimeSecret` is server/private env only.
- `SourceCredentialScope.LocalSecret` is local node/app credential-store material.
- `SourceCredentialScope.UserDelegated` is wallet/session/user-granted capability, never source env.
- Browser-delivered bindings (`BrowserDirect`, `HttpProxy`) must not require runtime or local secrets.
- `BlockheadSource` schema rows record saved endpoint/config state and auth kind/key references, not compile-time source ontology and never secret values.

Registry and delivery:

- `enabledSources` means at least one binding for that source is enabled.
- Browser and server resolver enablement must be derived from enabled `SourceBinding` rows, not from `SourceDefinition` rows alone.
- Provider-level env failure disables every binding for that provider.
- Binding-level env failure disables only that binding.
- `/api-proxy` allow-list derives only from enabled `SourceDelivery.HttpProxy` HTTP endpoints.
- `SourceDelivery.BrowserDirect` endpoints are fetched directly by browser source clients.
- `SourceDelivery.RemoteQuery` and `SourceDelivery.RemoteLive` are same-origin SvelteKit remote-function delivery paths.
- `SourceDelivery.RemoteLive` server code owns the upstream live subscription/WebSocket and must close it when the remote stream aborts or unsubscribes.

Provider definition shape:

```ts
{
	provider: SourceProvider
	label: string
	env?: Type<SourcePublicEnvWire>
	sources: readonly SourceDefinition[]
	bindings: readonly SourceBinding[]
}
```

Source definition shape:

```ts
{
	provider: SourceProvider
	source: Source
	label: string
	env?: Type<SourcePublicEnvWire>
}
```

`$/resolvers/index.ts` imports `enabledSources` and keeps only resolver modules whose exported `source` is in that set; it then attaches `source` onto each resolver entry when flattening `resolvers`.

Provider runtime folders hold network code (`queries.ts`, optional `client.ts`, `constants.ts`, `types.ts`, generated schema files). In resolvers, load `queries.ts` / `constants.ts` via inline `await import(...)` inside each `resolve(...)` instead of top-level imports. Stable wire shapes or resolver-facing types live in `types.ts` (not `queries.ts`). Use binding/credential-scoped env instead of importing env directly in query code.

- **`queries.ts` export naming:** Exports must start with a verb (usually `get`, `fetch`, `list`, `search`, `query`, `collect`, `stream`, `normalize`, `parse`, `iterate`, `lookup`, `count`, `narrow`, `debug`, `subscribe`). Do **not** include the source or transport name as a namespace-style prefix — the import path already provides that context (e.g. write `getProfile`, not `bskyGetProfile`; write `getCoin`, not `getCoingeckoCoin`; write `getBlockByNumber`, not `getBlockByNumberBlockscout` or `ethGetBlockByNumber`).

### Source client freshness audits

Use this when asked to verify that `src/sources/**` generated or manually implemented clients are current and correctly wired.

- Generated clients:
	- Re-run the documented generic sync command, not one-off download aliases: `pnpm run sources:openapi` and/or `pnpm run sources:graphql`.
	- If an all-source sync fails after some providers succeed, retry with the documented single-provider/module form (`pnpm run sources:openapi -- <Provider>`, `pnpm run sources:graphql -- <SourceModule>`) to separate transient network failures from dead URLs.
	- If sync fails because of sandboxed networking or `tsx` IPC, rerun the same documented command with approval instead of replacing it with an ad hoc downloader.
	- Treat successful downloads as remote URL validation; if a remote URL fails, check the provider’s current official docs before changing manifests.
	- Keep generated artifacts checked in (`schema.graphql`, `graphql-env.d.ts`, OpenAPI schema file, `openapi.d.ts`). Do not hand-edit generated files except to intentionally fix generator output.
	- After regeneration, verify every generated transport folder still has its manifest, checked-in schema, generated type output, `client.ts`, `queries.ts`, and `index.ts` (plus `types.ts` for OpenAPI wire aliases).
	- When generated output changes dramatically, inspect whether the manifest is now hitting a broader schema source (for example live GraphQL introspection instead of a small hand-exported SDL) and verify downstream query documents still compile.
- Manual clients:
	- Check current official provider docs for base URL, path prefixes, auth header/query shape, required headers, CORS/proxy reality, pagination limits, and response envelopes before making code changes.
	- Prefer official docs, OpenAPI specs, provider GitHub docs, or machine-readable docs (`llms.txt`, OpenAPI, GraphQL introspection) over third-party examples.
	- Update constants/client code only for documented drift; keep provider-specific transport behavior in `src/sources/**` and avoid new wrapper layers.
	- If a provider has no stable official public API documentation for the endpoint in use, say that explicitly in the handoff and avoid speculative rewrites.
- Resolver wiring:
		- Trace every downstream resolver that imports the touched `queries.ts` and confirm it loads source modules with inline `await import(...)`, passes `context.publicEnv` when required, and maps wire data into schema-shaped fields/refs.
	- Validate entity ids, timestamp clocks, market/chain predicates, and optional-vs-required schema fields at resolver boundaries. Resolver output should be schema-shaped, not provider-shaped.
	- When a generated GraphQL client has a colocated `graphql-env.d.ts`, its `queries.ts` must import `graphql` from the same folder’s `client.ts`; do not reuse a neighboring provider’s gql.tada instance even if schemas currently match.
- Selective checks:
	- Run `pnpm run lint` after each meaningful batch.
	- Run targeted unit tests for touched source/resolver areas when present (for example `pnpm exec vitest run src/sources/Blockscout/Rest/constants.spec.ts --project=server`).
	- Use `pnpm run check` or `pnpm exec tsc --noEmit --project tsconfig.json --pretty false` as broader gates when feasible, but if the tree has pre-existing unrelated failures, record the first unrelated failure area and continue with focused source/resolver checks.
	- For live-data resolver validation, prefer existing probe harnesses/routes where available instead of adding broad new tests; keep probes scoped to providers/files touched.
	- In the final handoff, list generated sync commands run, official docs/classes of docs checked for manual clients, focused tests run, and any broader checks blocked by unrelated existing failures.

### OpenAPI schema codegen (`scripts/sources/openapi.ts`)

Use this when a transport lives under `src/sources/<Provider>/OpenApi/` and you want checked-in schema plus generated TypeScript types for paths and components.

Tooling: `openapi-typescript` emits a TypeScript AST from the schema object; the script writes it with `astToString`. If the downloaded file is Swagger 2.x (top-level `swagger` string), `swagger2openapi` converts it to OpenAPI 3 before generation. YAML (`.yml` / `.yaml`) is parsed with `yaml`; JSON uses `JSON.parse`. `package.json` maps `sources:openapi` to `pnpm exec tsx scripts/sources/openapi.ts`; devDependencies include `openapi-typescript`, `swagger2openapi`, and `yaml`.

CLI (via `package.json`):

```txt
pnpm run sources:openapi
pnpm run sources:openapi -- <Provider>
```

With no argument, the runner discovers every `src/sources/*/OpenApi/schema-source.ts` manifest and syncs all providers. `<Provider>` is the single path segment under `src/sources/` to sync one provider (e.g. `Defillama`, `Coinpaprika`, `Dexscreener`). Sync downloads `schemaUrl` into `schemaFile`, then generates `typesFile`.

Manifest: add `src/sources/<Provider>/OpenApi/schema-source.ts` and export a `schemaSource` object:

```ts
export const schemaSource = {
	schemaUrl: string
	schemaFile: string
	typesFile: string
} as const
```

- `schemaUrl`: canonical upstream OpenAPI 3 or Swagger 2 document URL.
- `schemaFile`: path relative to the manifest directory for the checked-in downloaded spec (e.g. `./openapi.yml`, `./openapi.json`).
- `typesFile`: path relative to the manifest directory for generated types (convention: `./openapi.d.ts`).

Hand-written transport code: after generation, keep HTTP in `client.ts`, put wire shapes beside the manifest in `OpenApi/types.ts` (aliases from `openapi.d.ts` plus any hand-maintained payloads), and use `queries.ts` for operations — `Coinpaprika`, `Dexscreener`, and `Defillama` follow this layout. Resolvers import wire types from `types.ts`, not `client.ts` / `queries.ts`.

Package scripts: keep one generic `sources:openapi` script; do not add per-provider download/generate/sync aliases.

Replication checklist:

1. Add `src/sources/<Provider>/OpenApi/schema-source.ts` with `schemaSource` as above.
2. Run `pnpm run sources:openapi -- <Provider>` so `schemaFile` and `typesFile` exist and stay reproducible from `schemaUrl`.
3. Wire `client.ts` / `queries.ts` / `index.ts` and register the source like any other transport (see Adding new Sources / Providers).

### GraphQL schema codegen (`scripts/sources/graphql.ts`)

Use this when a transport uses gql.tada against a GraphQL schema checked in next to the manifest (subgraphs and other APIs where SDL is the source of truth, or live GraphQL endpoints that support introspection). The runner downloads SDL or, when `schemaUrl` ends with `/graphql`, POSTs an introspection query, writes SDL to `schemaFile`, and generates the introspection module gql.tada expects.

Tooling: `@gql.tada/cli-utils` `generateOutput`. The script builds a temporary directory, writes a combined SDL file (main `schemaFile` body plus optional `patchFile` body, separated by a blank line), and writes a temporary `tsconfig.json` that extends the repo root `tsconfig.json` with `compilerOptions.plugins` containing one object: `name` `gql.tada/ts-plugin`, `schema` pointing at that combined SDL file, and `tadaOutputLocation` set to the manifest’s `outputFile`. `generateOutput({ output, tsconfig })` writes `outputFile` (convention: `./graphql-env.d.ts` beside the manifest). The temp directory is always removed afterward. `package.json` maps `sources:graphql` to `pnpm exec tsx scripts/sources/graphql.ts`; dependencies include `gql.tada` and `graphql`, and the devDependency `@gql.tada/cli-utils` supplies `generateOutput`.

CLI (via `package.json`):

```txt
pnpm run sources:graphql
pnpm run sources:graphql -- <SourceModule>
```

With no argument, the runner discovers every `src/sources/*/Graphql/**/schema-source.ts` manifest and syncs all GraphQL modules. `<SourceModule>` is the path under `src/sources/` to sync one folder that contains `schema-source.ts` (no filename), e.g. `TheGraph/Graphql/Ens`.

Manifest: add `src/sources/<SourceModule>/schema-source.ts` and export `schemaSource`:

```ts
export const schemaSource = {
	schemaUrl: string
	schemaFile: string
	outputFile: string
	patchFile?: string
} as const
```

- `schemaUrl`: canonical SDL or schema document URL.
- `schemaFile`: relative path for the checked-in schema (convention: `./schema.graphql`).
- `outputFile`: relative path for generated introspection types (convention: `./graphql-env.d.ts`). gql.tada / GraphQLSP consume this file; the header comment in generated files states it is produced by GraphQLSP / gql.tada.
- `patchFile`: optional relative path to extra SDL appended after the main file when generating (separated by a blank line). Use this when upstream SDL is incomplete or subgraph-specific extensions are required (see `$/sources/TheGraph/Graphql/Ens/schema-source.ts` and `schema.patch.graphql`).

Scalar prelude on `download`: for every GraphQL manifest, if any of these lines are missing from the fetched text, the script prepends them once: `scalar BigDecimal`, `scalar BigInt`, `scalar Bytes`, `scalar Int8`. That keeps subgraph-style SDL that assumes hosted-graph scalars typecheckable locally.

Runtime client pattern: import `initGraphQLTada` from `gql.tada` and `import type { introspection } from './graphql-env.d.ts'`, then `initGraphQLTada<{ introspection: introspection }>()`. Use `TadaDocumentNode` for typed documents and keep HTTP in a small wrapper (see `$/sources/TheGraph/Graphql/Ens/client.ts` and shared `$/sources/TheGraph/Graphql/client.ts`).

Colocated files: beside the manifest, keep `schema.graphql` (downloaded or regenerated), `graphql-env.d.ts` (generated; do not hand-edit except when fixing generator output intentionally), `client.ts`, and `queries.ts` as needed for that module.

Package scripts: keep one generic `sources:graphql` script; do not add per-module download/generate/sync aliases.

Replication checklist:

1. Add `schema-source.ts` (with optional `patchFile`), `client.ts`, and `queries.ts` under `src/sources/<SourceModule>/`; run the sync once so `schema.graphql` and `graphql-env.d.ts` exist.
2. Export `schemaSource` as above; run `pnpm run sources:graphql -- <SourceModule>`.
3. Point gql.tada / editor tooling at the generated `graphql-env.d.ts` for that folder; register the transport in `$/sources` / resolvers like any other source.


## Adding new Sources / Providers

During the sources-v2 migration, mirror an existing binding-based provider such as `$/sources/Blockscout/` or `$/sources/Voltaire/`:

1. Add or reuse `SourceProvider.<Provider>` in `$/sources/SourceProvider.ts`.
2. Add or reuse `Source.<Provider>_<SourceKind>` in `$/sources/Source.ts`.
3. Create `$/sources/<Provider>/bindings.ts` with one or more `SourceBinding` rows. Keep target, endpoint, wire protocol, API family, operation groups, delivery, credentials, and artifacts separate.
4. Create/update `$/sources/<Provider>/index.ts` with provider label, source rows, and binding rows only. Do not import `queries.ts`, generated runtime clients, private env, or heavy SDKs here.
5. Put reusable host/wire/interface behavior under `$/sources/_shared/**` when it is not provider-specific.
6. Put provider runtime code under `$/sources/<Provider>/<EndpointKind>/<ApiFamily>/` when channel/interface distinction matters.
7. For OpenAPI or GraphQL bindings, add binding-local `schema-source.ts`, generated artifacts, `types.ts`, `client.ts`, and `queries.ts`; update the shared codegen scripts instead of adding per-provider aliases.
8. Add the provider’s default export to the registry in `$/sources/index.ts` and `$/sources/index.server.ts`.
9. Add or update resolver modules that lazy-import the source runtime query module and map wire data into schema-shaped fields.
10. Do not edit schema files unless this task explicitly owns schema work; coordinate with any parallel schema rewrite and keep source code keyed by stable `Source` enum values.
11. Verify with focused source-binding tests, source/provider unit tests, and route probes for the migrated source.
