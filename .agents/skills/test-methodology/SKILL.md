---
name: test-methodology
description: Design, add, review, or consolidate automated tests around behavioral contracts and representative equivalence classes. Use for writing or maintaining Vitest or Playwright coverage, reducing duplicated suites, choosing fixtures or selectors, or improving fault detection; not for merely running an existing test command unchanged.
---

# Test methodology

A test earns its place by detecting a distinct plausible fault. Before editing, list the behavior, boundary, state transition, failure phase, owner, or diagnostic each retained test must protect.

## Design

1. Test through the highest stable observable seam that owns the contract. Prefer returned rows, requests, rendered behavior, state transitions, and diagnostics over source text, export inventories, file layout, or exact configuration-object mirrors.
2. Partition inputs by behavioral equivalence: independent branch, protocol, transport, parser, normalization, selector form, lifecycle transition, failure phase, or authority. Vary one coupled dimension while holding the others fixed.
3. Keep one labeled representative per equivalence class. A large realistic fixture is not stronger when a smaller source-faithful fixture exercises the same path and oracle.
4. Share a canonical representative selector or identity corpus when several consumers need the same valid inputs. Keep consumer-specific expectations beside each consumer; do not turn the shared corpus into a registry-completeness test.
5. Combine cases into a labeled matrix only when setup, action, lifecycle, and oracle match. Keep concurrency, cleanup, different error identities, and valid-empty behavior separate.

## Oracles

- Assert the smallest result that proves the contract, including meaningful fields, provenance, requests, and error diagnostics. Do not repeat implementation prose or entire payloads without an independent reason.
- Distinguish valid empty, inapplicable, loading, partial success, and failure. Never let a catch-to-empty path satisfy successful-empty coverage.
- Assert absence only when absence is a public guarantee; negative export-shape and “unsupported property” mirrors usually belong to types or lint.
- A helper must reveal the workflow and oracle. Reject helpers whose branching, mutable state, or hidden lifecycle exceeds the duplication removed.
- Test instrumentation must derive observations from the system under test. Fixtures may supply inputs; a probe must not manufacture expected rows or assign a successful match, validity or completion flag without evaluating the actual relationship. When changing that probe, perturb the protected relationship and require the negative case to fail for the intended reason.
- For asynchronous completion, test both the absent-event case and a successful event that arrives later. A fallback that completes before the real event is not correct merely because it prevents a hang.

## Maintenance

Delete a test only after naming the retained oracle for its obligation. Coverage percentage and runtime case count are not parity: preserve branch, boundary, failure, lifecycle, and owner coverage. For a risky deletion, perturb the protected behavior and confirm a retained test fails for the intended reason.

When route screenshots expose a repeatable failure, promote its predicate or representative route into a dedicated behavioral test. Share the classifier with the capture runner; keep image geometry and capture mechanics out of the product oracle.

Run the same smallest relevant suite before and after a consolidation when practical, then broaden according to shared behavior. Report surviving obligations, changed declarations and runtime matrix cases, net representation change, and any validation that did not complete.

When pioneering a new test family or changing shared mocks, retries, timers, workers, isolation, or runner ownership, read [references/adversarial-validation.md](references/adversarial-validation.md). Use its probes to distinguish a real product fault from a harness assumption before promoting a new standing check.

## Diagnostic and scaling oracles

- Give every partition an explicit, source-backed target manifest and verify that manifests are disjoint and their union equals the intended denominator. Loaded dependency counts, directory names, alphabetical labels, and generated shard numbers are not coverage evidence.
- Minimize large diagnostic cascades by deterministic bisection over exact manifests. Re-run the same smallest witness before and after each causal change; a lower error count alone is not a pass when the primary diagnostic or contract remains.
- Do not make one test a compiler aggregation root by importing several full schema-generic modules only to inspect their registries. Keep provider-local shape or behavior assertions with each provider and test cross-provider enrollment through an existing runtime summary or endpoint whose result already names the invariant.
- For generic or compiler-performance work, keep both a definition-level oracle and one real consumer-instantiation oracle. Preserve a checked scaling contract at two input sizes when the requirement is constant-time behavior; record its durable path and command rather than relying on an ephemeral run claim.
- Prefer one oracle that distinguishes several failure modes through labeled expectations over many near-duplicate tests, but retain separate cases when lifecycle, failure identity, ownership, or tooling boundary differs.
- For source or route matrices sharing canonical selector fixtures, validate fixture closure once per unique typed identity while retaining execution per source. When route discovery changes, qualify test collection against the complete generated metadata and handwritten fixture inputs before browser execution. Report a pre-execution fixture gap as owner debt; do not multiply it into resolver failures or hide it with synthesized selectors, placeholders, skips, or unsupported classifications.
- Separate environment denial from product behavior by reproducing the exact affected case with the required capability. A sandbox socket or browser-launch failure neither passes nor fails the product denominator, and does not justify reinstalling dependencies or weakening the oracle.
