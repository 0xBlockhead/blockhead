# Source tree instructions

- Keep dependencies mostly flowing inward: routes compose views and components; views and components may consume collections; collections own collection construction and shared live-query helpers; resolvers map source payloads into schema rows; sources own provider transport and external I/O; schema, constants, lib, and typescript remain foundational.
- `src/routes/+layout.svelte` currently creates and exports `entityCollectionByEntityType` and `entityFieldCollections` consumed by several views. Do not treat that existing link as permission for new lower-to-higher imports.
- `src/collections/$queries.svelte.ts` already centralizes some `useLiveQuery` helpers. Shared live-query behavior belongs in `src/collections`; schema-neutral utilities belong in `src/lib` only when genuinely cross-domain.
- `src/resolvers/index.ts` is the resolver registry, and `src/resolvers/$resolvers.ts` owns shared resolver types and helpers.
- If a lower layer starts importing a higher one, move the shared code into `lib`, `schema`, `constants`, or `collections`.
- Apply the root TypeScript rules to every file in this tree.
- For Svelte work, load the `svelte-development` skill before editing.
