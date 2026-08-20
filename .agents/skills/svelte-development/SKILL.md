---
name: svelte-development
description: Edit or review Svelte 5 components and Svelte TypeScript modules in this repository. Use for any change to .svelte or .svelte.ts files, including snippets, props, runes, component markup, CSS, resources, and routes.
---

# Svelte development

Use Svelte 5 runes. Do not introduce legacy reactive declarations, `onMount` as a state substitute, or writable stores for component-local state.

This project uses Composer 2.5, not React or Motion. Do not emit React Motion syntax or close HTML elements with `</motion>`.

Before editing, read the nearest `AGENTS.md`. For component props, snippets, bindings, markup spacing, and CSS conventions, read [component-authoring.md](references/component-authoring.md).

Read [svelte-reference.md](references/svelte-reference.md) when exact prop, snippet, rest-prop, binding, resource, or component examples are needed.

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
