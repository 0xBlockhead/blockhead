# Repository instructions

## Working agreement

- Keep replies concise and describe intent instead of pasting machine-oriented payloads.
- Preserve unrelated working changes. Never use Git rollback commands to correct an edit in a dirty worktree.
- Put agent worktrees beneath `~/Developer/blockhead-2026-agent/` in the established harness subtree, never a system temporary directory.
- Use `apply_patch` for edits. Prefer `mv` followed by an edit for file moves.
- For shell commands, write home paths with `~` and escape `$` and other expansion-sensitive symbols.
- Do not place rewrite programs containing template literals, `$`, backticks, globs, or replacement strings in inline shell or `node -e` commands. Use `apply_patch` or a temporary script.
- Do not use Prettier.
- End files with one newline and no trailing spaces.

## Commands

- Package manager: `pnpm`.
- Development server: `pnpm run dev`.
- Lint: `pnpm run lint`.
- Type and application checks: `pnpm run check`.
- Unit tests: `pnpm run test:unit -- --run`.
- Full verification without E2E: `pnpm run verify`.
- Playwright E2E: `pnpm run test:e2e`.
- Use `node --import tsx`, never plain `tsx`.

Run the smallest relevant check first. Broaden verification according to the files and behavior changed.

## Repository structure

- `src/routes` composes pages and layouts from views, components, and lower layers.
- `src/views` and `src/components` render UI. They may consume collections but do not fetch provider data directly.
- `src/collections` owns collection construction and shared live-query helpers.
- `src/resolvers` maps source payloads into schema rows.
- `src/sources` owns provider transport and external I/O.
- `src/schema`, `src/constants`, `src/lib`, and `src/typescript` are foundational.
- Keep dependencies flowing inward. Move shared code down instead of importing a higher layer from a lower one.

Read the nearest nested `AGENTS.md` before editing its subtree. Load a matching skill from `.agents/skills` before a specialized workflow.

## Specialized work

- Creating, revising, splitting, consolidating, or evaluating repository skills: `create-skill`.
- Writing, reviewing, consolidating, or improving automated tests: `test-methodology`.
- Explicit code, test, fixture, schema, or instruction reduction while preserving behavior and fault detection: `reduce`.
- Persistent delivery programs optimizing accepted product progress across a mutable work denominator: `orchestrate-program`.
- TypeScript logic or types: `typescript-development`.
- Any `.svelte` or `.svelte.ts` edit: `svelte-development`.
- Schema identity, selectors, references, observations, or cardinality: `schema-entity-modeling`.
- Provider, source, transport, credentials, generated schemas, or freshness: `source-provider-development`.
- Entity identity, summaries, related entities, or view layout: `entity-view-development`.
- Route families, nesting, keys, or facets: `route-architecture`.
- Resource adapters, boundaries, notifications, or OPFS persistence: `resource-reactivity`.
- Playwright route, matrix, CORS, persistence, or reactivity coverage: `playwright-route-testing`.

## TypeScript guardrails

- Do not use assertions or runtime shape guards to hide an incorrect model, wire type, or schema.
- Do not add re-exports or barrel files.
- Load `typescript-development` when TypeScript types, expressions, or module structure change.

## Editing safety

- For repeated edits, patch one representative site and run the smallest parse or generation check before scaling.
- Do not use broad regex rewrites on generators, source-of-truth files, generated artifacts, or shared high-traffic files.
- Use parser-backed transforms for syntax changes across multiple files. Do not use codemods for HTML wrapping or unwrapping.
- After changing a generator or canonical input, inspect both the source and representative generated output.

## Git and external actions

- Do not commit unless the user asks. When asked, load the `atomic-commits` skill.
- Confirm before using `gh` to post comments or otherwise act on the user's behalf.

## Instruction maintenance

- Before changing instructions or skills, read `docs/agents/context-architecture.md`; use `docs/agents/instruction-coverage.md` to locate existing knowledge.
