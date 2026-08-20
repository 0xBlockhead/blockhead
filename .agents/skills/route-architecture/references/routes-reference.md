## SvelteKit routes and views (`src/routes/**/*`)

`src/views/*.svelte` / `src/routes/**/*.svelte`:
- NO TYPESCRIPT TYPE ASSERTIONS. EVER.

URLs and nav: `src/routes/navigationItems.svelte.ts`. `(…)` = layout groups only (not URL). Add `+layout` only for shared chrome or multiple children; drop empty groups. Never colocate `+layout` + `+page` except under `routes/`. Shallow `routes/<segment>/+page.svelte` OK for hubs; same rules with a prefix: `routes/<urlPrefix>/(area)/…`.

Lists / detail — List: `(area)/<domainList>/+page`. Bad list: `(area)/(<domainList>)/<domainList>/+page` (duplicated list token). Hub: `(<hub>)/<hub>/…` = same string for group folder + next segment (not the list bad pattern). `<domainList>` ↔ `<domainItem>` plural/singular; `[<domainItemKey>]` id segment (`coinId`, …). `staticBeforeKey/` = literals before `[domainItemKey]`. `(<domainListGroup>)` ≈ `domainList`. Detail: `<domainItem>/[domainItemKey]/+page` beside `<domainItem>/[domainItemKey]/(<domainItem>)/+layout` (path + chrome share `domainItem`).

Deep — Parent: `<parentItem>/[parentKey]/(<parentItem>)/`. Facet list: `/(<parentItem>)/<childList>/+page`. `(<scopedSlice>)` + `childItem`/`[childKey]` / `(<childItem>)` like domain level; grandchild routes nest under child. Composite: `<compositeItem>/[compositeKeyFirst]/…`. Slice: same `<sliceNoun>` for list + `[sliceKey]` under `(<sliceGroup>)`. Facets: `<facetStatic>`, `(<facetBranch>)` + inner list/item/key placeholders. Double `( )/` only if both wrappers need several routes.

Templates — `routes/.../` = any `src/routes/` prefix (incl. `<urlPrefix>`). Repeated placeholder = same folder name. `domainList`/`domainItem`/`[domainItemKey]` as above.

- List (section)
	routes/(area)/+layout.svelte
	routes/(area)/<domainList>/+page.svelte

- Provider hub — <hub> repeated: group folder + next URL segment (not the list mistake)
	routes/(area)/(<hub>)/<hub>/+layout.svelte
	routes/(area)/(<hub>)/<hub>/<domainList>/+page.svelte
	routes/<urlPrefix>/(area)/(<hub>)/<hub>/<domainList>/+page.svelte

- Domain family + detail — <domainListGroup> usually same string as <domainList>; <domainItem> repeated for path + (chrome)
	routes/(area)/(<domainListGroup>)/+layout.svelte
	routes/(area)/(<domainListGroup>)/<domainItem>/[<domainItemKey>]/+page.svelte
	routes/(area)/(<domainListGroup>)/<domainItem>/[<domainItemKey>]/(<domainItem>)/+layout.svelte
	routes/(area)/(<domainListGroup>)/<staticBeforeKey>/[<domainItemKey>]/+page.svelte
	routes/(area)/(<domainListGroup>)/<staticBeforeKey>/[<domainItemKey>]/(<domainItem>)/+layout.svelte

- Detail with only (area) — no (<domainListGroup>)
	routes/(area)/<domainItem>/[<domainItemKey>]/+page.svelte

- Under (<domainItem>) chrome — inner list / inner detail for that entity
	routes/.../(<domainItem>)/<innerList>/+page.svelte
	routes/.../(<domainItem>)/<innerItem>/[<innerKey>]/+page.svelte

- Parent entity — <parentItem> matches (<parentItem>); children use child* / grandchild* tokens
	routes/.../<parentItem>/[<parentKey>]/(<parentItem>)/+layout.svelte
	routes/.../(<parentItem>)/<childList>/+page.svelte
	routes/.../(<parentItem>)/(<scopedSlice>)/+layout.svelte
	routes/.../(<parentItem>)/(<scopedSlice>)/<childList>/+page.svelte
	routes/.../(<parentItem>)/(<scopedSlice>)/<childItem>/[<childKey>]/+page.svelte
	routes/.../(<parentItem>)/(<scopedSlice>)/<childItem>/[<childKey>]/(<childItem>)/+layout.svelte
	routes/.../(<childItem>)/<grandchildList>/+page.svelte
	routes/.../(<childItem>)/<grandchildItem>/[<grandchildKey>]/+page.svelte

- Scoped slice — <sliceNoun> shared by list + param detail under (<sliceGroup>)
	routes/.../(<sliceGroup>)/<sliceNoun>/+page.svelte
	routes/.../(<sliceGroup>)/<sliceNoun>/[<sliceKey>]/+page.svelte

- Composite key — <compositeItem> + numbered compositeKey* parts (add more as needed)
	routes/.../<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/[<compositeKeyThird>]/+page.svelte
	routes/.../<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/[<compositeKeyThird>]/[<compositeKeyFourth>]/+page.svelte

- Composite under (<domainListGroup>) — keys belong to <compositeItem>
	routes/.../(<domainListGroup>)/<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/+page.svelte
	routes/.../(<domainListGroup>)/<compositeItem>/[<compositeKeyFirst>]/[<compositeKeySecond>]/[<compositeKeyThird>]/[<compositeKeyFourth>]/+page.svelte

- Facets — host uses <domainItem> / [<domainItemKey>] / (<domainItem>); branch uses facet* tokens
	routes/.../<domainItem>/[<domainItemKey>]/(<domainItem>)/+layout.svelte
	routes/.../(<domainItem>)/<facetStatic>/+page.svelte
	routes/.../(<domainItem>)/(<facetBranch>)/+layout.svelte
	routes/.../(<facetBranch>)/<facetInnerList>/+page.svelte
	routes/.../(<facetBranch>)/<facetInnerItem>/[<facetInnerKey>]/+page.svelte

### Anti-examples

- Bad: `(area)/(<domainList>)/<domainList>/+page` (list doubled with parens). Good: `(area)/<domainList>/+page`; detail under `(<domainListGroup>)/<domainItem>/[…]` with `domainListGroup` ≈ `domainList`.
- Bad: banning `(<hub>)/<hub>/` as if it were the list error. Good: hub repeat OK; wrong is only `(<domainList>)/<domainList>/+page`.
- Bad: detail `+layout` on `<domainList>/[key]/` (inverted). Good: `(<domainListGroup>)/` then `<domainItem>/[domainItemKey]/+page` and optional `(<domainItem>)/+layout`.
- Bad: hardcoded heading URL in a shared view. Good: `headingHref` / `headingLabel` from route.
- Bad: placeholder IDs in detail pages. Good: real `params`, validated to entity ID type.
- Bad: deep `(group)/` with one file, no shared chrome. Good: merge or give the layout several children / shared UI.

Checks — New routes must not match any Bad row above.

### Validation

Visit page with Playwright, collect console errors, read them, iterate until none appear
