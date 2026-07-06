# Hypergraph Topology

## Frontier Nodes

- `q01-schema-prose-field-contract`

## Edges

- `q01-schema-prose-field-contract` reads `SCHEMA.md`.
- `q01-schema-prose-field-contract` owns `maps/nodes/q01-schema-prose-field-contract.md`.
- `q01-schema-prose-field-contract` owns `maps/verifiers/scripts/q01-schema-prose-field-contract.mjs`.

## Validation

Run:

```sh
node maps/verifiers/scripts/validate-topology.mjs
```

The topology verifier checks that every listed frontier node has a node spec, has a runnable verifier script, and does not claim ownership outside `maps/`.
