---
name: create-skill
description: Create or revise repository agent skills and their conditional resources. Use when authoring, splitting, consolidating, or evaluating SKILL.md workflows; not for ordinary documentation or AGENTS.md-only changes.
---

# Create Skill

Encode decisions the agent would otherwise get wrong, not domain knowledge it already has.

## Method

1. Read `docs/agents/context-architecture.md` and `docs/agents/instruction-coverage.md`. Inspect nearby skills and the real tasks, corrections, failures, or artifacts that justify this one.
2. Choose the narrowest reliable owner. Keep standing or path rules in `AGENTS.md`, mechanically enforceable rules in code or tests, and repeatable task procedure here. Do not create a skill if those owners suffice.
3. Write the description as a classifier: capability, concrete triggers, and only exclusions that prevent plausible false activation. Do not summarize the body.
4. Keep only decision-changing instructions: surprising defaults, hard boundaries, failure recovery, tool choice, and verification. For every sentence ask: would removal change an action or catch a real failure? If not, cut it.
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

Validate structure with the bundled `skill-creator/scripts/quick_validate.py` when available. Update `docs/agents/instruction-coverage.md` when ownership moves and `docs/agents/instruction-evaluation.md` when a correction supplies a reusable case.
