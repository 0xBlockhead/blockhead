---
name: playwright-route-testing
description: Add, update, run, or diagnose Playwright E2E coverage in this repository. Use for route tests, route-matrix probes, boundary failures, CORS checks, persistence tests, browser console errors, or visible resource reactivity.
---

# Playwright route testing

Read `tests/AGENTS.md` and the nearest route instructions before editing tests.

Choose the existing owner for the behavior:

- Use the route matrix for shell presence, canonical URLs, settlement, runtime diagnostics, and boundary failures across discovered routes.
- Keep CORS policy in `tests/e2e/cors-policy.e2e.ts`.
- Keep persistence and TanStack navigation stress in their existing scenario suites.
- Co-locate a distinct route scenario beside that route's `+page.svelte` or `+layout.svelte`.

For matrix modes and probes, read [route-matrix.md](references/route-matrix.md). For browser CORS failures or provider HTTP changes, read [cors-policy.md](references/cors-policy.md).

Read [testing-reference.md](references/testing-reference.md) when exact placement, selector, assertion, or invocation conventions are needed.

Prefer a stable filename fragment when invoking a co-located test so the shell does not need quoted route-group paths.

When the bundled browser runner fails because of missing Playwright or a macOS sandbox error, use `/opt/homebrew/bin/playwright-cli`. Do not reinstall project dependencies unless this repository's declared Playwright dependency is actually broken.

Verify the visible behavior, collect console and page errors, and resolve unexpected errors before finishing.
