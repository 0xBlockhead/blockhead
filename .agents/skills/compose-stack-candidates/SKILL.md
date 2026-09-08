---
name: compose-stack-candidates
description: Organize multiple independently selectable stack implementations as stable component branches, reusable irreducible joins, and disposable execution runs. Use for cross-product candidate programs, topological integration, candidate-worktree naming or migration, and cleanup of composition state; not ordinary feature branches or one-off merge testing.
---

# Compose Stack Candidates

Model the candidate program as a sparse dependency graph, not a directory-shaped Cartesian product. Materialize only demanded states and memoize a partial composition only when it removes repeated downstream work.

## Representation

Resolve the permitted checkout root and composition registry from repository instructions or the current program packet. If no registry exists, create one in the designated artifact directory with the fields below before materializing joins. Record independently selectable axes and their dependency order; do not infer them from existing directory names. Make each branch name equal its relative worktree path. For a data/feature/runtime program, use:

```text
data/<candidate>
feature/<capability>
runtime/<candidate>
join/<component>--<component>[--<component>]
run/<cell-hash>-a<attempt>
```

Order components topologically from the integration base, including inside join names. In the example, `data` owns an independently selectable data architecture; `feature` owns product capability independent of a particular data or runtime choice; `runtime` owns an irreducible executable presentation-and-host unit. Split a component further only when the separated unit is independently selected and reused. Preserve a project's explicitly adopted axes and naming in its program record.

Do not encode a base commit, date, task, agent, owner, status, target device, browser, scenario, retry, evidence class, or package lock in a branch or worktree name. Those are run metadata. Use stable candidate identifiers rather than `current`, `original`, or `harness`.

## Irreducibility test

Retain an independently selectable component when it owns a distinct required contract and has an owner-local falsifying check. Do not require multiple consumers to preserve a valid candidate. Retain a reusable join only when all are true:

- it owns a distinct obligation that neither parent owns;
- it crosses exactly one new integration boundary;
- at least two demanded descendants reuse it, or it is the selected product baseline;
- retaining it avoids repeated merge, build, or qualification work;
- an owner-local falsifying check proves the obligation.

Remove the node from the design as a thought experiment. If no obligation is lost and no consumer must reconstruct a distinction, fold it into its parent. If a distinction is needed only for an execution environment or observation, record it as run metadata rather than source topology.

## Sparse composition

Treat each reusable state as a memoized function of immutable parent commits. For the example axes:

```text
S0 = main
Sdata(d) = S0 + data/d
Sfeature(d, f) = Sdata(d) + feature/f
Sruntime(d, f, r) = Sfeature(d, f) + runtime/r
```

Create only states demanded by the applicability matrix. Prefer an authority-hash join when areas exchange contracts or generated inputs without source coexistence. Create a Git join only when code from its parents must coexist for the next proof. Never create every cross-product branch preemptively.

Every join records its ordered parent commits, applicability cell, owner, falsifying check, downstream consumers, and disposition in the composition registry. Store run records and bulky evidence at stable paths referenced by that registry; do not make a worktree the sole evidence index. An authority-hash join records exact exchanged contract/input hashes and their compatibility proof without merging source trees; it is appropriate only when those inputs suffice for the consumer's proof.

An applicability cell identifies every selected component and relevant execution dimension. Preserve matrix revision and cell identities when comparing reports; overlapping subsets and changed applicability cannot be summed as progress. Accept component proofs separately from the integration behavior a join must demonstrate. The join's accepting owner owns that oracle while each component owner retains its implementation.

## Concurrency and publication

Assign one writer to each component or join. Independent nodes may advance concurrently. Serialize only mutation of the same node, shared generated authority, or canonical `main`. Prepare downstream joins as soon as every required parent commit is immutable; do not wait for unrelated matrix cells.

Promote to the declared integration branch only shared existing-stack fixes, deliberately selected candidates, and genuinely shared infrastructure. Never promote a synthetic join merely because it passed. Evaluate new integration commits against each candidate by affected boundary; rebase only affected candidates at a clean owner boundary.

## Lifecycle and migration

A component branch may outlive its checkout. Keep a join checkout only while it is an active writer, unique evidence join, selected baseline, or reusable parent. A `run` is disposable after its terminal result and evidence are durable, no process or task references it, and reconstruction from recorded commits is proven.

Never rename, move, rebase, or remove an active or dirty checkout merely to normalize it. For a legacy checkout:

1. Register its stable component or join identity and preserve its current path as an alias.
2. Wait for its owner to return at a clean, process-free boundary.
3. Create `recovery/<canonical-name>/<head-prefix>` before history-affecting migration.
4. Verify unique dirty state and evidence are committed or durably externalized.
5. Rename the branch, then remove and recreate the checkout at the canonical path only if more work is demanded.
6. Update stable-ID records and retire the alias only after no task, process, or evidence join references it.

For new work, use the canonical root and naming immediately. Migration is opportunistic and must not interrupt execution.

## Cleanup decision

Remove a worktree only after proving it is inactive, clean, reconstructable, not a unique evidence owner, and not referenced by a current task or reusable descendant. Preserve the branch when it still represents a selectable component or useful memoized join. Treat uncertainty as retained state, not evidence of usefulness or permission to delete.
