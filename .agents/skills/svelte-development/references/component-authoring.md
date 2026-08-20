# Component authoring reference

## File layout

Separate module script, instance script, script comment sections, head, markup, and style with two blank lines.

Order instance-script sections when present:

1. Polyfills and styles in the root layout only.
2. View transitions in the root layout only.
3. Types and constants.
4. Context.
5. State.
6. Inner context.
7. Functions.
8. Components.
9. Transitions and animations.

## Props and snippets

- Put type imports used by `$props()` in the State section.
- Destructure one prop per line and keep prop order consistent at call sites.
- Indent a `$bindable()` default value within its parentheses.
- Type HTML rest props with `WithRest` and `SvelteHTMLElements`.
- Type component rest props with `WithRest` and `ComponentProps`.
- A no-argument snippet uses `Snippet`, not `Snippet<[]>`.
- For bundled snippet state, use an optional tuple member whose object fields are optional. This permits a definition that ignores the bundle.
- Use positional tuple members when values are independent.
- With two or more tuple members, object fields, or render arguments, put one item per line with trailing commas.
- A snippet definition, its type, and every render call must agree on object versus positional arguments and multiline shape.
- `Collapsible` and `ParentPageCollapsible` summary snippets receive `{ open }`.
- Keep a snippet prop directly under its receiving component. If its body is conditional, put the condition inside the snippet.
- For local snippets passed by reference from conditional markup, keep the snippet definitions in the same conditional scope.

For a function binding, put getter and setter on separate lines, prefix the setter argument with `_`, and keep the setter body explicit.

## State and imports

- Indent values inside `$state()` and `$derived()`.
- Declare a `$derived` value only when it is read more than once.
- Import functions in the section where they are exclusively used.
- Keep UI-only `.svelte.ts` state beside its route or context.
- Put global polyfills, styles, and view-transition setup only in the root layout.

## Markup and CSS

- Put one blank line between sibling elements or Svelte blocks that span multiple lines.
- Use existing semantic elements, roles, IDs, classes, and global component variants before adding attributes.
- Add a class only when local `<style>` uses it.
- Add a `data-*` attribute only for a local value, a global utility in `src/styles/components.css`, or a justified E2E hook.
- Use semicolons in CSS declarations.
- Check `src/styles/*.css` before adding local overrides.
- Use `TruncatedValue` or `Address` for displayed truncation.

## Resource consumers

Views consume SvelteKit-shaped resources through localized `ResourceBoundary` instances. Do not inspect `.current`, `.ready`, `.loading`, or `.error` manually for rendering. Resource ownership and TanStack notifications belong in the adapter under `src/collections`.

Read `src/collections/AGENTS.md` before changing `TanStackLiveQueryResource`, `ResourceBoundary`, or a related fixture.
