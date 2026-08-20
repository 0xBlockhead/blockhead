# Related-entity layouts

Use an inline entity reference in a details-list row for one contextual relationship whose main purpose is navigation. Use `EntityLayout.Value` when the row label already names the entity kind. Use `EntityLayout.Title` when the loaded label adds necessary meaning.

Use an embedded `EntityLayout.SummaryDetails` child for an intrinsic entity that defines the parent's subject, such as a contract, pool leg, or registry. Open the main intrinsic child by default; collapse several sibling intrinsic children when that makes the parent easier to scan.

Use flat titled sections for one or two substantial non-link blocks. Use `CollapsibleTabs` and detail carousels for at least three distinct sections, or for several list, feed, or chart columns that justify scroll markers.

Avoid:

- tabs that hide one link line,
- nested summary cards inside a details-list row,
- repeating a `Content` relationship in `Details`,
- raw IDs when a schema-backed entity view exists,
- repeating header artwork in the details list.

If collapsing the section hides only one relationship, keep it inline. If it groups several lists or tools, use a section or tabs.
