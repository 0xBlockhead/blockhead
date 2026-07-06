# q01-schema-prose-field-contract

## Scope

Tighten the schema prose and field-contract review loop without editing app generators, source definitions, or product implementation files.

## Owned Paths

- `maps/nodes/q01-schema-prose-field-contract.md`
- `maps/verifiers/scripts/q01-schema-prose-field-contract.mjs`

## Contract

Schema prose must preserve the same subject-matter boundaries as the typed schema:

- Each entity block declares selectors before fields.
- Selectors are named field sets, not entity ids, identities, or lookup maps.
- Fields declare cardinality with `!`, `?`, `*`, or `0`; cardinality is a domain contract, not source support.
- `Field ... ::` prose describes declared fields only.
- `Notes ::` prose records modeling decisions, source limits, and exclusions that keep snapshot rows, timestamp rows, list windows, and stable identity separate.
- Generated schema prose must not reintroduce legacy entity-level `id`, `identities`, `lookups`, or `EntitySelectorProjection` language as contracts.

## Verifier

Run:

```sh
node maps/verifiers/scripts/q01-schema-prose-field-contract.mjs
```

The verifier parses `SCHEMA.md` and checks:

- every entity block has `Selectors ::`, `Fields ::`, and `Notes ::`
- `Selectors ::` appears before `Fields ::`
- selector fields are declared fields
- field declarations use valid cardinality suffixes and reference prefixes
- `Field ... ::` prose names declared fields
- `Notes ::` prose is substantive enough to document modeling scope or exclusions
- legacy entity-id/identity/lookup language is absent from schema contracts
