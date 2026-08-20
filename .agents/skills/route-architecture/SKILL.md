---
name: route-architecture
description: Add, move, or review SvelteKit route families, route groups, list and detail paths, composite keys, nested facets, shared route chrome, and navigation links under src/routes.
---

# Route architecture

Read `src/routes/AGENTS.md` and inspect sibling route families before changing directory structure.

Model the URL first. Parenthesized directories supply layout grouping without adding a segment. A list uses a plural URL segment; its detail uses a singular item segment followed by a validated key. Keep shared entity chrome below the item key in an item-named route group.

Use [route-shapes.md](references/route-shapes.md) for nested children, scoped slices, composite keys, and facets. For a route family not covered there, read [routes-reference.md](references/routes-reference.md) before editing.

After editing a Svelte route, apply `svelte-development`. Add or update browser coverage through `playwright-route-testing` when behavior or navigation changes.
