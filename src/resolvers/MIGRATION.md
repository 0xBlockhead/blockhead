# Resolver Migration

`src/resolvers_` is the reference copy for the pre-sources-v2 resolver set. Runtime code must import from `src/resolvers` only.

Current audit snapshot:

- `Source` rows: 314
- Resolver-covered `Source` rows: 106
- No-resolver `Source` rows: 65
- Deferred `Source` rows: 143
- Stale `Source.*` references in `src/resolvers`: 0

Coverage states:

- `implemented`: a resolver module exists and exports facets for a current `Source` row.
- `no-resolver`: the source is metadata, catalog, wallet capability, local transport, host/protocol inventory, or runtime capability with no schema field contract yet.
- `deferred-schema`: the source has plausible data but current schema/product rows are absent or still being rewritten.
- `deferred-runtime`: the source binding exists but no checked-in source client/query/runtime boundary exists yet.
- `deferred-artifact`: the source needs generated OpenAPI, GraphQL, proto, Candid, ABI, or other checked-in artifacts before resolver facets would be accurate.

Current registry policy:

- Active resolver modules in `src/resolvers/index.ts` must validate against the current schema and sources-v2 source names.
- Resolver files may remain outside the registry only when explicitly listed as deferred in `RESOLVER-COVERAGE.md` or this file.
- `RESOLVER-COVERAGE.md` is the source-row ledger for implemented, no-resolver, and deferred states.
- Deferred rows with inactive resolver files should record checked-in query/client/type artifacts in the runtime column; `binding metadata only` is reserved for rows with no source-specific runtime files. Shared helper files or sibling binding files do not by themselves make a distinct `Source` resolver-ready.

Current deferral examples:

- Local/server rows needing current schema/runtime mapping: `LogosDocs_Rest`, `QuilibriumNodeRpc_Grpc`.
- Non-EVM source rows with bindings but no checked-in query/client implementation yet: Cardano, Algorand, Aptos, Sui, Starknet, Stellar, Hedera, TON, XRPL, Tezos, Avalanche, Kaspa, Celestia.
- Shared protocol helpers alone are not resolver readiness: `Erigon_JsonRpc` and `Reth_JsonRpc` can reuse EVM execution JSON-RPC helpers, but remain deferred until `configured-url` / `configured-chain` binding placeholders are materialized into real runtime endpoints.
- Wallet/user-delegated capability rows are `no resolver` until Blockhead-local session/account schema contracts need source-backed facets.
- Artifact/client rows needing generated or checked-in runtime support: see `RESOLVER-COVERAGE.md`.

Next batches:

1. Replace broad `deferred` evidence in `RESOLVER-COVERAGE.md` with precise `deferred-schema`, `deferred-runtime`, or `deferred-artifact` rationale as each family is audited.
2. Migrate high-confidence existing resolver modules to lazy source runtime imports where they still import provider query/constants modules at top level.
3. Implement resolver facets only where source runtime code and schema contracts both exist.
4. Keep focused registry, lint, source tests, stale-source, and reference-folder import audits green after each batch.
