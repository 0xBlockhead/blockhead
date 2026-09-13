---
name: schema-entity-modeling
description: Model repository schema identity, selectors, references, cardinality, and observations.
---

# Schema entity modeling

Inspect the affected entity, resolver registrations, references, and views before changing the model.

Model domain identity before provider payload shape:

- An entity represents a domain subject with its own identity. Stable subjects, occurrences, revisions and observations can have different lifecycles; do not force all of them into a stable-object model.
- A selector is a unique field set that addresses that subject.
- Alternate interoperable identifiers are separate selectors when each uniquely addresses the same entity.
- A `$$` field refers to another entity. Do not flatten the referenced entity's identity into unrelated scalar fields.
- Cardinality describes valid domain values after resolution. It does not describe whether a provider implements the field.
- Observation entities own facts that can vary independently of the parent identity. Use the actual protocol coordinate, window and methodology needed for uniqueness; a timestamp alone is not always sufficient or available.
- Lifecycle timestamps and values determined by the entity ID stay on the owning entity.

Check every affected resolver for selector applicability, emitted fields, and timestamp coordinates. Check every affected view against the resulting cardinality instead of preserving optional branches that the schema no longer permits.

Prefer the highest upstream correction. Do not compensate for a wrong entity boundary or field type with assertions, runtime guards, resolver fabrication, or display fallbacks.

Read [schema-and-resolvers-reference.md](references/schema-and-resolvers-reference.md) when the task involves market observations, resolver applicability, emitted field rows, or detailed examples not covered here.
