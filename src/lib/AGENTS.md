# Library helpers

- Add code here only when it is cross-domain, reusable, and simpler than keeping the logic at its call sites.
- Keep provider-specific logic in `src/sources`.
- Do not add helpers that only wrap resolver mapping, optional omission, catalog joins, deduplication, or one-off enrichment.
- Do not add provider fetches, resolver-shaped pipelines, or module caches here.
- Prefer fixing canonical catalog construction or source transport ownership over hiding the problem in a helper.
