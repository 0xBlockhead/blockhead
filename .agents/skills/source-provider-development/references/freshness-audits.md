# Source client freshness audits

## Generated clients

- Run the documented generator, not an ad hoc downloader.
- Use a provider or module argument after an all-source failure to separate a dead schema URL from an unrelated transient failure.
- Treat a successful download as evidence that the remote schema URL still works.
- Keep generated schemas and types checked in and do not hand-edit them.
- Inspect manifests, schemas, types, clients, queries, indexes, and any required wire aliases after regeneration.
- If output changes sharply, verify that the schema source did not broaden unexpectedly and ensure downstream documents still compile.

## Manual clients

Check the provider's current official documentation for:

- base URL and path prefix,
- authentication placement,
- required headers,
- pagination and rate limits,
- response envelopes,
- browser CORS behavior.

Change client code only for documented drift. Keep transport-specific behavior under `src/sources` and avoid adding wrapper layers. If the endpoint has no stable official documentation, record that limitation and rely on the narrowest authoritative artifact available.

## Verification

Inspect the source definition, binding, transport, resolver, and generated output as one chain. A schema download alone does not prove that runtime queries or resolver mappings remain valid.
