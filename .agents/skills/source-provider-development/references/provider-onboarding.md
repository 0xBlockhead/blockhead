# Provider onboarding

Mirror one existing binding-based provider, then change only the independent axes that differ:

1. Add or reuse `SourceProvider` and resolver-visible `Source` identities.
2. Define binding rows with target, endpoints, wire protocol, API family, operation groups, delivery, credentials, and artifacts kept separate.
3. Keep the provider root browser-safe: labels, source rows, and binding rows only.
4. Put reusable host, wire, or interface behavior under `_shared`; put provider runtime below the provider, separated by endpoint kind or API family when useful.
5. For generated bindings, add the binding-local manifest, schema, types, client, and queries; use the shared generator rather than a provider-specific alias.
6. Register public and server indexes. Resolver modules dynamically import runtime queries inside `resolve` and map wire data into schema-shaped rows.
7. Verify focused binding and resolver workflows plus representative generated output. Change schema only when the task explicitly owns the schema contract.

Stable resolver-facing wire types belong in `types.ts`. Query exports begin with a verb and do not repeat provider or transport names already expressed by their path.
