# Blockhead Intents Mock Schema

## Scope

This file isolates the mock schema for product intents, drag/drop invocation, local sessions, signed-order/filler-market quotes, solver orders, and simulation artifacts. It follows the stricter `SCHEMA.md` rule: entities need stable identity plus a useful view boundary. Catalog definitions, protocol support matrices, action labels, drag modalities, and transient UI previews are not entities.

## Competency Questions

- What local session action was created from a drag/drop, command, URL, or agent suggestion, and which catalog definition/version produced it?
- For a selected action, what is the typed product goal, selected protocol/backend, ordered session position, and editable local state?
- What readiness checks did Blockhead run for the action, what source observed each result, and which values are product-local verdicts versus canonical balance/allowance/capability evidence?
- Which signed-order/filler-market quote requests were retained for this action or typed goal, which provider/source produced each quote observation, and which provider payload is only hash/summary evidence?
- Which provider/order-server submissions are linked to the action, what is the provider order handle, and what mutable status/fill/claim evidence has been observed over time?
- What wallet request was made, when was it requested versus submitted, what did the wallet report, and why is that not yet chain finality?
- What simulation ran for the session, which local call/log artifacts were retained, and why are they not canonical public transaction or log evidence?
- What product outcome summary does Blockhead currently show for an action, and which public chain/protocol evidence still needs resolver proof?

## Modeling Invariants

- Product intents are local user goals. Protocol intents are provider/order-server payloads. Do not collapse them into one row.
- `ActionType`, `Protocol`, `IntentDefinition`, `DragAndDrop`, and protocol/action support are enum/catalog definitions, not entities.
- `Constants_Internal` in a row's source list means checked-in enum/catalog normalization, labels, and reproducibility hashes. It does not mean constants produced provider, wallet, or runtime observations.
- A drag payload is transport. Persist only the accepted or recorded invocation result, including the catalog definition key/hash that produced it when replayability matters.
- A session action is an ordered editable local row. Protocol/backend selection lives on the action because it is an execution choice for the action, not part of typed swap/bridge/transfer goal identity. Readiness checks, quotes, routes, transactions, signatures, orders, simulations, and outcomes are separate artifacts.
- At most one typed intent row should exist for a session action in the current action family. `BlockheadSwapIntent`, `BlockheadBridgeIntent`, and `BlockheadTransferIntent` reuse `sessionId+actionId` because action type chooses the typed goal surface; do not treat them as simultaneously valid payload variants for one action.
- Typed intent rows carry meaningful local params. Raw `actionParams` is a fallback/debug payload, not the primary model.
- Typed intent rows may carry CAIP-shaped network/account/asset selectors plus EVM shortcuts. CAIP fields are interop selectors for product intent routing, not replacements for native account, asset, or protocol payload models.
- Intent quote/order rows preserve signed-order and filler-market payloads without forcing OIF, LI.FI, NEAR Intents, UniswapX, 1inch Fusion, and future adapters into identical domain rows.
- Ordinary executable route quotes stay in specialized quote rows such as `SwapQuote_Timestamp` and `BridgeRouteQuote_Timestamp`; do not route every quote-shaped response through `BlockheadIntentQuote`.
- `_Timestamp` rows model changing quote/order/wallet observations when history or source divergence matters. Parent rows may expose latest observations in their views, but mutable provider status, fill hashes, and wallet-reported outcomes belong to child timestamp rows.
- Raw provider, wallet, and simulation payloads are source evidence retained only when useful for debugging/replay. Schema rows should expose hashes, compact previews, selectors, and typed fields before raw JSON blobs.
- Wallet capability discovery/check state belongs to readiness artifacts and wallet request observations. Do not fold wallet capability support into account identity or assume out-of-band capability metadata is current when live wallet RPC says otherwise.
- Wallet request/submission state belongs to local wallet request artifacts, not the original session action and not provider intent orders.
- `$` and `$$` references are navigation and grouping relationships, not proof of resolver completeness. List counts must state whether they are local derived counts, source-window counts, latest-observation counts, or merely absent until a resolver supplies them.

## Notation

- `Entity Name :: selector ; fields`
- `$field $:Entity` is one entity reference.
- `$$field* $:Entity` is a list/child reference; it does not imply complete global coverage.
- `p:type` is primitive/structured data.
- `SourceBinding.*` values are defined in `SOURCES_INTENTS.md`.

## External Reference Assumptions

- `Account`, `Network`, `EvmAccount`, `EvmNetwork`, `EvmCoinInstance`, and `BlockheadWalletConnection` are existing broader identity/state anchors, not entities owned by this intent slice.
- `SwapQuote_Timestamp`, `BridgeRouteQuote_Timestamp`, `EvmTransaction`, canonical protocol transaction rows, bridge transfer rows, receipts, and public logs are existing or future non-intent evidence surfaces. Intent rows may point users toward them in views or notes, but they do not make those rows part of the local intent artifact model.
- Intent-slice refs to those anchors are optional resolution targets. A local session action, typed intent, readiness check, quote, order, wallet request, outcome, or simulation artifact remains valid when the external anchor has not resolved yet.
- CAIP-2, CAIP-10, CAIP-19, EVM chain id, EVM address, and token-address shortcut fields remain local routing selectors until a resolver links them to those existing native rows.
- Do not create duplicate intent-local account, network, asset, wallet-connection, route-quote, transaction, receipt, bridge-transfer, or log entities only to make these refs total. Add source facets or selector derivations on existing anchors when product behavior needs stronger resolution.

## List Contracts

- `BlockheadSession.$$actions`: local list ordered by `indexInSequence`, then `createdAt`; count is local saved action count; empty is valid for draft sessions.
- `BlockheadSession.$$intentInvocations`: local list ordered by `createdAt`; count is local saved invocation count; empty means no accepted or recorded invocation has been persisted.
- `BlockheadSession.$$simulations`: local list ordered by `createdAt`; count is local saved simulation count; empty means no simulation has been retained for the session.
- `BlockheadSessionAction.$$readinessChecks`: local list ordered by `createdAt`; count is local saved readiness-check count; empty means readiness has not been evaluated or retained for the action.
- `BlockheadSessionAction.$$quotes`: local list ordered by `requestedAt`; count is local recorded quote request count for signed-order/filler-market protocols linked to the action; imported/unlinked quote records stay addressable by `BlockheadIntentQuote.id` but do not appear here until linked.
- `BlockheadSessionAction.$$orders`: local list ordered by `submittedAt`; count is local recorded provider/order-server submission count linked to the action; imported/unlinked provider order records stay addressable by `BlockheadIntentOrder.id` but do not appear here until linked.
- `BlockheadSessionAction.$$walletRequests`: local list ordered by `requestedAt`; count is local wallet request count for signing/submission attempts linked to the action; standalone wallet requests stay addressable by `BlockheadWalletRequest.id` but do not appear here until linked.
- `BlockheadSessionAction.$$outcomes`: local list ordered by `createdAt`; count is local saved outcome summary count; empty means no outcome evidence has been saved for the action.
- Typed intent `$$quotes`: same retained quote artifact set as the linked action filtered through that typed goal surface; ordered by `requestedAt`; count is recorded signed-order/filler-market quote request count, not source-global quote availability.
- Any `$$timestamps` list is ordered by `timestampMs`; latest means the newest retained row for the relevant source scope, not proof that every external status or quote observation was persisted.
- Simulation `$$calls` is ordered by `callIndex` and tree position through `parentCallPath`; `$$logs` is ordered by `logIndex`; both counts are retained local runtime artifact counts, not public trace/log counts.
- Empty lists are valid unless a row note explicitly says the artifact cannot exist without at least one retained child.

```text
  Entity BlockheadSession :: id ; id! p:str, name? p:str, status! p:enum, createdAt! p:num, updatedAt! p:num, lockedAt? p:num, $latestSimulation? $:BlockheadSessionSimulation, simulationCount? p:num, $$actions* $:BlockheadSessionAction, $$intentInvocations* $:BlockheadIntentInvocation, $$simulations* $:BlockheadSessionSimulation
    Sources ::
      - SourceBinding.Local_Internal
    View :: {"closed":["id/name","status","created/updated/locked timestamps"],"content":{"dl":[["id/name","status","created/updated/locked timestamps","simulation count","latest simulation when linked"]]},"details":{"tabs":[["Actions",["ordered BlockheadSessionAction list"]],["Invocations",["accepted drag/drop or command invocations"]],["Simulations",["BlockheadSessionSimulation list"]],["Orders",["intent orders linked through actions"]]]}}
    Notes :: Local-first transaction/action workspace. It is not canonical chain history, a protocol order, a wallet session, or a provider quote. Draft sessions may have zero actions; `simulationCount` and `$$simulations` are local derived views over saved simulation artifacts, not source-reported global metrics. Locked persisted sessions record a submitted/simulated state; later edits should create a new session or action artifact rather than mutate prior execution evidence.

  Entity BlockheadSessionAction :: sessionId+actionId ; sessionId! p:str, actionId! p:str, $session! $:BlockheadSession, indexInSequence! p:num, actionType! p:enum, selectedProtocol? p:enum, actionParams? p:json, createdAt! p:num, updatedAt! p:num, $originInvocation? $:BlockheadIntentInvocation, $$readinessChecks* $:BlockheadActionReadinessCheck, $$quotes* $:BlockheadIntentQuote, $$orders* $:BlockheadIntentOrder, $$walletRequests* $:BlockheadWalletRequest, $$outcomes* $:BlockheadActionOutcome
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
    View :: {"closed":["session","action id","sequence index"],"content":{"dl":[["session","action id","sequence index","action type","selected protocol","created/updated timestamps"]]},"details":{"tabs":[["Typed intent",["BlockheadSwapIntent","BlockheadBridgeIntent","BlockheadTransferIntent","or future typed local intent row"]],["Readiness",["BlockheadActionReadinessCheck list"]],["Quotes",["BlockheadIntentQuote list when provider-backed"]],["Orders",["BlockheadIntentOrder list when submitted"]],["Wallet requests",["BlockheadWalletRequest list when signing/submission is requested"]],["Outcomes",["BlockheadActionOutcome list"]],["Raw params",["actionParams fallback/debug payload"]],["Session",["BlockheadSessionView"]]]}}
    Notes :: Local ordered action row. `indexInSequence` is local ordering within the session and may be rewritten by reorder operations before lock/submission. `selectedProtocol` is the user's chosen protocol/backend option for this action, not proof that the provider supports or fulfilled it. `$$readinessChecks`, `$$quotes`, `$$orders`, `$$walletRequests`, and `$$outcomes` are local retained artifact lists linked to this action; they are not complete balance, allowance, capability, provider quote, provider order, wallet audit, or chain-history coverage. Keep `actionParams` as migration/debug data; typed intent rows are the durable model.

  Entity BlockheadActionReadinessCheck :: sessionId+actionId+checkId ; sessionId! p:str, actionId! p:str, checkId! p:str, $sessionAction! $:BlockheadSessionAction, checkKind! p:enum, networkCaip2? p:{namespace:str,reference:str}, accountCaip10? p:{namespace:str,reference:str,accountAddress:str}, assetCaip19? p:str, chainId? p:num, accountAddress? p:evmAddress, tokenAddress? p:evmAddress, spenderAddress? p:evmAddress, capabilityKey? p:str, requiredAmount? p:bigint, createdAt! p:num, $$timestamps* $:BlockheadActionReadinessCheck_Timestamp
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
    View :: {"closed":["readiness check","kind","latest status"],"content":{"dl":[["session action","check id","kind","network/account/asset selectors","EVM account/token/spender shortcuts","capability key","required amount","created time","latest status"]]},"details":{"tabs":[["Status history",["BlockheadActionReadinessCheck_Timestamp list"]],["Session action",["BlockheadSessionActionView"]],["Source evidence",["linked balance/allowance/capability rows when implemented"]]]}}
    Notes :: Local readiness evaluation request for an action, such as balance, allowance, wallet capability, route precondition, or simulation precondition. `checkId` is scoped to the session action so repeated checks of the same kind and subject can be retained without conflating retries. It records what Blockhead decided to check before quoting, signing, or simulating; it is not itself a canonical balance, allowance, permission, route, quote, or wallet approval. CAIP fields describe cross-namespace readiness subjects; EVM address fields are eip155 shortcuts only. `capabilityKey` is the requested wallet/source capability such as EIP-5792 `atomic`, not proof the wallet supports it. `requiredAmount` is the app's requested threshold for this check, not an observed balance or allowance.

  Entity BlockheadActionReadinessCheck_Timestamp :: $readinessCheck+timestampMs+source ; $readinessCheck! $:BlockheadActionReadinessCheck, timestampMs! p:num, source! p:str, status! p:enum, observedAmount? p:bigint, requiredAmount? p:bigint, deficitAmount? p:bigint, observedCapabilityStatus? p:str, sourcePayloadHash? p:hex, error? p:str
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
      - SourceBinding.Wallet_Eip1193
      - SourceBinding.Wallet_Eip5792
      - SourceBinding.Wallet_ProtocolApi
    View :: {"closed":["readiness check","observation time","status"],"content":{"dl":[["readiness check","observation time","source","status","observed amount","required amount","deficit amount","observed capability status","source payload hash","error"]]},"details":{"tabs":[["Readiness check",["BlockheadActionReadinessCheckView"]],["Canonical evidence",["balance/allowance/capability rows when resolved outside this local artifact"]]]}}
    Notes :: Timestamped local readiness result. Use it to show whether the saved action was ready at a given observation time, not as final chain truth. Observed balance, allowance, wallet capability, or precondition evidence should resolve through canonical account/asset/wallet/source rows when implemented; this row stores the product-local readiness verdict and compact numeric/capability comparison needed by the session UI. For EIP-5792 capability checks, `observedCapabilityStatus` can retain values such as supported, ready, or unsupported without turning wallet capabilities into account identity.

  Entity BlockheadIntentInvocation :: sessionId+invocationId ; sessionId! p:str, invocationId! p:str, $session! $:BlockheadSession, modality! p:enum, sourceEntityType? p:enum, sourceSelector? p:json, targetEntityType? p:enum, targetSelector? p:json, sourcePlacement? p:enum, targetPlacement? p:enum, invocationPayloadHash? p:hex, resolvedIntentType? p:enum, intentDefinitionKey? p:str, intentDefinitionHash? p:hex, selectedOptionIndex? p:num, selectedOptionHash? p:hex, createdAt! p:num, $createdAction? $:BlockheadSessionAction
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
    View :: {"closed":["session","modality","source/target entity types"],"content":{"dl":[["session","modality","source entity type","target entity type","placements","invocation payload hash","resolved intent type","intent definition key/hash","selected option index/hash","created time"]]},"details":{"tabs":[["Source selector",["serialized selector payload when present"]],["Target selector",["serialized selector payload when present"]],["Created action",["BlockheadSessionActionView when accepted"]],["Resolution",["catalog definition key","definition hash","selected option hash"]]]}}
    Notes :: Persisted local invocation result, usually accepted drag/drop or command state. Source/target entity selectors are optional because command palette, URL template, and agent-suggested invocations can resolve without a dragged source entity. The HTML `DataTransfer` payload, hover preview, tooltip, and transient arrow are UI transport, not source ownership for this durable row. Selectors are local addressing payloads, not proof that the referenced rows still resolve. `invocationPayloadHash` fingerprints retained non-drag command, URL, or agent suggestion input when replay/debug evidence matters without making raw UI payloads schema fields. `intentDefinitionKey` is a catalog address such as an IntentType or definition id; `intentDefinitionHash` and `selectedOptionHash` are local reproducibility evidence for the definition/option shapes used at decision time, not standalone definition identity.

  Entity BlockheadActionOutcome :: sessionId+actionId+outcomeId ; sessionId! p:str, actionId! p:str, outcomeId! p:str, $sessionAction! $:BlockheadSessionAction, outcomeKind! p:enum, $walletRequest? $:BlockheadWalletRequest, $intentOrder? $:BlockheadIntentOrder, $simulation? $:BlockheadSessionSimulation, transactionHash? p:hex, transactionId? p:str, bridgeTransferId? p:str, createdAt! p:num, outcomeSummary? p:json, outcomePayloadHash? p:hex, $$timestamps* $:BlockheadActionOutcome_Timestamp
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
    View :: {"closed":["outcome","kind","latest status"],"content":{"dl":[["session action","outcome id","kind","linked wallet request","linked intent order","linked simulation","transaction hash/id","bridge transfer id","created time","outcome payload hash"]]},"details":{"tabs":[["Status history",["BlockheadActionOutcome_Timestamp list"]],["Session action",["BlockheadSessionActionView"]],["Wallet request",["BlockheadWalletRequestView when linked"]],["Intent order",["BlockheadIntentOrderView when linked"]],["Simulation",["BlockheadSessionSimulationView when linked"]],["Public evidence",["transaction/receipt/bridge transfer rows when resolved outside this local artifact"]]]}}
    Notes :: Local product outcome summary for an action. `outcomeId` is scoped to the session action so multiple submissions, failed attempts, simulation-only outcomes, and later public lookups can be retained independently. It groups the evidence Blockhead has saved after a wallet request, provider order, simulation, or public transaction lookup. It is not itself a canonical transaction, receipt, bridge transfer, fill, settlement, or finality proof. `transactionHash`, `transactionId`, and `bridgeTransferId` are evidence handles for later resolver lookups; canonical execution facts must resolve through public chain/protocol rows.

  Entity BlockheadActionOutcome_Timestamp :: $outcome+timestampMs+source ; $outcome! $:BlockheadActionOutcome, timestampMs! p:num, source! p:str, status! p:enum, finality? p:enum, transactionHash? p:hex, transactionId? p:str, bridgeTransferId? p:str, sourcePayloadHash? p:hex, error? p:str
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
    View :: {"closed":["outcome","observation time","status"],"content":{"dl":[["outcome","observation time","source","status","finality","transaction hash/id","bridge transfer id","source payload hash","error"]]},"details":{"tabs":[["Outcome",["BlockheadActionOutcomeView"]],["Public evidence",["transaction/receipt/bridge transfer rows when resolved outside this local artifact"]]]}}
    Notes :: Timestamped local outcome observation. It records what Blockhead currently believes about an action's product outcome and where to look for external evidence. `finality` is a local display/status label until public chain or protocol sources resolve canonical finality; do not use this row as final execution truth.

  Entity BlockheadSwapIntent :: sessionId+actionId ; sessionId! p:str, actionId! p:str, $sessionAction! $:BlockheadSessionAction, networkCaip2? p:{namespace:str,reference:str}, assetInCaip19? p:str, assetOutCaip19? p:str, chainId? p:num, tokenInAddress? p:evmAddress, tokenOutAddress? p:evmAddress, $network? $:Network, $evmNetwork? $:EvmNetwork, $tokenIn? $:EvmCoinInstance, $tokenOut? $:EvmCoinInstance, amount? p:bigint, slippage? p:num, $$quotes* $:BlockheadIntentQuote
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
    View :: {"closed":["session action","network","asset in/out"],"content":{"dl":[["session action","action selected protocol","network CAIP-2","asset CAIP-19 in/out","EVM chain id/raw token addresses","resolved network/token refs","amount","slippage"]]},"details":{"tabs":[["Session action",["BlockheadSessionActionView"]],["Readiness",["BlockheadActionReadinessCheck list"]],["Intent quotes",["BlockheadIntentQuote list for signed-order/filler-market protocols"]],["Route quotes",["SwapQuote_Timestamp for executable router/aggregator quotes"]],["Execution",["orders","wallet requests","simulation rows when linked"]],["Outcomes",["BlockheadActionOutcome list"]]]}}
    Notes :: Local same-chain swap goal. It is not an AMM pool, market quote, OIF payload, UniswapX order, approval, calldata, or submitted transaction. It should only exist when the linked action's `actionType` is the swap family; bridge/transfer variants for the same action are invalid local data, not alternate interpretations. Read protocol/backend selection through the linked session action; do not duplicate it as typed goal identity. `networkCaip2` and asset CAIP-19 fields let non-EVM or interop flows state the product goal; `chainId`, token addresses, and EVM refs are eip155 shortcuts only. `$$quotes` is a local/source-indexed list of signed-order/filler-market quotes recorded for this intent, not all possible quotes. Same-chain OIF, NEAR Intents, UniswapX, and 1inch Fusion requests are intent quote/order artifacts derived from this row; ordinary router or aggregator quote responses belong on SwapQuote_Timestamp.

  Entity BlockheadBridgeIntent :: sessionId+actionId ; sessionId! p:str, actionId! p:str, $sessionAction! $:BlockheadSessionAction, fromNetworkCaip2? p:{namespace:str,reference:str}, toNetworkCaip2? p:{namespace:str,reference:str}, assetCaip19? p:str, fromAssetCaip19? p:str, toAssetCaip19? p:str, fromChainId? p:num, toChainId? p:num, coinId? p:str, fromTokenAddress? p:evmAddress, toTokenAddress? p:evmAddress, $fromNetwork? $:Network, $toNetwork? $:Network, $fromEvmNetwork? $:EvmNetwork, $toEvmNetwork? $:EvmNetwork, $fromToken? $:EvmCoinInstance, $toToken? $:EvmCoinInstance, amount? p:bigint, slippage? p:num, $$quotes* $:BlockheadIntentQuote
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
    View :: {"closed":["session action","from/to networks","asset"],"content":{"dl":[["session action","action selected protocol","from/to CAIP-2","asset CAIP-19 values","EVM chain ids/raw token addresses","coin id","resolved network/token refs","amount","slippage"]]},"details":{"tabs":[["Session action",["BlockheadSessionActionView"]],["Readiness",["BlockheadActionReadinessCheck list"]],["Intent quotes",["BlockheadIntentQuote list for signed-order/filler-market protocols"]],["Route quotes",["BridgeRouteQuote_Timestamp for executable route quotes"]],["Execution",["orders","wallet requests","bridge transfer rows when source-proven"]],["Outcomes",["BlockheadActionOutcome list"]]]}}
    Notes :: Local cross-chain movement goal. It should only exist when the linked action's `actionType` is the bridge family; swap/transfer variants for the same action are invalid local data, not alternate interpretations. Read protocol/backend selection through the linked session action; do not duplicate it as typed goal identity. `fromNetworkCaip2`, `toNetworkCaip2`, and asset CAIP-19 fields describe cross-namespace product intent where available; EVM chain ids, token addresses, and EVM refs are eip155 shortcuts only. `$$quotes` is a local/source-indexed list of signed-order/filler-market quotes recorded for this intent, not all bridge route possibilities. For NEAR Intents/OIF same-coin bridge, `coinId` or `assetCaip19` plus chain-specific asset refs describe the product goal; EIP-7930/OIF input-output payloads belong to intent quote/order rows. Normal LI.FI route quotes that return executable transaction requests and included steps belong on BridgeRouteQuote_Timestamp. This row is not a bridge deployment, route quote, settlement proof, refund, or destination receipt.

  Entity BlockheadTransferIntent :: sessionId+actionId ; sessionId! p:str, actionId! p:str, $sessionAction! $:BlockheadSessionAction, fromCaip10? p:{namespace:str,reference:str,accountAddress:str}, toCaip10? p:{namespace:str,reference:str,accountAddress:str}, networkCaip2? p:{namespace:str,reference:str}, assetCaip19? p:str, fromAddress? p:evmAddress, toAddress? p:evmAddress, chainId? p:num, tokenAddress? p:evmAddress, $fromAccount? $:Account, $toAccount? $:Account, $from? $:EvmAccount, $to? $:EvmAccount, $network? $:Network, $evmNetwork? $:EvmNetwork, $token? $:EvmCoinInstance, amount? p:bigint
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
    View :: {"closed":["session action","from/to accounts","network"],"content":{"dl":[["session action","from/to CAIP-10","network CAIP-2","asset CAIP-19","EVM from/to/token shortcuts","resolved account/network/token refs","amount"]]},"details":{"tabs":[["Session action",["BlockheadSessionActionView"]],["Readiness",["BlockheadActionReadinessCheck list"]],["Execution",["authorization","wallet requests","receipt rows when source-proven"]],["Outcomes",["BlockheadActionOutcome list"]]]}}
    Notes :: Local transfer goal. It should only exist when the linked action's `actionType` is the transfer family; swap/bridge variants for the same action are invalid local data, not alternate interpretations. CAIP-10/CAIP-2/CAIP-19 fields are interop selectors for local product routing and do not prove sender authority or replace native account/asset rows. EVM addresses, chain id, token address, and EVM refs are eip155 shortcuts only. This row does not prove available balance, token allowance, transfer submission, or final settlement.

  Entity BlockheadIntentQuote :: id ; id! p:str, source! p:str, quoteRequestHash! p:hex, $sessionAction? $:BlockheadSessionAction, providerProtocol! p:enum, intentType? p:str, userInteropAddress? p:hex, requestedAt! p:num, requestPayloadHash? p:hex, requestSummary? p:json, $$timestamps* $:BlockheadIntentQuote_Timestamp
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
      - SourceBinding.Lifi_IntentsOrderServer
      - SourceBinding.NearIntents_OrderServer
      - SourceBinding.Oif_Aggregator
      - SourceBinding.OneInchFusion_Rest
      - SourceBinding.UniswapTrading_Rest
    View :: {"closed":["quote request id","source","provider protocol"],"content":{"dl":[["quote request id","source","request hash","provider protocol","intent type","session action","user interop address","requested time","request payload hash"]]},"details":{"tabs":[["Quote observations",["BlockheadIntentQuote_Timestamp list"]],["Session action",["BlockheadSessionActionView when linked"]],["Request summary",["normalized signed-order/filler-market request summary","raw provider request retained only when needed"]],["Specialized quotes",["SwapQuote_Timestamp or BridgeRouteQuote_Timestamp when the provider returns executable route quotes instead of intent orders"]]]}}
    Notes :: Local recorded signed-order or filler-market quote request artifact. `id` keeps two identical normalized quote requests in different sessions/actions from collapsing into one row; `quoteRequestHash` is over normalized request fields for replay, dedupe hints, and provider payload correlation. `requestPayloadHash` fingerprints the provider request bytes/JSON when retained; `requestSummary` is a compact normalized preview, not canonical provider payload identity. Use this row for OIF/LI.FI order-server/NEAR Intents/UniswapX/1inch Fusion style flows where the quote can become a signed order with provider status. Do not use it as a catch-all for normal router/aggregator executable quotes; those stay on SwapQuote_Timestamp or BridgeRouteQuote_Timestamp. OIF `intentType`, ERC-7683 order data, EIP-7930 addresses, UniswapX order payloads, and 1inch Fusion auction/order data are provider-specific evidence here, not local product intent identity.

  Entity BlockheadIntentQuote_Timestamp :: $quote+timestampMs+source ; $quote! $:BlockheadIntentQuote, timestampMs! p:num, source! p:str, quoteId? p:str, solverId? p:str, validUntil? p:num, estimatedFillSeconds? p:num, inputPreview? p:json, outputPreview? p:json, quotePayloadHash? p:hex, integrityChecksum? p:str, error? p:str
    Sources ::
      - SourceBinding.Lifi_IntentsOrderServer
      - SourceBinding.NearIntents_OrderServer
      - SourceBinding.Oif_Aggregator
      - SourceBinding.OneInchFusion_Rest
      - SourceBinding.UniswapTrading_Rest
    View :: {"closed":["quote","observation time","source","quote id/solver"],"content":{"dl":[["quote","observation time","source","quote id","solver id","valid until","estimated fill seconds","quote payload hash","error"]]},"details":{"tabs":[["Quote request",["BlockheadIntentQuoteView"]],["Preview",["provider input/output preview"]],["Source evidence",["backend-specific quote payload retained only when needed"]],["Integrity",["checksum/expiry/source freshness"]]]}}
    Notes :: Time-varying signed-order/filler-market quote observation. Include source in the selector because local recorded quote artifacts can be correlated with provider/order-server observations from distinct backends or adapters at the same clock. Timestamp history is the retained source observation history for this request, not a guarantee that every provider quote ever returned was persisted. Quotes expire, can be solver-specific, and can be re-priced for the same request. Preview is informational unless validated against the exact signed order payload; use `quotePayloadHash` for replay/debug correlation when retaining the raw provider quote out of band. If the response is only an executable router transaction request without a later order/status lifecycle, model it as a specialized route quote instead.

  Entity BlockheadIntentOrder :: id ; id! p:str, source! p:str, orderId! p:str, $quote? $:BlockheadIntentQuote, $sessionAction? $:BlockheadSessionAction, providerProtocol! p:enum, submittedAt! p:num, signatureHash? p:hex, orderPayloadHash? p:hex, orderSummary? p:json, $$timestamps* $:BlockheadIntentOrder_Timestamp
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
      - SourceBinding.Lifi_IntentsOrderServer
      - SourceBinding.NearIntents_OrderServer
      - SourceBinding.Oif_Aggregator
      - SourceBinding.OneInchFusion_Rest
      - SourceBinding.UniswapTrading_Rest
    View :: {"closed":["order record id","source","order id","latest status"],"content":{"dl":[["order record id","source","order id","provider protocol","submitted time","signature hash","order payload hash","latest status","latest fill tx","latest claim tx"]]},"details":{"tabs":[["Quote",["BlockheadIntentQuoteView when linked"]],["Status history",["BlockheadIntentOrder_Timestamp list"]],["Session action",["BlockheadSessionActionView when linked"]],["Order summary",["signed provider/order-server payload summary","raw order retained only when needed"]]]}}
    Notes :: Local recorded provider/order-server submission artifact. `id` keeps repeated imports or multiple local actions that reference the same provider order from collapsing; `source+orderId` remains the provider correlation handle. It is not the local action itself, not a wallet request, and not final chain truth. `Local_Internal` owns the session/action link and saved submission time; provider/order-server sources own the stable order handle plus hashes/summaries of the submitted payload. Wallet signatures or submissions used to authorize/create an order belong on BlockheadWalletRequest when the app records them. Mutable order status, fill transaction hashes, claim transaction hashes, gas, and errors belong on BlockheadIntentOrder_Timestamp. Link to transaction, bridge transfer, or receipt rows only when a chain/indexer/source proves those facts.

  Entity BlockheadIntentOrder_Timestamp :: $order+timestampMs+source ; $order! $:BlockheadIntentOrder, timestampMs! p:num, source! p:str, status! p:enum, fillTxHash? p:hex, claimTxHash? p:hex, gasUsed? p:bigint, statusPayloadHash? p:hex, error? p:str
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Lifi_IntentsOrderServer
      - SourceBinding.NearIntents_OrderServer
      - SourceBinding.Oif_Aggregator
      - SourceBinding.OneInchFusion_Rest
      - SourceBinding.UniswapTrading_Rest
    View :: {"closed":["order","observation time","source","status"],"content":{"dl":[["order","observation time","source","status","fill tx","claim tx","gas used","status payload hash","error"]]},"details":{"tabs":[["Order",["BlockheadIntentOrderView"]],["Status evidence",["backend-specific status payload retained only when needed"]],["Chain evidence",["linked transaction/receipt/bridge transfer rows when resolved"]]]}}
    Notes :: Poll/status observation for an intent order. Include source in the selector because provider APIs, order-server adapters, and local imported status evidence can report distinct observations for the same order and clock. Timestamp history is the retained poll/status observation history for this order, not proof of complete provider lifecycle coverage. Status words are provider-specific and should be normalized conservatively; terminal statuses do not replace chain/indexer evidence. Use `statusPayloadHash` for provider payload correlation without making raw status JSON part of the primary schema surface.

  Entity BlockheadWalletRequest :: id ; id! p:str, $sessionAction? $:BlockheadSessionAction, $intentOrder? $:BlockheadIntentOrder, $walletConnection? $:BlockheadWalletConnection, walletProtocol? p:enum, caip10? p:{namespace:str,reference:str,accountAddress:str}, requestKind! p:enum, requestMethod! p:str, chainId? p:num, fromAddress? p:evmAddress, toAddress? p:evmAddress, value? p:bigint, callCount? p:num, atomicRequired? p:bool, requestPayloadHash? p:hex, walletCallBundleId? p:str, requestedAt! p:num, submittedAt? p:num, $$timestamps* $:BlockheadWalletRequest_Timestamp
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
      - SourceBinding.Wallet_Eip1193
      - SourceBinding.Wallet_Eip5792
      - SourceBinding.Wallet_ProtocolApi
    View :: {"closed":["request id","request kind","latest status"],"content":{"dl":[["request id","wallet protocol","request kind","method","latest status","wallet connection","account","chain id","from/to","value","call count","atomic required","requested time","submitted time"],["latest signature hash","latest transaction hash","latest transaction id","wallet call bundle id","request payload hash"]]},"details":{"tabs":[["Status history",["BlockheadWalletRequest_Timestamp list"]],["Session action",["BlockheadSessionActionView when linked"]],["Intent order",["BlockheadIntentOrderView when linked"]],["Wallet",["BlockheadWalletConnectionView when linked"]],["Chain evidence",["EvmTransaction or protocol transaction rows when the hash/id resolves publicly"]],["Request evidence",["request payload retained locally only when needed"]]]}}
    Notes :: Local wallet request/submission artifact for signing, sending a transaction, or submitting a wallet call batch. It records what the connected wallet was asked to do; wallet-reported status, rejection, signatures, and transaction ids belong on timestamp observations. `requestedAt` is when Blockhead asked the wallet; `submittedAt` is only set when the wallet or provider accepted, signed, sent, or submitted a batch. Rejected prompts can have no submittedAt. `walletProtocol` carries the wallet API family from the wallet catalog; `chainId`, `fromAddress`, `toAddress`, `value`, `callCount`, and `atomicRequired` are EVM-shaped shortcuts used only when the request is EVM-shaped. For EIP-5792, `atomicRequired` mirrors the app's requested batch atomicity; the wallet-reported execution atomicity belongs on BlockheadWalletRequest_Timestamp. Non-EVM request bodies stay behind `requestPayloadHash`, `statusPayloadHash`, and protocol transaction ids until a concrete product flow needs stable child rows for inspected payload parts. It is not a provider intent order, not proof of on-chain inclusion, not wallet account identity, and not final execution truth. Link to public transaction rows only after chain/indexer sources resolve the hash or id.

  Entity BlockheadWalletRequest_Timestamp :: $walletRequest+timestampMs+source ; $walletRequest! $:BlockheadWalletRequest, timestampMs! p:num, source! p:str, status! p:enum, walletStatusCode? p:num, walletCallBundleStatus? p:enum, atomic? p:bool, receiptCount? p:num, transactionHash? p:hex, transactionId? p:str, signatureHash? p:hex, statusPayloadHash? p:hex, error? p:str
    Sources ::
      - SourceBinding.Constants_Internal
      - SourceBinding.Local_Internal
      - SourceBinding.Wallet_Eip1193
      - SourceBinding.Wallet_Eip5792
      - SourceBinding.Wallet_ProtocolApi
    View :: {"closed":["wallet request","observation time","source","status"],"content":{"dl":[["wallet request","observation time","source","status","wallet status code","wallet call bundle status","atomic execution","receipt count","transaction hash","transaction id","signature hash","status payload hash","error"]]},"details":{"tabs":[["Wallet request",["BlockheadWalletRequestView"]],["Status evidence",["wallet-reported status/result payload retained only when needed"]],["Chain evidence",["linked transaction rows when resolved"]]]}}
    Notes :: Timestamped wallet-reported lifecycle observation. Timestamp history is the retained local/provider observation history for this request, not a complete wallet audit log. Include source in the selector because local app state, EIP-1193, EIP-5792, and protocol-specific wallet APIs can report distinct observations for the same request and clock. EIP-1193 providers may only return a signature, transaction hash, or rejection; EIP-5792 call batches can expose a wallet-local call bundle id, numeric status category, atomic execution flag, receipt count, and status before public transaction evidence exists. `walletStatusCode` retains protocol numeric status categories such as EIP-5792 1xx pending, 2xx confirmed, 4xx offchain failure, 5xx chain failure, and 6xx partial chain failure without making the product enum pretend to be the protocol's full status vocabulary. Use `statusPayloadHash` for wallet-result correlation without making raw wallet status JSON part of the primary schema surface. Do not treat wallet-reported success as chain finality.

  Entity BlockheadSessionSimulation :: id ; id! p:str, $session! $:BlockheadSession, status! p:enum, createdAt! p:num, completedAt? p:num, paramsHash! p:str, forkBlockNumber? p:bigint, forkRpcOrigin? p:url, actionCount? p:num, gasUsed? p:bigint, resultSummary? p:json, resultPayloadHash? p:hex, error? p:str, $$calls* $:BlockheadSessionSimulationCall, $$logs* $:BlockheadSessionSimulationLog
    Sources ::
      - SourceBinding.Local_Internal
      - SourceBinding.Tevm_Runtime
      - SourceBinding.Voltaire_JsonRpc
    View :: {"closed":["session","status","created time"],"content":{"dl":[["session","status","created time","completed time","params hash","fork block","action count","gas used","result payload hash","error"]]},"details":{"tabs":[["Session",["BlockheadSessionView"]],["Inputs",["params hash","source action context","fork metadata"]],["Calls",["BlockheadSessionSimulationCall tree/list"]],["Logs",["BlockheadSessionSimulationLog list"]],["Result summary",["compact local simulation output summary"]],["Raw runtime",["local simulation output retained out of band when needed"]]]}}
    Notes :: Local simulation artifact. `status`, `resultSummary`, `resultPayloadHash`, `error`, `createdAt`, and `completedAt` are the local run lifecycle envelope; do not add a timestamp child row unless the product needs progress history, retries, or multi-source simulation observations. `resultSummary` is a compact display/debug projection, not the raw TEVM result; use `resultPayloadHash` to correlate retained runtime output without making raw simulation JSON the primary schema surface. `actionCount` is the number of session actions included in this simulation run, not a session-wide count. TEVM success or failure is not a canonical receipt, final state root, or public proof. Child call/log rows are retained local replay/debug artifacts for filtering and drilldown; they are not complete public trace coverage and must not be linked as canonical EvmLog, EvmTransaction, or receipt evidence unless a real submitted transaction later resolves through public chain sources.

  Entity BlockheadSessionSimulationCall :: simulationId+callPath ; simulationId! p:str, callPath! p:str, $simulation! $:BlockheadSessionSimulation, parentCallPath? p:str, depth! p:num, callIndex! p:num, callType? p:enum, fromAddress? p:evmAddress, toAddress? p:evmAddress, value? p:bigint, inputSelector? p:hex, inputDataHash? p:hex, outputDataHash? p:hex, gasUsed? p:bigint, reverted? p:bool, error? p:str
    Sources ::
      - SourceBinding.Local_Internal
      - SourceBinding.Tevm_Runtime
    View :: {"closed":["simulation","call path","to address"],"content":{"dl":[["simulation","call path","parent path","depth","call index","call type","from/to addresses","value","selector","gas used","reverted","error"]]},"details":{"tabs":[["Simulation",["BlockheadSessionSimulationView"]],["Children",["nested call rows by parent path"]],["Input/output",["input selector","input/output data hashes","raw runtime payload when retained"]],["Logs",["simulation log rows emitted within this call when mapped"]]]}}
    Notes :: Local TEVM call-trace node keyed by a simulation-local path such as `0`, `0.1`, or another deterministic trace path. It is not an on-chain trace, verified contract call, or transaction effect. Use it for simulation trace filtering by address, selector, depth, revert state, or gas.

  Entity BlockheadSessionSimulationLog :: simulationId+logIndex ; simulationId! p:str, logIndex! p:num, $simulation! $:BlockheadSessionSimulation, callPath? p:str, address? p:evmAddress, topic0? p:hex, topics* p:hex, dataHash? p:hex, decodedEventName? p:str, decodedArgs? p:json, removed? p:bool
    Sources ::
      - SourceBinding.Local_Internal
      - SourceBinding.Tevm_Runtime
    View :: {"closed":["simulation","log index","emitter"],"content":{"dl":[["simulation","log index","call path","emitter address","topic0","decoded event name","removed flag"]]},"details":{"tabs":[["Simulation",["BlockheadSessionSimulationView"]],["Call",["BlockheadSessionSimulationCall when call path maps"]],["Decoded event",["decoded args","ABI/source context when available"]],["Raw log",["topics","data hash","raw log payload when retained"]]]}}
    Notes :: Local simulated log emitted during TEVM execution. It is ordered by simulation-local log index and may be decoded with local ABI evidence, but it is not a canonical EvmLog because no public transaction hash/log index exists.
```

## Catalog Definitions

These belong in constants or schema enum fields, not entities:

- `ActionType`: swap, bridge, transfer, add/remove liquidity, channel actions, future action kinds.
- `Protocol`: LI.FI, CCTP, NEAR Intents, OIF, UniswapX, 1inch Fusion, direct wallet transfer, etc. `selectedProtocol` is a local execution choice; `providerProtocol` is the normalized provider/backend family on recorded quote/order artifacts.
- `IntentInvocationModality`: drag/drop, command palette, URL template, agent suggestion.
- `IntentInvocationPlacement`: source/target placement vocabulary used by accepted invocation records, such as card, row, field, tab, or canvas placement. It is UI-addressing context, not durable drag transport.
- `IntentType`: product-level resolved intent labels.
- `EntityType`: existing schema entity-type enum used by invocation source/target selector metadata; it is not intent-local identity.
- `ReadinessCheckKind`: balance, allowance, wallet capability, route precondition, simulation precondition, future check kinds.
- `ReadinessStatus`: unknown, checking, ready, insufficient, unsupported, failed, stale.
- `WalletCapabilityStatus`: supported, ready, unsupported, unknown, plus source-specific raw values retained only on evidence payloads when needed.
- `WalletProtocol`: EIP-1193, EIP-5792, and future protocol-specific wallet API families.
- `WalletRequestKind`: sign message, sign typed data, send transaction, send calls, submit order authorization, protocol-specific request kinds.
- `WalletRequestStatus`: requested, prompted, signed, submitted, rejected, failed, unknown, stale; wallet protocol numeric/status-code detail stays on timestamp fields.
- `WalletCallBundleStatus`: normalized display labels for EIP-5792 call-bundle state; raw numeric status categories stay in `walletStatusCode`.
- `OutcomeKind`: wallet transaction, wallet call bundle, intent order, bridge transfer, simulation-only, failed before submission, future outcome kinds.
- `OutcomeStatus`: pending, submitted, observed, succeeded, failed, rejected, expired, unknown, stale.
- `FinalityStatus`: local only, wallet reported, provider reported, chain observed, confirmed, finalized.
- `IntentOrderStatus`: pending, submitted, open, filled, claimed, cancelled, expired, failed, unknown, stale; provider-specific raw status stays behind payload hashes or source evidence.
- `SessionStatus`: draft, active, locked, submitted, completed, failed, archived.
- `SimulationStatus`: queued, running, succeeded, reverted, failed, stale.
- `SimulationCallType`: call, delegatecall, staticcall, create, create2, selfdestruct, precompile, unknown.
- `protocolActions`: supported action/protocol pairs.
- `intents`: declarative product intent definitions with entity slots, invocations, and option resolvers.

Enum field mapping:

- `BlockheadSession.status` uses `SessionStatus`.
- `BlockheadSessionAction.actionType` uses `ActionType`; `BlockheadSessionAction.selectedProtocol` uses `Protocol`.
- `BlockheadIntentInvocation.modality` uses `IntentInvocationModality`; `BlockheadIntentInvocation.sourceEntityType` and `BlockheadIntentInvocation.targetEntityType` use the existing `EntityType`; `BlockheadIntentInvocation.sourcePlacement` and `BlockheadIntentInvocation.targetPlacement` use `IntentInvocationPlacement`; `BlockheadIntentInvocation.resolvedIntentType` uses `IntentType`.
- `BlockheadActionReadinessCheck.checkKind` uses `ReadinessCheckKind`; `BlockheadActionReadinessCheck_Timestamp.status` uses `ReadinessStatus`; `observedCapabilityStatus` may use `WalletCapabilityStatus` when normalized, but can retain source-specific strings when needed.
- `BlockheadActionOutcome.outcomeKind` uses `OutcomeKind`; `BlockheadActionOutcome_Timestamp.status` uses `OutcomeStatus`; `BlockheadActionOutcome_Timestamp.finality` uses `FinalityStatus`.
- `BlockheadIntentQuote.providerProtocol` and `BlockheadIntentOrder.providerProtocol` use `Protocol`; `BlockheadIntentOrder_Timestamp.status` uses `IntentOrderStatus`.
- `BlockheadWalletRequest.walletProtocol` uses `WalletProtocol`; `BlockheadWalletRequest.requestKind` uses `WalletRequestKind`; `BlockheadWalletRequest_Timestamp.status` uses `WalletRequestStatus`; `BlockheadWalletRequest_Timestamp.walletCallBundleStatus` uses `WalletCallBundleStatus`.
- `BlockheadSessionSimulation.status` uses `SimulationStatus`; `BlockheadSessionSimulationCall.callType` uses `SimulationCallType`.

## Specialization Rule

- Do not add protocol-specific wallet request child rows until a product flow needs stable, queryable payload parts that the generic wallet request cannot express without conflating axes. Candidate future rows include Cardano CIP-30 UTXO/collateral details, Cosmos sign docs, Starknet resource bounds, TON BOCs, Bitcoin PSBTs, and other protocol-native transaction containers. Until then, protocol identity, request kind, method, request/status payload hashes, account, and transaction id are sufficient mock-schema surface.

## Rejected / Demoted Concepts

- `DragAndDrop`, hover previews, drag arrows, tooltips, and `DataTransfer` payloads: demote to browser transport. Durable state begins at `BlockheadIntentInvocation`.
- `IntentDefinition`, `ActionType`, `Protocol`, support matrices, and option labels: demote to constants/catalog rows. Persist keys and hashes only where replayability matters.
- A generic `Intent` root that merges product goals with OIF/NEAR/UniswapX/Fusion payloads: reject. Product goals stay on typed local intent rows; protocol payloads stay on quote/order artifacts.
- Provider quote/order ids as primary local identity: reject. Local quote/order artifacts use local `id`; provider handles remain correlation fields and timestamp evidence.
- Ordinary router/aggregator executable quotes as `BlockheadIntentQuote`: reject. Keep them on specialized quote timestamp rows such as `SwapQuote_Timestamp` or `BridgeRouteQuote_Timestamp`.
- Wallet capability, permission, account selection, or request success as account identity or chain finality: reject. Keep them on readiness checks, wallet request artifacts, and timestamp observations.
- Provider order status, wallet status, finality, fill hashes, and mutable outcomes on parent action/intent rows: reject. Keep mutable observations on timestamp rows.
- Raw provider, wallet, TEVM, or drag JSON as first-class schema fields: demote to retained source evidence addressed by hashes and compact summaries.
- Simulated calls/logs as canonical public `EvmTransaction`/`EvmLog`/receipt evidence: reject unless a submitted transaction later resolves through public chain sources.
- Protocol-specific wallet request child rows: defer until a concrete product flow needs stable queryable payload parts beyond the generic request/status hash surface.

## Implementation Admission Checklist

- Schema files: add only rows whose selector is already stated above; selectors remain local ids or scoped local ids unless a provider/protocol owns the namespace.
- Field cardinality: keep optional refs optional when artifacts can be imported, rejected, simulated, or recorded before action/session linkage. Do not turn source support into `Zero`/`One` claims.
- Typed actions: enforce one typed local intent row per `BlockheadSessionAction.actionType` family. Wrong-family typed rows should fail fixture/schema tests rather than become alternate interpretations.
- Source facets: implement `Local_Internal` rows first, then add provider/wallet/runtime timestamp facets. Provider payloads enter through hashes, summaries, and timestamp observations before any raw-payload inspection rows.
- List facets: every browseable `$$` field needs ordering, count, empty-state, and nested-selection behavior matching `List Contracts`; linked action lists must not silently include imported standalone quote/order/wallet artifacts.
- Latest surfaces: any latest status, quote, wallet result, or outcome shown on a parent view must derive from the newest retained timestamp row in the relevant source scope.
- View proof: first implementation slice should cover one session with one action, one typed intent, one readiness check with timestamp, one quote or wallet request, and one outcome/simulation branch.
- Rejection tests: include fixtures proving drag payloads do not create durable rows, provider order ids do not collapse local order records, wallet success is not chain finality, and simulated logs are not canonical `EvmLog` rows.
- Source gaps: if a provider cannot supply a field/list/count/live update, leave the resolver facet absent and document the unavailable fact in the source notes or test fixture.

## Minimal Vertical Proof Fixture

- Rows: one `BlockheadSession`, two ordered `BlockheadSessionAction` rows, one typed intent row for the first action, one `BlockheadIntentInvocation`, one `BlockheadActionReadinessCheck` with two timestamp observations, one `BlockheadIntentQuote` with two quote timestamps, one `BlockheadWalletRequest` with requested-only and submitted timestamp observations, one `BlockheadActionOutcome` with one timestamp, one `BlockheadSessionSimulation` with one call and one simulated log.
- Selectors: duplicate the provider `orderId` or `quoteRequestHash` across two local artifacts and assert local `id` keeps rows distinct; assert typed intent rows with the wrong action family fail the fixture.
- Lists: assert session actions sort by `indexInSequence`, action quote/order/wallet/outcome lists include only linked artifacts, timestamp lists sort by `timestampMs`, and empty readiness/outcome lists are valid for draft actions.
- Latest: assert displayed latest readiness, quote, wallet, order, and outcome values derive from newest retained timestamp rows, not parent scalar status.
- Sources: assert `Constants_Internal` only supplies labels/hashes, `Local_Internal` supplies local rows/links, wallet sources supply wallet timestamp observations, provider sources supply quote/order timestamp observations, and TEVM supplies only simulation call/log artifacts.
- Negative evidence: assert drag transport alone creates no durable row, wallet-reported success is not finality, simulated logs are not `EvmLog`, and provider handles are not local selectors.
