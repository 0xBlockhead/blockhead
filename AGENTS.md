## Agents

- Reply in a concise style; avoid repetition or filler
- Assistant / handoff summaries: Do not respond with large JSON blobs, `devalue` / `stringify(entityId)` dumps, or other machine-oriented payloads into chat summaries; describe intent and point to paths or small code citations instead


## Editing, Syntax, Style

- Be DRY and declarative
- Prefer direct, explicit code over wrapper layers: keep the core data flow visible at the call site, and inline trivial wrapping / unwrapping / grouping / ungrouping helpers.
- Name variables, snippets, callback parameters, and arguments by what they are; never abbreviate identifiers.
- End files with a single line break
- Avoid trailing spaces
- Keep correct indentation levels when editing or moving large chunks of code
- Always inline single-use derivable intermediate variables
- Do not introduce new variables, files or helper functions without proper justification, a detailed plan, and explicit permission; helpers and intermediate variables are acceptable only when you are at least 90% confident they remove real repeated complexity or encode meaningful domain / transport logic.
- Bulk edits: use temporary/one-off scripts using the language's official AST tool to bulk edit syntax patterns in multiple files. If there are many files, edit one, check correctness, double the number of file edits, check correctness, and repeat.
- Do not write codemod scripts to do HTML wrapping/unwrapping refactors.
- We do NOT use Prettier.
- Never git revert to correct a mistake when there are existing working changes
- `modern-web-guidance` skill: invoke only when editing uncommonly used HTML tags, CSS rules or `src/components`.
- Composer 2.5: this is NOT a React / Motion project. do not use `</motion>` to close HTML tags.


## Bash commands

- Use ~ for the $HOME directory. Avoid user directory names.
- Always escape symbols like $ to avoid shell expansions


## Git

### Commit changes

- To make atomic commits across a given set of working files:
	- `git add .; git stash -m "$(date +%s) before atomic commits"; git stash apply`
	- list all diff hunks
	- identify groups of hunks related to single changes/features (NOT by file or folder)
	- assign commit messages to each group: "<Feature / Area>: <present tense verb phrase with possible `backtick` references like `<Component>` or `file.extension`>"
	- organize groups topologically
	- output plan to a temporary .md file with checkboxes
	- repeat until all checked:
		- run checks and builds
			- if there are minor issues: fix until it passes
			- if there are many issues: abort, reset, and start the process over from the beginning
			- if totally unfixable: abort, reset, restore all working changes
		- stage hunks from the top-most unchecked group
		- commit
		- mark group checkbox as completed

### File moves

- Prefer `mv` + edit over recreate + delete


## Packages

- Package Manager: `pnpm`


## Tasks

- Use `pnpm` to run tasks from `package.json`
- Lint: `pnpm run lint` — oxlint (with `oxlint-tsgolint` for type-aware rules); config in `.oxlintrc.json`


## Testing

- Vitest (`pnpm run test:unit`, or `pnpm test` for unit + Playwright): configured in `vite.config.ts` as two projects:
	- client (browser + Playwright provider): `src/**/*.svelte.{test,spec}.{js,ts}` (excludes `src/lib/server/**`)
	- server (node): `src/**/*.{test,spec}.{js,ts}` excluding the svelte browser test glob above
- Playwright E2E (`pnpm run test:e2e`): `playwright.config.ts` uses `testMatch: '**/*.e2e.{ts,js}'` and starts preview via `npm run build && npm run preview` on port 4173.

### Playwright E2E — placement and naming

- Co-locate with the route under test: put `*.e2e.ts` in the same folder as that route’s `+page.svelte` / `+layout.svelte` (e.g. `src/routes/(explore)/proposals/proposals.e2e.ts` beside `+page.svelte`).
- Do not use a `+` prefix on E2E files (e.g. not `+page.e2e.ts`). SvelteKit treats `+`-prefixed files as route modules and will error.
- File names only need to match `**/*.e2e.ts` — e.g. `proposals.e2e.ts` or `page.svelte.e2e.ts` (demo). Pick a name that identifies the route when many tests live nearby.
- Invoking tests: prefer a stable fragment (e.g. `pnpm exec playwright test proposals.e2e`) so shells do not have to quote path segments with parentheses like `(explore)`.

### Playwright E2E — `data-e2e`

- Add `data-e2e="…"` sparingly for one-off nodes used only by E2E (not for layout/theme). Prefer `getByRole` / label / text / stable `id` / `#main` / `class` selectors / `data-scroll-marker-label` (carousel sections) first. Examples: `#network-summary-head-block` and `.network-view-carousel-groups` / `.network-view-collapsible-*` on `NetworkView.svelte` (replacing scattered `data-e2e` on the same layout); `#nav-menu` (`Navigation.svelte`).

### Playwright E2E — assertions

- `<details>` / collapsed UI: Copy inside a closed `<details>` (or similar) is often attached but not visible to Playwright. For “data loaded” checks on that content, prefer `expect(locator).toBeAttached()` (optionally with a long `timeout`) instead of relying only on `toBeVisible()`.
- Resolver / network latency: Pages backed by `resolveEntity` or external HTTP may need timeouts on the order of minutes (e.g. `120_000` ms) for the “settled” assertion, while still asserting a cheap invariant first (nav link, layout chrome).
- Success vs failure: When the UI shows either a happy path or an explicit error string, use `.or()` on locators and assert one branch is attached once the async work finishes.

### Playwright E2E — CORS policy

- **`pnpm run test:e2e:cors`** — `tests/e2e/cors-policy.e2e.ts` walks **every discovered `+page` route** (same discovery as `tanstack-cache-pages.e2e.ts`), uses `waitUntil: 'load'`, `assertMainSettled`, optional `networkidle`, then a **quiet window** (`E2E_CORS_QUIET_MS`, default 4s) so late resolver fetches surface CORS console errors. Other e2e suites filter that copy as upstream noise; this suite is the dedicated regression gate.
- Subset: `E2E_PATH_LIMIT=20 pnpm run test:e2e:cors`. Single route: `E2E_PROBE_PATH=/network/1 pnpm exec playwright test tests/e2e/cors-policy.e2e.ts -g "probe route"`.
- **Fix pattern (browser client code):** never bare `fetch('https://…')` for provider HTTP when the origin is not browser-CORS-safe. Use `getJson` / `getText` / exported **`corsFetch`** from `$/lib/http.ts` with either:
	- **`origins`:** readonly `SourceOrigin[]` from the provider definition (`origin` + `corsEnabled`) — same list seeds `/api-proxy/` allow-list in `hooks.server.ts`; or
	- **`corsEnabled: false`:** escape hatch for one-off absolute URLs (still requires the origin on a provider `origins` row for proxying).
- **`corsEnabled` must match reality** — if the browser console shows CORS blocks for an origin marked `true`, flip it to `false` and route through the proxy. Catalog execution RPC hosts: `$/constants/ExecutionRpcOrigins.ts` (Voltaire provider + `jsonRpc` client).
- When `corsEnabled: false`, the browser routes through `/api-proxy/{absoluteUrl}`; SSR keeps direct `fetch`. When `corsEnabled: true`, the browser uses direct cross-origin `fetch` (public RPCs, CORS-enabled APIs).
- Adding a new proxied host: extend the provider’s `origins` in `src/sources/<Provider>/index.ts` (or shared constants), then wire the transport client through `corsFetch` / `getJson`.


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
- Runtime shape guards (default ban): unary `typeof`, `Array.isArray`, and `Reflect.get` are disallowed for satisfying TypeScript or hand-narrowing domain data. oxlint enforces this via `no-runtime-shape-guards/guards` (`scripts/oxlint-plugin-no-runtime-shape-guards.mjs`). Allowed without a disable: `typeof window`, `typeof document`, `typeof globalThis`, and `typeof <same>.…` when the member chain’s root is one of those identifiers (environment / capability probes only). Anything else needs a strong reason: fix models or wire types upstream, narrow at `$/typescript/JsonValue.ts` (e.g. `isJsonObject` on `JsonValue`), or use `oxlint-disable-next-line` with a one-line reviewer-verifiable reason. Prefer a scoped `overrides` entry in `.oxlintrc.json` only for stable architectural boundaries (document the rationale when adding or extending a glob). A broad override block currently turns this rule off for UI, resolvers, sources, collections, lib, constants, routes, `JsonValue.ts`, and `tests/**`; treat that as debt—new code there should still avoid these guards in review until the override list shrinks.
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


## Svelte (`*.svelte`, `*.svelte.ts`)

- Svelte 5 runes; NEVER legacy Svelte 4 (`$:`, `onMount`, `writable`)
- Prefer single expressions and inline logic
- Use temporary/one-off Svelte AST scripts to bulk edit syntax patterns in multiple files. If there are many files, edit one, check correctness, double the number of file edits, check correctness, and repeat.

- File layout:
	- two blank lines between:
		- `<script module lang="ts">`
		- `<script lang="ts">`
		- comment sections in `<script lang="ts">`
		- `<svelte:head>`
		- component markup
		- `<style>`
- `<script lang="ts">`
	- Comment sections in this order when used:
		- `// Polyfills` (`routes/+layout.svelte` only)
			- global JavaScript polyfills and shims from `src/polyfills.ts`
		- `// Styles` (`routes/+layout.svelte` only)
			- global CSS from `src/styles`
		- `// View transitions` (`routes/+layout.svelte` only)
			- global view transitions using SvelteKit nnavigation hooks
		- `// Types/constants`
			- imports for TypeScript types and enums
			- imports from `src/constants`
		- `// Context`
			— App data / TanStack collections from `$/collections/**`; colocate UI-only `*.svelte.ts` next to routes or contexts
			— `get*` methods from `$/context/*.ts`
			- Svelte `getContext()`
		- `// State`
			- Type imports if used in `$props()`:
				- `import type { WithRest } from '$/typescript/WithRest.ts'`
				- `import type { SvelteHTMLElements } from 'svelte/elements'`
				- `import type { Snippet } from 'svelte'`
				- `import type { ComponentProps } from 'svelte'`
			- `$props()`
				- one prop per line
				- consistent prop order across destructure, type annotation, component usages
				- `$bindable()`: indent default value if specified
				- Snippets (`TitleCase` in destructure; types on props object):
					- No args: `Snippet` — never `Snippet<[]>` or `Snippet<[{}]>`. `{@render Name()}`.
					- Object arg: bundled state as `Snippet<[context?: { … }]>` with optional properties on the object so `{#snippet Name()}` is valid when the body ignores the bundle (see `$/components/EntityView.svelte` and `EntityId.svelte` patterns). Do not use required `Snippet<[{ … }]>` object tuple members. Positional: `Snippet<[ a: A, b: B, … ]>`; separate values. `{@render}` arity, order, and object-vs-positional must match the type.
					- Line breaks: for a given snippet, type and `{@render}` use the same shape — both multiline or both single-line. Multiline means one tuple member or object property per line, trailing commas, and a dedicated closing line for `]>` / `)}` / `)`. Same for `{#snippet …}` params. Multiline when there are 2+ tuple members, 2+ object fields, or 2+ render arguments.
					```ts
					let {
						...
					}: {
						Summary: Snippet<[context?: {
							open?: boolean,
						}]>
						OnFailure?: Snippet<[
							error: unknown,
							retry: () => void,
						]>
					} = $props()
					```

					```svelte
					{@render Summary({
						open,
					})}
					{@render OnFailure(
						error,
						retry,
					)}
					```

				- Typing rest props spread on HTML element:
					```ts
					// State
					import type { WithRest } from '$/typescript/WithRest.ts'
					import type { SvelteHTMLElements } from 'svelte/elements'

					let {
						...,
						...tagnameProps
					}: WithRest<
						{
							...
						},
						SvelteHTMLElements['tagname']
					> = $props()
					```

					```svelte
					<tagname
						{...tagnameProps}
					>
					```

				- Typing rest props spread on Svelte component:
					```ts
					// State
					import type { WithRest } from '$/typescript/WithRest.ts'
					import type { ComponentProps } from 'svelte'

					let {
						...,
						...ComponentNameProps
					}: WithRest<
						{
							...
						},
						ComponentProps<typeof ComponentName>
					> = $props()
					```

					```svelte
					<ComponentName
						{...ComponentNameProps}
					>
					```
			- imports for functions exclusively used in this section
			- `$state()`, `$derived()`
				- ALWAYS indent value within `()`
				- Declare intermediate variables with `$derived` ONLY if referenced more than once, otherwise inline in existing expression or markup
		- `// Inner context`
			— `set*` from `$/context/*.ts`
		- `// Functions`
			- imports for functions exclusively used in markup
		- `// Components`
			- Svelte component imports
			- Vite image path imports
		- `// Transitions/animations`
			- imports from `svelte/transition`, `svelte/animation`, `svelte/easing`

- `bind:*` function bindings:
	- getter and setter on separate lines
		- blank line in between if multiline setter definition
	- setter argument underscore-prefixed
	- setter function body `{}`
	```svelte
	bind:value={
		() => getterExpression,
		(_value) => {
		}
	}
	```

- Snippets:
	- Types + `{@render}` + line breaks: `$props()` → Snippets above.
	- `{#snippet Name()}` if the body needs no injected values; else `Name({ open })` or `Name(a, b)` to mirror `{@render}` (same multiline rule). `Collapsible` and `ParentPageCollapsible` use a `Summary` snippet for the summary row; it receives `{ open }`.
	- Snippet props: `{#snippet …}` as direct child of the component (no `{#if}` / `{#each}` / `{#key}` around it); put `{#if}` inside the snippet body.
	- Passing local snippets by reference:
		```svelte
		{#if true}
			<Component
				items={[
					{
						Content: MyContent1,
					},
					{
						Content: MyContent2,
					},
				]}
			/>

			{#snippet MyContent1()}
				...
			{/snippet}

			{#snippet MyContent2()}
				...
			{/snippet}
		{/if}
		```
		- (Only wrap in `{#if true}` to distinguish from sibling markup)
	- List `Item` snippets (`UnorderedList`, `EntitiesList`, `RefinableList`, …): `Item` is only invoked for loaded rows (`item` is always set). Optional `PlaceholderItem` covers placeholder keys. Do not wrap `Item` in `{#if item}` or branch on `isPlaceholder` inside `Item`.

- `{@const}`: prefer inlining one-off derived logic into markup with `{@const}`; `{@const}` must be immediate child of `{#snippet}`, `{#if}`, `{:else if}`, `{:else}`, `{#each}`, `{:then}`, `{:catch}`, `<svelte:fragment>`, `<svelte:boundary>`, or `<Component>`

### HTML / CSS:
	- Use semicolons in CSS rule declarations
	- Check `src/styles/*.css` for global defaults and `data-*` attributes / variants
	- If unavailable in `src/styles/components.css` as a provided `[~=]` variant, override locally in `<style>`:
		- select by element, or add class to the closest semantic parent container
		- override CSS variable with nested `&[data-*]` selector:
			```css
			.local-container {
				section {
					&[data-card] {
						--card-radius: 2em;
					}
				}
			}
	- NEVER add classes that are not used in local `<style>`, or `data-*` attribute that isn't a local value or global `src/styles/components.css` utility
	- one blank line between sibling elements and Svelte blocks spanning multiple lines

### Tools

- sveltekit-adapter, devtools-json, mcp

### Svelte MCP

- If unsure about Svelte syntax:
	- Start with `list-sections` (pick relevant `use_cases` + `paths`)
	- Use `get-documentation` for every relevant section after `list-sections`
- Fixing issues:
	- Run `svelte-autofixer` for any Svelte edits (`.svelte` / `.svelte.ts`) and repeat until no issues remain. Review suggestions; apply them when they identify real simplification or correctness problems. If the Svelte MCP tool is not exposed in the current session, use the local fallback: `node scripts/svelte-autofix.mjs <path> --svelte-version 5`. The fallback invokes the official `@sveltejs/mcp` autofixer handler without the CLI's import-time documentation fetch and exits non-zero only for issues, because the official handler can emit intentionally ignorable suggestions such as audited `$effect` function calls.

### Svelte components

- Display truncation: use `<TruncatedValue>` / `<Address>` (manual truncation is only OK for non-display logic). Entity card headings and secondary ids follow Entity Views → Entity summary row (no JSON-shaped summary ids).

---


### SvelteKit-shaped resources

- SvelteKit remote `query()` is the reference implementation for low-level resource reactivity. Before changing `TanStackLiveQueryResource`, `ResourceBoundary`, or route resource fixtures, read `node_modules/@sveltejs/kit/src/runtime/client/remote-functions/query/instance.svelte.js` and preserve its two-surface contract: getters (`current`, `loading`, `ready`, `error`) and promise methods (`then`, `catch`, `finally`) must both observe the same resource-owned state machine.
- `ResourceBoundary` is a pure consumer of SvelteKit-shaped resources. It must not accept TanStack live-query snapshots directly, inspect TanStack state, branch on `Symbol.toStringTag`, call `subscribeChanges`, install resource `.subscribe` listeners, key/remount children to force updates, or choose between TanStack and SvelteKit modes.
- Views should not manually inspect resource `.current`, `.ready`, `.loading`, or `.error` for rendering. Prefer localized `ResourceBoundary` at the exact consumption site; each boundary should consume and render one logical thing, with resource state handled by the boundary and schema/domain display decisions handled by the view.
- The TanStack/source notification hook belongs in the TanStack-to-SvelteKit resource adapter, not in views, routes, or `ResourceBoundary`. App-level `subscribe(...)` may manage product resource lifecycle, but the boundary contract remains only `current` / `loading` / `ready` / `error` / `then` / `catch` / `finally`.
- Resource tests must prove direct getter reads and promise reads. Do not hide stale adapter reactivity with parent-local state updates, fixture-side `await tick()` before reading `.then`, boundary remount keys, debug-only direct displays, or softened assertions that no real view depends on.
- A resource/boundary fix is not complete until Playwright proves visible DOM updates from a TanStack/source notification through both a direct resource getter read and `ResourceBoundary`, without route reload.


## Import topology (`src/**`)

Keep dependencies mostly flowing inward:

- `routes/` compose pages and layouts from `views/`, `components/`, route-local helpers, and shared code in `lib/`, `schema/`, and `constants/`
- `views/` and `components/` render UI and can consume TanStack DB collections / live queries, but should not fetch provider data directly
- `collections/` owns collection construction in `$/collections/$collections.ts` and shared live-query helpers such as `$/collections/$queries.svelte.ts`
- `resolvers/` map source payloads into schema-shaped entity rows and entity-field rows
- `sources/` contains provider transport code and external I/O
- `schema/`, `constants/`, `lib/`, and `typescript/` are foundational and should stay reusable

Current repo-specific cross-links:

- `$/routes/+layout.svelte` creates and exports `entityCollectionByEntityType` and `entityFieldCollections`, and many views import those directly
- `$/collections/$queries.svelte.ts` already centralizes some `useLiveQuery` helpers, so live queries are not limited to route files in this repo
- `$/resolvers/index.ts` is the resolver registry, and `$/resolvers/$resolvers.ts` holds the shared resolver types and helpers

If a lower layer starts importing a higher one, move the shared code down into `lib/`, `schema/`, `constants/`, or `collections/`.


## Schema (`src/schema/**`)

Definitions in `$/schema/*.ts`; register in `$/schema/index.ts`. Entity definitions declare `selectors` before `fields`. Selectors are the only entity-addressing contract; there is no entity-level `id`, `identities`, or `lookups`. ArkType types selector fields and primitives; child rows use `$$…` entity-reference fields.

- Selectors represent unique entity-identifying field sets. Interop identifiers are separate selectors when they identify the same entity, not required payload fields on other selectors. If two selectors are derivable from each other, represent that with resolved fields and pure synchronous selector derivation/resolvers so the client can equate requests by the fields already resolved.
- Async/provider resolvers should use the most straightforward selector representation for that source. Do not repeat purely derivable interop calculations in every provider resolver when a pure synchronous selector resolver covers the transform.
- `EntityFieldCardinality.Zero` is a domain statement: assuming the field is resolvable, no value is acceptable and accurate for the subject matter. Never use `Zero` to mean a resolver/source may or may not support a field. If a resolver supports a field, its logic owns resolving that field's cardinality; unsupported fields are represented by absent resolver facets, not by schema cardinality.
- App views must treat schema cardinality as the resolved field contract: `One` fields render directly; `ZeroOrOne` fields may conditionally render based on absence; `Many` fields render as lists and condition sections on `.values.length`, not field existence. Keep optional chaining / `??` only where the schema or value type genuinely permits absence, and reserve value checks such as `null`, empty string, zero amount, or enum-specific cases for domain display semantics.
- Timestamped observations: As-of metrics (quotes, gas tiers, mempool counts, OHLC, …) live on `*_Timestamp` entities (`timestampMs` in the id; extra id keys when needed, e.g. `feedKey?`, candle `timeInterval`). Parents hold stable identity only—no snapshot scalars such as `price` or tiered gas on the header row. If an endpoint’s stats are deterministic for the entity id itself, such as Beaconcha.in epoch overview stats keyed by epoch rather than an observation time, model those fields on the owning entity instead of inventing a timestamp row.
- Resolvers / views: use one `defineResolver` per snapshot, with `fields` selectors for entity fields, list refs, counts, and live facets. When upstream exposes one stats clock, the timestamp selector field must match it. Latest row: sort `$$…` by `timestampMs`, nest `*_TimestampView`; history: `*_TimestampsView`.
- Examples: `MarketPrice` / `$$quotes` → `Market_Timestamp`; `Coin` / `$$timestamps` → `Coin_Timestamp`; `Market` → `Market_Timestamp`, `Market_TimeInterval_Timestamp`; `Network` / `$$gasEstimateTimestamps` → `Network_GasEstimate_Timestamp`, `$$txpoolTimestamps` → `Network_Txpool_Timestamp`; `Currency` / `$$timestamps` → `Currency_Timestamp`.
- Lifecycle timestamps: `createdAt`, `updatedAt`, etc. on sessions, social, bridges, ENS stay on the owning record—they are not metric streams.

Market graph notes: `$/constants/Market.ts`. Quote / OHLC UI: Entity views — Lens, liquidity, markets.


## Sources (`src/sources/**`)

The repo uses `src/sources/**` for external I/O and source metadata registration.

Source ownership:

- A `SourceProvider` is the vendor, host family, protocol project, or local subsystem that owns shared source metadata, environment gating, transport origins, and concrete source rows.
- A `Source` is one concrete executable wire contract under a provider: transport plus endpoint family/protocol shape, such as REST/OpenAPI, GraphQL schema, EVM JSON-RPC, XRPC lexicon, GitHub raw files, or internal constants.
- Provider roots (`$/sources/<Provider>/index.ts`) own provider metadata, provider-level env, and executable origins. Transport folders (`$/sources/<Provider>/<Transport>/`) own source definitions and network code (`queries.ts`, optional `client.ts`, `constants.ts`, `types.ts`, and generated schema files). Resolvers own source-to-schema mapping.
- `src/constants/**` may hold protocol/catalog/reference rows. Executable base URLs, RPC URLs, REST API origins, gateway origins, and endpoint rows used by source clients must live in `src/sources/**` or be projected into provider origins there. Do not export primitive endpoint URL maps from constants for source clients.

Registry contract:

- `$/sources/$SourceProvider.ts` exports `SourceProvider` enum and `SourceProviderDefinition`
- `$/sources/$Source.ts` exports `Source` enum, `SourceDefinition`, and `SourcePublicEnvWire` (`Record<string, string>` — the wire shape for public env passed into ArkType)
- `$/sources/*/index.ts` default-exports provider definitions (`SourceProviderDefinition`)
- `$/sources/*/**/index.ts` default-exports transport/source definitions (`SourceDefinition` rows listed on the provider’s `sources` array)
- `$/sources/index.ts` exports `Source`, `sourceProviders`, `sources`, `enabledSources`, `resolverPublicEnv`, and `resolverPublicEnvBySource` (`sourceProviders` is annotated `readonly SourceProviderDefinition[]` so the list is not inferred as a union of literal provider shapes, which would break `flatMap` / `filter` typing)

Env typing: optional `env` on a provider or source is an ArkType `Type<SourcePublicEnvWire>`. Narrower object schemas are built with `import { type as arktype } from 'arktype'` and `arktype({ PUBLIC_*: 'string', … })`.

Gating (`$/sources/index.ts`):

1. Build `resolverPublicEnv` from `$env/dynamic/public`: every entry uses `value ?? ''` so values are strings; `satisfies SourcePublicEnvWire`.
2. For each optional `env` schema, call the schema as a function with `resolverPublicEnv`. Reject if the result is `instanceof arktype.errors`, or if any validated string value is empty/whitespace (plain `.allows()` is insufficient because `''` still satisfies `'string'`).
3. Keep providers and transports using `'env' in … ? ….env : undefined` for narrowing, same predicate as step 2.
4. `resolverPublicEnvBySource` maps each enabled `Source` to either the full `resolverPublicEnv` (no `env` on that definition) or an object containing only the keys from that source’s validated env output.
5. `enabledSources` is a `Set<Source>` of the `source` field on the filtered `SourceDefinition` list.

If a provider’s `env` fails, none of its transports are included. If a transport’s own `env` fails, that row is dropped even when the provider passed.

Provider definition shape:

```ts
{
	provider: SourceProvider
	label: string
	env?: Type<SourcePublicEnvWire>
	sources: readonly SourceDefinition[]
}
```

Source definition shape:

```ts
{
	provider: SourceProvider
	source: Source
	label: string
	env?: Type<SourcePublicEnvWire>
}
```

`$/resolvers/index.ts` imports `enabledSources` and keeps only resolver modules whose exported `source` is in that set; it then attaches `source` onto each resolver entry when flattening `resolvers`.

Transport folders continue to hold network code (`queries.ts`, optional `client.ts`, `constants.ts`, `types.ts`, generated schema files). In resolvers, load `queries.ts` / `constants.ts` via inline `await import(...)` inside each `resolve(...)` instead of top-level imports. Stable wire shapes or resolver-facing types live in `types.ts` (not `queries.ts`). Use `context.publicEnv` inside `resolve` when a source query needs public environment values.

- **`queries.ts` export naming:** Exports must start with a verb (usually `get`, `fetch`, `list`, `search`, `query`, `collect`, `stream`, `normalize`, `parse`, `iterate`, `lookup`, `count`, `narrow`, `debug`, `subscribe`). Do **not** include the source or transport name as a namespace-style prefix — the import path already provides that context (e.g. write `getProfile`, not `bskyGetProfile`; write `getCoin`, not `getCoingeckoCoin`; write `getBlockByNumber`, not `getBlockByNumberBlockscout` or `ethGetBlockByNumber`).

### Source client freshness audits

Use this when asked to verify that `src/sources/**` generated or manually implemented clients are current and correctly wired.

- Generated clients:
	- Re-run the documented generic sync command, not one-off download aliases: `pnpm run sources:openapi` and/or `pnpm run sources:graphql`.
	- If an all-source sync fails after some providers succeed, retry with the documented single-provider/module form (`pnpm run sources:openapi -- <Provider>`, `pnpm run sources:graphql -- <SourceModule>`) to separate transient network failures from dead URLs.
	- If sync fails because of sandboxed networking or `tsx` IPC, rerun the same documented command with approval instead of replacing it with an ad hoc downloader.
	- Treat successful downloads as remote URL validation; if a remote URL fails, check the provider’s current official docs before changing manifests.
	- Keep generated artifacts checked in (`schema.graphql`, `graphql-env.d.ts`, OpenAPI schema file, `openapi.d.ts`). Do not hand-edit generated files except to intentionally fix generator output.
	- After regeneration, verify every generated transport folder still has its manifest, checked-in schema, generated type output, `client.ts`, `queries.ts`, and `index.ts` (plus `types.ts` for OpenAPI wire aliases).
	- When generated output changes dramatically, inspect whether the manifest is now hitting a broader schema source (for example live GraphQL introspection instead of a small hand-exported SDL) and verify downstream query documents still compile.
- Manual clients:
	- Check current official provider docs for base URL, path prefixes, auth header/query shape, required headers, CORS/proxy reality, pagination limits, and response envelopes before making code changes.
	- Prefer official docs, OpenAPI specs, provider GitHub docs, or machine-readable docs (`llms.txt`, OpenAPI, GraphQL introspection) over third-party examples.
	- Update constants/client code only for documented drift; keep provider-specific transport behavior in `src/sources/**` and avoid new wrapper layers.
	- If a provider has no stable official public API documentation for the endpoint in use, say that explicitly in the handoff and avoid speculative rewrites.
- Resolver wiring:
		- Trace every downstream resolver that imports the touched `queries.ts` and confirm it loads source modules with inline `await import(...)`, passes `context.publicEnv` when required, and maps wire data into schema-shaped fields/refs.
	- Validate entity ids, timestamp clocks, market/chain predicates, and optional-vs-required schema fields at resolver boundaries. Resolver output should be schema-shaped, not provider-shaped.
	- When a generated GraphQL client has a colocated `graphql-env.d.ts`, its `queries.ts` must import `graphql` from the same folder’s `client.ts`; do not reuse a neighboring provider’s gql.tada instance even if schemas currently match.
- Selective checks:
	- Run `pnpm run lint` after each meaningful batch.
	- Run targeted unit tests for touched source/resolver areas when present (for example `pnpm exec vitest run src/sources/Blockscout/Rest/constants.spec.ts --project=server`).
	- Use `pnpm run check` or `pnpm exec tsc --noEmit --project tsconfig.json --pretty false` as broader gates when feasible, but if the tree has pre-existing unrelated failures, record the first unrelated failure area and continue with focused source/resolver checks.
	- For live-data resolver validation, prefer existing probe harnesses/routes where available instead of adding broad new tests; keep probes scoped to providers/files touched.
	- In the final handoff, list generated sync commands run, official docs/classes of docs checked for manual clients, focused tests run, and any broader checks blocked by unrelated existing failures.

### OpenAPI schema codegen (`scripts/openapi-source.ts`)

Use this when a transport lives under `src/sources/<Provider>/OpenApi/` and you want checked-in schema plus generated TypeScript types for paths and components.

Tooling: `openapi-typescript` emits a TypeScript AST from the schema object; the script writes it with `astToString`. If the downloaded file is Swagger 2.x (top-level `swagger` string), `swagger2openapi` converts it to OpenAPI 3 before generation. YAML (`.yml` / `.yaml`) is parsed with `yaml`; JSON uses `JSON.parse`. `package.json` maps `sources:openapi` to `pnpm exec tsx scripts/openapi-source.ts`; devDependencies include `openapi-typescript`, `swagger2openapi`, and `yaml`.

CLI (via `package.json`):

```txt
pnpm run sources:openapi
pnpm run sources:openapi -- <Provider>
```

With no argument, the runner discovers every `src/sources/*/OpenApi/schema-source.ts` manifest and syncs all providers. `<Provider>` is the single path segment under `src/sources/` to sync one provider (e.g. `Defillama`, `Coinpaprika`, `Dexscreener`). Sync downloads `schemaUrl` into `schemaFile`, then generates `typesFile`.

Manifest: add `src/sources/<Provider>/OpenApi/schema-source.ts` and export a `schemaSource` object:

```ts
export const schemaSource = {
	schemaUrl: string
	schemaFile: string
	typesFile: string
} as const
```

- `schemaUrl`: canonical upstream OpenAPI 3 or Swagger 2 document URL.
- `schemaFile`: path relative to the manifest directory for the checked-in downloaded spec (e.g. `./openapi.yml`, `./openapi.json`).
- `typesFile`: path relative to the manifest directory for generated types (convention: `./openapi.d.ts`).

Hand-written transport code: after generation, keep HTTP in `client.ts`, put wire shapes beside the manifest in `OpenApi/types.ts` (aliases from `openapi.d.ts` plus any hand-maintained payloads), and use `queries.ts` for operations — `Coinpaprika`, `Dexscreener`, and `Defillama` follow this layout. Resolvers import wire types from `types.ts`, not `client.ts` / `queries.ts`.

Package scripts: keep one generic `sources:openapi` script; do not add per-provider download/generate/sync aliases.

Replication checklist:

1. Add `src/sources/<Provider>/OpenApi/schema-source.ts` with `schemaSource` as above.
2. Run `pnpm run sources:openapi -- <Provider>` so `schemaFile` and `typesFile` exist and stay reproducible from `schemaUrl`.
3. Wire `client.ts` / `queries.ts` / `index.ts` and register the source like any other transport (see Adding new Sources / Providers).

### GraphQL schema codegen (`scripts/graphql-source.ts`)

Use this when a transport uses gql.tada against a GraphQL schema checked in next to the manifest (subgraphs and other APIs where SDL is the source of truth, or live GraphQL endpoints that support introspection). The runner downloads SDL or, when `schemaUrl` ends with `/graphql`, POSTs an introspection query, writes SDL to `schemaFile`, and generates the introspection module gql.tada expects.

Tooling: `@gql.tada/cli-utils` `generateOutput`. The script builds a temporary directory, writes a combined SDL file (main `schemaFile` body plus optional `patchFile` body, separated by a blank line), and writes a temporary `tsconfig.json` that extends the repo root `tsconfig.json` with `compilerOptions.plugins` containing one object: `name` `gql.tada/ts-plugin`, `schema` pointing at that combined SDL file, and `tadaOutputLocation` set to the manifest’s `outputFile`. `generateOutput({ output, tsconfig })` writes `outputFile` (convention: `./graphql-env.d.ts` beside the manifest). The temp directory is always removed afterward. `package.json` maps `sources:graphql` to `pnpm exec tsx scripts/graphql-source.ts`; dependencies include `gql.tada` and `graphql`, and the devDependency `@gql.tada/cli-utils` supplies `generateOutput`.

CLI (via `package.json`):

```txt
pnpm run sources:graphql
pnpm run sources:graphql -- <SourceModule>
```

With no argument, the runner discovers every `src/sources/*/Graphql/**/schema-source.ts` manifest and syncs all GraphQL modules. `<SourceModule>` is the path under `src/sources/` to sync one folder that contains `schema-source.ts` (no filename), e.g. `TheGraph/Graphql/Ens`.

Manifest: add `src/sources/<SourceModule>/schema-source.ts` and export `schemaSource`:

```ts
export const schemaSource = {
	schemaUrl: string
	schemaFile: string
	outputFile: string
	patchFile?: string
} as const
```

- `schemaUrl`: canonical SDL or schema document URL.
- `schemaFile`: relative path for the checked-in schema (convention: `./schema.graphql`).
- `outputFile`: relative path for generated introspection types (convention: `./graphql-env.d.ts`). gql.tada / GraphQLSP consume this file; the header comment in generated files states it is produced by GraphQLSP / gql.tada.
- `patchFile`: optional relative path to extra SDL appended after the main file when generating (separated by a blank line). Use this when upstream SDL is incomplete or subgraph-specific extensions are required (see `$/sources/TheGraph/Graphql/Ens/schema-source.ts` and `schema.patch.graphql`).

Scalar prelude on `download`: for every GraphQL manifest, if any of these lines are missing from the fetched text, the script prepends them once: `scalar BigDecimal`, `scalar BigInt`, `scalar Bytes`, `scalar Int8`. That keeps subgraph-style SDL that assumes hosted-graph scalars typecheckable locally.

Runtime client pattern: import `initGraphQLTada` from `gql.tada` and `import type { introspection } from './graphql-env.d.ts'`, then `initGraphQLTada<{ introspection: introspection }>()`. Use `TadaDocumentNode` for typed documents and keep HTTP in a small wrapper (see `$/sources/TheGraph/Graphql/Ens/client.ts` and shared `$/sources/TheGraph/Graphql/client.ts`).

Colocated files: beside the manifest, keep `schema.graphql` (downloaded or regenerated), `graphql-env.d.ts` (generated; do not hand-edit except when fixing generator output intentionally), `client.ts`, and `queries.ts` as needed for that module.

Package scripts: keep one generic `sources:graphql` script; do not add per-module download/generate/sync aliases.

Replication checklist:

1. Add `schema-source.ts` (with optional `patchFile`), `client.ts`, and `queries.ts` under `src/sources/<SourceModule>/`; run the sync once so `schema.graphql` and `graphql-env.d.ts` exist.
2. Export `schemaSource` as above; run `pnpm run sources:graphql -- <SourceModule>`.
3. Point gql.tada / editor tooling at the generated `graphql-env.d.ts` for that folder; register the transport in `$/sources` / resolvers like any other source.


## Resolvers (`src/resolvers/**`)

Resolvers are the bridge between `sources/` and the TanStack DB collections.

	- Module shape:
		- Use `defineResolver` from `$/resolvers/$resolvers.ts`.
		- Each provider module exports only `default { source, resolvers }`; do not export individual resolvers for other modules to call.
	- Register new modules in `$/resolvers/index.ts`; each default export includes `source: Source`, and the registry filters modules by `enabledSources` from `$/sources/index.ts`.
- Source boundary:
	- Put all `fetch` / HTTP / provider transport logic under `src/sources/**`. Resolvers call source query functions; they do not fetch external URLs directly.
	- **singleFlight:** Do not use in `src/sources/**` (plain async `queries.ts` exports only—no `*Once` helpers or `export const x = singleFlight(fn)`). In `src/resolvers/**`, dedupe at the call site with `await singleFlight(queryFn)(...)`; do not bind `singleFlight(queryFn)` to a module-level constant.
	- In resolvers, do not top-level import `$/sources//queries.ts` or `$/sources//constants.ts`; load them with inline `await import(...)` inside each `resolve(...)`.
	- Resolver-only type imports for wire payloads should prefer `$/sources/**/types.ts` (or generated OpenAPI components), not `queries.ts`.
		- `ResolverContext` (from `$/resolvers/$resolvers.ts`) includes `publicEnv`, the per-source slice from `resolverPublicEnvBySource` or full `resolverPublicEnv`. `$/collections/$collections.ts` passes it on every `resolve()` call; prefer `context.publicEnv` over `import.meta.env` so behavior matches source gating.
	- Thread `context` into source queries when the upstream API supports filtering, sorting, or limits (`filters` / `sorts` / `limit`).
- Resolver boundaries:
	- `resolve(...)` returns schema-shaped field data, not raw wire payloads.
	- Keep resolver modules shaped around resolver entries, not shared mapper layers. Put source-to-schema mapping inline in the relevant `resolve(...)` body unless a helper is clearly justified and explicitly approved.
	- Prefer resolver bodies that visibly read as: validate supported scope, call the owning source query, return schema-shaped fields. Avoid wrapping / unwrapping / grouping / ungrouping indirection unless it is genuine domain normalization or shared transport behavior.
	- Trust generated/manual wire types, parser output, schema `ZeroOrOne`, and catalog types. Keep field omission and simple normalization at the return object: `...(value != null && { field: value })`. Avoid generic `optional*`, `finite*`, or runtime validation helpers around already typed values, and avoid calling the same parser/normalizer twice inside one spread.
- Do not add trivial id/entity constructor helpers (e.g. `fooEntityRef`, `barFromWireId`) that only wrap `{ [EntityMetaKey.Id]: { … } }` or a one-line null check. Inline those at the call site in `resolve` / field resolvers.
- Shared transport behavior belongs in `src/sources/**`; `src/lib/**` is only for cross-domain helpers that clear the 90% confidence bar.
- Do not use `typeof` / `Array.isArray` / similar runtime shape checks on provider wire data when generated or hand-written **wire types** already define the field (gql.tada fragments, OpenAPI components, `types.ts` aliases). Prefer null/empty checks, optional chaining, and domain validators (`hexLowerOfByteSize`, ArkType at boundaries). Same bar as **Linting and quality → Runtime shape guards**; `typeof` remains for environment probes (`window`, `document`, `globalThis`) and genuinely untyped scalars (e.g. GraphQL `BigInt` as `unknown` until normalized with `BigInt(String(value))`, not `typeof value === 'string'`).
- One resolver should make one primary upstream source request whenever feasible.
- Do not create resolver waterfalls. If a second request enriches only a specific field, move that work to a field resolver or the owning `sources/**/queries.ts` function.
- Do not call another resolver's `resolve(...)`. If two resolvers need the same provider data, both should call the appropriate source query, or the shared transport logic belongs in `src/sources/**`.
- **`Source.Constants_Internal`:** Checked-in catalogs in `src/constants/**` are the snapshot. Load them with inline `await import(...)` and return lookup hits; throw when the id is missing. Small synchronous joins from other catalog lookup maps are OK when a schema row is a view over linked catalog rows, but keep that logic visible in the specific resolver body or build it into the canonical catalog row. Do not add RPC or other remote fetches to fill gaps in static catalog fields at resolve time. Do not extract catalog resolve/enrich/denormalize layers into `src/lib/**` or module-scope helpers, and avoid `Promise.all` over catalog lists only to backfill static fields—build those fields when the catalog rows are constructed.
	- Entity snapshots vs field facets:
		- A resolver owns one snapshot fetch for an entity type and exposes entity fields through its `fields` selectors.
		- Field facets that return many entities should normally return entity IDs / references, not fully mapped child entities.
		- Use field facets for truly field-scoped data only; avoid repeating identical endpoint calls across many fields for one entity.
		- Entity field collections apply the same optional `Source` filter as entity collections when the live query includes a `Source` `in` clause, so field facets for disabled or filtered-out sources are not invoked.
	- Failure behavior:
		- A declared field facet is a compatibility promise. Do not declare a field facet that can only throw `unsupported`, `not implemented`, or “wrong selector” for the source surface. Omit unsupported facets from the resolver `fields` map.
		- Throw when a schema-valid selector is invalid for the resolver’s domain slice, such as the wrong chain family, market kind, realm/category, id shape, or provider mapping for this source. These are invalid selector requests for that resolver, not empty results.
		- For declared many-field facets, return `[]` when the source successfully determines that this supported parent has no child rows. Do not return `[]` for fetch/parse/auth failures, unsupported source scope, missing required source mapping, or a facet that the source never supports.
		- Return `undefined` only for optional schema fields after a successful supported lookup confirms that the upstream has no value, or for documented auth-optional degradation where the resolver can still satisfy the optional field contract. Required scalar/source invariant failures throw.
		- Do not `catch` and return empty data. Rethrow or wrap with `{ cause }` and a source-prefixed message.
		- Do not return partial placeholder entity rows (e.g. only `{ epoch }` when header fetch was skipped, or `{}` when REST base is missing).
	- Error messages: `` `{Source}_{Transport}: <predicate>` `` (e.g. `` `Blockscout_Rest: no Blockscout v2 explorer for chain ${chainId}` ``, `` `Coingecko_OpenApi: OHLC is spot-only` ``). Reuse the message already thrown by a sibling resolver on that source when possible.
	- Selector parameters: destructure selector fields in resolver callbacks unless forwarding the whole selector unchanged to a source query or using it as an opaque selector key. Avoid repeated property drilling like `entitySelector.foo` when the callback uses individual fields.
	- Count facets:
		- `resolveCount` is authoritative only when the source exposes a count endpoint/value or the resolver has a complete unwindowed result set. Do not use a paginated/windowed page length as an authoritative count.
		- `partial: true` means the list facet result is intentionally incomplete for count fallback purposes; it is not a support declaration. Set it when a many-field facet returns a window/preview and no authoritative count exists, so the client does not infer a count from list length.
	- Source support metadata: source/provider constants should own statically known network, chain, transport, and feature coverage where practical. Resolver predicates should consume that metadata so unsupported surfaces are filtered before they look like runtime resolver failures.
- Live resolvers:
		- Optional `resolveLive` on a `defineResolver` field facet (see `ResolveLiveContext` in `$/resolvers/$resolvers.ts`) handles push-driven refresh from WebSockets or streams.
	- Keep `resolve` as the snapshot implementation.
		- `resolveLive` typically calls `invalidateFields` or `invalidateCounts` so the existing collection `queryFn` re-runs.
		- `mountEntityResolveLive` in `$/lib/db/resolveLive.svelte.ts` mounts resolver live facets from `$effect`; `startEntityFieldResolveLiveForParent` discovers field hooks for a parent id + field list.
	- One live resolver may invalidate sibling fields, such as Voltaire `Network` `blockHeight` `resolveLive` refreshing `$$blocks` and `$$transactions`.


## Adding new Sources / Providers

Mirror an existing neighbor such as `$/sources/Coingecko/Rest/` + `$/resolvers/Coingecko-Rest.ts`:

1. Create `$/sources/<Provider>/<Transport>/` with `queries.ts` and any `client.ts`, `constants.ts`, generated types, and `index.ts` default export. For OpenAPI or GraphQL transports, follow OpenAPI schema codegen / GraphQL schema codegen under Sources for manifests, runners, and `package.json` scripts before registering the source.
2. Create/update `$/sources/<Provider>/index.ts` default export and include its transport definitions
3. Ensure `SourceProvider.<Provider>` exists in `$/sources/$SourceProvider.ts`
4. Ensure `Source.<Provider>_<Transport>` exists in `$/sources/$Source.ts`
5. Add the provider’s default export to the `sourceProviders` array in `$/sources/index.ts` (filtered `sources` and `enabledSources` are derived from that list and env `.allows` checks)
6. Add `$/resolvers/<Provider>-<Transport>.ts` that maps wire data into schema fields
7. Register that resolver module in `$/resolvers/index.ts`
8. Extend or add schema definitions in `$/schema/*.ts`, and register new entities in `$/schema/index.ts` if needed
9. Verify with `pnpm run check` and exercise a route or view that hits the new resolver


## Collections and data flow

Current data flow:

1. `$/schema/index.ts` registers entity definitions
2. `$/resolvers/index.ts` aggregates resolver modules
3. `$/routes/+layout.svelte` calls `createCollectionsFromSchema(...)` and exports the live collections
4. `$/views/`, `$/components/`, routes, and `$/collections/$queries.svelte.ts` consume those collections via `useLiveQuery`

Most live queries live in `.svelte` views, but there is also existing shared query state in `$/collections/$queries.svelte.ts`. Follow the nearest existing pattern instead of introducing a new abstraction layer just to satisfy a generic rule.

### TanStack DB OPFS persistence

`$/client/$client.svelte.ts` composes product TanStack DB collections in this order: `createCollection(...)` → `persistedCollectionOptions(...)` → `queryCollectionOptions(...)` for Entity/Field/Count Persisted collection, plus a local-only persisted `LoadedSubset` collection for durable subset-completion metadata.

Built-in TanStack behavior:

- `queryCollectionOptions({ syncMode: 'on-demand' })` turns each live-query subset into a TanStack Query observer and gives the query function `meta.loadSubsetOptions`.
- `persistedCollectionOptions(...)` hydrates matching rows from OPFS before delegating to the upstream on-demand loader.
- TanStack owns query keys, stale/cache state, row persistence, row ownership metadata for non-empty query results, collection metadata persistence, and OPFS hydration.
- `persistedGcTime: Number.POSITIVE_INFINITY` and `staleTime: Number.POSITIVE_INFINITY` mean persisted rows and query results should not expire during normal app use. Keep both infinite unless a replacement refresh/expiry path is verified against warm reloads; a finite `staleTime` has previously caused immediate warm-reload refetches.

Local collection query behavior:

- TanStack’s persisted wrapper still invokes each Persisted collection `queryFn` after OPFS hydration. The query function must therefore return hydrated rows or row-count-validated loaded-marker completion before resolver work when the requested completed subset is already durable.
- Entity/Field/Count `queryFn`s wait for `LoadedSubset` hydration, check matching Persisted collection rows, and only run resolvers when durable rows/markers cannot satisfy the subset. For Field and Count collection `queryFn`s, hydrated rows satisfy a request only when every requested compatible source is represented; lower-priority hydrated rows must not suppress a missing higher-priority compatible source. A nonzero loaded marker never proves a nonempty subset by itself; it can suppress resolver work only when the matching persisted row count is present. For rendered Count results, resource readiness must at least be priority-complete: do not settle from a lower-priority Count Row while an earlier compatible count source is still missing.
- After every successful remote subset load, including successful zero-row and partial-source-result loads, the query function writes a `LoadedSubset` row keyed by `collectionId` plus the canonical loaded key plus `rowCount`, and awaits OPFS persistence. This is required because Persisted collection rows alone cannot represent “this subset loaded and returned zero rows” or “this compatible source completed with no row,” while the row count prevents a marker from hiding missing persisted nonempty rows after reload.
- For a given page URL, the first fresh-browser load may run resolver-backed network work through Persisted collections. A refresh of that same page must resolve from persisted TanStack DB Persisted collection for every subset completed during the cold load, without replaying the same resolver-backed `collectionId` + `loadedKey` network work or the same catalog HTTP. New work is legitimate only when the warm page requests a subset that the cold load never completed.
- Keep collection query functions typed from package-provided TanStack types where possible, especially `LoadSubsetOptions` and TanStack Query Collection metadata. Avoid duplicating sync param/result shapes locally unless package types cannot express the boundary.
- Do not replace this collection-level logic with route/view-specific guards, manual preloads, in-memory caches, or raw provider-response persistence unless the Persisted collection invariant is explicitly changed.

Verification:

- Use `tests/e2e/tanstack-db-persistence.e2e.ts` for OPFS persistence checks. It clears OPFS, installs the client persistence probe (`window.__blockheadPersistenceProbe` / sessionStorage), cold-loads every discovered `+page` route, records cold `markLoaded` events, refreshes the same page, and asserts completed Entity/Field/Count Persisted collection subsets hydrate from OPFS without warm `remote` replay for the same `collectionId` + `loadedKey` or repeated catalog HTTP. The same file also keeps the direct `$client` EVM network probe and schema-version invalidation proof.
- **CI / pre-merge gate:** `pnpm run test:e2e:persistence` (all discovered pages; dedicated dev server). Focus a single route with `E2E_PROBE_PATH=/network/eip155:1 pnpm exec playwright test tests/e2e/tanstack-db-persistence.e2e.ts -g "every discovered page"` or slice with `E2E_PATH_LIMIT=20`.
- Real-network suites may need provider-specific noise filtering for unrelated upstream 400/404/422/fetch failures.
- Current focused status must include the route-matrix refresh assertion. A narrow probe is acceptable while debugging only when the follow-up all-route gate is still required before closing persistence work.

Regression history (do not reintroduce):

1. **Finite `staleTime` / `persistedGcTime`** — TanStack Query background refetch bypasses `persistOnDemandSubsets` and repeats resolver HTTP on warm reload. Keep both `Number.POSITIVE_INFINITY` in `$collections.ts` unless a replacement refresh path is verified with `test:e2e:persistence`.
2. **`collectionSnapshotHasChanges` short-circuit without `everyListedSourceHydrated`** ([coins / `$$coins` thread](9bcb00da-fbfa-409d-8b45-31c2ec5ef194)) — Constants-only rows could satisfy a limited ordered snapshot while Coingecko (or other `Source in (…)`) never loaded; wrapper returned `true` and skipped remote fetch forever. Fix: require `everyListedSourceHydrated` before short-circuiting on snapshot changes; multi-source live queries must list **enabled** sources only (disabled providers never produce rows → subset never “complete”).
3. **Unfiltered catalog subsets** — Global `$$networks` and similar lists have `filters.length === 0`; `collectionHasHydratedSubset` alone is insufficient. `markLoaded()` must persist the `blockhead:loaded-subset:…` metadata marker after a successful remote load.
4. **`schemaVersion` bumps** (`+layout.svelte`) — intentional OPFS wipe; first visit after bump will refetch catalogs. Bump only when persisted row shape changes, not for unrelated features.
5. **Stale reused Vite dev server during Playwright** — `playwright.config.ts` notes mid-HMR `.svelte-kit/generated` can 500; use `PLAYWRIGHT_DEDICATED_SERVER=1` (or stop port 5173) for persistence runs. Page-wide warm reloads must not repeat resolver-backed work completed by the cold load; use the persistence probe’s `collectionId` + `loadedKey` replay check as the authoritative signal, with repeated catalog HTTP as an additional failure.
6. **Live `resolveLive` invalidations** — Voltaire block streams invalidate head block / tx lists; that is expected live refresh, not catalog persistence failure. Do not confuse with Chainlist / EthereumLists refetch.

Change checklist (any edit touching collections, layout persistence, or catalog field queries):

- Run `pnpm run test:e2e:persistence` after `$collections.ts`, `schemaVersion`, or Chainlist / EthereumLists field resolver changes.
- Never remove or route-around `persistOnDemandSubsets`; do not add view-local “already loaded” guards instead.
- New `Source in (…)` multi-provider field lists: filter to `enabledSources`; verify each listed source can hydrate rows for the subset.
- After schema/id shape changes: bump `schemaVersion` once and re-verify cold + warm reload.


---

## Entity Views (`src/views/*.svelte`)

- **`href` ownership**: Singular entity views (`*View.svelte`) compute their own `href` internally from `entityId` (e.g. `` `/network/${entityId.$network.networkSlug}/blocks/${entityId.height}` ``). Do not accept `href` as a prop unless there is a specific reason the canonical route cannot be derived from the id. List entity views (`*sView.svelte`) always accept `href` as a prop from the call site (used for their own header link); they do not pass it down to child item views — items self-link.
- Add `data-e2e` only where Playwright needs a stable selector (see Playwright E2E — `data-e2e`). Do not add decorative or non-test `data-*` tagging on `EntityView`, `EntitiesList`, or related entity chrome. Do not use `data-view`; when a non-test hook is needed, use a `class` referenced in that component’s local `<style>` (or an established global primitive from `src/styles/components.css`).
- Entity pages (`EntityView`, resource-backed views): Keep user-facing depth that still matters from older layouts (topology, execution RPCs/clients, explorers, related networks, forks, faucets, head block/epoch where applicable) while staying aligned with current schema field names (for example `$$blocks`, not stale or invented keys).
- Section chrome: Render a block only when it has meaningful payload; gate on the smallest truthful checks (`length`, `undefined`, domain-backed flags). Avoid technical placeholder copy whose only role is to fill space.
- `EntityView` + `<dl>` (required): At most two `<dl>` elements per card, and they must appear only in the `Content` snippet. Use two only when the first cleanly groups multiple live/current observation fields and the second groups multiple static/catalog identity fields (for example an EVM network card can show latest block/epoch/slot/gas in the live `<dl>`, then environment/layer/parent/CAIP-2 in the static `<dl>`). Otherwise use one `<dl>`. Do not use `<dl>` inside `Details` or other detail-only sections; put extra metadata as additional rows in the appropriate `Content` `<dl>` (with `{#if open}` when rows should only show when expanded). Each optional row is its own `{#if}…{/if}` (one row per guard). Do not use a single `{#if}` wrapping multiple rows. A nested `<EntityView>` (e.g. inline entity link) is its own card and may have its own `Content` `<dl>` — the limit is per `EntityView` instance, not the whole page.
- `Content` prose vs `<dl>`: Obvious text bodies, descriptions, bios, summaries, subtitles, social post content, comments, and feed/item excerpts should render as standalone `<p>` content in the `Content` snippet, using `<TruncatedValue>` when truncation is useful. Do not add `<dl>` rows named `Description`, `Bio`, `Text`, `Body`, `Summary`, `Publication`, or similar for prose copy; keep `<dl>` rows for structured metadata and relationships.
- `Content` row guards: Each `<dl>` item should be wrapped by at most one condition. If a row depends on expansion plus data presence, use one guard for that row (for example `{#if open && value !== undefined}`), not an outer `{#if open}` around several rows. Avoid nested guards around the same item unless the inner conditional is inside the row value itself.
- `<dl>` vs heading: Do not add `<dl>` rows that repeat fields already shown in the `EntityView` heading (linked title, subtitle line, icon-backed identity from `#snippet Icon()`, badges or labels rendered in the title row). Surface that information in the heading or in the `<dl>`, not both.
- `<dl>` vs parent id: On nested or scoped child cards, do not add `<dl>` rows for id fields that belong to the parent entity or that duplicate components already present on the child’s own id object (the parent route or enclosing context already establishes them). Omit those redundant id slices from the summary `<dl>`.
- **Enum labels in `<dd>`:** Every user-facing enum value shown in a `<dd>` (or equivalent detail copy inside `Content` `<dl>`) must use a human-readable label from `src/constants/**`, not the raw enum member string. Follow the Constants section: field-keyed rows in an internal `*Rows` list, exported plural lookup map (`networkEnvironmentByEnvironment`, `bridgeSettlementModels`, `evmTransactionKinds`, …), then `.label` in markup (e.g. `<dd>{bridgeSettlementModels[step.settlementModel].label}</dd>`). Wire-shaped free strings (API status text, Chainlist `relationshipType`, proposal `documentCategory`) stay as-is unless promoted to a schema enum with labels.
- `useEntity` selection: Prefer hierarchical resolver/source inheritance (a concise top-level `$` source list; nested field entries use `{}` where children inherit) instead of repeating the same `$` on every nested property when the model allows it. Prefer inlining short `$derived` values and colocating `{#if}` conditions beside the markup they guard over one shared visibility object unless branches genuinely share the same decision.
- **Icon in heading vs Content `<dl>`:** Artwork shown in `#snippet Icon()` must not be repeated in Content `<dl>` (no Icon, Avatar, Image, Thumbnail, or Profile image rows when the header icon already shows the same asset). Banner or Open Graph image fields that differ from the icon are OK.
- Title / media: When the loaded entity exposes artwork (for example `$icon`), show it in the title row using the existing `Icon` snippet plus shared icon components (`IconComponent`, etc.), matching patterns from other entity views.
- `EntityView` / `EntityId` snippet contracts: For bundled context (`Content`, `Details`), use an optional first tuple parameter with optional object fields (for example `Snippet<[context?: { title?: string, href?: string }]>` and `Snippet<[context?: { open?: boolean }]>`). Call sites that ignore the bundle may use `{#snippet Content()}` / `{#snippet Details()}` instead of destructuring unused bindings.

### Entity identity row (`$/components/EntityId.svelte`, `$/components/EntityView.svelte`)

- `Value` / `Title` / `Heading` snippets: value-only id (no kind prefix); labeled card/link text; loaded summary when resolver data beats the raw id.
- Card summary: `Heading` → `Title` → `Value` → `title` prop. `EntityLayout.Value` → `Value` only; `EntityLayout.Title` → `Title` then `Value`. Do not use bare `{@render Value()}` for `Title` when a loaded label exists.
- `Title` / `Heading` patterns — kind + `{@render Value()}` (`EvmBlockView`); `ResourceBoundary` + fallback (`YouTubeVideoView`, `EvmSelectorView`); `Heading` loaded, `Value` id + `EntityLayout.Value` inline (`CoinView`); `Title` prose vs `Value` id (`LiquidityPoolView`, `EnsView`); hub/protocol name, not `entityId.scope` (`FarcasterView`, `GlobalView`). No `·` in title copy.
- `EntityId`: icon + linked label; summary link wraps `#snippet Icon` and label so the row is one draggable target. `EntityView` header uses the HTML `<Heading>` component; `HeadingAfter` and collapsed `Content` live there, not on `EntityId`.
- Readable ids: no `stringify(entityId)` in user-visible snippets; use `<Address>`, `<TruncatedValue>`, domain labels. Fine for `id`, view-transition names, drag text, route params.
- Do not repeat summary identity in `<dl>` rows (see `<dl>` vs heading above). `EntitiesList` context hides per-row type annotation.

### Related entities: inline `Title` vs `CollapsibleTabs`

Be deliberate about how child entities appear in `Content` and `Details`. Default to the lightest layout that matches cardinality and depth.

Inline entity reference (`layout={EntityLayout.Value}` in a `<dl>` row when `<dt>` already names the kind; `EntityLayout.Title` when the inline row needs the full labeled title; never `EntityLayout.Summary` / `SummaryDetails` for entity refs inside `<dl>` items):

- One related entity (parent market, upstream coin, network, pool, block, wallet-on-network, from/to deployment, …).
- The child is primarily a link target—identity + navigation, not a nested card to expand on this page.
- Choose the inline layout to avoid repeated words: use `EntityLayout.Value` for rows like `Block`, `Epoch`, `Slot`, `Network`, `Owner`, `Author`, `From`, `To`, or `EntryPoint` where the `<dt>` already names the role/kind; use `EntityLayout.Title` only when the row needs the entity's labeled title for clarity.
- Set `open={false}` and `showTypeAnnotation={false}` on nested views inside another entity’s `<dl>`.
- Prefer `Address`, `TruncatedValue`, or plain catalog strings only when there is no schema-backed entity row to link (or the field is not modeled as an entity ref).

Intrinsic / definitional refs (especially smart contracts that are part of the parent’s identity—not contextual links like owner, network, or thread parent):

- Render as an embedded child `EntityView` with `layout={EntityLayout.SummaryDetails}` and `showTypeAnnotation={false}`.
- Prefer `open={true}` when the ref is the main subject (pool on a position, registry on an 8004 service, contract on an ERC-4337 row, market base/quote); `open={false}` when there are several sibling refs (pair tokens on a pool, step tokens in a route).

Flat `<section>` in `Details` (no carousel):

- One or two substantive blocks that are not single-entity links: a field list (`*View` with `entityFieldReference`), a chart hub (`MarketOhlcHub`), route-local `children`, etc.
- Example: `MarketView` — spot (`MarketPricesView`) + OHLC (`MarketOhlcHub`) as sibling sections; base/quote legs use embedded `SummaryDetails` in `Content`.

`CollapsibleTabs` + `entity-view-detail-carousels`:

- Three or more distinct sections, or two or more sections where each is a list / feed / chart column worth horizontal scroll markers (not a lone nested card).
- Hub pages that group registry slices: `NetworkView`, `CoinView`, `FarcasterView`, `EvmNetworkAccountView` (balances + activity), etc.
- Each carousel section should earn its marker row; do not wrap a single child view or `{@render children()}` alone.

Avoid:

- `CollapsibleTabs` for one related entity (e.g. parent market on a timestamp row, host network on a wallet row)—use inline `Title` in `Content` instead.
- `EntityLayout.Title` nested cards in `<dl>` rows when the ref is intrinsic to the parent (use `SummaryDetails` per above)—`Title` remains for relational one-line links (host network, owner, parent comment).
- Duplicating the same inline `Content` refs again in `Details` carousels (e.g. origin tx + initiator on `BridgeTransactionView`).
- Raw ids (chain id strings, truncated pool addresses) when a `NetworkView`, `LiquidityPoolView`, `CoinInstanceView`, etc. exists for that ref.

Quick check: *If collapsing the section hides only one link line, use `Title` in the `<dl>`; if it groups multiple lists or tools, use tabs or flat titled sections.*

### Domain-oriented views (settings, storage, social)

Keep these semantics stable in UI copy and `useEntity` wiring; do not add `data-view`. Add `data-e2e` only when a Playwright test already targets the node (same bar as `NetworkView`, which uses a small fixed set of carousel/collapsible roots—do not blanket other entity pages with parallel hooks).

| View | Role |
|------|------|
| `SettingView.svelte` | `_Global` settings hub: navigation/usage copy clarifies this is app preferences and usage (e.g. Dune credits), not the resolver `Source` catalog. |
| `SourcesView.svelte` | Lists persisted `BlockheadSource` rows (saved transports), gated by `Source.Local_Internal`; distinct from enabled `Source` definitions in `$/sources/index.ts`. |
| `SelectorsView.svelte` | Parent-scoped `$$evmSelectors` field list (not the global catalog). |
| `TopicsView.svelte` | Parent-scoped `$$evmTopics` field list (not the global catalog). |
| `EvmSelectorsView.svelte` | `_Global` `$$evmSelectors` catalog (`Source.Local_Internal`); row detail resolves signatures via `Source.Openchain_Rest`. |
| `EvmTopicsView.svelte` | `_Global` `$$evmTopics` catalog (`Source.Local_Internal`); `/evm` hub carousel + `/evm/topics` list. |
| `EvmErrorsView.svelte` | `_Global` `$$evmErrors` catalog (`Source.Local_Internal`); `/evm/errors` list + hub carousel. |
| `EvmSelectorView.svelte` / `EvmTopicView.svelte` / `EvmErrorView.svelte` | Per-hex signature lookup (`Source.Openchain_Rest`); routes under `/evm/selector|topic|error/[hex]`. |
| `EvmLogView.svelte` | EvmLog by network + tx hash + log index; topics link to EvmTopicView, emitter `EvmContractView` (`EntityLayout.SummaryDetails`); topic 0 in heading via nested EvmTopicView. |
| `EvmLogsView.svelte` | Receipt log list from parent `$$logs` on EvmTransaction; rows link to `/network/…/tx/…/log/[logIndex]`. |
| `EvmTraceTreeView.svelte` | Recursive EvmTrace call tree on a transaction; each frame renders EvmTraceContentView (selectors, value transfers). |
| `EvmTraceContentView.svelte` | Single trace frame: selector signatures, value transfers, nested calls. |
| `EvmTransactionInputDecode.svelte` | Inline tx input decode: EvmSelector link + OpenChain signatures when expanded. |
| `evm/calldata-decoder` | `/evm/calldata-decoder`: paste hex calldata or event data; OpenChain selector/topic lookup + ABI decode; shareable `?data=` query. |
| `evm/+page.svelte` | EVM hub (`GlobalView`): carousels for topics, selectors, errors, and calldata-decoder link. |
| `EvmTransactionView.svelte` | Single EvmTransaction by chain + tx hash; Blockscout / Voltaire execution fields. |
| `EvmTransactionsView.svelte` | Transaction list from a parent `$$transactions` field reference (block or network). |
| `FarcasterAccountView.svelte` | `BlockheadFarcasterAccountConnection`: connected FID, custody, verifications; Neynar / Snapchain. |
| `FarcasterAccountsView.svelte` | `_Global` `$$blockheadFarcasterAccountConnections` list (sorted by FID). |
| `FarcasterCastView.svelte` | Cast by author FID + cast hash; channel, thread, mentions, embeds; feed vs hub layout. |
| `FarcasterCastsView.svelte` | Cast cards from a FarcasterFeed `$$entries` field (e.g. hub trending). |
| `FarcasterChannelView.svelte` | FarcasterChannel by id; stats, pinned cast hash, lead/moderators as FID links. |
| `FarcasterChannelsView.svelte` | `FarcasterNetwork` `$$channels` registry list. |
| `FarcasterFeedView.svelte` | Feed (trending, by FID, by channel, following); `$$entries` cast stream + live resolve where wired. |
| `FarcasterFeedsView.svelte` | `FarcasterNetwork` `$$feeds` catalog with stable routes per feed variant. |
| `FarcasterUserView.svelte` | FarcasterUser: FID, fname (`@username`), profile fields, verified EVM address. |
| `FarcasterUsersView.svelte` | `FarcasterNetwork` `$$users` list (FID-sorted). |
| `FarcasterView.svelte` | `FarcasterNetwork` hub: carousels for feeds, trending casts, channels, users, and connected accounts; registry metadata in `Content` `<dl>`. |
| `GlobalView.svelte` | `_Global` hub: app navigation shortcuts, Dune usage, `EntityType._Global` details—distinct from resolver Source rows (SettingView). |
| `IpfsBrowseEntityChrome.svelte` | `IpfsResource` browse + gateway metadata via `Source.Ipfs_Rest` (collapsible CID / path + current resource). |
| `IpfsBrowseView.svelte` | IPFS browse form: multibase CID, IPNS, `ipfs://` / `ipns://`, or gateway URL → canonical resource navigation. |
| `StateChannelsView.svelte` | Off-chain state channel rows (`StateChannel` / `ChannelView`); not on-chain event streams. |
| `SwarmBrowseView.svelte` | Swarm browse form: BZZ references and gateways; copy states this is not IPFS (`bzz://` vs CIDs). |
| `SwarmResourceView.svelte` | Resolver-backed `SwarmResource` entity: canonical URI, gateway, typed content via `Source.Swarm_Rest`. |
| `UrlView.svelte` / `UrlsView.svelte` | `Url` entities: arbitrary web URLs with catalog / Open Graph enrichment. |
| `VaultView.svelte` / `VaultsView.svelte` | `Vault` here is concentrated-liquidity / DEX pool metadata (e.g. token pair, ticks, TVL from `Source.Dexscreener_OpenApi`), not ERC-4626 yield vaults—wording should not imply share-token vault semantics. |
| `XPostView.svelte` / `XPostsView.svelte` / `XUserView.svelte` / `XUsersView.svelte` | X (Twitter) posts and profiles; field lists combine `Source.Constants_Internal` on the parent with `Source.X_Rest` on the relation where applicable. |
| `XView.svelte` | `XNetwork` hub: carousel of profiles + posts lists (`entity-view-detail-carousels` + `CollapsibleTabs` like `FarcasterView`); singleton metadata via `Source.Constants_Internal`. |
| `XmtpView.svelte` / `XmtpConversationsView.svelte` / `XmtpConversationView.svelte` | `XmtpNetwork` + `XmtpConversation`: `_Global` `$$actors` / `$$xmtpConversations` (`Source.Local_Internal`); omit `Content` `<dl>` ids that duplicate the conversation identifier in `#snippet Title`. |
| `Proposal*View.svelte` / `ProposalsView.svelte` | Proposal catalogs: realm (`ProposalRealm`) scopes kind (`ProposalKind`: EIP / CAIP / …), then upstream `Proposal` documents; `ProposalKindsView` / `ProposalRealmsView` mirror `/proposals/…` navigation; mute copy distinguishes spec text from live governance tallies where applicable. |
| `Reddit*View.svelte` | `RedditNetwork` lists subreddits + popular submissions, `RedditLinkView` nests `$$comments`, `RedditCommentView` resolves `$link`; terminology stays Reddit-native (subreddit, submission, comment thread) versus Farcaster/X. |
| `RoomView.svelte` / `RoomsView.svelte` | `BlockheadRoom`: realtime multiplayer session (`Local_Internal`), framed apart from Reddit, XMTP, Swarm; `RoomsView` uses `RoomView` rows. |
| `charts/Market_TimeInterval_Timestamp.svelte` | Candlesticks over `EntityType.Market_TimeInterval_Timestamp` OHLC points; callers choose `title` / interval framing—surface that linkage in muted chrome so charts stay tied to Market interval semantics. |

## SvelteKit routes and views (`src/routes/**/*`)

`src/views/*.svelte` / `src/routes/**/*.svelte`:
- NO TYPESCRIPT TYPE ASSERTIONS. EVER.

URLs and nav: `src/routes/navigationItems.svelte.ts`. `(…)` = layout groups only (not URL). Add `+layout` only for shared chrome or multiple children; drop empty groups. Never colocate `+layout` + `+page` except under `routes/`. Shallow `routes/<segment>/+page.svelte` OK for hubs; same rules with a prefix: `routes/<urlPrefix>/(area)/…`.

Lists / detail — List: `(area)/<domainList>/+page`. Bad list: `(area)/(<domainList>)/<domainList>/+page` (duplicated list token). Hub: `(<hub>)/<hub>/…` = same string for group folder + next segment (not the list bad pattern). `<domainList>` ↔ `<domainItem>` plural/singular; `[<domainItemKey>]` id segment (`coinId`, …). `staticBeforeKey/` = literals before `[domainItemKey]`. `(<domainListGroup>)` ≈ `domainList`. Detail: `<domainItem>/[domainItemKey]/+page` beside `<domainItem>/[domainItemKey]/(<domainItem>)/+layout` (path + chrome share `domainItem`).

Deep — Parent: `<parentItem>/[parentKey]/(<parentItem>)/`. Facet list: `/(<parentItem>)/<childList>/+page`. `(<scopedSlice>)` + `childItem`/`[childKey]` / `(<childItem>)` like domain level; grandchild routes nest under child. Composite: `<compositeItem>/[compositeKeyFirst]/…`. Slice: same `<sliceNoun>` for list + `[sliceKey]` under `(<sliceGroup>)`. Facets: `<facetStatic>`, `(<facetBranch>)` + inner list/item/key placeholders. Double `( )/` only if both wrappers need several routes.

Templates — `routes/.../` = any `src/routes/` prefix (incl. `<urlPrefix>`). Repeated placeholder = same folder name. `domainList`/`domainItem`/`[domainItemKey]` as above.

- List (section)
	routes/(area)/+layout.svelte
	routes/(area)/<domainList>/+page.svelte

- Provider hub — <hub> repeated: group folder + next URL segment (not the list mistake)
	routes/(area)/(<hub>)/<hub>/+layout.svelte
	routes/(area)/(<hub>)/<hub>/<domainList>/+page.svelte
	routes/<urlPrefix>/(area)/(<hub>)/<hub>/<domainList>/+page.svelte

- Domain family + detail — <domainListGroup> usually same string as <domainList>; <domainItem> repeated for path + (chrome)
	routes/(area)/(<domainListGroup>)/+layout.svelte
	routes/(area)/(<domainListGroup>)/<domainItem>/[<domainItemKey>]/+page.svelte
	routes/(area)/(<domainListGroup>)/<domainItem>/[<domainItemKey>]/(<domainItem>)/+layout.svelte
	routes/(area)/(<domainListGroup>)/<staticBeforeKey>/[<domainItemKey>]/+page.svelte
	routes/(area)/(<domainListGroup>)/<staticBeforeKey>/[<domainItemKey>]/(<domainItem>)/+layout.svelte

- Detail with only (area) — no (<domainListGroup>)
	routes/(area)/<domainItem>/[<domainItemKey>]/+page.svelte

- Under (<domainItem>) chrome — inner list / inner detail for that entity
	routes/.../(<domainItem>)/<innerList>/+page.svelte
	routes/.../(<domainItem>)/<innerItem>/[<innerKey>]/+page.svelte

- Parent entity — <parentItem> matches (<parentItem>); children use child* / grandchild* tokens
	routes/.../<parentItem>/[<parentKey>]/(<parentItem>)/+layout.svelte
	routes/.../(<parentItem>)/<childList>/+page.svelte
	routes/.../(<parentItem>)/(<scopedSlice>)/+layout.svelte
	routes/.../(<parentItem>)/(<scopedSlice>)/<childList>/+page.svelte
	routes/.../(<parentItem>)/(<scopedSlice>)/<childItem>/[<childKey>]/+page.svelte
	routes/.../(<parentItem>)/(<scopedSlice>)/<childItem>/[<childKey>]/(<childItem>)/+layout.svelte
	routes/.../(<childItem>)/<grandchildList>/+page.svelte
	routes/.../(<childItem>)/<grandchildItem>/[<grandchildKey>]/+page.svelte

- Scoped slice — <sliceNoun> shared by list + param detail under (<sliceGroup>)
	routes/.../(<sliceGroup>)/<sliceNoun>/+page.svelte
	routes/.../(<sliceGroup>)/<sliceNoun>/[<sliceKey>]/+page.svelte

- Composite key — <compositeItem> + numbered compositeKey* parts (add more as needed)
	routes/.../<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/[<compositeKeyThird>]/+page.svelte
	routes/.../<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/[<compositeKeyThird>]/[<compositeKeyFourth>]/+page.svelte

- Composite under (<domainListGroup>) — keys belong to <compositeItem>
	routes/.../(<domainListGroup>)/<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/+page.svelte
	routes/.../(<domainListGroup>)/<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/[<compositeKeyThird>]/[<compositeKeyFourth>]/+page.svelte

- Facets — host uses <domainItem> / [<domainItemKey>] / (<domainItem>); branch uses facet* tokens
	routes/.../<domainItem>/[<domainItemKey>]/(<domainItem>)/+layout.svelte
	routes/.../(<domainItem>)/<facetStatic>/+page.svelte
	routes/.../(<domainItem>)/(<facetBranch>)/+layout.svelte
	routes/.../(<facetBranch>)/<facetInnerList>/+page.svelte
	routes/.../(<facetBranch>)/<facetInnerItem>/[<facetInnerKey>]/+page.svelte

### Anti-examples

- Bad: `(area)/(<domainList>)/<domainList>/+page` (list doubled with parens). Good: `(area)/<domainList>/+page`; detail under `(<domainListGroup>)/<domainItem>/[…]` with `domainListGroup` ≈ `domainList`.
- Bad: banning `(<hub>)/<hub>/` as if it were the list error. Good: hub repeat OK; wrong is only `(<domainList>)/<domainList>/+page`.
- Bad: detail `+layout` on `<domainList>/[key]/` (inverted). Good: `(<domainListGroup>)/` then `<domainItem>/[domainItemKey]/+page` and optional `(<domainItem>)/+layout`.
- Bad: hardcoded heading URL in a shared view. Good: `headingHref` / `headingLabel` from route.
- Bad: placeholder IDs in detail pages. Good: real `params`, validated to entity ID type.
- Bad: deep `(group)/` with one file, no shared chrome. Good: merge or give the layout several children / shared UI.

Checks — New routes must not match any Bad row above.

### Validation

Visit page with Playwright, collect console errors, read them, iterate until none appear

## TanStack DB queries

- LIMIT and OFFSET require an ORDER BY clause to ensure deterministic results
