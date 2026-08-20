# Collections and resources

- `src/collections/$collections.ts` owns collection construction. Shared live-query helpers belong in `src/collections/$queries.svelte.ts`.
- Keep collection persistence and source notification behavior out of views.
- `TanStackLiveQueryResource` must expose one resource-owned state machine to both getters and promise methods.
- Preserve the deferred `tick()` start and one durable source subscription.
- Do not add a second promise-side state owner, observer fan-out, reference counting, or snapshot application path.
- `ResourceBoundary` consumes only SvelteKit-shaped resource getters and promise methods. It must not inspect TanStack snapshots or install its own subscriptions.
- A resource change requires visible DOM regression coverage for direct getter reads and `ResourceBoundary` without a route reload.
- Read `node_modules/@sveltejs/kit/src/runtime/client/remote-functions/query/instance.svelte.js` before changing the adapter or boundary.
- Load the `resource-reactivity` skill for resource adapter, boundary, or reactivity fixture changes.
- Read the detailed collections reference in `resource-reactivity` for OPFS persistence work.
