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

## Packages

- Package Manager: `pnpm`

## Tasks

- Use `pnpm` to run tasks from `package.json`

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

### Playwright E2E — assertions

- `<details>` / collapsed UI: Copy inside a closed `<details>` (or similar) is often attached but not visible to Playwright. For “data loaded” checks on that content, prefer `expect(locator).toBeAttached()` (optionally with a long `timeout`) instead of relying only on `toBeVisible()`.
- Resolver / network latency: Pages backed by `resolveEntity` or external HTTP may need timeouts on the order of minutes (e.g. `120_000` ms) for the “settled” assertion, while still asserting a cheap invariant first (nav link, layout chrome).
- Success vs failure: When the UI shows either a happy path or an explicit error string, use `.or()` on locators and assert one branch is attached once the async work finishes.

## TypeScript

- Prefer single expressions and inline logic
- Declare intermediate variables and functions ONLY if referenced more than once, otherwise inline
- Declare functions with `const` UNLESS overloading signatures
- Bare minimum type annotations
- Prefer `as const satisfies` for constants, NEVER `: Type`
- NO hardening, type assertions, `as`, `as unknown as` unless parsing unknown input
- Generic type params: `_Type extends Type`
- Object with > 1 prop, array with > 1 value: indent, one per line, trailing commas
- Generic with > 1 type param: indent, one per line
- Multiline expressions: indent, wrap in `()` UNLESS already exclusively wrapped in `[]` / `{}`
- Multiline ternary expressions:
	```ts
	const exp = (
		condition ?
			a
		:
			b
	)
	```
- Multiline binary expressions: operator begins line after line break
- Import paths:
	- `$/` for `src/`
	- full extensions `.ts`, `.svelte`, `.svelte.ts`
- NO reexports or barrel files (`export ... from ...`).
	- When moving files, rewrite import paths codebase-wide on the spot using find and replace tools.

## Constants (`src/constants/**`)

- Two blank lines between `// Types` → `// Constants` → `// Lookups` (same rhythm as script sections).
- Types — imports to type the catalog. Constants — optional string enum / ids; one `as const` list, `as const satisfies …` (TypeScript above). Lookups — `Object.fromEntries` maps; keys stay aligned with the list.
- File `Domain.ts`; export plural list + `thingById`-style maps. Example: `$/constants/Coin.ts`.

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
			— App data / TanStack cache from `$/data/**`; colocate UI-only `*.svelte.ts` next to routes or contexts
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
					- Object arg: `Snippet<[{ … }]>` with ≥1 property; bundled state. Positional: `Snippet<[ a: A, b: B, … ]>`; separate values. `{@render}` arity, order, and object-vs-positional must match the type.
					- Line breaks: for a given snippet, type and `{@render}` use the same shape — both multiline or both single-line. Multiline means one tuple member or object property per line, trailing commas, and a dedicated closing line for `]>` / `)}` / `)`. Same for `{#snippet …}` params. Multiline when there are 2+ tuple members, 2+ object fields, or 2+ render arguments.
					```ts
					let {
						...
					}: {
						Summary: Snippet<[{
							open: boolean,
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
	- `{#snippet Name()}` if the body needs no injected values; else `Name({ open })` or `Name(a, b)` to mirror `{@render}` (same multiline rule). Call sites often use `Summary()` while `EntityView` forwards `{ open }` into `Collapsible`.
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

### HTML / CSS:
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

- Display truncation: use `<TruncatedValue>` / `<Address>` (manual truncation is only OK for non-display logic)

## SvelteKit (`src/routes/**`)

URLs and nav: `src/routes/navigationItems.svelte.ts`. `(…)` = layout groups only (not URL). Add `+layout` only for shared chrome or multiple children; drop empty groups. Never colocate `+layout` + `+page` except under `routes/`. Shallow `routes/<segment>/+page.svelte` OK for hubs; same rules with a prefix: `routes/<urlPrefix>/(area)/…`.

Lists / detail — List: `(area)/<domainList>/+page`. Bad list: `(area)/(<domainList>)/<domainList>/+page` (duplicated list token). Hub: `(<hub>)/<hub>/…` = same string for group folder + next segment (not the list bad pattern). `<domainList>` ↔ `<domainItem>` plural/singular; `[<domainItemKey>]` id segment (`coinId`, …). `staticBeforeKey/` = literals before `[domainItemKey]`. `(<domainListGroup>)` ≈ `domainList`. Detail: `<domainItem>/[domainItemKey]/+page` beside `<domainItem>/[domainItemKey]/(<domainItem>)/+layout` (path + chrome share `domainItem`).

Deep — Parent: `<parentItem>/[parentKey]/(<parentItem>)/`. Facet list: `/(<parentItem>)/<childList>/+page`. `(<scopedSlice>)` + `childItem`/`[childKey]` / `(<childItem>)` like domain level; grandchild routes nest under child. Composite: `<compositeItem>/[compositeKeyFirst]/…`. Slice: same `<sliceNoun>` for list + `[sliceKey]` under `(<sliceGroup>)`. Facets: `<facetStatic>`, `(<facetBranch>)` + inner list/item/key placeholders. Double `( )/` only if both wrappers need several routes.

Views / params — No hardcoded domain links on shared views; use `headingHref` / `headingLabel`. Params only (no placeholder IDs); parse to the right entity ID type; no cross-domain param coercion.

Templates — `routes/.../` = any `src/routes/` prefix (incl. `<urlPrefix>`). Repeated placeholder = same folder name. `domainList`/`domainItem`/`[domainItemKey]` as above.
```txt
# List (section)
routes/(area)/+layout.svelte
routes/(area)/<domainList>/+page.svelte

# Provider hub — <hub> repeated: group folder + next URL segment (not the list mistake)
routes/(area)/(<hub>)/<hub>/+layout.svelte
routes/(area)/(<hub>)/<hub>/<domainList>/+page.svelte
routes/<urlPrefix>/(area)/(<hub>)/<hub>/<domainList>/+page.svelte

# Domain family + detail — <domainListGroup> usually same string as <domainList>; <domainItem> repeated for path + (chrome)
routes/(area)/(<domainListGroup>)/+layout.svelte
routes/(area)/(<domainListGroup>)/<domainItem>/[<domainItemKey>]/+page.svelte
routes/(area)/(<domainListGroup>)/<domainItem>/[<domainItemKey>]/(<domainItem>)/+layout.svelte
routes/(area)/(<domainListGroup>)/<staticBeforeKey>/[<domainItemKey>]/+page.svelte
routes/(area)/(<domainListGroup>)/<staticBeforeKey>/[<domainItemKey>]/(<domainItem>)/+layout.svelte

# Detail with only (area) — no (<domainListGroup>)
routes/(area)/<domainItem>/[<domainItemKey>]/+page.svelte

# Under (<domainItem>) chrome — inner list / inner detail for that entity
routes/.../(<domainItem>)/<innerList>/+page.svelte
routes/.../(<domainItem>)/<innerItem>/[<innerKey>]/+page.svelte

# Parent entity — <parentItem> matches (<parentItem>); children use child* / grandchild* tokens
routes/.../<parentItem>/[<parentKey>]/(<parentItem>)/+layout.svelte
routes/.../(<parentItem>)/<childList>/+page.svelte
routes/.../(<parentItem>)/(<scopedSlice>)/+layout.svelte
routes/.../(<parentItem>)/(<scopedSlice>)/<childList>/+page.svelte
routes/.../(<parentItem>)/(<scopedSlice>)/<childItem>/[<childKey>]/+page.svelte
routes/.../(<parentItem>)/(<scopedSlice>)/<childItem>/[<childKey>]/(<childItem>)/+layout.svelte
routes/.../(<childItem>)/<grandchildList>/+page.svelte
routes/.../(<childItem>)/<grandchildItem>/[<grandchildKey>]/+page.svelte

# Scoped slice — <sliceNoun> shared by list + param detail under (<sliceGroup>)
routes/.../(<sliceGroup>)/<sliceNoun>/+page.svelte
routes/.../(<sliceGroup>)/<sliceNoun>/[<sliceKey>]/+page.svelte

# Composite key — <compositeItem> + numbered compositeKey* parts (add more as needed)
routes/.../<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/[<compositeKeyThird>]/+page.svelte
routes/.../<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/[<compositeKeyThird>]/[<compositeKeyFourth>]/+page.svelte

# Composite under (<domainListGroup>) — keys belong to <compositeItem>
routes/.../(<domainListGroup>)/<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/+page.svelte
routes/.../(<domainListGroup>)/<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/[<compositeKeyThird>]/[<compositeKeyFourth>]/+page.svelte

# Facets — host uses <domainItem> / [<domainItemKey>] / (<domainItem>); branch uses facet* tokens
routes/.../<domainItem>/[<domainItemKey>]/(<domainItem>)/+layout.svelte
routes/.../(<domainItem>)/<facetStatic>/+page.svelte
routes/.../(<domainItem>)/(<facetBranch>)/+layout.svelte
routes/.../(<facetBranch>)/<facetInnerList>/+page.svelte
routes/.../(<facetBranch>)/<facetInnerItem>/[<facetInnerKey>]/+page.svelte
```

Anti-examples

- Bad: `(area)/(<domainList>)/<domainList>/+page` (list doubled with parens). Good: `(area)/<domainList>/+page`; detail under `(<domainListGroup>)/<domainItem>/[…]` with `domainListGroup` ≈ `domainList`.

- Bad: banning `(<hub>)/<hub>/` as if it were the list error. Good: hub repeat OK; wrong is only `(<domainList>)/<domainList>/+page`.

- Bad: detail `+layout` on `<domainList>/[key]/` (inverted). Good: `(<domainListGroup>)/` then `<domainItem>/[domainItemKey]/+page` and optional `(<domainItem>)/+layout`.

- Bad: hardcoded heading URL in a shared view. Good: `headingHref` / `headingLabel` from route.

- Bad: placeholder IDs in detail pages. Good: real `params`, validated to entity ID type.

- Bad: deep `(group)/` with one file, no shared chrome. Good: merge or give the layout several children / shared UI.

Checks — New routes must not match any Bad row above.




## Import topology (`src/**`)

**Default direction (outer → inner):** `routes` · `views` · `components` → `data/` → `resolvers/` → `sources/**/queries.ts` → `schema/` · `constants/` · `lib/` · `typescript/` · npm. **`lib/`** may use `schema/` / `constants/` for types and shared helpers; keep it free of `routes/`, `views/`, `data/`, `resolvers/`, and `sources/**/client.ts` so lower layers stay reusable.

**Intentional cross-links (not strict tiers):**

- **`data/collections/`** calls **`resolveEntity` / `resolveRegisteredEntityField`** via **`$/resolvers/$resolveEntity.ts`** (and field types from **`$/resolvers/$EntityFieldResolver.ts`**). Collections sit “above” the resolver registry for cache population, not below it.
- **`data/tanstackDb/`** is shared by **`resolvers/`** (subset + list slicing) and **`data/collections/`** + UI (load-subset → keys, live-query `where`). It does **not** import **`resolvers/`** or **`data/collections/`**.

**`$/` → `src/`**; full extensions on imports (TypeScript section).

### Layers

| Layer | Folder(s) | OK to import | Do not import |
|-------|-----------|--------------|---------------|
| Foundation | `constants/`, `schema/`, `typescript/`, `styles/`, `assets/` | Same layer, `lib/` | `routes/`, `views/`, `resolvers/`, **`data/`** — *except one case, see below* |
| Transport | `sources/` | `lib/`, `constants/`, `schema/` (types) | `data/`, `resolvers/`, `views/`, `routes/`, `components/` — no `fetch` to sources from `.svelte` |
| Domain | `resolvers/` | `sources/**/queries.ts`, `schema/`, `lib/`, **`data/tanstackDb/*`** | **`data/collections/`** (pulls `resolveEntity` — cycle risk), `routes/`, `views/` |
| UI | `views/`, `components/` | `data/`, `schema/`, `constants/`, `lib/`, `context/` | **`sources/**/client.ts`** — use resolvers / collections |
| Routes | `routes/` | `views/`, `components/`, `data/`, `context/`, `schema/`, `constants/`, `lib/` | Deep `sources/` except deliberate `+page.server` / `+layout.server` / server-only loads |
| Glue | `context/`, `params/`, `hooks.client.ts`, `hooks.server.ts` | `data/`, `lib/`, `schema/`, `constants/` as needed | Ad-hoc `sources/**/client.ts` |

### `data/` (split)

| Subfolder | Role | OK to import | Do not import |
|-----------|------|--------------|---------------|
| **`data/tanstackQuery/`** | `QueryClient` singleton; OPFS SQLite persistence init | npm, `$app/*` where required | `resolvers/`, `schema/` (not needed today) |
| **`data/tanstackDb/`** | Load-subset parsing, entity keys, resolver list context, live-query `where` helpers | `schema/`, **`sources/$Sources.ts`** (`Source` / wire enums), **sibling `data/tanstackDb/*.ts`** | `resolvers/`, **`data/collections/`** |
| **`data/collections/`** | `persistedQueryCollection`, `entityCollections`, `entityFieldCollections`, `resolveEntityField` | **`resolvers/$resolveEntity.ts`**, **`resolvers/$EntityFieldResolver.ts`** (types), `schema/`, **`sources/$Sources.ts`**, **`data/tanstackQuery/`**, **`data/tanstackDb/`**, **`data/collections/`** (internal) | `views/`, `routes/` |

### `data/tanstackDb` files

| File | Consumers | Purpose |
|------|-----------|---------|
| `resolverLoadSubset.ts` | `resolvers/`, `entitySubsetFromLoadSubset.ts`, `routes/`, `views/` | `fieldPathKey`, `subsetParsed`, `loadSubsetFilters`, `ResolverLoadSubset`, `resolverContextFromLoadSubset`, filter helpers, `sliceRowsForResolverSubset` |
| `entitySubsetFromLoadSubset.ts` | `resolvers/$resolveEntity.ts`, `data/collections/` | `entitySubsetFromLoadSubsetOptions`, `scopedEntityIdFromLoadSubsetOptions`, `entityFieldNamesFromLoadSubset`, `isGlobalScopeKey`, `emptyGlobalScopeKey` |
| `entityCollectionRowWhere.ts` | `views/`, `routes/` | `entityCollectionRowIdEqualsEntityIdByFields` for `useLiveQuery` / `where` |

### Schema → `data/` exception

**`schema/BlockheadEntityCollection.ts`** imports **`CollectionScope`** from **`data/collections/entityCollections.ts`**. That is the only current **`schema/` → `data/`** edge. Prefer defining **`CollectionScope`** under **`schema/`** (or **`constants/`**) if you want a strict foundation boundary.

If a **lower** layer imports a **higher** one (e.g. `sources/**/queries.ts` → `views/`), move the shared piece to **`lib/`**, **`schema/`**, or **`data/tanstackDb/`**.


## Sources (`src/sources/**`)

Shared `client.ts`: `fetch`, `getJson` / `getText`, optional text helpers. No `res.ok` / `try/catch` — failures propagate.

`Provider/<Transport>/`: `api-type.ts`, `constants.ts`, `queries.ts`, optional `types.ts`. `queries.ts`: `get…Url` + `get*` (calls `client`); re-export helpers resolvers need so one import path. Resolvers never import `client.ts` for provider I/O.

```
src/sources/
├── $Sources.ts
├── <SharedTransport>/…/client.ts, queries.ts, types.ts
└── <Provider>/
    ├── api-type.ts
    └── <Transport>/constants.ts, types.ts?, queries.ts
```

| Task | Where |
|------|--------|
| New provider | `src/sources/<Provider>/<Transport>/` + optional `$/resolvers/<Provider>-Rest.ts` |
| Env | `$env/*` / `import.meta.env` in resolver or server load |

No barrels. No `fetch` in `.svelte` for resolver work.

## Resolvers (`src/resolvers/**`)

`(EntityType, field)` → async value.

| Module | Role |
|--------|------|
| `$/resolvers/$EntityFieldResolver.ts` | `EntityFieldResolver`; `EntityFieldResolverContext` |
| `$/resolvers/$EntityResolver.ts` | `entityId` → partial row; no resolver-side waterfall |
| `$/resolvers/$resolveEntity.ts` | Registry; `resolveEntity`, `resolveRegisteredEntityField` |
| `$/data/tanstackDb/*` | Load-subset / resolver context / live-query `where` — see **Import topology** |

Registry: flatten provider defaults; `entityResolvers` + `entityFieldResolvers` in `$/resolvers/$resolvers.ts`. `resolveEntity` alone merges entity partials (`Object.assign`), then runs `entityFieldResolvers` only for keys still missing — resolvers do not chain loads themselves. Raw `loadSubsetOptions` only at `resolveEntity` edge.

Modules: `export default { source, entityFieldResolvers, entityResolvers? }`; field entries `satisfies EntityFieldResolver<…>` when useful.

Split: sources = transport + wire types; resolvers = `get*` from `$/sources/.../queries.ts` (+ optional wire `import type`), map to schema.

`resolve`: logic in `resolve` or one fat helper; `await singleFlight(getQuery)(args)` per `get*` (stable import from `queries.ts`), not `singleFlight(async () => …)` at module scope.

| Task | Where |
|------|--------|
| Register | `$/resolvers/$resolveEntity.ts` |
| HTTP | `get*` in `queries.ts` |
| Dedupe | `singleFlight(getQuery)(args)` |
| List filters | `context?.loadSubset` + `$/data/tanstackDb/resolverLoadSubset.ts` |

No barrels. No resolver `client.ts` for provider I/O.

## Data

- `useLiveQuery` only in `.svelte` (pages, layouts, `$/views/**`).
- Layout of `data/tanstackQuery/`, `data/tanstackDb/`, `data/collections/` and module roles: **Import topology** → `data/` (split) + `data/tanstackDb` files.


## User Preferences (Canonical)

- Reply in a concise style; avoid repetition or filler
- Be DRY and declarative
- Inline derived intermediate variables, especially if used once

### General

- End files with a single line break
- Avoid trailing spaces

### TypeScript / JavaScript

- Use tabs
- Prefer `'` over `"`
- No `;` after statements (only leading `;` when needed before `(` / `[` / template literals)
- No `;` or `,` after `type` / `interface` properties
- Max 3 consecutive line breaks
- Prefer `??` over `||`
- Prefer `.` over `?.`, and `?.` over `object && object.value`
- Prefer `T[]` over `Array<T>`
- Prefer `[...array1, ...array2]` over `array1.concat(array2)`
- Prefer `const fn = () => ()` over `function fn() {}`
- Prefer expression returns: `=> ( expression )` over block `return`
- Prefer ternary expression form over statement `if`/`else` for inline transforms
- Prefer declarative expressions over mutating objects/arrays/maps, including `.reduce()` patterns
- Do not use `as any` as a lint/type fix
- Do not try to fix `Type instantiation is excessively deep and possibly infinite`

#### Ternary formatting

- Format multiline ternaries like `if` / `else if` / `else`
- Place `?` at line end and `:` on its own branch line
- Use:
	```ts
	const x = (
		condition1 ?
			value1
		: condition2 ?
			value2
		:
			value3
	)
	```

#### Multiline expression formatting

- For multiline arrays/objects/params/args/chains/unions/intersections:
	- One item/member per line
	- Trailing comma after last item/property/argument/parameter
	- Leading `&` / `|` before first intersection/union member
- Break chained calls onto new indented lines
- Wrap with outer `(` / `)` when not already an array/object/plain call/spread
- Multiline binary expressions: operator starts next line

#### Imports and generics

- Sort imports by path, with type imports before value imports
- Use full path extensions (`.ts`, `.svelte`, `.svelte.ts`) and `$/` alias for `src/`
- No re-exports or barrel files
- For types used only in generic `extends`, alias import with underscore and use `<Type extends _Type>`

### Svelte

- Keep `$state()` / `$derived()` values indented on their own line
- Preserve existing double line breaks before comments in `<script>`
- Section and ordering in `<script>`:
	- Types/constants
	- Props
	- Functions
	- State
	- Actions
	- Components
	- Styles
	- Transitions/animations
- Within a section, sort imports by path with type imports first
- File section order: `<script>`, `<svelte:head>`, markup, `<style>` with two empty lines between sections
- Prefer `let { ... }: { ... } = $props()` over `$props<{ ... }>()`
- Include a trailing comma after each destructured prop (except `...rest`)
- Prefer inlining one-off derived logic into markup with `{@const}`
- `{@const}` must be immediate child of:
	- `{#snippet}`, `{#if}`, `{:else if}`, `{:else}`, `{#each}`, `{:then}`, `{:catch}`, `<svelte:fragment>`, `<svelte:boundary>`, or `<Component>`

### CSS

- Use semicolons in declarations
- Prefer semantic HTML styling over one-off classes

### Scripts / CLI

- Prefer `mv` + edit over recreate + delete
- Avoid index files that only re-export