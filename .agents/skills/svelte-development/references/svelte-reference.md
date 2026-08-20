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
	- Run `svelte-autofixer` for any Svelte edits (`.svelte` / `.svelte.ts`) and repeat until no issues remain. Review suggestions; apply them when they identify real simplification or correctness problems. If the Svelte MCP tool is not exposed in the current session, use the local fallback: `node scripts/svelte/autofix.mjs <path> --svelte-version 5`. The fallback invokes the official `@sveltejs/mcp` autofixer handler without the CLI's import-time documentation fetch and exits non-zero only for issues, because the official handler can emit intentionally ignorable suggestions such as audited `$effect` function calls.

### Svelte components

- Display truncation: use `<TruncatedValue>` / `<Address>` (manual truncation is only OK for non-display logic). Entity card headings and secondary ids follow Entity Views → Entity summary row (no JSON-shaped summary ids).

---


### SvelteKit-shaped resources

- SvelteKit remote `query()` is the reference implementation for low-level resource reactivity. Before changing `TanStackLiveQueryResource`, `ResourceBoundary`, or route resource fixtures, read `node_modules/@sveltejs/kit/src/runtime/client/remote-functions/query/instance.svelte.js` and preserve its two-surface contract: getters (`current`, `loading`, `ready`, `error`) and promise methods (`then`, `catch`, `finally`) must both observe the same resource-owned state machine.
- `TanStackLiveQueryResource` must retain SvelteKit's installed `query()` / `query.live()` state shape and deferred `tick()` start: one durable source subscription feeds the resource's rune state, and promise methods only await/read that same state. Do not add `createSubscriber`, reference-counted resource observers, subscriber fan-out sets, promise-side snapshot application, or a second getter/promise state owner.
- `ResourceBoundary` is a pure consumer of SvelteKit-shaped resources. It must not accept TanStack live-query snapshots directly, inspect TanStack state, branch on `Symbol.toStringTag`, call `subscribeChanges`, install resource `.subscribe` listeners, key/remount children to force updates, or choose between TanStack and SvelteKit modes.
- Views should not manually inspect resource `.current`, `.ready`, `.loading`, or `.error` for rendering. Prefer localized `ResourceBoundary` at the exact consumption site; each boundary should consume and render one logical thing, with resource state handled by the boundary and schema/domain display decisions handled by the view.
- The TanStack/source notification hook belongs in the TanStack-to-SvelteKit resource adapter, not in views, routes, or `ResourceBoundary`. App-level `subscribe(...)` may manage product resource lifecycle, but the boundary contract remains only `current` / `loading` / `ready` / `error` / `then` / `catch` / `finally`.
- Resource tests must prove direct getter reads and promise reads. Do not hide stale adapter reactivity with parent-local state updates, fixture-side `await tick()` before reading `.then`, boundary remount keys, debug-only direct displays, or softened assertions that no real view depends on.
- A resource/boundary fix is not complete until Playwright proves visible DOM updates from a TanStack/source notification through both a direct resource getter read and `ResourceBoundary`, without route reload.
