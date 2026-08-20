# Source model

## Independent identities

- `SourceProvider` identifies the owner, operator, project, or local subsystem.
- `Source` identifies resolver-visible provenance and priority. It is not an endpoint, generated client, API family, or delivery mode.
- `SourceBinding` joins a source to target, endpoints, wire protocol, API family, operation groups, delivery, credentials, and checked-in or generated artifacts.
- Do not add an enum or object that collapses those independent axes.
- One source may have several bindings. One binding may have several endpoint candidates. One endpoint may serve several bindings.
- OpenAPI and GraphQL artifacts belong to bindings rather than defining source identity.
- Shared hosts, protocols, envelopes, and interfaces are not providers unless the product explicitly models them that way.

## File ownership

- `Source.ts` owns the source enum.
- `SourceProvider.ts` owns provider identity and provider definitions.
- `SourceBinding.ts` owns binding axes and the binding type.
- `$sources.ts` owns lightweight environment compatibility and definition helpers.
- `index.ts` is browser-safe and indexes public source metadata.
- `index.server.ts` owns private environment gating, server and local indexes, HTTP proxy allow-list data, and remote-live indexes.
- `_runtime` owns delivery bridges such as HTTP proxying and remote live queries.
- `_shared/hosts` owns reusable host clients.
- `_shared/wire` owns envelopes and serialization.
- `_shared/interfaces` owns reusable API and protocol families.
- A provider root contains labels, source rows, and binding rows. Put runtime transport below it, separated by endpoint kind or API family when that distinction matters.
- Protocol catalogs may live in constants. Executable origins, gateways, RPC URLs, and source-client base URLs live in sources.

## Credentials and delivery

- `PublicConfig` is the only browser-safe environment scope and uses `PUBLIC_*`.
- `RuntimeSecret` is server-private, `LocalSecret` belongs to local credential storage, and `UserDelegated` belongs to wallet, session, or user-granted capability.
- Browser-direct and HTTP-proxied bindings cannot require runtime or local secrets.
- Saved `BlockheadSource` rows contain endpoint and auth references, never secret values or compile-time ontology.
- CORS describes an HTTP endpoint. HTTP proxying is a delivery mode. Remote live WebSocket ownership belongs to SvelteKit live delivery, not CORS or `/api-proxy`.
- Remote-live server code owns the upstream subscription and closes it on abort or unsubscribe.

## Enablement and registration

- A source is enabled when at least one binding for it is enabled.
- Resolver enablement derives from enabled bindings, not source definition rows alone.
- A provider-level environment failure disables every provider binding. A binding-level failure disables only that binding.
- The HTTP proxy allow-list derives only from enabled HTTP-proxy endpoints.
- Browser-direct endpoints are fetched by browser clients. Remote-query and remote-live bindings use same-origin SvelteKit remote functions.
- The resolver registry filters modules by enabled source and attaches source provenance while flattening resolver entries.

## Runtime modules

- Runtime folders contain queries and optional clients, constants, types, and generated artifacts.
- Stable wire or resolver-facing types belong in `types.ts`, not `queries.ts`.
- Resolver modules load runtime queries or constants with inline dynamic imports inside `resolve`.
- Query exports begin with a verb such as `get`, `fetch`, `list`, `search`, `stream`, `parse`, or `subscribe`. Do not repeat the provider or transport name already expressed by the import path.
