# Sources

- This directory owns external I/O, source metadata, binding metadata, generated wire artifacts, and provider transport code.
- Keep source identity, provider ownership, endpoints, protocols, delivery, credentials, and generated artifacts as independent axes.
- Provider root `index.ts` files stay browser-safe and lightweight. Runtime clients and queries live below the provider root.
- `src/sources/index.ts` must not import server-only modules, private environment values, queries, or heavy runtime clients.
- Keep secrets out of browser-delivered bindings and checked-in schema rows.
- Load provider runtime modules inside resolver `resolve` functions instead of importing them at resolver module load.
- Name `queries.ts` exports with transport-neutral verbs. The import path already names the provider.
- Do not hand-edit generated schemas or generated client types.
- Load the `source-provider-development` skill for provider additions, client freshness audits, binding changes, or source code generation.
- Read the complete provider reference in `source-provider-development` when changing binding ontology or delivery semantics.
