# Route shapes

## Lists and details

- A section list is `routes/(area)/<plural>/+page.svelte`.
- A detail is `routes/(area)/(<plural-group>)/<singular>/[<key>]/+page.svelte`.
- Shared detail chrome belongs at `.../[<key>]/(<singular>)/+layout.svelte`.
- A provider hub may repeat its name as a group and URL segment because only the URL directory contributes a segment.
- Do not repeat a list name as both a group and its immediate list URL directory.

Canonical shapes:

```text
routes/(area)/+layout.svelte
routes/(area)/<domainList>/+page.svelte

routes/(area)/(<domainListGroup>)/+layout.svelte
routes/(area)/(<domainListGroup>)/<domainItem>/[<domainItemKey>]/+page.svelte
routes/(area)/(<domainListGroup>)/<domainItem>/[<domainItemKey>]/(<domainItem>)/+layout.svelte
routes/(area)/(<domainListGroup>)/<staticBeforeKey>/[<domainItemKey>]/+page.svelte
routes/(area)/(<domainListGroup>)/<staticBeforeKey>/[<domainItemKey>]/(<domainItem>)/+layout.svelte
```

A detail may sit directly under `(area)` when there is no useful plural family group:

```text
routes/(area)/<domainItem>/[<domainItemKey>]/+page.svelte
```

A provider hub may repeat its name because the group does not contribute to the URL:

```text
routes/(area)/(<hub>)/<hub>/+layout.svelte
routes/(area)/(<hub>)/<hub>/<domainList>/+page.svelte
routes/<urlPrefix>/(area)/(<hub>)/<hub>/<domainList>/+page.svelte
```

## Nested entities

Under parent item chrome, put child lists and child details in the parent group. A child with its own descendants receives its own item-named chrome group. Remove groups that own only one file and provide no shared chrome.

```text
routes/.../<parentItem>/[<parentKey>]/(<parentItem>)/+layout.svelte
routes/.../(<parentItem>)/<childList>/+page.svelte
routes/.../(<parentItem>)/(<scopedSlice>)/+layout.svelte
routes/.../(<parentItem>)/(<scopedSlice>)/<childList>/+page.svelte
routes/.../(<parentItem>)/(<scopedSlice>)/<childItem>/[<childKey>]/+page.svelte
routes/.../(<parentItem>)/(<scopedSlice>)/<childItem>/[<childKey>]/(<childItem>)/+layout.svelte
routes/.../(<childItem>)/<grandchildList>/+page.svelte
routes/.../(<childItem>)/<grandchildItem>/[<grandchildKey>]/+page.svelte
```

## Composite keys and slices

- Put each component of a composite selector in its own ordered parameter directory.
- Keep parameter names tied to the entity selector, not generic `id` names.
- A scoped slice uses the same slice noun for its list and keyed detail beneath a grouping directory.

```text
routes/.../(<sliceGroup>)/<sliceNoun>/+page.svelte
routes/.../(<sliceGroup>)/<sliceNoun>/[<sliceKey>]/+page.svelte

routes/.../<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/[<compositeKeyThird>]/+page.svelte
routes/.../<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/[<compositeKeyThird>]/[<compositeKeyFourth>]/+page.svelte

routes/.../(<domainListGroup>)/<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/+page.svelte
routes/.../(<domainListGroup>)/<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/[<compositeKeyThird>]/[<compositeKeyFourth>]/+page.svelte
```

## Facets

Static facets live directly under the host item's chrome. A facet branch earns a group and layout only when it owns several routes or shared UI.

```text
routes/.../<domainItem>/[<domainItemKey>]/(<domainItem>)/+layout.svelte
routes/.../(<domainItem>)/<facetStatic>/+page.svelte
routes/.../(<domainItem>)/(<facetBranch>)/+layout.svelte
routes/.../(<facetBranch>)/<facetInnerList>/+page.svelte
routes/.../(<facetBranch>)/<facetInnerItem>/[<facetInnerKey>]/+page.svelte
```

Never hardcode a shared view's heading URL, invent placeholder IDs, or put a detail layout on a plural list key path.

Before finishing, confirm the route does not:

- duplicate a list token through `(<domainList>)/<domainList>/+page`,
- reject the valid `(<hub>)/<hub>/` hub shape,
- invert detail chrome as `<domainList>/[key]/+layout`,
- leave a group with one file and no shared UI.
