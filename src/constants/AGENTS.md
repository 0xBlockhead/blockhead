# Constants

- Constants contain checked-in catalog and reference data, not fetches, caches, resolver pipelines, or runtime enrichment.
- Keep one canonical `as const satisfies` row array per catalog and derive lookups from it.
- Do not maintain a second copy of the same data in a lookup.
- Let `Object.fromEntries` and `Object.groupBy` infer lookup types.
- Use plain plural domain nouns for row arrays and `singularByKey` or `singularBy<Field>` for lookups.
- Do not export primitive-only maps when callers can read the primitive from a row.
- Order sections as `// Types`, `// Constants`, then `// Lookups`, with two blank lines between them.
- Normalize checked-in wire units here when assembling rows. Keep executable endpoint configuration in `src/sources`.
