---
name: source-provider-development
description: Add or revise provider sources, bindings, transport, credentials, or generated schemas.
---

# Source provider development

Inspect the provider's existing source, resolver, and generated-artifact structure before editing.

Keep the data flow visible:

1. Define provider, source, binding, endpoint, delivery, credential, and artifact metadata without collapsing independent axes.
2. Put external transport under `src/sources/<Provider>` and map its results in `src/resolvers`.
3. Keep provider roots lightweight and browser-safe.
4. Register generated inputs through the existing manifests and generators.
5. Verify representative generated output after changing a manifest or generator.

Before using a partial generation API, inspect both emission and stale-file cleanup semantics. A selected output list may mean deletion of every omitted generated file. If partial publication is not explicitly supported, configure a supported fresh empty output root before the generator initializes its destination, then review and transfer the intended closure. For a fixed-output generator, use a complete generation in an isolated checkout with preserved preimages; do not invent an unsupported partial API. Include deletions and preimages in the transfer manifest; regenerate from reconstructed canonical inputs when their existing generation evidence does not apply.

Bind a canonical edit to the exact provider/source/binding declaration before applying it. Similar surrounding text or a successful patch application does not establish semantic identity. Generate from the reconstructed input and compare the resulting binding identity and runtime metadata; tests against a hand-edited registry do not prove that the canonical input owns the same behavior.

Read [source-model.md](references/source-model.md) when changing provider, source, binding, endpoint, credential, delivery, or registry semantics.

For a freshness audit or manual client drift, read [freshness-audits.md](references/freshness-audits.md). For OpenAPI or GraphQL artifacts, read [schema-codegen.md](references/schema-codegen.md).

For a new provider or binding, read [provider-onboarding.md](references/provider-onboarding.md).

Use official provider documentation and machine-readable schemas for current endpoint or authentication facts. Do not infer provider changes from third-party examples.

For generated application or security policy, derive values from the compiled source/binding authority and verify the runtime actually consumes every declared field. Reject dead declarations and hand-maintained endpoint mirrors; keep platform-only synchronization outside a shared policy packet unless that platform is the requested owner.

Run the smallest provider-specific generation or check first, then `pnpm run check:sources` when the change is ready for broad verification.
