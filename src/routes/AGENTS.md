# Routes

- Route groups in parentheses organize layouts and do not add URL segments.
- Add a `+layout` only for shared chrome or several child routes. Do not add empty grouping layers.
- Keep list and detail nouns consistent and avoid repeating a list segment through both a group and URL directory.
- Read real route parameters and validate them into entity selectors. Never use placeholder IDs in a detail page.
- Shared views receive route-specific heading labels and links through props. Do not hardcode route URLs into them.
- Do not use TypeScript assertions in route or view Svelte files.
- Co-locate route-specific E2E tests beside the route and do not prefix E2E filenames with `+`.
- Load `svelte-development` for Svelte edits, `route-architecture` for route additions or moves, and `playwright-route-testing` for browser verification.
- Read `route-architecture` and its `route-shapes.md` reference before adding or moving a deep route family.
