# Source schema code generation

## OpenAPI

- Canonical generator: `node --import tsx scripts/sources/openapi.ts`.
- Use `pnpm run sources:openapi` for synchronization and `pnpm run sources:openapi:check` for drift detection.
- Prefer the generator's provider argument for a focused run.
- Keep schema manifests as the source of truth. Do not patch generated `openapi.d.ts` by hand.

## GraphQL

- Canonical generator: `node --import tsx scripts/sources/graphql.ts`.
- Use `pnpm run sources:graphql` for synchronization and `pnpm run sources:graphql:check` for drift detection.
- Prefer the generator's source-module argument for a focused run.
- Keep checked-in schema and generated environment types aligned with query documents.

After any canonical or generator edit, read the edited input and representative final files. Formatting and lint success do not prove correct section placement or generated structure.

If network or sandbox restrictions block the documented command, retry that command with the required approval. Do not replace it with an unreviewed download path.
