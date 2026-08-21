---
name: resource-reactivity
description: Change or diagnose SvelteKit-shaped resource reactivity and OPFS persistence.
---

# Resource reactivity

Read `src/collections/AGENTS.md` and SvelteKit's installed query implementation before editing:

```text
node_modules/@sveltejs/kit/src/runtime/client/remote-functions/query/instance.svelte.js
```

Preserve one resource-owned state machine. Getter reads and `then`, `catch`, and `finally` must observe that same state. One durable source subscription updates rune state after the deferred `tick()` start.

Do not add observer fan-out, reference counting, a second promise-side state owner, parent-local refresh state, boundary remount keys, or direct TanStack snapshot handling in `ResourceBoundary`.

Views consume one logical resource through a localized boundary. The adapter owns TanStack notifications; views and routes do not subscribe to repair stale rendering.

Load `svelte-development` for implementation edits and `playwright-route-testing` for regression coverage. Completion requires visible DOM updates from a source notification through both a direct getter read and `ResourceBoundary`, without a route reload or fixture-side `tick()` that hides stale promise behavior.

Read [collections-reference.md](references/collections-reference.md) when persistence lifecycle, reload behavior, collection data flow, or detailed TanStack query semantics are in scope.
