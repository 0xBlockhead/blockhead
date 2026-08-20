## TypeScript

### Formatting

- Use tabs
- Prefer `'` over `"`
- No `;` after statements (only leading `;` when needed before `(` / `[` / template literals)
- No `;` or `,` after `type` / `interface` properties
- Max 3 consecutive line breaks
- Object with > 1 prop, array with > 1 value: indent, one per line, trailing commas
- Generic with > 1 type param: indent, one per line
- Do not add trailing commas to call arguments, function / arrow parameters, or type argument lists
- Multiline expressions: indent, wrap in `()` UNLESS already exclusively wrapped in `[]` / `{}`
- Multiline unions/intersections: leading `&` / `|` before first member
- Multiline chained calls: break onto new indented lines
- Multiline ternary expressions: format like `if` / `else if` / `else`; place `?` at line end and `:` on its own branch line
	```ts
	const x = (
		condition ?
			value1
		:
			value2
	)
	```
- Multiline binary expressions: operator begins line after line break
	```ts
	const x = (
		1 * 2
		+ 3 * 4
		- 5 * 6
	)
	```
- Import paths (shape):
	- `$/` for `src/`
	- full extensions `.ts`, `.svelte`, `.svelte.ts`

### Style

- Prefer `??` over `||`
- Prefer `.` over `?.`, and `?.` over `object && object.value`
	- Ban `?.` when the receiver is typed non-nullish and `.` is equivalent; keep `?.` only for nullish-capable receivers
- Prefer `T[]` over `Array<T>`
- Prefer `[...array1, ...array2]` over `array1.concat(array2)`
- Conditional spread in object literals: Prefer `...(condition && { … })` over `...(condition ? { … } : {})` when the alternate branch would be `{}`. (Array literals still need `(condition ? […] : [])` or similar: spreading a falsy value into an array is not valid.)
- Prefer single expressions and inline logic
- Declare intermediate variables and functions ONLY if referenced more than once, otherwise inline. Do not replace a one-use local with a one-use helper; keep the expression at the call site unless it names a real domain concept used in multiple places.
- Single-statement `if` blocks: no braces; statement on the next line, indented with a tab. If another statement follows at the same indent level, separate with a blank line.
	```ts
	if (condition)
		statement

	nextExpression
	```
- Declare functions with `const` UNLESS overloading signatures
- Bare minimum type annotations. Remove if inferrable
- Prefer `as const satisfies` for constants, NEVER `: Type`
- Generic type params: `_Type extends Type`
- NO reexports or barrel files (`export ... from ...`).
- When moving or renaming files, rewrite import paths codebase-wide on the spot using find and replace tools.

### Linting and quality

- ALWAYS solve the highest upstream root cause of a type mismatch
- Runtime shape guards (default ban): unary `typeof`, `Array.isArray`, and `Reflect.get` are disallowed for satisfying TypeScript or hand-narrowing domain data. oxlint enforces this via `no-runtime-shape-guards/guards` (`scripts/lint/oxlint-plugin-no-runtime-shape-guards.mjs`). Allowed without a disable: `typeof window`, `typeof document`, `typeof globalThis`, and `typeof <same>.…` when the member chain’s root is one of those identifiers (environment / capability probes only). Anything else needs a strong reason: fix models or wire types upstream, narrow at `$/typescript/JsonValue.ts` (e.g. `isJsonObject` on `JsonValue`), or use `oxlint-disable-next-line` with a one-line reviewer-verifiable reason. Prefer a scoped `overrides` entry in `.oxlintrc.json` only for stable architectural boundaries (document the rationale when adding or extending a glob). A broad override block currently turns this rule off for UI, resolvers, sources, collections, lib, constants, routes, `JsonValue.ts`, and `tests/**`; treat that as debt—new code there should still avoid these guards in review until the override list shrinks.
- Do not use other JavaScript runtime shape checking workarounds to satisfy TypeScript checks when a typed or schema-level fix exists
- Do not try to fix `Type instantiation is excessively deep and possibly infinite`
- NO hardening, type assertions, `as`, `as unknown as` unless parsing unknown input (see oxlint below)
- NO type narrowing functions operating on `any` or `unknown`
- When refactoring, strip as many type assertions and annotations as you can while keeping things type safe. Prefer to reuse / derive from existing / package-provided types instead of duplicating.
- oxlint (`pnpm run lint`; Tasks):
	- `.oxlintrc.json` holds rules, `overrides`, and `ignorePatterns`
	- `typescript/no-unnecessary-condition` bans `?.` / `??` / conditions when types prove the fallback or guard cannot run. Fix those by replacing `?.` with `.`, removing unnecessary fallbacks, or correcting the receiver type upstream.
	- When something fails lint, treat that file as the contract, and use this order of operations:
		- Fix the underlying types (models, generics, function signatures) before reaching for assertions, `unknown`, or suppressions.
		- Prefer `overrides` scoped to a whole file or a small, stable glob when the exception is architectural (generated or hand-written “edge” modules that always need different rules), not for ad hoc escapes scattered across the tree.
		- Use `oxlint-disable-next-line` on the narrowest span with a one-line reason a reviewer can verify; if the same reason keeps reappearing, replace repeated disables with a scoped override or a proper type refactor.
		- At untyped boundaries, narrow with real domain types or a single shared wire type instead of defaulting to `unknown` or assertion escapes.
		- Anything that should meet the same bar as the primary checked tree must not live only under `ignorePatterns` unless that exclusion is intentional and reflected in the config.


## Constants (`src/constants/**`)

- No exported functions; only row arrays and lookup maps. Build maps with module-local code at load time; use logic outside `constants/` at call sites.
- Unexported module-local helpers used only while assembling those rows and lookups are fine. Normalize checked-in wire/catalog units into schema field shapes here (e.g. seconds vs milliseconds on activation timestamps), not in resolvers or `src/lib/**`. Do not add runtime enrichment, network fetches, caches, or resolver-like denormalization to constants; checked-in catalog rows are the snapshot.
- One canonical `as const` row array per catalog (`as const satisfies …` on the array). Lookups in `// Lookups` are derived from that array (`Object.fromEntries`, group-by)—do not maintain a second copy of the same data.
- Name source arrays with the plain plural domain noun and lookup maps as `singularByKey` or `singularBy<Field>`; do not use generic suffixes like `Rows`, `Entries`, `Fields`, or `Bags`.
- Do not export maps or `Set`s whose values are primitives only (REST URL strings, venue ids, booleans, `*LabelById` strings, wire-key `Set`s, id→enum scalar). Read primitives from a row (`beaconRestBaseByExecutionChainId[chainId].restBaseUrl`).
- Lookup exports from `Object.fromEntries` / `Object.groupBy`: no `: Record<…>` on the binding and no `satisfies` on the call—let inference carry the map type.
- Sections: `// Types` → `// Constants` → `// Lookups`, with two blank lines between each.
- Enum labels: unexported `*Rows`, one plural map per schema field; views use `lookup[value].label`. Colocate related catalogs in one `Domain.ts` file.


## Library helpers (`src/lib/**`)

- DO NOT add to `src/lib` unless explicitly asked or you are at least 90% confident the helper is genuinely cross-domain, reusable, and simpler than inlining. Keep provider/source-specific logic under `src/sources/**`, and keep trivial wrappers inlined locally. A helper that only wraps resolver mapping, optional field omission, catalog joins, row enrichment, dedupe, or one-off denormalization is not cross-domain.
- Do not put resolver-shaped pipelines here: async “enrichment” of catalog rows, provider fetches to backfill missing static metadata, module-level caches keyed by entity ids, or `Promise.all` helpers that walk list rows to derive fields that could have been built with the catalog. Prefer fixing `src/constants/**` row construction; real upstream I/O stays in `src/sources/**`.
