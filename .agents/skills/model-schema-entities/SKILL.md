---
name: model-schema-entities
description: Adversarially audit concrete domain entities, selectors, fact ownership, and resolver applicability; not schema infrastructure or provider transport implementation.
---

# Audit schema entities

Define the subject without mentioning APIs, routes, tables, or views. Classify it as a stable subject, occurrence, revision, point observation, or windowed aggregate; decide separately whether source or methodology is part of its identity.

Audit these independent obligations:

1. **Existence:** It has domain identity, lifecycle, references, multiplicity, or independent addressability—not merely a nested payload, endpoint, or UI section.
2. **Selectors:** Each is unique, minimal, exact, public, and honestly constructible. Remove every member and seek a collision. `Latest`, omitted coordinates, labels, and response order are not identity.
3. **Alternates:** Each field set independently identifies the same subject. Only deterministic domain facts derive equivalence; transferable, historical, probabilistic, or provider-claimed mappings are relationships or claims.
4. **References:** Identity components that name modeled subjects use valid selector references. Copied foreign values remain only when they are historical assertions owned by this record.
5. **Concrete identity:** Catalog concepts, deployments, wrappers, bridges, proxies, implementations, and assignments remain distinct when their identity or lifecycle differs.
6. **Occurrences and relationships:** Use protocol-native discriminators, never provider order or synthetic IDs. A relationship becomes an entity only when its repetitions, attributes, lifecycle, or references need identity.
7. **Fact ownership:** Invariants, lifecycle facts, and selector-determined facts belong to their subject. Corrected knowledge about the same fact is not a new observation.
8. **Observations:** Use the truthful state coordinate plus every fork, feed, methodology, window, and grouping dimension needed for uniqueness. Do not fabricate precision or substitute wall-clock time for a protocol coordinate.
9. **Source claims:** Providers competing over one fact share identity. Source participates only when independently addressable simultaneous reports are the subjects.
10. **Cardinality and facets:** Cardinality describes valid domain values, not support, loading, failure, priority, or completeness. Rows, counts, snapshots, provenance, and errors remain independent when they can truthfully disagree.

Verify every required selector member and field has authoritative meaning, scope, units, precision, and an honest source path. Reject fabricated values, semantically similar wire substitutions, empty placeholders, and constants presented as live evidence. Provider construction belongs to `source-provider-development`; selector serialization belongs to `route-architecture`.

Report defects plus the compact model that proves them: definition, classification, identity authority, selectors and scope, derivations, transferable relationships, fact owners, observation coordinates and collisions, source-claim semantics, cardinality, constructibility, and representative valid and invalid identities.
