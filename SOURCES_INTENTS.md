# Blockhead Intents Mock Sources

Archive note: the canonical intent/session source notes have been merged into `SOURCES.md`. Keep this file as research history only; update `SCHEMA.md`, `SOURCES.md`, and `SCHEMA-PLAN.md` for future passes.

## Purpose

This file lists the source bindings and prior-art inputs used by `SCHEMA_INTENTS.md`. It is intentionally focused on local sessions, product intents, drag/drop invocation, quote/order protocols, wallet requests, and simulation.

```ts
export enum SourceBinding {
	Local_Internal = 'Local_Internal',
	Constants_Internal = 'Constants_Internal',
	Tevm_Runtime = 'Tevm_Runtime',
	Voltaire_JsonRpc = 'Voltaire_JsonRpc',
	Oif_Aggregator = 'Oif_Aggregator',
	Lifi_IntentsOrderServer = 'Lifi_IntentsOrderServer',
	NearIntents_OrderServer = 'NearIntents_OrderServer',
	UniswapTrading_Rest = 'UniswapTrading_Rest',
	OneInchFusion_Rest = 'OneInchFusion_Rest',
	Wallet_Eip1193 = 'Wallet_Eip1193',
	Wallet_Eip5792 = 'Wallet_Eip5792',
	Wallet_ProtocolApi = 'Wallet_ProtocolApi',
	Browser_DragAndDrop = 'Browser_DragAndDrop',
}
```

## Source Notes

```text
  Source Local_Internal
    Kind :: local app state
    Owns :: BlockheadSession, BlockheadSessionAction, BlockheadIntentInvocation, non-drag invocation payload hashes, typed Blockhead*Intent rows, local readiness checks, local outcome summaries, local quote/order links, local wallet requests, local simulation metadata, retained simulation call/log rows
    Notes :: Product-local state. It proves what this app recorded, not chain truth, provider support, wallet authority, or settlement. Prefer payload hashes, summaries, and typed fields on schema rows; retain raw provider/wallet/runtime payloads only as local source evidence when needed for debugging or replay.

  Source Constants_Internal
    Kind :: checked-in catalog definitions
    Owns :: ActionType, Protocol, IntentType, EntityType, IntentInvocationModality, IntentInvocationPlacement, ReadinessCheckKind, ReadinessStatus, WalletCapabilityStatus, WalletProtocol, WalletRequestKind, WalletRequestStatus, WalletCallBundleStatus, OutcomeKind, OutcomeStatus, FinalityStatus, IntentOrderStatus, SessionStatus, SimulationStatus, SimulationCallType, protocolActions, product intent definitions, local definition/option hashes
    Notes :: Catalog definitions are not entities. They support validation, labels, routing, CAIP-shaped interop selectors, readiness check/status labels, local outcome/finality display labels, wallet protocol/request-kind/status labels, and option generation. Persist keys/hashes on invocation rows when an accepted choice needs replayability across catalog changes.

  Source Browser_DragAndDrop
    Kind :: browser UI transport
    Owns :: transient DataTransfer payloads, drag source/target rectangles, hover/tooltip state
    Notes :: Does not create durable rows by itself. Persist only accepted or recorded invocation results as BlockheadIntentInvocation.

  Source Oif_Aggregator
    Kind :: signed-order/filler-market quote/order API
    Owns :: OIF quote responses, solver ids, quote expiry, integrity checksums, submitted order status
    Notes :: OIF models protocol-level intents and orders. Product intents remain Blockhead-local; OIF payloads belong to quote/order artifacts as hashes, compact summaries, and retained source evidence.

  Source Lifi_IntentsOrderServer
    Kind :: OIF-compatible order server
    Owns :: LI.FI intent quote/request/order payloads, quote ids, order status, solver metadata when exposed
    Notes :: Useful for NEAR Intents/OIF-style swap and bridge fulfillment. EIP-7930 interop addresses belong in request/quote/order payload evidence. This is distinct from normal LI.FI route quote responses, which belong in specialized bridge/swap quote rows.

  Source NearIntents_OrderServer
    Kind :: NEAR Intents order server / solver network
    Owns :: NEAR Intents quote/order payloads, same-chain swap quotes, cross-chain same-coin bridge quotes, order statuses
    Notes :: A protocol/backend option for swap and bridge actions, not a separate app-level intent ontology.

  Source UniswapTrading_Rest
    Kind :: Uniswap Trade API
    Owns :: UniswapX/gasless quote payloads, signed order submission, order status when integrated
    Notes :: Intent-based swap backend with its own API shape. Normalize signed-order quote/order flows into BlockheadIntentQuote and BlockheadIntentOrder rather than treating as OIF or ordinary SwapQuote_Timestamp.

  Source OneInchFusion_Rest
    Kind :: 1inch Fusion / intent swap API
    Owns :: Fusion quote payloads, auction/order data, submitted signed order hash/status
    Notes :: Intent-based swap backend with its own API shape. It is not a drop-in OIF aggregator or ordinary router quote source.

  Source Tevm_Runtime
    Kind :: local simulation runtime
    Owns :: fork metadata, local execution summaries, runtime output hashes, simulation call trace nodes, simulated logs, gas totals, errors
    Notes :: Simulation evidence is local and replay-oriented. It is not a canonical receipt, public log, or public proof. Store compact result summaries and runtime payload hashes on schema rows; retain raw TEVM output only as local source evidence when needed.

  Source Voltaire_JsonRpc
    Kind :: EVM JSON-RPC / fork source
    Owns :: fork block context, chain state reads, RPC-origin metadata for simulation
    Notes :: Supports deterministic TEVM fork inputs and chain-state evidence. Public chain facts should still resolve through normal network/transaction entities when needed.

  Source Wallet_Eip1193
    Kind :: connected wallet provider
    Owns :: wallet request/submission payloads, account selection, chain selection, signatures when surfaced locally
    Notes :: Wallet authority and user approval are local session facts until a transaction or order is source-proven. Persisted signing/submission attempts belong on BlockheadWalletRequest, not BlockheadIntentOrder. Capability checks belong on BlockheadActionReadinessCheck and timestamp observations, not account identity. A rejected prompt can still produce a BlockheadWalletRequest with requestedAt and a rejection timestamp but no submittedAt. EVM-shaped shortcut fields on BlockheadWalletRequest are populated from this source only when the request method is EIP-1193/EVM-shaped. Store request/status payload hashes on schema rows; retain raw wallet payloads only as local source evidence.

  Source Wallet_Eip5792
    Kind :: wallet call batching/status API
    Owns :: wallet call bundle ids, batch submission status, requested and observed atomicity, receipt counts, wallet-reported result state
    Notes :: Useful for execution artifacts. Do not fold wallet status into BlockheadSessionAction or provider intent orders. EIP-5792 `wallet_getCapabilities` exposes per-chain capabilities such as atomic batch support for readiness checks; `wallet_sendCalls` carries requested atomicity and call tuples; `wallet_getCallsStatus` reports numeric status categories, atomic execution, and receipt arrays. Batch result payloads should surface through hashes, bundle ids, normalized status, protocol status code, receipt counts, and retained source evidence when needed.

  Source Wallet_ProtocolApi
    Kind :: non-EVM wallet protocol API placeholder
    Owns :: protocol request payloads and statuses from wallet APIs such as CIP-30, Cosmos OfflineSigner, TON Connect, Starknet Wallet API, Bitcoin Wallet Standard, and related wallet catalog protocols
    Notes :: Use this only as a mock-schema source binding. Concrete implementation should split it into protocol-specific sources once a product flow needs structured payload fields beyond request method, request kind, payload/status hashes, account, and transaction id.
```

## Local Prior Art

- `SCHEMA.md`: existing `BlockheadSession`, `BlockheadSessionAction`, `BlockheadSessionSimulation`, `BlockheadSwapIntent`, `BlockheadBridgeIntent`, and `BlockheadTransferIntent` rows.
- `src/schema/BlockheadSession.ts`: current runtime session entity with status, timestamps, latest simulation, simulation count, and actions.
- `src/schema/BlockheadSessionAction.ts`: current runtime action row with ordered session/action selector and raw `{ type, params }` action object.
- `src/schema/BlockheadSessionSimulation.ts`: current runtime simulation row with params hash, opaque result, and error.
- `src/constants/actions.ts`: current action type definitions and default ArkType params.
- `src/collections/localMutations.ts`: local mutation boundary for writing sessions and actions.
- `src/components/EntityId.svelte` and `src/components/EntityView.svelte`: current selector drag transport using `stringify(entitySelector)` as `text/plain`.

## HackMoney Prior Art

- `~/Developer/ethglobal-hackmoney-2026/specs/038-entity-intents.md`: early actor/chain/token equality matrix for deriving transfer/swap/bridge combinations.
- `~/Developer/ethglobal-hackmoney-2026/specs/047-session-intents-streamlined.md`: local-first session state, explicit persistence, locking semantics, and action rows.
- `~/Developer/ethglobal-hackmoney-2026/specs/047-intent-drag-tooltip-previews.md`: drag arrow, tooltip preview, route selection, and navigation from drag/drop intent choices.
- `~/Developer/ethglobal-hackmoney-2026/specs/077-declarative-intents-and-actions.md`: declarative replacement for imperative intent resolution with typed const arrays for intents, invocations, entities, actions, protocols, and options.
- `~/Developer/ethglobal-hackmoney-2026/specs/082-session-action-component-structure.md`: session owns ordered action list; actions are add/delete/duplicate/reorder capable; each action has Params, Protocol, and Preview columns.
- `~/Developer/ethglobal-hackmoney-2026/specs/101-session-url-model.md`: local URL sessions vs persisted sessions.
- `~/Developer/ethglobal-hackmoney-2026/specs/122-near-intents-bridge-protocol.md`: NEAR Intents as both swap protocol and bridge protocol, with same-chain swap and cross-chain same-coin bridge.
- `~/Developer/ethglobal-hackmoney-2026/specs/164-open-intent-framework-integration-research.md`: OIF/OIF-compatible order-server model and relationship to product intents.
- `~/Developer/ethglobal-hackmoney-2026/specs/166-uniswapx-intent-integration.md`: UniswapX as swap quote/sign/order/status backend.
- `~/Developer/ethglobal-hackmoney-2026/specs/167-1inch-intent-swap-integration.md`: 1inch Fusion as swap quote/sign/order/status backend.
- `~/Developer/ethglobal-hackmoney-2026/specs/049-transaction-simulation-tevm-runtime.md`: TEVM simulation inputs, fork metadata, trace/event output, and persistence.

## Online Prior Art

- CAIP-2: blockchain id namespace/reference model. `https://chainagnostic.org/CAIPs/caip-2`
- CAIP-10: account id model over CAIP-2 networks. `https://chainagnostic.org/CAIPs/caip-10`
- CAIP-19: asset type/id model over CAIP-2 networks. `https://chainagnostic.org/CAIPs/caip-19`
- ERC-7683: cross-chain intents and order model. `https://eips.ethereum.org/EIPS/eip-7683`
- ERC-7930: interoperable address format for chain-bound addresses. `https://eips.ethereum.org/EIPS/eip-7930`
- Open Intents Framework specs and API model. `https://github.com/openintentsframework/oif-specs`
- LI.FI Intents / OIF-compatible order server. `https://docs.li.fi/lifi-intents/intents-api/request-quote`
- NEAR Intents overview. `https://docs.near.org/chain-abstraction/intents/overview`
- Uniswap Trade API / UniswapX gasless order flow. `https://api-docs.uniswap.org`
- 1inch Intent Swap / Fusion docs. `https://portal.1inch.dev/documentation/apis/swap/intent-swap/introduction`
- EIP-5792 wallet calls and call status. `https://eips.ethereum.org/EIPS/eip-5792`
- HTML Drag and Drop API. `https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API`
- TEVM documentation. `https://tevm.sh`

## Source Feasibility

| Source binding | Implementation status | First admissible proof |
| --- | --- | --- |
| `Local_Internal` | local-ready | Local mutation fixture creates session, action, typed intent, readiness, quote/order/wallet/outcome, and simulation rows without provider data. |
| `Constants_Internal` | local-ready | Checked-in catalog rows define action/protocol/status/capability keys and reproducibility hashes without becoming entities. |
| `Browser_DragAndDrop` | transient-only | Browser/UI test proves `DataTransfer` payloads create no durable row until an invocation is accepted or recorded. |
| `Tevm_Runtime` | local-runtime-ready | Simulation fixture stores fork metadata, compact result summary, runtime payload hash, call nodes, and simulated logs without claiming public receipt/log truth. |
| `Voltaire_JsonRpc` | fork-context-ready | Simulation fixture records RPC origin and fork block context; public chain facts still resolve through normal network/transaction rows. |
| `Wallet_Eip1193` | wallet-ready when provider exists in browser | Wallet fixture covers request, rejection, signature or transaction hash, and no chain finality claim. |
| `Wallet_Eip5792` | wallet-ready when provider supports calls | Wallet fixture covers `wallet_getCapabilities`, `wallet_sendCalls`, `wallet_getCallsStatus`, requested versus observed atomicity, numeric status code, and receipt count. |
| `Oif_Aggregator` | prior-art mock until concrete endpoint/client exists | Fixture records quote/order/status payload hashes and summaries from an OIF-shaped payload; no generic OIF resolver until endpoint selectors and auth/CORS are known. |
| `Lifi_IntentsOrderServer` | prior-art mock until concrete endpoint/client exists | Fixture distinguishes LI.FI intent order-server payloads from ordinary LI.FI route quotes and records order status as timestamp observations. |
| `NearIntents_OrderServer` | prior-art mock until concrete endpoint/client exists | Fixture proves same-chain swap and cross-chain same-coin bridge payloads map to quote/order artifacts, not new product-intent roots. |
| `UniswapTrading_Rest` | prior-art mock until concrete endpoint/client exists | Fixture records UniswapX/gasless quote/order/status evidence without treating it as OIF or a normal router quote. |
| `OneInchFusion_Rest` | prior-art mock until concrete endpoint/client exists | Fixture records Fusion auction/order/status evidence without treating it as OIF or a normal router quote. |
| `Wallet_ProtocolApi` | placeholder only | Do not implement directly; split into protocol-specific wallet sources when a product flow needs queryable protocol payload fields. |

## Source Mapping

| Schema row | Primary source bindings |
| --- | --- |
| `BlockheadSession` | `Local_Internal` |
| `BlockheadSessionAction` | `Local_Internal`, `Constants_Internal` |
| `BlockheadIntentInvocation` | `Local_Internal`, `Constants_Internal` for modality/catalog keys and reproducibility hashes; browser drag/drop is transient transport and not a durable row source |
| `BlockheadActionReadinessCheck` | `Local_Internal`, `Constants_Internal` for check-kind labels and capability-key catalogs |
| `BlockheadActionReadinessCheck_Timestamp` | `Local_Internal`, `Constants_Internal` for readiness and capability-status labels, `Wallet_Eip1193`/`Wallet_Eip5792`/`Wallet_ProtocolApi` when the observation is wallet capability readiness; canonical balance/allowance/capability evidence resolves through existing account/asset/wallet rows outside this local artifact |
| `BlockheadActionOutcome` | `Local_Internal`, `Constants_Internal` for outcome-kind labels; public chain/protocol evidence resolves outside this local artifact |
| `BlockheadActionOutcome_Timestamp` | `Local_Internal`, `Constants_Internal` for outcome/finality display labels; public transaction, receipt, bridge transfer, or provider settlement evidence resolves outside this local artifact |
| `BlockheadSwapIntent` | `Local_Internal`, `Constants_Internal` |
| `BlockheadBridgeIntent` | `Local_Internal`, `Constants_Internal` |
| `BlockheadTransferIntent` | `Local_Internal`, `Constants_Internal` |
| `BlockheadIntentQuote` | `Local_Internal` for the recorded quote request id/session link, `Constants_Internal` for normalized protocol labels, plus signed-order/filler-market sources: `Oif_Aggregator`, `Lifi_IntentsOrderServer`, `NearIntents_OrderServer`, `UniswapTrading_Rest`, `OneInchFusion_Rest` |
| `BlockheadIntentQuote_Timestamp` | signed-order/filler-market sources: `Oif_Aggregator`, `Lifi_IntentsOrderServer`, `NearIntents_OrderServer`, `UniswapTrading_Rest`, `OneInchFusion_Rest` |
| `BlockheadIntentOrder` | `Local_Internal` for the recorded submission/session link, `Constants_Internal` for normalized protocol labels, plus `Oif_Aggregator`, `Lifi_IntentsOrderServer`, `NearIntents_OrderServer`, `UniswapTrading_Rest`, `OneInchFusion_Rest` |
| `BlockheadIntentOrder_Timestamp` | `Constants_Internal` for normalized status labels, plus `Oif_Aggregator`, `Lifi_IntentsOrderServer`, `NearIntents_OrderServer`, `UniswapTrading_Rest`, `OneInchFusion_Rest` |
| `BlockheadWalletRequest` | `Local_Internal`, `Constants_Internal`, `Wallet_Eip1193`, `Wallet_Eip5792`, `Wallet_ProtocolApi` for non-EVM mock coverage until concrete bindings exist |
| `BlockheadWalletRequest_Timestamp` | `Local_Internal`, `Constants_Internal` for normalized status labels, `Wallet_Eip1193`, `Wallet_Eip5792`, `Wallet_ProtocolApi` |
| `BlockheadSessionSimulation` | `Local_Internal`, `Tevm_Runtime`, `Voltaire_JsonRpc` |
| `BlockheadSessionSimulationCall` | `Local_Internal`, `Tevm_Runtime` |
| `BlockheadSessionSimulationLog` | `Local_Internal`, `Tevm_Runtime` |

## Field Sourceability Rules

- Local ids, scoped ids, session/action links, list membership, ordering indexes, created/updated/requested/submitted timestamps, selected protocol, typed intent parameters, local quote/order/wallet links, and outcome/simulation envelopes are `Local_Internal`.
- Enum labels, normalized status labels, capability keys, protocol/action/wallet/invocation/simulation keys, intent definition keys, and reproducibility hashes over checked-in catalog definitions are `Constants_Internal`.
- CAIP selectors and EVM shortcut fields on typed intents are local product-routing fields until resolved to native `Network`, `EvmNetwork`, `Account`, `EvmAccount`, or asset rows by existing schema sources.
- `requestPayloadHash`, `quotePayloadHash`, `orderPayloadHash`, `statusPayloadHash`, `resultPayloadHash`, `inputDataHash`, `outputDataHash`, and `dataHash` are evidence handles. The source that produced the retained payload owns the hash observation; raw payload retention stays out of the primary schema row.
- Provider quote fields such as `quoteId`, `solverId`, `validUntil`, `estimatedFillSeconds`, previews, and integrity checksums are owned by the provider quote timestamp source, not by `Local_Internal`.
- Provider order status, fill/claim transaction hashes, gas used, status payload hashes, and provider errors are owned by `BlockheadIntentOrder_Timestamp` provider sources, not by `BlockheadIntentOrder`.
- Wallet request fields describing what Blockhead asked for are local; wallet-reported signatures, transaction ids/hashes, bundle ids/status, numeric status codes, observed atomicity, receipt counts, and wallet errors are timestamp observations from wallet sources.
- TEVM fork/run envelope fields are local/runtime evidence; call nodes and simulated logs are `Tevm_Runtime` replay artifacts and must not become public transaction/log facts without public chain resolver evidence.
- `source! p:str` on `BlockheadIntentQuote` and `BlockheadIntentOrder` names the provider/source binding the local artifact is correlated with. It is not the row's local identity and does not make provider handles primary selectors.
- `source! p:str` on timestamp rows names the observing source for that timestamp row. It does not change the parent row's identity or imply the source can resolve every sibling field.

## High-Risk Field Placement

Use this table during schema and resolver review. It catches fields that are valid in the model but wrong if placed on the wrong row family.

| Field family | Allowed placement | Must not appear on |
| --- | --- | --- |
| `selectedProtocol` / selected backend | `BlockheadSessionAction` | Typed intent rows, provider quote/order timestamp rows |
| `intentDefinitionKey`, `intentDefinitionHash`, `selectedOptionHash` | `BlockheadIntentInvocation` | Catalog entities, typed intent identity, provider payload rows |
| CAIP-2 / CAIP-10 / CAIP-19 and EVM shortcut selectors | Typed intent rows, readiness request rows, wallet request rows when request-shaped | Provider quote/order identity, canonical account/network/asset replacement rows inside this slice |
| `quoteId`, `solverId`, `validUntil`, quote previews, quote checksums | `BlockheadIntentQuote_Timestamp` | `BlockheadIntentQuote`, typed intent rows, session action rows |
| `source`, `quoteRequestHash`, `orderId` as correlation handles | `BlockheadIntentQuote` / `BlockheadIntentOrder` fields | Local selectors for quote/order parent rows |
| Provider order `status`, fill/claim transaction hashes, gas used, provider error | `BlockheadIntentOrder_Timestamp` | `BlockheadIntentOrder`, `BlockheadSessionAction`, typed intent rows |
| Wallet `status`, numeric status code, signatures, transaction hashes/ids, bundle ids, observed atomicity, receipt count, wallet error | `BlockheadWalletRequest_Timestamp` | `BlockheadWalletRequest`, `BlockheadSessionAction`, `BlockheadIntentOrder` |
| Requested wallet method, requested atomicity, requested call count, requested value | `BlockheadWalletRequest` | Wallet timestamp rows as source-observed truth, provider order rows |
| Readiness `status`, observed amount, deficit amount, observed capability status | `BlockheadActionReadinessCheck_Timestamp` | `BlockheadActionReadinessCheck`, account/asset identity rows |
| Readiness `checkKind`, requested capability key, required amount | `BlockheadActionReadinessCheck` | Timestamp rows as canonical balance/allowance/capability truth |
| Outcome `status` and local `finality` label | `BlockheadActionOutcome_Timestamp` | Public transaction/receipt/bridge transfer rows as canonical finality |
| Transaction hash/id and bridge transfer id as evidence handles | `BlockheadActionOutcome` / `BlockheadActionOutcome_Timestamp`, wallet timestamp rows when wallet-reported | Canonical public evidence unless resolved by external chain/protocol rows |
| Simulation `resultSummary`, `resultPayloadHash`, fork metadata, gas summary | `BlockheadSessionSimulation` | Public transaction, receipt, log, trace, or finality rows |
| Simulated call/log data hashes and addresses | `BlockheadSessionSimulationCall` / `BlockheadSessionSimulationLog` | Canonical `EvmTrace`, `EvmLog`, `EvmTransaction`, or receipt rows |
| Raw provider, wallet, runtime, or drag payloads | Retained out of band with hash/summary fields on the owning artifact or timestamp row | Primary schema fields, selectors, or generic JSON roots |

## Resolver Proof Checklist

Use this checklist when porting the intent model into the current schema/resolver format. It is a proof target, not an instruction to revive older schema-row syntax.

- Every resolver facet states selector input, source binding, transport/client, required auth/env, browser CORS/proxy behavior, returned fields, unavailable fields, freshness clock, pagination/count/list support, live/subscription behavior, and source-specific error vocabulary.
- Every source-specific timestamp row that can diverge by observer includes `source` in its selector. If two sources can observe different quote status, wallet status, readiness status, or simulation/runtime state at the same time, the selector must preserve that divergence.
- Resolver facet absence represents unsupported facts. Do not encode source support as `EntityFieldCardinality.Zero`, optional scalar fallbacks, or generic empty lists.
- `Local_Internal` can create session, action, accepted invocation, typed intent, readiness envelope, local outcome, quote/order link, wallet request, simulation envelope, retained call, and retained log rows. It cannot assert provider support, wallet authority, public chain finality, canonical balances, canonical allowances, public receipts, public logs, or settlement truth.
- `Browser_DragAndDrop` owns no durable rows. A test may prove drag payload behavior, but persistence begins only when `Local_Internal` records an accepted or replayable invocation.
- Signed-order/filler-market sources own quote/order observations, provider handles, provider payload hashes, status payload hashes, checksums, solver metadata, and provider errors. They do not own local action identity, ordered session membership, typed product-intent identity, or route-display quote identity.
- Ordinary route quote providers stay on existing route quote timestamp families such as `SwapQuote_Timestamp` and `BridgeRouteQuote_Timestamp`. Do not lift them into `BlockheadIntentQuote` unless the source exposes a signed-order, filler-market, or order-server lifecycle.
- Wallet sources own wallet-reported signatures, transaction ids/hashes, bundle ids, status codes, observed atomicity, receipt counts, and wallet errors. Wallet success is not public chain finality, and a submitted transaction hash is not a receipt.
- `Tevm_Runtime` owns fork/run metadata, local execution summaries, runtime payload hashes, simulated call nodes, and simulated logs. It is replay/runtime evidence only; public transaction/log truth must resolve through public chain sources.
- `Voltaire_JsonRpc` can supply fork block context and chain-state evidence for simulation setup. It should not be treated as the source of product-local action/session identity.
- Provider handles such as quote ids, order ids, solver ids, bundle ids, and transaction hashes are correlation fields unless the target domain already defines them as selectors. Local quote/order rows keep local `id` selectors.
- Fixtures must include negative evidence cases: drag hover with no durable row, route quote that does not create `BlockheadIntentQuote`, wallet rejection with no chain finality, provider status error without local action mutation, TEVM simulated log without public log evidence, and unsupported resolver facet represented by absence rather than `Zero`.

Source proof classification:

- `source-supported`: primary docs, a concrete payload, or current local code proves the source can return the field/list/status with the selector and freshness clock stated by the resolver facet.
- `source-derived-local`: the value is computed from local saved rows, catalog definitions, or retained payload hashes without claiming provider, wallet, runtime, or public-chain truth.
- `source-observed-not-canonical`: the source reports an observation such as wallet status, provider order status, simulation result, or readiness evidence that must live on a timestamp row and must not replace public evidence.
- `source-unavailable`: the source does not expose the fact, count, pagination, live update, or status vocabulary needed. Keep the resolver facet absent or mark the fixture unavailable; do not add placeholder fields.
- `source-ambiguous`: docs or payload examples conflict. Keep raw/source-specific vocabulary behind payload hashes or source-specific timestamp fields until a normal form is justified.
- `source-out-of-scope`: the fact belongs to an existing external anchor such as account, network, route quote, transaction, receipt, bridge transfer, or public log. Reference or resolve that external row instead of duplicating it in the intent slice.

## Source Fixture Outline

Use these fixtures with the ported drift gate so source ownership is executable instead of only described in prose.

- `local-internal-session-action`: creates one session, two ordered actions, one accepted invocation, one typed intent, one readiness check parent, one local outcome parent, one wallet request parent, and one simulation parent. Assert all local ids, scoped ids, links, ordering, selected protocol, requested timestamps, and retained list membership come from `Local_Internal`.
- `drag-hover-no-persistence`: simulates browser drag hover, drag preview, and `DataTransfer` payload with no accepted drop. Assert no session action, invocation, typed intent, quote, wallet request, or outcome row is created.
- `constants-only-labels`: resolves enum/catalog keys for action type, protocol, invocation modality, readiness status, wallet status, order status, outcome/finality labels, and reproducibility hashes. Assert `Constants_Internal` does not create provider observations, wallet observations, runtime observations, chain facts, or local artifact ids.
- `provider-quote-observation`: records two `BlockheadIntentQuote_Timestamp` rows for one local quote request with the same `timestampMs` and different provider `source` values. Assert provider fields such as `quoteId`, `solverId`, `validUntil`, `estimatedFillSeconds`, `quotePayloadHash`, and integrity checksums live only on timestamp rows.
- `route-quote-not-intent-quote`: records an executable router/aggregator quote for swap or bridge routing. Assert it maps to `SwapQuote_Timestamp` or `BridgeRouteQuote_Timestamp`, not `BlockheadIntentQuote`, unless the source exposes signed-order/filler-market order lifecycle evidence.
- `provider-order-status-observation`: records two local `BlockheadIntentOrder` parents that share a provider `source+orderId` but have different local `id` or session/action linkage. Assert provider status, fill/claim hashes, gas, status payload hash, and provider error live on `BlockheadIntentOrder_Timestamp`, not the parent or session action.
- `wallet-rejection-and-success`: records a requested-only wallet prompt rejection and a later submitted wallet observation with signature, transaction hash/id, bundle id/status, observed atomicity, receipt count, or wallet numeric status. Assert wallet observations stay on `BlockheadWalletRequest_Timestamp`, `submittedAt` remains optional, and wallet success never implies chain finality.
- `wallet-capability-readiness`: records EIP-5792 or protocol wallet capability evidence as a readiness timestamp observation. Assert capability support is not account identity, wallet authority, or a stable parent action field.
- `simulation-runtime-only`: records TEVM fork/run metadata, call nodes, simulated logs, gas/error summaries, and runtime payload hashes. Assert simulated calls/logs are not public `EvmTrace`, `EvmLog`, `EvmTransaction`, receipt, or settlement evidence.
- `unsupported-facet-absence`: requests a field/list/count/live facet not supported by a source. Assert the resolver facet is absent or reported unavailable; do not encode unsupported source capability as `EntityFieldCardinality.Zero`, placeholder primitive fields, or empty global lists.
