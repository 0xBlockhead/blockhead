# Blockhead Schema Plan

Status: iteration artifact, not production schema. Goal: compact starting point for recurring schema coverage passes. It should guide new `src/schema/**`, `src/resolvers/**`, `src/sources/**`, view, and test work without letting agents turn provider payloads, UI labels, or human categories into canonical entities.

## Slash Goal

```text
/goal Iterate on Blockhead's mock schema as a clean, entity-focused design artifact. Keep SCHEMA.md limited to real modelable domain/source/local entities with selectors, fields, source fulfillment, the view sections/subviews for that exact entity, and short research notes specific to that entity. Do not add process, audit, plan, coverage, matrix, fixture, gate, decision, pass, worker, loop, or methodology rows as schema entities. Use SCHEMA-PLAN.md only for methodology, research loop, references, backlog, and rejected process ideas. For each iteration, read the relevant repo schema/source/resolver/view context and primary protocol/source documentation, admit only entities with concrete identity and sourceability, demote weak concepts into claims/observations/notes, delete junk, and preserve a concise schema that can guide future implementation.
```

## Notation

`E Name :: selectors ; fields ; notes`

Cardinality: `!` = `One`, `?` = `ZeroOrOne`, `*` = `ZeroOrMany`, `+` = `Many`, `0` = `Zero`.

Field forms: `p:type` primitive, `$:Entity` single ref, `$$:Entity` list ref. Conditional fields use `when field=value`. Source policy uses `@sourceA>sourceB`. Source/evidence annotations use `avail:{complete|partial|derived|unsupported}`, `std:{final|review|draft|registry|implementation}`, `method:{spec|registry|indexer|rpc|crawler|manual}`, `pushdown:{select|count|live|none}`, and `truth:{canonical|observed|methodology|mirror|local}`. Relationship annotations use `rel:{canonical|asserted|derived|observed|local|view}` and `evidence:{inline|claim|timestamp|verification|none}`; `evidence:none` is allowed only for canonical protocol refs or local Blockhead refs. Timestamp rows use `timestampMs! p:number` plus source/methodology when source-specific. Seed fulfillment rows use `SF Entity.field :: source attrs, source attrs`. Seed view rows use `VO View :: group/subsection -> $$field`.

Selector rule: selectors are the only identity contract. Provider ids are registry/source references unless the provider defines the domain namespace itself.

Client rule: every list meant for product browsing must be consumable through `subscribe`/`proxy` as field rows with source priority, optional `count`, nested selections, resolver pushdown where possible, and no view-side semantic sorting.

## Hard Invariants

1. Domain entities represent protocol/state/content/service facts that exist outside Blockhead.
2. `Blockhead*` entities represent local product state: authority, sessions, drafts, rooms, dashboards, source preferences, notifications, workspace state.
3. Provider/vendor names live in `Source`, `SourceClaim`, `RegistryReference`, resolver names, or source metadata, not entity type names.
4. A metric, status, price, gas value, count, health value, balance snapshot, fetched metadata, or indexer observation lives on a timestamp/block/coordinate row.
5. A source classification is a claim until a protocol artifact proves it.
6. `Layer`, `project`, `ecosystem`, `asset`, `agent`, `bridge`, `position`, `event`, and `metadata` are not enough to create a root entity.
7. Write flows always split `Intent -> Readiness -> Quote/Order -> Route -> Payload -> Simulation -> Submission -> Outcome`.
8. Authority is local and scoped. Domain account identity never implies signing power.
9. Content identity is content address or canonical protocol id, not gateway URL, preview URL, image URL, or app route.
10. Conditional fields model mechanically discriminated protocol variants, not tags.

## Agentic Research Loop

Method basis: iterative ontology development, competency questions, and reuse of existing vocabularies from [Ontology Development 101](https://protege.stanford.edu/publications/ontology_development/ontology101.pdf); provenance/derivation/reproducibility discipline from [W3C PROV](https://www.w3.org/TR/prov-overview/); metadata, provenance, quality, versioning, unavailable-data, API, identifier, coverage, and enrichment practices from [W3C Data on the Web Best Practices](https://www.w3.org/TR/dwbp/); validation-as-contract discipline from [W3C SHACL](https://www.w3.org/TR/shacl/); identity/unity/rigidity/dependence critique from OntoClean literature.

Loop artifacts are prose, source excerpts, local diffs, fixtures, and tests. They are not schema entities. Only real protocol/state/content/service/local/source records may enter `Entity ... ::` definitions.

Slice intake rotates across: existing implemented debt, high-value missing domains, one narrow protocol drilldown, one wide ecosystem sweep, one cross-domain comparison, one source/indexer prior-art pass, one implementation/client pass, one adversarial deletion pass.

For each slice, run:

1. `ScopeScout`: write 3-7 competency questions that the product should answer, the exact route/view or resolver use case, and the stop boundary. Reject slices whose only motivation is market rank, provider category, UI grouping, or vague ecosystem language.
2. `PrimarySourceScout`: gather primary specifications, reference implementations, registries, explorer/indexer/API docs, source schemas, and at least one concrete fixture or example object. Prefer protocol specs and code over dashboards; dashboards are source claims unless they define the domain namespace.
3. `ImplementationRealityScout`: inspect current `src/schema/**`, `src/sources/**`, `src/resolvers/**`, `src/client/**`, route/view anchors, tests, and constants. Record whether the repo already has an entity, projection, source, resolver facet, route, or test for each competency question.
4. `SourceFeasibilityAnalyst`: for every candidate field/list, document selectors accepted by each source, returned fields, pagination/count/live support, freshness clock, provenance/methodology text, auth/env needs, CORS/proxy status, and known unavailable facts. Unsupported fields stay absent from resolver facets.
5. `EntityAdmissionCritic`: admit a root entity only if it has real instances outside Blockhead, a stable identity criterion, lifecycle independent of a provider row or view, discoverable examples, and sourceable fields. Otherwise demote it to a field, enum, claim, timestamp observation, relation row, local `Blockhead*` state, or prose-only rejected alternative.
6. `OntologyModeler`: synthesize selectors first, then fields, cardinalities, conditional `when` variants, timestamp/block/coordinate rows, claims, local state, and refs. Use existing schema names and primitives; add no wrapper/helper abstractions to methodology.
7. `RelationshipCritic`: classify each `$`/`$$` edge as canonical protocol state, source assertion, derived equivalence, observed behavior, local product state, or view grouping. Canonical edges need protocol evidence; asserted/derived/observed edges need claim, timestamp, verification, or concrete source support; view grouping never creates ontology.
8. `PriorArtComparer`: compare against established APIs/indexers/registries for the same slice: naming, selectors, field availability, pagination/count semantics, status vocabulary, method clocks, and missing dimensions. Adopt only sourceable structure, never dashboard taxonomies as truth.
9. `ClientContractAnalyst`: verify the shape can be consumed by `src/client` selection, `defaultSources`, conditional fields, `subscribe`/`proxy`, field rows, list counts, nested selections, live updates, and `ResourceBoundary`-style rendering. Every browseable `$$` list gets ordering source, count behavior, empty-state semantics, and latest/history display policy.
10. `AdversarialRedTeam`: try to delete or demote each new entity/field/ref using fallacy checks: provider-id leakage, mutable handle as identity, snapshot scalar on parent, rank/category/root confusion, cross-domain false analogy, local UI concept as protocol fact, missing source, unverifiable relation, cardinality overclaim, and timestamp collapse.
11. `SchemaSteward`: merge only the surviving compact entity definitions plus colocated source fulfillment, view organization, proof gates, implementation starting point, and rejected alternatives. Preserve names that describe what the thing is in its domain.
12. `VerticalProofAgent`: before broad rollout, implement or specify one thin vertical proof: schema selector/cardinality test, resolver/source fixture or documented source gap, source env/CORS check where relevant, subscribe/proxy nested selection test for browseable lists, and one route/view proof for visible surfaces.

Merge contract per slice:

- `Evidence packet`: competency questions, primary specs/ref impls, source/indexer/registry docs, concrete examples, unavailable facts, and confidence.
- `Model packet`: admitted entities only, selectors, field cardinalities/types, conditional variants, timestamp/claim/local split, relationship validity, and rejected alternatives.
- `Source packet`: source priority, selectors, returned fields, freshness, count/list/live support, CORS/proxy status, auth/env, and source conflicts.
- `Client packet`: route/view sections, many-ref subsections, latest/history surfaces, nested selection shape, count semantics, ordering, empty states, and live behavior.
- `Proof packet`: tests/fixtures/e2e targets and any source gaps that intentionally block implementation.

Final gates for every future pass:

1. Entity gate: every entity is a real domain/local/source record with instances, identity, lifecycle, examples, and sourceability.
2. Selector gate: every selector is a real protocol/registry identifier or local Blockhead id; derivable identifiers use pure selector derivation instead of duplicated provider logic.
3. Timestamp gate: every observation, source classification, metric, count, balance, health value, preview, fetched metadata parse, and current status is on a timestamp/block/coordinate row unless the protocol id itself fixes the value.
4. Source gate: unsupported facts are absent resolver facets or documented unavailable facts, not `Zero` cardinality, placeholder fields, or guessed values.
5. Cardinality gate: `Zero`, `One`, `ZeroOrOne`, `Many`, and `ZeroOrMany` are domain contracts, not source-support guesses.
6. Relationship gate: every `$`/`$$` ref has canonical, asserted, derived, observed, local, or view-grouping justification; weak edges are claims/observations or deleted.
7. Client gate: every browseable `$$` field states row availability, count behavior, nested selection behavior, ordering source, live/update policy, and empty-state behavior.
8. Naming gate: names say what the thing is in its protocol/domain; avoid `Coverage`, `Decision`, `Plan`, `Fixture`, `Gate`, `Matrix`, `Template`, `Class`, and `Type` roots unless those are real domain artifacts with externally existing instances.
9. Fallacy gate: do not infer roots or relationships from shared labels, provider categories, app pages, marketing terms, market-cap rank, explorer tabs, or UI grouping.
10. Deletion gate: every pass must remove, demote, or mark rejected at least one weak candidate unless all candidates survive with primary-source evidence and client proof.

## Iteration Log

- Pass 01, evidence/source grammar: checked local `EntityDefinition`/field cardinality/conditional field types, source provider/origin/env gating, resolver field facets, and CAIP-2/10/19/25/122. Change: add evidence/source annotations, `StandardReference`, `SpecTracker`, source availability fields, selector canonicalization fields, and wallet/authentication rows that do not collapse into account identity.
- Pass 02, network/system/deployment split: checked existing `EvmRollup` schema, L2Beat resolver/source shape, Superchain resolver/source shape, OP Stack rollup/derivation/fault-proof/superchain-registry docs, and Ethereum rollup docs. Change: keep CAIP-2 networks stable, move registry/source classifications into deployment claims/timestamp rows, and model settlement, DA, sequencer, proof, bridge path, forced inclusion, and upgrade authority separately.
- Pass 03, assets/tokens/RWA: checked current coin/native asset/Cosmos denom/EVM NFT schema, constants resolver asset construction, ERC-20/721/1155/4626/2981/3525/3643/6909, CAIP-19, and Solana Token-2022. Change: move supply/balance/allowance to timestamp observations, split asset definition/instance/class/object, add token interface conformance, program extensions, ERC-3525 slots, vault accounting, royalty rules, compliance registries, issuer powers, and denom traces.
- Pass 04, EVM/account/invocation: checked current `EvmTransaction`, `EvmUserOperation`, `EvmContract`, `BlockheadSessionAction`, EIP-1193/2718/1559/4844/712/1271/4337/7702, and Solidity ABI. Change: split wallet RPC transport from typed payloads, transaction envelopes, signatures, receipts, ABI members, signature verification, account snapshots, 4337 validation/deposit/stake, and 7702 authorization tuples.
- Pass 05, non-EVM invocation: checked current Solana/Cosmos/Polkadot/NEAR/UTXO schema and resolvers, Solana transaction docs, Cosmos SDK transaction/protobuf docs, Polkadot extrinsic spec, NEAR transaction lifecycle docs, and BIP-174 PSBT. Change: add architecture-native transaction rows for Solana instructions/account metas, Cosmos protobuf messages/auth info, Substrate runtime calls/mortality, NEAR receipts/outcomes, UTXO inputs/outputs, and PSBT key-value maps.
- Pass 06, DeFi/intents/orders: checked market constants/schema/resolvers, swap quote schema, bridge route step schema, ERC-7683, UniswapX, CoW signing schemes, LI.FI API docs, Chainlink data feeds, and ERC-4626 notes from pass 03. Change: add generic position spine, timestamped position/vault state, solver-facing orders with dependency/assumption/payment rows, quote requests, route alternatives, fills, and explicit oracle round freshness.
- Pass 07, agents/tools/payments: checked local agent conversation rows, EIP-8004 scan resolver/source shape, MCP tools/resources/prompts/authorization, A2A tasks/messages/artifacts/agent cards, ACP sessions/permissions/files/terminals, x402 overview, and ERC-8004. Change: split agent service discovery, protocol endpoints, agent cards, tasks, local conversations, MCP capabilities, tool invocations, permission gates, model calls, trust signals, validation requests, and payment challenges.
- Pass 08, social/identity/content: checked local ActivityPub/ATProto/Farcaster/Lens/Nostr/IPFS/Swarm/XMTP/RSS rows, ActivityPub, ATProto repository, Nostr NIP-01, Farcaster accounts/messages/channels, DID Core, VC Data Model, IPFS CID, and XMTP protocol docs. Change: add DID/VC proof-vs-truth split, content-address/retrieval/media rows, social protocol/profile/object/relation spine, and protocol-native rows for repository records, signed events/messages, ActivityStreams objects, and encrypted messaging.
- Pass 09, client/resolver/source mechanics: checked `src/client/$subscribe.svelte.ts`, `src/client/$client.svelte.ts`, `src/client/$proxy.svelte.ts`, `src/schema/$schema.ts`, and `src/resolvers/$resolvers.ts`. Change: keep client/resolver/source mechanics as implementation proof obligations tied to real `subscribe`/`proxy` behavior, not schema entities.
- Pass 10, adversarial consolidation/product proof: checked pass numbering, timestamp/search red flags, route navigation, `BlockheadSessionAction`, `BlockheadSocialPostSession`, and `BlockheadAgentConversation`. Change: fix repo-anchor naming, add final anti-fallacy gates, and keep backlog focused on current product-local debt and route coverage.
- Pass 11, source fulfillment matrix: checked `src/sources/**` provider/source enums and resolver architecture. Change: document entity/field-level source fulfillment beside entity definitions so fields can list candidate resolvers, indexers, registries, RPCs, and unavailable facts without polluting domain identity.
- Pass 12, view organization matrix: checked current `NetworkView`, `EvmNetworkView`, route e2e selectors, and git history for network view work. Change: document compact network/entity view layouts keyed by many-cardinality refs without modeling view groupings as entities.
- Pass 13, top-coin ecosystem boundary: checked CoinGecko top market-cap page for current large networks and repo `EntityType` coverage. Change: widen fair-game network families to BNB/Tron/Hyperliquid/Zcash/Stellar/Cardano/TON/Sui/Hedera/Avalanche/Bittensor/Worldcoin/Cronos/Canton/Algorand/Aptos/Kaspa/ICP/Tezos beyond existing EVM/BTC/Solana/Cosmos/Substrate/NEAR/Filecoin/Monero.
- Pass 14, execution environment drilldown: checked EVM ABI/opcode/source bundle rows, Sui object model, Aptos transactions/states, TON TVM docs, Filecoin message spec, and local execution entities. Change: add VM/module/operation/opcode/gas/source-map rows that can drill from verified source to bytecode operations across EVM, MoveVM, TVM, WASM, AVM, Soroban, Plutus, Michelson, and Filecoin actors.
- Pass 15, Bitcoin side channels: checked local Lightning/Elements/Litecoin MWEB/Cashu/Payjoin schemas and MempoolSpace/Amboss/LND sources. Change: add channels, mints, federations, blinded outputs, peg flows, offers/invoices, liquidity ads, and privacy notes without treating them as L1 blocks.
- Pass 16, Ethereum L2 and DA protocols: checked OP Stack docs from prior pass, L2Beat/Superchain sources, Blobscan, Beacon, MEV relay, and EIP-4844 rows. Change: add rollup stack components, inbox/outbox/forced inclusion, DA publication, blob sidecars, verifier games, and shared sequencing/finality relations.
- Pass 17, Move ecosystems: checked Sui object model and Aptos transaction/state docs plus local Move payload placeholder. Change: add Move package/module/resource/object/event/function rows and split Aptos account resources from Sui versioned objects.
- Pass 18, account abstraction and wallet standards: checked local 4337/7702/session/wallet rows, EIP-1193/CAIP-25/CAIP-122 prior sources. Change: add wallet capability, permission, session, SIW* authentication, delegated account, passkey, multisig, and policy rows.
- Pass 19, token and asset standards expansion: checked local asset/NFT/CashToken/BCMR/Elements rows and ERC/Solana Token-2022 prior sources. Change: add token program, mint authority, metadata authority, SPL extensions, CashTokens, HTS tokens, Stellar assets/trustlines, XRPL issued currencies/NFTs/AMMs, Cardano native policies, and RWA reserve attestations.
- Pass 20, DeFi/indexer prior art: checked DefiLlama, Dexscreener, CoinGecko, CoinMarketCap, TradingView, The Graph, Dune, Allium, Lifi, and local market/quote rows. Change: add indexer methodology rows for TVL/volume/prices/routes/portfolio values and explicit field-source fulfillability.
- Pass 21, Solana narrow pass: checked local Solana schemas, Helius/Solana RPC sources, Solana transaction docs from prior pass, and Token-2022. Change: add slots/epochs/vote accounts/address tables/compute budget/priority fees/program deployments/IDLs and view sections.
- Pass 22, Cosmos/IBC narrow pass: checked local Cosmos rows, CometBFT/Cosmos SDK/chain-registry sources, SDK transaction docs, and ICS-20 notes. Change: add IBC clients/connections/channels/packets/denom traces, modules, governance proposals, validators, staking/delegations, and CosmWasm contracts.
- Pass 23, Substrate narrow pass: checked local Polkadot rows, SubstrateSidecar/Subscan/Polkadot sources, runtime metadata and extrinsic docs. Change: add runtime specs, pallets/calls/storage/events, referenda, parachains, XCM messages, eras/sessions, validators/nominators, and view sections.
- Pass 24, privacy networks narrow pass: checked local Monero/Zcash/Litecoin MWEB/Dogecoin auxpow rows and daemon/RPC sources. Change: add ring members/key images/shielded pools/actions/nullifiers/anchors/viewing keys/auxpow and privacy-preserving source limitations.
- Pass 25, storage/DA networks narrow pass: checked local Filecoin/ZeroG/IPFS/Swarm schemas and Filecoin message spec. Change: add storage deals, sectors, proofs, retrieval markets, DA quorums, erasure chunks, content-address lineage, and proof verification rows.
- Pass 26, social/content source fulfillment: checked local social/content views and sources. Change: add source fulfillment for ActivityPub/Farcaster/Lens/ATProto/Nostr/X/Reddit/RSS/YouTube with metric snapshots and thread sections.
- Pass 27, bridges/interoperability pass: checked local bridge route/transaction/CCTP/Lifi/CoinBridgeCapability rows and CAIP/IBC notes. Change: add bridge protocol path, message, transfer, attestation, relayer, finalization, refund, liquidity, and risk/source rows.
- Pass 28, governance/spec trackers: checked local proposal/upgrade schemas and EIP/BIP/CAIP/Cosmos ADR/Solana SIMD/Polkadot RFC/Filecoin FIP/Zcash ZIP/Litecoin LIP/Dogecoin DIP sources. Change: add standards/proposals/upgrades as first-class spec-tracked entities connected to protocol deployments and view sections.
- Pass 29, operations/opcodes cross-domain: checked local ABI/selector/topic/error/source-bundle rows and execution docs. Change: add operation catalogs, verified source mappings, stack effects, gas schedules, verifier rules, syscall/host function boundaries, and trace-frame sections.
- Pass 30, account/identity cross-domain: checked account rows across EVM/Solana/Cosmos/Substrate/NEAR/Hedera and DID/ENS/social identity rows. Change: add canonical account spine, address scheme, credential/auth bindings, key material, rotation, revocation, and source-specific alias claims.
- Pass 31, market/portfolio cross-domain: checked market/position rows and indexer sources. Change: add portfolio holdings/valuations, exposure groups, risk/health, realized/unrealized PnL, income streams, and price source comparison rows.
- Pass 32, observability/proof pass: checked client resolver/count/live contracts and route e2e conventions. Change: require CORS/source-origin proof, field availability fixtures, route layout proof, count proof, live-update proof, and stale-source detection in implementation.
- Pass 33, BNB/Cronos/Avalanche EVM-family pass: checked top-coin fair-game boundary and EVM/network-stack rows. Change: model these as EVM-family networks with chain-specific consensus/validator/staking/governance and explorer/source rows, not as generic EVM clones.
- Pass 34, TON/Hedera/Stellar/XRPL pass: checked TON/Hedera official docs and XRPL/Stellar docs/search targets plus top-coin list. Change: add non-EVM account/object/token/operation rows for TVM cells/messages, Hedera entities, Stellar trustlines/operations/Soroban, and XRPL ledger entries/transactions/amendments.
- Pass 35, Cardano/Algorand/Tezos pass: checked Cardano official time/eUTXO determinism docs and Algorand/Tezos source targets. Change: add eUTXO validity intervals/scripts/datums/redeemers, Algorand ASA/app/box/TEAL, and Tezos/Michelson operations/contracts/bakers.
- Pass 36, ICP/Kaspa/Bittensor/Quilibrium/Logos pass: checked local ICP gap, Bittensor/Quilibrium/Logos rows, and top-coin fair-game boundary. Change: add subnet/canister/certified state, blockDAG/GHOSTDAG, subnet neurons, frames/shards, zones, and source limitations.
- Pass 37, metadata/media/content-address pass: checked local IPFS/Swarm/Media/Url rows and content sources. Change: add CAR/IPLD DAG nodes, MIME parse evidence, media variants, moderation labels, NFT/social/content cross-links, and retrieval observations.
- Pass 38, security/risk/compliance pass: checked asset restrictions, regulated assets, bridge risks, permissions, and source claims. Change: add audit, exploit, bug bounty, sanctions/compliance, proof-of-reserve, issuer attestation, oracle deviation, and emergency authority rows.
- Pass 39, temporal/history pass: challenged every current-looking scalar. Change: add block/slot/epoch/round/height coordinate variants, observation clocks, source clocks, validity intervals, lifecycle transitions, and stale/latest view rules.
- Pass 40, view synthesis pass: checked many-cardinality refs and view conventions. Change: add compact default section/subsection organizations for network, account, asset, market, protocol, transaction, contract, social profile/object, agent service, source, and spec pages.
- Pass 41, source comparison synthesis: checked local source catalog and indexer prior art. Change: document per-entity source candidate groups and comparison methodology, including registry/RPC/indexer/explorer/API precedence and known unavailable facts.
- Pass 42, final adversarial pass: re-scanned `SCHEMA.md`, local entity/source/view surface, and subagent findings. Change: consolidate rows, update backlog, and add pass-42 validation targets for future implementation.
- Pass 43, route proof matrix: checked route/view/source anchors and `ResourceBoundary` proof conventions. Change: require route/list/entity/timestamp/source priority proof so every visible route can be audited against schema fields and resolver facets.
- Pass 44, list field coverage: challenged every browseable `$$` field. Change: document availability/count/nested-selection/live/staleness contracts and ban local list semantics when source/resolver logic can own them.
- Pass 45, conditional field audit: checked `_conditionalFields_verify` and `when` semantics. Change: document conditional-field behavior for inactive values, selected-field shape, and proof requirements.
- Pass 46, source evidence UX: checked `defaultSources`, explicit route source use, and source health surfaces. Change: add evidence display rows for source method, freshness, conflicts, unavailable facts, and CORS/origin failure UX.
- Pass 47, governance lifecycle: checked existing Cosmos/Polkadot/spec proposal anchors. Change: add proposal phases, votes, delegation, tracks, parameter changes, treasury spends, and forum/status observations.
- Pass 48, spec tracker depth: challenged status as a scalar. Change: add spec proposal status observations, merged commits, editors, implementation links, and freshness/source policy.
- Pass 49, security audit surface: checked risk/compliance gaps. Change: add audits, findings, exploit incidents, exploit transactions, bounty programs, and bounty reports.
- Pass 50, compliance/reserve attestations: checked regulated-asset and source-claim gaps. Change: add compliance lists/list entries, proof-of-reserve attestations, emergency authority, and sanctions/source caveats.
- Pass 51, oracle methodology: checked oracle feed and market timestamp rows. Change: add feed methodology, deviation observations, stale detection, quorum/heartbeat, and reference-price comparisons.
- Pass 52, market/indexer methodology: checked market/portfolio/indexer sources. Change: add market methodology, source observations, source comparisons, wash-trade policy, indexer lag, and provider asset ids as aliases.
- Pass 53, bridge lifecycle: checked bridge route/transaction rows and cross-chain source classes. Change: add bridge transfer lifecycle, messages, attestations, relayers, refunds, and failure phases.
- Pass 54, intent/payment lifecycle: checked local action/session/payment anchors. Change: add durable intent and payment lifecycle rows from readiness through settlement/failure.
- Pass 55, source conflict ledger: checked comparison rows. Change: add conflict snapshots keyed by entity/field/selector/time so conflict handling is data, not ad hoc UI behavior.
- Pass 56, restaking/shared security: checked restaking and shared-security protocol classes. Change: add restaking protocol, AVS, operator, operator stake, shared-security consumer, validator lease, and slashing event rows.
- Pass 57, modular DA depth: checked Celestia DA docs and existing DA/blob rows. Change: add DA protocol, namespace, commitment, share, namespace proof, and sampling observation rows.
- Pass 58, rollup derivation/preconfirmation: checked scaling deployment rows. Change: add derivation steps, derivation inputs/outputs, shared sequencer deployments, members, and preconfirmations.
- Pass 59, proof systems/prover markets: checked SP1 docs and verifier/prover source classes. Change: add proof systems, verifier contracts, verification keys, proof artifacts, prover networks, and prover jobs.
- Pass 60, TEE/confidential compute: checked emerging verifier/attestation surfaces. Change: add TEE attestation, confidential-compute deployment, key-release policy, and enclave measurement rows.
- Pass 61, FHE/encrypted state: checked confidential-runtime modeling gaps. Change: add FHE circuits, encrypted state objects, encrypted events, and access-policy rows.
- Pass 62, MPC/threshold systems: checked bridge/wallet key-management gaps. Change: add MPC ceremonies, threshold key sets, participants, rotations, and signing observations.
- Pass 63, wallet auth/passkeys/session keys: checked local wallet/session rows. Change: add wallet auth methods, passkey credentials, session-key grants, spend limits, scopes, and revocation selectors.
- Pass 64, cross-chain messaging protocols: checked bridge path/message gaps. Change: add cross-chain message protocol, message, delivery, attestation, replay protection, fee model, and relayer source rows.
- Pass 65, Bitcoin covenant/script artifacts: checked side-channel and UTXO gaps. Change: add covenant artifact, tapscript leaf, script template, spend policy, and covenant spend observations.
- Pass 66, runtime host functions: checked VM/opcode rows. Change: add host function/module/signature/gas/determinism boundary rows for non-EVM runtimes.
- Pass 67, social/content proof surfaces: checked social/content routes. Change: add route proof seeds for protocol-native ids, source mirrors, thread metrics, content retrieval, and stale/failure states.
- Pass 68, local product proof surfaces: checked `~/` routes and local authority rows. Change: add local session/action/dashboard/source-management proof seeds and visible stale/failure state requirements.
- Pass 69, source origin/CORS proof: checked browser source policy. Change: add source-origin evidence rows connected to source health, endpoint failure, proxy policy, and route proof.
- Pass 70, timestamp view coverage: challenged latest-only views. Change: require latest/history view handling and observed-at/source-clock requirements for every timestamp family.
- Pass 71, cardinality audit: challenged `Zero`, `Many`, and optional scalars. Change: add cardinality audit rows with domain-impossibility, source-partial, conditional, and unsupported classifications.
- Pass 72, entity view coverage: checked entity type to route/view reachability. Change: require entity-view reachability, nested selection proofs, and route-source drift checks.
- Pass 73, proof gate registry: checked proof gates. Change: require compact proof evidence tying entity/field/source/view/route to unit/e2e/CORS/manual checks.
- Pass 74, v11 adversarial consolidation: merged subagent findings and fresh DA/zkVM references. Change: keep new rows as overlays that deepen existing domains without creating marketing-category roots.
- Pass 75, consensus protocol depth: checked thin `ConsensusMechanism` shape. Change: add consensus protocol/deployment/fork-choice/finality rows and keep network upgrades separate from consensus activation.
- Pass 76, validator economics: checked validator rows across beacon/Cosmos/Substrate/etc. Change: add validator set snapshots, lifecycle events, stake positions, rewards, and slashing incidents as timestamp/coordinate rows.
- Pass 77, node software/client implementations: checked source/provider enums and network client gaps. Change: add node software projects, releases, network client implementations, and client distribution observations.
- Pass 78, p2p topology: checked libp2p concepts and current network timestamp counts. Change: add node identities, node observations, p2p protocols, peer sessions, gossip topics, and gossip messages.
- Pass 79, mempool propagation: checked txpool timestamp rows. Change: add mempool transaction observations, snapshots, and transaction propagation observations keyed by node/source/time.
- Pass 80, orderflow/MEV: checked Builder API and MEV relay anchors. Change: add orderflow endpoints, private submissions, bundles, builder bids, relay slot observations, and proposer-builder registrations.
- Pass 81, archive/indexer lineage: checked source/indexer rows. Change: add indexer datasets, derivation runs, archive node snapshots, and data lineage claims.
- Pass 82, privacy selector semantics: checked account/profile/content linkage risk. Change: add privacy scopes that distinguish public linkability, local-only knowledge, and unlinkability assumptions.
- Pass 83, selective disclosure: checked VC 2.0. Change: add disclosure policies and normalized disclosed claim rows for credential presentations.
- Pass 84, zk identity/nullifiers: checked identity-proof ecosystems. Change: add ZK identity proofs, nullifier uses, anonymous credential schemes, and replay/double-use proof hooks.
- Pass 85, credential status/revocation: checked VC status and revocation requirements. Change: add credential status observations, revocation accumulator roots, and active/revoked/suspended proof fixtures.
- Pass 86, DID method/resolution: checked DID rows. Change: add DID method rows and resolution records with resolver version, metadata, document hash, and error surfaces.
- Pass 87, key lifecycle/account binding: checked signature/session/auth rows. Change: add verification methods, key rotation events, and account binding proofs separate from identity claims.
- Pass 88, mutable social handles: challenged handle-as-selector. Change: add handle claim observations keyed by protocol/handle/time/source.
- Pass 89, provenance chain: checked content/resource/model-output gaps. Change: add provenance events for media, datasets, source bundles, model outputs, and metadata transformations.
- Pass 90, content authenticity: checked C2PA-style manifest needs. Change: add content authenticity manifests and media derivative lineage.
- Pass 91, dataset/license identity: checked content/data licensing gaps. Change: add datasets, dataset snapshots, license documents, and data license grants.
- Pass 92, AI/data-use policy: checked crawler consent and training-use rights. Change: add AI use policies, attribution requirements, and retrieval policy observations.
- Pass 93, attestation split/revocation: checked generic attestation row. Change: add onchain/offchain/signed-statement rows and attestation revocations.
- Pass 94, issuer trust registries: checked credential/source trust gaps. Change: add issuer trust registries and scoped issuer trust entries.
- Pass 95, proof verification runs: checked `VerificationResult` and proof artifacts. Change: add reproducible proof verification runs and public input rows.
- Pass 96, agent identity boundary: checked agent service/model rows. Change: add agent identities distinct from services/accounts/models/humans.
- Pass 97, agent capability provenance: checked MCP/A2A capability rows. Change: add capability claims with schema hashes and trust boundaries.
- Pass 98, model provenance: checked model provider/invocation rows. Change: add model releases with release/deprecation/system-card metadata.
- Pass 99, agent output authenticity: checked output/artifact provenance. Change: add agent output artifacts linked to model/tool/session/provenance manifests.
- Pass 100, human delegation: checked wallet/session/agent approval rows. Change: add delegation grants with scopes, constraints, and revocation.
- Pass 101, source classes expansion: checked emerging source categories. Change: document reference implementation, p2p crawler, mempool observer, orderflow relay, block builder, archive node, and indexer warehouse as source types, not entities.
- Pass 102, consensus/client views: checked network view sections. Change: document consensus, validator, node, p2p, mempool, orderflow, and indexer lineage view organization.
- Pass 103, identity/provenance views: checked content/agent/social views. Change: document identity proof, credential, attestation, content authenticity, dataset license, and agent trust view organization.
- Pass 104, proof gates for v12: checked route/proof seed patterns. Change: require proof gates for zk proof verification, credential revocation visibility, p2p observations, MEV builder bids, archive lineage, content provenance, license policy, and agent output lineage.
- Pass 105, implementation migration ordering: challenged overlay sprawl. Change: document a migration order that starts with source/selector/proof foundations, then one source fixture, one route proof, and one view before broad entity rollout.
- Pass 106, v12 adversarial consolidation: merged consensus/orderflow and privacy/provenance findings. Change: keep new rows as evidence/lineage/proof facts, not as broad category labels.
- Pass 107, CAIP identity discipline: checked local network/account/asset selectors and CAIP-2/10/19. Change: add identifier profiles, canonicalization observations, network identifiers, and rejection notes against provider ids or globally canonical strings as identity facts.
- Pass 108, ERC-4337 grounding: checked local 4337 rows, Voltaire/Etherscan/Blockscout/Sourcify surfaces, and ERC-4337. Change: add EntryPoint, UserOperation receipt, mempool observation, and paymaster policy rows.
- Pass 109, PSBT signing boundary: checked local UTXO/PSBT rows and BIP-174. Change: add explicit PSBT input/output scopes, signer observations, and extraction attempts while keeping UTXO transactions authoritative for chain facts.
- Pass 110, Move object grounding: checked local Move placeholders and Sui API surfaces. Change: add object references, dynamic fields, balance changes, package upgrades, and epoch observations with dialect-specific constraints.
- Pass 111, Git object protocol: checked local GitHub-backed source usage, content-address rows, Git object docs, and Git protocol v2. Change: add Git repository, object, blob, tree, commit, tag, ref, packfile, remote, fetch, and signature rows; keep host forges as sources, not protocol identity.
- Pass 112, Radicle collaboration protocol: checked Radicle user/protocol guides and local identity/provenance rows. Change: add Radicle node, repository, delegate, seed, peer, identity document, signed ref, issue, patch, and sync observation rows on top of Git primitives.
- Pass 113, BitTorrent distribution protocol: checked BEP-3 and content-address rows. Change: add torrent metainfo, file, piece, tracker, swarm, peer, DHT node, announce, transfer, and magnet rows; keep torrent availability as observations, not content truth.
- Pass 114, Git implementation sourceability: inspected existing GitHub-backed source folders, spec proposal resolvers, IPFS/Swarm content views, Git object docs, and Git protocol v2. Change: add forge mirror, object verification, ref update, tree path, and source-plan rows so host APIs can fulfill Git fields without becoming Git identity.
- Pass 115, Radicle implementation sourceability: inspected Radicle identity/node/repository docs and existing identity/provenance rows. Change: add identity revision, node inventory, gossip/sync session, and collaboration event rows so Radicle data can be verified against signed refs and Git objects.
- Pass 116, BitTorrent implementation sourceability: inspected BEP-3 metainfo/piece model and existing content retrieval rows. Change: add metainfo parse, piece verification, magnet resolution, tracker scrape, and DHT lookup rows so torrent availability stays observational.
- Pass 117, real agent loop correction: ran three parallel protocol explorers for Git, Radicle, and BitTorrent against local schema/source/view anchors. Change: keep schema iteration metadata outside the entity model; only protocol primitives and sourceable observations remain in schema.
- Pass 118, Git adversarial integration: merged Git explorer findings. Change: add loose/packed storage observations, byte verification, and forge issue/PR/release rows while keeping Git object identity byte-derived and forge metadata separate.
- Pass 119, Radicle adversarial integration: merged Radicle explorer findings. Change: bind signed refs, identity documents, issues, patches, and comments back to Git objects/refs and concrete verification results instead of alias/node availability.
- Pass 120, BitTorrent adversarial integration: merged BitTorrent explorer findings. Change: add BEP-52-aware metainfo/file/piece fields, Merkle verification rows, and magnet/tracker/DHT source distinctions so distribution availability never becomes content identity.
- Pass 121, methodology hardening: ran a process/client/source/view agent against local schema/resolver/view contracts. Change: keep cardinality/list/conditional/source checks as prose/proof obligations, not model entities.
- Pass 122, implementation delta audit: ran a broad crypto/execution agent against local schema/source/view anchors and current ecosystem candidates. Change: make overlay-only gaps explicit, add top-coin boundary rule, and add Bitcoin script plus Sui/Aptos dialect rows without treating rank or layer labels as ontology.
- Pass 123, non-crypto provenance audit: ran a social/identity/content/agent agent against local schemas. Change: add handle observation, signed message, content parser, and source lineage rows while keeping source categories and view organization as prose.
- Pass 124, relationship sourceability audit: ran crypto, non-crypto, and methodology relationship agents plus primary-source spot checks. Change: add relationship validity/evidence annotations and downgrade market/oracle/position/governance/security/orderflow and registry-derived network links into sourceable claims or observations.

## Current Repo Anchors

- Schema contract: `src/schema/$schema.ts` with `EntityDefinition`, selectors, `EntityFieldType`, `EntityFieldCardinality`, `defaultSources`, `when`, and `EntityFieldCondition`.
- Client contract: `src/client/$client.svelte.ts`, `src/client/$subscribe.svelte.ts`, `src/client/$proxy.svelte.ts`.
- Source contract: `src/sources/$sources.ts`, `src/sources/index.ts`, `src/sources/Source.ts`, `src/sources/SourceProvider.ts`.
- Resolver contract: `src/resolvers/$resolvers.ts`, `src/resolvers/defineResolver.ts`, `src/resolvers/index.ts`.
- Visible product surface: `src/routes/navigationItems.svelte.ts`.
- Known debt seeds: `EvmRollup` as L2Beat-shaped projection; `BlockheadSessionAction.action.params` as generic object.

## Implementation Delta After Current Repo State

Overlay rows are not implementation evidence until mirrored by `src/schema/EntityType.ts`, concrete `src/schema/*.ts`, at least one source facet, one view anchor, and one proof gate. Current concrete coverage is strongest for EVM, UTXO, Lightning, Solana, Cosmos, Polkadot, NEAR, Filecoin, Monero, Tron, Hyperliquid, Bittensor, Quilibrium, Logos, and ZeroG. Overlay-only priority gaps include XRPL, Stellar/Soroban, Cardano/Plutus, Algorand/AVM, TON/TVM, Hedera, Sui/Aptos Move, Tezos/Michelson, ICP canisters, Kaspa blockDAG, BNB/Cronos/Avalanche-specific roles, runtime opcode catalogs, rollup derivation/proof rows, DA sampling rows, and source/indexer lineage rows.

Local non-crypto concrete schemas cover ActivityPub, ATProto, Farcaster, Lens, Nostr, X, Reddit, RSS, YouTube, IPFS, Swarm, and local agent conversations. High-risk migration anchors: `AtprotoActor.handle` and Farcaster username/client-url selectors move toward handle/source-alias observations unless proven immutable; `Media`/`MediaObject` URL selectors are retrieval/display conveniences, not content identity; `IpfsResource`/`SwarmResource` parsed MIME/display/text fields need retrieval/parser observations; `BlockheadAgentConversationTurn` is transcript state, not model invocation provenance.

Operational rule: before adding protocol rows, document source fulfillment, list behavior, relationship validity, and proof gates for one local anchor. Market-cap rank only selects review candidates; it never creates entity roots. A candidate enters schema only through protocol identity, state model, operation model, source plan, view plan, and proof gates.

## Reference Set

Primary/current anchors to re-check during real implementation:

- CAIP-2, CAIP-10, CAIP-19, CAIP-25, CAIP-122
- ERC-20, ERC-721, ERC-1155, ERC-2612, ERC-4626, ERC-4337, ERC-6909, ERC-7683, EIP-712, EIP-1193, EIP-1271, EIP-155, EIP-6963, EIP-7702
- ERC-3643, ERC-1400 family, ERC-1404, ERC-3525, ERC-3475, ERC-7092, ERC-7518, ERC-2981, ERC-4907, ERC-5114, ERC-5484
- Solidity ABI, Solana Wallet Standard/Token-2022/Metaplex, Cosmos SDK/protobuf Msg/IBC ICS-20, Substrate metadata/SCALE, Move package/module/function, Bitcoin PSBT/BIP-174
- MCP, ACP, A2A, AG-UI, ERC-8004, x402
- ActivityPub, AT Protocol, Farcaster, Lens, Nostr NIPs, XMTP, RSS/Atom
- DID Core, VC Data Model, EIP-4361 SIWE, EAS, Ceramic
- Git object model/protocol v2, Radicle protocol, BitTorrent BEP-3/BEP-5/BEP-52, IPFS/IPLD/multiformats/CAR/IPNS, Swarm, MIME, OpenGraph, schema.org
- CoinGecko current market-cap surface for ecosystem boundary checks; Chainlist, EthereumLists, Superchain Registry, L2Beat, Blobscan, Sourcify, Etherscan, Blockscout, Allium, Dune, DefiLlama, Dexscreener, LI.FI, CoinMarketCap, Coinpaprika, TrustWalletAssets
- Bitcoin Core, Mempool.space, Amboss, LND/Core Lightning, Lightning BOLTs, Liquid/Elements, RGB, Taproot Assets, Cashu, Fedimint, Payjoin
- Ethereum execution specs, consensus specs, EVM opcode tables, Solidity/Vyper/Fe verified-source metadata, Sourcify metadata, ERC/EIP trackers, OP Stack, Arbitrum Nitro, ZKsync, Starknet, Scroll, Polygon CDK, Linea, Base/Superchain
- Sui object model, Aptos transactions/states, XRPL ledger/transaction references, Stellar ledger/operation/Soroban references, Cardano ledger/Plutus/Hydra, Algorand AVM/ASA/Indexer, TON TVM/cells/messages, Hedera Mirror/HTS/HCS/EVM, ICP canisters/certified state, Kaspa blockDAG, Tezos Michelson, Avalanche P/X/Subnet, BNB Beacon/opBNB, Cronos, Hyperliquid, Bittensor, Worldcoin, Canton, Quilibrium, Logos

## Ten Iteration Passes

### Pass 01: Identity Spine

Problem: selectors drift into provider ids, symbols, display names, app routes.

Change: introduce universal selector and source claim spine. Require every new domain entity to state selector namespace and equivalence/alias policy.

Entities added/refined: `IdentifierScheme`, `Selector`, `SourceAlias`, `SourceClaim`, `EquivalenceClaim`, `RegistryReference`, `VerificationResult`.

Reject: `projectId` as identity unless scoped by `registryNamespace`; `USDC` as asset id; EVM address without network in account routes.

### Pass 02: Evidence And Source Model

Problem: schema assumes facts that sources/indexers cannot resolve, or hides source-specific methodology.

Change: model providers, origins, endpoints, source health, retrievals, measurements, and source claims separately.

Entities added/refined: `SourceProvider`, `Source`, `SourceOrigin`, `SourceEndpoint`, `SourceHealth`, `RetrievalRecord`, `MeasurementRecord`, `SourceClaim`.

Client rule: every source-backed field has `defaultSources` ordered by product trust and resolver completeness. Counts use resolver count facets or known complete list fallback only.

### Integration Overlay: Client And Resolver Fit

Problem: a schema can look correct but fail the product contract: no field rows, no count facet, no live publisher, unsupported filters, conditional fields not reflected in selection types, or route views sorting semantic data locally.

Change: every entity slice records implementation coverage before code work begins. Required rows cover selectors, fields, source coverage, resolver subset shape, count/live support, proxy/subscription paths, route sections, and proof gates.

Entities added/refined: none; pass 09 is retained as methodology only.

Reject: adding `$$items` without count strategy; adding `when` without selected-field behavior; adding resolver fields that cannot validate through `EntityFieldCardinality`; adding UI-only grouping as schema semantics.

### Pass 03: Network/System/Deployment Split

Problem: `Network`, `layer`, `rollup`, `project`, and `ecosystem` conflate runtime identity, brand/system identity, lifecycle, and source classification.

Change: split concrete networks from durable systems and lifecycle deployments. Replace vague layer edges with role rows.

Entities added/refined: `Network`, `NetworkSystem`, `NetworkSystemRegistryReference`, `NetworkSystemDeployment`, `NetworkSystemNetworkRole`, `Protocol`, `ProtocolDeployment`, `ScalingDeployment`, `BridgeDeployment`.

Reject: universal `Layer`; `EvmRollup` as canonical root; L2Beat TVS on `EvmNetwork`.

### Pass 04: State Spaces And Protocol Artifacts

Problem: account/contract/chain entities hide concrete state model and rule binding.

Change: add artifact/state primitives usable across EVM, UTXO, Solana, Cosmos, Substrate, Move, content graphs, relays, and service logs.

Entities added/refined: `StateSpace`, `StateCoordinate`, `StateKey`, `StateObject`, `StateSnapshot`, `StateTransition`, `RuleArtifact`, `InterfaceArtifact`, `EncodingArtifact`, `ImplementationArtifact`, `RuleBinding`, `CapabilityFacet`, `ConstraintFacet`.

Reject: role-based runtime classes as mutually exclusive entities.

### Pass 05: Cross-Architecture Invocation

Problem: product write flows are EVM-shaped or raw ABI/provider calls.

Change: introduce program/action/payload rows that preserve architecture-native fields while sharing submission/outcome contracts.

Entities added/refined: `ProgramAction`, `EvmCallPayload`, `Eip712Payload`, `Eip7702AuthorizationPayload`, `UserOperationPayload`, `SolanaInstructionPayload`, `CosmosMsgPayload`, `SubstrateExtrinsicPayload`, `MoveCallPayload`, `NearActionPayload`, `PsbtPayload`.

Reject: raw `{ method, params }`, raw `{ to, data }`, generic `simulation.result: unknown`.

### Pass 06: Assets, Rights, Restrictions

Problem: asset model is ERC-20-centric; NFTs/media/RWAs/compliance/object-model assets become blobs or display fields.

Change: split asset definition, chain-scoped instance, class/partition/object/token, rights, restrictions, issuer powers, metadata observations, balances, and authorizations.

Entities added/refined: `Asset`, `AssetInstance`, `AssetClass`, `AssetObject`, `AssetBalance`, `AssetBalance_Timestamp`, `TokenStandardConformance`, `TokenMetadataDocument`, `NftCollection`, `NftToken`, `RoyaltyRight`, `UsageRight`, `TransferRestriction`, `AssetEligibility`, `RegulatedAssetProfile`, `IssuerAction`, `Payout`.

Reject: `isNft` as model driver; image URL as NFT identity; balance as spendable amount; compliance as account-global boolean.

### Pass 07: Markets, DeFi, Orders

Problem: quotes, routes, positions, pool metrics, portfolio totals, and current market data get conflated.

Change: keep market/venue identity stable; use timestamp rows for quotes/prices/TVL; use typed position rows; use order rows for solver/intents.

Entities added/refined: `Market`, `MarketPrice`, `Market_Timestamp`, `Market_TimeInterval_Timestamp`, `OracleFeed`, `OracleFeed_Round`, `LiquidityPool`, `LiquidityPool_Timestamp`, `LiquidityPosition`, `Vault`, `VaultSharePosition`, `LendingPosition`, `BorrowPosition`, `PerpPosition`, `PredictionMarketPosition`, `Order`, `SolverOrder`, `PortfolioValuation_Timestamp`.

Reject: provider portfolio blob; executing from quote display route; Approval log as current allowance.

### Pass 08: Agents, Tools, Payments

Problem: service discovery, conversation state, model calls, MCP tools, permissions, and paid calls become one chat transcript.

Change: split domain services, local conversations, protocol sessions, tasks, messages, artifacts, model invocations, tool capabilities, permission requests, and payment requirements.

Entities added/refined: `AgentService`, `AgentEndpoint`, `AgentCapability`, `AgentSession`, `AgentTask`, `AgentMessage`, `AgentArtifact`, `McpServer`, `McpTool`, `McpResource`, `McpPrompt`, `ToolInvocation`, `ModelProvider`, `Model`, `ModelInvocation`, `PermissionRequest`, `PaymentRequirement`, `PaymentPayload`.

Reject: MCP tool as agent; local conversation as service identity; silent x402 wallet spend.

### Pass 09: Social, Identity, Content

Problem: public protocol state, local posting authority, profile claims, content metadata, and media previews merge.

Change: public social rows are domain entities; drafts and authority are local. Content/resource/metadata/media rows are separate and provenance-carrying.

Entities added/refined: `IdentityClaim`, `Credential`, `Attestation`, `DidDocument`, `EnsName`, `EnsRecord`, `EnsReverseRecord`, `ContentResource`, `IpfsResource`, `SwarmResource`, `MetadataDocument`, `MediaObject`, `UrlPreview_Timestamp`, social protocol entities, `BlockheadSocialPostSession`.

Reject: SIWF proof on `FarcasterUser`; metadata overwriting identity; gateway URL as CID.

### Pass 10: Product Local And Proof Surface

Problem: local UI state is too thin or mutates collections directly; route/view correctness depends on reloads or view-side shaping.

Change: define local rows for authority, sessions, rooms, panels, source preferences, notifications, drag payloads. Every product mutation produces rows that reload and subscribe cleanly.

Entities added/refined: `BlockheadWallet`, `BlockheadWalletConnection`, `BlockheadWalletAccount`, `BlockheadWalletScope`, `BlockheadSession`, `BlockheadSessionAction`, `BlockheadActionReadiness`, `BlockheadRoom`, `BlockheadRoomPeer`, `BlockheadPanelTree`, `BlockheadPanelTreeNode`, `BlockheadPanel`, `BlockheadSourcePreference`, `NotificationSubscription`, `NotificationTopic`, `NotificationDelivery`, `NotificationReadState`, `DragPayload`.

Reject: id-only panel tree; watched account as signing authority; `Blockhead*` protocol facts.

### Pass 107: CAIP Identity Discipline

Question: how should chain, account, and asset identifiers be modeled without turning interop strings into every entity's ontology?

Local inventory: `Network`, `Account`, `AssetInstance`, `SourceAlias`, `IdentifierScheme`, and route selectors already use CAIP-shaped fields, while schema instructions say selectors are the addressing contract and provider ids are aliases or claims.

Evidence: CAIP-2 defines blockchain ids as `namespace:reference`; CAIP-10 prefixes account ids with a CAIP-2 chain id; CAIP-19 defines asset type and optional asset id forms. Canonicalization is namespace-specific and not globally required.

Change: add identifier profile and canonicalization observation rows, then attach CAIP source fulfillment to network/account/asset identity families. Keep CAIP strings as selectors where they identify the entity, and use selector derivation or aliases when the same identity has protocol-native forms.

Reject: making every protocol-native id a CAIP string; treating CAIP-19 review status as a final standard; storing registry aliases as primary selectors.

### Pass 108: ERC-4337 EntryPoint And Mempool Grounding

Question: what is missing from the current UserOperation model if it must be checked against the standard, bundler RPCs, and onchain EntryPoint events?

Local inventory: `EvmUserOperation`, `Erc4337Bundler`, `Erc4337Paymaster`, `Erc4337SmartAccount`, `Erc4337Deposit_Timestamp`, and Voltaire/Etherscan/Blockscout/Sourcify resolvers exist, but EntryPoint deployment and mempool observation are not first-class.

Evidence: ERC-4337 centers UserOperations around an EntryPoint contract and an alternative mempool serviced by bundlers. Bundler and paymaster facts are operational observations, not account identity.

Change: add EntryPoint deployment, UserOperation receipt, mempool observation, and paymaster policy rows. Keep account, bundler, factory, paymaster, and EntryPoint roles separate.

Reject: modeling UserOperation as an EVM transaction; treating bundler RPC support as permanent network capability; putting paymaster stake/deposit on stable paymaster rows.

### Pass 109: PSBT Structure And UTXO Signing Boundaries

Question: how should PSBT be represented so wallet/signing flows do not erase the underlying UTXO transaction model?

Local inventory: `Psbt` and `PsbtMapEntry` exist in the non-EVM family, and `PsbtPayload` links write flows to payloads. Existing UTXO entities already own transaction/input/output facts.

Evidence: BIP-174 defines PSBT as a format with global, per-input, and per-output maps for partially signed transactions.

Change: add explicit PSBT input/output scopes, signer observations, and finalization status. Keep map entries for lossless representation, but add reviewable rows for signing readiness and extracted transaction linkage.

Reject: replacing `UtxoTransaction` with PSBT; treating a PSBT as a submitted transaction; using wallet-local signer state as public chain evidence.

### Pass 110: Move Object Model Grounding

Question: what does the generic Move slice need before it can safely cover Sui/Aptos-style object and package systems?

Local inventory: `MoveNetwork`, `MoveCheckpoint`, `MoveTransaction`, `MoveCall`, `MovePackage`, `MoveObject`, `MoveObjectChange`, `MoveResource`, and `MoveEvent` already exist as mock rows, while no local source files currently implement Sui/Aptos resolvers.

Evidence: Sui exposes checkpoints, transactions, objects, object changes, events, and dynamic fields through its API surface; Move ecosystems differ in object/account/resource semantics.

Change: add object reference, dynamic field, package upgrade, balance change, and epoch/checkpoint observation rows. Keep `MoveNetwork.moveDialect` as a discriminator rather than pretending Sui and Aptos share identical identity rules.

Reject: one generic `MoveAccount` model for all Move chains without dialect constraints; storing mutable object owner/content on stable `MoveObject`; treating package version as optional display metadata.

## Consolidated Entity Review Schema

Moved to [SCHEMA.md](SCHEMA.md).

## Slice Backlog For Real Implementation

1. Replace canonical `EvmRollup` with `NetworkSystem*`, `ScalingDeployment`, `BridgeDeployment`, and timestamp rows; keep `EvmRollup` only as compatibility projection until views migrate.
2. Replace `BlockheadSessionAction.action: {type, params}` with `$action` plus typed intent/payload/readiness/submission/outcome rows.
3. Add domain `Account(caip10)` and connect `BlockheadWalletAccount`/watched accounts to it.
4. Add `AssetInstance` profiles for ERC-3643, ERC-3525, ERC-4626, Solana Token-2022, Cosmos denoms/ICS-20, Sui/Aptos object assets, XRPL/Stellar trust lines, Cardano/Algorand native assets.
5. Add direct invocation payload rows for EVM ABI, Solana instructions, Cosmos Msgs, Substrate extrinsics, Move calls, NEAR actions, Bitcoin PSBTs.
6. Split social write sessions into local draft/authority rows and public protocol rows.
7. Split content resources, metadata documents, and media objects across IPFS/Swarm/URL/social/NFT surfaces.
8. Expand agent/service schema around MCP/ACP/A2A/model invocations/permissions/x402.
9. Prove field-level source priority, source-specific methodology, and no provider identity leakage with tests/docs before new resolver code.
10. Map every navigation item to real domain/local entities, required resolver fields, live updates, and proof suites before adding view surfaces.
11. Document source support for existing `src/sources/**` providers before creating new resolver code.
12. Prove every `$$` subsection has selection shape, count behavior, ordering, and empty-state policy in route/view tests.
13. Add runtime/opcode seeds for EVM first, then MoveVM, TVM, Soroban, AVM, Plutus, Michelson, Wasm/canister, and Filecoin actor execution.
14. Add top-coin ecosystem rows only when at least one primary spec/RPC/indexer pair exists and unsupported fields are documented in prose/tests.
15. Add source-comparison tests for price, TVL, rollup risk, contract verification, token metadata, bridge routes, social metrics, and chain identity.
16. Derive route/list/proof obligations from discovered routes/schema before adding new UI sections.
17. Add governance lifecycle and vote/delegation rows for existing Cosmos, Polkadot, and specification proposal surfaces.
18. Add security/risk/compliance rows as source-backed claims first; do not infer exploit root cause or sanctions status without an attributed source.
19. Add oracle/market methodology rows before comparing provider values or showing a chosen latest price.
20. Add bridge/intent/payment lifecycle rows for current bridge and local action flows before adding more bridge providers.
21. Add restaking/shared-security/DA/proof-system rows only behind protocol docs plus on-chain/indexer source pairs.
22. Add wallet auth/passkey/session-key rows as local authority surfaces; never use them as account identity selectors.
23. Add confidential compute/FHE/MPC rows as proof/attestation/key-management facts, not as generic privacy labels.
24. Document concrete examples for `Zero`, `Many`, and `ZeroOrOne` before tightening any schema cardinality.
25. Add consensus/client/P2P/orderflow rows as observations and deployments, not as extra fields on `Network`.
26. Implement `DataLineageClaim` for one existing indexer before trusting source-comparison displays.
27. Add credential/proof/status rows using W3C VC 2.0-compatible shapes before expanding DID/zk-specific variants.
28. Add content authenticity/license/provenance rows for one media or dataset route before broad AI-use policy coverage.
29. Add agent identity/capability/output provenance rows after model/tool invocation rows have stable selectors.
30. Follow migration order: selector/source foundations, proof/verification rows, one source fixture, one view, one route proof, then broad domain expansion.
