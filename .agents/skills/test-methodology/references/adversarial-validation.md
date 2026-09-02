# Adversarial validation

Use this reference when a task establishes a new test family, shared fixture, runner, retry policy, timer boundary, module mock, browser matrix, persistence stress test, or evidence ledger.

## Challenge the proof

1. Name the plausible fault and the one observable that distinguishes it from fallback success, setup failure, valid empty state, or a different owner passing.
2. Perturb the protected behavior when practical. The intended test must fail for the intended reason; a neighboring type error, fixture error, timeout, or unrelated assertion is not mutation evidence.
3. Replay the smallest witness without retries. Retries may measure reproducibility after the first failure is preserved, but a retry pass cannot convert a failed acceptance attempt into a pass.
4. Exercise relevant runner assumptions with reproducible controls already provided by the runner: shuffled test order with a recorded seed, an alternate worker pool, repeated execution, or a constrained timeout. Add dependencies only when built-in probes cannot answer the question.
5. Preserve exact negative evidence when it distinguishes the stack or failure phase. Do not transfer a sibling implementation's success, a source-only result, or an earlier base's artifact into the current denominator.

## Isolation and shared state

- Keep configured file/process/browser isolation when it is part of the supported proof boundary. A broad failure after deliberately disabling isolation demonstrates that boundary; it does not automatically create one defect per failing test.
- Within the supported isolation boundary, tests must remain independent of declaration order. A hoisted module mock, fake clock, listener, singleton, database, port, or browser context is owned by the suite that creates it and must be reset or disposed at the narrowest shared lifecycle hook.
- Prefer resetting the owned mock over globally clearing every mock. Preserve default implementations deliberately; use reset when queued responses or implementations must not survive.
- Give persistent stores, ports, profiles, and evidence roots collision-proof identities derived from the runner's worker, retry, repeat, and scenario coordinates. Identity prevents aliasing; it is not an oracle.

## Tooling contracts

Product tests should assert product behavior, not test configuration, package-script spelling, glob text, or the existence of other tests. A custom executable repository tool may have a compact black-box contract only for behavior it uniquely owns, such as discovery partitioning, normalization, no-write operation, process timeout/cleanup, or fail-closed diagnostics.

Keep acceptance, observation, and environment capability distinct. An opt-in live or wallet test may skip before the capability is present, but once the capability is claimed, missing artifacts, setup failure, or an unexecuted cell must remain explicit rather than silently skip or inherit credit.

## Durable report

Record the base identity, exact denominator, seed or repeat coordinates, runner configuration, capability boundary, pass/fail/skip counts, preserved negative artifacts, and incomplete validation. Report order-sensitive survivors and the lifecycle owner added to remove them. Durable evidence belongs in the task's stable artifact tree; only mechanically reproducible intermediates belong in OS temporary storage.
