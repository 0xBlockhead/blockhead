# Schema entities

- Define entities in `src/schema/*.ts` and register them in `src/schema/index.ts`.
- Declare `selectors` before `fields`. Selectors are the only entity-addressing contract.
- Model alternate interoperable identifiers as selectors when each identifies the same entity.
- Derive equivalent selectors synchronously instead of repeating pure transforms in provider resolvers.
- Treat cardinality as domain truth, not provider support. An unsupported field has no resolver facet.
- Put as-of metrics on timestamp entities. Keep lifecycle timestamps and values deterministic for an entity ID on the owning entity.
- Child rows refer to entities through `$$` fields.
- Load the `schema-entity-modeling` skill for entity boundaries, selector identity, references, observations, and cardinality reviews.
- Read the detailed reference in `schema-entity-modeling` when changing timestamp observation modeling or market graph entities.
