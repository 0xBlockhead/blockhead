# Source tree instructions

- Keep imports flowing from routes toward views, components, collections, resolvers, sources, and foundational modules.
- `src/routes/+layout.svelte` currently exports collection state consumed by several views. Do not treat that existing link as permission for new lower-to-higher imports.
- Shared live-query behavior belongs in `src/collections`; schema-neutral utilities belong in `src/lib` only when they are genuinely cross-domain.
- Keep provider I/O in `src/sources` and payload-to-entity mapping in `src/resolvers`.
- Apply the root TypeScript rules to every file in this tree.
- For Svelte work, load the `svelte-development` skill before editing.
- Read `docs/agents/code-architecture-reference.md` when an existing cross-layer exception affects an import decision.
