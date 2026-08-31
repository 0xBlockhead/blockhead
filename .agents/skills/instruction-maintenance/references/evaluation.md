# Instruction evaluation

Test instruction changes against real repository work. Do not grade a migration only by file size or keyword presence.

Run each comparison at least five times per condition. Report medians and every observed pass or failure, not only the best run. Byte-identical agent runs have shown roughly 9% outcome instability, and a published single-run comparison reversed after five repetitions.

Add a routing or adherence case when the user corrects an agent mistake that a repository instruction could prevent. Record the actual request and failure mode. Do not invent a generic quiz when a real trace exists.

For each case, record:

- instruction files and skills loaded,
- irrelevant instructions loaded,
- repository rules missed,
- unnecessary steps caused by the instructions,
- checks selected by the agent,
- user corrections,
- input tokens when the client exposes them.
- wall time, tool calls, and inference cost when exposed,
- diff size and unrelated files changed,
- whether a hard constraint prevented a concrete failure.

## Routing cases

| Request | Expected standing scope | Expected skills | Skills that should stay unloaded |
| --- | --- | --- | --- |
| Rename a local TypeScript identifier | Root and `src` | `typescript-development` | All other specialized skills |
| Add a constant catalog lookup | Root, `src`, and `src/constants` | None | Sources, schema, Svelte, and Playwright skills |
| Add an alternate entity selector | Root, `src`, and `src/schema` | `schema-entity-modeling` | Svelte and Playwright skills unless a view changes |
| Update a provider base URL and auth header | Root, `src`, and `src/sources` | `source-provider-development` | Route and entity-view skills |
| Regenerate one OpenAPI provider | Root, `src`, and `src/sources` | `source-provider-development` plus `schema-codegen.md` | Svelte skills |
| Change an entity heading and related link | Root, `src`, and `src/views` | `svelte-development` and `entity-view-development` | Source-provider skill |
| Add a composite-key detail route | Root, `src`, and `src/routes` | `route-architecture` and `svelte-development` | Source-provider skill |
| Fix stale DOM after a live-query notification | Root, `src`, and `src/collections` | `resource-reactivity`, `svelte-development`, and `playwright-route-testing` | Route architecture unless paths change |
| Diagnose a browser CORS failure | Root and relevant source or test scope | `playwright-route-testing`, its CORS reference, and `source-provider-development` when transport changes | Entity-view skill |
| Consolidate duplicated resolver tests while preserving fault detection | Root and relevant resolver scope | `test-methodology` and `reduce` | Playwright and view skills |
| Split existing changes into commits | Root | `atomic-commits` | Every code-domain skill unless a check exposes code work |
| Create or revise repository instructions or a skill | Root | `instruction-maintenance` | Code-domain skills unless the instructions change that domain |
| Consolidate duplicated repository instructions | Root | `reduce` and `instruction-maintenance` | Every code-domain skill |
| Continue a persistent repository program from its mutable work denominator | Root | `orchestrate-program`, `manage-codex-goal`, `acpx`, `acpx-orchestration-policy`, plus packet-specific domain skills | `supervise-orchestration` and unrelated domain skills |
| Ask Codex to use a native subagent or delegate ordinary bounded work | Root | Host-native agent/thread and `agent-communication` guidance as applicable | `acpx` and `acpx-orchestration-policy` unless ACPX is explicitly requested |
| Run or administer an ACPX session, CLI command, or ACPX flow | Root | `acpx`; `acpx-orchestration-policy` when repository delegation/routing is also in scope | Native-subagent-only skills |
| Supervise an autonomous task that becomes idle with an open Goal denominator | Root | `supervise-orchestration`; `agent-communication` only when the nudge gate passes | Product-domain skills and `orchestrate-program` production workflows |
| Supervise a task whose stale Goal blocks an already authorized corrected continuation | Root | `supervise-orchestration`, `manage-codex-goal`, and `agent-communication`; use verified same-task control or a lossless same-model successor before requesting human Goal UI action | Product-domain skills |
| Supervise a task that marks its Goal blocked on approval for an action the human explicitly prohibited | Root | `supervise-orchestration`; use an already authorized supported continuation if one exists, otherwise report the contradiction once and delete the monitor | Product-domain skills and repeated user-action polling |
| Recrawl all relevant Codex and Cursor tasks before recovering settled intent | Root | Global `recall-task-context`; `agent-communication` when bounded acquisition is delegated; add domain skills only after the source ledger closes and the current request authorizes implementation | Code-domain and orchestration skills during the recall phase |
| Edit human-facing documentation | Root | None | Every code-domain skill |
| Select the next bounded work from mixed completed, in-flight, constrained, and uncertain evidence | Root | Global `plan-next` | Roadmap and persistent-orchestration skills unless the request expands to those workflows |

## Adherence checks

Inspect behavior rather than asking the agent to repeat instructions:

- A constants task derives a lookup from one row array.
- A schema task does not use cardinality to express missing provider support.
- A provider task keeps external I/O out of resolvers and browser secrets out of bindings.
- A Svelte task runs the repository autofixer.
- A resource task proves getter and boundary updates without reload or fixture masking.
- A route task does not add a URL segment for a parenthesized group.
- An entity-view task does not repeat heading identity in its details list.
- A CORS task changes transport ownership rather than adding fetch logic to a view.
- A test consolidation names surviving obligations, removes source and registry mirrors, and keeps distinct empty, failure, lifecycle, and ownership oracles.
- A compiler-check repair keeps authored entrypoints as roots, checks private helpers and generated declarations transitively, and moves cross-provider enrollment assertions to an existing runtime summary instead of importing several full schema-generic modules into one test.
- A commit task asks for authorization before committing and preserves unrelated changes.
- An instruction reduction names preserved decisions and canonical owners, deletes proven mirrors without archival copies, and leaves every reference resolvable.
- For plan-next reduction, compare the original and replacement on derived versus primary evidence, worker occupancy versus capacity, shared publication versus independent preparation, and intended-mechanism proof versus fallback success. Each distinction must remain actionable from the replacement alone; a shorter general statement is insufficient when it permits different decisions.
- A feedback-driven skill edit produces a standalone decision rule. Check both the reported failure and a valid contrasting case: the plan-next format correction must preserve explicit concurrency without imposing a planning format on unrelated answers or adding execution authority. Read the edited skill without its conversation history.
- An orchestration turn reconciles the mutable denominator against current state, keeps concurrent writers isolated, keeps shared integration serialized, and accepts only reviewed product outcomes at current HEAD.
- An orchestration supervisor distinguishes a sound wait, nonterminal lapse, repairable same-task Goal transition, lossless successor transition, user-action boundary, and terminal or obsolete boundary; classifies the program separately from the latest turn; nudges at most once per epoch; does not infer failure from omitted compact-turn items; waits through the nudge-triggered turn and one post-turn confirmation; preserves exact model, authority, state and ownership when replacing a stale-Goal task; verifies the successor's Goal and first sound decision before retargeting the monitor; asks for Goal UI action only when both safe same-task control and lossless replacement fail and the action is compatible with standing human instructions; reports only a confirmed failed nudge as a liveness blocker; disarms instead of polling when a blocked task has no authorized recovery or changing condition; and deletes its monitor only at an explicit terminal or obsolete boundary.
- A history recrawl publishes a durable source ledger before extended reading; evaluates whether multi-task acquisition can be partitioned across delegates before loading raw history into the parent; gives delegates disjoint read-only sources and durable evidence outputs; keeps source closure, decisive verification, authority, and synthesis with the parent; pages actual turns or uses role-aware local history; distinguishes human intent from summaries, delegations, automation, and assistant claims; dispositions every candidate; separates mechanical acquisition from higher-reasoning synthesis; stops when working context outruns the ledger; resumes from disk-backed state after compaction; runs a disconfirmation pass; and does not mutate product state before recall closes.
- A next-work plan exposes the complete runnable frontier without launching work. It visibly labels numbered nodes `SERIAL` and lettered sibling sets `PARALLEL`; the pattern may nest. Each ready lettered node is dispatchable in isolation because it states or inherits the exact context, constraints, deliverable, and acceptance condition it needs. Serial continuation sharing the same context may remain inline. Prerequisites prevent numbered checkpoints from becoming false barriers, and resource conflicts remain separate from causal ordering. For many-item, exact-count, all-remaining, or completion-horizon requests, every requested item appears exactly once. Check the observed 20-step history-repair drift and Rhythm Heaven three-chain follow-through: independently runnable audits or outcomes become context-complete sibling assignments instead of hidden chains, while the small Actions replay DAG still names its real publication and browser constraints compactly.
- Planning resolves ownership and design choices that available evidence can settle before returning actions. Contrast an inspectable shared-code owner with a decision requiring a future runtime result: the former is selected with evidence; the latter names the required result and decision criterion without blocking unrelated work or authorizing execution.

## Client checks

### Supervisor progress and observability regression cases

Source: DB/Tauri supervision in task `01a03d02-cb6a-73c1-9495-1d5937ed6772`, August 27, 2026. The user asked for stricter intervention after 24 supervisory turns without an intervention. The trace includes repeated reliance on active status, unreadable Tauri turns, an old usage-limit report after successful manual turns, and malformed supervisor tool calls. Canonical owner: global `supervise-orchestration`; no production ownership moves.

| Observed condition | Required decision | Contrasting case |
| --- | --- | --- |
| New turns and cursor revisions without decision-changing evidence | Preserve the unresolved progress boundary and verify current evidence | A fresh attributable test result resolves that boundary |
| Active Tauri task with repeated empty reads | One bounded alternative read; unresolved next boundary becomes an observability blocker, not another reassurance | A verified command still inside its bound warrants silence |
| Historical usageLimited report followed by successful manual work | Reconfirm current Goal control before using the old report to justify waiting; do not infer recovery | Fresh quota evidence with a future reset remains a legitimate external wait |
| Active retries or repeated prerequisite completion without advancing the outcome | Correct the stopping or acceptance contract without prescribing implementation | A bounded diagnostic with a changed hypothesis may continue |
| Repeated malformed calls or rejected truncated automation updates | Stop mutation attempts, preserve verified automation, report supervisory failure | One schema-checked correction that succeeds may complete accepted update |
| Shared dependency ready but authorized handoff absent | Intervene with the current owner when it blocks the related task | No recipient action required means no message |

Validation status: governing passages reviewed against these failure/contrast pairs; no independent behavioral trial or five-repeat comparison has been executed. Structural validator could not start because PyYAML was unavailable. Do not treat this record as measured behavioral improvement.

Run the routing cases in each client the team uses. Inspect the client-reported context where possible.

- Codex and clients with hierarchical `AGENTS.md`: confirm only ancestor scopes enter a path task.
- Gemini CLI: use `/memory list` and `/memory show` to measure whether repository-root launch concatenates every nested file.
- GitHub Copilot: verify repository skills are discovered from `.agents/skills`; add `.github/instructions` adapters only for a demonstrated path-scoping gap.
- Cursor: verify the installed version's nested `AGENTS.md` behavior before adding `.cursor/rules` adapters.
- Claude Code: keep `CLAUDE.md` as a thin adapter. Do not import conditional references from it because imports load into context.

Change one instruction group at a time, rerun the same cases, and compare results. Keep examples only when they correct an observed miss or encode a product requirement.

Do not count broader exploration or more test commands as success by themselves. Context-file studies found both behaviors can increase while correctness stays flat. Prefer gold tests or reviewer-scored outcomes, then use steps, tokens, latency, and diff size as secondary measures.
