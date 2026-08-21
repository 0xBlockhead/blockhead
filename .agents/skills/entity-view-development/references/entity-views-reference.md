# Entity view contracts

## Links and identity

- A singular `*View` derives its canonical item link from `entityId` when possible. A plural `*sView` receives its own heading link from the route; child item views self-link.
- Identity fallback order is loaded heading, labeled title, then value-only identifier. Never display serialized entity objects.
- Use enum or catalog labels from canonical lookups rather than reformatting enum keys in the view.

## Content

- Keep details lists in `Content`, never `Details`. Use one per card; use two only to separate several live observation rows from several static identity rows.
- Guard optional rows independently. Put obvious prose—descriptions, biographies, posts, comments, excerpts—outside a details list.
- Do not repeat identity, media, or a relationship already rendered in the heading or `Content`.

## Related entities

Read [related-entity-layouts.md](related-entity-layouts.md) before changing relationship placement. Contextual relationships are inline links; intrinsic subjects may be embedded summaries. A nested view inside a labeled details row uses value-only identity unless its loaded title adds necessary meaning.

Keep `Title`, `Value`, `Heading`, `Content`, and `Details` snippet argument shapes identical across their type, definition, and render call. Follow the shared Svelte component rules for optional snippet bundles and multiline shape.
