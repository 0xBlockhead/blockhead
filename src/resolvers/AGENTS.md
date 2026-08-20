# Resolvers

- Resolvers map source payloads into schema-shaped entity and entity-field rows. They do not define provider transport.
- Register resolver modules through `src/resolvers/index.ts` and keep shared resolver types in `src/resolvers/$resolvers.ts`.
- Match resolver selectors and fields to the schema contract. Fix schema or wire types upstream instead of asserting shapes locally.
- Import provider runtime modules lazily inside `resolve` functions.
- Keep pure selector derivation synchronous and independent of provider I/O.
- One observation snapshot should have one resolver and one upstream timestamp coordinate.
- Do not fabricate resolution, repeat derivable identifiers, or use missing provider support as schema cardinality.
- Load `schema-entity-modeling` and its detailed resolver reference before changing applicability, live facets, or emitted field rows.
