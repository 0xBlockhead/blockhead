# Resolver Migration

`src/resolvers_` is the reference copy for the pre-sources-v2 resolver set. Runtime code must import from `src/resolvers` only.

Current registry policy:

- Active resolver modules in `src/resolvers/index.ts` must validate against the current schema and sources-v2 source names.
- Resolver definitions use projection-shaped objects directly; there is no `fields` wrapper.
- Facet fields must be nested under their `TitleCase` projection path, matching schema facet paths.
- `APP.resolvers.modules` lists checked-in resolver module paths; only sources with a module entry and at least one resolver definition belong in the runtime registry.
- Source bindings without resolver modules stay in `src/sources/**` until schema contracts and resolver facets exist.
- Deferred rows with inactive resolver files should record checked-in query/client/type artifacts in source runtime folders; shared helper files or sibling binding files do not by themselves make a distinct `Source` resolver-ready.

Next batches:

1. Migrate high-confidence existing resolver modules to lazy source runtime imports where they still import provider query/constants modules at top level.
2. Implement resolver facets only where source runtime code and schema contracts both exist.
3. Keep focused registry, lint, source tests, stale-source, and reference-folder import audits green after each batch.
