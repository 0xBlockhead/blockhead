---
name: typescript-development
description: Apply repository TypeScript conventions and resolve type or lint failures.
---

# TypeScript development

Let `pnpm run lint` enforce mechanical formatting; apply only the semantic rules below while editing.

Read [expressions-and-types.md](references/expressions-and-types.md) when changing multiline expressions, generics, optionality, object construction, assertions, runtime boundaries, or lint suppressions.

Keep core data flow at the call site. Inline a single-use derivable value unless its name records a domain or transport concept. Use inferred types and package-provided types before writing annotations or duplicates.

Resolve type failures at the highest incorrect contract. Do not add guards, assertions, `unknown`, or suppressions to hide a wrong schema, wire type, generic, or function signature.

Run the smallest applicable lint or type check after editing. Treat a type-aware lint failure as evidence about the file's contract, not an obstacle to bypass.
