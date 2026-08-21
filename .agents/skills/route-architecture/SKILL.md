---
name: route-architecture
description: Design or review SvelteKit route families, keys, nesting, facets, and shared chrome.
---

# Route architecture

Inspect sibling route families before changing directory structure.

Model the URL first. Parenthesized directories supply layout grouping without adding a segment. A list uses a plural URL segment; its detail uses a singular item segment followed by a validated key. Keep shared entity chrome below the item key in an item-named route group.

Read [route-shapes.md](references/route-shapes.md) for canonical list, detail, hub, nested-child, scoped-slice, composite-key, and facet shapes.

After editing a Svelte route, apply `svelte-development`. Add or update browser coverage through `playwright-route-testing` when behavior or navigation changes.
