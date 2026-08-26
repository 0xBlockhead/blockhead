# Instruction coverage

This ledger records the maintained owner of every section from the former root instruction file. The detailed reference is the lossless task-scoped destination for uncommon examples and edge cases; shorter active instructions summarize the same material.

| Former section | Standing or workflow owner | Detailed reference |
| --- | --- | --- |
| Agents | Root `AGENTS.md` | — |
| Editing, Syntax, Style | Root, TypeScript and Svelte skills, lint | — |
| Bash commands | Root | — |
| Git | Root and `atomic-commits` | `atomic-commits` references |
| Packages | Root and `package.json` | — |
| Tasks | Root and `package.json` | — |
| Long-running orchestration | Root routing cue and global Codex `orchestrate-program` | `~/.codex/skills/orchestrate-program/SKILL.md` |
| Codex Goal lifecycle and cross-task recovery | Global Codex `manage-codex-goal` and `supervise-orchestration` | `~/.codex/skills/manage-codex-goal/SKILL.md`; `~/.codex/skills/supervise-orchestration/SKILL.md` |
| Cross-task context recall and exhaustive history recrawls | Root routing cue and global Codex `recall-task-context` | `~/.codex/skills/recall-task-context/SKILL.md` |
| Testing | `tests/AGENTS.md`, `test-methodology`, `playwright-route-testing` | `playwright-route-testing/references/testing-reference.md` |
| TypeScript | Root, `typescript-development`, lint | `typescript-development/references/expressions-and-types.md` |
| Constants | `src/constants/AGENTS.md` | `src/constants/AGENTS.md` |
| Library helpers | `src/lib/AGENTS.md` | `src/lib/AGENTS.md` |
| Svelte | `svelte-development` | `svelte-development/references/component-authoring.md` |
| Import topology | `src/AGENTS.md` | — |
| Schema | `src/schema/AGENTS.md`, `schema-entity-modeling` | `schema-entity-modeling/references/schema-and-resolvers-reference.md` |
| Sources | `src/sources/AGENTS.md`, `source-provider-development` | focused references selected by `source-provider-development` |
| Resolvers | `src/resolvers/AGENTS.md`, `schema-entity-modeling` | `schema-entity-modeling/references/schema-and-resolvers-reference.md` |
| Adding new Sources / Providers | `source-provider-development` | `source-provider-development/references/provider-onboarding.md` |
| Collections and data flow | `src/collections/AGENTS.md`, `resource-reactivity` | `resource-reactivity/references/collections-reference.md` |
| Entity Views | `src/views/AGENTS.md`, `entity-view-development` | `entity-view-development/references/entity-views-reference.md` |
| SvelteKit routes and views | `src/routes/AGENTS.md`, `route-architecture` | `route-architecture/references/route-shapes.md` |
| TanStack DB queries | `src/collections/AGENTS.md`, `resource-reactivity` | `resource-reactivity/references/collections-reference.md` |

## Subsection routing

| Former subsection | Maintained owner |
| --- | --- |
| Commit changes; file moves | `atomic-commits`; workflow reference |
| Creating, revising, splitting, consolidating, or evaluating instructions and skills | `instruction-maintenance`; its architecture and evaluation references |
| Test design, representative fixtures, consolidation, and fault-detection coverage | `test-methodology`; `playwright-route-testing` for browser-specific work |
| Code, test, fixture, schema, or instruction reduction and irreducibility | Global portable `~/.agents/skills/reduce` |
| Product-return decisions, candidate integration, shared resources, recovery, and denominator reconciliation | Global Codex `orchestrate-program` |
| Playwright placement, `data-e2e`, assertions | `tests/AGENTS.md`; testing reference |
| Cross-route matrix; CORS policy | Focused Playwright references; testing reference |
| TypeScript formatting, style, lint quality | TypeScript references; lint |
| Svelte HTML/CSS, tools, components | Svelte references |
| SvelteKit-shaped resources | `resource-reactivity`; Svelte reference |
| Source freshness; OpenAPI; GraphQL | Focused source references; provider reference |
| TanStack DB OPFS persistence | Collections reference |
| Entity identity; related entities; domain views | Entity-view references |
| Route anti-examples; validation | Route references; Playwright skill |

## Verification rule

When instructions move again, compare the former owner's heading inventory and repository-specific terms against this ledger, confirm every skill links directly to its references, and run the structural checks in `instruction-evaluation.md`.
