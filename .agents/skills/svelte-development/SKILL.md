---
name: svelte-development
description: Edit or review Svelte 5 components and .svelte.ts modules.
---

# Svelte development

Use Svelte 5 runes. Do not introduce legacy reactive declarations, `onMount` as a state substitute, or writable stores for component-local state.

This project uses Composer 2.5, not React or Motion. Do not emit React Motion syntax or close HTML elements with `</motion>`.

For component props, snippets, bindings, markup spacing, and CSS conventions, read [component-authoring.md](references/component-authoring.md).

Keep state and derived logic close to use:

- Inline one-use derived expressions. Use `$derived` only when a value is read more than once.
- Use `{@const}` for one-use markup derivations when its parent permits it.
- Keep snippet argument shape and line wrapping identical across its type, definition, and render call.
- Put snippet props directly under the receiving component. Move conditions inside the snippet body.
- Do not guard loaded list-item snippets against missing items. Use the list component's placeholder snippet.

After every `.svelte` or `.svelte.ts` edit, run:

```sh
node scripts/svelte/autofix.mjs <path> --svelte-version 5
```

Repeat until it reports no issues. Review suggestions instead of applying them blindly. Then run the smallest applicable lint, type, unit, or browser check.

If syntax remains unclear and the Svelte MCP is available, use its section listing and documentation before editing.

When editing an uncommon HTML element, CSS feature, browser API, or `src/components`, consult current primary web-platform guidance first. In Codex environments, use the available `modern-web-guidance` skill for that lookup; do not load it for ordinary markup and CSS edits.

## Type-check isolation

Use the upstream `svelte-check` executable for Svelte diagnostics; do not replace or shadow its command name with a repository wrapper. Give experimental partitions and benchmarks distinct names and keep transient configuration outside the repository unless SvelteKit virtual-path resolution requires a temporary root config, which must be removed after the check.

For an isolated check, enumerate the exact `.svelte` targets independently of the compiler's loaded-file count. Dynamic-route brackets are glob syntax in `include`, so use literal `files` entries for bracketed route targets; keep ambient declarations and only the required generated `$types.d.ts` files in `include`. Do not place declaration files in `files` when the Svelte transform would treat them as components, and do not include the entire generated route-type tree for a single-route witness. A passing component-definition check is insufficient when the failure occurs at instantiation: retain one smallest real consumer that exercises the generic component boundary.
