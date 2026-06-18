# Blockhead Schema Iteration Mock

Status: iteration artifact, not production schema. Goal: compact starting point for recurring schema coverage passes. It should guide new `src/schema/**`, `src/resolvers/**`, `src/sources/**`, view, and test work without letting agents turn provider payloads, UI labels, or human categories into canonical entities.

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

## Research Loop

Per slice: `EvidenceScout -> SourceIndexerAnalyst -> OntologyModeler -> AdversarialCritic -> SchemaSteward -> ClientIntegrationCheck -> ImplementationAgent -> ProofAgent`.

Required evidence table per slice: `artifact | primary spec/ref impl | registry/indexer | selectors | state model | operations | events | available fields | unavailable facts | confidence`.

Required model decision record per entity: `why entity | why selector | why fields | why refs | relationship validity class for every $/$$ ref | why cardinalities | why timestamp/claim/local split | counterexamples rejected | source plan | client plan | proof plan`.

Required proof gates: schema selector tests, resolver registry tests, source fixture tests, subscribe/proxy nested selection tests, route e2e for visible surfaces, CORS/source-origin test for browser fetches.

Final adversarial gates for every future pass:

1. Selector gate: every selector is a real protocol/registry identifier or a local Blockhead id; mutable handles require derivation/equivalence policy.
2. Timestamp gate: every observation, source classification, metric, count, balance, health value, preview, fetched metadata parse, and current status is on a timestamp/block/coordinate row unless the protocol id itself fixes the value.
3. Source gate: unsupported source facts are absent resolver facets, not `Zero` cardinality or guessed fields.
4. Client gate: every browseable `$$` field states row availability, count behavior, nested selection behavior, ordering source, and live/update policy.
5. Fallacy gate: do not infer common roots from shared labels, provider categories, app pages, marketing terms, or UI grouping.
6. Relationship gate: every `$` / `$$` reference and `*Relation` row must classify whether the edge is canonical protocol state, source assertion, derived equivalence, observed behavior, local product state, or view grouping. Source-asserted, derived, observed, and view-group edges require existing claim/evidence/proof rows; only canonical protocol state may be modeled as a direct stable ref without a separate assertion row. Relationship validity is a schema review/proof obligation, not a domain entity family.

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

One canonical representation follows. Each entity family block contains the actual entity definitions plus its source fulfillment, view organization, proof gates, and implementation starting point. There are no separate source, view, or proof appendices.

```text
Entity family: Sources, evidence, and standards
  Entity SourceProvider :: provider! ; label! p:str, origins* p:{origin:url,corsEnabled:bool}, $$sources* $:Source
  Entity Source :: source! ; $provider! $:SourceProvider, label! p:str, envKeys* p:str, transportKind? p:enum, availability? p:enum, $$endpoints* $:SourceEndpoint, $$health* $:SourceHealth
  Entity SourceOrigin :: origin! ; $source! $:Source, corsEnabled! p:bool, proxyAllowed! p:bool, evidenceMethod! p:enum, checkedAt? p:num
  Entity SourceEndpoint :: $source+endpointKey ; endpointKey! p:str, url? p:url, method? p:str, protocol? p:enum, authKind? p:enum, responseShape? p:enum, paginationKind? p:enum, $$health* $:SourceHealth
  Entity SourceHealth :: $source+endpointKey+timestampMs ; $source! $:Source, endpointKey! p:str, timestampMs! p:num, status! p:enum, latencyMs? p:num, error? p:str
  Entity SourceDataset :: $source+datasetKey ; $source! $:Source, datasetKey! p:str, datasetKind! p:enum, schemaHash? p:hex, coverageSelector? p:json, refreshCadenceMs? p:num, $$derivationRuns* $:IndexerDerivationRun
  Entity IndexerDerivationRun :: $source+datasetKey+runId ; $source! $:Source, datasetKey! p:str, runId! p:str, inputSources* p:str, inputCoordinate? p:json, outputHash? p:hex, startedAt! p:num, completedAt? p:num, status! p:enum
  Entity StandardReference :: standardId ; standardId! p:str, title! p:str, status! p:enum, type? p:enum, url! p:url, updatedAt? p:num, $$trackers* $:SpecTracker
  Entity SpecTracker :: trackerId ; trackerId! p:str, $standard? $:StandardReference, trackerKind! p:enum, url! p:url, observedStatus? p:str, observedAt! p:num
  Entity IdentifierScheme :: scheme! ; label! p:str, syntax? p:str, standardUrl? p:url, standardStatus? p:enum, canonicalization? p:enum, namespace? p:str, $$selectors* $:Selector
  Entity Selector :: $scheme+value ; $scheme! $:IdentifierScheme, value! p:str, normalizedValue? p:str, canonicalValue? p:str, canonicalizationStatus? p:enum
  Entity IdentifierProfile :: scheme+namespace ; scheme! p:str, namespace! p:str, standardStatus! p:enum, syntax! p:str, canonicalizationPolicy! p:enum, caseSensitivity! p:enum, checksumPolicy? p:enum, equivalencePolicy! p:enum, sourceUrl! p:url
  Entity IdentifierCanonicalizationObservation :: $selector+source+timestampMs ; $selector! $:Selector, source! p:str, timestampMs! p:num, normalizedValue? p:str, canonicalValue? p:str, status! p:enum, reason? p:str
  Entity SourceAlias :: registryNamespace+registryReference ; registryNamespace! p:str, registryReference! p:str, $selector? $:Selector, label? p:str, url? p:url, $source? $:Source
  Entity SourceClaim :: claimId ; claimId! p:str, $source! $:Source, subjectType! p:str, subjectSelector! p:json, predicate! p:str, object! p:json, claimStatus! p:enum, confidence? p:num, evidenceMethod! p:enum, validFromMs? p:num, validToMs? p:num
  Entity EquivalenceClaim :: claimId ; claimId! p:str, $$selectors+ $:Selector, $source? $:Source, proofKind? p:enum, claimStatus! p:enum, confidence? p:num
  Entity VerificationResult :: verificationId ; verificationId! p:str, subjectType! p:str, subjectSelector! p:json, verifier! p:str, status! p:enum, timestampMs! p:num, evidenceUrl? p:url, $standard? $:StandardReference
  Entity Signature :: signatureId ; signatureId! p:str, scheme! p:enum, signerSelector? p:json, messageHash? p:hex, signature! p:hex, publicKey? p:hex, status? p:enum
  Entity RetrievalRecord :: retrievalId ; retrievalId! p:str, target! p:str, $source? $:Source, timestampMs! p:num, status! p:enum, contentHash? p:str, mime? p:str, error? p:str
  Entity MeasurementRecord :: measurementId ; measurementId! p:str, subjectType! p:str, subjectSelector! p:json, metric! p:str, value! p:json, unit? p:str, timestampMs! p:num, methodology? p:str, $source! $:Source
  Source fulfillment :: SourceProviderDefinitions, resolverPublicEnv, retrieval/measurement jobs, CAIP specifications, RPC/explorer/archive/indexer/warehouse/registry/reference-implementation/crawler/p2p-observer/prover-verifier source records
  View organization :: SourceView, SpecView
  Proof gates :: source-cors-rpc, timestamp-freshness, identifier-canonicalization, source-derivation-lineage
  Implementation starting point :: implement source/origin/dataset/health records before adding new resolver code; provider ids remain SourceAlias/SourceClaim, not selectors
  Rejected alternatives :: provider ids as selectors; globally canonical CAIP strings; registry aliases as identity facts

Entity family: State spaces, protocol rules, runtime artifacts, and execution operations
  Entity StateSpace :: stateSpaceId ; stateSpaceId! p:str, kind! p:enum, $network? $:Network, $protocolDeployment? $:ProtocolDeployment, coordinateModel! p:enum
  Entity StateCoordinate :: $stateSpace+coordinateKey ; $stateSpace! $:StateSpace, coordinateKey! p:str, height? p:bigint, hash? p:hex, timestampMs? p:num, finalized? p:bool
  Entity StateKey :: $stateSpace+key ; $stateSpace! $:StateSpace, key! p:str, keyKind! p:enum
  Entity StateObject :: $stateSpace+$stateKey ; $stateSpace! $:StateSpace, $stateKey! $:StateKey, objectKind? p:enum, $$snapshots* $:StateSnapshot, $$transitions* $:StateTransition
  Entity StateSnapshot :: $stateObject+$coordinate ; $stateObject! $:StateObject, $coordinate! $:StateCoordinate, valueHash? p:hex, value? p:json, $source? $:Source
  Entity StateTransition :: $stateSpace+transitionId ; $stateSpace! $:StateSpace, transitionId! p:str, $coordinate? $:StateCoordinate, transitionKind! p:enum, $$inputs* $:StateObject, $$outputs* $:StateObject
  Entity RuleArtifact :: ruleId ; ruleId! p:str, kind! p:enum, name! p:str, version? p:str, standardUrl? p:url
  Entity InterfaceArtifact :: interfaceId ; interfaceId! p:str, kind! p:enum, name? p:str, abi? p:json, idl? p:json, schema? p:json, standardUrl? p:url
  Entity EncodingArtifact :: encodingId ; encodingId! p:str, kind! p:enum, name! p:str, standardUrl? p:url
  Entity ImplementationArtifact :: implementationId ; implementationId! p:str, kind! p:enum, name? p:str, version? p:str, sourceUrl? p:url, bytecodeHash? p:hex
  Entity RuleBinding :: $rule+$stateSpace+bindingKey ; $rule! $:RuleArtifact, $stateSpace! $:StateSpace, bindingKey! p:str, validFromCoordinate? p:str, validToCoordinate? p:str
  Entity CapabilityFacet :: capabilityId ; capabilityId! p:str, subjectType! p:str, subjectSelector! p:json, capabilityKind! p:enum, $interface? $:InterfaceArtifact, $$constraints* $:ConstraintFacet
  Entity ConstraintFacet :: constraintId ; constraintId! p:str, subjectType! p:str, subjectSelector! p:json, constraintKind! p:enum, value? p:json, source? p:str
  Entity IntervalRecord :: intervalId ; intervalId! p:str, subjectType! p:str, subjectSelector! p:json, state! p:str, fromMs? p:num, toMs? p:num, $source? $:Source
  Entity TransitionRecord :: transitionRecordId ; transitionRecordId! p:str, subjectType! p:str, subjectSelector! p:json, transitionKind! p:enum, timestampMs? p:num, coordinate? p:str, $source? $:Source
  Entity ExecutionEnvironment :: environmentId ; environmentId! p:str, family! p:enum, instructionSetKind! p:enum, stateModel! p:enum, addressModel? p:enum, bytecodeFormat? p:enum, sourceLanguageFamilies* p:enum, $$versions* $:RuntimeVersion, $$modules* $:RuntimeModule, $$operations* $:RuntimeOperation, $$opcodes* $:RuntimeOpcode
  Entity RuntimeVersion :: $environment+version ; $environment! $:ExecutionEnvironment, version! p:str, activatedAtCoordinate? p:json, standardUrl? p:url, implementationUrl? p:url, status! p:enum
  Entity RuntimeModule :: $environment+moduleKey ; $environment! $:ExecutionEnvironment, moduleKey! p:str, moduleKind! p:enum, namespace? p:str, packageSelector? p:json, sourceHash? p:hex, bytecodeHash? p:hex, $$operations* $:RuntimeOperation, $$sourceUnits* $:VerifiedSourceUnit
  Entity RuntimeOperation :: $environment+operationKey ; $environment! $:ExecutionEnvironment, operationKey! p:str, operationKind! p:enum, moduleKey? p:str, selector? p:hex, signature? p:str, inputs? p:json, outputs? p:json, mutability? p:enum, $$opcodeSegments* $:SourceMapSegment
  Entity RuntimeOpcode :: $environment+version+opcode ; $environment! $:ExecutionEnvironment, version! p:str, opcode! p:str, mnemonic! p:str, category! p:enum, stackInputs? p:num, stackOutputs? p:num, immediateBytes? p:num, gasTier? p:enum, halting? p:bool, exceptionalConditions* p:str, standardUrl? p:url
  Entity RuntimeGasSchedule :: $environment+version+operationKey ; $environment! $:ExecutionEnvironment, version! p:str, operationKey! p:str, baseCost? p:bigint, dynamicCostFormula? p:str, refundPolicy? p:str, meteringUnit! p:enum, sourceUrl? p:url
  Entity VerifiedSourceUnit :: sourceUnitId ; sourceUnitId! p:str, subjectType! p:str, subjectSelector! p:json, language! p:enum, compiler? p:str, compilerVersion? p:str, sourcePath? p:str, sourceHash? p:hex, metadataHash? p:hex, license? p:str, verificationStatus! p:enum, $source? $:Source, $$sourceMaps* $:SourceMapSegment
  Entity SourceMapSegment :: sourceUnitId+segmentKey ; sourceUnitId! p:str, segmentKey! p:str, sourceSpan? p:{start:num,length:num,fileIndex?:num}, bytecodeOffset? p:num, opcode? p:str, jumpType? p:enum, operationKey? p:str
  Entity TraceFrame :: traceId+frameIndex ; traceId! p:str, frameIndex! p:num, subjectSelector! p:json, $environment? $:ExecutionEnvironment, operationKey? p:str, opcode? p:str, depth? p:num, gasUsed? p:bigint, input? p:hex, output? p:hex, error? p:str, $$children* $:TraceFrame
  Entity VmHostFunction :: $environment+hostFunctionKey ; $environment! $:ExecutionEnvironment, hostFunctionKey! p:str, name! p:str, boundaryKind! p:enum, capability! p:enum, determinism! p:enum, gasPolicy? p:str, standardUrl? p:url
  Entity VerifierRule :: verifierRuleId ; verifierRuleId! p:str, $environment! $:ExecutionEnvironment, ruleKind! p:enum, subjectType! p:str, invariant! p:str, standardUrl? p:url, implementationUrl? p:url
  Source fulfillment :: protocol specs, reference implementations, verified source providers, bytecode/source-map parsers, trace providers
  View organization :: ContractView, ProofSystemView
  Proof gates :: proof-artifact, zk-proof-verifies
  Implementation starting point :: prove source-to-bytecode-to-operation linkage for one verified contract before broad opcode coverage
  Implementation order :: EVM opcode/source-map/trace proof first; Solana instruction/account-meta/compute-budget second; Move package/module/function/object changes third; TVM/Soroban/AVM/Plutus/Michelson/WASM host functions only after source and trace/indexer availability is proven

Entity family: Networks, systems, protocol deployments, scaling, bridges, and upgrades
  Entity Network :: caip2 | slug ; caip2? p:{namespace:str,reference:str}, slug! p:str, name! p:str, namespace! p:enum, environment! p:enum, $icon? $:MediaObject, $$nativeAssets* $:AssetInstance, $$blockExplorerUrls* $:Url, $$faucetUrls* $:Url, $$timestamps* $:Network_Timestamp
  Entity NetworkIdentifier :: $network+scheme ; $network! $:Network, scheme! p:str, value! p:str, namespace? p:str, canonicalValue? p:str, $identifierProfile? $:IdentifierProfile, $source? $:Source
  Entity Network_Timestamp :: $network+timestampMs+source ; $network! $:Network, timestampMs! p:num, source! p:str, latestHeight? p:bigint, txCount? p:num, health? p:enum
  Entity NetworkSystem :: slug ; slug! p:str, name! p:str, kind? p:enum, $primaryNetwork? $:Network, $$registryReferences* $:NetworkSystemRegistryReference, $$deployments* $:NetworkSystemDeployment, $$timestamps* $:NetworkSystem_Timestamp
  Entity NetworkSystemRegistryReference :: registryNamespace+registryReference ; registryNamespace! p:str, registryReference! p:str, $system! $:NetworkSystem, label? p:str, url? p:url, $source? $:Source
  Entity NetworkSystemDeployment :: $system+deploymentKey ; $system! $:NetworkSystem, deploymentKey! p:str, environment? p:enum, status? p:enum, implementationFamily? p:enum, startedAt? p:num, endedAt? p:num, $primaryNetwork? $:Network, $$networkRoles* $:NetworkSystemNetworkRole, $$claims* $:NetworkSystemDeploymentClaim, $$protocolDeployments* $:ProtocolDeployment, $$scalingDeployments* $:ScalingDeployment, $$bridgeDeployments* $:BridgeDeployment
  Entity NetworkSystemDeploymentClaim :: $deployment+source+claimKey ; $deployment! $:NetworkSystemDeployment, source! p:str, claimKey! p:str, claimKind! p:enum, value! p:json, confidence? p:enum, observedAt? p:num, methodology? p:str
  Entity NetworkSystemNetworkRole :: $deployment+role+$network ; $deployment! $:NetworkSystemDeployment, role! p:enum, $network! $:Network, $protocolDeployment? $:ProtocolDeployment, roleSource? p:enum, startedAt? p:num, endedAt? p:num
  Entity NetworkSystem_Timestamp :: $system+timestampMs+source ; $system! $:NetworkSystem, timestampMs! p:num, source! p:str, tvlUsd? p:num, totalAssetsSecuredUsd? p:num, rank? p:num, methodology? p:str
  Entity Protocol :: protocolId ; protocolId! p:str, name! p:str, kind! p:enum, namespace? p:str, reference? p:str, standardUrl? p:url, $parentProtocol? $:Protocol
  Entity ProtocolDeployment :: $network+$protocol+deploymentKey ; $network! $:Network, $protocol! $:Protocol, deploymentKey! p:str, role! p:enum, $systemDeployment? $:NetworkSystemDeployment, status? p:enum, startedAt? p:num, endedAt? p:num, $$timestamps* $:ProtocolDeployment_Timestamp
  Entity ProtocolDeployment_Timestamp :: $deployment+timestampMs+source ; $deployment! $:ProtocolDeployment, timestampMs! p:num, source! p:str, status? p:str, participantCount? p:num, livenessPercent? p:num, throughput? p:num
  Entity ScalingDeployment :: $systemDeployment+scalingKey ; $systemDeployment! $:NetworkSystemDeployment, scalingKey! p:str, $executionNetwork? $:EvmNetwork, $settlementNetwork? $:Network, $dataAvailabilityNetwork? $:Network, $sequencingDeployment? $:ProtocolDeployment, $provingDeployment? $:ProtocolDeployment, $canonicalBridgeDeployment? $:BridgeDeployment, scalingKind? p:enum, settlementModel? p:enum, dataAvailabilityMode? p:enum, dataPostingMode? p:enum, proofMode? p:enum, sequencerSetKind? p:enum, proposerSetKind? p:enum, challengerSetKind? p:enum, forcedInclusionAvailable? p:bool, challengePeriodMs? p:num, escapeHatchKind? p:enum, standardRollupLevel? p:num, $$settlementRelations* $:SettlementRelation, $$dataAvailabilityRelations* $:DataAvailabilityRelation, $$sequencerRoles* $:SequencerRole, $$proofRoles* $:ProofSystemRole, $$upgradeAuthorities* $:UpgradeAuthority, $$timestamps* $:ScalingDeployment_Timestamp
  Entity ScalingDeployment_Timestamp :: $scalingDeployment+timestampMs+source ; $scalingDeployment! $:ScalingDeployment, timestampMs! p:num, source! p:str, status? p:str, riskStage? p:str, totalAssetsSecuredUsd? p:num, registryClassification? p:str, reviewStatus? p:enum, methodology? p:str
  Entity SettlementRelation :: $scalingDeployment+$settlementNetwork+relationKind ; $scalingDeployment! $:ScalingDeployment, $settlementNetwork! $:Network, relationKind! p:enum, finalitySource? p:enum, delayMs? p:num, challengePeriodMs? p:num, assertionStatus! p:enum, truthKind! p:enum, evidenceRefs* p:str, $source? $:Source, $verification? $:VerificationResult
  Entity DataAvailabilityRelation :: $scalingDeployment+$dataAvailabilityNetwork+relationKind ; $scalingDeployment! $:ScalingDeployment, $dataAvailabilityNetwork! $:Network, relationKind! p:enum, payloadLocation? p:enum, blobSupport? p:bool, committeeModel? p:enum, assertionStatus! p:enum, truthKind! p:enum, evidenceRefs* p:str, $source? $:Source, $verification? $:VerificationResult
  Entity SequencerRole :: $scalingDeployment+sequencerKey ; $scalingDeployment! $:ScalingDeployment, sequencerKey! p:str, roleKind! p:enum, operatorSelector? p:json, mempoolVisibility? p:enum, forcedInclusionPath? p:json, $source? $:Source
  Entity ProofSystemRole :: $scalingDeployment+proofSystemKey ; $scalingDeployment! $:ScalingDeployment, proofSystemKey! p:str, proofKind! p:enum, proposerPermission? p:enum, challengerPermission? p:enum, verifierSelector? p:json, guardianSelector? p:json, $source? $:Source
  Entity UpgradeAuthority :: authorityId ; authorityId! p:str, subjectType! p:str, subjectSelector! p:json, authorityKind! p:enum, actorSelector? p:json, delayMs? p:num, emergencyAction? p:enum, $source? $:Source
  Entity BridgeDeployment :: $fromNetwork+$toNetwork+bridgeKey ; $fromNetwork! $:Network, $toNetwork! $:Network, bridgeKey! p:str, $system? $:NetworkSystem, $systemDeployment? $:NetworkSystemDeployment, railId? p:str, settlementModel? p:enum, verificationModel? p:enum, assetOutcome? p:enum, $$paths* $:BridgePath, $$contracts* $:EvmContract, $$timestamps* $:BridgeDeployment_Timestamp
  Entity BridgePath :: $bridgeDeployment+direction+pathKey ; $bridgeDeployment! $:BridgeDeployment, direction! p:enum, pathKey! p:str, initiationSurface? p:enum, proofRequired? p:bool, finalizationDelayMs? p:num, forcedPath? p:bool, messageProtocol? p:str
  Entity BridgeDeployment_Timestamp :: $bridgeDeployment+timestampMs+source ; $bridgeDeployment! $:BridgeDeployment, timestampMs! p:num, source! p:str, volumeUsd? p:num, status? p:enum, latencyMs? p:num
  Entity NetworkEndpointObservation_Timestamp :: $network+endpointUrl+endpointKind+timestampMs+source ; $network! $:Network, endpointUrl! p:url, endpointKind! p:enum, timestampMs! p:num, source! p:str, corsEnabled? p:bool, proxyAllowed? p:bool, health? p:enum, latencyMs? p:num, error? p:str
  Entity ProtocolDeploymentClaim :: subjectSelectorHash+predicate+source+timestampMs ; subjectSelectorHash! p:str, subjectSelector! p:json, predicate! p:str, source! p:str, timestampMs! p:num, object! p:json, evidenceMethod! p:enum, confidence? p:enum
  Source fulfillment :: Chainlist_Rest, EthereumLists_Rest, Lifi_Rest, L2Beat_Rest, SuperchainRegistry_Rest, protocol registries, execution/consensus RPCs, CAIP specifications
  View organization :: NetworkView, EvmNetworkView, ProtocolDeploymentView
  Proof gates :: route-network-eip155, timestamp-freshness, source-conflict, identifier-canonicalization, no-registry-identity-leak, endpoint-observation, relationship-sourceability
  Implementation starting point :: keep CAIP-2 network identity separate from system/deployment claims and timestamp all live status/risk values
  Source fulfillment refinement :: every new network family must name at least one primary protocol/RPC source, one explorer/indexer candidate when available, one registry/spec source, unavailable facts, CORS/proxy policy, list/count support, relationship validity class, and one route proof target before adding broad views
  Rejected alternatives :: CAIP strings for every protocol-native id; provider slug as network identity; L2 risk fields on stable Network rows; `layerNumber`, `$parent`, and `$$childLayers` as durable cross-network truth; Chainlist/L2Beat/Superchain ids as selectors outside their source namespace

Entity family: Protocol-native network specializations
  Entity EvmNetwork :: caip2 ; caip2! p:{namespace:'eip155',reference:str}, namespace! p:'Evm', $network? $:Network, $nativeCoin? $:Coin, $nativeCoinInstance? $:EvmCoinInstance, $$endpointObservations* $:NetworkEndpointObservation_Timestamp, $$blocks* $:EvmBlock, $$transactions* $:EvmTransaction, $$contracts* $:EvmContract, $$precompiles* $:EvmContract, $$blobs* $:EvmBlob, $$timestamps+ $:EvmNetwork_Timestamp, $$gasFeeBlocks+ $:EvmNetwork_GasFee_Block, $$gasEstimateTimestamps+ $:EvmNetwork_GasEstimate_Timestamp, $$txpoolTimestamps+ $:EvmNetwork_Txpool_Timestamp, $$erc4337SmartAccounts* $:Erc4337SmartAccount, $$userOperations* $:EvmUserOperation
  Entity UtxoNetwork :: $network ; $network! $:Network, $$blocks* $:UtxoBlock, $$transactions* $:UtxoTransaction, $$addresses* $:UtxoAddress, $$timestamps* $:UtxoNetwork_Timestamp
  Entity SolanaNetwork :: caip2 ; caip2! p:{namespace:'solana',reference:str}, $network? $:Network, $$blocks* $:SolanaBlock, $$transactions* $:SolanaTransaction, $$instructions* $:SolanaInstruction, $$accounts* $:SolanaAccount, $$programs* $:SolanaProgram, $$tokenMints* $:SolanaTokenMint, $$timestamps* $:SolanaNetwork_Timestamp
  Entity CosmosNetwork :: $network ; $network! $:Network, chainId! p:str, bech32Prefix? p:str, $$blocks* $:CosmosBlock, $$transactions* $:CosmosTransaction, $$messages* $:CosmosMessage, $$accounts* $:CosmosAccount, $$validators* $:CosmosValidator, $$denoms* $:CosmosDenom, $$modules* $:CosmosModule, $$timestamps* $:CosmosNetwork_Timestamp
  Entity PolkadotNetwork :: $network ; $network! $:Network, relayChain? p:str, paraId? p:num, $$blocks* $:PolkadotBlock, $$extrinsics* $:PolkadotExtrinsic, $$events* $:PolkadotEvent, $$accounts* $:PolkadotAccount, $$validators* $:PolkadotValidator, $$pallets* $:PolkadotPallet, $$timestamps* $:PolkadotNetwork_Timestamp
  Entity NearNetwork :: slug ; slug! p:str, $network? $:Network, $$blocks* $:NearBlock, $$chunks* $:NearChunk, $$transactions* $:NearTransaction, $$receipts* $:NearReceipt, $$actions* $:NearAction, $$accounts* $:NearAccount, $$contracts* $:NearContract, $$validators* $:NearValidator, $$timestamps* $:NearNetwork_Timestamp
  Entity LightningNetwork :: $network ; $network! $:Network, $$nodes* $:LightningNode, $$channels* $:LightningChannel, $$invoices* $:LightningInvoice, $$payments* $:LightningPayment, $$htlcs* $:LightningHtlc, $$timestamps* $:LightningNetwork_Timestamp
  Entity FilecoinNetwork :: $network ; $network! $:Network, $$tipsets* $:FilecoinTipset, $$blocks* $:FilecoinBlock, $$messages* $:FilecoinMessage, $$actors* $:FilecoinActor, $$miners* $:FilecoinMiner, $$sectors* $:FilecoinSector, $$timestamps* $:FilecoinNetwork_Timestamp
  Entity MoneroNetwork :: $network ; $network! $:Network, $$blocks* $:MoneroBlock, $$transactions* $:MoneroTransaction, $$stealthOutputs* $:MoneroStealthOutput, $$keyImages* $:MoneroKeyImage, $$rings* $:MoneroRing, $$timestamps* $:MoneroNetwork_Timestamp
  Entity TronNetwork :: $network ; $network! $:Network, $$blocks* $:TronBlock, $$transactions* $:TronTransaction, $$accounts* $:TronAccount, $$contracts* $:TronContract, $$tokens* $:TronToken, $$tokenTransfers* $:TronTokenTransfer, $$witnesses* $:TronWitness, $$timestamps* $:TronNetwork_Timestamp
  Entity HyperliquidNetwork :: $network ; $network! $:Network, $$blocks* $:HyperliquidBlock, $$transactions* $:HyperliquidTransaction, $$accounts* $:HyperliquidAccount, $$validators* $:HyperliquidValidator, $$spotAssets* $:HyperliquidSpotAsset, $$perpMarkets* $:HyperliquidPerpMarket, $$timestamps* $:HyperliquidNetwork_Timestamp
  Entity ZeroGNetwork :: slug | caip2 ; slug? p:str, caip2? p:{namespace:str,reference:str}, $network? $:Network, $$storageNodes* $:ZeroGStorageNode, $$daNodes* $:ZeroGDaNode, $$daQuorums* $:ZeroGDaQuorum, $$dataBlobs* $:ZeroGDataBlob, $$timestamps* $:ZeroGNetwork_Timestamp
  Entity MoveNetwork :: $network+moveDialect ; $network! $:Network, moveDialect! p:enum, objectModel! p:enum, $executionEnvironment? $:ExecutionEnvironment, $$checkpoints* $:MoveCheckpoint, $$transactions* $:MoveTransaction, $$accounts* $:MoveAccount, $$packages* $:MovePackage, $$objects* $:MoveObject, $$events* $:MoveEvent, $$timestamps* $:MoveNetwork_Timestamp
  Entity MoveCheckpoint :: $network+checkpointSequence ; $network! $:MoveNetwork, checkpointSequence! p:bigint, digest! p:str, epoch? p:bigint, timestampMs? p:num, previousDigest? p:str, $$transactions* $:MoveTransaction
  Entity MoveTransaction :: $network+digest ; $network! $:MoveNetwork, digest! p:str, transactionKind! p:enum, sender? p:str, gasObject? p:str, gasBudget? p:bigint, status? p:enum, checkpointSequence? p:bigint, $$commands* $:MoveCall, $$effects* $:MoveObjectChange, $$events* $:MoveEvent
  Entity MoveCall :: $transaction+commandIndex ; $transaction! $:MoveTransaction, commandIndex! p:num, packageId? p:str, moduleName? p:str, functionName? p:str, typeArguments* p:str, arguments? p:json
  Entity MoveAccount :: $network+address ; $network! $:MoveNetwork, address! p:str, $$resources* $:MoveResource, $$objects* $:MoveObject, $$transactions* $:MoveTransaction
  Entity MovePackage :: $network+packageId ; $network! $:MoveNetwork, packageId! p:str, version? p:bigint, upgradePolicy? p:enum, $$modules* $:RuntimeModule
  Entity MoveObject :: $network+objectId | $network+objectId+version ; $network! $:MoveNetwork, objectId! p:str, version? p:bigint, digest? p:str, ownerSelector? p:json, objectType? p:str, storageRebate? p:bigint, previousTransaction? p:str, $$snapshots* $:MoveObject_Timestamp
  Entity MoveObjectReference :: $network+objectId+version+digest ; $network! $:MoveNetwork, objectId! p:str, version! p:bigint, digest! p:str, objectType? p:str, ownerSelector? p:json, previousTransaction? p:str
  Entity MoveObject_Timestamp :: $object+timestampMs+source ; $object! $:MoveObject, timestampMs! p:num, source! p:str, version? p:bigint, ownerSelector? p:json, contents? p:json
  Entity MoveObjectChange :: $transaction+changeIndex ; $transaction! $:MoveTransaction, changeIndex! p:num, changeKind! p:enum, objectId? p:str, objectType? p:str, ownerSelector? p:json, version? p:bigint
  Entity MoveDynamicField :: $parentObject+fieldNameHash ; $parentObject! $:MoveObject, fieldNameHash! p:str, fieldName? p:json, fieldType? p:str, childObjectId? p:str, $$timestamps* $:MoveObject_Timestamp
  Entity MoveBalanceChange :: $transaction+changeIndex ; $transaction! $:MoveTransaction, changeIndex! p:num, ownerSelector? p:json, assetSelector? p:json, amountDelta! p:bigint
  Entity MovePackageUpgrade :: $package+version ; $package! $:MovePackage, version! p:bigint, previousPackageId? p:str, upgradeCapSelector? p:json, policy? p:enum, digest? p:str, timestampMs? p:num
  Entity MoveEpochObservation_Timestamp :: $network+epoch+timestampMs+source ; $network! $:MoveNetwork, epoch! p:bigint, timestampMs! p:num, source! p:str, checkpointStart? p:bigint, checkpointEnd? p:bigint, validatorCount? p:num, totalStake? p:bigint
  Entity SuiObjectVersion :: $network+objectId+version+digest ; $network! $:MoveNetwork, objectId! p:str, version! p:bigint, digest! p:str, ownerSelector? p:json, previousTransaction? p:str, storageRebate? p:bigint
  Entity SuiDynamicFieldEdge :: $parentObject+fieldNameHash+childObjectId ; $parentObject! $:MoveObject, fieldNameHash! p:str, childObjectId! p:str, fieldName? p:json, fieldType? p:str, childObjectType? p:str
  Entity AptosAccountResource :: $network+accountAddress+resourceType ; $network! $:MoveNetwork, accountAddress! p:str, resourceType! p:str, $$timestamps* $:MoveResource_Timestamp
  Entity AptosTableItem :: $network+tableHandle+keyHash ; $network! $:MoveNetwork, tableHandle! p:str, keyHash! p:hex, key? p:json, valueType? p:str, $$timestamps* $:StateSnapshot
  Entity MoveResource :: $account+resourceType ; $account! $:MoveAccount, resourceType! p:str, $$timestamps* $:MoveResource_Timestamp
  Entity MoveResource_Timestamp :: $resource+timestampMs+source ; $resource! $:MoveResource, timestampMs! p:num, source! p:str, value? p:json
  Entity MoveEvent :: $network+transactionDigest+eventIndex ; $network! $:MoveNetwork, transactionDigest! p:str, eventIndex! p:num, eventType! p:str, packageId? p:str, moduleName? p:str, sender? p:str, value? p:json
  Entity XrplNetwork :: $network ; $network! $:Network, $$ledgers* $:XrplLedger, $$transactions* $:XrplTransaction, $$accounts* $:XrplAccount, $$ledgerEntries* $:XrplLedgerEntry, $$amendments* $:XrplAmendment, $$timestamps* $:XrplNetwork_Timestamp
  Entity XrplLedger :: $network+ledgerIndex | $network+ledgerHash ; $network! $:XrplNetwork, ledgerIndex? p:bigint, ledgerHash? p:hex, closeTimeMs? p:num, validated? p:bool, totalCoins? p:bigint, parentHash? p:hex
  Entity XrplTransaction :: $network+hash ; $network! $:XrplNetwork, hash! p:hex, transactionType! p:enum, account! p:str, sequence? p:num, ledgerIndex? p:bigint, fee? p:bigint, status? p:enum, meta? p:json, $$affectedEntries* $:XrplLedgerEntry
  Entity XrplAccount :: $network+account ; $network! $:XrplNetwork, account! p:str, $$ledgerEntries* $:XrplLedgerEntry, $$transactions* $:XrplTransaction, $$trustlines* $:XrplTrustline, $$timestamps* $:XrplAccount_Timestamp
  Entity XrplLedgerEntry :: $network+ledgerIndex+entryIndex | $network+ledgerHash+entryHash ; $network! $:XrplNetwork, ledgerIndex? p:bigint, ledgerHash? p:hex, entryHash? p:hex, entryType! p:enum, account? p:str, fields? p:json
  Entity XrplTrustline :: $network+account+currency+issuer ; $network! $:XrplNetwork, account! p:str, currency! p:str, issuer! p:str, $$timestamps* $:XrplTrustline_Timestamp
  Entity XrplAmendment :: $network+amendmentId ; $network! $:XrplNetwork, amendmentId! p:hex, name? p:str, status! p:enum, enabledAtLedger? p:bigint
  Entity StellarNetwork :: $network ; $network! $:Network, passphrase? p:str, $$ledgers* $:StellarLedger, $$transactions* $:StellarTransaction, $$operations* $:StellarOperation, $$accounts* $:StellarAccount, $$assets* $:StellarAsset, $$contracts* $:SorobanContract, $$timestamps* $:StellarNetwork_Timestamp
  Entity StellarLedger :: $network+sequence ; $network! $:StellarNetwork, sequence! p:bigint, hash? p:hex, closeTimeMs? p:num, protocolVersion? p:num, operationCount? p:num
  Entity StellarTransaction :: $network+hash ; $network! $:StellarNetwork, hash! p:hex, ledgerSequence? p:bigint, sourceAccount? p:str, feeCharged? p:bigint, memo? p:json, status? p:enum, $$operations* $:StellarOperation
  Entity StellarOperation :: $transaction+operationIndex ; $transaction! $:StellarTransaction, operationIndex! p:num, operationType! p:enum, sourceAccount? p:str, body? p:json
  Entity StellarAccount :: $network+accountId ; $network! $:StellarNetwork, accountId! p:str, $$trustlines* $:StellarTrustline, $$transactions* $:StellarTransaction, $$timestamps* $:StellarAccount_Timestamp
  Entity StellarAsset :: $network+assetCode+issuer | $network+nativeAsset ; $network! $:StellarNetwork, assetCode? p:str, issuer? p:str, nativeAsset? p:bool, $$trustlines* $:StellarTrustline
  Entity StellarTrustline :: $account+$asset ; $account! $:StellarAccount, $asset! $:StellarAsset, $$timestamps* $:StellarTrustline_Timestamp
  Entity SorobanContract :: $network+contractId ; $network! $:StellarNetwork, contractId! p:str, wasmHash? p:hex, $$operations* $:RuntimeOperation, $$storage* $:StateObject
  Entity CardanoNetwork :: $network ; $network! $:Network, era? p:enum, $$blocks* $:CardanoBlock, $$transactions* $:CardanoTransaction, $$addresses* $:CardanoAddress, $$stakePools* $:CardanoStakePool, $$assets* $:CardanoNativeAsset, $$timestamps* $:CardanoNetwork_Timestamp
  Entity CardanoBlock :: $network+slot | $network+hash ; $network! $:CardanoNetwork, slot? p:bigint, hash? p:hex, blockNo? p:bigint, epoch? p:num, era? p:enum, issuerVkey? p:hex, $$transactions* $:CardanoTransaction
  Entity CardanoTransaction :: $network+hash ; $network! $:CardanoNetwork, hash! p:hex, blockSlot? p:bigint, fee? p:bigint, validityStartSlot? p:bigint, ttlSlot? p:bigint, $$inputs* $:UtxoInput, $$outputs* $:UtxoOutput, $$scripts* $:CardanoScriptWitness, $$assets* $:CardanoNativeAsset
  Entity CardanoAddress :: $network+address ; $network! $:CardanoNetwork, address! p:str, addressKind? p:enum, paymentCredential? p:str, stakeCredential? p:str, $$utxos* $:UtxoOutput
  Entity CardanoStakePool :: $network+poolId ; $network! $:CardanoNetwork, poolId! p:str, vrfKeyHash? p:hex, pledge? p:bigint, margin? p:num, $$timestamps* $:CardanoStakePool_Timestamp
  Entity CardanoNativeAsset :: $network+policyId+assetName ; $network! $:CardanoNetwork, policyId! p:hex, assetName! p:hex, fingerprint? p:str, $$timestamps* $:AssetInstance_Timestamp
  Entity CardanoScriptWitness :: $transaction+witnessIndex ; $transaction! $:CardanoTransaction, witnessIndex! p:num, scriptKind! p:enum, language? p:enum, scriptHash? p:hex, datum? p:json, redeemer? p:json, executionUnits? p:json
  Entity AlgorandNetwork :: $network ; $network! $:Network, $$rounds* $:AlgorandRound, $$transactions* $:AlgorandTransaction, $$accounts* $:AlgorandAccount, $$assets* $:AlgorandAsset, $$applications* $:AlgorandApplication, $$timestamps* $:AlgorandNetwork_Timestamp
  Entity AlgorandRound :: $network+round ; $network! $:AlgorandNetwork, round! p:bigint, hash? p:hex, timestampMs? p:num, genesisHash? p:hex, proposer? p:str
  Entity AlgorandTransaction :: $network+txId ; $network! $:AlgorandNetwork, txId! p:str, round? p:bigint, sender! p:str, transactionType! p:enum, fee? p:bigint, group? p:hex, innerTxns? p:json
  Entity AlgorandAccount :: $network+address ; $network! $:AlgorandNetwork, address! p:str, $$assets* $:AlgorandAssetHolding, $$applications* $:AlgorandApplicationLocalState, $$timestamps* $:AlgorandAccount_Timestamp
  Entity AlgorandAsset :: $network+assetId ; $network! $:AlgorandNetwork, assetId! p:bigint, creator? p:str, unitName? p:str, decimals? p:num, manager? p:str, reserve? p:str, freeze? p:str, clawback? p:str, $$timestamps* $:AssetInstance_Timestamp
  Entity AlgorandApplication :: $network+applicationId ; $network! $:AlgorandNetwork, applicationId! p:bigint, creator? p:str, approvalProgramHash? p:hex, clearProgramHash? p:hex, $$boxes* $:AlgorandBox, $$timestamps* $:AlgorandApplication_Timestamp
  Entity AlgorandBox :: $application+boxName ; $application! $:AlgorandApplication, boxName! p:hex, $$timestamps* $:StateSnapshot
  Entity TonNetwork :: $network ; $network! $:Network, workchain? p:num, $$blocks* $:TonBlock, $$transactions* $:TonTransaction, $$accounts* $:TonAccount, $$contracts* $:TonContract, $$messages* $:TonMessage, $$timestamps* $:TonNetwork_Timestamp
  Entity TonBlock :: $network+workchain+shard+seqno ; $network! $:TonNetwork, workchain! p:num, shard! p:str, seqno! p:bigint, rootHash? p:hex, fileHash? p:hex, genUtimeMs? p:num
  Entity TonTransaction :: $network+account+lt+hash ; $network! $:TonNetwork, account! p:str, lt! p:bigint, hash! p:hex, nowMs? p:num, status? p:enum, $$inMessages* $:TonMessage, $$outMessages* $:TonMessage
  Entity TonAccount :: $network+address ; $network! $:TonNetwork, address! p:str, workchain? p:num, $$transactions* $:TonTransaction, $$timestamps* $:TonAccount_Timestamp
  Entity TonContract :: $network+address ; $network! $:TonNetwork, address! p:str, codeHash? p:hex, interfaceKind? p:enum, $account? $:TonAccount, $$operations* $:RuntimeOperation
  Entity TonMessage :: $network+messageHash ; $network! $:TonNetwork, messageHash! p:hex, messageKind! p:enum, source? p:str, destination? p:str, value? p:bigint, bodyHash? p:hex, cell? p:json
  Entity HederaNetwork :: $network ; $network! $:Network, shard? p:num, realm? p:num, $$transactions* $:HederaTransaction, $$accounts* $:HederaAccount, $$tokens* $:HederaToken, $$contracts* $:HederaContract, $$topics* $:HederaTopic, $$timestamps* $:HederaNetwork_Timestamp
  Entity HederaTransaction :: $network+transactionId | $network+consensusTimestamp ; $network! $:HederaNetwork, transactionId? p:str, consensusTimestamp? p:str, transactionType! p:enum, payerAccount? p:str, result? p:enum, chargedTxFee? p:bigint
  Entity HederaAccount :: $network+accountId ; $network! $:HederaNetwork, accountId! p:str, alias? p:str, evmAddress? p:evmAddress, key? p:json, $$tokens* $:HederaTokenAssociation, $$timestamps* $:HederaAccount_Timestamp
  Entity HederaToken :: $network+tokenId ; $network! $:HederaNetwork, tokenId! p:str, tokenType! p:enum, symbol? p:str, decimals? p:num, treasuryAccount? p:str, supplyKey? p:json, adminKey? p:json, freezeKey? p:json, wipeKey? p:json, $$timestamps* $:AssetInstance_Timestamp
  Entity HederaTokenAssociation :: $account+$token ; $account! $:HederaAccount, $token! $:HederaToken, associationStatus? p:enum, $$timestamps* $:HederaTokenAssociation_Timestamp
  Entity HederaContract :: $network+contractId ; $network! $:HederaNetwork, contractId! p:str, evmAddress? p:evmAddress, runtimeBytecodeHash? p:hex, $$operations* $:RuntimeOperation
  Entity HederaTopic :: $network+topicId ; $network! $:HederaNetwork, topicId! p:str, memo? p:str, submitKey? p:json, $$messages* $:HederaTopicMessage
  Entity IcpNetwork :: $network ; $network! $:Network, $$subnets* $:IcpSubnet, $$canisters* $:IcpCanister, $$blocks* $:IcpBlock, $$messages* $:IcpMessage, $$timestamps* $:IcpNetwork_Timestamp
  Entity IcpSubnet :: $network+subnetId ; $network! $:IcpNetwork, subnetId! p:str, subnetKind? p:enum, replicaVersion? p:str, $$canisters* $:IcpCanister, $$timestamps* $:IcpSubnet_Timestamp
  Entity IcpCanister :: $network+canisterId ; $network! $:IcpNetwork, canisterId! p:str, $subnet? $:IcpSubnet, moduleHash? p:hex, controllerSelectors* p:json, cyclesBalance? p:bigint, $$methods* $:RuntimeOperation, $$certifiedStates* $:IcpCertifiedState
  Entity IcpCertifiedState :: $canister+certificateHash ; $canister! $:IcpCanister, certificateHash! p:hex, treeHash? p:hex, certifiedAt? p:num, value? p:json
  Entity KaspaNetwork :: $network ; $network! $:Network, $$blocks* $:KaspaBlock, $$transactions* $:KaspaTransaction, $$addresses* $:KaspaAddress, $$timestamps* $:KaspaNetwork_Timestamp
  Entity KaspaBlock :: $network+blockHash ; $network! $:KaspaNetwork, blockHash! p:hex, blueScore? p:bigint, daaScore? p:bigint, selectedParentHash? p:hex, mergeSetBlues* p:hex, mergeSetReds* p:hex
  Entity KaspaTransaction :: $network+transactionId ; $network! $:KaspaNetwork, transactionId! p:hex, blockHashes* p:hex, $$inputs* $:UtxoInput, $$outputs* $:UtxoOutput
  Entity KaspaAddress :: $network+address ; $network! $:KaspaNetwork, address! p:str, $$transactions* $:KaspaTransaction, $$timestamps* $:KaspaAddress_Timestamp
  Entity TezosNetwork :: $network ; $network! $:Network, $$blocks* $:TezosBlock, $$operations* $:TezosOperation, $$accounts* $:TezosAccount, $$contracts* $:TezosContract, $$bakers* $:TezosBaker, $$timestamps* $:TezosNetwork_Timestamp
  Entity TezosBlock :: $network+level | $network+hash ; $network! $:TezosNetwork, level? p:bigint, hash? p:hex, timestampMs? p:num, protocolHash? p:hex, baker? p:str, $$operations* $:TezosOperation
  Entity TezosOperation :: $network+operationHash+contentIndex ; $network! $:TezosNetwork, operationHash! p:hex, contentIndex! p:num, operationKind! p:enum, source? p:str, destination? p:str, fee? p:bigint, gasLimit? p:bigint, storageLimit? p:bigint, parameters? p:json
  Entity TezosAccount :: $network+address ; $network! $:TezosNetwork, address! p:str, accountKind! p:enum, $$operations* $:TezosOperation, $$timestamps* $:TezosAccount_Timestamp
  Entity TezosContract :: $network+address ; $network! $:TezosNetwork, address! p:str, scriptHash? p:hex, storageType? p:json, parameterType? p:json, $$operations* $:TezosOperation, $$entrypoints* $:RuntimeOperation
  Entity TezosBaker :: $network+address ; $network! $:TezosNetwork, address! p:str, consensusKey? p:str, $$timestamps* $:TezosBaker_Timestamp
  Entity AvalancheSubnet :: subnetId ; subnetId! p:str, $system? $:NetworkSystem, $$validators* $:AvalancheValidator, $$chains* $:Network, $$timestamps* $:AvalancheSubnet_Timestamp
  Entity AvalancheValidator :: nodeId+subnetId ; nodeId! p:str, subnetId! p:str, startTimeMs? p:num, endTimeMs? p:num, stakeAmount? p:bigint, $network? $:Network
  Entity BnbBeaconNetwork :: $network ; $network! $:Network, $$blocks* $:BnbBeaconBlock, $$transactions* $:BnbBeaconTransaction, $$validators* $:BnbValidator, $$tokens* $:AssetInstance, $$timestamps* $:BnbBeaconNetwork_Timestamp
  Entity CronosNetworkProfile :: $network ; $network! $:Network, chainKind! p:enum, consensusKind? p:enum, validatorSelectors* p:json, $$ibcChannels* $:IbcChannel, $$timestamps* $:Network_Timestamp
  Source fulfillment :: protocol RPCs, official docs/specs, protocol registries, explorer/indexer mirrors, node/light-client APIs, XRPScan/XRPL Clio, Stellar Horizon/RPC, Blockfrost/Koios/Cardano DB Sync, Algorand Indexer, TON Center/TonAPI, Hedera Mirror Node, Sui JSON-RPC/GraphQL, Aptos fullnode/indexer APIs, Tezos TzKT/Conseil, ICP Rosetta/ledger/canister APIs, Kaspa node/indexers
  View organization :: NetworkView plus namespace-specific variants when fields exceed generic topology/execution/resources groups
  Proof gates :: timestamp-freshness, source-conflict, move-object-versioning, non-evm-network-route, top-coin-candidate-boundary
  Implementation starting point :: require one protocol-native selector fixture and one source pair before adding a new namespace implementation
  Top-coin boundary rule :: market-cap rank only selects review candidates. It never creates entity roots.
  Rejected alternatives :: one Move account/resource ontology for all dialects; mutable owner/content on stable MoveObject; package version as display-only metadata; privacy-network unknowns as false fields

Entity family: Non-EVM accounts, messages, transactions, and invocations
  Entity ProgramInterface :: interfaceId ; interfaceId! p:str, architecture! p:enum, name? p:str, version? p:str, schema? p:json, $standard? $:StandardReference
  Entity ProgramAction :: actionId ; actionId! p:str, architecture! p:enum, programSelector! p:json, actionName! p:str, inputSchema? p:json, outputSchema? p:json, $interface? $:ProgramInterface
  Entity SolanaTransaction :: $network+signature ; $network! $:SolanaNetwork, signature! p:str, version? p:enum, recentBlockhash? p:str, feeLamports? p:bigint, status? p:enum, err? p:json, $$signatures* $:Signature, $$accountKeys* $:SolanaTransactionAccount, $$addressLookupTables* $:SolanaAddressLookupTableUse, $$instructions* $:SolanaInstruction
  Entity SolanaTransactionAccount :: $transaction+accountIndex ; $transaction! $:SolanaTransaction, accountIndex! p:num, pubkey! p:str, signer! p:bool, writable! p:bool, source? p:enum, $account? $:SolanaAccount
  Entity SolanaAddressLookupTableUse :: $transaction+lookupTableIndex ; $transaction! $:SolanaTransaction, lookupTableIndex! p:num, accountKey! p:str, writableIndexes* p:num, readonlyIndexes* p:num
  Entity SolanaInstruction :: $transaction+instructionIndex | $transaction+instructionIndex+innerInstructionIndex ; $transaction! $:SolanaTransaction, instructionIndex! p:num, innerInstructionIndex? p:num, instructionKind! p:enum, $program? $:SolanaProgram, programId? p:str, data? p:str, parsedType? p:str, stackHeight? p:num, $$accounts* $:SolanaInstructionAccount
  Entity SolanaInstructionAccount :: $instruction+accountIndex ; $instruction! $:SolanaInstruction, accountIndex! p:num, pubkey! p:str, signer? p:bool, writable? p:bool, $account? $:SolanaAccount
  Entity CosmosTransaction :: $network+txHash ; $network! $:CosmosNetwork, txHash! p:str, chainId? p:str, height? p:bigint, txBodyBytesHash? p:hex32, authInfoBytesHash? p:hex32, memo? p:str, gasWanted? p:bigint, gasUsed? p:bigint, fee? p:json, status? p:enum, $$messages* $:CosmosMessage, $$signerInfos* $:CosmosSignerInfo
  Entity CosmosMessage :: $transaction+messageIndex ; $transaction! $:CosmosTransaction, messageIndex! p:num, typeUrl! p:str, value? p:json, signerSelector? p:json, $signer? $:CosmosAccount, $contract? $:CosmosContract
  Entity CosmosSignerInfo :: $transaction+signerIndex ; $transaction! $:CosmosTransaction, signerIndex! p:num, publicKey? p:json, modeInfo? p:json, sequence? p:bigint, signature? p:hex
  Entity PolkadotRuntimeMetadata :: $network+specVersion+transactionVersion ; $network! $:PolkadotNetwork, specVersion! p:num, transactionVersion! p:num, metadataHash? p:hex32, pallets? p:json, scaleInfo? p:json
  Entity PolkadotExtrinsic :: $block+extrinsicIndex | $network+hash ; $block? $:PolkadotBlock, $network! $:PolkadotNetwork, extrinsicIndex? p:num, hash? p:str, version? p:num, signed? p:bool, signer? p:str, signatureKind? p:enum, nonce? p:bigint, tip? p:bigint, eraKind? p:enum, eraPeriod? p:num, eraPhase? p:num, palletName? p:str, callName? p:str, callArgs? p:json, success? p:bool, $metadata? $:PolkadotRuntimeMetadata
  Entity NearTransaction :: $network+hash | $network+hash+signerAccountId ; $network! $:NearNetwork, hash! p:str, signerAccountId? p:str, receiverAccountId? p:str, publicKey? p:str, nonce? p:bigint, blockHash? p:str, status? p:enum, $$actions* $:NearAction, $$receipts* $:NearReceipt, $$outcomes* $:NearExecutionOutcome
  Entity NearAction :: $transaction+actionIndex ; $transaction! $:NearTransaction, actionIndex! p:num, actionKind! p:enum, methodName? p:str, args? p:json, depositYoctoNear? p:bigint, gas? p:bigint, receiverAccountId? p:str
  Entity NearReceipt :: $network+receiptId ; $network! $:NearNetwork, receiptId! p:str, predecessorId? p:str, receiverId? p:str, receiptKind? p:enum, $$actions* $:NearAction, $$outcomes* $:NearExecutionOutcome
  Entity NearExecutionOutcome :: $network+outcomeId ; $network! $:NearNetwork, outcomeId! p:str, status? p:enum, gasBurnt? p:bigint, tokensBurnt? p:bigint, executorId? p:str, logs* p:str, receiptIds* p:str
  Entity UtxoTransaction :: $network+txId ; $network! $:UtxoNetwork, txId! p:str, version? p:num, lockTime? p:num, sizeBytes? p:num, virtualSizeBytes? p:num, weightUnits? p:num, feeSats? p:bigint, isCoinbase? p:bool, $block? $:UtxoBlock, $$inputs* $:UtxoInput, $$outputs* $:UtxoOutput
  Entity UtxoInput :: $transaction+inputIndex ; $transaction! $:UtxoTransaction, inputIndex! p:num, $spentOutput? $:UtxoOutput, sequence? p:num, coinbaseScript? p:str, scriptSigAsm? p:str, witness* p:str
  Entity UtxoOutput :: $transaction+outputIndex ; $transaction! $:UtxoTransaction, outputIndex! p:num, valueSats? p:bigint, scriptPubKeyHex? p:str, scriptPubKeyAsm? p:str, scriptPubKeyType? p:str, $address? $:UtxoAddress, assetCommitment? p:str, valueCommitment? p:str, isConfidential? p:bool, spentStatus? p:enum
  Entity Psbt :: psbtId ; psbtId! p:str, psbtVersion? p:num, unsignedTxHash? p:hex32, base64? p:str, $$globalEntries* $:PsbtMapEntry, $$inputEntries* $:PsbtMapEntry, $$outputEntries* $:PsbtMapEntry
  Entity PsbtInput :: $psbt+inputIndex ; $psbt! $:Psbt, inputIndex! p:num, $utxoInput? $:UtxoInput, previousTxId? p:hex32, previousOutputIndex? p:num, witnessUtxo? p:json, nonWitnessUtxoHash? p:hex32, sighashType? p:num, finalScriptSig? p:hex, finalScriptWitness? p:json, finalizationStatus! p:enum, $$signatures* $:PsbtSignatureObservation
  Entity PsbtOutput :: $psbt+outputIndex ; $psbt! $:Psbt, outputIndex! p:num, $utxoOutput? $:UtxoOutput, amountSats? p:bigint, scriptPubKeyHex? p:hex, redeemScript? p:hex, witnessScript? p:hex, derivationPaths* p:json
  Entity PsbtMapEntry :: $psbt+mapKind+index+keyType+keyData ; $psbt! $:Psbt, mapKind! p:enum, index? p:num, keyType! p:str, keyData? p:hex, value? p:hex, decoded? p:json
  Entity PsbtSignatureObservation :: $psbtInput+pubkey+source ; $psbtInput! $:PsbtInput, pubkey! p:hex, source! p:str, signature? p:hex, signatureHashType? p:num, derivationPath? p:str, signerSelector? p:json, verificationStatus! p:enum, observedAtMs? p:num
  Entity PsbtExtraction :: $psbt+extractionAttempt ; $psbt! $:Psbt, extractionAttempt! p:num, status! p:enum, extractedTxHash? p:hex32, error? p:str, extractedAtMs? p:num
  Entity ScriptProgram :: scriptHash ; scriptHash! p:hex, scriptFamily! p:enum, bytecode? p:hex, descriptor? p:str, tapscriptLeafHash? p:hex, covenantTemplate? p:str, $standard? $:StandardReference
  Entity ScriptExecution :: $transaction+inputIndex ; $transaction! $:UtxoTransaction, inputIndex! p:num, $program? $:ScriptProgram, witnessStackHash? p:hex, controlBlockHash? p:hex, sighashType? p:num, success? p:bool, error? p:str
  Source fulfillment :: architecture-native RPCs/indexers, wallet standards, transaction/message specs, BIP-174/CAIP payload specs
  View organization :: TransactionView, AccountView, NetworkView
  Proof gates :: source-conflict, timestamp-freshness, psbt-map-roundtrip, bitcoin-script-evaluation
  Implementation starting point :: keep payloads architecture-native and map through shared readiness/simulation/submission/outcome rows only at write-flow boundaries
  Rejected alternatives :: PSBT as submitted transaction; wallet-local signer state as public chain evidence; PSBT replacing UtxoTransaction/Input/Output; covenant template as spend truth without script execution evidence

Entity family: EVM execution, contracts, traces, verification, account abstraction, and authorizations
  Entity EvmAccount :: address ; address! p:evmAddress, $$networkAccounts* $:EvmNetworkAccount
  Entity Account :: caip10 ; caip10! p:{namespace:str,reference:str,accountAddress:str}, $network! $:Network, address! p:str, $evmAccount? $:EvmAccount, $evmNetworkAccount? $:EvmNetworkAccount, $$balances* $:AssetBalance, $$positions* $:Position
  Entity EvmNetworkAccount :: $network+address ; $network! $:EvmNetwork, address! p:evmAddress, $account? $:Account, accountKind? p:enum, $$timestamps* $:EvmNetworkAccount_Timestamp, $$delegationAuthorizations* $:Eip7702Authorization, $$coinBalances* $:EvmNetworkActorCoinBalance, $$allowances* $:EvmActorCoinAllowance
  Entity EvmNetworkAccount_Timestamp :: $account+timestampMs+source ; $account! $:EvmNetworkAccount, timestampMs! p:num, source! p:str, nonce? p:bigint, balanceWei? p:bigint, codeHash? p:hex32, codeSize? p:num, blockNumber? p:bigint
  Entity EvmBlock :: $network+hash | $network+blockNumber ; $network! $:EvmNetwork, hash? p:hex32, blockNumber? p:bigint, timestampMs? p:num, parentHash? p:hex32, gasUsed? p:bigint, gasLimit? p:bigint, baseFeePerGas? p:bigint, $$transactions* $:EvmTransaction, $$logs* $:EvmLog
  Entity EvmBlob :: $network+txHash+blobIndex ; $network! $:EvmNetwork, txHash! p:hex32, blobIndex! p:num, versionedHash? p:hex32, commitment? p:hex, proof? p:hex
  Entity EvmTransaction :: $network+txHash ; $network! $:EvmNetwork, txHash! p:hex32, envelopeType? p:enum, kind? p:enum, chainId? p:bigint, from? p:evmAddress, to? p:evmAddress, value? p:bigint, nonce? p:bigint, gas? p:bigint, gasPrice? p:bigint, maxFeePerGas? p:bigint when envelopeType=1559|4844|7702, maxPriorityFeePerGas? p:bigint when envelopeType=1559|4844|7702, maxFeePerBlobGas? p:bigint when envelopeType=4844, blobVersionedHashes* p:hex32 when envelopeType=4844, input? p:hex, raw? p:hex, status? p:enum, $block? $:EvmBlock, $receipt? $:EvmTransactionReceipt, $$accessList* $:EvmAccessListEntry, $$authorizationList* $:Eip7702Authorization when envelopeType=7702, $$signatures* $:EvmSignature, $$logs* $:EvmLog, $$internalTransfers* $:EvmInternalTransfer, $$tokenTransfers* $:EvmTokenTransfer
  Entity EvmTransactionReceipt :: $transaction ; $transaction! $:EvmTransaction, status? p:enum, cumulativeGasUsed? p:bigint, gasUsed? p:bigint, effectiveGasPrice? p:bigint, contractAddress? p:evmAddress, logsBloom? p:hex, blobGasUsed? p:bigint, blobGasPrice? p:bigint
  Entity EvmAccessListEntry :: $transaction+address+slot ; $transaction! $:EvmTransaction, address! p:evmAddress, storageKey? p:hex32
  Entity Eip7702Authorization :: $network+authority+nonce+delegationAddress ; $network! $:EvmNetwork, authority! p:evmAddress, nonce! p:bigint, delegationAddress! p:evmAddress, chainId! p:bigint, yParity? p:num, r? p:hex32, s? p:hex32, $signature? $:EvmSignature
  Entity EvmSignature :: signatureId ; signatureId! p:str, signatureKind! p:enum, signerSelector? p:json, hash? p:hex32, r? p:hex32, s? p:hex32, v? p:str, yParity? p:num, scheme? p:enum, $$verifications* $:SignatureVerification
  Entity SignatureVerification :: verificationId ; verificationId! p:str, $signature! $:EvmSignature, subjectSelector! p:json, verificationKind! p:enum, status! p:enum, magicValue? p:hex4, checkedAt! p:num, $source? $:Source
  Entity EvmLog :: $network+txHash+logIndex ; $network! $:EvmNetwork, txHash! p:hex32, logIndex! p:num, $transaction! $:EvmTransaction, $block? $:EvmBlock, $emitter? $:EvmContract, topics* p:hex32, data? p:hex, removed? p:bool, $topic0? $:EvmTopic
  Entity EvmTopic :: hex ; hex! p:hex32, signature? p:str, textSignature? p:str
  Entity EvmSelector :: hex ; hex! p:hex4, signature? p:str, textSignature? p:str
  Entity EvmError :: hex ; hex! p:hex4, signature? p:str, textSignature? p:str
  Entity EvmCalldata :: hex ; hex! p:hex, $selector? $:EvmSelector, decoded? p:json, decodeStatus? p:enum, $interfaceMember? $:ContractInterfaceMember
  Entity EvmTrace :: $transaction+traceAddress ; $transaction! $:EvmTransaction, traceAddress! p:str, type? p:enum, from? p:evmAddress, to? p:evmAddress, value? p:bigint, input? p:hex, output? p:hex, error? p:str
  Entity EvmContract :: $network+address ; $network! $:EvmNetwork, address! p:evmAddress, $account? $:EvmNetworkAccount, runtimeCodeHash? p:hex32, creationTxHash? p:hex32, proxyKind? p:enum, $implementation? $:EvmContract, $$abis* $:EvmAbi, $$interfaceMembers* $:ContractInterfaceMember, $$verifications* $:EvmContractVerification, $$sourceBundles* $:EvmContractSourceBundle, $$storageReads* $:EvmStorageRead_Timestamp, $$tokenStandards* $:TokenStandardConformance
  Entity EvmAbi :: abiHash ; abiHash! p:hex32, json! p:json, source? p:str, $$members* $:ContractInterfaceMember, $$functions* $:EvmSelector, $$errors* $:EvmError, $$topics* $:EvmTopic
  Entity ContractInterfaceMember :: interfaceId+memberKey ; interfaceId! p:str, memberKey! p:str, memberKind! p:enum, name? p:str, canonicalSignature? p:str, selector? p:hex4, topic0? p:hex32, inputs? p:json, outputs? p:json, stateMutability? p:enum
  Entity EvmStorageRead_Timestamp :: $contract+slot+timestampMs+source ; $contract! $:EvmContract, slot! p:hex32, timestampMs! p:num, source! p:str, value? p:hex32, blockNumber? p:bigint
  Entity EvmContractSourceBundle :: bundleHash ; bundleHash! p:hex32, $contract! $:EvmContract, language? p:str, compiler? p:str, files* p:json
  Entity EvmContractCompilation :: compilationId ; compilationId! p:str, compiler! p:str, version! p:str, settings? p:json, outputHash? p:hex32
  Entity EvmContractVerification :: $contract+source+verificationId ; $contract! $:EvmContract, source! p:str, verificationId! p:str, status! p:enum, timestampMs? p:num, $compilation? $:EvmContractCompilation
  Entity Erc4337SmartAccount :: $network+address ; $network! $:EvmNetwork, address! p:evmAddress, $account? $:EvmNetworkAccount, $$userOperations* $:EvmUserOperation
  Entity Erc4337EntryPoint :: $network+address+version ; $network! $:EvmNetwork, address! p:evmAddress, version! p:str, deployedAtBlock? p:bigint, $contract? $:EvmContract, standardUrl? p:url, $$bundlers* $:Erc4337Bundler, $$userOperations* $:EvmUserOperation
  Entity Erc4337Bundler :: $network+address ; $network! $:EvmNetwork, address! p:evmAddress, $$userOperations* $:EvmUserOperation
  Entity Erc4337Paymaster :: $network+address ; $network! $:EvmNetwork, address! p:evmAddress, $$userOperations* $:EvmUserOperation
  Entity Erc4337PaymasterPolicy :: $paymaster+policyKey ; $paymaster! $:Erc4337Paymaster, policyKey! p:str, policyKind! p:enum, sponsorSelector? p:json, validationRule? p:json, validFromMs? p:num, validToMs? p:num, $source? $:Source
  Entity Erc4337AccountFactory :: $network+address ; $network! $:EvmNetwork, address! p:evmAddress, $$createdAccounts* $:Erc4337SmartAccount
  Entity EvmUserOperation :: $network+userOperationHash ; $network! $:EvmNetwork, userOperationHash! p:hex32, sender! p:evmAddress, nonce? p:bigint, initCode? p:hex, callData? p:hex, paymasterAndData? p:hex, signature? p:hex, validationStatus? p:enum, executionStatus? p:enum, validAfter? p:num, validUntil? p:num, $entryPoint? $:Erc4337EntryPoint, $transaction? $:EvmTransaction, $smartAccount? $:Erc4337SmartAccount, $bundler? $:Erc4337Bundler, $paymaster? $:Erc4337Paymaster, $factory? $:Erc4337AccountFactory, $$simulations* $:Simulation, $$mempoolObservations* $:Erc4337MempoolObservation, $receipt? $:Erc4337UserOperationReceipt
  Entity Erc4337UserOperationReceipt :: $userOperation ; $userOperation! $:EvmUserOperation, actualGasCost? p:bigint, actualGasUsed? p:bigint, success? p:bool, reason? p:hex, logs* p:json, $transaction? $:EvmTransaction
  Entity Erc4337MempoolObservation :: $userOperation+source+timestampMs ; $userOperation! $:EvmUserOperation, source! p:str, timestampMs! p:num, mempoolKind! p:enum, validationStatus? p:enum, replacementStatus? p:enum, simulationError? p:str, bundlerEndpoint? p:url
  Entity Erc4337Deposit_Timestamp :: $network+entryPoint+account+timestampMs+source ; $network! $:EvmNetwork, entryPoint! p:evmAddress, account! p:evmAddress, timestampMs! p:num, source! p:str, deposit? p:bigint, stake? p:bigint, unstakeDelaySec? p:num, withdrawTime? p:num
  Source fulfillment :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Sourcify_Rest, FourbyteDirectory_Rest, ERC/EIP specs, bundler/paymaster RPCs
  View organization :: TransactionView, ContractView, AccountView, EvmNetworkView
  Proof gates :: proof-artifact, list-evm-transactions, source-conflict, erc4337-entrypoint-useroperation
  Implementation starting point :: separate transaction envelopes, signatures, receipts, traces, verification, 4337, and 7702 authorization state
  Rejected alternatives :: UserOperation as EvmTransaction; bundler support as stable network capability; paymaster deposit/stake on stable paymaster identity

Entity family: Assets, tokens, ownership rights, balances, and supplies
  Entity Asset :: assetId ; assetId! p:str, name? p:str, symbol? p:str, kind! p:enum, fungibilityKind? p:enum, supplyModel? p:enum, rightsModel? p:enum, $$instances* $:AssetInstance, $$classes* $:AssetClass, $$metadata* $:TokenMetadataDocument
  Entity AssetInstance :: caip19 | $network+assetNamespace+assetReference ; caip19? p:str, $network! $:Network, assetNamespace! p:str, assetReference! p:str, kind! p:enum, $asset? $:Asset, decimals? p:num, contractOrProgramSelector? p:json, $issuer? $:Account, $$standardConformance* $:TokenStandardConformance, $$interfaceSupport* $:TokenInterfaceSupport, $$programExtensions* $:TokenProgramExtension, $$classes* $:AssetClass, $$objects* $:AssetObject, $$balances* $:AssetBalance, $$authorizations* $:AssetAuthorization, $$supplyTimestamps* $:AssetSupply_Timestamp
  Entity EvmCoinInstance :: $network+coinId | $network+contractAddress ; $network! $:EvmNetwork, coinId? p:str, contractAddress? p:evmAddress, type! p:enum, $coin? $:Coin, $assetInstance? $:AssetInstance
  Entity Coin :: coinId ; coinId! p:str, name! p:str, symbol! p:str, $$instances* $:EvmCoinInstance, $$timestamps* $:Coin_Timestamp
  Entity Coin_Timestamp :: $coin+timestampMs+source ; $coin! $:Coin, timestampMs! p:num, source! p:str, priceUsd? p:num, marketCapUsd? p:num, volumeUsd? p:num
  Entity AssetClass :: $assetInstance+classKey ; $assetInstance! $:AssetInstance, classKey! p:str, classKind! p:enum, label? p:str, slot? p:str, partition? p:str, series? p:str, maturityMs? p:num, valueDecimals? p:num, rights* p:str, $$objects* $:AssetObject, $$supplyTimestamps* $:AssetSupply_Timestamp
  Entity AssetObject :: $assetInstance+objectKey ; $assetInstance! $:AssetInstance, objectKey! p:str, objectKind! p:enum, $class? $:AssetClass, tokenId? p:str, slot? p:str, metadataUri? p:url, $$balances* $:AssetObjectBalance, $$metadata* $:TokenMetadataDocument
  Entity AssetSupply_Timestamp :: $assetInstance+classKey+timestampMs+source ; $assetInstance! $:AssetInstance, classKey? p:str, timestampMs! p:num, source! p:str, totalSupply? p:bigint, circulatingSupply? p:bigint, burnedSupply? p:bigint, methodology? p:str
  Entity AssetBalance :: $account+$assetInstance+balanceKey ; $account! $:Account, $assetInstance! $:AssetInstance, balanceKey! p:str, $class? $:AssetClass, $object? $:AssetObject, balanceKind! p:enum, $$timestamps* $:AssetBalance_Timestamp
  Entity AssetBalance_Timestamp :: $assetBalance+timestampMs+source ; $assetBalance! $:AssetBalance, timestampMs! p:num, source! p:str, total? p:bigint, transferable? p:bigint, locked? p:bigint, frozen? p:bigint, escrowed? p:bigint, blockKey? p:str
  Entity AssetObjectBalance :: $object+$account ; $object! $:AssetObject, $account! $:Account, $$timestamps* $:AssetBalance_Timestamp
  Entity EvmNetworkActorCoinBalance :: $network+owner+coin ; $network! $:EvmNetwork, owner! p:evmAddress, coin! p:str, $$timestamps* $:EvmNetworkActorCoinBalance_Timestamp
  Entity EvmNetworkActorCoinBalance_Timestamp :: $balance+timestampMs+source ; $balance! $:EvmNetworkActorCoinBalance, timestampMs! p:num, source! p:str, total? p:bigint, transferable? p:bigint, blockNumber? p:bigint
  Entity EvmActorCoinAllowance :: $network+owner+coin+spender ; $network! $:EvmNetwork, owner! p:evmAddress, coin! p:str, spender! p:evmAddress, $$timestamps* $:EvmActorCoinAllowance_Timestamp
  Entity EvmActorCoinAllowance_Timestamp :: $allowance+timestampMs+source ; $allowance! $:EvmActorCoinAllowance, timestampMs! p:num, source! p:str, allowance? p:bigint, blockNumber? p:bigint
  Entity AssetAuthorization :: authorizationId ; authorizationId! p:str, $assetInstance! $:AssetInstance, ownerSelector! p:json, operatorSelector! p:json, authorizationKind! p:enum, $class? $:AssetClass, $object? $:AssetObject, $$timestamps* $:AssetAuthorization_Timestamp
  Entity AssetAuthorization_Timestamp :: $authorization+timestampMs+source ; $authorization! $:AssetAuthorization, timestampMs! p:num, source! p:str, amount? p:bigint, approved? p:bool, expiresAt? p:num, blockKey? p:str
  Entity TokenStandardConformance :: $assetInstance+standard+subject ; $assetInstance! $:AssetInstance, standard! p:str, subjectSelector! p:json, confidence! p:enum, standardStatus? p:enum, $interface? $:InterfaceArtifact, $standardReference? $:StandardReference, $source? $:Source
  Entity TokenInterfaceSupport :: $assetInstance+interfaceId ; $assetInstance! $:AssetInstance, interfaceId! p:hex4, standard? p:str, supportStatus! p:enum, checkedAt? p:num, $source? $:Source
  Entity TokenProgramExtension :: $assetInstance+extensionKind ; $assetInstance! $:AssetInstance, extensionKind! p:enum, extensionScope! p:enum, config? p:json, authoritySelector? p:json, observedAt? p:num, $source? $:Source
  Entity TokenMetadataDocument :: $assetInstance+metadataKey+timestampMs ; $assetInstance! $:AssetInstance, metadataKey! p:str, timestampMs! p:num, uri? p:url, contentHash? p:str, name? p:str, symbol? p:str, description? p:str, attributes? p:json, mutable? p:bool, metadataStandard? p:str, $object? $:AssetObject, $media? $:MediaObject, $source? $:Source
  Entity NftCollection :: $assetInstance ; $assetInstance! $:AssetInstance, name? p:str, symbol? p:str, $$tokens* $:NftToken, $$royalties* $:RoyaltyRight
  Entity NftToken :: $collection+tokenKey ; $collection! $:NftCollection, tokenKey! p:str, tokenId? p:bigint, owner? p:json, amount? p:bigint, $metadata? $:TokenMetadataDocument, $$usageRights* $:UsageRight
  Entity RoyaltyRight :: royaltyId ; royaltyId! p:str, subjectType! p:str, subjectSelector! p:json, receiver! p:json, basisPoints? p:num, calculationKind! p:enum, salePriceDenominationPolicy? p:enum, $source? $:Source
  Entity UsageRight :: usageRightId ; usageRightId! p:str, subjectType! p:str, subjectSelector! p:json, user! p:json, expiresAt? p:num, rightKind! p:enum
  Entity TransferRestriction :: restrictionId ; restrictionId! p:str, subjectType! p:str, subjectSelector! p:json, restrictionKind! p:enum, accountSelector? p:json, amount? p:bigint, reason? p:str, ruleSelector? p:json, validFromMs? p:num, validToMs? p:num, $source? $:Source
  Entity AssetEligibility :: $assetInstance+$account+timestampMs+source ; $assetInstance! $:AssetInstance, $account! $:Account, timestampMs! p:num, source! p:str, canHold? p:bool, canSend? p:bool, canReceive? p:bool, reasons* p:str
  Entity RegulatedAssetProfile :: $assetInstance ; $assetInstance! $:AssetInstance, standard! p:enum, $identityRegistry? $:EvmContract, $compliance? $:EvmContract, $trustedIssuersRegistry? $:EvmContract, $claimTopicsRegistry? $:EvmContract, paused? p:bool, $$issuerPowers* $:IssuerPower, $$claimRequirements* $:ClaimTopicRequirement, $$trustedIssuers* $:TrustedIssuer, $$complianceModules* $:ComplianceModule, $$restrictions* $:TransferRestriction
  Entity ClaimTopicRequirement :: $profile+topicKey ; $profile! $:RegulatedAssetProfile, topicKey! p:str, claimTopic? p:bigint, requiredIssuerSelector? p:json, countryScope? p:str
  Entity TrustedIssuer :: $profile+issuerKey ; $profile! $:RegulatedAssetProfile, issuerKey! p:str, issuerSelector! p:json, claimTopics* p:str
  Entity ComplianceModule :: $profile+moduleKey ; $profile! $:RegulatedAssetProfile, moduleKey! p:str, moduleSelector! p:json, ruleKind? p:enum, config? p:json
  Entity IssuerPower :: issuerPowerId ; issuerPowerId! p:str, $assetInstance! $:AssetInstance, powerKind! p:enum, actorSelector? p:json, scope? p:json, $source? $:Source
  Entity IssuerAction :: issuerActionId ; issuerActionId! p:str, actionKind! p:enum, $assetInstance! $:AssetInstance, $issuerAuthority? $:AuthorityGrant, targetSelector? p:json, amount? p:bigint, $issuerPower? $:IssuerPower, $payload? $:Payload, $submission? $:Submission, $outcome? $:Outcome
  Entity Payout :: payoutId ; payoutId! p:str, $assetInstance! $:AssetInstance, $assetClass? $:AssetClass, snapshotCoordinate? p:str, paymentAsset? p:json, amount? p:bigint, claimStatus? p:enum, $outcome? $:Outcome
  Entity DenomTrace :: $network+denom ; $network! $:Network, denom! p:str, baseDenom? p:str, path? p:str, sourcePort? p:str, sourceChannel? p:str, destinationPort? p:str, destinationChannel? p:str, $assetInstance? $:AssetInstance
  Source fulfillment :: TokenLists, TrustWalletAssets, CoinGecko_Rest, onchain metadata, token standard specs, issuer/compliance registries
  View organization :: AssetView, MarketView, AccountView
  Proof gates :: timestamp-freshness, source-conflict
  Implementation starting point :: keep supply/balance/metadata observations timestamped and separate asset definition, chain instance, class, object, and rights rows

Entity family: Markets, prices, oracle feeds, liquidity, lending, derivatives, and bridges
  Entity Currency :: iso4217 ; iso4217! p:str, name! p:str, symbol? p:str, decimals? p:num, $$timestamps* $:Currency_Timestamp
  Entity Currency_Timestamp :: $currency+timestampMs+source ; $currency! $:Currency, timestampMs! p:num, source! p:str, usdRate? p:num
  Entity MarketVenue :: venueId ; venueId! p:str, label! p:str, kind! p:enum, url? p:url
  Entity Market :: $base+$quote+$marketVenue+marketKind | marketKey ; $base? $:AssetInstance, $quote? $:AssetInstance, $marketVenue? $:MarketVenue, marketKind! p:enum, marketKey? p:str, $$legObservations* $:MarketLegSourceObservation, $$prices* $:MarketPrice, $$orderBooks* $:OrderBook, $$timestamps* $:Market_Timestamp, $$candles* $:Market_TimeInterval_Timestamp
  Entity MarketLegSourceObservation :: $market+legKey+source+timestampMs ; $market! $:Market, legKey! p:enum, source! p:str, timestampMs! p:num, providerAssetId? p:str, normalizedAssetSelector? p:json, confidence! p:enum
  Entity MarketPrice :: $market+timestampMs+source ; $market! $:Market, timestampMs! p:num, source! p:str, price! p:num, quoteUnit? p:str
  Entity Market_Timestamp :: $market+timestampMs+source ; $market! $:Market, timestampMs! p:num, source! p:str, price? p:num, volume? p:num, liquidity? p:num, marketCap? p:num
  Entity Market_TimeInterval_Timestamp :: $market+timeInterval+timestampMs+source ; $market! $:Market, timeInterval! p:str, timestampMs! p:num, source! p:str, open? p:num, high? p:num, low? p:num, close? p:num, volume? p:num
  Entity OrderBook :: $market+bookKey ; $market! $:Market, bookKey! p:str, bookKind! p:enum, $venue? $:MarketVenue, $$timestamps* $:OrderBook_Timestamp
  Entity OrderBook_Timestamp :: $orderBook+timestampMs+source ; $orderBook! $:OrderBook, timestampMs! p:num, source! p:str, bids? p:json, asks? p:json, spread? p:num, depth? p:json
  Entity OracleFeed :: feedKey ; feedKey! p:str, $market? $:Market, $network? $:Network, $contract? $:EvmContract, proxySelector? p:json, aggregatorSelector? p:json, heartbeatMs? p:num, deviationThreshold? p:num, $$marketClaims* $:OracleFeedMarketClaim, $$rounds* $:OracleFeed_Round
  Entity OracleFeedMarketClaim :: $feed+$market+source+timestampMs ; $feed! $:OracleFeed, $market! $:Market, source! p:str, timestampMs! p:num, claimKind! p:enum, evidenceMethod! p:enum, confidence! p:enum
  Entity OracleFeed_Round :: $feed+roundId ; $feed! $:OracleFeed, roundId! p:str, answer? p:num, startedAt? p:num, updatedAt? p:num, answeredInRound? p:str, freshnessStatus? p:enum
  Entity LiquidityPool :: poolKey ; poolKey! p:str, $network! $:Network, protocol! p:str, version? p:str, poolAddress? p:str, $$assets+ $:AssetInstance, $$timestamps* $:LiquidityPool_Timestamp, $$positions* $:LiquidityPosition
  Entity LiquidityPool_Timestamp :: $pool+timestampMs+source ; $pool! $:LiquidityPool, timestampMs! p:num, source! p:str, tvlUsd? p:num, volumeUsd? p:num, feeApr? p:num, price? p:num
  Entity Position :: positionId ; positionId! p:str, ownerSelector? p:json, positionKind! p:enum, subjectSelector! p:json, openedAt? p:num, closedAt? p:num, $$ownerObservations* $:PositionOwnerObservation, $$timestamps* $:Position_Timestamp
  Entity PositionOwnerObservation :: positionId+ownerSelectorHash+source+timestampMs ; positionId! p:str, ownerSelectorHash! p:str, source! p:str, timestampMs! p:num, ownerSelector! p:json, accountEntityType? p:str, confidence! p:enum
  Entity Position_Timestamp :: $position+timestampMs+source ; $position! $:Position, timestampMs! p:num, source! p:str, valueUsd? p:num, exposure? p:json, pnl? p:json, health? p:json, methodology? p:str
  Entity LiquidityPosition :: positionId ; positionId! p:str, $position? $:Position, ownerSelector? p:json, $pool! $:LiquidityPool, lowerTick? p:num, upperTick? p:num, $$timestamps* $:LiquidityPosition_Timestamp
  Entity LiquidityPosition_Timestamp :: $liquidityPosition+timestampMs+source ; $liquidityPosition! $:LiquidityPosition, timestampMs! p:num, source! p:str, liquidity? p:bigint, shareAmount? p:bigint, feesOwed? p:json, valueUsd? p:num
  Entity Vault :: vaultKey ; vaultKey! p:str, $network! $:Network, protocol! p:str, $asset! $:AssetInstance, $shareAsset? $:AssetInstance, standard? p:str, $$timestamps* $:Vault_Timestamp, $$positions* $:VaultSharePosition
  Entity Vault_Timestamp :: $vault+timestampMs+source ; $vault! $:Vault, timestampMs! p:num, source! p:str, totalAssets? p:bigint, totalSupply? p:bigint, convertToShares? p:json, convertToAssets? p:json, apr? p:num
  Entity VaultSharePosition :: positionId ; positionId! p:str, $position? $:Position, ownerSelector? p:json, $vault! $:Vault, $$timestamps* $:VaultSharePosition_Timestamp
  Entity VaultSharePosition_Timestamp :: $vaultSharePosition+timestampMs+source ; $vaultSharePosition! $:VaultSharePosition, timestampMs! p:num, source! p:str, shareBalance? p:bigint, assetEquivalent? p:bigint, valueUsd? p:num
  Entity LendingPosition :: positionId ; positionId! p:str, $position? $:Position, ownerSelector? p:json, protocol! p:str, $collateralAsset? $:AssetInstance, $debtAsset? $:AssetInstance, $$timestamps* $:LendingPosition_Timestamp
  Entity LendingPosition_Timestamp :: $lendingPosition+timestampMs+source ; $lendingPosition! $:LendingPosition, timestampMs! p:num, source! p:str, collateralAmount? p:bigint, debtAmount? p:bigint, healthFactor? p:num, liquidationPrice? p:num
  Entity BorrowPosition :: positionId ; positionId! p:str, $position? $:Position, ownerSelector? p:json, protocol! p:str, $asset! $:AssetInstance, maturityMs? p:num, $$timestamps* $:BorrowPosition_Timestamp
  Entity BorrowPosition_Timestamp :: $borrowPosition+timestampMs+source ; $borrowPosition! $:BorrowPosition, timestampMs! p:num, source! p:str, amount? p:bigint, rate? p:num, valueUsd? p:num
  Entity PerpPosition :: positionId ; positionId! p:str, $position? $:Position, ownerSelector? p:json, $market! $:Market, side! p:enum, $$timestamps* $:PerpPosition_Timestamp
  Entity PerpPosition_Timestamp :: $perpPosition+timestampMs+source ; $perpPosition! $:PerpPosition, timestampMs! p:num, source! p:str, notional? p:num, margin? p:num, funding? p:num, liquidationPrice? p:num, valueUsd? p:num
  Entity PredictionMarketPosition :: positionId ; positionId! p:str, $position? $:Position, ownerSelector? p:json, $market! $:Market, outcome! p:str, $$timestamps* $:PredictionMarketPosition_Timestamp
  Entity PredictionMarketPosition_Timestamp :: $predictionPosition+timestampMs+source ; $predictionPosition! $:PredictionMarketPosition, timestampMs! p:num, source! p:str, shares? p:num, avgPrice? p:num, valueUsd? p:num
  Entity IntentProtocol :: protocolId ; protocolId! p:str, protocolKind! p:enum, name! p:str, $network? $:Network, $resolver? $:EvmContract, orderPayloadFormat? p:str, $$orders* $:SolverOrder
  Entity Solver :: solverId ; solverId! p:str, label? p:str, operatorSelector? p:json, $service? $:AgentService, $$orders* $:SolverOrder
  Entity SolverOrder :: orderId ; orderId! p:str, $intent? $:Intent, $protocol? $:IntentProtocol, orderKind! p:enum, payload? p:hex, orderHash? p:hex32, digest? p:hex32, signatureKind? p:enum, status? p:enum, createdAt? p:num, validFrom? p:num, validTo? p:num, $$steps* $:SolverOrderStep, $$variables* $:SolverOrderVariable, $$payments* $:SolverOrderPayment, $$assumptions* $:SolverOrderAssumption, $$fills* $:OrderFill
  Entity SolverOrderStep :: $order+stepIndex ; $order! $:SolverOrder, stepIndex! p:num, stepKind! p:enum, targetSelector? p:json, selector? p:hex4, arguments? p:json, attributes? p:json, dependencyIndexes* p:num, revertPolicy? p:enum
  Entity SolverOrderVariable :: $order+variableIndex ; $order! $:SolverOrder, variableIndex! p:num, role! p:enum, value? p:json, dependencyIndexes* p:num
  Entity SolverOrderPayment :: $order+paymentIndex ; $order! $:SolverOrder, paymentIndex! p:num, paymentKind! p:enum, assetSelector? p:json, senderSelector? p:json, recipientVariableIndex? p:num, amountFormula? p:json, onStepIndex? p:num, estimatedDelayMs? p:num
  Entity SolverOrderAssumption :: $order+assumptionKey ; $order! $:SolverOrder, assumptionKey! p:str, name! p:str, data? p:json, validationStatus? p:enum
  Entity OrderFill :: fillId ; fillId! p:str, $order! $:SolverOrder, $solver? $:Solver, filledAt? p:num, status! p:enum, fillAmount? p:json, settlementSelector? p:json, $$submissions* $:Submission, $$outcomes* $:Outcome
  Entity StateChannel :: channelId ; channelId! p:str, $network? $:Network, protocol! p:str, participants+ p:json, status? p:enum, $$states* $:StateChannelState, $$transfers* $:StateChannelTransfer, $$deposits* $:StateChannelDeposit
  Entity StateChannelState :: $channel+stateNumber ; $channel! $:StateChannel, stateNumber! p:bigint, stateHash? p:hex, balances? p:json, signatures* p:json, timestampMs? p:num
  Entity StateChannelTransfer :: transferId ; transferId! p:str, $channel! $:StateChannel, from? p:json, to? p:json, asset? p:json, amount? p:bigint, status? p:enum
  Entity StateChannelDeposit :: depositId ; depositId! p:str, $channel! $:StateChannel, depositor? p:json, asset? p:json, amount? p:bigint, $transaction? $:EvmTransaction
  Entity PortfolioValuation_Timestamp :: $account+timestampMs+source ; $account! $:Account, timestampMs! p:num, source! p:str, totalUsd? p:num, positionsUsd? p:json, methodology? p:str
  Entity OracleFeedMethodology :: $feed+methodologyVersion ; $feed! $:OracleFeed, methodologyVersion! p:str, aggregationKind! p:enum, heartbeatMs? p:num, deviationBps? p:num, quorum? p:num, sourceUrl? p:url
  Entity OracleFeedDeviationObservation :: $feed+timestampMs+source ; $feed! $:OracleFeed, timestampMs! p:num, source! p:str, referencePrice? p:num, feedPrice? p:num, deviationBps? p:num, stale? p:bool, methodologyVersion? p:str
  Entity MarketMethodology :: venueKey+methodologyKey ; venueKey! p:str, methodologyKey! p:str, metricKind! p:enum, filters? p:json, washTradePolicy? p:enum, updateCadenceMs? p:num, sourceUrl? p:url
  Entity MarketSourceObservation :: $market+timestampMs+source ; $market! $:Market, timestampMs! p:num, source! p:str, price? p:num, volume? p:num, liquidity? p:num, providerAssetId? p:str, methodologyKey? p:str
  Entity IndexerLagObservation :: $source+$network+timestampMs ; $source! $:Source, $network! $:Network, timestampMs! p:num, headHeight? p:bigint, indexedHeight? p:bigint, lagBlocks? p:bigint, lagMs? p:num
  Entity SourceConflict :: entityType+fieldName+selectorHash+timestampMs ; entityType! p:str, fieldName! p:str, selectorHash! p:str, timestampMs! p:num, candidateValues! p:json, chosenSource? p:str, conflictKind! p:enum, resolutionPolicy! p:enum
  Entity BridgeTransferLifecycle :: $bridgeTransaction+phaseKey ; $bridgeTransaction! $:BridgeTransaction, phaseKey! p:str, phaseKind! p:enum, status! p:enum, txSelector? p:json, timestampMs? p:num, error? p:str
  Entity BridgeMessage :: $fromNetwork+messageId ; $fromNetwork! $:Network, messageId! p:str, $toNetwork? $:Network, sourceTxSelector? p:json, destinationTxSelector? p:json, nonce? p:bigint, payloadHash? p:hex, status! p:enum, $$attestations* $:BridgeAttestation
  Entity BridgeAttestation :: $bridgeMessage+attesterSelector ; $bridgeMessage! $:BridgeMessage, attesterSelector! p:json, signature? p:hex, quorumIndex? p:num, observedAtMs? p:num, verificationStatus! p:enum
  Entity BridgeRefund :: $bridgeTransaction+refundId ; $bridgeTransaction! $:BridgeTransaction, refundId! p:str, reason! p:enum, amount? p:bigint, assetSelector? p:json, txSelector? p:json, status! p:enum
  Entity IntentLifecycle :: $intent+phaseKey ; $intent! $:Intent, phaseKey! p:str, phaseKind! p:enum, readinessSelector? p:json, quoteSelector? p:json, orderSelector? p:json, payloadSelector? p:json, simulationSelector? p:json, submissionSelector? p:json, outcomeSelector? p:json, status! p:enum
  Entity PaymentLifecycle :: $paymentRequirement+phaseKey ; $paymentRequirement! $:PaymentRequirement, phaseKey! p:str, phaseKind! p:enum, status! p:enum, amount? p:bigint, assetSelector? p:json, txSelector? p:json, timestampMs? p:num
  Entity CrossChainMessageProtocol :: protocol+deploymentNetwork ; protocol! p:str, deploymentNetwork! p:str, trustModel! p:enum, verificationMode! p:enum, replayProtection? p:enum, feeModel? p:enum, $$messages* $:CrossChainMessage
  Entity CrossChainMessage :: $protocol+messageId | sourceTxSelector+messageIndex ; $protocol? $:CrossChainMessageProtocol, messageId? p:str, sourceTxSelector? p:json, messageIndex? p:num, sourceChain! p:str, destChain! p:str, nonce? p:bigint, payloadHash! p:hex, deliveryStatus! p:enum, $attestation? $:BridgeAttestation
  Entity CrossChainDelivery :: $message+deliveryAttempt ; $message! $:CrossChainMessage, deliveryAttempt! p:num, relayerSelector? p:json, feePaid? p:bigint, txSelector? p:json, status! p:enum, timestampMs? p:num
  Source fulfillment :: CoinGecko_Rest, DefiLlama_Rest, CoinMarketCap_Rest, Coinpaprika_Rest, Dexscreener_Rest, OracleContractRpc, ReferenceMarketFeeds, ChainlinkFeeds, bridge contracts/relayers; field relationships require MarketLegSourceObservation, OracleFeedMarketClaim, PositionOwnerObservation, SourceClaim, or VerificationResult unless protocol canonical
  View organization :: MarketView, OracleView, BridgeMessageView
  Proof gates :: timestamp-freshness, source-conflict, bridge-lifecycle, market-source-leg-claim, oracle-feed-market-claim, relationship-sourceability
  Implementation starting point :: add methodology rows before displaying chosen latest price/TVL/route values; lifecycle rows own quote/readiness/submission/outcome

Entity family: Intents, actions, payloads, simulations, submissions, and outcomes
  Entity Intent :: intentId ; intentId! p:str, intentKind! p:enum, createdAt! p:num, $account? $:Account, summary? p:str
  Entity TransferIntent :: intentId ; intentId! p:str, $intent! $:Intent, $fromAccount! $:Account, $toAccount? $:Account, toAddress? p:str, $asset! $:AssetInstance, amount! p:bigint
  Entity SwapIntent :: intentId ; intentId! p:str, $intent! $:Intent, $account! $:Account, $sellAsset! $:AssetInstance, $buyAsset! $:AssetInstance, sellAmount? p:bigint, buyAmount? p:bigint, slippageBps? p:num
  Entity BridgeIntent :: intentId ; intentId! p:str, $intent! $:Intent, $fromAccount! $:Account, $toAccount? $:Account, $fromNetwork! $:Network, $toNetwork! $:Network, $asset! $:AssetInstance, amount! p:bigint
  Entity ApprovalIntent :: intentId ; intentId! p:str, $intent! $:Intent, $owner! $:Account, $asset! $:AssetInstance, spender! p:json, amount? p:bigint, approvalKind! p:enum
  Entity ContractCallIntent :: intentId ; intentId! p:str, $intent! $:Intent, $account! $:Account, $contract! $:EvmContract, $interface? $:InterfaceArtifact, functionSelector? p:hex4, args? p:json, value? p:bigint
  Entity ProgramCallIntent :: intentId ; intentId! p:str, $intent! $:Intent, $account! $:Account, $network! $:Network, programSelector! p:json, operation! p:str, args? p:json
  Entity SocialPostIntent :: intentId ; intentId! p:str, $intent! $:Intent, protocol! p:enum, authorSelector! p:json, text? p:str, replyTo? p:json, embeds* p:json, media* p:json
  Entity AgentPromptIntent :: intentId ; intentId! p:str, $intent! $:Intent, $agentService? $:AgentService, $agentSession? $:AgentSession, prompt? p:str, attachments* p:json
  Entity PaymentIntent :: intentId ; intentId! p:str, $intent! $:Intent, $payer! $:Account, payee? p:json, asset? p:json, amount? p:bigint, $paymentRequirement? $:PaymentRequirement
  Entity Action :: actionId ; actionId! p:str, $intent! $:Intent, indexInSequence? p:num, status? p:enum, $$readiness* $:Readiness, $$quotes* $:Quote, $$orders* $:Order, $$routes* $:Route, $$payloads* $:Payload, $$simulations* $:Simulation, $$submissions* $:Submission, $$outcomes* $:Outcome
  Entity Readiness :: readinessId ; readinessId! p:str, $action! $:Action, status! p:enum, reasonKind! p:enum, reason! p:str, subjectType? p:str, subjectSelector? p:json, timestampMs! p:num
  Entity QuoteRequest :: quoteRequestId ; quoteRequestId! p:str, $intent! $:Intent, requestKind! p:enum, accountSelector? p:json, sellAssetSelector? p:json, buyAssetSelector? p:json, amount? p:bigint, constraints? p:json, createdAt! p:num
  Entity Quote :: quoteId ; quoteId! p:str, $intent! $:Intent, $quoteRequest? $:QuoteRequest, quoteKind! p:enum, requestHash! p:hex32, provider! p:str, createdAt! p:num, expiresAt? p:num, price? p:json, fees? p:json, assumptions* p:str, $route? $:Route, $payload? $:Payload, $solverOrder? $:SolverOrder
  Entity Order :: orderId ; orderId! p:str, $intent! $:Intent, orderKind! p:enum, orderHash? p:hex32, maker? p:json, solver? p:json, status? p:enum, deadline? p:num, settlement? p:json, $solverOrder? $:SolverOrder, $$fills* $:OrderFill
  Entity Route :: routeId ; routeId! p:str, $intent! $:Intent, routeKind! p:enum, $$steps* $:RouteStep, estimatedDurationMs? p:num, provider? p:str, score? p:num, tags* p:enum
  Entity RouteStep :: $route+stepIndex ; $route! $:Route, stepIndex! p:num, stepKind! p:enum, $bridgeDeployment? $:BridgeDeployment, $bridgePath? $:BridgePath, $liquidityPool? $:LiquidityPool, $solverOrderStep? $:SolverOrderStep, fromSelector? p:json, toSelector? p:json, payloadRef? p:json, dependencyIndexes* p:num
  Entity Payload :: payloadId ; payloadId! p:str, payloadKind! p:enum, $intent? $:Intent, $action? $:Action, bodyHash? p:hex32, reviewSummary? p:str, $$submissions* $:Submission
  Entity WalletRpcRequest :: requestId ; requestId! p:str, providerKind! p:enum, method! p:str, params? p:json, chainId? p:str, accountSelector? p:json, status! p:enum, errorCode? p:num, requestedAt! p:num, resolvedAt? p:num
  Entity WalletPermissionRequest :: permissionRequestId ; permissionRequestId! p:str, $walletRpcRequest? $:WalletRpcRequest, scopeKind! p:enum, chains* p:str, methods* p:str, events* p:str, accounts* p:str, status! p:enum
  Entity EvmTransactionPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, $network! $:EvmNetwork, envelopeType! p:enum, chainId! p:bigint, nonce? p:bigint, to? p:evmAddress, value? p:bigint, data? p:hex, gas? p:bigint, gasPrice? p:bigint, maxFeePerGas? p:bigint when envelopeType=1559|4844|7702, maxPriorityFeePerGas? p:bigint when envelopeType=1559|4844|7702, maxFeePerBlobGas? p:bigint when envelopeType=4844, blobVersionedHashes* p:hex32 when envelopeType=4844, accessList* p:json, $$authorizations* $:Eip7702AuthorizationPayload when envelopeType=7702
  Entity EvmCallPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, $network! $:EvmNetwork, from! p:evmAddress, to? p:evmAddress, value? p:bigint, data! p:hex, gas? p:bigint, fee? p:json, nonce? p:bigint, $calldata? $:EvmCalldata
  Entity Eip712Payload :: payloadId ; payloadId! p:str, $payload! $:Payload, domain! p:json, types! p:json, message! p:json, primaryType! p:str, domainSeparator? p:hex32, messageHash? p:hex32
  Entity EvmSignaturePayload :: payloadId ; payloadId! p:str, $payload! $:Payload, signatureKind! p:enum, hash? p:hex32, message? p:hex, $eip712? $:Eip712Payload, $signature? $:EvmSignature
  Entity Eip7702AuthorizationPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, chainId! p:bigint, address! p:evmAddress, nonce! p:bigint, yParity? p:num, r? p:hex32, s? p:hex32, signature? p:hex
  Entity UserOperationPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, $network! $:EvmNetwork, userOperation! p:json, entryPoint! p:evmAddress, sender! p:evmAddress, nonce? p:bigint, callData? p:hex, paymasterAndData? p:hex, signature? p:hex
  Entity SolanaInstructionPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, $network! $:SolanaNetwork, feePayer! p:str, version? p:enum, recentBlockhash? p:str, instructions+ p:json, accountMetas* p:json, addressLookupTables* p:json, computeBudget? p:json
  Entity CosmosMsgPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, $network! $:CosmosNetwork, chainId! p:str, signer! p:str, accountNumber? p:bigint, sequence? p:bigint, signMode? p:enum, messages+ p:json, fee? p:json, memo? p:str, timeoutHeight? p:bigint
  Entity SubstrateExtrinsicPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, $network! $:PolkadotNetwork, signer! p:str, pallet! p:str, call! p:str, args? p:json, specVersion? p:num, transactionVersion? p:num, genesisHash? p:hex32, blockHash? p:hex32, eraKind? p:enum, eraPeriod? p:num, eraPhase? p:num, nonce? p:bigint, tip? p:bigint
  Entity MoveCallPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, $network! $:Network, moveDialect! p:enum, package! p:str, module! p:str, function! p:str, typeArgs* p:str, args? p:json, objectRefs* p:json, gas? p:json
  Entity NearActionPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, $network! $:NearNetwork, signerAccountId! p:str, receiverAccountId! p:str, publicKey? p:str, nonce? p:bigint, blockHash? p:str, actions+ p:json
  Entity PsbtPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, $network! $:UtxoNetwork, psbt! p:str, $psbt? $:Psbt, inputs* p:json, outputs* p:json, fee? p:bigint, sighashPolicy? p:json
  Entity SocialPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, protocol! p:enum, request! p:json
  Entity AgentPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, protocol! p:enum, request! p:json
  Entity PaymentPayload :: payloadId ; payloadId! p:str, $payload! $:Payload, paymentProtocol! p:enum, request! p:json
  Entity Simulation :: simulationId ; simulationId! p:str, $payload! $:Payload, simulator! p:str, status! p:enum, gasUsed? p:bigint, stateDiff? p:json, logs? p:json, error? p:str
  Entity Submission :: submissionId ; submissionId! p:str, $payload! $:Payload, $authority? $:AuthorityGrant, submittedAt! p:num, transport! p:enum, requestId? p:str, status! p:enum, externalId? p:str
  Entity Outcome :: outcomeId ; outcomeId! p:str, $submission! $:Submission, observedAt! p:num, status! p:enum, resultSelector? p:json, receipt? p:json, error? p:str
  Source fulfillment :: wallet providers, simulation providers, protocol RPCs, bridge/solver quote APIs, local session/action rows
  View organization :: TransactionView, BridgeMessageView, AgentServiceView
  Proof gates :: bridge-lifecycle, wallet-auth-local, source-conflict
  Implementation starting point :: write flows always split intent, readiness, quote/order, route, payload, simulation, submission, outcome

Entity family: Local authority, wallets, sessions, rooms, panels, preferences, notifications, and drag state
  Entity Signer :: signerId ; signerId! p:str, signerKind! p:enum, address? p:str, publicKey? p:str, $account? $:Account
  Entity AuthorityGrant :: grantId ; grantId! p:str, grantKind! p:enum, subjectSelector! p:json, scope! p:json, validFromMs? p:num, expiresAt? p:num, $signer? $:Signer, source! p:enum
  Entity Authorization :: authorizationId ; authorizationId! p:str, authorizationKind! p:enum, ownerSelector! p:json, granteeSelector? p:json, assetSelector? p:json, amount? p:bigint, scope? p:json, observedAt? p:num, expiresAt? p:num, $source? $:Source
  Entity BlockheadWallet :: walletId ; walletId! p:str, label? p:str, walletKind! p:enum, rdns? p:str, icon? p:url, $$connections* $:BlockheadWalletConnection
  Entity BlockheadWalletConnection :: walletId+connectionId ; walletId! p:str, connectionId! p:str, $wallet! $:BlockheadWallet, status! p:enum, transportKind! p:enum, connectedAt? p:num, updatedAt? p:num, $$accounts* $:BlockheadWalletAccount, $$scopes* $:BlockheadWalletScope, $$capabilities* $:BlockheadWalletCapability
  Entity BlockheadWalletAccount :: walletId+accountId ; walletId! p:str, accountId! p:str, $connection! $:BlockheadWalletConnection, caip10! p:str, $account! $:Account, address! p:str, label? p:str, status! p:enum
  Entity BlockheadWalletScope :: walletId+scopeKey ; walletId! p:str, scopeKey! p:str, chains* p:str, methods* p:str, events* p:str, expiresAt? p:num
  Entity BlockheadWalletCapability :: walletId+capabilityKey ; walletId! p:str, capabilityKey! p:str, capabilityKind! p:enum, value? p:json, observedAt! p:num
  Entity BlockheadWatchedAccount :: watchedAccountId ; watchedAccountId! p:str, $account! $:Account, label? p:str, createdAt! p:num
  Entity BlockheadSession :: sessionId ; sessionId! p:str, title? p:str, status! p:enum, createdAt! p:num, updatedAt! p:num, $$actions* $:BlockheadSessionAction
  Entity BlockheadSessionAction :: sessionId+actionId ; sessionId! p:str, actionId! p:str, $session! $:BlockheadSession, indexInSequence! p:num, $action! $:Action, createdAt! p:num, updatedAt! p:num
  Entity BlockheadActionReadiness :: readinessId ; readinessId! p:str, $sessionAction! $:BlockheadSessionAction, $readiness! $:Readiness, visible! p:bool, acknowledgedAt? p:num
  Entity BlockheadSocialPostSession :: postSessionId ; postSessionId! p:str, protocol! p:enum, authorSelector! p:json, $intent? $:SocialPostIntent, $payload? $:SocialPayload, status! p:enum, createdAt! p:num, updatedAt! p:num
  Entity BlockheadAgentConversation :: conversationId ; conversationId! p:str, title? p:str, $agentSession? $:AgentSession, createdAt! p:num, updatedAt! p:num, $$turns* $:BlockheadAgentConversationTurn
  Entity BlockheadAgentConversationTurn :: conversationId+turnIndex ; conversationId! p:str, turnIndex! p:num, $conversation! $:BlockheadAgentConversation, role! p:enum, contentBlocks* p:json, $modelInvocation? $:ModelInvocation, $toolInvocation? $:ToolInvocation, createdAt! p:num
  Entity BlockheadRoom :: roomId ; roomId! p:str, label? p:str, createdAt! p:num, updatedAt! p:num, $$peers* $:BlockheadRoomPeer, $$sharedAddresses* $:BlockheadSharedAddress
  Entity BlockheadRoomPeer :: roomId+peerId ; roomId! p:str, peerId! p:str, $room! $:BlockheadRoom, label? p:str, status! p:enum, joinedAt? p:num
  Entity BlockheadSharedAddress :: roomId+addressKey ; roomId! p:str, addressKey! p:str, $room! $:BlockheadRoom, $account? $:Account, address! p:str, sharedByPeerId? p:str
  Entity BlockheadPanelTree :: panelTreeId ; panelTreeId! p:str, label? p:str, $rootNode? $:BlockheadPanelTreeNode, focusedPanelId? p:str, createdAt! p:num, updatedAt! p:num
  Entity BlockheadPanelTreeNode :: panelTreeId+nodeId ; panelTreeId! p:str, nodeId! p:str, nodeKind! p:enum, splitDirection? p:enum, splitRatio? p:num, $panel? $:BlockheadPanel, $$children* $:BlockheadPanelTreeNode
  Entity BlockheadPanel :: panelTreeId+panelId ; panelTreeId! p:str, panelId! p:str, $route? $:BlockheadPanelRoute, $$history* $:BlockheadPanelHistoryEntry
  Entity BlockheadPanelRoute :: panelTreeId+panelId+routeKey ; panelTreeId! p:str, panelId! p:str, routeKey! p:str, pathname! p:str, params? p:json, entityType? p:str, entitySelector? p:json
  Entity BlockheadPanelHistoryEntry :: panelTreeId+panelId+historyIndex ; panelTreeId! p:str, panelId! p:str, historyIndex! p:num, pathname! p:str, params? p:json, visitedAt! p:num
  Entity BlockheadSourcePreference :: source+profileId ; source! p:str, profileId! p:str, enabled! p:bool, priority? p:num, updatedAt! p:num
  Entity NotificationSubscription :: subscriptionId ; subscriptionId! p:str, channelKind! p:enum, targetSelector? p:json, consentStatus! p:enum, createdAt! p:num
  Entity NotificationTopic :: topicId ; topicId! p:str, topicKind! p:enum, subjectSelector? p:json, $$deliveries* $:NotificationDelivery
  Entity NotificationDelivery :: deliveryId ; deliveryId! p:str, $topic! $:NotificationTopic, $subscription? $:NotificationSubscription, deliveredAt? p:num, status! p:enum, payload? p:json, $readState? $:NotificationReadState
  Entity NotificationReadState :: deliveryId+profileId ; deliveryId! p:str, profileId! p:str, readAt? p:num, dismissedAt? p:num
  Entity DragPayload :: dragPayloadId ; dragPayloadId! p:str, entityType? p:str, entitySelector? p:json, context? p:json, $$intentOptions* $:Intent
  Entity TeeAttestation :: attestationHash | quoteHash ; attestationHash? p:hex, quoteHash? p:hex, teeKind! p:enum, measurement! p:hex, signerSelector? p:json, collateralStatus? p:enum, reportDataHash? p:hex, verifiedAtMs? p:num
  Entity ConfidentialComputeDeployment :: $protocolDeployment+enclaveId ; $protocolDeployment! $:ProtocolDeployment, enclaveId! p:str, $teeAttestation? $:TeeAttestation, keyReleasePolicy? p:json, upgradePolicy? p:enum, status! p:enum
  Entity FheCircuit :: $protocol+circuitId+version ; $protocol! $:Protocol, circuitId! p:str, version! p:str, scheme! p:enum, parameterSet? p:str, keyKind? p:enum, operationGraphHash? p:hex
  Entity EncryptedStateObject :: $network+objectKey | $contract+slotKey ; $network? $:Network, objectKey? p:str, $contract? $:Contract, slotKey? p:str, ciphertextHash! p:hex, encryptionScheme! p:enum, accessPolicy? p:json, $$timestamps* $:EncryptedStateObject_Timestamp
  Entity EncryptedStateObject_Timestamp :: $object+timestampMs+source ; $object! $:EncryptedStateObject, timestampMs! p:num, source! p:str, ciphertextHash! p:hex, accessPolicyHash? p:hex
  Entity MpcCeremony :: ceremonyId ; ceremonyId! p:str, purpose! p:enum, threshold? p:num, transcriptHash? p:hex, contributionCount? p:num, toxicWastePolicy? p:enum, transcriptUri? p:url
  Entity ThresholdKeySet :: $protocol+keySetId ; $protocol! $:Protocol, keySetId! p:str, threshold! p:num, participantCount! p:num, curve! p:str, rotationEpoch? p:bigint, $$participants* $:ThresholdKeyParticipant
  Entity ThresholdKeyParticipant :: $keySet+participantSelector ; $keySet! $:ThresholdKeySet, participantSelector! p:json, shareCommitment? p:hex, status! p:enum, joinedAtMs? p:num, exitedAtMs? p:num
  Entity ThresholdSigningObservation :: $keySet+messageHash+timestampMs+source ; $keySet! $:ThresholdKeySet, messageHash! p:hex, timestampMs! p:num, source! p:str, signerCount? p:num, thresholdMet? p:bool, signature? p:hex
  Entity WalletAuthMethod :: $wallet+methodKey ; $wallet! $:BlockheadWallet, methodKey! p:str, authKind! p:enum, curve? p:str, credentialId? p:str, origin? p:url, backupPolicy? p:enum, localOnly! p:bool
  Entity PasskeyCredential :: credentialId+rpId ; credentialId! p:str, rpId! p:str, publicKey? p:hex, counter? p:num, transports* p:enum, attestationFormat? p:str, localOnly! p:bool
  Entity SessionKeyGrant :: $account+grantId ; $account! $:Account, grantId! p:str, scope! p:json, spendLimit? p:bigint, assetSelector? p:json, validAfterMs? p:num, validUntilMs? p:num, revocationSelector? p:json, status! p:enum
  Entity BitcoinCovenantArtifact :: $network+txHash+vout | scriptHash ; $network? $:Network, txHash? p:hex, vout? p:num, scriptHash? p:hex, covenantKind! p:enum, scriptTemplate? p:str, tapscriptLeafHash? p:hex, spendPolicy? p:json
  Entity BitcoinCovenantSpendObservation :: $artifact+spendTxHash ; $artifact! $:BitcoinCovenantArtifact, spendTxHash! p:hex, inputIndex? p:num, witnessHash? p:hex, policySatisfied? p:bool, observedAtMs? p:num
  Entity RuntimeHostFunction :: $executionEnvironment+hostFunctionKey ; $executionEnvironment! $:ExecutionEnvironment, hostFunctionKey! p:str, module? p:str, signature? p:str, gasCostPolicy? p:str, determinismBoundary! p:enum, standardUrl? p:url
  Source fulfillment :: WalletRuntime, WebAuthnLocal, WalletStandardSpecs, local Blockhead authority state, attestation services, BitcoinCoreRpc, Esplora_Rest
  View organization :: WalletAuthView, AccountView, AgentTrustView
  Proof gates :: wallet-auth-local, agent-output-lineage
  Implementation starting point :: keep wallet/auth/passkey rows local-authority scoped and separate from public account identity

Entity family: Agents, tools, model providers, invocations, output artifacts, and payments
  Entity AgentRegistration :: registrationId ; registrationId! p:str, registryKind! p:enum, registrySelector! p:json, registeredSubjectSelector! p:json, serviceUri? p:url, contactEndpoint? p:url, trustTags* p:str, x402Supported? p:bool, active? p:bool, registeredAt? p:num, $source? $:Source, $verification? $:VerificationResult
  Entity AgentService :: serviceId ; serviceId! p:str, serviceKind! p:enum, name? p:str, serviceUri? p:url, $network? $:Network, $registration? $:AgentRegistration, $agentCard? $:AgentCard, protocols* p:enum, $$endpoints* $:AgentEndpoint, $$interfaces* $:AgentInterface, $$skills* $:AgentSkill, $$capabilities* $:AgentCapability, $$paymentRequirements* $:PaymentRequirement, $$trustSignals* $:AgentTrustSignal, $$validationRequests* $:AgentValidationRequest
  Entity AgentEndpoint :: $service+endpointKey ; $service! $:AgentService, endpointKey! p:str, protocol! p:enum, protocolVersion? p:str, url? p:url, transport? p:enum, authKind? p:enum, securitySchemes? p:json, accepts* p:str, produces* p:str
  Entity AgentCard :: cardId ; cardId! p:str, $service? $:AgentService, protocol! p:enum, cardUrl? p:url, version? p:str, provider? p:json, capabilities? p:json, securitySchemes? p:json, defaultInputModes* p:str, defaultOutputModes* p:str, fetchedAt? p:num, signatures* p:json
  Entity AgentInterface :: $service+interfaceKey ; $service! $:AgentService, interfaceKey! p:str, protocol! p:enum, method? p:str, inputSchema? p:json, outputSchema? p:json, streaming? p:bool
  Entity AgentSkill :: $service+skillId ; $service! $:AgentService, skillId! p:str, name? p:str, description? p:str, tags* p:str, inputModes* p:str, outputModes* p:str, examples* p:json
  Entity AgentCapability :: $service+capabilityKey ; $service! $:AgentService, capabilityKey! p:str, capabilityKind! p:enum, inputSchema? p:json, outputSchema? p:json, scopes* p:str, annotations? p:json, trustRequired? p:bool
  Entity AgentSession :: sessionId ; sessionId! p:str, $service? $:AgentService, protocol! p:enum, protocolSessionId? p:str, contextId? p:str, status! p:enum, createdAt! p:num, updatedAt! p:num, $$tasks* $:AgentTask, $$messages* $:AgentMessage, $$artifacts* $:AgentArtifact
  Entity AgentTask :: taskId ; taskId! p:str, $session! $:AgentSession, protocolTaskId? p:str, contextId? p:str, state! p:enum, kind? p:enum, createdAt! p:num, updatedAt! p:num, $$statusTimestamps* $:AgentTaskStatus_Timestamp, $$messages* $:AgentMessage, $$artifacts* $:AgentArtifact
  Entity AgentTaskStatus_Timestamp :: $task+timestampMs ; $task! $:AgentTask, timestampMs! p:num, state! p:enum, message? p:str, progress? p:json
  Entity AgentMessage :: messageId ; messageId! p:str, $session! $:AgentSession, $task? $:AgentTask, protocolMessageId? p:str, contextId? p:str, role! p:enum, kind? p:enum, createdAt! p:num, $$parts* $:AgentMessagePart
  Entity AgentMessagePart :: $message+partIndex ; $message! $:AgentMessage, partIndex! p:num, partKind! p:enum, text? p:str, data? p:json, uri? p:url, mime? p:str, metadata? p:json
  Entity AgentArtifact :: artifactId ; artifactId! p:str, $session! $:AgentSession, $task? $:AgentTask, artifactKind! p:enum, name? p:str, uri? p:url, contentHash? p:str, mime? p:str, createdAt! p:num, $$parts* $:AgentArtifactPart
  Entity AgentArtifactPart :: $artifact+partIndex ; $artifact! $:AgentArtifact, partIndex! p:num, partKind! p:enum, uri? p:url, text? p:str, data? p:json, mime? p:str
  Entity AgentTrustSignal :: trustSignalId ; trustSignalId! p:str, $service? $:AgentService, $registration? $:AgentRegistration, signalKind! p:enum, issuerSelector? p:json, score? p:num, value? p:json, observedAt! p:num, $source? $:Source, $verification? $:VerificationResult
  Entity AgentValidationRequest :: validationRequestId ; validationRequestId! p:str, $service? $:AgentService, $registration? $:AgentRegistration, validatorSelector! p:json, requestKind! p:enum, targetSelector! p:json, payload? p:json, requestedAt! p:num, $$results* $:AgentValidationResult
  Entity AgentValidationResult :: validationResultId ; validationResultId! p:str, $validationRequest! $:AgentValidationRequest, validatorSelector! p:json, resultKind! p:enum, score? p:num, evidence? p:json, observedAt! p:num, $source? $:Source
  Entity AcpSession :: sessionId ; sessionId! p:str, $agentSession! $:AgentSession, cwd? p:str, clientCapabilities? p:json, agentCapabilities? p:json, permissionMode? p:enum, $$fileGrants* $:AcpFileAccessGrant, $$terminals* $:AcpTerminal
  Entity AcpFileAccessGrant :: $session+path ; $session! $:AcpSession, path! p:str, accessKind! p:enum, scope? p:enum, grantedAt? p:num, expiresAt? p:num
  Entity AcpTerminal :: $session+terminalId ; $session! $:AcpSession, terminalId! p:str, cwd? p:str, command? p:str, status! p:enum, createdAt! p:num, updatedAt! p:num
  Entity McpServer :: serverId ; serverId! p:str, label? p:str, transport! p:enum, url? p:url, protocolVersion? p:str, capabilities? p:json, authKind? p:enum, $$sessions* $:McpSession, $$tools* $:McpTool, $$resources* $:McpResource, $$prompts* $:McpPrompt, $$roots* $:McpRoot
  Entity McpSession :: sessionId ; sessionId! p:str, $server! $:McpServer, initializedAt? p:num, protocolVersion? p:str, clientInfo? p:json, serverInfo? p:json, capabilities? p:json
  Entity McpTool :: $server+toolName ; $server! $:McpServer, toolName! p:str, title? p:str, description? p:str, inputSchema? p:json, outputSchema? p:json, annotations? p:json, trustBoundary? p:enum
  Entity McpResource :: $server+uri ; $server! $:McpServer, uri! p:str, name? p:str, title? p:str, mime? p:str, description? p:str, annotations? p:json, subscribable? p:bool
  Entity McpPrompt :: $server+promptName ; $server! $:McpServer, promptName! p:str, title? p:str, description? p:str, arguments? p:json
  Entity McpRoot :: $server+uri ; $server! $:McpServer, uri! p:str, name? p:str, accessKind? p:enum
  Entity McpSamplingRequest :: requestId ; requestId! p:str, $session! $:McpSession, messages! p:json, modelPreferences? p:json, systemPrompt? p:str, includeContext? p:enum, status! p:enum, requestedAt! p:num, completedAt? p:num, $modelInvocation? $:ModelInvocation
  Entity McpElicitationRequest :: requestId ; requestId! p:str, $session! $:McpSession, message! p:str, requestedSchema? p:json, status! p:enum, requestedAt! p:num, resolvedAt? p:num
  Entity ToolInvocation :: invocationId ; invocationId! p:str, toolKind! p:enum, protocol? p:enum, toolSelector! p:json, $service? $:AgentService, $agentSession? $:AgentSession, $mcpTool? $:McpTool, $permissionRequest? $:PermissionRequest, $paymentRequirement? $:PaymentRequirement, input! p:json, contentBlocks* p:json, structuredContent? p:json, isError? p:bool, status! p:enum, error? p:str, startedAt! p:num, completedAt? p:num
  Entity ModelProvider :: providerId ; providerId! p:str, label! p:str, $$models* $:Model
  Entity Model :: $provider+modelId ; $provider! $:ModelProvider, modelId! p:str, label? p:str, modalities* p:enum, contextWindow? p:num, inputPricing? p:json, outputPricing? p:json
  Entity ModelInvocation :: invocationId ; invocationId! p:str, $model! $:Model, requestItems! p:json, responseItems? p:json, toolCalls* p:json, inputTokenCount? p:num, outputTokenCount? p:num, cost? p:json, status! p:enum, startedAt! p:num, completedAt? p:num
  Entity PermissionRequest :: permissionRequestId ; permissionRequestId! p:str, subjectSelector! p:json, scope! p:json, policy? p:json, reason? p:str, risk? p:json, status! p:enum, requestedAt! p:num, resolvedAt? p:num, $authorityGrant? $:AuthorityGrant
  Entity PaymentRequirement :: paymentRequirementId ; paymentRequirementId! p:str, protocol! p:enum, resourceUrl? p:url, scheme? p:str, network? p:str, amount? p:bigint, maxAmount? p:bigint, assetSelector? p:json, payTo? p:json, facilitator? p:url, memo? p:str, expiresAt? p:num, $$challenges* $:PaymentChallenge
  Entity PaymentChallenge :: challengeId ; challengeId! p:str, $paymentRequirement! $:PaymentRequirement, status! p:enum, challengePayload! p:json, responsePayload? p:json, receivedAt! p:num, resolvedAt? p:num, $$attempts* $:PaymentAttempt
  Entity PaymentAttempt :: attemptId ; attemptId! p:str, $paymentChallenge! $:PaymentChallenge, $payload? $:Payload, $submission? $:Submission, $outcome? $:Outcome, amount? p:bigint, assetSelector? p:json, status! p:enum, attemptedAt! p:num
  Source fulfillment :: AgentCardEndpoint, LocalToolRegistry, ModelProviderDocs, SystemCardRegistry, MCP/A2A/ACP endpoints, x402 facilitators
  View organization :: AgentServiceView, AgentTrustView
  Proof gates :: agent-output-lineage, source-conflict
  Implementation starting point :: model/tool/agent outputs need identity, capability, model release, invocation, artifact, and provenance linkage

Entity family: Social identity, credentials, attestations, content provenance, datasets, and licenses
  Entity IdentityClaim :: claimId ; claimId! p:str, subjectSelector! p:json, claimKind! p:enum, value! p:json, issuerSelector? p:json, claimStatus? p:enum, validFromMs? p:num, validToMs? p:num, $credential? $:Credential, $attestation? $:Attestation, $verification? $:VerificationResult
  Entity Credential :: credentialId ; credentialId! p:str, credentialKind! p:enum, credentialFormat! p:enum, contexts* p:url, types+ p:str, issuerSelector! p:json, subjectSelector! p:json, credentialSubject? p:json, schemaId? p:str, proof? p:json, status? p:json, issuedAt? p:num, expiresAt? p:num, $$presentations* $:CredentialPresentation
  Entity CredentialPresentation :: presentationId ; presentationId! p:str, holderSelector! p:json, verifierSelector? p:json, presentationFormat! p:enum, proof? p:json, disclosedClaims? p:json, verifiedAt? p:num, $verification? $:VerificationResult
  Entity AttestationSchema :: schemaId ; schemaId! p:str, schemaKind! p:enum, schemaDefinition! p:json, resolverSelector? p:json, $standard? $:StandardReference
  Entity Attestation :: attestationId ; attestationId! p:str, attestationKind! p:enum, issuerSelector! p:json, subjectSelector! p:json, $schema? $:AttestationSchema, data? p:json, revoked? p:bool, issuedAt? p:num, revokedAt? p:num, $source? $:Source, $verification? $:VerificationResult
  Entity Did :: did ; did! p:str, method! p:str, methodSpecificId! p:str, $$documents* $:DidDocument, $$verificationMethods* $:DidVerificationMethod, $$services* $:DidService, $$aliases* $:IdentityClaim
  Entity DidDocument :: did+retrievedAt ; did! p:str, $did! $:Did, retrievedAt! p:num, versionId? p:str, document? p:json, deactivated? p:bool, equivalentIds* p:str, canonicalId? p:str, $source? $:Source, $verification? $:VerificationResult
  Entity DidVerificationMethod :: $did+methodId ; $did! $:Did, methodId! p:str, methodType! p:str, controller! p:str, publicKeyMaterial? p:json, relationships* p:enum, revokedAt? p:num
  Entity DidService :: $did+serviceId ; $did! $:Did, serviceId! p:str, serviceType! p:str, serviceEndpoint! p:json, routingKeys* p:str
  Entity EnsName :: name ; name! p:str, normalizedName? p:str, node? p:hex32, $$records* $:EnsRecord, $$reverseRecords* $:EnsReverseRecord
  Entity EnsRecord :: $name+recordKey ; $name! $:EnsName, recordKey! p:str, recordKind! p:enum, coinType? p:num, $$timestamps* $:EnsRecord_Timestamp
  Entity EnsRecord_Timestamp :: $record+timestampMs+source ; $record! $:EnsRecord, timestampMs! p:num, source! p:str, value? p:str, resolverSelector? p:json, blockNumber? p:bigint
  Entity EnsReverseRecord :: $account+$name ; $account! $:Account, $name! $:EnsName, $$timestamps* $:EnsReverseRecord_Timestamp
  Entity EnsReverseRecord_Timestamp :: $reverseRecord+timestampMs+source ; $reverseRecord! $:EnsReverseRecord, timestampMs! p:num, source! p:str, verified? p:bool, resolverSelector? p:json
  Entity ContentAddress :: scheme+target+contentPath ; scheme! p:enum, target! p:str, contentPath! p:str, normalizedUri! p:str, mutable? p:bool, multibase? p:str, multicodec? p:str, multihash? p:str, digest? p:hex, $content? $:ContentResource
  Entity ContentResource :: resourceId ; resourceId! p:str, resourceKind! p:enum, canonicalAddress? p:str, contentHash? p:str, $$addresses* $:ContentAddress, $$retrievals* $:ContentRetrieval_Timestamp, $$metadata* $:MetadataDocument, $$media* $:MediaObject, $$moderationLabels* $:ModerationLabel
  Entity ContentRetrieval_Timestamp :: $content+timestampMs+source ; $content! $:ContentResource, timestampMs! p:num, source! p:str, retrievalMethod! p:enum, gatewayOrigin? p:url, url? p:url, status? p:enum, httpStatus? p:num, contentType? p:str, contentLength? p:num, displayType? p:enum, isContentTypeInferred? p:bool, textSample? p:str, error? p:str
  Entity IpfsResource :: namespace+target+contentPath ; namespace! p:enum, target! p:str, contentPath! p:str, cid? p:str when namespace=ipfs, ipnsName? p:str when namespace=ipns, $address! $:ContentAddress, $content? $:ContentResource
  Entity SwarmResource :: reference+contentPath ; reference! p:str, contentPath! p:str, encrypted? p:bool, $address! $:ContentAddress, $content? $:ContentResource
  Entity GitRepository :: repositoryId | canonicalRemoteUrl ; repositoryId? p:str, canonicalRemoteUrl? p:url, defaultRefName? p:str, objectFormat! p:enum, $content? $:ContentResource, $$refs* $:GitRef, $$objects* $:GitObject, $$remotes* $:GitRemote, $$fetches* $:GitFetchObservation
  Entity GitObject :: objectId+objectFormat ; objectId! p:hex, objectFormat! p:enum, objectKind! p:enum, sizeBytes? p:bigint, $repository? $:GitRepository, $content? $:ContentResource
  Entity GitLooseObject :: objectId+objectFormat+byteSource ; objectId! p:hex, objectFormat! p:enum, byteSource! p:str, path? p:str, compressedSizeBytes? p:bigint, observedAtMs? p:num, $object? $:GitObject
  Entity GitPackedObject :: packHash+objectId+objectFormat ; packHash! p:hex, objectId! p:hex, objectFormat! p:enum, offset? p:bigint, deltaBaseObjectId? p:hex, storedKind? p:enum, $packfile! $:GitPackfile, $object? $:GitObject
  Entity GitBlob :: objectId+objectFormat ; objectId! p:hex, objectFormat! p:enum, $object! $:GitObject, mime? p:str, byteSize? p:bigint, textSample? p:str, $$paths* $:GitTreeEntry
  Entity GitTree :: objectId+objectFormat ; objectId! p:hex, objectFormat! p:enum, $object! $:GitObject, $$entries* $:GitTreeEntry
  Entity GitTreeEntry :: $tree+path ; $tree! $:GitTree, path! p:str, mode! p:str, objectId! p:hex, objectKind! p:enum, $object? $:GitObject
  Entity GitCommit :: objectId+objectFormat ; objectId! p:hex, objectFormat! p:enum, $object! $:GitObject, treeObjectId! p:hex, parentObjectIds* p:hex, authorName? p:str, authorEmail? p:str, authorTimestampMs? p:num, committerName? p:str, committerEmail? p:str, committerTimestampMs? p:num, message? p:str, $$signatures* $:GitSignature
  Entity GitTag :: objectId+objectFormat ; objectId! p:hex, objectFormat! p:enum, $object! $:GitObject, targetObjectId! p:hex, targetKind? p:enum, tagName? p:str, taggerSelector? p:json, taggerTimestampMs? p:num, message? p:str, $$signatures* $:GitSignature
  Entity GitRef :: $repository+refName ; $repository! $:GitRepository, refName! p:str, refKind! p:enum, targetObjectId? p:hex, symbolicTarget? p:str, $$observations* $:GitRefObservation_Timestamp
  Entity GitRefObservation_Timestamp :: $ref+timestampMs+source ; $ref! $:GitRef, timestampMs! p:num, source! p:str, targetObjectId? p:hex, peeledObjectId? p:hex, advertised? p:bool, protection? p:json
  Entity GitRefUpdate :: $repository+refName+oldObjectId+newObjectId ; $repository! $:GitRepository, refName! p:str, oldObjectId? p:hex, newObjectId! p:hex, updateKind! p:enum, actorSelector? p:json, timestampMs? p:num, $signature? $:GitSignature, $source? $:Source
  Entity GitRemote :: $repository+remoteName ; $repository! $:GitRepository, remoteName! p:str, url! p:url, transportKind! p:enum, hostKind? p:enum, $source? $:Source
  Entity GitForgeMirror :: forgeHost+owner+repositoryName ; forgeHost! p:str, owner! p:str, repositoryName! p:str, $gitRepository? $:GitRepository, defaultBranch? p:str, visibility? p:enum, cloneUrls* p:url, htmlUrl? p:url, providerRepositoryId? p:str, $source! $:Source
  Entity GitForgePullRequest :: $forgeMirror+pullRequestNumber ; $forgeMirror! $:GitForgeMirror, pullRequestNumber! p:num, title? p:str, state! p:enum, authorSelector? p:json, baseRef? p:str, headRef? p:str, headObjectId? p:hex, createdAt? p:num, updatedAt? p:num, mergedAt? p:num
  Entity GitForgeIssue :: $forgeMirror+issueNumber ; $forgeMirror! $:GitForgeMirror, issueNumber! p:num, title? p:str, state! p:enum, authorSelector? p:json, labels* p:str, createdAt? p:num, updatedAt? p:num, closedAt? p:num
  Entity GitForgeRelease :: $forgeMirror+releaseTagName ; $forgeMirror! $:GitForgeMirror, releaseTagName! p:str, name? p:str, targetObjectId? p:hex, authorSelector? p:json, draft? p:bool, prerelease? p:bool, createdAt? p:num, publishedAt? p:num
  Entity GitFetchObservation :: $repository+remoteName+timestampMs+source ; $repository! $:GitRepository, remoteName! p:str, timestampMs! p:num, source! p:str, protocolVersion? p:str, advertisedRefs? p:num, wantedObjects? p:num, receivedObjects? p:num, packfileHash? p:hex, status! p:enum, error? p:str
  Entity GitPackfile :: packHash ; packHash! p:hex, objectFormat! p:enum, objectCount? p:num, packSizeBytes? p:bigint, indexHash? p:hex, $repository? $:GitRepository
  Entity GitSignature :: signatureId ; signatureId! p:str, subjectObjectId! p:hex, signatureKind! p:enum, signerSelector? p:json, payloadHash? p:hex, signature? p:str, verificationStatus! p:enum, verifiedAtMs? p:num, $verification? $:VerificationResult
  Entity GitObjectVerificationRun :: objectId+objectFormat+verifier+timestampMs ; objectId! p:hex, objectFormat! p:enum, verifier! p:str, timestampMs! p:num, objectKind? p:enum, computedObjectId? p:hex, headerHash? p:hex, contentHash? p:hex, status! p:enum, error? p:str
  Entity GitObjectByteVerification :: objectId+objectFormat+byteSource+timestampMs ; objectId! p:hex, objectFormat! p:enum, byteSource! p:str, timestampMs! p:num, headerBytesHash? p:hex, payloadBytesHash? p:hex, computedObjectId? p:hex, canonicalEncoding? p:bool, status! p:enum, error? p:str
  Entity GitTreePathResolution :: $repository+commitObjectId+path ; $repository! $:GitRepository, commitObjectId! p:hex, path! p:str, treeObjectIds* p:hex, blobObjectId? p:hex, submoduleCommitId? p:hex, status! p:enum
  Entity RadicleNode :: nodeId ; nodeId! p:str, did? p:str, alias? p:str, publicKey? p:str, $$peers* $:RadiclePeer, $$seeds* $:RadicleSeedObservation_Timestamp
  Entity RadicleRepository :: rid ; rid! p:str, $gitRepository! $:GitRepository, name? p:str, description? p:str, visibility! p:enum, defaultBranch? p:str, $$delegates* $:RadicleDelegate, $$signedRefs* $:RadicleSignedRef, $$issues* $:RadicleIssue, $$patches* $:RadiclePatch
  Entity RadicleIdentityDocument :: rid+revision ; rid! p:str, revision! p:str, documentHash! p:hex, payload? p:json, $$signatures* $:GitSignature, $$verifications* $:VerificationResult, $repository? $:RadicleRepository
  Entity RadicleIdentityRevision :: rid+revision ; rid! p:str, revision! p:str, previousRevision? p:str, documentHash! p:hex, delegateDids* p:str, threshold? p:num, signedByDids* p:str, verificationStatus! p:enum
  Entity RadicleDelegate :: $repository+did ; $repository! $:RadicleRepository, did! p:str, role? p:enum, validFromRevision? p:str, validToRevision? p:str
  Entity RadicleSignedRef :: $repository+nodeId+refName ; $repository! $:RadicleRepository, nodeId! p:str, refName! p:str, targetObjectId! p:hex, signature? p:str, status! p:enum, verificationStatus! p:enum, observedAtMs? p:num, $gitRef? $:GitRef, $refObservation? $:GitRefObservation_Timestamp
  Entity RadicleObjectVerificationRun :: rid+nodeId+refName+targetObjectId+verifier+timestampMs ; rid! p:str, nodeId! p:str, refName! p:str, targetObjectId! p:hex, verifier! p:str, timestampMs! p:num, signatureStatus! p:enum, objectAvailable? p:bool, delegateThresholdMet? p:bool, status! p:enum, error? p:str
  Entity RadiclePeer :: $node+peerNodeId ; $node! $:RadicleNode, peerNodeId! p:str, connectionKind? p:enum, addresses* p:str, lastSeenMs? p:num, $remoteNode? $:RadicleNode
  Entity RadicleNodeInventoryObservation :: $node+timestampMs+source ; $node! $:RadicleNode, timestampMs! p:num, source! p:str, repositoryCount? p:num, connectedPeerCount? p:num, routingTableSize? p:num, advertisedRids* p:str, status! p:enum
  Entity RadicleSyncSession :: sessionId ; sessionId! p:str, $localNode! $:RadicleNode, remoteNodeId! p:str, rid? p:str, startedAt! p:num, completedAt? p:num, requestedRefs* p:str, receivedObjects? p:num, status! p:enum, error? p:str
  Entity RadicleSeedObservation_Timestamp :: $repository+nodeId+timestampMs+source ; $repository! $:RadicleRepository, nodeId! p:str, timestampMs! p:num, source! p:str, advertised? p:bool, reachable? p:bool, refCount? p:num, objectCount? p:num
  Entity RadicleIssue :: $repository+issueId ; $repository! $:RadicleRepository, issueId! p:str, title? p:str, authorDid? p:str, state! p:enum, createdAt? p:num, updatedAt? p:num, payloadObjectId? p:hex, $payloadObject? $:GitObject, $$comments* $:RadicleDiscussionComment
  Entity RadiclePatch :: $repository+patchId ; $repository! $:RadicleRepository, patchId! p:str, authorDid? p:str, targetRef? p:str, headObjectId? p:hex, baseObjectId? p:hex, state! p:enum, createdAt? p:num, updatedAt? p:num, $headCommit? $:GitCommit, $baseCommit? $:GitCommit, $$comments* $:RadicleDiscussionComment
  Entity RadicleDiscussionComment :: discussionSelector+commentId ; discussionSelector! p:json, commentId! p:str, authorDid? p:str, body? p:str, bodyObjectId? p:hex, createdAt? p:num, updatedAt? p:num, replyToCommentId? p:str, $payloadObject? $:GitObject
  Entity RadicleCollaborationEvent :: $repository+eventId ; $repository! $:RadicleRepository, eventId! p:str, eventKind! p:enum, authorDid? p:str, subjectSelector! p:json, payloadHash? p:hex, payloadObjectId? p:hex, timestampMs? p:num, $gitCommit? $:GitCommit, $payloadObject? $:GitObject, verificationStatus! p:enum
  Entity BitTorrentMetainfo :: infoHash+hashVersion ; infoHash! p:hex, hashVersion! p:enum, infoHashV1? p:hex, infoHashV2? p:hex, metainfoHash? p:hex, bencodedInfoHash? p:hex, name? p:str, pieceLength? p:bigint, totalLength? p:bigint, private? p:bool, $content? $:ContentResource, $$files* $:BitTorrentFile, $$fileTreeEntries* $:BitTorrentFileTreeEntry, $$pieces* $:BitTorrentPiece, $$trackers* $:BitTorrentTracker, $$magnets* $:MagnetLink
  Entity BitTorrentMetainfoParse :: metainfoHash+parserVersion ; metainfoHash! p:hex, parserVersion! p:str, bencodeHash! p:hex, infoHashV1? p:hex, infoHashV2? p:hex, fileCount? p:num, pieceCount? p:num, parseStatus! p:enum, error? p:str
  Entity BitTorrentMetainfoVerificationRun :: infoHash+hashVersion+verifier+timestampMs ; infoHash! p:hex, hashVersion! p:enum, verifier! p:str, timestampMs! p:num, bencodedInfoHash? p:hex, computedInfoHashV1? p:hex, computedInfoHashV2? p:hex, canonicalBencode? p:bool, status! p:enum, error? p:str
  Entity BitTorrentFileTreeEntry :: $torrent+path ; $torrent! $:BitTorrentMetainfo, path! p:str, pathSegments* p:str, entryKind! p:enum, length? p:bigint, piecesRoot? p:hex, $file? $:BitTorrentFile
  Entity BitTorrentFile :: $torrent+fileIndex ; $torrent! $:BitTorrentMetainfo, fileIndex! p:num, path! p:str, pathSegments* p:str, length! p:bigint, piecesRoot? p:hex, fileHash? p:hex, $content? $:ContentResource
  Entity BitTorrentPiece :: $torrent+pieceIndex ; $torrent! $:BitTorrentMetainfo, pieceIndex! p:num, pieceHashV1? p:hex, pieceRootV2? p:hex, pieceLayerHash? p:hex, length? p:bigint, offset? p:bigint
  Entity BitTorrentPieceVerificationRun :: $piece+source+timestampMs ; $piece! $:BitTorrentPiece, source! p:str, timestampMs! p:num, bytesHash! p:hex, expectedHash! p:hex, hashVersion! p:enum, status! p:enum
  Entity BitTorrentMerkleProofVerificationRun :: $piece+source+timestampMs ; $piece! $:BitTorrentPiece, source! p:str, timestampMs! p:num, leafHash? p:hex, proofHashes* p:hex, rootHash? p:hex, verifier! p:str, status! p:enum, error? p:str
  Entity BitTorrentTracker :: trackerUrl ; trackerUrl! p:url, trackerKind! p:enum, $$announces* $:BitTorrentAnnounceObservation
  Entity BitTorrentAnnounceObservation :: $torrent+$tracker+timestampMs+source ; $torrent! $:BitTorrentMetainfo, $tracker! $:BitTorrentTracker, timestampMs! p:num, source! p:str, seeders? p:num, leechers? p:num, downloaded? p:num, intervalSec? p:num, status! p:enum, error? p:str
  Entity BitTorrentTrackerScrapeObservation :: $tracker+infoHash+timestampMs+source ; $tracker! $:BitTorrentTracker, infoHash! p:hex, timestampMs! p:num, source! p:str, complete? p:num, downloaded? p:num, incomplete? p:num, status! p:enum, error? p:str
  Entity BitTorrentSwarmObservation_Timestamp :: $torrent+timestampMs+source ; $torrent! $:BitTorrentMetainfo, timestampMs! p:num, source! p:str, peerCount? p:num, seedCount? p:num, completedCount? p:num, availability? p:num
  Entity BitTorrentPeerObservation :: $torrent+peerId+timestampMs+source ; $torrent! $:BitTorrentMetainfo, peerId! p:str, timestampMs! p:num, source! p:str, address? p:str, port? p:num, client? p:str, completedPercent? p:num, supportsDht? p:bool, supportsPex? p:bool
  Entity BitTorrentDhtNodeObservation :: nodeId+timestampMs+source ; nodeId! p:str, timestampMs! p:num, source! p:str, address? p:str, port? p:num, observedInfoHashes* p:hex, reachable? p:bool
  Entity BitTorrentDhtLookupObservation :: infoHash+observerKey+timestampMs ; infoHash! p:hex, observerKey! p:str, timestampMs! p:num, queriedNodeCount? p:num, responsiveNodeCount? p:num, peerCount? p:num, closestNodeIds* p:str, status! p:enum
  Entity BitTorrentTransferObservation :: $torrent+observerKey+timestampMs ; $torrent! $:BitTorrentMetainfo, observerKey! p:str, timestampMs! p:num, downloadedBytes? p:bigint, uploadedBytes? p:bigint, downloadRate? p:num, uploadRate? p:num, verifiedPieces? p:num, failedPieces? p:num
  Entity MagnetLink :: magnetUri ; magnetUri! p:str, infoHash? p:hex, displayName? p:str, exactLength? p:bigint, trackers* p:url, webSeeds* p:url, acceptableSources* p:url, $torrent? $:BitTorrentMetainfo
  Entity MagnetResolutionObservation :: magnetUri+timestampMs+source ; magnetUri! p:str, timestampMs! p:num, source! p:str, resolvedInfoHash? p:hex, resolvedMetainfoHash? p:hex, trackerCount? p:num, webSeedCount? p:num, status! p:enum, error? p:str
  Entity Url :: url ; url! p:url, normalizedUrl? p:url, $$previews* $:UrlPreview_Timestamp, $$retrievals* $:ContentRetrieval_Timestamp
  Entity UrlPreview_Timestamp :: $url+timestampMs+source ; $url! $:Url, timestampMs! p:num, source! p:str, title? p:str, description? p:str, siteName? p:str, $image? $:MediaObject, previewStatus? p:enum
  Entity MetadataDocument :: documentId ; documentId! p:str, documentKind! p:enum, uri? p:url, contentHash? p:str, mime? p:str, schemaKind? p:enum, parsed? p:json, $content? $:ContentResource, $$timestamps* $:MetadataDocument_Timestamp
  Entity MetadataDocument_Timestamp :: $document+timestampMs+source ; $document! $:MetadataDocument, timestampMs! p:num, source! p:str, fetchedAt! p:num, parseStatus! p:enum, validationStatus? p:enum, errors* p:str
  Entity MediaObject :: mediaId | $content+variantKey ; mediaId? p:str, $content? $:ContentResource, variantKey? p:str, url? p:url, contentHash? p:str, mime? p:str, width? p:num, height? p:num, durationMs? p:num, codecs* p:str, alt? p:str, attribution? p:str, $$variants* $:MediaVariant, $$moderationLabels* $:ModerationLabel
  Entity MediaVariant :: $media+variantKey ; $media! $:MediaObject, variantKey! p:str, variantKind! p:enum, width? p:num, height? p:num, url? p:url, contentHash? p:str, generatedBy? p:str
  Entity ModerationLabel :: labelId ; labelId! p:str, subjectSelector! p:json, labelNamespace! p:str, labelValue! p:str, issuerSelector? p:json, confidence? p:num, createdAt? p:num, expiresAt? p:num, $source? $:Source
  Entity SocialProtocol :: protocol ; protocol! p:enum, identityModel! p:enum, objectModel! p:enum, authorityModel! p:enum, $standard? $:StandardReference, $$profiles* $:SocialProfile, $$objects* $:SocialObject
  Entity SocialProfile :: protocol+profileKey ; protocol! p:enum, profileKey! p:str, profileSelector! p:json, $account? $:Account, $did? $:Did, handle? p:str, displayName? p:str, $$objects* $:SocialObject, $$relations* $:SocialRelation, $$timestamps* $:SocialProfile_Timestamp
  Entity SocialProfile_Timestamp :: $profile+timestampMs+source ; $profile! $:SocialProfile, timestampMs! p:num, source! p:str, followerCount? p:num, followingCount? p:num, objectCount? p:num, metadata? p:json
  Entity SocialObject :: protocol+objectKey ; protocol! p:enum, objectKey! p:str, objectSelector! p:json, objectKind! p:enum, $author? $:SocialProfile, $content? $:ContentResource, text? p:str, createdAt? p:num, updatedAt? p:num, deletedAt? p:num, $$attachments* $:SocialAttachment, $$relations* $:SocialRelation, $$timestamps* $:SocialObject_Timestamp
  Entity SocialObject_Timestamp :: $object+timestampMs+source ; $object! $:SocialObject, timestampMs! p:num, source! p:str, replyCount? p:num, repostCount? p:num, reactionCount? p:num, quoteCount? p:num, viewCount? p:num, moderation? p:json
  Entity SocialAttachment :: $object+attachmentIndex ; $object! $:SocialObject, attachmentIndex! p:num, attachmentKind! p:enum, $content? $:ContentResource, uri? p:url, selector? p:json, alt? p:str
  Entity SocialRelation :: relationId ; relationId! p:str, protocol! p:enum, relationKind! p:enum, actorSelector! p:json, subjectSelector! p:json, objectSelector? p:json, assertionStatus! p:enum, truthKind! p:enum, createdAt? p:num, deletedAt? p:num, observedAtMs? p:num, evidenceRefs* p:str, $source? $:Source
  Entity SocialThreadEdge :: edgeId ; edgeId! p:str, protocol! p:enum, $parent! $:SocialObject, $child! $:SocialObject, edgeKind! p:enum, sortKey? p:str
  Entity FarcasterUser :: fid ; fid! p:num, username? p:str, displayName? p:str, custodyAddress? p:evmAddress, $socialProfile? $:SocialProfile, $$signers* $:FarcasterSigner, $$storage* $:FarcasterStorage_Timestamp, $$verifiedAddresses* $:FarcasterVerifiedAddress, $$casts* $:FarcasterCast, $$timestamps* $:FarcasterUser_Timestamp
  Entity FarcasterSigner :: fid+key ; fid! p:num, key! p:hex, keyType! p:enum, requestorSelector? p:json, status! p:enum, addedAt? p:num, removedAt? p:num
  Entity FarcasterStorage_Timestamp :: fid+timestampMs+source ; fid! p:num, timestampMs! p:num, source! p:str, unitCount? p:num, castLimit? p:num, reactionLimit? p:num, linkLimit? p:num, verificationLimit? p:num, expiresAt? p:num
  Entity FarcasterMessage :: hash ; hash! p:hex, fid! p:num, messageType! p:enum, timestamp! p:num, signerKey? p:hex, body? p:json, signature? p:hex, deletedByHash? p:hex
  Entity FarcasterCast :: fid+hash | hash ; fid! p:num, hash! p:hex, text? p:str, timestampMs? p:num, $message? $:FarcasterMessage, $author? $:FarcasterUser, $socialObject? $:SocialObject, $channel? $:FarcasterChannel, $$embeds* $:FarcasterCastEmbed, $$timestamps* $:FarcasterCast_Timestamp
  Entity FarcasterChannel :: channelId ; channelId! p:str, name? p:str, url? p:url, channelStatus? p:enum, hostSelector? p:json, protocolSupport? p:enum, $$casts* $:FarcasterCast, $$timestamps* $:FarcasterChannel_Timestamp
  Entity LensAccount :: accountId | address ; accountId? p:str, address? p:evmAddress, handle? p:str, $socialProfile? $:SocialProfile, $$posts* $:LensPost, $$timestamps* $:LensAccount_Timestamp
  Entity LensPost :: postId ; postId! p:str, $author? $:LensAccount, $socialObject? $:SocialObject, content? p:json, timestampMs? p:num, $$timestamps* $:LensPost_Timestamp
  Entity NostrRelay :: relayUrl ; relayUrl! p:url, $$timestamps* $:NostrRelay_Timestamp
  Entity NostrRelay_Timestamp :: $relay+timestampMs+source ; $relay! $:NostrRelay, timestampMs! p:num, source! p:str, status? p:enum, supportedNips* p:num, activeUsers? p:num, eventsPerDay? p:num
  Entity NostrProfile :: pubkey ; pubkey! p:hex32, $socialProfile? $:SocialProfile, $$metadataEvents* $:NostrEvent, $$notes* $:NostrNote, $$articles* $:NostrArticle
  Entity NostrEvent :: eventId ; eventId! p:hex32, pubkey! p:hex32, createdAt! p:num, kind! p:num, content? p:str, tags? p:json, sig! p:hex, eventClass! p:enum, replaceableKey? p:str, addressableCoordinate? p:str
  Entity NostrNote :: eventId ; eventId! p:hex32, $event! $:NostrEvent, $author? $:NostrProfile, $socialObject? $:SocialObject, replyToEventId? p:hex32, rootEventId? p:hex32
  Entity NostrArticle :: pubkey+kind+identifier ; pubkey! p:hex32, kind! p:num, identifier! p:str, $event? $:NostrEvent, title? p:str, content? p:str, publishedAt? p:num
  Entity AtprotoActor :: did | handle ; did! p:str, handle! p:str, $did? $:Did, $socialProfile? $:SocialProfile, $$repos* $:AtprotoRepo, $$posts* $:AtprotoPost, $$timestamps* $:AtprotoActor_Timestamp
  Entity AtprotoRepo :: did ; did! p:str, $actor! $:AtprotoActor, pdsEndpoint? p:url, $$commits* $:AtprotoRepoCommit, $$records* $:AtprotoRecord
  Entity AtprotoRepoCommit :: did+rev ; did! p:str, rev! p:str, $repo! $:AtprotoRepo, cid! p:str, dataCid! p:str, prevCid? p:str, sig! p:hex, committedAt? p:num
  Entity AtprotoRecord :: did+collection+rkey ; did! p:str, collection! p:str, rkey! p:str, uri! p:str, cid? p:str, $repo! $:AtprotoRepo, record? p:json, createdAt? p:num, deletedAt? p:num
  Entity AtprotoBlob :: did+cid ; did! p:str, cid! p:str, $repo! $:AtprotoRepo, mime? p:str, size? p:num, $content? $:ContentResource
  Entity AtprotoPost :: uri ; uri! p:str, cid? p:str, $record? $:AtprotoRecord, $author? $:AtprotoActor, $socialObject? $:SocialObject, text? p:str, createdAt? p:num, $$timestamps* $:AtprotoPost_Timestamp
  Entity ActivityPubActor :: activityStreamsUri | instanceOrigin+localAccountId | instanceOrigin+acct ; activityStreamsUri! p:url, instanceOrigin? p:url, localAccountId? p:str, acct? p:str, preferredUsername? p:str, inbox? p:url, outbox? p:url, sharedInbox? p:url, $socialProfile? $:SocialProfile, $$objects* $:ActivityPubObject, $$activities* $:ActivityPubActivity, $$timestamps* $:ActivityPubActor_Timestamp
  Entity ActivityPubObject :: activityStreamsUri ; activityStreamsUri! p:url, objectType! p:str, attributedTo? p:json, content? p:str, publishedAt? p:num, updatedAt? p:num, $content? $:ContentResource, $socialObject? $:SocialObject, $$activities* $:ActivityPubActivity, $$timestamps* $:ActivityPubObject_Timestamp
  Entity ActivityPubActivity :: activityStreamsUri ; activityStreamsUri! p:url, activityType! p:str, actorUri! p:url, objectUri? p:url, targetUri? p:url, to? p:json, cc? p:json, publishedAt? p:num, $actor? $:ActivityPubActor, $object? $:ActivityPubObject
  Entity ActivityPubDelivery :: deliveryId ; deliveryId! p:str, $activity! $:ActivityPubActivity, sourceInbox? p:url, targetInbox! p:url, status! p:enum, attemptedAt! p:num, completedAt? p:num, error? p:str
  Entity ActivityPubNote :: activityStreamsUri | instanceOrigin+localStatusId ; activityStreamsUri! p:url, instanceOrigin? p:url, localStatusId? p:str, $object? $:ActivityPubObject, content? p:str, publishedAt? p:num, $actor? $:ActivityPubActor, $$timestamps* $:ActivityPubNote_Timestamp
  Entity XmtpInbox :: inboxId ; inboxId! p:str, $$identities* $:XmtpIdentity, $$installations* $:XmtpInstallation, $$conversations* $:XmtpConversation
  Entity XmtpIdentity :: inboxId+identityKey ; inboxId! p:str, identityKey! p:str, $inbox! $:XmtpInbox, $account? $:Account, signatureScheme? p:enum, bindingStatus? p:enum
  Entity XmtpInstallation :: inboxId+installationId ; inboxId! p:str, installationId! p:str, $inbox! $:XmtpInbox, publicKey? p:hex, addedAt? p:num, revokedAt? p:num
  Entity XmtpConversation :: conversationId ; conversationId! p:str, $inbox? $:XmtpInbox, topic? p:str, conversationKind! p:enum, consentState? p:enum, $$epochs* $:XmtpGroupEpoch, $$messages* $:XmtpMessage
  Entity XmtpGroupEpoch :: $conversation+epoch ; $conversation! $:XmtpConversation, epoch! p:num, createdAt? p:num, membershipHash? p:hex, groupState? p:json
  Entity XmtpMessage :: messageId ; messageId! p:str, $conversation! $:XmtpConversation, senderInboxId? p:str, topic? p:str, envelopeType? p:enum, sentAt? p:num, contentType? p:str, content? p:json, deliveryStatus? p:enum
  Entity RssFeed :: feedKey ; feedKey! p:str, url! p:url, title? p:str, $$items* $:RssItem
  Entity RssItem :: feedKey+guid ; feedKey! p:str, guid! p:str, $feed! $:RssFeed, title? p:str, url? p:url, publishedAt? p:num, summary? p:str
  Entity YouTubeChannel :: channelId ; channelId! p:str, title? p:str, $$videos* $:YouTubeVideo, $$playlists* $:YouTubePlaylist, $$timestamps* $:YouTubeChannel_Timestamp
  Entity YouTubeVideo :: videoId ; videoId! p:str, $channel? $:YouTubeChannel, title? p:str, publishedAt? p:num, duration? p:str, $$comments* $:YouTubeComment, $$timestamps* $:YouTubeVideo_Timestamp
  Entity RedditSubreddit :: name ; name! p:str, title? p:str, $$links* $:RedditLink, $$timestamps* $:RedditSubreddit_Timestamp
  Entity RedditLink :: fullname ; fullname! p:str, $subreddit? $:RedditSubreddit, title? p:str, url? p:url, createdAt? p:num, $$comments* $:RedditComment, $$timestamps* $:RedditLink_Timestamp
  Entity XUser :: userId ; userId! p:str, username? p:str, displayName? p:str, $$posts* $:XPost, $$timestamps* $:XUser_Timestamp
  Entity XPost :: postId ; postId! p:str, $author? $:XUser, text? p:str, createdAt? p:num, $$timestamps* $:XPost_Timestamp
  Entity PrivacyScope :: scopeId ; scopeId! p:str, subjectSelector! p:json, disclosureMode! p:enum, linkabilityRisk! p:enum, unlinkabilityAssumption? p:str, localOnly! p:bool
  Entity DisclosurePolicy :: policyId ; policyId! p:str, claimSchema? p:json, allowedPredicates* p:str, redactionMode! p:enum, verifierBinding? p:enum, $$claims* $:DisclosedClaim
  Entity DisclosedClaim :: $presentation+claimKey ; $presentation! $:CredentialPresentation, claimKey! p:str, predicate? p:str, valueHash? p:hex, revealedValue? p:json, redactionStatus! p:enum, $policy? $:DisclosurePolicy
  Entity ZkIdentityProof :: proofHash | presentationId ; proofHash? p:hex, presentationId? p:str, $presentation? $:CredentialPresentation, nullifierHash? p:hex, signalHash? p:hex, externalNullifier? p:hex, merkleRoot? p:hex, $proofSystem? $:ProofSystem
  Entity NullifierUse :: scheme+nullifierHash ; scheme! p:str, nullifierHash! p:hex, contextSelector! p:json, usedAt? p:num, source! p:str, verificationStatus! p:enum
  Entity AnonymousCredentialScheme :: schemeId ; schemeId! p:str, issuerModel! p:enum, revocationModel! p:enum, disclosureModel! p:enum, accumulatorKind? p:enum, standardUrl? p:url
  Entity CredentialStatusObservation :: credentialId+timestampMs+source ; credentialId! p:str, timestampMs! p:num, source! p:str, status! p:enum, statusListUri? p:url, statusListIndex? p:num, accumulatorRoot? p:hex
  Entity DidMethod :: method ; method! p:str, methodSpec? p:url, operationModel! p:enum, resolutionSourcePolicy! p:enum, $$resolutions* $:DidResolutionRecord
  Entity DidResolutionRecord :: did+timestampMs+source ; did! p:str, timestampMs! p:num, source! p:str, documentHash? p:hex, metadata? p:json, error? p:str, resolverVersion? p:str
  Entity VerificationMethod :: did+keyId ; did! p:str, keyId! p:str, publicKey? p:json, purpose* p:enum, controller? p:str, validFromMs? p:num, validToMs? p:num
  Entity KeyRotationEvent :: subjectSelectorHash+eventId ; subjectSelectorHash! p:str, eventId! p:str, subjectSelector! p:json, oldKeySelector? p:json, newKeySelector? p:json, proof? p:json, coordinate? p:json
  Entity AccountBindingProof :: subjectSelectorHash+accountSelectorHash+proofId ; subjectSelectorHash! p:str, accountSelectorHash! p:str, proofId! p:str, subjectSelector! p:json, accountSelector! p:json, proofKind! p:enum, signature? p:hex, challenge? p:str, issuedAt? p:num, expiresAt? p:num
  Entity HandleClaim :: protocol+handle+timestampMs+source ; protocol! p:enum, handle! p:str, timestampMs! p:num, source! p:str, profileSelector? p:json, claimStatus! p:enum, proofKind? p:enum
  Entity ProvenanceEvent :: subjectSelectorHash+eventIndex ; subjectSelectorHash! p:str, eventIndex! p:num, subjectSelector! p:json, eventKind! p:enum, actorSelector? p:json, sourceSelector? p:json, derivedFrom* p:json, timestampMs? p:num
  Entity ContentAuthenticityManifest :: manifestHash ; manifestHash! p:hex, c2paVersion? p:str, claimGenerator? p:str, ingredientHashes* p:hex, signatureStatus! p:enum, $content? $:ContentResource
  Entity MediaDerivative :: parentContentHash+childContentHash ; parentContentHash! p:hex, childContentHash! p:hex, transformKind! p:enum, toolSelector? p:json, parametersHash? p:hex, $provenanceEvent? $:ProvenanceEvent
  Entity Dataset :: datasetId | contentHash ; datasetId? p:str, contentHash? p:hex, title? p:str, version? p:str, publisherSelector? p:json, licenseSelector? p:json, $$snapshots* $:DatasetSnapshot
  Entity DatasetSnapshot :: $dataset+snapshotKey ; $dataset! $:Dataset, snapshotKey! p:str, contentHash? p:hex, manifestUri? p:url, recordCount? p:bigint, createdAt? p:num
  Entity LicenseDocument :: licenseId | contentHash ; licenseId? p:str, contentHash? p:hex, licenseKind! p:enum, url? p:url, textHash? p:hex, spdxId? p:str
  Entity DataLicenseGrant :: subjectSelectorHash+licenseId ; subjectSelectorHash! p:str, licenseId! p:str, subjectSelector! p:json, $license? $:LicenseDocument, rights* p:enum, restrictions* p:str, attributionRequired? p:bool
  Entity AiUsePolicy :: subjectSelectorHash+policyId ; subjectSelectorHash! p:str, policyId! p:str, subjectSelector! p:json, allowTraining? p:bool, allowInference? p:bool, allowEmbedding? p:bool, optOutSource? p:str, $source? $:Source
  Entity AttributionRequirement :: subjectSelectorHash+requirementKey ; subjectSelectorHash! p:str, requirementKey! p:str, subjectSelector! p:json, displayText? p:str, linkTarget? p:url, licenseSelector? p:json, appliesTo! p:enum
  Entity RetrievalPolicyObservation :: origin+timestampMs+source ; origin! p:url, timestampMs! p:num, source! p:str, robotsStatus? p:enum, aiCrawlerPolicy? p:enum, termsHash? p:hex
  Entity ContentParserRun :: contentHash+parserVersion+timestampMs ; contentHash! p:hex, parserVersion! p:str, timestampMs! p:num, mime? p:str, displayType? p:enum, textSampleHash? p:hex, extractedMetadataHash? p:hex, status! p:enum, error? p:str
  Entity SocialHandleClaim_Timestamp :: protocol+handle+timestampMs+source ; protocol! p:enum, handle! p:str, timestampMs! p:num, source! p:str, subjectType? p:str, subjectSelector? p:json, claimStatus! p:enum, proofKind? p:enum
  Entity ProtocolSignedMessage :: protocol+messageId ; protocol! p:enum, messageId! p:str, authorSelector? p:json, payloadHash! p:str, signature? p:str, signedAt? p:num, verificationStatus? p:enum, $verification? $:VerificationResult
  Entity OnchainAttestation :: $network+uid ; $network! $:Network, uid! p:str, schemaSelector? p:json, issuerSelector! p:json, subjectSelector! p:json, dataHash? p:hex, revoked? p:bool
  Entity OffchainAttestation :: contentHash ; contentHash! p:hex, schemaSelector? p:json, issuerSelector! p:json, subjectSelector! p:json, signature? p:hex, issuedAt? p:num
  Entity SignedStatement :: signatureHash ; signatureHash! p:hex, signerSelector! p:json, subjectSelector? p:json, statementHash! p:hex, statementKind! p:enum, issuedAt? p:num
  Entity AttestationRevocation :: attestationId+revocationId ; attestationId! p:str, revocationId! p:str, revokedBySelector? p:json, reasonHash? p:hex, coordinate? p:json, source! p:str
  Entity IssuerTrustRegistry :: registryId ; registryId! p:str, registryKind! p:enum, governanceSelector? p:json, trustPolicy? p:json, $$entries* $:IssuerTrustEntry
  Entity IssuerTrustEntry :: $registry+issuerSelectorHash ; $registry! $:IssuerTrustRegistry, issuerSelectorHash! p:str, issuerSelector! p:json, status! p:enum, scopes* p:str, validFromMs? p:num, validToMs? p:num
  Entity ProofVerificationRun :: verificationId ; verificationId! p:str, verifierVersion! p:str, inputHash! p:hex, result! p:enum, error? p:str, timestampMs! p:num, $proof? $:ProofArtifact
  Entity ProofPublicInput :: proofHash+inputKey ; proofHash! p:hex, inputKey! p:str, inputKind! p:enum, valueHash? p:hex, semanticBinding? p:json
  Entity AgentIdentity :: agentSelectorHash ; agentSelectorHash! p:str, agentSelector! p:json, identityKind! p:enum, controllerSelector? p:json, serviceSelector? p:json
  Entity AgentCapabilityClaim :: $service+capabilityKey+source ; $service! $:AgentService, capabilityKey! p:str, source! p:str, inputSchemaHash? p:hex, outputSchemaHash? p:hex, trustBoundary! p:enum, observedAt? p:num
  Entity ModelRelease :: $provider+modelId+version ; $provider! $:ModelProvider, modelId! p:str, version! p:str, releaseDate? p:num, deprecationStatus? p:enum, systemCardUri? p:url
  Entity AgentOutputArtifact :: artifactHash ; artifactHash! p:hex, $agentSession? $:AgentSession, $modelInvocation? $:ModelInvocation, $toolInvocation? $:ToolInvocation, signature? p:hex, provenanceManifest? p:hex
  Entity DelegationGrant :: grantId ; grantId! p:str, delegatorSelector! p:json, delegateSelector! p:json, scopes! p:json, constraints? p:json, validFromMs? p:num, validToMs? p:num, revocationSelector? p:json
  Source fulfillment :: protocol APIs/indexers, Git CLI/libgit2/JGit/go-git, GitHub/GitLab/Gitea forges as sources, Radicle node/HTTP APIs, BitTorrent trackers/DHT clients, VcStatusList, IssuerApi, OnchainRegistry, UniversalResolver, MethodNativeResolver, ProofVerifier, C2paVerifier, ContentAddressedStorage, RobotsTxt/TdmRep, EAS/Verax/Ceramic; seed rows: GitObject.objectKind via git cat-file, GitCommit.parentObjectIds via git cat-file, GitRefObservation.targetObjectId via git ls-remote/protocol-v2, GitObjectByteVerification.computedObjectId via object bytes, GitForgePullRequest/GitForgeIssue/GitForgeRelease via forge APIs only, RadicleSignedRef.targetObjectId via radicle node/http plus signature verification, RadicleObjectVerificationRun via signed ref plus Git object availability, BitTorrentMetainfo.infoHash via bencode parse, BitTorrentMetainfoVerificationRun via canonical info dictionary hashing, BitTorrentPieceVerificationRun via piece bytes, BitTorrentMerkleProofVerificationRun via BEP-52 piece layers
  View organization :: SocialProfileView, IdentityProofView(summary, credentials, attestations, handle claims, key rotations), CredentialView, AttestationView, ContentAuthenticityView(authenticity, lineage, retrievals, parser runs, licenses), DatasetLicenseView(snapshots, files, license grants), AgentTrustView(identity, capabilities, model invocations, tool invocations, output artifacts), GitRepositoryView(summary, refs, commits, tree/path browser, object byte verification, remotes/fetches, signatures, forge metadata), RadicleRepositoryView(identity/revisions, delegates, signed refs, object verification, issues, patches), TorrentView(metainfo identity, files/tree, pieces/proofs, trackers, DHT lookups, swarm availability, transfers, magnet resolution)
  Proof gates :: credential-revocation-visible, zk-proof-verifies, social-handle-observation, protocol-signed-message-verifies, content-parser-run-not-stable-identity, content-provenance-chain, license-policy-visible, timestamp-freshness, git-object-roundtrip, git-object-byte-verification, git-ref-advertisement, git-forge-mirror-not-identity, radicle-signed-ref-verifies, radicle-identity-threshold, radicle-seed-observation, radicle-sync-object-availability, radicle-collaboration-payload-verifies, bittorrent-metainfo-hash, bittorrent-bep52-merkle-proof, bittorrent-piece-verification, bittorrent-availability-observation
  Implementation starting point :: implement Git object/ref verification fixtures first, then Radicle signed-ref verification against Git objects, then BitTorrent metainfo/piece parsing; keep credential status and one provenance chain before broad DID/zk/license/AI-use displays
  Rejected alternatives :: handle selectors without observation history; `Media.url` as content identity; parsed MIME/text/license fields as stable facts; local agent transcript rows as model provenance; provider license enums as license documents; GitHub repository as Git identity; forge PR/issue/release as Git protocol primitive; Radicle alias/node hostname as identity; Radicle seed reachability as repository truth; torrent availability as content truth; magnet URI as metainfo canonical identity; tracker/web-seed URL as torrent identity; single unversioned torrent hash across BEP-3/BEP-52

Entity family: Governance, security, incidents, compliance lists, and attestations
  Entity GovernanceProposalLifecycle :: proposalEntityType+proposalSelectorHash+phaseKey+source ; proposalEntityType! p:str, proposalSelectorHash! p:str, proposalSelector! p:json, phaseKey! p:str, source! p:str, phaseKind! p:enum, startMs? p:num, endMs? p:num, quorum? p:bigint, threshold? p:num, status! p:enum
  Entity GovernanceVote :: proposalEntityType+proposalSelectorHash+voterSelectorHash+option+source ; proposalEntityType! p:str, proposalSelectorHash! p:str, proposalSelector! p:json, voterSelectorHash! p:str, voterSelector! p:json, option! p:str, source! p:str, weight? p:bigint, reason? p:str, txSelector? p:json, timestampMs? p:num
  Entity GovernanceDelegation :: $network+delegatorSelector+delegateSelector+validFromMs ; $network! $:Network, delegatorSelector! p:json, delegateSelector! p:json, scope! p:enum, votingPower? p:bigint, validFromMs! p:num, validToMs? p:num, $source? $:Source
  Entity GovernanceParameterChange :: proposalEntityType+proposalSelectorHash+parameterKey ; proposalEntityType! p:str, proposalSelectorHash! p:str, proposalSelector! p:json, parameterKey! p:str, moduleKey? p:str, oldValue? p:json, newValue! p:json, activationCoordinate? p:json, $source? $:Source
  Entity GovernanceTreasurySpend :: proposalEntityType+proposalSelectorHash+recipientSelectorHash+assetSelectorHash ; proposalEntityType! p:str, proposalSelectorHash! p:str, proposalSelector! p:json, recipientSelectorHash! p:str, recipientSelector! p:json, assetSelectorHash! p:str, assetSelector! p:json, amount! p:bigint, vesting? p:json, payoutStatus? p:enum, $source? $:Source
  Entity GovernanceTrack :: $network+trackId ; $network! $:Network, trackId! p:str, label? p:str, decisionDeposit? p:bigint, prepareMs? p:num, decisionMs? p:num, confirmMs? p:num, minApproval? p:num, minSupport? p:num
  Entity GovernanceForumThread :: forumNamespace+threadId ; forumNamespace! p:str, threadId! p:str, proposalEntityType? p:str, proposalSelector? p:json, url! p:url, authorSelector? p:json, createdAtMs? p:num, $$timestamps* $:GovernanceForumThread_Timestamp
  Entity GovernanceForumThread_Timestamp :: $thread+timestampMs+source ; $thread! $:GovernanceForumThread, timestampMs! p:num, source! p:str, replyCount? p:num, reactionCount? p:num, lastActivityMs? p:num
  Entity SpecProposalStatusObservation :: $proposal+timestampMs+source ; $proposal! $:SpecificationProposal, timestampMs! p:num, source! p:str, status! p:str, mergedCommit? p:hex, editorSelector? p:json, implementationLinks* p:url, methodology? p:str
  Entity SecurityAudit :: auditId ; auditId! p:str, subjectType! p:str, subjectSelector! p:json, auditorSelector! p:json, reportUrl? p:url, issuedAtMs? p:num, scope? p:json, $$findings* $:SecurityFinding
  Entity SecurityFinding :: $audit+findingId ; $audit! $:SecurityAudit, findingId! p:str, severity! p:enum, status! p:enum, affectedComponent? p:str, title? p:str, fixedAtMs? p:num, disclosureUrl? p:url
  Entity ExploitIncident :: incidentId ; incidentId! p:str, subjectType! p:str, subjectSelector! p:json, discoveredAtMs! p:num, $$transactions* $:ExploitTransaction, $$incidentClaims* $:ExploitIncidentClaim, $$claims* $:SourceClaim
  Entity ExploitIncidentClaim :: incidentId+predicate+source+timestampMs ; incidentId! p:str, predicate! p:str, source! p:str, timestampMs! p:num, object! p:json, confidence? p:enum, evidenceUrl? p:url
  Entity ExploitTransaction :: $incident+txSelectorHash ; $incident! $:ExploitIncident, txSelectorHash! p:str, txSelector! p:json, role! p:enum, amount? p:bigint, assetSelector? p:json, sourceConfidence? p:enum
  Entity BugBountyProgram :: programId ; programId! p:str, operatorSelector! p:json, subjectSelector? p:json, scope? p:json, policyUrl! p:url, $$statuses* $:BugBountyProgramStatus_Timestamp
  Entity BugBountyProgramStatus_Timestamp :: $program+timestampMs+source ; $program! $:BugBountyProgram, timestampMs! p:num, source! p:str, active? p:bool, rewardMinUsd? p:num, rewardMaxUsd? p:num
  Entity BugBountyReport :: $program+reportId ; $program! $:BugBountyProgram, reportId! p:str, severity? p:enum, status! p:enum, disclosedAtMs? p:num, paidAmountUsd? p:num, disclosureUrl? p:url
  Entity ComplianceList :: listNamespace+listId ; listNamespace! p:str, listId! p:str, authoritySelector! p:json, jurisdiction? p:str, updatePolicy? p:enum, url? p:url, $$entries* $:ComplianceListEntry
  Entity ComplianceListEntry :: $list+subjectHash ; $list! $:ComplianceList, subjectHash! p:str, subjectSelector! p:json, reason? p:str, listedAtMs? p:num, delistedAtMs? p:num, evidenceUrl? p:url
  Entity ProofOfReserveAttestation :: attestationId ; attestationId! p:str, issuerSelector! p:json, subjectSelector! p:json, assetSelector! p:json, reserveAssetSelector? p:json, liabilities? p:bigint, reserves? p:bigint, timestampMs! p:num, $source? $:Source, $verification? $:VerificationResult
  Source fulfillment :: ProtocolGovernanceRpc, GovernanceIndexer, SpecTracker, ProjectSecurityPages, AuditRepoArtifacts, Immunefi/Code4rena, Rekt/DefiLlamaSecurity, ListAuthorityApi, AttestationContracts, AuditorReports; generic proposal refs use proposalEntityType+proposalSelector rather than `$:Proposal`
  View organization :: GovernanceView, SecurityView, SpecView
  Proof gates :: source-conflict, timestamp-freshness, governance-subject-discriminator, security-claim-attribution
  Implementation starting point :: store risk/compliance facts as attributed claims; never infer exploit root cause or listing status

Entity family: Shared security, data availability, derivation, sequencing, preconfirmations, and proof systems
  Entity RestakingProtocol :: protocol+deploymentNetwork ; protocol! p:str, deploymentNetwork! p:str, slashingModel! p:enum, operatorSetKind! p:enum, withdrawalDelayMs? p:num, $$avs* $:RestakingAvs, $$operators* $:RestakingOperator
  Entity RestakingAvs :: $protocol+avsId | $protocol+address ; $protocol! $:RestakingProtocol, avsId? p:str, address? p:evmAddress, metadata? p:json, quorumThreshold? p:num, taskModel? p:enum, slashingContractSelector? p:json, $$operatorSets* $:RestakingOperatorSet
  Entity RestakingOperator :: $protocol+operatorSelector ; $protocol! $:RestakingProtocol, operatorSelector! p:json, delegationApprover? p:json, earningsReceiver? p:json, stakerOptOutWindowMs? p:num, $$stakes* $:RestakingOperatorStake
  Entity RestakingOperatorSet :: $avs+operatorSetId ; $avs! $:RestakingAvs, operatorSetId! p:str, quorumNumber? p:num, strategySelectors* p:json, minimumStake? p:bigint
  Entity RestakingOperatorStake :: $operator+assetSelector+timestampMs+source ; $operator! $:RestakingOperator, assetSelector! p:json, timestampMs! p:num, source! p:str, delegatedStake? p:bigint, slashableStake? p:bigint, shares? p:bigint
  Entity SharedSecurityConsumerChain :: $providerProtocol+consumerChainId ; $providerProtocol! $:Protocol, consumerChainId! p:str, $network? $:Network, securityKind! p:enum, validatorSyncMode? p:enum, slashingPropagation? p:enum, $$leases* $:ValidatorSetLease
  Entity ValidatorSetLease :: $consumer+$provider+epoch ; $consumer! $:SharedSecurityConsumerChain, $provider! $:Protocol, epoch! p:bigint, votingPower? p:bigint, rewardRate? p:num, slashableStake? p:bigint, validatorCount? p:num
  Entity SlashingEvent :: $protocol+eventId | $network+txHash+logIndex ; $protocol? $:Protocol, eventId? p:str, $network? $:Network, txHash? p:hex, logIndex? p:num, operatorSelector? p:json, reason? p:str, evidenceHash? p:hex, penaltyAmount? p:bigint, status! p:enum
  Entity DaProtocol :: protocol+deploymentNetwork ; protocol! p:str, deploymentNetwork! p:str, erasureScheme? p:enum, namespaceModel? p:enum, samplingModel? p:enum, settlementVerifierSelector? p:json, $$namespaces* $:DaNamespace, $$commitments* $:DaCommitment
  Entity DaNamespace :: $daProtocol+namespaceId ; $daProtocol! $:DaProtocol, namespaceId! p:str, ownerSelector? p:json, version? p:str, reserved? p:bool, rollupSelector? p:json
  Entity DaCommitment :: $network+commitmentHash ; $network! $:Network, commitmentHash! p:hex, commitmentKind! p:enum, rowRoot? p:hex, dataRoot? p:hex, proofKind? p:enum, coordinate? p:json, $$shares* $:DaShare, $$sampling* $:DaSamplingObservation_Timestamp
  Entity DaShare :: $commitment+shareCoordinate ; $commitment! $:DaCommitment, shareCoordinate! p:str, namespaceId? p:str, shareHash? p:hex, row? p:num, column? p:num, available? p:bool
  Entity DaNamespaceProof :: $commitment+namespaceId+proofHash ; $commitment! $:DaCommitment, namespaceId! p:str, proofHash! p:hex, complete? p:bool, proofNodes? p:json, verifiedAtMs? p:num
  Entity DaSamplingObservation_Timestamp :: $commitment+timestampMs+source ; $commitment! $:DaCommitment, timestampMs! p:num, source! p:str, sampleCount? p:num, availableCount? p:num, confidence? p:num, nodePeerId? p:str
  Entity RollupDerivationStep :: $scalingDeployment+stepIndex+version ; $scalingDeployment! $:ScalingDeployment, stepIndex! p:num, version! p:str, inputKind! p:enum, outputRootKind! p:enum, faultDomain? p:enum, $spec? $:StandardReference
  Entity RollupDerivationArtifact :: $derivationStep+artifactKey ; $derivationStep! $:RollupDerivationStep, artifactKey! p:str, artifactKind! p:enum, contentHash? p:hex, sourceUrl? p:url
  Entity SharedSequencerDeployment :: $protocolDeployment+sequencerSetId ; $protocolDeployment! $:ProtocolDeployment, sequencerSetId! p:str, orderingPolicy! p:enum, censorshipPolicy? p:enum, stakeRequirement? p:bigint, $$members* $:SharedSequencerMember
  Entity SharedSequencerMember :: $deployment+memberSelector ; $deployment! $:SharedSequencerDeployment, memberSelector! p:json, status! p:enum, votingPower? p:bigint, joinedAtMs? p:num
  Entity Preconfirmation :: $network+preconfId | txSelector+providerSelector ; $network? $:Network, preconfId? p:str, txSelector? p:json, providerSelector? p:json, deadlineMs? p:num, promiseHash? p:hex, status! p:enum
  Entity ProofSystem :: proofSystemId | protocol+version ; proofSystemId? p:str, protocol? p:str, version? p:str, arithmetization? p:enum, curve? p:str, field? p:str, trustedSetupKind? p:enum, recursionSupport? p:bool, $$verificationKeys* $:VerificationKey
  Entity VerifierContract :: $network+address+proofSystemId ; $network! $:Network, address! p:evmAddress, proofSystemId! p:str, verifierKind! p:enum, vkHash? p:hex, acceptedPublicInputShape? p:json, $contract? $:EvmContract
  Entity VerificationKey :: $proofSystem+vkHash ; $proofSystem! $:ProofSystem, vkHash! p:hex, circuitId? p:str, circuitVersion? p:str, commitmentHash? p:hex, parameterUris* p:url
  Entity ProofArtifact :: proofHash | txSelector+proofIndex ; proofHash? p:hex, txSelector? p:json, proofIndex? p:num, $proofSystem? $:ProofSystem, proofKind! p:enum, publicInputsHash? p:hex, sizeBytes? p:num, status! p:enum
  Entity ProverNetwork :: protocol+deploymentNetwork ; protocol! p:str, deploymentNetwork! p:str, marketModel! p:enum, assignmentPolicy? p:enum, collateralModel? p:enum, proofKinds* p:enum, $$jobs* $:ProverJob
  Entity ProverJob :: $proverNetwork+jobId ; $proverNetwork! $:ProverNetwork, jobId! p:str, inputCommitment? p:hex, outputCommitment? p:hex, bid? p:bigint, deadlineMs? p:num, status! p:enum, $proof? $:ProofArtifact
  Source fulfillment :: L2Beat_Rest, SuperchainRegistry_Rest, ProtocolRegistry, ContractsRpc, Subgraph/Indexer, DaNodeRpc, DaExplorer, DaSpecs, LightClient, verifier/prover APIs; restaking/shared-security/DA/prover roots need protocol docs plus contract/indexer fixtures before canonical refs
  View organization :: ProtocolDeploymentView, RestakingView, DaProtocolView, ProofSystemView
  Proof gates :: da-sampling, proof-artifact, source-conflict, protocol-deployment-source, relationship-sourceability
  Implementation starting point :: keep methodology/risk as source observations and DA availability/namespace ownership as sampled observations or proofs

Entity family: Consensus, validators, node software, peer networks, mempools, orderflow, and data lineage
  Entity ConsensusProtocol :: protocolId ; protocolId! p:str, label! p:str, family! p:enum, finalityModel! p:enum, forkChoiceRule? p:str, leaderElectionRule? p:str, slashingModel? p:enum, $$deployments* $:ConsensusDeployment
  Entity ConsensusDeployment :: $network+protocolId+activationCoordinate ; $network! $:Network, protocolId! p:str, activationCoordinate! p:str, $consensusProtocol! $:ConsensusProtocol, $networkUpgrade? $:NetworkUpgrade, activationHeight? p:bigint, activationSlot? p:bigint, activationEpoch? p:bigint, retirementCoordinate? p:str
  Entity ForkChoiceRule :: ruleId ; ruleId! p:str, label! p:str, weightSource? p:enum, tieBreakPolicy? p:enum, $$specReferences* $:StandardReference
  Entity FinalityCheckpoint :: $network+coordinateKind+coordinateValue ; $network! $:Network, coordinateKind! p:enum, coordinateValue! p:str, justifiedRoot? p:hex, finalizedRoot? p:hex, sourceClockMs? p:num, $source? $:Source
  Entity ValidatorSetSnapshot :: $network+epochOrHeight+source ; $network! $:Network, epochOrHeight! p:str, source! p:str, activeCount? p:num, pendingCount? p:num, exitingCount? p:num, jailedCount? p:num, totalStake? p:bigint, timestampMs! p:num
  Entity ValidatorLifecycleEvent :: $network+validatorKey+eventKind+coordinate ; $network! $:Network, validatorKey! p:str, eventKind! p:enum, coordinate! p:str, validatorEntityType? p:str, validatorSelector? p:json, amount? p:bigint, reason? p:str, transactionEntityType? p:str, transactionSelector? p:json
  Entity ValidatorStakePosition :: $network+validatorKey+delegatorSelectorHash+epochOrHeight ; $network! $:Network, validatorKey! p:str, delegatorSelectorHash! p:str, epochOrHeight! p:str, validatorEntityType? p:str, validatorSelector? p:json, accountSelector? p:json, bondedAmount? p:bigint, unbondingAmount? p:bigint, rewardsAccrued? p:bigint, commissionRate? p:num
  Entity ValidatorReward_Timestamp :: validatorEntityType+validatorSelectorHash+timestampMs+source ; validatorEntityType! p:str, validatorSelectorHash! p:str, validatorSelector! p:json, timestampMs! p:num, source! p:str, grossReward? p:bigint, netReward? p:bigint, apr? p:num, fees? p:bigint, subsidy? p:bigint
  Entity SlashingIncident :: $network+incidentKind+coordinate+validatorKey ; $network! $:Network, incidentKind! p:enum, coordinate! p:str, validatorKey! p:str, validatorEntityType? p:str, validatorSelector? p:json, penaltyAmount? p:bigint, evidenceRoot? p:hex, transactionEntityType? p:str, transactionSelector? p:json, $source? $:Source
  Entity NodeSoftwareProject :: repositoryUrl | packageName ; repositoryUrl? p:url, packageName? p:str, label! p:str, license? p:str, language? p:str, protocolSelectors* p:json, $$protocolClaims* $:ProtocolDeploymentClaim, $$specReferences* $:StandardReference, $$releases* $:NodeSoftwareRelease
  Entity NodeSoftwareRelease :: $softwareProject+version ; $softwareProject! $:NodeSoftwareProject, version! p:str, releasedAt? p:num, gitCommit? p:hex, compatibleProtocolVersions* p:str, securityAdvisoryRefs* p:str
  Entity NetworkClientImplementation :: $network+clientKind+clientId ; $network! $:Network, clientKind! p:enum, clientId! p:str, $softwareProject? $:NodeSoftwareProject, role! p:enum, maintainerSelector? p:json, defaultPorts* p:num, $$distribution* $:ClientDistribution_Timestamp
  Entity ClientDistribution_Timestamp :: $network+clientKind+timestampMs+source ; $network! $:Network, clientKind! p:enum, timestampMs! p:num, source! p:str, $clientImplementation? $:NetworkClientImplementation, nodeCount? p:num, validatorCount? p:num, share? p:num, methodology? p:str
  Entity NodeIdentity :: $network+nodeId ; $network! $:Network, nodeId! p:str, peerId? p:str, enode? p:str, multiaddrs* p:str, publicKey? p:hex, $clientImplementation? $:NetworkClientImplementation, $$observations* $:NodeObservation_Timestamp
  Entity NodeObservation_Timestamp :: $node+timestampMs+source ; $node! $:NodeIdentity, timestampMs! p:num, source! p:str, agentVersion? p:str, protocolVersion? p:str, height? p:bigint, latencyMs? p:num, country? p:str, asn? p:num, reachable? p:bool
  Entity P2pProtocol :: p2pProtocolId ; p2pProtocolId! p:str, label! p:str, transport? p:enum, discoveryMechanism? p:enum, identityScheme? p:enum, standardUrl? p:url
  Entity P2pPeerSession :: $network+remoteNodeId+observedAtMs+source ; $network! $:Network, remoteNodeId! p:str, observedAtMs! p:num, source! p:str, localNodeId? p:str, $remoteNode? $:NodeIdentity, direction? p:enum, protocols* p:str, latencyMs? p:num, bytesIn? p:bigint, bytesOut? p:bigint
  Entity P2pGossipTopic :: $network+topicName ; $network! $:Network, topicName! p:str, messageKind! p:enum, encoding? p:enum, $specReference? $:StandardReference
  Entity P2pGossipMessage :: $network+topicName+messageId ; $network! $:Network, topicName! p:str, messageId! p:str, $topic? $:P2pGossipTopic, seenAtMs! p:num, payloadHash! p:hex, blockSelector? p:json, transactionSelector? p:json, attestationSelector? p:json
  Entity MempoolTransactionObservation :: $network+txHash+source+firstSeenMs ; $network! $:Network, txHash! p:hex, source! p:str, firstSeenMs! p:num, lastSeenMs? p:num, status! p:enum, feeRate? p:num, priorityFee? p:bigint, sizeBytes? p:num
  Entity MempoolSnapshot :: $network+timestampMs+source ; $network! $:Network, timestampMs! p:num, source! p:str, pendingCount? p:num, queuedCount? p:num, bytes? p:bigint, feeHistogram? p:json, minRelayFee? p:bigint
  Entity TransactionPropagationObservation :: $network+txHash+observerKey+seenAtMs ; $network! $:Network, txHash! p:hex, observerKey! p:str, seenAtMs! p:num, transactionSelector? p:json, nodeSelector? p:json, relayPath? p:json
  Entity OrderflowEndpoint :: $network+endpointUrl ; $network! $:Network, endpointUrl! p:url, endpointKind! p:enum, operatorSelector? p:json, privacyPolicy? p:url, submissionProtocol? p:enum
  Entity PrivateOrderflowSubmission :: $network+submissionHash+source ; $network! $:Network, submissionHash! p:hex, source! p:str, transactionSelector? p:json, bundleSelector? p:json, $endpoint? $:OrderflowEndpoint, submittedAtMs? p:num, $$outcomes* $:PrivateOrderflowOutcomeObservation
  Entity PrivateOrderflowOutcomeObservation :: $submission+source+timestampMs ; $submission! $:PrivateOrderflowSubmission, source! p:str, timestampMs! p:num, landedTxSelector? p:json, landedBlock? p:bigint, nonInclusionWindow? p:json, status! p:enum
  Entity MevBundle :: $network+bundleHash+source ; $network! $:Network, bundleHash! p:hex, source! p:str, transactionHashes* p:hex, targetBlock? p:bigint, simulatedValue? p:bigint, landedBlock? p:bigint, builderSelector? p:json
  Entity BuilderBid :: $network+slot+builderPubkey+relayHost ; $network! $:Network, slot! p:bigint, builderPubkey! p:hex, relayHost! p:str, builderSelector? p:json, relaySelector? p:json, value? p:bigint, blockHash? p:hex, receivedAtMs? p:num
  Entity RelaySlotObservation :: relaySelector+slot+timestampMs ; relaySelector! p:json, slot! p:bigint, timestampMs! p:num, bidCount? p:num, deliveredPayloadCount? p:num, winningBuilderSelector? p:json, missed? p:bool
  Entity ProposerBuilderRegistration :: $network+validatorPubkey+feeRecipient+timestampMs ; $network! $:Network, validatorPubkey! p:hex, feeRecipient! p:evmAddress, timestampMs! p:num, validatorSelector? p:json, gasLimit? p:bigint, signature! p:hex, relaySelector? p:json
  Entity IndexerDataset :: datasetId+source ; datasetId! p:str, source! p:str, label! p:str, domain! p:enum, coverageStart? p:json, coverageEnd? p:json, refreshPolicy? p:enum, methodology? p:str, $$runs* $:IndexerDerivationRun
  Entity IndexerDerivationRun :: $dataset+runId ; $dataset! $:IndexerDataset, runId! p:str, startedAtMs! p:num, completedAtMs? p:num, inputSources* p:str, codeVersion? p:str, rowCount? p:bigint
  Entity ArchiveNodeSnapshot :: $network+observerKey+timestampMs ; $network! $:Network, observerKey! p:str, timestampMs! p:num, archiveRangeStart? p:json, archiveRangeEnd? p:json, pruningMode? p:enum, stateScheme? p:enum, proofAvailable? p:bool
  Entity DataLineageClaim :: entityType+selectorDigest+fieldName+source+observedAtMs ; entityType! p:str, selectorDigest! p:str, fieldName! p:str, source! p:str, observedAtMs! p:num, truthKind! p:enum, methodology? p:str, inputRefs* p:json, confidence? p:enum, conflictsWith* p:str
  Source fulfillment :: ProtocolSpecs, ReferenceImplementations, ValidatorRegistry, Explorer/Indexer, ClientRepos, ReleaseManifests, P2pCrawler, NodeRpc, LocalNodeTelemetry, MempoolObserver, OrderflowRelay, BuilderApi, MevBoostRelay, IndexerWarehouse, ArchiveNodeRpc
  View organization :: ConsensusView, ValidatorView, NodeView, MempoolView, OrderflowView, IndexerLineageView
  Proof gates :: consensus-finality, validator-economics, p2p-observation, mempool-first-seen, mev-builder-bid, orderflow-outcome-observation, indexer-lineage, relationship-sourceability
  Implementation starting point :: represent client distribution, peer reachability, mempool first-seen, and indexer lineage as sourced observations, not network scalars
```

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
