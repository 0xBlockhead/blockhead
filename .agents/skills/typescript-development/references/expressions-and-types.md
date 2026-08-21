# TypeScript expressions and types

## Formatting that changes code shape

- Put each property or array value on its own line when there is more than one. Use trailing commas in multiline object and array literals.
- Put each generic type parameter on its own line when there is more than one.
- Do not put trailing commas after call arguments, function parameters, arrow parameters, or type arguments.
- Wrap multiline expressions in parentheses unless an array or object literal already provides the only outer delimiter.
- Put union and intersection operators before members.
- Break chained calls onto indented lines.
- Put `?` after a multiline ternary condition and `:` on its own branch line.
- Begin each continued multiline binary line with its operator.
- A single-statement `if` has no braces. Put its statement on the next indented line and add a blank line before the next peer statement.

## Expressions and declarations

- Use `.` when the receiver is non-nullish, optional chaining only for a nullish-capable receiver, and `??` only when the type permits absence.
- Prefer `??` to `||` for defaulting.
- Prefer array spread to `.concat`.
- Prefer `T[]` to `Array<T>`.
- For an object-only conditional spread, use `...(condition && { ... })`. Arrays still need an iterable branch.
- Declare functions with `const` unless overload signatures require a declaration.
- Prefer `as const satisfies` for constants instead of a binding annotation.
- Name generic parameters `_Type extends Type`.
- Do not add re-exports or barrel modules.
- Use `$/` for `src/` imports and include full `.ts`, `.svelte`, or `.svelte.ts` extensions.
- Rewrite imports immediately when moving or renaming files.

## Runtime boundaries and lint

- Do not use `typeof`, `Array.isArray`, `Reflect.get`, or equivalent hand-written shape checks to compensate for weak TypeScript types.
- Environment capability checks rooted at `window`, `document`, or `globalThis` are allowed.
- Parse JSON-shaped unknown input at the shared `JsonValue` boundary or with a real wire schema.
- Do not write narrowing helpers over `any` or `unknown` when a domain or wire type can express the boundary.
- Do not attempt opportunistic fixes for `Type instantiation is excessively deep and possibly infinite`.
- Prefer a file or stable narrow-glob lint override for a real architectural boundary. Use a line suppression only for one reviewer-verifiable exception.
- Repeated suppressions with the same reason indicate a missing type correction or scoped override.
- Do not hide primary-tree code under lint ignore patterns.
