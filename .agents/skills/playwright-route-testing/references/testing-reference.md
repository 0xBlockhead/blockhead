# Playwright test conventions

- Co-locate a distinct route scenario beside its `+page.svelte` or `+layout.svelte`; never prefix an E2E filename with `+`.
- Invoke co-located tests by a stable filename fragment so route-group parentheses need no shell quoting.
- Prefer role, label, text, stable ID, existing class, or scroll-marker label. Add `data-e2e` only for a test-only node with no stable semantic selector.
- Content inside closed `<details>` may be attached but invisible; assert attachment when the contract is loading rather than disclosure state.
- Assert cheap shell or layout evidence before a slow resolver result. Use a minutes-scale timeout only for real upstream latency.
- When either data or an explicit error is valid, combine the locators with `.or()` and require one settled branch.

Vitest has client-browser and server-node projects; follow the nearest existing test's project and naming rather than restating configuration globs.
