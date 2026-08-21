---
name: entity-view-development
description: Revise entity identity, summaries, relationships, or layout in src/views.
---

# Entity view development

Inspect the affected schema cardinality and neighboring views that express the same relationship.

Keep identity and loaded presentation separate:

- `Value` renders the value-only identifier.
- `Title` renders labeled link text.
- `Heading` renders a loaded summary when resolved data improves on the raw identifier.
- User-visible identity must not use serialized entity objects.
- A summary details list must not repeat identity or media already present in the heading.

Choose the lightest related-entity layout that expresses the relationship. Read [related-entity-layouts.md](references/related-entity-layouts.md) when adding or moving related entities between `Content` and `Details`.

Load `svelte-development` for every Svelte edit. Read [entity-views-reference.md](references/entity-views-reference.md) when changing link ownership, details-list structure, or shared snippet contracts.
