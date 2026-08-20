---
name: source-provider-development
description: Add or revise provider sources, source bindings, transport clients, credentials, generated schemas, or source freshness in src/sources. Use for provider onboarding, endpoint changes, OpenAPI or GraphQL sync, delivery mode, proxying, or stale client audits.
---

# Source provider development

Read `src/sources/AGENTS.md` and the provider's existing source, resolver, and generated-artifact structure before editing.

Keep the data flow visible:

1. Define provider, source, binding, endpoint, delivery, credential, and artifact metadata without collapsing independent axes.
2. Put external transport under `src/sources/<Provider>` and map its results in `src/resolvers`.
3. Keep provider roots lightweight and browser-safe.
4. Register generated inputs through the existing manifests and generators.
5. Verify representative generated output after changing a manifest or generator.

Read [source-model.md](references/source-model.md) when changing provider, source, binding, endpoint, credential, delivery, or registry semantics.

For a freshness audit or manual client drift, read [freshness-audits.md](references/freshness-audits.md). For OpenAPI or GraphQL artifacts, read [schema-codegen.md](references/schema-codegen.md).

Read [provider-reference.md](references/provider-reference.md) for the complete binding ontology, generated artifact contracts, resolver integration rules, or provider registration checklist.

Use official provider documentation and machine-readable schemas for current endpoint or authentication facts. Do not infer provider changes from third-party examples.

Run the smallest provider-specific generation or check first, then `pnpm run check:sources` when the change is ready for broad verification.
