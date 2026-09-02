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

## Compiler diagnosis

- Record the compiler package and version for every claimed type result. Use the repository's latest verified native TypeScript for the primary check and its maintained TypeScript 6 installation for compatibility; neither compiler is a fallback pass until the same bounded representative contract completes under it.
- Reduce a cascade to the smallest valid witness before editing shared generics. Compare the same witness before and after by diagnostic identity, exact target denominator, and elapsed time; revert a change that merely reduces secondary errors without restoring the contract. A pure TypeScript witness that passes while its equivalent Svelte consumer fails localizes the problem to component transformation or inference, not the underlying model.
- Preserve irreducible inference at the highest owner. Do not repair generated consumers with repeated generic arguments, assertions, guards, broad defaults, or suppressions. A proposed inference change is accepted only when the smallest real consumer reaches zero diagnostics and the existing contract oracle still passes.
- Keep compiler root manifests to authored entrypoints; imported helpers, generated declarations, and application modules already owned by the canonical Svelte check remain transitive dependencies, not duplicate roots. When a validator's inferred implementation type expands through a generic API, give its exported binding the existing named contract type instead of weakening consumers; `satisfies` checks compatibility but deliberately retains the expansive inferred type.
- Run only one heavy compiler on the shared checkout at a time. Parallel agents may inspect manifests or diagnostics, but concurrent compilers invalidate timing evidence and create avoidable memory pressure; stop obsolete owned runners before the next bounded check.
- Keep the canonical application command on SvelteKit's upstream `svelte-check`; name custom sharding, compatibility, scaling, and diagnostic commands separately. Retain a split config or extracted definition only when it isolates a real tooling surface or compiler boundary that the ordinary current SvelteKit project cannot express.
