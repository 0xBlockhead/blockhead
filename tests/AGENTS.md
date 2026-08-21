# Tests

- Load `test-methodology` before writing, reviewing, or consolidating automated coverage.
- Vitest covers `*.test.*` and `*.spec.*`; Playwright covers `*.e2e.*`.
- Keep distinct scenario tests separate from the route matrix. The route matrix owns shell, canonical URL, settlement, runtime diagnostics, and boundary failures across discovered routes.
- Prefer roles, labels, stable IDs, existing classes, and route-specific markers before adding `data-e2e`.
- For content under closed `<details>`, assert attachment when visibility is not part of the behavior.
- Resolver-backed pages may require long settlement timeouts. Assert a cheap shell invariant first.
- When either loaded content or an explicit error is valid, assert the permitted branches with locator `.or()`.
- Load the `playwright-route-testing` skill before adding, editing, or diagnosing E2E coverage.
