## Agents

- Reply in a concise style; avoid repetition or filler
- Be DRY and declarative
- Inline derived intermediate variables, especially if used once (same in markup: no one-off `{@const}` / `const` / `$derived` when the value is only referenced once—inline it)
- Assistant / handoff summaries: Do not respond with large JSON blobs, `devalue` / `stringify(entityId)` dumps, or other machine-oriented payloads into chat summaries; describe intent and point to paths or small code citations instead
- Name variables, snippets, callback parameters, and arguments by what they are; never abbreviate identifiers.
- Do not introduce new files or helper functions without proper justification, a detailed plan, and explicit permission
- Composer 2.5: this is NOT a React / Motion project. do not use `</motion>` to close HTML tags.
- Do not write codemod scripts to do HTML wrapping/unwrapping refactors. If you make a mistake, do not git revert when there are existing working changes

### Editing

- End files with a single line break
- Avoid trailing spaces


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

### Entity views — Lens, liquidity, markets

- `LensView` / `LensPostsView`: `LensNetwork` hub (scope, profile and publication counts). Registry carousel sections use `data-scroll-marker-label` (`Profiles`, `Recent publications`). Prefer roles, scroll markers, and existing network-style hooks over new `data-e2e` attributes.
- Liquidity — pool vs position: `LiquidityPoolView` is the pool (pair, fee, curve liquidity, token addresses). `LiquidityPositionView` and `LeverageView` are positions (pool ref, owner, ticks, position liquidity, token amounts). Lists `LiquidityPoolsView` and `LiquidityPositionsView` follow the same `EntitiesList` field-reference pattern as other domains; do not introduce `data-view` or speculative `data-e2e` hooks.
- Markets — OHLC, prices, intervals: `MarketView` anchors base/quote/venue and composes spot & index rows (`MarketPricesView`, `MarketPriceView`) with per-candle OHLC via `MarketOhlcHub` / `Market_TimeInterval_TimestampsView` on `$$marketTimeIntervalTimestamps` (one `Market_TimeInterval_Timestamp` row per candle; chart queries the field list for the selected interval). `MarketPrice` is stream identity only; spot/index prints are `Market_Timestamp` rows on `$$quotes` (`Market_TimestampView` / `Market_TimestampsView`). Single-candle detail uses `Market_TimeInterval_TimestampView`. Reuse carousel/`data-scroll-marker-label` patterns from `MarketView` and `NetworkView`; keep Playwright hooks sparing per above.


## TypeScript

### Formatting

- Use tabs
- Prefer `'` over `"`
- No `;` after statements (only leading `;` when needed before `(` / `[` / template literals)
- No `;` or `,` after `type` / `interface` properties
- Max 3 consecutive line breaks
- Object with > 1 prop, array with > 1 value: indent, one per line, trailing commas
- Generic with > 1 type param: indent, one per line
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
- Prefer `T[]` over `Array<T>`
- Prefer `[...array1, ...array2]` over `array1.concat(array2)`
- Conditional spread in object literals: Prefer `...(condition && { … })` over `...(condition ? { … } : {})` when the alternate branch would be `{}`. (Array literals still need `(condition ? […] : [])` or similar: spreading a falsy value into an array is not valid.)
- Prefer single expressions and inline logic
- Declare intermediate variables and functions ONLY if referenced more than once, otherwise inline
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
	— When something fails lint, treat that file as the contract, and use this order of operations:
		- Fix the underlying types (models, generics, function signatures) before reaching for assertions, `unknown`, or suppressions.
		- Prefer `overrides` scoped to a whole file or a small, stable glob when the exception is architectural (generated or hand-written “edge” modules that always need different rules), not for ad hoc escapes scattered across the tree.
		- Use `oxlint-disable-next-line` on the narrowest span with a one-line reason a reviewer can verify; if the same reason keeps reappearing, replace repeated disables with a scoped override or a proper type refactor.
		- At untyped boundaries, narrow with real domain types or a single shared wire type instead of defaulting to `unknown` or assertion escapes.
		- Anything that should meet the same bar as the primary checked tree must not live only under `ignorePatterns` unless that exclusion is intentional and reflected in the config.


## Constants (`src/constants/**`)

- Two blank lines between `// Types` → `// Constants` → `// Lookups` (same rhythm as script sections).
- Types — imports to type the catalog. Constants — optional string enum / ids; one `as const` list, `as const satisfies …` (TypeScript above). Lookups — `Object.fromEntries` maps; keys stay aligned with the list.
- File `Domain.ts`; export plural list + `thingById`-style maps. Example: `$/constants/Coin.ts`.


## Library helpers (`src/lib/**`)

- DO NOT add to `src/lib` unless explicitly asked. Keep logic inlined and local where used without trivial helper functions.


## Svelte (`*.svelte`, `*.svelte.ts`)

- Svelte 5 runes; NEVER legacy Svelte 4 (`$:`, `onMount`, `writable`)
- Prefer single expressions and inline logic
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
	- List `Item` snippets (`UnorderedList`, `OrderedList`, `RefinableList`, …): only destructure or branch on `isPlaceholder` when the snippet renders placeholder-specific UI for `isPlaceholder === true`. If you only render real rows, gate on `item` (e.g. `{#if item}`) instead of `{#if isPlaceholder === false}` with no placeholder branch — placeholder rows omit `item`.

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
	- Run `svelte-autofixer` for any Svelte edits (`.svelte` / `.svelte.ts`) and repeat until no suggestions remain

### Svelte components

- Display truncation: use `<TruncatedValue>` / `<Address>` (manual truncation is only OK for non-display logic). Entity card headings and secondary ids follow Entity Views → Entity summary row (no JSON-shaped summary ids).

---


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

Definitions in `$/schema/*.ts`; register in `$/schema/index.ts`. ArkType types entity ids and primitives; child rows use `$$…` entity-reference fields.

- Timestamped observations: As-of metrics (quotes, gas tiers, mempool counts, OHLC, …) live on `*_Timestamp` entities (`timestampMs` in the id; extra id keys when needed, e.g. `feedKey?`, candle `timeInterval`). Parents hold stable identity only—no snapshot scalars such as `price` or tiered gas on the header row.
- Resolvers / views: `defineEntityResolver` per snapshot; parent `defineEntityFieldResolver` returns entity refs. When upstream exposes one stats clock, `entityId.timestampMs` must match it. Latest row: sort `$$…` by `timestampMs`, nest `*_TimestampView`; history: `*_TimestampsView`. Shared observation field mappers only (not id wrappers): `$/resolvers/_marketSpotTimestamp.ts`, `_coinTimestamp.ts`, `_networkGasEstimateTimestamp.ts`.
- Examples: `MarketPrice` / `$$quotes` → `Market_Timestamp`; `Coin` / `$$timestamps` → `Coin_Timestamp`; `Market` → `Market_Timestamp`, `Market_TimeInterval_Timestamp`; `Network` / `$$gasEstimateTimestamps` → `Network_GasEstimate_Timestamp`, `$$txpoolTimestamps` → `Network_Txpool_Timestamp`; `Currency` / `$$timestamps` → `Currency_Timestamp`.
- Lifecycle timestamps: `createdAt`, `updatedAt`, etc. on sessions, social, bridges, ENS stay on the owning record—they are not metric streams.

Market graph notes: `$/constants/Market.ts`. Quote / OHLC UI: Entity views — Lens, liquidity, markets.


## Sources (`src/sources/**`)

The repo uses `src/sources/**` for external I/O and source metadata registration.

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

`$/resolvers/index.ts` imports `enabledSources` and keeps only resolver modules whose exported `source` is in that set; it then attaches `source` onto each resolver entry when flattening `entityResolvers` / `entityFieldResolvers`.

Transport folders continue to hold network code (`queries.ts`, optional `client.ts`, `constants.ts`, `types.ts`, generated schema files). In resolvers, load `queries.ts` / `constants.ts` via inline `await import(...)` inside each `resolve(...)` instead of top-level imports. Stable wire shapes or resolver-facing types live in `types.ts` (not `queries.ts`). Import `sourcePublicEnv` from `$/resolvers/$resolvers.ts` at module top (do not dynamically import `$resolvers` inside `resolve`).

### OpenAPI schema codegen (`scripts/openapi-source.ts`)

Use this when a transport lives under `src/sources/<Provider>/OpenApi/` and you want checked-in schema plus generated TypeScript types for paths and components.

Tooling: `openapi-typescript` emits a TypeScript AST from the schema object; the script writes it with `astToString`. If the downloaded file is Swagger 2.x (top-level `swagger` string), `swagger2openapi` converts it to OpenAPI 3 before generation. YAML (`.yml` / `.yaml`) is parsed with `yaml`; JSON uses `JSON.parse`. `package.json` maps `sources:openapi` to `pnpm exec tsx scripts/openapi-source.ts`; devDependencies include `openapi-typescript`, `swagger2openapi`, and `yaml`.

CLI (via `package.json`):

```txt
pnpm run sources:openapi -- <download|generate|sync> <Provider>
```

`<Provider>` is the single path segment under `src/sources/` that contains `OpenApi/schema-source.ts` (e.g. `Defillama`, `Coinpaprika`, `Dexscreener`). `download` fetches `schemaUrl` into `schemaFile`. `generate` reads `schemaFile` and writes `typesFile`. `sync` runs download then generate.

Manifest: add `src/sources/<Provider>/OpenApi/schema-source.ts` and export a `schemaSource` object:

```ts
export const schemaSource = {
	provider: string
	schemaUrl: string
	schemaFile: string
	typesFile: string
} as const
```

- `provider`: conventionally the same name as the `<Provider>` folder (used in log messages).
- `schemaUrl`: canonical upstream OpenAPI 3 or Swagger 2 document URL.
- `schemaFile`: path relative to the manifest directory for the checked-in downloaded spec (e.g. `./openapi.yml`, `./openapi.json`).
- `typesFile`: path relative to the manifest directory for generated types (convention: `./openapi.d.ts`).

Hand-written transport code: after generation, keep HTTP in `client.ts`, put wire shapes beside the manifest in `OpenApi/types.ts` (aliases from `openapi.d.ts` plus any hand-maintained payloads), and use `queries.ts` for operations — `Coinpaprika`, `Dexscreener`, and `Defillama` follow this layout. Resolvers import wire types from `types.ts`, not `client.ts` / `queries.ts`.

Convenience scripts: for each new OpenAPI provider, add three `package.json` scripts that forward to the same runner, mirroring existing `sources:openapi:download:<name>`, `sources:openapi:generate:<name>`, and `sources:openapi:sync:<name>` entries.

Replication checklist:

1. Add `src/sources/<Provider>/OpenApi/schema-source.ts` with `schemaSource` as above.
2. Run `pnpm run sources:openapi -- sync <Provider>` (or `download` / `generate` separately) so `schemaFile` and `typesFile` exist and stay reproducible from `schemaUrl`.
3. Wire `client.ts` / `queries.ts` / `index.ts` and register the source like any other transport (see Adding new Sources / Providers).

### GraphQL schema codegen (`scripts/graphql-source.ts`)

Use this when a transport uses gql.tada against a GraphQL schema checked in next to the manifest (subgraphs and other APIs where SDL is the source of truth). The runner downloads SDL and generates the introspection module gql.tada expects.

Tooling: `@gql.tada/cli-utils` `generateOutput`. The script builds a temporary directory, writes a combined SDL file (main `schemaFile` body plus optional `patchFile` body, separated by a blank line), and writes a temporary `tsconfig.json` that extends the repo root `tsconfig.json` with `compilerOptions.plugins` containing one object: `name` `gql.tada/ts-plugin`, `schema` pointing at that combined SDL file, and `tadaOutputLocation` set to the manifest’s `outputFile`. `generateOutput({ output, tsconfig })` writes `outputFile` (convention: `./graphql-env.d.ts` beside the manifest). The temp directory is always removed afterward. `package.json` maps `sources:graphql` to `pnpm exec tsx scripts/graphql-source.ts`; dependencies include `gql.tada` and `graphql`, and the devDependency `@gql.tada/cli-utils` supplies `generateOutput`.

CLI (via `package.json`):

```txt
pnpm run sources:graphql -- <download|generate|sync> <SourceModule>
```

`<SourceModule>` is the path under `src/sources/` to the folder that contains `schema-source.ts` (no filename), e.g. `TheGraph/Graphql/Ens` or `TheGraph/Graphql/Messari/AaveV3/Ethereum`. Actions match OpenAPI: `download`, `generate`, `sync`.

Manifest: add `src/sources/<SourceModule>/schema-source.ts` and export `schemaSource`:

```ts
export const schemaSource = {
	sourceModule: string
	schemaUrl: string
	schemaFile: string
	outputFile: string
	patchFile?: string
} as const
```

- `sourceModule`: should match the `<SourceModule>` path segment string you pass to the CLI (used for logs and copy-paste sanity).
- `schemaUrl`: canonical SDL or schema document URL.
- `schemaFile`: relative path for the checked-in schema (convention: `./schema.graphql`).
- `outputFile`: relative path for generated introspection types (convention: `./graphql-env.d.ts`). gql.tada / GraphQLSP consume this file; the header comment in generated files states it is produced by GraphQLSP / gql.tada.
- `patchFile`: optional relative path to extra SDL appended after the main file when generating (separated by a blank line). Use this when upstream SDL is incomplete or subgraph-specific extensions are required (see `$/sources/TheGraph/Graphql/Ens/schema-source.ts` and `schema.patch.graphql`).

Scalar prelude on `download`: for every GraphQL manifest, if any of these lines are missing from the fetched text, the script prepends them once: `scalar BigDecimal`, `scalar BigInt`, `scalar Bytes`, `scalar Int8`. That keeps subgraph-style SDL that assumes hosted-graph scalars typecheckable locally.

Runtime client pattern: import `initGraphQLTada` from `gql.tada` and `import type { introspection } from './graphql-env.d.ts'`, then `initGraphQLTada<{ introspection: introspection }>()`. Use `TadaDocumentNode` for typed documents and keep HTTP in a small wrapper (see `$/sources/TheGraph/Graphql/Ens/client.ts` and shared `$/sources/TheGraph/Graphql/client.ts`).

Colocated files: beside the manifest, keep `schema.graphql` (downloaded or regenerated), `graphql-env.d.ts` (generated; do not hand-edit except when fixing generator output intentionally), `client.ts`, and `queries.ts` as needed for that module.

Convenience scripts: add `sources:graphql:download:…`, `sources:graphql:generate:…`, and `sources:graphql:sync:…` entries in `package.json` that call `pnpm run sources:graphql -- <action> <SourceModule>` with a stable, grep-friendly script name.

Replication checklist:

1. Add `schema-source.ts` (with optional `patchFile`), `client.ts`, and `queries.ts` under `src/sources/<SourceModule>/`; run `generate` or `sync` once so `schema.graphql` and `graphql-env.d.ts` exist (or commit an initial `schema.graphql` and only run `generate` if the schema is maintained by hand).
2. Export `schemaSource` as above; run `pnpm run sources:graphql -- sync <SourceModule>`.
3. Point gql.tada / editor tooling at the generated `graphql-env.d.ts` for that folder; register the transport in `$/sources` / resolvers like any other source.


## Resolvers (`src/resolvers/**`)

Resolvers are the bridge between `sources/` and the TanStack DB collections.

- Module shape:
	- Use `defineEntityResolver` / `defineEntityFieldResolver` from `$/resolvers/$resolvers.ts`.
	- Each provider module exports only `default { source, entityResolvers, entityFieldResolvers }`; do not export individual resolvers for other modules to call.
	- Register new modules in `$/resolvers/index.ts`; each default export includes `source: Source`, and the registry filters modules by `enabledSources` from `$/sources/index.ts`.
- Source boundary:
	- Put all `fetch` / HTTP / provider transport logic under `src/sources/**`. Resolvers call source query functions; they do not fetch external URLs directly.
	- In resolvers, do not top-level import `$/sources//queries.ts` or `$/sources//constants.ts`; load them with inline `await import(...)` inside each `resolve(...)`.
	- Resolver-only type imports for wire payloads should prefer `$/sources/**/types.ts` (or generated OpenAPI components), not `queries.ts`.
	- `ResolverLoadSubset` (from `$/resolvers/$resolvers.ts`) includes `publicEnv`, the per-source slice from `resolverPublicEnvBySource` or full `resolverPublicEnv`. `$/collections/$collections.ts` passes it on every `resolve()` call; prefer `context.publicEnv` over `import.meta.env` so behavior matches source gating.
	- Thread `context` into source queries when the upstream API supports filtering, sorting, or limits (`filters` / `sorts` / `limit`).
- Resolver boundaries:
	- `resolve(...)` returns schema-shaped field data, not raw wire payloads.
	- Keep resolver modules shaped around resolver entries, not shared mapper layers. Put source-to-schema mapping inline in the relevant `resolve(...)` body unless a helper is clearly justified and explicitly approved.
	- Do not add trivial id/entity constructor helpers (e.g. `fooEntityRef`, `barFromWireId`) that only wrap `{ [EntityMetaKey.Id]: { … } }` or a one-line null check. Inline those at the call site in `resolve` / field resolvers. Shared `$/resolvers/_*.ts` modules are for non-trivial wire parsing, observation field mapping, or logic reused across multiple providers—not thin id wrappers.
	- Do not use `typeof` / `Array.isArray` / similar runtime shape checks on provider wire data when generated or hand-written **wire types** already define the field (gql.tada fragments, OpenAPI components, `types.ts` aliases). Prefer null/empty checks, optional chaining, and domain validators (`hexLowerOfByteSize`, ArkType at boundaries). Same bar as **Linting and quality → Runtime shape guards**; `typeof` remains for environment probes (`window`, `document`, `globalThis`) and genuinely untyped scalars (e.g. GraphQL `BigInt` as `unknown` until normalized with `BigInt(String(value))`, not `typeof value === 'string'`).
	- One resolver should make one primary upstream source request whenever feasible.
	- Do not create resolver waterfalls. If a second request enriches only a specific field, move that work to a field resolver or the owning `sources/**/queries.ts` function.
	- Do not call another resolver's `resolve(...)`. If two resolvers need the same provider data, both should call the appropriate source query, or the shared transport logic belongs in `src/sources/**`.
- Entity vs field resolvers:
	- Entity resolvers own full entity mapping.
	- Entity field resolvers that return many entities should normally return entity IDs / references, not fully mapped child entities.
	- Use field resolvers for truly field-scoped data only; avoid repeating identical endpoint calls across many fields for one entity.
	- Entity field collections apply the same optional `Source` filter as entity collections when the live query includes a `Source` `in` clause, so field resolvers for disabled or filtered-out sources are not invoked.
- Failure behavior (required — see JSDoc on `EntityResolver` / `EntityFieldResolver` in `$/resolvers/$resolvers.ts`):
	- **Throw** when the entity or field cannot be resolved under the given id / parent scope / source mapping. Do not return `{}`, `[]`, or `undefined` to mean failure, unsupported scope, missing API mapping, or swallowed fetch/parse errors.
	- Validate predicate-scoped support (chain, variant, id shape, realm/category, market kind, …) **before** upstream requests. Mirror the entity resolver’s throw on the same file/source when a field resolver hits the same unsupported predicate.
	- Error messages: `` `{Source}_{Transport}: <predicate>` `` (e.g. `` `Blockscout_Rest: no Blockscout v2 explorer for chain ${chainId}` ``, `` `Coingecko_OpenApi: OHLC is spot-only` ``). Reuse the message already thrown by a sibling resolver on that source when possible.
	- Do not `catch` and return empty data. Rethrow or wrap with `{ cause }` and a source-prefixed message.
	- Do not return partial placeholder entity rows (e.g. only `{ epoch }` when header fetch was skipped, or `{}` when REST base is missing).
	- **Allowed** (not “could not resolve”):
		- `[]` inside `flatMap` / filter to skip individual bad or duplicate wire rows after a successful list fetch.
		- `[]` when upstream successfully returns zero child rows for a supported parent (e.g. mainnet with no paired testnets).
		- `{}` on entity `resolve` after existence validation when the schema entity has no scalar fields beyond its id (catalog/local rows).
		- `undefined` on optional schema fields when this source’s **successful** scoped call confirms upstream has no value (ENS reverse miss, missing deployer on explorer row, optional metadata slice)—not when the chain/transport/field is unsupported for this source.
	- Multi-source optional fields: returning `undefined` because “not from this source” is OK only when views intentionally merge providers; if this source owns the field and would throw on entity resolve for the same predicate, field resolvers must throw too.
	- Removing/resolving: delete or never add stub resolvers; unimplemented field paths must throw (see existing `` `… is not implemented` `` / `` `… unsupported` `` patterns in `Constants.ts` and market providers)—never silently return empty.
- Live resolvers:
	- Optional `resolveLive` on an `EntityFieldResolver` (see `ResolveLiveContext` in `$/resolvers/$resolvers.ts`) handles push-driven refresh from WebSockets or streams.
	- Keep `resolve` as the snapshot implementation.
	- `resolveLive` typically calls `invalidateEntityFieldQueries` from `$/lib/db/resolveLive.svelte.ts` so the existing field-collection `queryFn` re-runs.
	- `mountEntityResolveLive` in `$/lib/db/resolveLive.svelte.ts` mounts entity and entity-field live resolvers from `$effect`; `startEntityFieldResolveLiveForParent` discovers field hooks for a parent id + field list.
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

`$/collections/$collections.ts` composes TanStack DB in this order: `createCollection(...)` → `persistedCollectionOptions(...)` → `queryCollectionOptions(...)`, with the local `persistOnDemandSubsets(...)` wrapper around the query collection options.

Built-in TanStack behavior:

- `queryCollectionOptions({ syncMode: 'on-demand' })` turns each live-query subset into a TanStack Query observer and gives the query function `meta.loadSubsetOptions`.
- `persistedCollectionOptions(...)` hydrates matching rows from OPFS before delegating to the upstream on-demand loader.
- TanStack owns query keys, stale/cache state, row persistence, row ownership metadata for non-empty query results, collection metadata persistence, and OPFS hydration.
- `persistedGcTime: Number.POSITIVE_INFINITY` and `staleTime: Number.POSITIVE_INFINITY` mean persisted rows and query results should not expire during normal app use. Keep both infinite unless a replacement refresh/expiry path is verified against warm reloads; a finite `staleTime` has previously caused immediate warm-reload refetches.

Local behavior in `persistOnDemandSubsets(...)`:

- TanStack’s persisted wrapper still calls the upstream on-demand loader after OPFS hydration. In this app, that would re-run resolvers and repeat catalog HTTP requests after reload unless we short-circuit it.
- The wrapper returns `true` before the upstream loader when the OPFS-hydrated in-memory collection already has rows matching the requested `eq` / `in` subset filters.
- For successful empty subsets, the wrapper stores a collection metadata marker keyed by the parsed filters/sorts/limit (`blockhead:loaded-subset:...`). This is required because row ownership cannot represent “this subset loaded and returned zero rows.”
- If neither hydrated rows nor the loaded-subset marker satisfy the request, the wrapper delegates to TanStack Query’s upstream `loadSubset(...)`; after it succeeds, the wrapper marks that subset as loaded.
- Keep the wrapper typed from package-provided TanStack types where possible, especially `SyncConfig`, `LoadSubsetOptions`, and `ReturnType<typeof parseLoadSubsetOptions>`. Avoid duplicating sync param/result shapes locally unless package types cannot express the boundary.
- Do not remove this wrapper or replace it with route/view-specific guards. The purpose is to preserve TanStack’s built-in on-demand hydration while preventing unnecessary resolver/network calls for already persisted subsets across all views.

Verification:

- Use `tests/e2e/tanstack-db-persistence.e2e.ts` for real-request OPFS persistence checks. It clears OPFS from a same-origin blank page, cold-loads discovered views, records real Chainlist / EthereumLists catalog requests, reloads with those catalog URLs blocked, and fails if warm reload tries to request them again.
- Real-network suites may need provider-specific noise filtering for unrelated upstream 400/404/422/fetch failures, but must not filter Chainlist / EthereumLists catalog requests during the warm reload assertion.
- Current focused status: `/network/1` and `/networks` pass the real TanStack DB persistence test together.


---

## Entity Views (`src/views/*.svelte`)

- Add `data-e2e` only where Playwright needs a stable selector (see Playwright E2E — `data-e2e`). Do not add decorative or non-test `data-*` tagging on `EntityView`, `EntitiesList`, or related entity chrome. Do not use `data-view`; when a non-test hook is needed, use a `class` referenced in that component’s local `<style>` (or an established global primitive from `src/styles/components.css`).
- Entity pages (`EntityView`, resource-backed views): Keep user-facing depth that still matters from older layouts (topology, execution RPCs/clients, explorers, related networks, forks, faucets, head block/epoch where applicable) while staying aligned with current schema field names (for example `$$blocks`, not stale or invented keys).
- Section chrome: Render a block only when it has meaningful payload; gate on the smallest truthful checks (`length`, `undefined`, domain-backed flags). Avoid technical placeholder copy whose only role is to fill space.
- `EntityView` + `<dl>` (required): At most one `<dl>` per card, and it must appear only in the `Content` snippet. Do not use `<dl>` inside `Details` or other detail-only sections; put extra metadata as additional rows in that same `Content` `<dl>` (with `{#if open}` when rows should only show when expanded). Each optional row is its own `{#if}…{/if}` (one row per guard). Do not use a single `{#if}` wrapping multiple rows. Do not use one `{#if}` with compound conditions like `open && x`; use nested `{#if}` blocks instead. A nested `<EntityView>` (e.g. inline entity link) is its own card and may have its own `Content` `<dl>` — the limit is per `EntityView` instance, not the whole page.
- `<dl>` vs heading: Do not add `<dl>` rows that repeat fields already shown in the `EntityView` heading (linked title, subtitle line, icon-backed identity, badges or labels rendered in the title row). Surface that information in the heading or in the `<dl>`, not both.
- `<dl>` vs parent id: On nested or scoped child cards, do not add `<dl>` rows for id fields that belong to the parent entity or that duplicate components already present on the child’s own id object (the parent route or enclosing context already establishes them). Omit those redundant id slices from the summary `<dl>`.
- `useEntity` selection: Prefer hierarchical resolver/source inheritance (a concise top-level `$` source list; nested field entries use `{}` where children inherit) instead of repeating the same `$` on every nested property when the model allows it. Prefer inlining short `$derived` values and colocating `{#if}` conditions beside the markup they guard over one shared visibility object unless branches genuinely share the same decision.
- Title / media: When the loaded entity exposes artwork (for example `$icon`), show it in the title row using the existing `Icon` snippet plus shared icon components (`IconComponent`, etc.), matching patterns from other entity views.
- `EntityView` / `EntityId` snippet contracts: For bundled context (`Content`, `Details`), use an optional first tuple parameter with optional object fields (for example `Snippet<[context?: { title?: string, href?: string }]>` and `Snippet<[context?: { open?: boolean }]>`). Call sites that ignore the bundle may use `{#snippet Content()}` / `{#snippet Details()}` instead of destructuring unused bindings.

### Entity identity row (`$/components/EntityId.svelte`, `$/components/EntityView.svelte`)

- **`EntityId`**: draggable icon + default `children` snippet (linked label text); `EntityView` inlines `Title` / `Value` / fallback at each call site.
- **Card summary**: `EntityView` wraps `EntityId` in `<header class="entity-view-summary">` + `<Heading>`; `HeadingAfter` and collapsed `Content` preview live on that header, not on `EntityId`.
- Layout: The summary link wraps the icon (`#snippet Icon`) and label (`EntityId`). Keep that pattern so the whole row is one draggable / navigable target.
- Readable ids, not JSON-shaped summaries: Do not render `stringify(entityId)` from `devalue` (or any similar serialized object blob) in `#snippet Value()` / `#snippet Title()` or other user-visible summary text. Use domain-appropriate copy: `<Address>`, `<TruncatedValue>`, chain id, short labels, etc. `stringify(entityId)` is still fine for non-display uses (e.g. element `id`, view-transition names, sort keys, `idDragPlainText`, route params).
- `#snippet Value` vs `#snippet Title`: **`Value`** is value-only identity (badge, hash, address, number) with no kind prefix (`Block`, `Epoch`, …). **`Title`** is the labeled card / prose display and should compose identity as kind word + `{@render Value()}` when a prefix applies. Do not duplicate the same fact in `#snippet Title` and in `<dl>` rows (see bullets above).
- Lists vs type noise: `$/components/EntitiesList.svelte` calls `setIsInsideEntityList(true)`. `EntityView` defaults `showTypeAnnotation` from that context so list rows do not show the entity-type collapsible annotation (homogeneous list; avoid repeating the type next to every row).
- Redundancy removal: Drop `<dl>` rows (and avoid extra summary lines) that only repeat the title row or parent-scoped ids—see `<dl>` vs heading and `<dl>` vs parent id above.

### Related entities: inline `Title` vs `CollapsibleTabs`

Be deliberate about how child entities appear in `Content` and `Details`. Default to the lightest layout that matches cardinality and depth.

Inline entity reference (`layout={EntityLayout.Value}` in a `<dl>` row when `<dt>` already names the kind; `EntityLayout.Title` when the inline row needs the full labeled title):

- One related entity (parent market, upstream coin, network, pool, block, wallet-on-network, from/to deployment, …).
- The child is primarily a link target—identity + navigation, not a nested card to expand on this page.
- Set `open={false}` and `showTypeAnnotation={false}` on nested views inside another entity’s `<dl>`.
- Prefer `Address`, `TruncatedValue`, or plain catalog strings only when there is no schema-backed entity row to link (or the field is not modeled as an entity ref).

Flat `<section>` in `Details` (no carousel):

- One or two substantive blocks that are not single-entity links: a field list (`*View` with `entityFieldReference`), a chart hub (`MarketOhlcHub`), route-local `children`, etc.
- Example: `MarketView` — spot (`MarketPricesView`) + OHLC (`MarketOhlcHub`) as sibling sections; base/quote legs stay inline in `Content`.

`CollapsibleTabs` + `entity-view-detail-carousels`:

- Three or more distinct sections, or two or more sections where each is a list / feed / chart column worth horizontal scroll markers (not a lone nested card).
- Hub pages that group registry slices: `NetworkView`, `CoinView`, `FarcasterView`, `ActorNetworkView` (balances + activity), etc.
- Each carousel section should earn its marker row; do not wrap a single child view or `{@render children()}` alone.

Avoid:

- `CollapsibleTabs` for one related entity (e.g. parent market on a timestamp row, host network on a wallet row)—use inline `Title` in `Content` instead.
- `EntityLayout.SummaryDetails` with `open={false}` nested cards in `<dl>` rows when `Title` suffices (bridge endpoints, pool refs, parent market links).
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
| `EvmLogView.svelte` | EvmLog by network + tx hash + log index; topics link to EvmTopicView, emitter EvmContractView (`EntityLayout.Title`); topic 0 in heading via nested EvmTopicView. |
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
