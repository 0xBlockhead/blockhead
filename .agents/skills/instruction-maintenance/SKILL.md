---
name: instruction-maintenance
description: Create, revise, split, consolidate, or evaluate repository AGENTS.md instructions, agent skills, and their conditional resources.
---

# Instruction Maintenance

Encode decisions the agent would otherwise get wrong, not domain knowledge it already has.

## Method

1. Read [references/architecture.md](references/architecture.md) and [references/coverage.md](references/coverage.md). Inspect nearby instructions, skills, and the real tasks, corrections, failures, or artifacts that justify the change.
2. Choose the narrowest reliable owner. Keep standing or path rules in `AGENTS.md`, mechanically enforceable rules in code or tests, and repeatable task procedure here. Do not create a skill if those owners suffice.
3. Write the description as a classifier: capability, concrete triggers, and only exclusions that prevent plausible false activation. Do not summarize the body.
4. Express each retained decision as a standalone condition, behavior, and boundary. Revise its canonical passage when feedback changes the contract; keep the incident in evaluation evidence. Remove sentences whose absence changes no decision.
5. Prefer one coherent skill over fragments that normally co-activate. Split only when triggers and loaded detail are independently useful.
6. Put inevitable gotchas in `SKILL.md`. Put conditional detail in a focused reference and link it directly at the decision point with the exact condition for reading it. Never add a second routing hop.
7. Use a script when deterministic mechanics would otherwise be regenerated or explained repeatedly. State its contract and stopping condition; do not narrate its implementation.
8. Give one default, then the condition that justifies an alternative. Match prescription to fragility; avoid option menus and generic positive guidance.

## Evaluation

Test behavior, not wording:

- Use real requests for should-trigger, should-not-trigger, and ambiguous routing cases.
- Compare the task with and without the smallest proposed instruction group. Inspect loaded context, missed decisions, irrelevant steps, checks, and outcome.
- Repeat meaningful comparisons at least five times; do not encode a rule from one stochastic run.
- Keep a change only when it improves observable work or prevents a demonstrated failure at acceptable context and execution cost.

Validate skill structure with the bundled `skill-creator/scripts/quick_validate.py` when available. Update [references/coverage.md](references/coverage.md) when ownership moves. Read and update [references/evaluation.md](references/evaluation.md) when a correction supplies a reusable case or when evaluating instruction behavior.
