# Agent context architecture

## Canonical layers

1. Root `AGENTS.md` contains short standing rules and a compact routing index.
2. Nested `AGENTS.md` files specialize standing rules for one directory tree.
3. `.agents/skills/<name>/SKILL.md` contains a coherent task workflow selected by standard `name` and `description` fields.
4. A skill's `references` directory contains detail loaded directly from that skill for a named condition.

Code, schemas, scripts, lint configuration, and tests remain authoritative for facts they can express. Instruction-maintenance references live with this skill; cross-cutting repository rules live in their narrowest applicable `AGENTS.md`.

## Portability policy

- Use plain Markdown `AGENTS.md` files and the Open Agent Skills `SKILL.md` format as canonical sources.
- Store repository skills under `.agents/skills`; keep each skill name equal to its directory name.
- Keep canonical frontmatter to open-standard fields. Do not add Cursor-only `paths` metadata to portable skills.
- Give every skill a precise description containing both its work and trigger.
- Keep traversal one hop deep: `SKILL.md` links directly to every conditional reference it owns.
- Treat client adapters as generated or mechanically checked discovery aids, never independent instruction stores.

## Routing policy

Critical project-specific triggers remain visible in the root routing index. Subtree rules live in the nearest nested file, repeatable workflows live in skills, and examples, catalogs, and uncommon cases live in one-hop references.

This balances two observed failure modes: eager guidance wastes attention, while unprompted skill discovery can miss important repository context. Do not move a critical trigger entirely behind a skill until evaluation shows reliable discovery.

## Client adapters

- Add `.cursor/rules` only for a demonstrated Cursor activation or path-scoping gap.
- A `CLAUDE.md` adapter may point to the small root file but must not eagerly import conditional references.
- Gemini may use `AGENTS.md` as its configured context filename; measure loaded memory before recursive eager loading.
- Copilot path instructions may bridge a demonstrated product gap. Portable rules remain in `AGENTS.md`; workflows remain skills.
- Generate or mechanically compare any adapter that repeats canonical text.

## Conflict and budget policy

- Explicit task instructions override repository defaults.
- The nearest nested `AGENTS.md` specializes the root contract.
- A skill adds workflow without silently contradicting standing path rules.
- A reference explains a conditional case and does not override its caller.
- Fix contradictions between canonical files instead of maintaining a permanent precedence workaround.
- State each rule once in its narrowest reliable owner.
- Keep examples that encode product behavior or correct an observed miss; prefer automation for mechanical rules.
- Prefer one coherent skill over tiny skills that always load together. Split only when triggers and references are substantially independent.
- Optimize for outcomes and relevant context, not a byte target.

## Evidence behind the design

Standards establish portable file shapes, not a universal loading algorithm. `AGENTS.md` supplies shared standing instructions with nested scope; Agent Skills supplies portable discovery metadata and progressive disclosure.

Vendor guidance converges on short standing context, task-specific procedures, links at the point of need, and evaluation after prompt changes. Cursor's field guidance recommends essential rules, recurrent-miss capture, and lint or canonical examples instead of copied style guides. OpenAI recommends removing prompt groups incrementally and measuring quality, tokens, and cost.

Two empirical results qualify that consensus:

- Vercel reported that an approximately 8 KB always-on documentation index reached 100% on its Next.js eval, while an implicitly discovered skill peaked at 79%; the skill was not invoked in 56% of baseline cases. An explicit root cue raised invocation above 95%. This supports the small routing index, not an always-on copy of all instructions.
- A controlled progressive-disclosure study found benefits as the corpus grew, but a second routing level did not improve results and sometimes hurt them. This supports direct skill-to-reference links and no deeper chains.
- A study of 679 public rule files, 25,532 extracted rules, and more than 5,000 SWE-bench runs found a 7 to 14 percentage-point gain from adding rules, but random rules performed about as well as expert rules. Negative constraints were the only individually beneficial rule type. Positive guidance such as generic style directives hurt. Keep reviewer-verifiable prohibitions in instructions; express desired shapes through types, lint, tests, generators, and nearby examples.
- CTXbench evaluated 138 tasks from 12 repositories. Human-written context improved success by 2.4% on average, which was not statistically significant, while adding 3.34 steps and as much as 19% cost. Generated context increased GPT-5.2 reasoning tokens by 22% on SWE-bench. Do not generate broad repository summaries merely because a client supports them.
- A separate 288-run Codex and Claude ablation found no measurable correctness change between no context, always-on context, and selective retrieval, bounded to less than 10 to 15 percentage points. Context can prevent waste, but it cannot supply missing implementation skill.
- A preregistered context experiment matched whole-file results with compressed context at roughly one third of the tokens. Successful issues used 19K context tokens instead of 94K. It also observed about 9% outcome flips between byte-identical temperature-zero runs. Treat small single-run gains as noise.
- An AAIF field test initially made a 12-line `AGENTS.md` look 44% slower and 41% more expensive. Five repeats reversed the conclusion. Median improvements were 27% wall time, 24% credits, and 26% smaller diffs on its ambiguous task, with 9 to 10% gains on its multi-file task. This is one repository, but it demonstrates why instruction evaluations need repeats and distribution reporting.
- A study of 100 popular repositories found lint leakage in 62% of agent configuration files, context bloat in 42%, and skill leakage in 35%. Bloat, skill leakage, and conflicting instructions often appeared together. This repository therefore keeps mechanical TypeScript formatting in lint and the TypeScript skill rather than repeating it in root context, and keeps instruction-maintenance policy out of ordinary coding sessions.
- ABTest turned 400 developer-confirmed agent failures into 647 repository-grounded cases. Across Claude Code, Codex CLI, and Gemini CLI, it flagged 1,573 anomalies; manual review confirmed 642 new failures, for 40.8% precision. Real user corrections are a better source of instruction evaluation cases than invented compliance quizzes.

## Practitioner evidence

First-hand workflows explain where persistent instructions stop helping:

- Kent C. Dodds documented a Cursor and GPT-5.4 implementation that used investigation, diagnosis, alternatives, a written plan, implementation, verification, and deployment. It needed about 20 minutes of his attention. Cursor's separate review then caught a real falsy-zero timestamp bug. The reusable lesson is to keep task decisions in a task plan and require an independent review pass; neither belongs in permanent repository context.
- Matt Pocock's public skills separate user-invoked orchestration from model-invoked engineering discipline. His repository stores issue-tracker and domain choices as per-repository configuration instead of hard-coding them into every workflow. That supports explicit activation for consequential processes and small model-discovered skills for reusable checks.
- Simon Willison repeatedly points agents at an existing project's test patterns or a language-independent conformance suite. Examples and executable contracts carry more implementation information than an abstract style paragraph and give the agent a way to repair its own output.

Theo Browne, Kent C. Dodds, and Matt Pocock provide useful first-hand workflow evidence, but only Kent's cited account includes even a rough time figure, and none of these three has published a controlled context-file ablation I could verify. Their practices should shape evaluation cases, not be presented as numerical proof.

These are directional findings from particular tasks and harnesses, not universal laws. Re-run repository evaluation cases when changing routing.

## Maintenance loop

1. Observe a representative task and its loaded context.
2. Identify a missed decision, false trigger, conflict, or irrelevant instruction.
3. Change the narrowest canonical owner.
4. Re-run the case and compare adherence, task quality, context use, and tool cost.
5. Update [coverage.md](coverage.md) whenever knowledge moves.

## Editing these instructions

- Keep root `AGENTS.md` limited to repository-wide hard constraints, exact commands, ownership facts, and routing cues.
- Put directory invariants in the nearest nested `AGENTS.md`.
- Put repeatable task procedures in `.agents/skills/<name>/SKILL.md`.
- Put conditional detail in a skill's `references` directory and state exactly when to read it.
- Prefer lint, tests, types, schemas, and generators over prose for rules they enforce.
- Keep generated and user-authored changes distinguishable in summaries.

## References

- [AGENTS.md](https://agents.md/)
- [Open Agent Skills specification](https://agentskills.io/specification)
- [Agent Skills authoring guidance](https://agentskills.io/skill-creation/best-practices)
- [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model)
- [Cursor Agent Skills](https://prod.cursor.com/docs/skills)
- [Cursor agent best practices](https://cursor.com/blog/agent-best-practices)
- [Vercel Next.js agent eval](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
- [Progressive disclosure study](https://arxiv.org/abs/2607.17598)
- [Guardrails versus guidance study](https://arxiv.org/abs/2604.11088)
- [CTXbench context-file evaluation](https://arxiv.org/abs/2602.11988)
- [Two-agent context ablation](https://arxiv.org/abs/2607.27250)
- [Coding-agent context compression study](https://arxiv.org/abs/2607.09691)
- [AAIF five-run `AGENTS.md` benchmark](https://aaif.io/blog/measuring-agents-md-what-five-runs-show-that-one-doesn-t)
- [Configuration-smell study](https://arxiv.org/abs/2606.15828)
- [ABTest coding-agent behavior study](https://arxiv.org/abs/2604.03362)
- [Kent C. Dodds' Cursor implementation account](https://kentcdodds.com/blog/implementing-hybrid-semantic-lexical-search)
- [Matt Pocock's engineering skills](https://github.com/mattpocock/skills)
- [Simon Willison's agentic engineering patterns](https://simonwillison.net/guides/)
- [Anthropic skill engineering](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [GitHub Copilot customization](https://docs.github.com/en/copilot/concepts/agents/code-review#choosing-between-custom-instructions-agentsmd-and-skills)
- [Gemini hierarchical context](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html)
