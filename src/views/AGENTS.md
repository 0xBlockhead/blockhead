# Entity views

- Views render schema and collection state. They do not fetch provider data directly.
- Treat schema cardinality as the display contract. Render `One` directly, branch on absence for `ZeroOrOne`, and use `.values.length` for `Many`.
- Use `ResourceBoundary` at the exact consumption site instead of manually branching on resource state.
- Use schema-backed entity views for related entities when available. Do not expose raw IDs or serialized entity objects in user-facing summaries.
- Do not repeat identity, icons, or artwork in a details list when the heading already renders them.
- Use inline entity links for one relational child, embedded summary details for intrinsic children, and tabs only when several substantial sections justify them.
- Keep `Content`, `Details`, `Title`, `Value`, and `Heading` snippet contracts consistent with `EntityView` and `EntityId`.
- Load the `svelte-development` skill for every view edit and `entity-view-development` for entity summary, identity, related-entity, or detail layout changes.
- Read the detailed reference in `entity-view-development` before changing link ownership, details-list structure, or shared snippet contracts.
