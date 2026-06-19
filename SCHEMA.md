# Blockhead Mock Schema

```text
  Entity _Global :: scope ; scope! p:str, $$networks* $:Network, $$evmNetworks* $:EvmNetwork, $$networkUpgrades* $:EthereumNetworkUpgrade, $$proposals* $:SpecificationProposal, $$specificationRealms* $:SpecificationRealm, $$proposalKinds* $:SpecificationProposalKind, $$coins* $:Coin, $$markets* $:Market, $$marketVenues* $:MarketVenue, $$currencies* $:Currency, $$marketPrices* $:MarketPrice, $$marketTimeIntervalTimestamps* $:Market_TimeInterval_Timestamp, $$actors* $:EvmAccount, $$xmtpConversations* $:XmtpConversation, $$vaults* $:Vault, $$blockheadSources* $:BlockheadSource, $$blockheadWallets* $:BlockheadWallet, $$blockheadWalletConnections* $:BlockheadWalletConnection, $$blockheadWalletAccounts* $:BlockheadWalletAccount, $$blockheadSessions* $:BlockheadSession, $$blockheadPanelTrees* $:BlockheadPanelTree, $$blockheadFarcasterAccountConnections* $:BlockheadFarcasterAccountConnection, $$blockheadAgentConversations* $:BlockheadAgentConversation, $$blockheadAlgorandParticipationKeys* $:BlockheadAlgorandParticipationKey, $$eip8004Services* $:EvmNft, $$bridgeTransactions* $:BridgeTransaction, $$blockheadRoomPeers* $:BlockheadRoomPeer, $$blockheadRooms* $:BlockheadRoom, $$stateChannels* $:StateChannel, $$liquidityPositions* $:LiquidityPosition, $$liquidityPools* $:LiquidityPool, $$blockheadSharedAddresses* $:BlockheadSharedAddress, $$blockheadZeroGStorageNodeStates* $:BlockheadZeroGStorageNodeState, $$blockheadZeroGStoredChunks* $:BlockheadZeroGStoredChunk, $$blockheadZeroGStorageProofs* $:BlockheadZeroGStorageProof, $$actorCoins* $:EvmNetworkActorCoinBalance, duneCreditsUsed? p:num, duneCreditsIncluded? p:num
    Sources :: Constants_Internal, Local_Internal, Chainlist_Rest, EthereumLists_Rest, BitcoinBips_Github, BitcoinCashChips_Gitlab, EthereumEips_Github, Ensips_Github, Caips_Github, CosmosAdrs_Github, DogecoinDips_Github, FilecoinFips_Github, LitecoinLips_Github, NearNeps_Github, PolkadotRfcs_Github, SolanaSimds_Github, ZcashZips_Github, Coingecko_Rest, Coingecko_OpenApi, CoinMarketCap_Rest, Coinpaprika_OpenApi, Defillama_OpenApi, TradingView_Rest, Dexscreener_OpenApi, Allium_Rest, Eip8004Scan_Rest, Dune_Rest
    View :: GlobalView top value shows scope/title. Content shows Dune usage when no route children are supplied. Details tabs: Nav -> route shortcut list; Usage -> Dune credit counters. Route hub pages may pass children for page-specific lists, but those children do not create separate global entity families.
    Notes :: Implemented product navigation/root entity. Its refs are browse/list entry points for catalog, external indexer, and local app state; do not promote hub membership, route tabs, nav groups, or Dune billing counters into domain relationships. Connected wallet/node state that is not public consensus data is in scope only under `Blockhead*` rows.

  Entity Account :: caip10 ; caip10! p:{namespace:str,reference:str,accountAddress:str}, $network! $:Network, address! p:str, canonicalAddress? p:str, $evmAccount? $:EvmAccount, $evmNetworkAccount? $:EvmNetworkAccount, nativeAccountSelector? p:json, $$walletAccounts* $:BlockheadWalletAccount
    Sources :: Local_Internal, Constants_Internal, Voltaire_JsonRpc, CosmosSdk_Rest, NearRpc_JsonRpc, Solana_JsonRpc, TronGrid_Rest, TronScan_Rest, SubstrateSidecar_Rest, Hyperliquid_JsonRpc, QuilibriumNodeRpc_Grpc
    View :: AccountView top `<dl>` shows CAIP-10 namespace/reference/address, canonical address when derivable, network, EVM account/network-account refs when namespace is eip155, and native account selector. Details tabs: Native account -> protocol-specific account view; EVM account -> EvmAccountView/EvmNetworkAccountView; Wallet exposure -> BlockheadWalletAccountsView.
    Notes :: Cross-chain interoperability selector, not a replacement ontology for native account models and not proof of signing authority. Use canonicalAddress only when a namespace-specific canonicalization rule is applied; wallet/provider exposure belongs on BlockheadWalletAccount.

  Entity ActivityPubActor :: activityStreamsUri | instanceOrigin+localAccountId | instanceOrigin+acct ; instanceOrigin! p:url, localAccountId! p:str, username? p:str, acct! p:str, displayName? p:str, note? p:str, $icon? $:Media, $headerImage? $:Media, profileUrl? p:url, activityStreamsUri! p:url, website? p:url, $$timestamps* $:ActivityPubActor_Timestamp, bot? p:bool, locked? p:bool, createdAt? p:num, $$notes* $:ActivityPubNote
    Sources :: ActivityPub_Http, WebFinger_Rest, Mastodon_Rest, Fedi_Rest
    View :: ActivityPubActorView top `<dl>` shows avatar/header, display name, username/acct, ActivityStreams URI, profile URL, website, bot/locked flags, created date, and latest follower/following/status counters. Details tabs: Profile -> rendered note, media refs, and Mastodon/Fedi account fields; Outbox -> ActivityPubNotesView from `$$notes`; Metric snapshots -> ActivityPubActor_TimestampsView; Federation identity -> ActivityStreams URI, instance origin, local account id, and acct selector evidence.
    Notes :: `activityStreamsUri` is the federation identifier because ActivityPub actors are URI-identified objects. `instanceOrigin+localAccountId` and `instanceOrigin+acct` are configured-instance selectors from Mastodon-compatible REST; WebFinger can resolve acct handles where exposed. Current implemented outbox is a Mastodon/Fedi account-status projection, not direct ActivityPub outbox collection traversal, so inbox/outbox/sharedInbox URLs should be added only when ActivityPub_Http resolver support exists.

  Entity ActivityPubActor_Timestamp :: $actor+timestampMs ; $actor! $:ActivityPubActor, timestampMs! p:num, followersCount? p:num, followingCount? p:num, statusesCount? p:num
    Sources :: Mastodon_Rest, Fedi_Rest
    View :: ActivityPubActor_TimestampView top `<dl>` shows actor, observation time, followers count, following count, and statuses count. Details tabs: Actor -> ActivityPubActorView; Source evidence -> account lookup payload/source/instance freshness when available.
    Notes :: Actor counters are instance/API observations from account payloads, not ActivityPub actor identity. Keep counts separate from actor profile fields because remote federation state, local instance caching, and public-preview access can diverge.

  Entity ActivityPubNetwork :: scope ; scope! p:str, protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str, instanceTitle? p:str, instanceDescription? p:str, instanceVersion? p:str, fediInstanceTitle? p:str, fediInstanceDescription? p:str, fediInstanceVersion? p:str, $$activityPubActors* $:ActivityPubActor, $$activityPubNotes* $:ActivityPubNote
    Sources :: Constants_Internal, Mastodon_Rest, Fedi_Rest, ActivityPub_Http
    View :: ActivityPubView top `<dl>` shows protocol name, registry label, topology, home/docs URLs, configured Mastodon/Fedi instance title, description, version, actor count, and note count. Details tabs: Actors -> ActivityPubActorsView; Notes -> ActivityPubNotesView for public timeline/status slices; Instances -> configured source instances and source coverage; Protocol -> ActivityPub/WebFinger capability notes.
    Notes :: This is the app hub for configured Mastodon-compatible ActivityPub sources and future direct ActivityPub HTTP dereferencing. It is not a global federation crawl and should not imply complete delivery, inbox access, follower graph coverage, or direct outbox traversal unless a source facet explicitly fulfills those lists.

  Entity ActivityPubNote :: activityStreamsUri | instanceOrigin+localStatusId ; instanceOrigin! p:url, localStatusId! p:str, $author? $:ActivityPubActor, content? p:str, createdAt? p:num, editedAt? p:num, activityStreamsUri! p:url, $$timestamps* $:ActivityPubNote_Timestamp, visibility? p:enum, sensitive? p:bool, language? p:str, spoilerText? p:str, statusUrl? p:url, $inReplyTo? $:ActivityPubNote, $reblogOf? $:ActivityPubNote, $$media* $:Media, $$thread* $:ActivityPubNote
    Sources :: ActivityPub_Http, Mastodon_Rest, Fedi_Rest
    View :: ActivityPubNoteView top `<dl>` shows content excerpt, author, created/edited dates, ActivityStreams URI, status URL, visibility, sensitive flag, language, spoiler text, reply/reblog refs, media count, thread count, and latest favourite/reblog/reply counters. Details tabs: Content -> rendered content/spoiler/media; Thread -> ActivityPubNotesView from `$$thread`; Author -> ActivityPubActorView; Metric snapshots -> ActivityPubNote_TimestampsView; Source payload -> ActivityStreams/Mastodon status identity fields.
    Notes :: `activityStreamsUri` is the federation id for the note/status object; `instanceOrigin+localStatusId` is a configured Mastodon/Fedi REST selector. Mastodon public timeline, account statuses, status lookup, and context endpoints can fulfill list/detail/thread fields, while direct ActivityPub object dereference should stay a separate source facet. Engagement counters belong on ActivityPubNote_Timestamp, and private/direct statuses require authorized local or connected-account state rather than public consensus data.

  Entity ActivityPubNote_Timestamp :: $note+timestampMs ; $note! $:ActivityPubNote, timestampMs! p:num, favouriteCount? p:num, reblogCount? p:num, replyCount? p:num
    Sources :: Mastodon_Rest, Fedi_Rest
    View :: ActivityPubNote_TimestampView top `<dl>` shows note, observation time, favourite count, reblog count, and reply count. Details tabs: Note -> ActivityPubNoteView; Source evidence -> status lookup payload/source/instance freshness when available.
    Notes :: Engagement counters are Mastodon-compatible API observations and can be hidden, delayed, or instance-local. Preserve Mastodon naming (`favourite`, `reblog`) rather than flattening it into generic likes/reposts without a projection layer.

  Entity AlgorandAccount :: $network+address ; $network! $:AlgorandNetwork, address! p:str, $$assets* $:AlgorandAssetHolding, $$applications* $:AlgorandApplicationLocalState, $$timestamps* $:AlgorandAccount_Timestamp
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandAccountView top `<dl>` shows address, latest microAlgos, rewards, and status snapshot. Details tabs: Asset holdings -> AlgorandAssetHoldingsView; Application local state -> AlgorandApplicationLocalStatesView; Transactions -> AlgorandTransactionsView; Account snapshots -> AlgorandAccount_TimestampsView.
    Notes :: Public account state comes from algod account lookup and indexer account search/lookup; Nodely is a hosted vanilla algod/indexer provider. Amount, rewards, status, asset holdings, and app local state are round-scoped observations. Participation key inventory is private node state and belongs under BlockheadAlgorandParticipationKey, not this public account row.

  Entity AlgorandAccount_Timestamp :: $account+round+source ; $account! $:AlgorandAccount, round! p:bigint, source! p:str, amount? p:bigint, pendingRewards? p:bigint, rewardsBase? p:bigint, status? p:enum
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandAccount_TimestampView top `<dl>` shows account, round, amount, pending rewards, rewards base, status, and source; AlgorandAccountView shows latest/history.
    Notes :: Use round rather than wall-clock time when the account state is tied to a ledger round.

  Entity AlgorandApplication :: $network+applicationId ; $network! $:AlgorandNetwork, applicationId! p:bigint, creator? p:str, approvalProgramHash? p:hex, clearProgramHash? p:hex, $$boxes* $:AlgorandBox, $$timestamps* $:AlgorandApplication_Timestamp
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandApplicationView top `<dl>` shows application id, creator, approval/clear program hashes, latest box count, and global-state summary. Details tabs: Boxes -> AlgorandBoxesView; Global state -> AlgorandApplication_TimestampsView; Local state accounts -> AlgorandApplicationLocalStatesView; TEAL programs -> AlgorandTealProgramView for approval/clear hashes; Transactions -> AlgorandTransactionsView.
    Notes :: Application ids are on-chain ids. Program hashes identify deployed TEAL bytecode and can resolve to AlgorandTealProgram when source payloads expose bytes/disassembly. Global state, schema sizes, and boxes are observed at a ledger round. Account-specific app state stays on AlgorandApplicationLocalState.

  Entity AlgorandApplication_Timestamp :: $application+round+source ; $application! $:AlgorandApplication, round! p:bigint, source! p:str, globalState? p:json, globalSchema? p:json, localSchema? p:json, boxCount? p:num
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandApplication_TimestampView top `<dl>` shows application, round, source, box count, global/local schema, and global-state summary; AlgorandApplicationView shows latest/history.
    Notes :: Application global state and schema are round observations; code identity stays on AlgorandApplication.

  Entity AlgorandApplicationLocalState :: $account+$application+round ; $account! $:AlgorandAccount, $application! $:AlgorandApplication, round! p:bigint, keyValues? p:json, schema? p:json
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandApplicationLocalStateView top `<dl>` shows account, application, round, schema, and key-value state summary. Details tabs: Account -> AlgorandAccountView; Application -> AlgorandApplicationView; Key/value state -> decoded and raw state JSON; Round context -> AlgorandRoundView.
    Notes :: Account-scoped application state is round-bounded and should not be collapsed into account or application identity. Absence of local state at a later round can mean not opted in, closed out, deleted app state, or unsupported source pagination; represent those as source/query results, not `Zero` cardinality.

  Entity AlgorandAsset :: $network+assetId ; $network! $:AlgorandNetwork, assetId! p:bigint, creator? p:str, unitName? p:str, decimals? p:num, manager? p:str, reserve? p:str, freeze? p:str, clawback? p:str, $$timestamps* $:AlgorandAsset_Timestamp
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandAssetView top `<dl>` shows asset id, unit/name, decimals, creator, manager/reserve/freeze/clawback addresses, and latest supply snapshot. Details tabs: Holdings -> AlgorandAssetHoldingsView; Snapshots -> AlgorandAsset_TimestampsView; Metadata -> ARC/source metadata.
    Notes :: ASA manager/reserve/freeze/clawback addresses can be reconfigured depending on asset params; supply/holder counts are observations.

  Entity AlgorandAsset_Timestamp :: $asset+round+source ; $asset! $:AlgorandAsset, round! p:bigint, source! p:str, total? p:bigint, defaultFrozen? p:bool, unitName? p:str, assetName? p:str, url? p:url, metadataHash? p:hex, holderCount? p:num, deleted? p:bool
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandAsset_TimestampView top `<dl>` shows total supply, default frozen, unit/name/url/metadata hash, holder count, deleted state, round, and source; AlgorandAssetView uses latest/history snapshots for mutable params and supply.
    Notes :: ASA supply, default frozen state, mutable metadata fields, deletion state, and holder counts are round/source observations, not stable asset identity.

  Entity AlgorandAssetHolding :: $account+$asset+round ; $account! $:AlgorandAccount, $asset! $:AlgorandAsset, round! p:bigint, amount? p:bigint, frozen? p:bool, optedInAtRound? p:bigint
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandAssetHoldingView top `<dl>` shows account, asset, round, amount, frozen state, and opt-in round. Details tabs: Account -> AlgorandAccountView; Asset -> AlgorandAssetView; Round context -> AlgorandRoundView; Transfer history -> AlgorandTransactionsView filtered to asset/account when indexed.
    Notes :: Asset holding is account+asset state at a round; do not store balances on AlgorandAccount or AlgorandAsset. Frozen state is holding-specific and source/head dependent, not an asset-wide current flag.

  Entity AlgorandBox :: $application+boxName+round+source ; $application! $:AlgorandApplication, boxName! p:hex, round! p:bigint, source! p:str, value? p:hex, valueHash? p:hex
    Sources :: Algod_Rest, AlgorandIndexer_Rest
    View :: AlgorandBoxView top `<dl>` shows application, box name, round, source, and value hash. Details show raw value when fetched.
    Notes :: Box values are application state snapshots keyed by round/source. Keep raw value optional and prefer valueHash when content is large.

  Entity AlgorandNetwork :: $network ; $network! $:Network, $$rounds* $:AlgorandRound, $$transactions* $:AlgorandTransaction, $$accounts* $:AlgorandAccount, $$assets* $:AlgorandAsset, $$applications* $:AlgorandApplication, $$timestamps* $:AlgorandNetwork_Timestamp
    Sources :: Constants_Internal, Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandNetworkView top `<dl>` shows linked Network, latest round/protocol/genesis snapshot, catchpoint, and native ALGO asset. Details use `CollapsibleTabs`: Rounds -> AlgorandRoundsView; Transactions -> AlgorandTransactionsView; Accounts -> AlgorandAccountsView; Assets -> AlgorandAssetsView; Applications -> AlgorandApplicationsView; Network snapshots -> AlgorandNetwork_TimestampsView.
    Notes :: Algorand state is round-based and includes ASAs, applications, local state, global state, and boxes. Keep app/account/asset state explicit.

  Entity AlgorandNetwork_Timestamp :: $network+timestampMs+source ; $network! $:AlgorandNetwork, timestampMs! p:num, source! p:str, latestRound? p:bigint, catchpoint? p:str, genesisHash? p:hex, protocolVersion? p:str
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandNetwork_TimestampView top `<dl>` shows latest round, protocol version, genesis hash, catchpoint, source, and observation time; AlgorandNetworkView shows latest/history.
    Notes :: Node/indexer status is source-local and may lag network consensus.

  Entity AlgorandRound :: $network+round ; $network! $:AlgorandNetwork, round! p:bigint, hash? p:hex, timestampMs? p:num, genesisHash? p:hex, proposer? p:str
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandRoundView top `<dl>` shows round, hash, timestamp, genesis hash, proposer, and protocol/rewards fields when available. Details tabs: Transactions -> AlgorandTransactionsView.
    Notes :: Round is the canonical chain coordinate. Hash and genesis hash verify the block/network context.

  Entity AlgorandTealProgram :: $network+programHash ; $network! $:AlgorandNetwork, programHash! p:hex, programKind? p:enum, tealVersion? p:num, bytecode? p:hex, disassembly? p:str, sourceMap? p:json, $$applications* $:AlgorandApplication, $$transactions* $:AlgorandTransaction
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandTealProgramView top `<dl>` shows network, program hash, program kind, TEAL version, bytecode availability, disassembly availability, application count, and transaction count. Details tabs: Applications -> AlgorandApplicationsView using this approval/clear program; Transactions -> AlgorandTransactionsView carrying or creating the program; Bytecode/disassembly -> raw bytes and decoded TEAL; Source map -> source map JSON when available.
    Notes :: Reusable TEAL/AVM program identity keyed by program hash. Application approval/clear program hashes and transaction-carried logic signatures can point here when a source exposes program bytes or disassembly. Do not create this from a UI contract label or unverified source-code name.

  Entity AlgorandTransaction :: $network+txId ; $network! $:AlgorandNetwork, txId! p:str, round? p:bigint, sender! p:str, transactionType! p:enum, fee? p:bigint, group? p:hex, $group? $:AlgorandTransactionGroup, parentTransactionId? p:str, innerTransactionIndex? p:num, innerTxns? p:json, logs* p:str, payload? p:json
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandTransactionView top `<dl>` shows tx id, type, sender, round, fee, group id, and parent/inner index when present. Details tabs: Group -> AlgorandTransactionGroupView; Inner transactions -> AlgorandTransactionsView; Logs -> decoded/raw logs; Payload -> type-specific transaction JSON.
    Notes :: Algorand transaction ids identify submitted transactions. Inner transaction parent/index fields preserve application-call nesting without turning inner calls into a separate provider category. `group` is a relationship key for atomic batches, not transaction identity.

  Entity AlgorandTransactionGroup :: $network+group ; $network! $:AlgorandNetwork, group! p:hex, round? p:bigint, $$transactions* $:AlgorandTransaction
    Sources :: Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest
    View :: AlgorandTransactionGroupView top `<dl>` shows group id, round, transaction count, and network. Details tabs: Transactions -> AlgorandTransactionsView in group order.
    Notes :: The group id links an atomic batch. It is not a transaction and does not imply an application/session entity.

  Entity AptosAccount :: $network+address ; $network! $:AptosNetwork, address! p:str, sequenceNumber? p:bigint, authenticationKey? p:hex, $$resources* $:AptosAccountResource, $$modules* $:MoveModule, $$transactions* $:AptosTransaction
    Sources :: AptosFullnode_Rest, AptosIndexer_Graphql
    View :: AptosAccountView top `<dl>` shows address, sequence number, authentication key, and network. Details tabs: Resources -> AptosAccountResourcesView; Modules -> MoveModulesView; Transactions -> AptosTransactionsView.

  Entity AptosAccountResource :: $account+resourceType ; $account! $:AptosAccount, resourceType! p:str, latestValue? p:json, $$snapshots* $:AptosAccountResource_Timestamp
    Sources :: AptosFullnode_Rest, AptosIndexer_Graphql
    View :: AptosAccountResourceView top `<dl>` shows account, resource type, and latest value hash/summary. Details tabs: Snapshots -> AptosAccountResource_TimestampsView; Value -> structured JSON.
    Notes :: Resource type is a Move struct type tag scoped to an account. Mutable values belong on snapshots when historical or observation-time reads are modeled.

  Entity AptosAccountResource_Timestamp :: $resource+timestampMs+source ; $resource! $:AptosAccountResource, timestampMs! p:num, source! p:enum, ledgerVersion? p:bigint, value? p:json
    Sources :: AptosFullnode_Rest, AptosIndexer_Graphql
    View :: AptosAccountResource_TimestampView top `<dl>` shows resource, source, observed time, ledger version, and value.

  Entity AptosBlock :: $network+height | $network+firstVersion ; $network! $:AptosNetwork, height? p:bigint, firstVersion? p:bigint, lastVersion? p:bigint, timestampMs? p:num, $$transactions* $:AptosTransaction
    Sources :: AptosFullnode_Rest, AptosIndexer_Graphql
    View :: AptosBlockView top `<dl>` shows block height, first/last version, timestamp, and transaction count. Details tabs: Transactions -> AptosTransactionsView.

  Entity AptosEvent :: $network+transactionVersion+eventIndex ; $network! $:AptosNetwork, transactionVersion! p:bigint, eventIndex! p:num, eventType! p:str, accountAddress? p:str, creationNumber? p:bigint, sequenceNumber? p:bigint, value? p:json
    Sources :: AptosFullnode_Rest, AptosIndexer_Graphql
    View :: AptosEventView top `<dl>` shows event type, transaction version, event index, account/creation/sequence coordinates, and value payload.

  Entity AptosNetwork :: $network ; $network! $:Network, $$timestamps* $:AptosNetwork_Timestamp, $$blocks* $:AptosBlock, $$transactions* $:AptosTransaction, $$accounts* $:AptosAccount, $$modules* $:MoveModule, $$events* $:AptosEvent
    Sources :: AptosFullnode_Rest, AptosIndexer_Graphql, Constants_Internal
    View :: AptosNetworkView top `<dl>` shows linked Network, latest ledger version/block/chain id snapshot, epoch, and execution environment. Details use `CollapsibleTabs`: Blocks -> AptosBlocksView; Transactions -> AptosTransactionsView; Accounts -> AptosAccountsView; Modules -> MoveModulesView; Events -> AptosEventsView; Network snapshots -> AptosNetwork_TimestampsView.
    Notes :: Aptos is an account/resource and ledger-version Move chain. Do not force Sui checkpoints or global object refs into Aptos rows.

  Entity AptosNetwork_Timestamp :: $network+timestampMs+source ; $network! $:AptosNetwork, timestampMs! p:num, source! p:enum, ledgerVersion? p:bigint, blockHeight? p:bigint, chainId? p:str, epoch? p:bigint, oldestLedgerVersion? p:bigint, nodeRole? p:str
    Sources :: AptosFullnode_Rest, AptosIndexer_Graphql
    View :: AptosNetwork_TimestampView top `<dl>` shows observed time/source, ledger version, block height, chain id, epoch, oldest retained ledger version, and node role.
    Notes :: Ledger info is node/source state and can reflect pruning. Keep it timestamped rather than on AptosNetwork.

  Entity AptosStateChange :: $transaction+changeIndex ; $transaction! $:AptosTransaction, changeIndex! p:num, changeKind! p:enum, address? p:str, stateKeyHash? p:hex, resourceType? p:str, moduleAddress? p:str, moduleName? p:str, value? p:json
    Sources :: AptosFullnode_Rest, AptosIndexer_Graphql
    View :: AptosStateChangeView top `<dl>` shows change kind, address/state key, resource or module target, value summary, and parent transaction.

  Entity AptosTableItem :: $network+tableHandle+keyHash ; $network! $:AptosNetwork, tableHandle! p:str, keyHash! p:hex, key? p:json, valueType? p:str, value? p:json, valueHash? p:hex, ledgerVersion? p:bigint, observedAtMs? p:num, source? p:enum
    Sources :: AptosFullnode_Rest, AptosIndexer_Graphql
    View :: AptosTableItemView top `<dl>` shows table handle, key hash, key/value type, ledger version or observed time, source, and value/value hash.
    Notes :: Table values are point reads unless pinned to a ledger version; do not treat latest table item values as stable identity.

  Entity AptosTransaction :: $network+version | $network+hash ; $network! $:AptosNetwork, version? p:bigint, hash? p:hex, transactionKind? p:enum, sender? p:str, success? p:bool, vmStatus? p:str, gasUnitPrice? p:bigint, gasUsed? p:bigint, timestampMs? p:num, $$stateChanges* $:AptosStateChange, $$events* $:AptosEvent
    Sources :: AptosFullnode_Rest, AptosIndexer_Graphql
    View :: AptosTransactionView top `<dl>` shows version/hash, kind, sender, success/vm status, gas, timestamp. Details tabs: State changes -> AptosStateChangesView; Events -> AptosEventsView; Payload -> entry function/script payload JSON.
    Notes :: Version is the Aptos ledger coordinate; hash is an alternate transaction selector. Do not merge this with Sui transaction digests.

  Entity AssetClass :: $assetInstance+classKey ; $assetInstance! $:AssetInstance, classKey! p:str, classKind! p:enum, label? p:str, slot? p:str, partition? p:str, series? p:str, maturityMs? p:num, valueDecimals? p:num, rights* p:str, $$objects* $:AssetObject, $$supplyLedgerStates* $:AssetSupply_LedgerCoordinate, $$supplyTimestamps* $:AssetSupply_Timestamp
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Solana_JsonRpc, Helius_Rest, CardanoBlockfrost_Rest, CardanoKoios_Rest, AlgorandIndexer_Rest, HederaMirrorNode_Rest, TronGrid_Rest, TronScan_Rest
    View :: AssetClassView top `<dl>` shows asset instance, class key, class kind, label, slot, partition, series, maturity, value decimals, and rights. Details tabs: Objects -> AssetObjectsView; Ledger supply -> AssetSupply_LedgerCoordinate list; Methodology supply -> AssetSupply_Timestamp list.
    Notes :: Class row for real class-like assets with independent selectors, such as ERC-3525 slots, ERC-1400 partitions, ERC-1155 ids/classes where a source exposes class metadata, Cardano policy/asset-name groupings when class semantics are explicit, Hedera NFT serial families, and issuer-defined series/maturity instruments. Do not create it from provider collection labels or UI groupings alone.

  Entity AssetEligibility :: $assetInstance+$account+timestampMs+source ; $assetInstance! $:AssetInstance, $account! $:Account, timestampMs! p:num, source! p:str, canHold? p:bool, canSend? p:bool, canReceive? p:bool, reasons* p:str
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Solana_JsonRpc, Helius_Rest, Dune_Rest, Allium_Rest
    View :: AssetEligibilityView top `<dl>` shows asset instance, account, observed time, source, can-hold/can-send/can-receive flags, and reasons. Details tabs: Asset -> AssetInstanceView; Account -> AccountView; Evidence -> source payload or simulated transfer/restriction call result.
    Notes :: Timestamped account-asset eligibility observation for restriction checks, compliance registries, transfer-hook simulations, or issuer/KYC claim state. The account selector must be concrete, and negative/unknown results stay source-scoped because eligibility can depend on time, jurisdiction, claim expiry, transfer direction, and source methodology.

  Entity AssetInstance :: $network+kind+assetKey ; $network! $:Network, kind! p:enum, assetKey! p:str, coinId? p:enum, name! p:str, symbol! p:str, decimals? p:num, $icon? $:MediaObject
    Sources :: Constants_Internal, CosmosChainRegistry_Github, TrustWalletAssets_Github, Coingecko_Rest, Coingecko_OpenApi, Coinpaprika_OpenApi, AlgorandIndexer_Rest, CardanoBlockfrost_Rest, CardanoKoios_Rest, HederaMirrorNode_Rest, TronGrid_Rest, TronScan_Rest
    View :: AssetInstanceView top `<dl>` shows network, kind, asset key, coin id, name, symbol, decimals, and icon. Details tabs: Supply -> AssetSupply_LedgerCoordinate and AssetSupply_Timestamp lists; Objects/classes -> AssetClass/AssetObject lists when source-backed; Metadata -> TokenMetadataDocument rows.
    Notes :: Generic non-EVM/network asset instance keyed by network, kind, and assetKey. Do not use symbol, market-data ids, bridge/provider labels, or explorer collection labels as selectors; those remain metadata, provider mappings, or source claims.

  Entity AssetObject :: $assetInstance+objectKey ; $assetInstance! $:AssetInstance, objectKey! p:str, objectKind! p:enum, $class? $:AssetClass, tokenId? p:str, slot? p:str, metadataUri? p:url, $$metadata* $:TokenMetadataDocument
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Solana_JsonRpc, Helius_Rest, MetadataVision_Rest, CardanoBlockfrost_Rest, CardanoKoios_Rest, AlgorandIndexer_Rest, HederaMirrorNode_Rest, TronGrid_Rest, TronScan_Rest, Ipfs_Rest, Swarm_Rest
    View :: AssetObjectView top `<dl>` shows asset instance, object key, object kind, class, token id, slot, and metadata URI. Details tabs: Class -> AssetClassView; Metadata -> TokenMetadataDocumentsView; Ownership/balance -> account-specific balance rows when modeled separately.
    Notes :: Object-level asset row for NFTs, semi-fungible ids, inscriptions, or tokenized positions where objectKey is sourceable from protocol ownership, metadata, or indexer payloads. Image URLs, marketplace slugs, and collection pages are metadata/source claims, not object identity.

  Entity AssetSupply_LedgerCoordinate :: $assetInstance+classKey+ledgerCoordinateKind+ledgerCoordinateValue+source ; $assetInstance! $:AssetInstance, $class? $:AssetClass, classKey? p:str, ledgerCoordinateKind! p:enum, ledgerCoordinateValue! p:bigint, source! p:str, totalSupply? p:bigint, maxSupply? p:bigint, mintedSupply? p:bigint, burnedSupply? p:bigint
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Solana_JsonRpc, Helius_Rest, CardanoBlockfrost_Rest, CardanoKoios_Rest, Algod_Rest, AlgorandIndexer_Rest, Nodely_Algod_Rest, Nodely_AlgorandIndexer_Rest, HederaMirrorNode_Rest, TronGrid_Rest, TronScan_Rest
    View :: AssetSupply_LedgerCoordinateView top `<dl>` shows asset instance, optional class, coordinate kind/value, source, total supply, max supply, minted supply, and burned supply. Details tabs: Asset -> AssetInstanceView; Class -> AssetClassView when set; Source payload -> chain/indexer-specific raw fields.
    Notes :: Exact ledger-scoped supply observation for native token standards and asset registries where a node/indexer can bind supply to a block number, slot, round, ledger index, or comparable chain coordinate. Use this for ERC totalSupply calls at a block, SPL mint supply at a slot, Cardano mint/burn aggregates by ledger point, Algorand ASA total at a round, Hedera HTS token state, and Tron token supply. Circulating supply and provider methodology stay on AssetSupply_Timestamp.

  Entity AssetSupply_Timestamp :: $assetInstance+classKey+timestampMs+source ; $assetInstance! $:AssetInstance, $class? $:AssetClass, classKey? p:str, timestampMs! p:num, source! p:str, totalSupply? p:bigint, circulatingSupply? p:bigint, burnedSupply? p:bigint, methodology? p:str
    Sources :: Coingecko_Rest, Coingecko_OpenApi, Coinpaprika_OpenApi, CoinMarketCap_Rest, Defillama_OpenApi, Dune_Rest, Allium_Rest, Etherscan_Rest, Blockscout_Rest
    View :: AssetSupply_TimestampView top `<dl>` shows asset instance, optional class key, observation time, source, total supply, circulating supply, burned supply, and methodology. Details tabs: Asset -> AssetInstanceView; Class -> AssetClassView when classKey maps to a class; Methodology -> source clock, query, and inclusion/exclusion notes.
    Notes :: Provider-clocked supply methodology row. Use it for circulating supply, burned supply, market-data supply, and indexer-derived totals whose clock or methodology is not a precise chain coordinate. Do not mix exact block/slot/round supply proofs into this row; use AssetSupply_LedgerCoordinate for those.

  Entity AtprotoActor :: did | handle ; did! p:str, displayName? p:str, handle! p:str, $icon? $:Media, $banner? $:Media, $$timestamps* $:AtprotoActor_Timestamp, indexedAt? p:num, description? p:str, $$posts* $:AtprotoPost
    Sources :: Constants_Internal, Atproto_Xrpc, Atproto_BskySocial_Xrpc
    View :: AtprotoActorView top `<dl>` shows DID, handle, display name, description, indexed time, icon, banner, and latest follower/follow/post snapshot. Details tabs: Profile -> mutable profile fields and media; Posts -> AtprotoPostsView; Metric snapshots -> AtprotoActor_TimestampsView.
    Notes :: DID is the stable actor identity; handle is a mutable selector resolved through protocol/App View data. `indexedAt` is App View timing, not repository commit time. Do not attach `$did`, generic social profile refs, or raw repository-sync fields to this implemented row until those projections are explicitly modeled.

  Entity AtprotoActor_Timestamp :: $actor+timestampMs ; $actor! $:AtprotoActor, timestampMs! p:num, followersCount? p:num, followsCount? p:num, postsCount? p:num
    Sources :: Atproto_Xrpc, Atproto_BskySocial_Xrpc
    View :: AtprotoActor_TimestampView top `<dl>` shows actor, observation time, followers, follows, and posts count. AtprotoActorView shows latest counters and history through AtprotoActor_TimestampsView.
    Notes :: Counts are App View observations. Keep them off `AtprotoActor` so handle/profile identity remains separate from mutable counters and index freshness.

  Entity AtprotoNetwork :: scope ; scope! p:str, protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str, $$atprotoActors* $:AtprotoActor, $$atprotoPosts* $:AtprotoPost
    Sources :: Constants_Internal, Atproto_Xrpc, Atproto_BskySocial_Xrpc
    View :: AtprotoView top `<dl>` shows protocol name, registry label, topology, home URL, docs URL, actor count, post count, and source coverage. Details tabs: Actors -> AtprotoActorsView; Posts -> AtprotoPostsView; Examples -> stable actor/post route links as seed navigation only.
    Notes :: This is the app hub for configured AT Protocol/Bluesky App View surfaces, not a full federation crawl or repository sync model. The list rows are bounded directory/search slices; raw repo, record, commit, and blob state stays out of this mock schema until CAR/MST/sync resolvers exist.

  Entity AtprotoPost :: uri ; uri! p:str, $author? $:AtprotoActor, text? p:str, createdAt? p:num, indexedAt? p:num, $$timestamps* $:AtprotoPost_Timestamp, langs? p:str[], selfLabelValues? p:str[], $parent? $:AtprotoPost, $root? $:AtprotoPost, $$thread* $:AtprotoPost
    Sources :: Constants_Internal, Atproto_Xrpc, Atproto_BskySocial_Xrpc
    View :: AtprotoPostView top `<dl>` shows AT URI, text, created time, indexed time, author, parent, root, languages, self-label values, and latest like/repost/reply/quote snapshot. Details tabs: Thread -> AtprotoPostThreadView; Author -> AtprotoActorView; Metric snapshots -> AtprotoPost_TimestampsView.
    Notes :: `uri` is the selector and should be an AT URI, not a Bluesky web URL. CID and raw record refs are not implemented fields on this row. `createdAt` is the record timestamp from App View payloads; `indexedAt` is App View/indexer timing.

  Entity AtprotoPost_Timestamp :: $post+timestampMs ; $post! $:AtprotoPost, timestampMs! p:num, likeCount? p:num, repostCount? p:num, replyCount? p:num, quoteCount? p:num
    Sources :: Atproto_Xrpc, Atproto_BskySocial_Xrpc
    View :: AtprotoPost_TimestampView top `<dl>` shows post, observation time, likes, reposts, replies, and quotes. AtprotoPostView shows latest counters and history through AtprotoPost_TimestampsView.
    Notes :: Engagement counters are App View observations. Keep them separate from `AtprotoPost` because counts and moderation visibility can shift with indexing and app-view policy.

  Entity AvalancheBlockchain :: blockchainId ; blockchainId! p:str, $subnet! $:AvalancheSubnet, vmId! p:str, chainName? p:str, chainAlias? p:str, $network? $:Network, genesisDataHash? p:hex, createdAtTxId? p:hex
    Sources :: AvalanchePlatformVm_JsonRpc, AvalancheInfo_JsonRpc, Avascan_Rest
    View :: AvalancheBlockchainView top `<dl>` shows blockchain id, subnet, VM id, chain name/alias, linked Network, and creation transaction. Tabs: validators through subnet, chain aliases, genesis/source evidence.
    Notes :: PlatformVM blockchains are subnet member chains. C-Chain still resolves through generic EvmNetwork; this row links PlatformVM identity to that network when known.

  Entity AvalancheDelegator :: $validator+txId ; $validator! $:AvalancheValidator, txId! p:hex, delegatorAddress? p:str, stakeAmountNavax? p:bigint, startTimeMs? p:num, endTimeMs? p:num, rewardOwnerAddresses* p:str, potentialRewardNavax? p:bigint
    Sources :: AvalanchePlatformVm_JsonRpc, Avascan_Rest
    View :: AvalancheDelegatorView top `<dl>` shows validator, delegation transaction id, delegator address, stake, interval, and potential reward. Details show reward owners and source evidence.
    Notes :: Delegations are validation-interval records tied to a validator and transaction id, not stable account identity.

  Entity AvalancheSubnet :: subnetId ; subnetId! p:str, label? p:str, ownerAddresses* p:str, threshold? p:num, controlKeys* p:str, $$blockchains* $:AvalancheBlockchain, $$validators* $:AvalancheValidator, $$delegators* $:AvalancheDelegator, $$timestamps* $:AvalancheSubnet_Timestamp
    Sources :: AvalanchePlatformVm_JsonRpc, AvalancheInfo_JsonRpc, Avascan_Rest
    View :: AvalancheSubnetView top `<dl>` shows subnet id, label, threshold, owner address count, chain count, validator count, and total stake. Tabs: blockchains, validators, delegators, control keys, timestamp history.
    Notes :: Subnet identity is the PlatformVM subnet id. Chain membership and validator participation are protocol state, while validator counts and stake totals belong on AvalancheSubnet_Timestamp.

  Entity AvalancheSubnet_Timestamp :: $subnet+timestampMs+source ; $subnet! $:AvalancheSubnet, timestampMs! p:num, source! p:str, validatorCount? p:num, delegatorCount? p:num, totalStakeNavax? p:bigint, chainCount? p:num, pendingValidatorCount? p:num
    Sources :: AvalanchePlatformVm_JsonRpc, AvalancheInfo_JsonRpc, Avascan_Rest
    View :: AvalancheSubnet_TimestampView top `<dl>` shows subnet, observed time/source, validator count, delegator count, total stake, chain count, and pending validator count. Details show source freshness and raw validator-set payload.
    Notes :: Stake and validator counts are as-of subnet observations, not subnet identity fields.

  Entity AvalancheValidator :: nodeId+subnetId+startTimeMs ; nodeId! p:str, subnetId! p:str, startTimeMs! p:num, endTimeMs? p:num, stakeAmountNavax? p:bigint, txId? p:hex, rewardOwnerAddresses* p:str, potentialRewardNavax? p:bigint, delegationFeePercent? p:num, connected? p:bool, uptimePercent? p:num, $subnet? $:AvalancheSubnet, $network? $:Network
    Sources :: AvalanchePlatformVm_JsonRpc, AvalancheInfo_JsonRpc, Avascan_Rest
    View :: AvalancheValidatorView top `<dl>` shows node id, subnet, start/end time, stake, delegation fee, uptime, connected status, and reward owner count. Tabs: delegators, validation interval, reward owners, linked member chain/network, source evidence.
    Notes :: The validator row models a validator's participation in one subnet over one interval. Do not use it as a generic node profile; node identity outside a subnet needs a separate sourceable entity.

  Entity BeaconAttestation :: $network+slot+index ; $network! $:EvmNetwork, slot! p:num, index! p:num, committeeIndex? p:num, aggregationBits? p:str
    Sources :: Beacon_Rest
    View :: BeaconAttestationView title/value shows attestation index in the slot; expanded top `<dl>` shows committee index and truncated aggregation bits. BeaconAttestationsView lists rows under BeaconSlotView and EvmNetworkView consensus tabs.
    Notes :: Compact attestation row for slot body/duty summaries. It intentionally does not model attestation data roots, source/target checkpoints, signatures, or participant validator refs until those payload fields and views are sourced.

  Entity BeaconCommittee :: $network+slot+index ; $network! $:EvmNetwork, slot! p:num, index! p:num, validatorIndices! p:num[]
    Sources :: Beacon_Rest
    View :: BeaconCommitteeView title/value shows committee index in the slot; expanded top `<dl>` shows validator count. BeaconCommitteesView lists rows under BeaconSlotView and EvmNetworkView consensus tabs.
    Notes :: Committee assignment row for a slot. `validatorIndices` are consensus validator indices; keep them numeric unless a source/view needs explicit BeaconValidator refs for each committee member.

  Entity BeaconEpoch :: $network+epoch ; $network! $:EvmNetwork, epoch! p:num, startSlot! p:num, endSlot! p:num, slotCount! p:num, $$beaconSlots* $:BeaconSlot, finalized? p:bool, globalParticipationRate? p:num, validatorsCount? p:num, attestationsCount? p:num, attesterSlashingsCount? p:num, proposerSlashingsCount? p:num, withdrawalsCount? p:num
    Sources :: Beacon_Rest, BeaconchaIn_Rest
    View :: BeaconEpochView title/value shows epoch number; top `<dl>` shows slot range and, when expanded, slot count, finalized status, participation, validator count, attestation count, withdrawal count, and attester/proposer slashing counts. Details use CollapsibleTabs with Slots -> BeaconSlotsView.
    Notes :: Consensus epoch row. Slot range is deterministic consensus math from chain configuration, while participation/finalized/count fields are indexed epoch stats. Do not model epoch-level stats as live EvmNetwork header fields.

  Entity BeaconSlashing :: $network+slot+kind+index ; $network! $:EvmNetwork, slot! p:num, kind! p:enum, index! p:num
    Sources :: Beacon_Rest
    View :: BeaconSlashingView title/value shows slashing kind and slot; expanded top `<dl>` shows slashing index. BeaconSlashingsView lists rows under BeaconSlotView and EvmNetworkView consensus tabs.
    Notes :: Minimal slashing presence row preserving attester/proposer kind and slot-local index. It intentionally does not claim offender validator refs or evidence details until the source exposes them.

  Entity BeaconSlot :: $network+slot ; $network! $:EvmNetwork, slot! p:num, epoch! p:num, proposerIndex? p:num, root? p:hex, parentRoot? p:hex, stateRoot? p:hex, bodyRoot? p:hex, canonical? p:bool, signature? p:hex, $$beaconCommittees* $:BeaconCommittee, $$beaconAttestations* $:BeaconAttestation, $$beaconWithdrawals* $:BeaconWithdrawal, $$beaconSlashings* $:BeaconSlashing
    Sources :: Beacon_Rest
    View :: BeaconSlotView title/value shows slot number; top `<dl>` shows proposer index and, when expanded, epoch link, block root, canonical flag, parent root, state root, body root, and signature. Details use CollapsibleTabs: Committees -> BeaconCommitteesView, Attestations -> BeaconAttestationsView, Withdrawals -> BeaconWithdrawalsView, Slashings -> BeaconSlashingsView.
    Notes :: Consensus slot row. Empty or missed slots can have selector identity without full body fields. Execution block linkage belongs on MEV payload rows or execution block rows when a source proves the mapping.

  Entity BeaconSyncCommittee :: $network+period ; $network! $:EvmNetwork, period! p:num, validatorIndices! p:num[]
    Sources :: Beacon_Rest
    View :: BeaconSyncCommitteeView title/value shows sync committee period; expanded top `<dl>` shows validator count. BeaconSyncCommitteesView lists rows under EvmNetworkView consensus tabs.
    Notes :: Sync committee row for a consensus period. Current/head period can be derived from head slot and consensus constants; historical periods need source support before being listed broadly.

  Entity BeaconValidator :: $network+validatorIndex ; $network! $:EvmNetwork, validatorIndex! p:num, balanceGwei? p:bigint, effectiveBalanceGwei? p:bigint, status? p:str, pubkey? p:hex, slashed? p:bool
    Sources :: Beacon_Rest
    View :: BeaconValidatorView title/value shows validator index; expanded top `<dl>` shows balance, effective balance, status, slashed flag, and pubkey. BeaconValidatorsView lists rows under EvmNetworkView consensus tabs.
    Notes :: Validator row for a concrete consensus validator index. Current network lists may be recent/head-biased rather than a full validator registry crawl; do not present `$$beaconValidators` as exhaustive unless pagination/source coverage supports it.

  Entity BeaconWithdrawal :: $network+slot+index ; $network! $:EvmNetwork, slot! p:num, index! p:num, validatorIndex? p:num, $validator? $:BeaconValidator, $account? $:EvmAccount, amountGwei? p:bigint
    Sources :: Beacon_Rest
    View :: BeaconWithdrawalView title/value shows withdrawal index in the slot; expanded top `<dl>` shows validator index, BeaconValidatorView ref, recipient EvmAccountView ref, and amount in gwei. BeaconWithdrawalsView lists rows under BeaconSlotView and EvmNetworkView consensus tabs.
    Notes :: Capella-style withdrawal row from beacon slot/body data. Amount is consensus-layer gwei; execution balance effects still belong to EVM block, transaction, or account balance observations when sourced separately.

  Entity BitcoinCashBcmrMetadata :: $network+categoryId+registryUrl ; $network! $:Network, categoryId! p:str, registryUrl! p:str, name? p:str, description? p:str, symbol? p:str, decimals? p:num
    Sources :: BitcoinCashBcmr_Github
    View :: BitcoinCashBcmrMetadataView top `<dl>` shows network, category id, registry URL, name, symbol, decimals, and description. Details tabs: Category -> BitcoinCashCashTokenCategoryView when linked; Registry document -> latest revision fields and raw registry URL; Outputs -> CashToken outputs that cite this category when available.
    Notes :: BCMR is metadata for a CashToken category, not the category identity itself. Keep `registryUrl` in the selector because current resolver logic fetches a supplied registry and does not discover an authoritative registry from chain state. Do not infer metadata from category id alone or treat registry claims as spendable token state.

  Entity BitcoinCashCashTokenCategory :: $network+categoryId ; $network! $:Network, categoryId! p:str, $metadata? $:BitcoinCashBcmrMetadata
    Sources :: BitcoinCashNode_JsonRpc, BitcoinCashBcmr_Github
    View :: BitcoinCashCashTokenCategoryView top `<dl>` shows network, category id, and metadata status. Details tabs: Metadata -> BitcoinCashBcmrMetadataView when a registry URL is known; Fungible outputs -> BitcoinCashCashTokenFungibleAmount list; NFT outputs -> BitcoinCashCashTokenNft list; Network -> UtxoNetworkView.
    Notes :: Category id is the stable CashToken identity. BitcoinCashNode_JsonRpc discovers categories through BCH output `tokenData`; BCMR can enrich a category only when a concrete registry URL is supplied or discovered by a future source. Do not model every registry identity revision as a separate token category.

  Entity BitcoinCashCashTokenCommitment :: $output ; $output! $:UtxoOutput, commitmentHex! p:str
    Sources :: BitcoinCashNode_JsonRpc
    View :: BitcoinCashCashTokenCommitmentView top `<dl>` shows output and commitment hex. Details tabs: Output -> UtxoOutputView; NFT -> BitcoinCashCashTokenNftView; Raw commitment -> hex display.
    Notes :: Commitment is an output-attached NFT payload, not a standalone asset or metadata document. Keep selector `$output`; if commitment semantics become decodable later, add typed fields or a separate source-claimed decoded facet rather than changing identity.

  Entity BitcoinCashCashTokenFungibleAmount :: $output ; $output! $:UtxoOutput, $category! $:BitcoinCashCashTokenCategory, amount! p:bigint
    Sources :: BitcoinCashNode_JsonRpc
    View :: BitcoinCashCashTokenFungibleAmountView top `<dl>` shows output, category, and amount. Details tabs: Output -> UtxoOutputView; Category -> BitcoinCashCashTokenCategoryView; Transaction -> parent UtxoTransactionView through the output.
    Notes :: This row represents the fungible CashToken amount carried by one BCH UTXO output. It is not a balance row; address/category balances should be timestamped/indexer observations if a source exposes them.

  Entity BitcoinCashCashTokenNft :: $output ; $output! $:UtxoOutput, $category! $:BitcoinCashCashTokenCategory, $commitment? $:BitcoinCashCashTokenCommitment, capability! p:enum
    Sources :: BitcoinCashNode_JsonRpc
    View :: BitcoinCashCashTokenNftView top `<dl>` shows output, category, capability, and commitment status. Details tabs: Output -> UtxoOutputView; Category -> BitcoinCashCashTokenCategoryView; Commitment -> BitcoinCashCashTokenCommitmentView; Transaction -> parent UtxoTransactionView through the output.
    Notes :: CashToken NFT identity is output-scoped in the current model because the resolver reads NFT data from one UTXO. Capability is the protocol value (`none`, `mutable`, `minting`). Do not merge this with generic `NftToken`; BCH CashTokens use native UTXO token data and should remain attached to UtxoOutput unless a cross-chain asset facade explicitly references it.

  Entity BittensorBlock :: $network+blockNumber+hash ; $network! $:Network, blockNumber! p:bigint, hash! p:str, $parent? $:BittensorBlock, stateRoot? p:str, extrinsicsRoot? p:str, extrinsicCount? p:num
    Sources :: Bittensor_JsonRpc
    View :: BittensorBlockView top `<dl>` shows network, block number, hash, parent block, state root, extrinsics root, and extrinsic count. Details tabs: Parent -> BittensorBlockView; Network -> BittensorNetworkView.
    Notes :: This is the Subtensor/Substrate block header row. Block-number plus hash keeps fork/disagreement context explicit; node health, runtime, subnet counts, and payload byte lengths belong on BittensorNetwork_Timestamp.

  Entity BittensorMetagraph_Timestamp :: $subnet+timestampMs ; $subnet! $:BittensorSubnet, timestampMs! p:num, metagraphByteLength? p:num, neuronCount? p:num
    Sources :: Bittensor_JsonRpc
    View :: BittensorMetagraph_TimestampView top `<dl>` shows subnet, observation time, metagraph byte length, and neuron count. BittensorSubnetView shows latest/history through BittensorMetagraph_TimestampsView.
    Notes :: Metagraph payload size and decoded neuron count are subnet/time observations. Keep economics, stake, rank, and emission values off BittensorSubnet or BittensorNeuron until decoded metagraph fields are modeled as timestamped rows.

  Entity BittensorNetwork :: $network ; $network! $:Network, $$timestamps* $:BittensorNetwork_Timestamp, $$blocks* $:BittensorBlock, $$subnets* $:BittensorSubnet
    Sources :: Constants_Internal, Bittensor_JsonRpc
    View :: BittensorNetworkView top `<dl>` shows linked Network, latest finalized block, latest runtime, subnet count, environment, stack, and native asset. Details tabs: Blocks -> BittensorBlocksView; Subnets -> BittensorSubnetsView; Neurons -> BittensorSubnetsView scoped for neuron-bearing subnets; Network snapshots -> BittensorNetwork_TimestampsView; Resources -> faucets/block explorers from NetworkView.
    Notes :: Bittensor-specific network state hangs from Subtensor block/subnet/timestamp rows. Do not model subnet assets, metagraph sizes, DynamicInfo payload lengths, or market-rank categories as stable network identity.

  Entity BittensorNetwork_Timestamp :: $network+timestampMs ; $network! $:Network, timestampMs! p:num, finalizedBlockNumber? p:bigint, finalizedBlockHash? p:str, runtimeSpecName? p:str, runtimeSpecVersion? p:num, runtimeImplVersion? p:num, peerCount? p:num, isSyncing? p:bool, shouldHavePeers? p:bool, subnetCount? p:num, subnetsInfoByteLength? p:num, dynamicInfoByteLength? p:num, metagraphsByteLength? p:num
    Sources :: Bittensor_JsonRpc
    View :: BittensorNetwork_TimestampView top `<dl>` shows network, observation time, finalized block number/hash, runtime spec/impl versions, peer count, sync flags, subnet count, SubnetsInfo byte length, DynamicInfo byte length, and metagraph byte length. BittensorNetworkView shows latest/history through BittensorNetwork_TimestampsView.
    Notes :: Finality head, runtime version, peer/sync state, subnet counts, and payload byte lengths are bounded node observations keyed by observation time, not BittensorNetwork identity fields.

  Entity BittensorNeuron :: $subnet+uid ; $subnet! $:BittensorSubnet, uid! p:num
    Sources :: Bittensor_JsonRpc
    View :: BittensorNeuronView top `<dl>` shows subnet and uid. Details tabs: Subnet -> BittensorSubnetView; Metagraph snapshots -> BittensorMetagraph_TimestampsView.
    Notes :: `subnet+uid` identifies a neuron slot in a subnet. Stake, rank, incentive, dividends, emission, validator permit, and activity are metagraph/time observations and should be added only as decoded timestamped rows.

  Entity BittensorSubnet :: $network+netuid ; $network! $:Network, netuid! p:num, name? p:str, subnetInfoByteLength? p:num, dynamicInfoByteLength? p:num, hyperparamsByteLength? p:num, $$metagraphTimestamps* $:BittensorMetagraph_Timestamp, $$neurons* $:BittensorNeuron
    Sources :: Constants_Internal, Bittensor_JsonRpc
    View :: BittensorSubnetView top `<dl>` shows network, netuid, name, subnet-info byte length, dynamic-info byte length, and hyperparams byte length. Details tabs: Metagraph snapshots -> BittensorMetagraph_TimestampsView; Neurons -> BittensorNeuronsView; Network -> BittensorNetworkView.
    Notes :: Netuid is the subnet selector. Byte lengths are source payload observations currently stored on the subnet row for available decoded shape, but any economic values or historical changes must move to BittensorMetagraph_Timestamp or a dedicated subnet timestamp row before being treated as observations.

  Entity BitTorrentAnnounceObservation :: $torrent+$tracker+timestampMs+source ; $torrent! $:BitTorrentMetainfo, $tracker! $:BitTorrentTracker, timestampMs! p:num, source! p:str, seeders? p:num, leechers? p:num, downloaded? p:num, intervalSec? p:num, status! p:enum, error? p:str
    Sources :: Local_Internal
    View :: BitTorrentAnnounceObservationView top `<dl>` shows torrent, tracker, source, timestamp, status, seeders, leechers, downloaded count, interval, and error. Details tabs: Tracker -> BitTorrentTrackerView; Torrent -> BitTorrentMetainfoView; Response -> raw announce response/error when retained.
    Notes :: Connected-client tracker announce observation. BEP-3 tracker responses can include interval and peers; clients may summarize seeders, leechers, and downloaded counts. Counts are tracker-local observations and can conflict across trackers.

  Entity BitTorrentDhtLookupObservation :: infoHash+observerKey+timestampMs ; infoHash! p:hex, observerKey! p:str, timestampMs! p:num, queriedNodeCount? p:num, responsiveNodeCount? p:num, peerCount? p:num, closestNodeIds* p:str, status! p:enum
    Sources :: Local_Internal
    View :: BitTorrentDhtLookupObservationView top `<dl>` shows info hash, observer, timestamp, status, queried node count, responsive node count, peer count, and closest node ids. Details tabs: Closest nodes -> BitTorrentDhtNodeObservation list; Swarm context -> BitTorrentSwarmObservation_Timestamp list for the same info hash.
    Notes :: Connected-client Mainline DHT lookup run. BEP-5 distinguishes DHT nodes from BitTorrent peers; queried/responsive counts and closest node ids describe one lookup crawl, not global swarm size.

  Entity BitTorrentDhtNodeObservation :: nodeId+timestampMs+source ; nodeId! p:str, timestampMs! p:num, source! p:str, address? p:str, port? p:num, observedInfoHashes* p:hex, reachable? p:bool
    Sources :: Local_Internal
    View :: BitTorrentDhtNodeObservationView top `<dl>` shows DHT node id, source, timestamp, address, port, reachability, and observed info hashes. Details tabs: Lookups -> BitTorrentDhtLookupObservation list that returned or queried the node; Routing evidence -> local routing-table/query payload when retained.
    Notes :: Mainline DHT node observation from connected-client queries or routing table snapshots. Node ids are routing identifiers in the DHT keyspace, not user accounts and not durable BitTorrent peer identities.

  Entity BitTorrentFile :: $torrent+fileIndex ; $torrent! $:BitTorrentMetainfo, fileIndex! p:num, path! p:str, pathSegments* p:str, length! p:bigint, piecesRoot? p:hex, fileHash? p:hex
    Sources :: Local_Internal
    View :: BitTorrentFileView top `<dl>` shows torrent, file index, path, length, pieces root, and file hash. Details tabs: Torrent -> BitTorrentMetainfoView; Tree entry -> BitTorrentFileTreeEntryView; Piece span -> BitTorrentPiece list covering this file.
    Notes :: Flattened file row from a torrent's single-file length/name or multi-file files/file-tree data. `fileIndex` is order within the torrent layout; file path is descriptor metadata and not a global content identity.

  Entity BitTorrentFileTreeEntry :: $torrent+path ; $torrent! $:BitTorrentMetainfo, path! p:str, pathSegments* p:str, entryKind! p:enum, length? p:bigint, piecesRoot? p:hex, $file? $:BitTorrentFile
    Sources :: Local_Internal
    View :: BitTorrentFileTreeEntryView top `<dl>` shows torrent, path, path segments, entry kind, length, pieces root, and linked file. Details tabs: File -> BitTorrentFileView; Children -> child tree entries for the path prefix; Torrent -> BitTorrentMetainfoView.
    Notes :: Path entry parsed from BEP-3 v1 file lists or BEP-52 file trees. Keep directory/file tree structure separate from piece offsets; `$file` links only concrete leaf entries to flattened transfer-layout rows.

  Entity BitTorrentMerkleProofVerificationRun :: $piece+source+timestampMs ; $piece! $:BitTorrentPiece, source! p:str, timestampMs! p:num, leafHash? p:hex, proofHashes* p:hex, rootHash? p:hex, verifier! p:str, status! p:enum, error? p:str
    Sources :: Local_Internal
    View :: BitTorrentMerkleProofVerificationRunView top `<dl>` shows piece, source, verifier, timestamp, status, leaf hash, root hash, and error. Details tabs: Proof hashes -> ordered sibling hashes; Piece -> BitTorrentPieceView; Torrent -> BitTorrentMetainfoView through the piece.
    Notes :: Local BEP-52 Merkle proof verification over a v2 piece/file tree. This verifies inclusion under a torrent's v2 Merkle root for supplied proof material; it does not prove peer honesty beyond the supplied bytes/proof.

  Entity BitTorrentMetainfo :: infoHash+hashVersion ; infoHash! p:hex, hashVersion! p:enum, infoHashV1? p:hex, infoHashV2? p:hex, metainfoHash? p:hex, bencodedInfoHash? p:hex, name? p:str, pieceLength? p:bigint, totalLength? p:bigint, private? p:bool, $$files* $:BitTorrentFile, $$fileTreeEntries* $:BitTorrentFileTreeEntry, $$pieces* $:BitTorrentPiece, $$trackers* $:BitTorrentTracker, $$magnets* $:MagnetLink
    Sources :: Local_Internal
    View :: BitTorrentMetainfoView top `<dl>` shows info hash, hash version, v1/v2 hashes, metainfo hash, bencoded info hash, name, piece length, total length, private flag, tracker count, and file count. Details tabs: Files -> BitTorrentFile list; File tree -> BitTorrentFileTreeEntry tree; Pieces -> BitTorrentPiece list; Trackers -> BitTorrentTracker list; Magnets -> MagnetLink list; Local observations -> announce/DHT/swarm/peer/transfer/verification rows.
    Notes :: Torrent descriptor identity parsed from `.torrent` bytes or metadata exchange payloads. BEP-3 v1 info dictionaries provide SHA-1 info hashes, piece length, pieces, file lists, trackers, and private flag; BEP-52 v2/hybrid metadata adds v2 info hashes, file trees, piece layers, and Merkle roots. The descriptor identifies and verifies content pieces; it is not the payload bytes.

  Entity BitTorrentMetainfoParse :: metainfoHash+parserVersion ; metainfoHash! p:hex, parserVersion! p:str, bencodeHash! p:hex, infoHashV1? p:hex, infoHashV2? p:hex, fileCount? p:num, pieceCount? p:num, parseStatus! p:enum, error? p:str
    Sources :: Local_Internal
    View :: BitTorrentMetainfoParseView top `<dl>` shows metainfo hash, parser version, bencode hash, parse status, computed v1/v2 info hashes, file count, piece count, and error. Details tabs: Torrent -> BitTorrentMetainfoView when parse succeeds; Diagnostics -> canonical bencode and parse error details.
    Notes :: Local parser run over one metainfo byte source. Invalid bencode or non-canonical dictionary ordering should be reported instead of silently normalizing identity; this row is parser evidence, not the torrent identity row.

  Entity BitTorrentMetainfoVerificationRun :: infoHash+hashVersion+verifier+timestampMs ; infoHash! p:hex, hashVersion! p:enum, verifier! p:str, timestampMs! p:num, bencodedInfoHash? p:hex, computedInfoHashV1? p:hex, computedInfoHashV2? p:hex, canonicalBencode? p:bool, status! p:enum, error? p:str
    Sources :: Local_Internal
    View :: BitTorrentMetainfoVerificationRunView top `<dl>` shows info hash, hash version, verifier, timestamp, status, bencoded info hash, computed v1/v2 hashes, canonical bencode flag, and error. Details tabs: Torrent -> BitTorrentMetainfoView; Verification material -> raw/canonical info-dictionary evidence when retained.
    Notes :: Local verification that recomputes the selected info hash from original or canonical info dictionary bytes. BEP-3 requires hashing the bencoded info value as found in the metainfo file; verification proves descriptor identity, not tracker availability or payload possession.

  Entity BitTorrentPeerObservation :: $torrent+peerId+timestampMs+source ; $torrent! $:BitTorrentMetainfo, peerId! p:str, timestampMs! p:num, source! p:str, address? p:str, port? p:num, client? p:str, completedPercent? p:num, supportsDht? p:bool, supportsPex? p:bool
    Sources :: Local_Internal
    View :: BitTorrentPeerObservationView top `<dl>` shows torrent, peer id, source, timestamp, address, port, client, completed percent, DHT support, and PEX support. Details tabs: Torrent -> BitTorrentMetainfoView; Discovery evidence -> tracker/DHT/handshake/PEX payload when retained.
    Notes :: Connected-client peer observation from tracker peer lists, DHT `get_peers` responses, peer wire handshakes, PEX, or transfer telemetry. Peer ids are self-selected/session-scoped; do not model peers as durable identities unless a stronger key is observed.

  Entity BitTorrentPiece :: $torrent+pieceIndex ; $torrent! $:BitTorrentMetainfo, pieceIndex! p:num, pieceHashV1? p:hex, pieceRootV2? p:hex, pieceLayerHash? p:hex, length? p:bigint, offset? p:bigint
    Sources :: Local_Internal
    View :: BitTorrentPieceView top `<dl>` shows torrent, piece index, offset, length, v1 piece hash, v2 piece root, and piece-layer hash. Details tabs: Torrent -> BitTorrentMetainfoView; Files -> BitTorrentFile list covered by the piece span; Verification -> piece and Merkle proof verification runs.
    Notes :: Piece descriptor from BEP-3 v1 `pieces` strings or BEP-52 v2 piece layers. Piece rows describe expected integrity data and transfer order across the concatenated payload, not downloaded bytes.

  Entity BitTorrentPieceVerificationRun :: $piece+source+timestampMs ; $piece! $:BitTorrentPiece, source! p:str, timestampMs! p:num, bytesHash! p:hex, expectedHash! p:hex, hashVersion! p:enum, status! p:enum
    Sources :: Local_Internal
    View :: BitTorrentPieceVerificationRunView top `<dl>` shows piece, source, timestamp, hash version, status, bytes hash, and expected hash. Details tabs: Piece -> BitTorrentPieceView; Torrent -> BitTorrentMetainfoView through the piece; Verification material -> local byte-source metadata when retained.
    Notes :: Local verification of downloaded or stored piece bytes against expected hashes. For v1 use SHA-1 of the piece bytes; for v2 use the appropriate SHA-256 piece-layer/root context and pair with Merkle proof rows when needed.

  Entity BitTorrentSwarmObservation_Timestamp :: $torrent+timestampMs+source ; $torrent! $:BitTorrentMetainfo, timestampMs! p:num, source! p:str, peerCount? p:num, seedCount? p:num, completedCount? p:num, availability? p:num
    Sources :: Local_Internal
    View :: BitTorrentSwarmObservation_TimestampView top `<dl>` shows torrent, source, timestamp, peer count, seed count, completed count, and availability. Details tabs: Torrent -> BitTorrentMetainfoView; Evidence -> contributing tracker/DHT/client observations; History -> same torrent observations sorted newest first.
    Notes :: Aggregate swarm observation from tracker announces/scrapes, DHT lookup, PEX, or client session telemetry. Peer/seed/completed counts and availability are estimates from one source/time and should not be treated as canonical torrent fields.

  Entity BitTorrentTracker :: trackerUrl ; trackerUrl! p:url, trackerKind! p:enum, $$announces* $:BitTorrentAnnounceObservation
    Sources :: Local_Internal
    View :: BitTorrentTrackerView top `<dl>` shows tracker URL, tracker kind, latest status, and latest known counts. Details tabs: Announces -> BitTorrentAnnounceObservation history by torrent; Scrapes -> BitTorrentTrackerScrapeObservation history; Torrents -> BitTorrentMetainfo list that cite the tracker.
    Notes :: Tracker endpoint from metainfo `announce`/`announce-list`, magnet `tr` parameters, or a local catalog. Tracker identity is the URL endpoint, not a torrent; announce/scrape results are timestamped observations.

  Entity BitTorrentTrackerScrapeObservation :: $tracker+infoHash+timestampMs+source ; $tracker! $:BitTorrentTracker, infoHash! p:hex, timestampMs! p:num, source! p:str, complete? p:num, downloaded? p:num, incomplete? p:num, status! p:enum, error? p:str
    Sources :: Local_Internal
    View :: BitTorrentTrackerScrapeObservationView top `<dl>` shows tracker, info hash, source, timestamp, status, complete, downloaded, incomplete, and error. Details tabs: Tracker -> BitTorrentTrackerView; Torrent -> BitTorrentMetainfoView when the info hash resolves locally; Response -> raw scrape response/error when retained.
    Notes :: Tracker scrape or equivalent summarized stats observation. Complete/incomplete/downloaded correspond to tracker-side seed/leech/completed counters where supported; unsupported trackers should yield status/error rather than zero counts.

  Entity BitTorrentTransferObservation :: $torrent+observerKey+timestampMs ; $torrent! $:BitTorrentMetainfo, observerKey! p:str, timestampMs! p:num, downloadedBytes? p:bigint, uploadedBytes? p:bigint, downloadRate? p:num, uploadRate? p:num, verifiedPieces? p:num, failedPieces? p:num
    Sources :: Local_Internal
    View :: BitTorrentTransferObservationView top `<dl>` shows torrent, observer, timestamp, downloaded bytes, uploaded bytes, download rate, upload rate, verified pieces, and failed pieces. Details tabs: Torrent -> BitTorrentMetainfoView; Piece verification -> BitTorrentPieceVerificationRun list; Swarm context -> BitTorrentSwarmObservation_Timestamp list.
    Notes :: Connected-client transfer telemetry for one observer/session/time. This is local session state, not swarm state; if implemented as private connected-node state, promote the row to a `BlockheadBitTorrent*` name.

  Entity BlockheadAgentConversation :: id ; id! p:str, name! p:str|null, pinned! p:bool, systemPrompt! p:str, defaultConnectionId? p:str|null, defaultModelId? p:str|null, createdAt! p:num, updatedAt! p:num, $$turns+ $:BlockheadAgentConversationTurn
    Sources :: Local_Internal
    View :: BlockheadAgentConversationView top `<dl>` shows name or id, pinned state, created/updated timestamps, default connection/model ids, and system prompt when expanded. Details tabs: Turns -> BlockheadAgentConversationTurn list; Preferences -> local connection/model defaults.
    Notes :: Local LLM chat transcript container. defaultConnectionId/defaultModelId are local preferences, not provider account identity, model-release provenance, or a complete model execution audit.

  Entity BlockheadAgentConversationTurn :: id ; id! p:str, $conversation! $:BlockheadAgentConversation, parentId! p:str|null, userPrompt! p:str, assistantText! p:str|null, providerId! p:str|null, status! p:enum, error? p:str, createdAt! p:num, promptVersion! p:str
    Sources :: Local_Internal
    View :: BlockheadAgentConversationTurnView top `<dl>` shows status, created time, provider id, prompt version, parent turn, and error. Details tabs: Prompt -> user prompt; Response -> assistant text; Branching -> parent/child transcript context.
    Notes :: Local transcript turn. parentId is a same-conversation branch link, while providerId alone is not enough to identify request payload, token usage, tool calls, citations, attachments, or safety/system-card provenance.

  Entity BlockheadAlgorandParticipationKey :: nodeId+participationId ; nodeId! p:str, participationId! p:str, $account? $:AlgorandAccount, $network? $:AlgorandNetwork, firstValidRound? p:bigint, lastValidRound? p:bigint, keyDilution? p:bigint, selectionKey? p:str, votingKey? p:str, stateProofKey? p:str, effectiveFirstRound? p:bigint, effectiveLastRound? p:bigint, lastSyncedAt? p:num
    Sources :: Local_Internal, Algod_Rest
    View :: BlockheadAlgorandParticipationKeyView top `<dl>` shows node id, participation id, account, network, validity round range, key dilution, effective round range, and last synced time. Expanded details show redacted selection/voting/state-proof key material and connected-node status. Details tabs: Account -> AlgorandAccountView; Network -> AlgorandNetworkView; Validity -> first/last/effective rounds.
    Notes :: Connected-node participation key inventory from private algod participation endpoints. These keys are operational validator state, not public account state and not proof that an account is currently proposing blocks. Keep raw key material redacted and local.

  Entity BlockheadAlgorandWalletState :: walletId+network ; walletId! p:str, $wallet? $:BlockheadWallet, $network! $:AlgorandNetwork, walletApiKind? p:enum, providerName? p:str, selectedAddress? p:str, genesisHash? p:hex, genesisId? p:str, capabilities* p:enum, accountCount? p:num, lastSyncedAt? p:num, $$accounts* $:BlockheadWalletAccount, $$ledgerAccounts* $:AlgorandAccount
    Sources :: Local_Internal, AlgorandWallet_WalletApi, WalletConnect_SignClient
    View :: BlockheadAlgorandWalletStateView top `<dl>` shows wallet id, network, wallet API kind, provider name, selected address, genesis hash/id, capability count, account count, and last synced time. Details tabs: Wallet accounts -> BlockheadWalletAccount list; Ledger accounts -> AlgorandAccount list for exposed addresses; Capabilities -> signing/transaction/group support; Network -> AlgorandNetworkView.
    Notes :: Blockhead-local Algorand wallet session state from injected/mobile WalletConnect-style providers. Public algod/indexer data can resolve exposed addresses as AlgorandAccount rows, but selected account, provider metadata, session capabilities, and signing authority are local wallet state and must stay Blockhead-prefixed.

  Entity BlockheadBridgeIntent :: sessionId+actionId ; sessionId! p:str, actionId! p:str, $sessionAction! $:BlockheadSessionAction, fromChainId? p:num, toChainId? p:num, tokenAddress? p:evmAddress, $fromNetwork? $:EvmNetwork, $toNetwork? $:EvmNetwork, amount? p:bigint, slippage? p:num
    Sources :: Local_Internal
    View :: BlockheadBridgeIntentView top `<dl>` shows session action, from/to chain ids, resolved from/to networks when present, token address, amount, and slippage. Details tabs: Session action -> BlockheadSessionActionView; Route quotes -> BridgeRoute list when selected; Execution -> payload, simulation, submission, and outcome rows when modeled separately.
    Notes :: Local bridge request intent, not a bridge deployment, route quote, transfer lifecycle, settlement proof, refund, or destination receipt. Keep provider route labels and execution state out of this row. Do not turn Chainlist bridge URLs or LI.FI tool support into the selected route without a quote/route row.

  Entity BlockheadCardanoWalletState :: walletId+network ; walletId! p:str, $wallet? $:BlockheadWallet, $network! $:CardanoNetwork, walletApiKind? p:enum, apiVersion? p:str, enabledExtensions* p:str, changeAddress? p:str, rewardAddresses* p:str, usedAddressCount? p:num, unusedAddressCount? p:num, collateralUtxoCount? p:num, balanceLovelace? p:bigint, balanceAssets? p:json, networkId? p:num, lastSyncedAt? p:num, $$accounts* $:BlockheadWalletAccount, $$ownedUtxos* $:CardanoTxOutput
    Sources :: Local_Internal, CardanoCip30_WalletApi
    View :: BlockheadCardanoWalletStateView top `<dl>` shows wallet id, network, wallet API kind, API version, enabled extension count, change address, reward address count, used/unused address counts, collateral UTXO count, balance lovelace, network id, and last synced time. Details tabs: Accounts -> BlockheadWalletAccount list; Addresses -> change/reward/used/unused address lists; UTXOs -> owned CardanoTxOutput/CardanoTxOutputAsset rows; Collateral -> collateral UTXO candidates; Capabilities -> CIP-30 extensions and network id.
    Notes :: Blockhead-local connected Cardano wallet state from CIP-30/injected wallet APIs. Public node/indexer sources can observe addresses, UTXOs, stake credentials, and transactions, but selected wallet addresses, collateral candidates, enabled extensions, and wallet-returned balances are local authority/session state and must stay Blockhead-prefixed.

  Entity BlockheadCashuProof :: walletId+mintUrl+keysetId+secretHash ; walletId! p:str, $mint! $:CashuMint, $keyset? $:CashuKeyset, keysetId! p:str, secretHash! p:hex, secret? p:str, amount! p:bigint, unit! p:str, signature? p:hex, witness? p:str, dleqJson? p:str, state! p:enum, stateCheckedAt? p:num, receivedAt? p:num, spentAt? p:num, sourceTokenId? p:str
    Sources :: Local_Internal
    View :: BlockheadCashuProofView top `<dl>` shows wallet id, mint, keyset id, secret hash, amount, unit, state, last state check, received time, spent time, and source token id. Details tabs: Mint/keyset -> CashuMintView and CashuKeysetView; Secret material -> redacted secret/signature/witness/DLEQ fields with reveal controls only in local trusted UI; Lifecycle -> received/spent/check-state timeline; Source token -> BlockheadCashuTokenView when imported from a token string.
    Notes :: Blockhead-local Cashu proof state. The proof secret and signature are bearer money; default views should use `secretHash` and redaction, with raw proof material exposed only in trusted local wallet contexts. NUT-07 check-state can report spendability only for wallet-supplied proof Ys/secrets, so proof state is not a public CashuMint child list and is not sourceable from a mint without Blockhead-local wallet state.

  Entity BlockheadCashuToken :: id ; id! p:str, tokenVersion! p:enum, encodedToken? p:str, unit? p:str, memo? p:str, mintUrl? p:url, $mint? $:CashuMint, proofCount? p:num, totalAmount? p:bigint, importedAt! p:num, redeemedAt? p:num, status! p:enum, $$proofs* $:BlockheadCashuProof
    Sources :: Local_Internal
    View :: BlockheadCashuTokenView top `<dl>` shows token id, version, mint, unit, memo, proof count, total amount, imported time, redeemed time, and status. Details tabs: Proofs -> BlockheadCashuProof list; Encoded token -> redacted token string with local reveal/copy controls; Mint -> CashuMintView; Import/redeem -> local lifecycle and errors when captured.
    Notes :: Local imported/exported Cashu token envelope. V3 tokens can contain proofs for multiple mints; V4 tokens are single-mint, so `mintUrl` is optional until parsed. Do not promote encoded token strings or proof secrets into global protocol rows.

  Entity BlockheadCashuWalletState :: walletId+mintUrl+unit ; walletId! p:str, $wallet? $:BlockheadWallet, $mint! $:CashuMint, unit! p:str, balance? p:bigint, proofCount? p:num, activeKeysetCount? p:num, pendingMintQuoteCount? p:num, pendingMeltQuoteCount? p:num, lastSyncedAt? p:num, $$proofs* $:BlockheadCashuProof, $$tokens* $:BlockheadCashuToken, $$mintQuotes* $:CashuMintQuote, $$meltQuotes* $:CashuMeltQuote
    Sources :: Local_Internal
    View :: BlockheadCashuWalletStateView top `<dl>` shows wallet id, mint, unit, balance, proof count, active keyset count, pending mint/melt quote counts, and last synced time. Details tabs: Proofs -> BlockheadCashuProof list; Tokens -> BlockheadCashuToken list; Mint -> CashuMintView; Quotes -> CashuMintQuote/CashuMeltQuote rows known to the wallet.
    Notes :: Local wallet/node view of spendable Cashu state. Balance is derived from local unspent proofs and may be stale until proofs are checked, spent, swapped, minted, or melted. Keep it prefixed because neither the mint nor public sources can enumerate a user's proofs, tokens, quote handles, or balance.

  Entity BlockheadFarcasterAccountConnection :: fid ; fid! p:num, username? p:str, displayName? p:str, $icon? $:Media, bio? p:str, verifications? p:str[], custody? p:str, authMethod? p:enum, signedAt? p:num
    Sources :: Local_Internal, Snapchain_Rest, Neynar_Rest
    View :: BlockheadFarcasterAccountConnectionView top `<dl>` shows FID, username, display name, icon, bio, custody address, auth method, signed time, and verification count. Details tabs: Feed -> FarcasterCastsView for the FID; Verification -> custody/auth-address proof fields; Profile -> hydrated social profile fields.
    Notes :: Local app connection to a Farcaster FID. Profile fields are social-source hydration and authMethod/signedAt are local connection state; do not treat this row as a wallet session, custody proof by itself, or canonical Farcaster user record.

  Entity BlockheadFedimintClientState :: clientId+federationId ; clientId! p:str, clientName? p:str, $federation! $:FedimintFederation, inviteCode? p:str, mnemonicSet? p:bool, guardianThreshold? p:num, moduleConfigJson? p:str, balanceMsat? p:bigint, ecashBalanceMsat? p:bigint, lightningBalanceMsat? p:bigint, onchainBalanceSats? p:bigint, recoveryState? p:enum, joinedAt? p:num, lastSyncedAt? p:num, viewingKeyJson? p:str, ecashNoteCountsJson? p:str, oobNotesJson? p:str
    Sources :: Local_Internal
    View :: BlockheadFedimintClientStateView top `<dl>` shows client id/name, federation, mnemonic-set status, balance totals, recovery state, joined time, last synced time, and invite status. Details tabs: Federation -> FedimintFederationView; Modules -> moduleConfigJson for mint/wallet/Lightning/meta modules; Balances -> ecash, Lightning, on-chain wallet balances; Notes -> ecash note counts and redacted OOB notes; Recovery/viewing keys -> redacted local key material and recovery state; Invite -> invite code, federation id, and preview/join status.
    Notes :: Blockhead-local Fedimint client state accessible only through a connected client/node such as fedimint-client-rpc or an app embedding fedimint-client. Viewing keys, mnemonic state, recovery material, notes, OOB ecash, and module database state are private local state, so keep them under Blockhead-prefixed rows. Federation config preview can seed FedimintFederation, but balances and note counts are not public federation facts.

  Entity BlockheadMoneroOutputState :: walletId+txHash+outputIndex ; walletId! p:str, $wallet? $:BlockheadWallet, $network! $:MoneroNetwork, $stealthOutput? $:MoneroStealthOutput, txHash! p:str, outputIndex! p:num, accountIndex? p:num, addressIndex? p:num, amountAtomicUnits? p:bigint, keyImage? p:str, keyImageSignature? p:str, spent? p:bool, unlocked? p:bool, confirmations? p:num, globalOutputIndex? p:bigint, exportHeight? p:bigint, lastCheckedAt? p:num
    Sources :: Local_Internal
    View :: BlockheadMoneroOutputStateView top `<dl>` shows wallet id, transaction hash, output index, account/subaddress indexes, amount, spent/unlocked state, confirmations, key-image presence, global output index, export height, and last checked time. Details tabs: Public output -> MoneroStealthOutputView when resolved; Subaddress -> BlockheadMoneroSubaddressStateView; Transfer -> BlockheadMoneroTransferState rows for the tx; Key image -> redacted key image/signature and import/export status; Wallet -> BlockheadMoneroWalletStateView.
    Notes :: Connected wallet/view-key interpretation of one owned Monero output. monero-wallet-rpc output export/import and transfer scans can reveal amount, subaddress, key image, and spent state to the wallet, but public daemon rows cannot. Keep this Blockhead-prefixed and do not attach ownership or amount semantics to MoneroStealthOutput or MoneroRingMember.

  Entity BlockheadMoneroSubaddressState :: walletId+accountIndex+addressIndex ; walletId! p:str, $wallet? $:BlockheadWallet, $network! $:MoneroNetwork, accountIndex! p:num, addressIndex! p:num, address? p:str, label? p:str, used? p:bool, balanceAtomicUnits? p:bigint, unlockedBalanceAtomicUnits? p:bigint, numUnspentOutputs? p:num, blocksToUnlock? p:num, timeToUnlockSeconds? p:num, lastSyncedAt? p:num
    Sources :: Local_Internal
    View :: BlockheadMoneroSubaddressStateView top `<dl>` shows wallet id, account index, address index, address, label, used flag, balance, unlocked balance, unspent output count, unlock timing, and last synced time. Details tabs: Network -> MoneroNetworkView; Wallet -> BlockheadMoneroWalletStateView; Outputs -> BlockheadMoneroOutputState list filtered to account/subaddress; Transfers -> BlockheadMoneroTransferState list filtered to account/subaddress; Address material -> redacted local address/export data.
    Notes :: Local monero-wallet-rpc subaddress state from wallet methods such as `get_address`, `get_balance`, and transfer scans. Address/balance visibility requires the connected wallet or view key; public Monero daemon data does not reveal recipient addresses or balances.

  Entity BlockheadMoneroTransferState :: walletId+txHash+transferIndex ; walletId! p:str, $wallet? $:BlockheadWallet, $network! $:MoneroNetwork, $transaction? $:MoneroTransaction, txHash! p:str, transferIndex! p:num, direction! p:enum, accountIndex? p:num, addressIndex? p:num, amountAtomicUnits? p:bigint, feeAtomicUnits? p:bigint, confirmations? p:num, unlockTime? p:bigint, paymentId? p:str, note? p:str, keyImage? p:str, spent? p:bool, timestampMs? p:num
    Sources :: Local_Internal
    View :: BlockheadMoneroTransferStateView top `<dl>` shows wallet id, transaction hash, direction, amount, fee, account/subaddress indexes, confirmations, unlock time, spent state, payment id, and timestamp. Details tabs: Transaction -> MoneroTransactionView when public tx data is resolved; Subaddress -> BlockheadMoneroSubaddressStateView; Outputs -> BlockheadMoneroOutputState rows for wallet-owned outputs in the tx; Proofs/keys -> tx key, spend proof, reserve proof, key image state when locally available; Notes -> local tx note.
    Notes :: Local wallet transfer row from monero-wallet-rpc transfer/incoming/outgoing methods. It can link to public MoneroTransaction by hash, but sender/recipient attribution, payment id mapping, amount attribution, spend state, notes, and key images are wallet-local interpretation.

  Entity BlockheadMoneroWalletState :: walletId ; walletId! p:str, $wallet? $:BlockheadWallet, $network! $:MoneroNetwork, primaryAddress? p:str, viewOnly? p:bool, trustedDaemon? p:bool, height? p:bigint, balanceAtomicUnits? p:bigint, unlockedBalanceAtomicUnits? p:bigint, multisigImportNeeded? p:bool, outputsExportedAt? p:num, keyImagesExportedAt? p:num, lastSyncedAt? p:num, viewKeyFingerprint? p:str, spendKeyAvailable? p:bool, $$subaddresses* $:BlockheadMoneroSubaddressState, $$outputs* $:BlockheadMoneroOutputState, $$transfers* $:BlockheadMoneroTransferState
    Sources :: Local_Internal
    View :: BlockheadMoneroWalletStateView top `<dl>` shows wallet id, network, primary address, view-only flag, trusted-daemon flag, height, balance, unlocked balance, multisig import status, last synced time, view-key fingerprint, and spend-key availability. Details tabs: Subaddresses -> BlockheadMoneroSubaddressState list; Outputs -> BlockheadMoneroOutputState list; Transfers -> BlockheadMoneroTransferState list; Sync/export -> output export and key-image export times; Network -> MoneroNetworkView; Key material -> redacted view/spend/multisig fields.
    Notes :: Blockhead-local connected monero-wallet-rpc state. Public monerod rows model blocks, transactions, key images, rings, and stealth outputs, but only wallet state can identify owned outputs, balances, subaddresses, tx notes, payment ids, exported outputs, imported/exported key images, multisig state, and view/spend key availability.

  Entity BlockheadPanelTree :: id ; id! p:str
    Sources :: Local_Internal
    View :: BlockheadPanelTreeView top `<dl>` shows panel tree id and local dashboard workspace kind. Details tabs: Layout -> saved geometry when modeled; Route state -> saved panel route refs when modeled.
    Notes :: Local dashboard layout root. Do not imply nested split ratios, panel contents, route state, chat logs, market tape, or chain cursors until those are explicit fields or child rows.

  Entity BlockheadRoom :: id ; id! p:str, createdAt! p:num, createdBy! p:str, name? p:str, $$peers+ $:BlockheadRoomPeer
    Sources :: Local_Internal
    View :: BlockheadRoomView top `<dl>` shows name or id, created time, creator, and peer count. Details tabs: Peers -> BlockheadRoomPeer list; Shared addresses -> BlockheadSharedAddress list when linked; Transfer requests -> BlockheadTransferRequest list when linked.
    Notes :: Local realtime collaboration room. Room id/name/createdBy are product-local workspace/session facts, not XMPP room identity, IPFS/DAG content, durable protocol membership, or chain account custody.

  Entity BlockheadRoomPeer :: id ; id! p:str, $room! $:BlockheadRoom, peerId! p:str, displayName? p:str, joinedAt! p:num, lastSeenAt? p:num, connectedAt? p:num, disconnectedAt? p:num, isConnected! p:bool
    Sources :: Local_Internal
    View :: BlockheadRoomPeerView top `<dl>` shows display name, peer id, room, connected flag, joined/last seen/connected/disconnected timestamps. Details tabs: Room -> BlockheadRoomView; Shared addresses -> BlockheadSharedAddress list scoped to peer; Transfer requests -> peer-scoped BlockheadTransferRequest list when linked.
    Notes :: Local collaboration endpoint membership. isConnected and connection timestamps reflect local signaling/WebRTC/libp2p reachability, not chain account custody, Farcaster/XMTP identity, or authorization proof.

  Entity BlockheadSession :: id ; id! p:str, name? p:str, status! p:enum, createdAt! p:num, updatedAt! p:num, lockedAt? p:num, $latestSimulation? $:BlockheadSessionSimulation, simulationCount? p:num, $$actions+ $:BlockheadSessionAction
    Sources :: Local_Internal
    View :: BlockheadSessionView top `<dl>` shows id/name, status, created/updated/locked timestamps, simulation count, and latest simulation when linked. Details tabs: Actions -> ordered BlockheadSessionAction list; Simulations -> BlockheadSessionSimulation list; Intents -> typed swap/bridge/transfer intent rows.
    Notes :: Local sandbox/action notebook state, not canonical chain history or protocol session identity. Action ordering is product-local and should not be conflated with transaction order or bridge lifecycle order.

  Entity BlockheadSessionAction :: sessionId+actionId ; sessionId! p:str, actionId! p:str, $session! $:BlockheadSession, indexInSequence! p:num, actionType! p:enum, actionParams? p:json, createdAt! p:num, updatedAt! p:num
    Sources :: Local_Internal
    View :: BlockheadSessionActionView top `<dl>` shows session, action id, sequence index, action type, created/updated timestamps, and action params summary. Details tabs: Intent -> BlockheadSwapIntent, BlockheadBridgeIntent, or BlockheadTransferIntent when typed; Params -> raw local action params; Session -> BlockheadSessionView.
    Notes :: Local ordered action row. Quotes, routes, payloads, submissions, simulations, and outcomes require separate rows because the same user intent can produce multiple source-specific execution candidates.

  Entity BlockheadSessionSimulation :: id ; id! p:str, $session! $:BlockheadSession, status! p:enum, createdAt! p:num, paramsHash! p:str, result! p:unknown|null, error? p:str
    Sources :: Local_Internal
    View :: BlockheadSessionSimulationView top `<dl>` shows session, status, created time, params hash, result preview, and error. Details tabs: Session -> BlockheadSessionView; Inputs -> params hash/source action context; Result -> opaque local simulation output.
    Notes :: Local simulation artifact. It is not a canonical chain receipt, state root, successful transaction execution, or public proof unless linked to separate transaction/proof entities.

  Entity BlockheadSharedAddress :: id ; id! p:str, $network! $:EvmNetwork, $room! $:BlockheadRoom, peerId! p:str, $account! $:EvmAccount, targetPeerIds! p:str[]|null, sharedAt! p:num
    Sources :: Local_Internal
    View :: BlockheadSharedAddressView top `<dl>` shows room, peer id, network, account, target peer ids, and shared time. Details tabs: Room -> BlockheadRoomView; Account -> EvmAccountView/EvmNetworkAccountView; Authentication -> BlockheadSiweChallenge rows when linked.
    Notes :: Local routing/share claim for a room and peer set, not proof that the peer controls the EVM account, an address-book canonical identity, or on-chain account metadata.

  Entity BlockheadSiweChallenge :: id ; id! p:str, $network! $:EvmNetwork, $room! $:BlockheadRoom, fromPeerId! p:str, toPeerId! p:str, $signer! $:EvmAccount, message! p:str, nonce! p:str, issuedAt! p:num, expiresAt! p:num, signature? p:hex, verified! p:bool
    Sources :: Local_Internal
    View :: BlockheadSiweChallengeView top `<dl>` shows network, room, requester/responder peers, signer account, nonce, issued/expires times, signature presence, and verified state. Details tabs: Message -> SIWE message; Signer -> EvmAccountView; Room -> BlockheadRoomView.
    Notes :: Local authentication challenge row. `verified` is a stored local result for this challenge, not a durable VerificationResult row, Farcaster identity, wallet connection scope, account ownership beyond the challenge, or public chain state.

  Entity BlockheadSocialPostSession :: id ; id! p:str, name? p:str, status! p:enum, protocol! p:enum, authorId! p:num, createdAt! p:num, updatedAt! p:num, lockedAt? p:num
    Sources :: Local_Internal
    View :: BlockheadSocialPostSessionView top `<dl>` shows name, status, protocol, author id, created/updated/locked timestamps. Details tabs: Draft -> draft text and attachments when modeled; Publication -> submitted cast/message ids and outcomes when linked; Author -> local connected-account state.
    Notes :: Local composer-session row. `Submitted` and `Finalized` are local workflow states unless linked to a sourced social post or explicit local publication receipt.

  Entity BlockheadSource :: id ; id! p:str
    Sources :: Local_Internal
    View :: BlockheadSourceView top `<dl>` shows resolver source id. Details tabs: Transport -> base URL/protocol/auth when modeled; Health -> status observations when modeled; Capability -> provider capability metadata when modeled.
    Notes :: Implemented app-local/manage-page stub, distinct from the Source enum/provider catalog. Do not imply credentials, endpoint configuration, CORS policy, wallet injection state, source health, or provider capability metadata from this row.

  Entity BlockheadStellarWalletState :: walletId+network ; walletId! p:str, $wallet? $:BlockheadWallet, $network! $:StellarNetwork, walletApiKind? p:enum, selectedAccount? p:str, publicKey? p:str, networkPassphrase? p:str, scopes* p:enum, lastSignedTransactionHash? p:hex, lastPermissionAt? p:num, lastSyncedAt? p:num, $$accounts* $:BlockheadWalletAccount, $$ledgerAccounts* $:StellarAccount
    Sources :: Local_Internal, Freighter_WalletApi, WalletConnect_SignClient
    View :: BlockheadStellarWalletStateView top `<dl>` shows wallet id, network, wallet API kind, selected account, public key, network passphrase, scope count, last signed transaction hash, last permission time, and last synced time. Details tabs: Wallet accounts -> BlockheadWalletAccount list; Ledger accounts -> StellarAccount list for exposed accounts; Permissions -> Freighter/WalletConnect scopes; Signing state -> last signed transaction and public-key exposure; Network -> StellarNetworkView.
    Notes :: Blockhead-local Stellar wallet/session state from Freighter or WalletConnect-style providers. Public Horizon/RPC/indexer sources can resolve exposed accounts, but selected account, permissions, network selection, signing authority, and wallet-returned public keys are local session state and must stay Blockhead-prefixed.

  Entity BlockheadSwapIntent :: sessionId+actionId ; sessionId! p:str, actionId! p:str, $sessionAction! $:BlockheadSessionAction, chainId? p:num, tokenInAddress? p:evmAddress, tokenOutAddress? p:evmAddress, $network? $:EvmNetwork, $tokenIn? $:EvmCoinInstance, $tokenOut? $:EvmCoinInstance, amount? p:bigint, slippage? p:num
    Sources :: Local_Internal
    View :: BlockheadSwapIntentView top `<dl>` shows session action, chain id, raw token addresses, resolved network/token refs when present, amount, and slippage. Details tabs: Session action -> BlockheadSessionActionView; Quote candidates -> SwapQuote list when modeled; Execution -> payload, simulation, submission, and outcome rows when linked.
    Notes :: Local user intent, not a market quote, AMM pool state, approval, executable calldata, or transaction. Use SwapQuote/route/payload/submission rows for later workflow stages. Do not infer EvmCoinInstance refs from zero-address/default params.

  Entity BlockheadTezosWalletState :: walletId+network ; walletId! p:str, $wallet? $:BlockheadWallet, $network! $:TezosNetwork, walletApiKind? p:enum, peerId? p:str, selectedAddress? p:str, publicKey? p:hex, scopes* p:enum, networkType? p:enum, lastPermissionAt? p:num, lastSyncedAt? p:num, $$accounts* $:BlockheadWalletAccount, $$ledgerAccounts* $:TezosAccount
    Sources :: Local_Internal, Beacon_Sdk, WalletConnect_SignClient
    View :: BlockheadTezosWalletStateView top `<dl>` shows wallet id, network, wallet API kind, peer id, selected address, public key, scope count, network type, last permission time, and last synced time. Details tabs: Wallet accounts -> BlockheadWalletAccount list; Ledger accounts -> TezosAccount list for exposed addresses; Permissions -> Beacon/WalletConnect scopes and network; Signing authority -> public key and selected account context; Network -> TezosNetworkView.
    Notes :: Blockhead-local Tezos wallet/session state from Beacon or WalletConnect-style providers. Public Tezos RPC/indexers can resolve exposed addresses as TezosAccount rows, but selected account, peer metadata, permission scopes, public-key exposure through the wallet, and signing authority are local wallet state and must stay Blockhead-prefixed.

  Entity BlockheadTransferIntent :: sessionId+actionId ; sessionId! p:str, actionId! p:str, $sessionAction! $:BlockheadSessionAction, fromAddress? p:evmAddress, toAddress? p:evmAddress, chainId? p:num, tokenAddress? p:evmAddress, $from? $:EvmAccount, $to? $:EvmAccount, $network? $:EvmNetwork, amount? p:bigint
    Sources :: Local_Internal
    View :: BlockheadTransferIntentView top `<dl>` shows session action, raw from/to addresses, chain id, token address, resolved account/network refs when present, and amount. Details tabs: Session action -> BlockheadSessionActionView; Readiness -> balance/allowance checks when modeled; Execution -> authorization, payload, simulation, submission, and outcome rows when linked.
    Notes :: Local transfer intent, not proof that the sender controls funds or that a token transfer occurred. Balance/readiness, authorization, transaction submission, and receipt state must remain separate sourceable rows. Do not infer sender authority from an EvmAccount address or local wallet exposure.

  Entity BlockheadTransferRequest :: id+$network ; id! p:str, $network! $:EvmNetwork, $room! $:BlockheadRoom, $from! $:EvmAccount, $to! $:EvmAccount, allocations! p:{destination:evmAddress,token:evmAddress,amount:bigint}[], status! p:enum, createdAt! p:num, expiresAt! p:num
    Sources :: Local_Internal
    View :: BlockheadTransferRequestView top `<dl>` shows network, room, from/to accounts, allocation count, status, created time, and expiry. Details tabs: Allocations -> destination/token/amount table; Room -> BlockheadRoomView; Execution -> authorization/submission/outcome rows when linked.
    Notes :: Local request/intent row, not a token transfer, bridge route, channel state, wallet authorization, submitted transaction, destination receipt, or settlement proof. Allocation token addresses are request payload fields; resolve token/account refs only when a future source can prove the selected deployment and sender authority.

  Entity BlockheadWallet :: id ; id! p:str, name! p:str, icon! p:str, protocol! p:enum, discoveryKind! p:enum, transportKind! p:enum, rdns? p:str, websiteUrl? p:str, capabilities! p:enum[]
    Sources :: Local_Internal
    View :: BlockheadWalletView top `<dl>` shows id, name, icon, protocol, discovery kind, transport kind, rdns, website URL, and capabilities. Details tabs: Connections -> BlockheadWalletConnection list; Accounts -> BlockheadWalletAccount list exposed through connections; Discovery -> local/self-attested discovery metadata.
    Notes :: Local wallet candidate metadata. rdns/name/icon can originate from injected discovery and are self-attested display metadata, not verified wallet identity, current availability, authorization, or feature proof.

  Entity BlockheadWalletAccount :: caip10 ; caip10! p:{namespace:str,reference:str,accountAddress:str}, $network? $:Network, address! p:str, label? p:str, capabilities! p:enum[]
    Sources :: Local_Internal
    View :: BlockheadWalletAccountView top `<dl>` shows CAIP-10 namespace/reference/address, display address, optional label, network when resolved, and capabilities. Details tabs: Network -> NetworkView; Account -> AccountView/native account view when linked; Connections -> BlockheadWalletConnection list that exposed the account.
    Notes :: Local wallet-exposed account identifier and capability surface. It is not proof of key control beyond the wallet connection/session that supplied it, not a canonical on-chain account profile, and not a substitute for chain-native account rows. If normalized Account linkage is added later, implement it as a real schema field/resolver instead of implying it from CAIP-10 alone.

  Entity BlockheadWalletConnection :: $wallet ; $wallet! $:BlockheadWallet, status! p:enum, protocol! p:enum, transportKind! p:enum, scopes! p:{namespace:str,reference:str,methods:str[],events:str[]}[], $$connectedAccounts+ $:BlockheadWalletAccount, $activeAccount? $:BlockheadWalletAccount, selected! p:bool, connectedAt! p:num, disconnectedAt? p:num, sessionId? p:str, sessionTopic? p:str, error? p:str
    Sources :: Local_Internal
    View :: BlockheadWalletConnectionView top `<dl>` shows wallet id, status, protocol, transport, active account, selected flag, connected/disconnected timestamps, session id/topic, and error. Details tabs: Accounts -> BlockheadWalletAccount list; Scopes -> namespace/reference methods/events; Actions -> runtime disconnect/remove when available.
    Notes :: Local per-wallet connection/session state. scopes are authorization/session namespace rows, not chain identity; live provider objects, permission prompts, and disconnect handles stay in browser runtime.

  Entity BlockheadXrplWalletState :: walletId+network ; walletId! p:str, $wallet? $:BlockheadWallet, $network! $:XrplNetwork, walletApiKind? p:enum, selectedAccount? p:str, userToken? p:str, networkType? p:enum, scopes* p:enum, lastPayloadId? p:str, lastPermissionAt? p:num, lastSyncedAt? p:num, $$accounts* $:BlockheadWalletAccount, $$ledgerAccounts* $:XrplAccount
    Sources :: Local_Internal, Xaman_Api, WalletConnect_SignClient
    View :: BlockheadXrplWalletStateView top `<dl>` shows wallet id, network, wallet API kind, selected account, network type, scope count, last payload id, last permission time, and last synced time. Details tabs: Wallet accounts -> BlockheadWalletAccount list; Ledger accounts -> XrplAccount list for exposed accounts; Payloads -> recent signing/payload ids when modeled; Permissions -> Xaman/WalletConnect scopes; Network -> XrplNetworkView.
    Notes :: Blockhead-local XRPL wallet/session state from Xaman or WalletConnect-style providers. Public rippled/Clio/indexer sources can resolve exposed accounts, but selected account, user token, payload ids, scopes, and signing authority are local wallet state and must stay Blockhead-prefixed.

  Entity BlockheadZcashNoteState :: walletId+pool+noteCommitment ; walletId! p:str, $wallet? $:BlockheadWallet, $pool! $:ZcashShieldedPool, $shieldedAction? $:ZcashShieldedAction, pool! p:enum, noteCommitment! p:str, nullifier? p:str, valueZatoshis? p:bigint, memo? p:str, diversifier? p:str, recipientAddress? p:str, spent! p:bool, spendTransactionId? p:str, receivedTransactionId? p:str, receivedAtHeight? p:bigint, spentAtHeight? p:bigint, lastScannedAt? p:num
    Sources :: Local_Internal
    View :: BlockheadZcashNoteStateView top `<dl>` shows wallet id, pool, note commitment, value, spent state, nullifier, received/spent transaction ids, received/spent heights, and last scanned time. Details tabs: Pool/action -> ZcashShieldedPoolView and ZcashShieldedActionView when linked; Memo/address -> redacted memo, diversifier, recipient address; Lifecycle -> received/spent status and nullifier; Wallet -> BlockheadZcashWalletStateView.
    Notes :: Blockhead-local shielded note state discovered by a connected Zcash wallet, light client, or imported viewing key. Public Zcashd/Zebra data exposes nullifiers, note commitments, and value commitments, but only local keys can identify owned notes, values, memos, recipient addresses, and spend linkage.

  Entity BlockheadZcashViewingKey :: walletId+keyFingerprint ; walletId! p:str, $wallet? $:BlockheadWallet, $network! $:Network, keyFingerprint! p:str, keyKind! p:enum, pools+ p:enum, accountIndex? p:num, birthdayHeight? p:bigint, canViewIncoming! p:bool, canViewOutgoing! p:bool, canSpend! p:bool, importedAt! p:num, lastScannedHeight? p:bigint, viewingKeyMaterial? p:str
    Sources :: Local_Internal
    View :: BlockheadZcashViewingKeyView top `<dl>` shows wallet id, network, key fingerprint, key kind, pools, account index, birthday height, incoming/outgoing/spend capability flags, imported time, and last scanned height. Details tabs: Wallet -> BlockheadZcashWalletStateView; Scanning -> birthday and last scanned height; Capabilities -> incoming/outgoing/spend booleans by pool; Key material -> redacted unified/Sapling/Orchard viewing or spending key string with local reveal controls.
    Notes :: Local key material row for unified, Sapling, Orchard, or transparent-capable viewing/spending keys. It is deliberately Blockhead-prefixed because viewing keys are not consensus data. Store fingerprints for selectors and keep raw key material redacted/local-only.

  Entity BlockheadZcashWalletState :: walletId ; walletId! p:str, $wallet? $:BlockheadWallet, $network! $:Network, accountIndex? p:num, unifiedAddress? p:str, transparentAddress? p:str, saplingAddress? p:str, orchardAddress? p:str, balanceZatoshis? p:bigint, verifiedBalanceZatoshis? p:bigint, spendableBalanceZatoshis? p:bigint, lastScannedHeight? p:bigint, birthdayHeight? p:bigint, recoveryState? p:enum, $$viewingKeys* $:BlockheadZcashViewingKey, $$notes* $:BlockheadZcashNoteState
    Sources :: Local_Internal
    View :: BlockheadZcashWalletStateView top `<dl>` shows wallet id, network, account index, unified address, transparent/Sapling/Orchard address availability, balances, birthday height, last scanned height, and recovery state. Details tabs: Viewing keys -> BlockheadZcashViewingKey list; Notes -> BlockheadZcashNoteState list; Pools -> ZcashShieldedPool summaries; Transparent state -> linked UtxoAddress/UtxoTransaction rows when resolved; Recovery -> local scan/recovery status.
    Notes :: Blockhead-local Zcash wallet/light-client state. Public chain rows can show transparent UTXO data and shielded action commitments/nullifiers, but wallet-local scanning and viewing keys are required for balances, owned notes, memos, recipient addresses, and spendability.

  Entity BlockheadZeroGStorageNodeState :: connectionId+network+nodeId ; connectionId! p:str, $network! $:ZeroGNetwork, nodeId! p:evmAddress, endpoint? p:url, syncedAt? p:num, localFileCount? p:num, localChunkCount? p:num, localProofCount? p:num, storagePath? p:str, $$localChunks* $:BlockheadZeroGStoredChunk, $$localProofs* $:BlockheadZeroGStorageProof
    Sources :: Local_Internal, ZeroGStorageNode_JsonRpc
    View :: BlockheadZeroGStorageNodeStateView top `<dl>` shows connection id, network, node id, endpoint, synced time, local file count, local chunk count, local proof count, and storage path. Details tabs: Local chunks -> BlockheadZeroGStoredChunk list; Local proofs -> BlockheadZeroGStorageProof list; Public node -> ZeroGStorageNodeView when node id maps to a public row.
    Notes :: Connected storage-node state. It is prefixed because local file inventory, storage path, private endpoint configuration, and raw proof availability are not public consensus or explorer facts.

  Entity BlockheadZeroGStorageProof :: $nodeState+proofId ; $nodeState! $:BlockheadZeroGStorageNodeState, proofId! p:str, $dataBlob? $:ZeroGDataBlob, $chunk? $:BlockheadZeroGStoredChunk, proofKind? p:str, proofBytes? p:str, verified! p:bool, verifiedAt? p:num, verifiedAtBlock? p:bigint, error? p:str
    Sources :: Local_Internal, ZeroGStorageNode_JsonRpc
    View :: BlockheadZeroGStorageProofView top `<dl>` shows node state, proof id, proof kind, data blob, chunk, verified flag, verified time, verified block, and error. Details tabs: Proof material -> redacted proof bytes/status; Data blob -> ZeroGDataBlobView; Local chunk -> BlockheadZeroGStoredChunkView; Public commitment -> ZeroGStorageProofView when a public proof row exists.
    Notes :: Local proof material or verification result returned by a configured 0G storage node. Raw proof bytes and node-local verification status belong here, while public commitments or explorer-visible proof summaries stay on ZeroGStorageProof.

  Entity BlockheadZeroGStoredChunk :: $nodeState+dataRoot+chunkIndex ; $nodeState! $:BlockheadZeroGStorageNodeState, dataRoot! p:str, chunkIndex! p:num, $dataBlob? $:ZeroGDataBlob, $publicChunk? $:ZeroGDataChunk, chunkRoot? p:str, sizeBytes? p:num, filePath? p:str, present! p:bool, lastCheckedAt? p:num
    Sources :: Local_Internal, ZeroGStorageNode_JsonRpc
    View :: BlockheadZeroGStoredChunkView top `<dl>` shows node state, data root, chunk index, chunk root, size, file path, present flag, and last checked time. Details tabs: Data blob -> ZeroGDataBlobView; Public chunk -> ZeroGDataChunkView; Proofs -> BlockheadZeroGStorageProof list.
    Notes :: Local chunk availability for a connected 0G storage node. Public scan rows can say a blob or aggregate chunk exists, but local file paths and present/missing state are connected-node state and must remain Blockhead-prefixed.

  Entity BnbBeaconBlock :: $network+height | $network+hash ; $network! $:BnbBeaconNetwork, height? p:bigint, hash? p:hex, timestampMs? p:num, proposerAddress? p:str, appHash? p:hex, dataHash? p:hex, validatorsHash? p:hex, nextValidatorsHash? p:hex, consensusHash? p:hex, evidenceHash? p:hex, transactionCount? p:num, $$transactions* $:BnbBeaconTransaction
    Sources :: BinanceChainApi_Rest, BinanceChainExplorer_Rest, BnbBeaconArchive_Rest
    View :: BnbBeaconBlockView top `<dl>` shows height, hash, timestamp, proposer, transaction count, app hash, and validators hash. Tabs: transactions, header hashes, validator/proposer context, archive source evidence.
    Notes :: Height is the practical archive selector, with hash kept as an alternate selector when archive payloads expose it.

  Entity BnbBeaconNetwork :: $network ; $network! $:Network, decommissionedAtMs? p:num, fusionDeadlineMs? p:num, $$blocks* $:BnbBeaconBlock, $$transactions* $:BnbBeaconTransaction, $$validators* $:BnbValidator, $$tokens* $:BnbBeaconToken, $$migrationRecords* $:BnbBeaconTokenMigration, $$timestamps* $:BnbBeaconNetwork_Timestamp
    Sources :: BinanceChainApi_Rest, BinanceChainExplorer_Rest, BnbBeaconArchive_Rest, BnbChainFusion_Rest
    View :: BnbBeaconNetworkView top `<dl>` shows linked base Network, decommissioned time, fusion deadline, latest archived height, archive coverage status, validator count, and token count. Tabs: archived blocks, archived transactions, validators, BEP tokens, token migrations, archive timestamp history.
    Notes :: BNB Beacon Chain is historical/decommissioned relative to BNB Smart Chain. Keep it as its own network profile only for archived native Beacon Chain blocks, transactions, validators, and BEP asset records.

  Entity BnbBeaconNetwork_Timestamp :: $network+timestampMs+source ; $network! $:BnbBeaconNetwork, timestampMs! p:num, source! p:str, latestArchivedHeight? p:bigint, latestArchivedBlockTimeMs? p:num, validatorCount? p:num, tokenCount? p:num, migrationRecordCount? p:num, archiveCoverageStatus? p:enum
    Sources :: BinanceChainApi_Rest, BinanceChainExplorer_Rest, BnbBeaconArchive_Rest, BnbChainFusion_Rest
    View :: BnbBeaconNetwork_TimestampView top `<dl>` shows observed time/source, latest archived height/time, validator count, token count, migration record count, and archive coverage status. Details show archive freshness and coverage notes.
    Notes :: Because this chain is archival, source freshness and archive coverage matter as much as head height.

  Entity BnbBeaconToken :: $network+symbol ; $network! $:BnbBeaconNetwork, symbol! p:str, originalSymbol? p:str, tokenName? p:str, ownerAddress? p:str, totalSupply? p:bigint, mintable? p:bool, tokenType? p:enum, contractAddress? p:evmAddress, $$transfers* $:BnbBeaconTokenTransfer, $$migrations* $:BnbBeaconTokenMigration
    Sources :: BinanceChainApi_Rest, BinanceChainExplorer_Rest, BnbBeaconArchive_Rest, BnbChainFusion_Rest
    View :: BnbBeaconTokenView top `<dl>` shows symbol, original symbol, name, owner, token type, total supply, mintable flag, and mapped contract address. Tabs: transfers, mint/burn/freeze effects, migration records, archive source evidence.
    Notes :: BEP2/BEP8 symbols are Beacon Chain token identity. Mapping to BNB Smart Chain contracts is a migration/fusion relation, not token identity replacement.

  Entity BnbBeaconTokenMigration :: $token+targetNetwork+targetAddress ; $token! $:BnbBeaconToken, $targetNetwork! $:Network, targetAddress! p:str, migrationKind! p:enum, status? p:enum, sourceAddress? p:str, targetContractAddress? p:evmAddress, amount? p:bigint, eventTxHash? p:hex, observedAtMs? p:num
    Sources :: BnbChainFusion_Rest, BinanceChainExplorer_Rest, BnbBeaconArchive_Rest, Blockscout_Rest
    View :: BnbBeaconTokenMigrationView top `<dl>` shows token, target network, target address/contract, migration kind, status, amount, and observed time. Tabs: source archive transaction, target-chain evidence, mapping metadata.
    Notes :: Fusion/migration records are bridge-like archive relations between Beacon token identity and target-chain assets. They are not a replacement for Beacon token rows.

  Entity BnbBeaconTokenTransfer :: $transaction+transferIndex ; $transaction! $:BnbBeaconTransaction, transferIndex! p:num, symbol! p:str, fromAddress? p:str, toAddress? p:str, amount! p:bigint, $token? $:BnbBeaconToken
    Sources :: BinanceChainApi_Rest, BinanceChainExplorer_Rest, BnbBeaconArchive_Rest
    View :: BnbBeaconTokenTransferView top `<dl>` shows transaction, transfer index, token symbol, from, to, and amount. Details show archive payload.
    Notes :: Transfer rows capture transaction effects. They should not be confused with current token balances because this is archive data.

  Entity BnbBeaconTransaction :: $network+txHash ; $network! $:BnbBeaconNetwork, txHash! p:hex, txType? p:enum, memo? p:str, sourceAddress? p:str, destinationAddress? p:str, amount? p:bigint, feeAmount? p:bigint, tokenSymbol? p:str, orderId? p:str, sequence? p:bigint, code? p:num, log? p:str, $block? $:BnbBeaconBlock, $$tokenEffects* $:BnbBeaconTokenTransfer
    Sources :: BinanceChainApi_Rest, BinanceChainExplorer_Rest, BnbBeaconArchive_Rest
    View :: BnbBeaconTransactionView top `<dl>` shows tx hash, type, block, source, destination, token symbol, amount, fee, code, and memo. Tabs: token effects, order/trade fields when present, raw archive payload, migration linkage.
    Notes :: Beacon transactions are not EVM transactions. Keep native transaction type and memo fields instead of mapping them to EVM call/log abstractions.

  Entity BnbValidator :: $network+operatorAddress ; $network! $:BnbBeaconNetwork, operatorAddress! p:str, consensusAddress? p:str, moniker? p:str, $$timestamps* $:BnbValidator_Timestamp
    Sources :: BinanceChainApi_Rest, BinanceChainExplorer_Rest, BnbBeaconArchive_Rest
    View :: BnbValidatorView top `<dl>` shows operator address, consensus address, moniker, latest voting power, status, jailed flag, and produced block count. Tabs: voting-power history, proposed blocks, archive evidence.
    Notes :: Validator mutable state is archive-time dependent; keep voting power and jailed/status observations on timestamp rows.

  Entity BnbValidator_Timestamp :: $validator+timestampMs+source ; $validator! $:BnbValidator, timestampMs! p:num, source! p:str, votingPower? p:bigint, stakeAmount? p:bigint, status? p:enum, jailed? p:bool
    Sources :: BinanceChainApi_Rest, BinanceChainExplorer_Rest, BnbBeaconArchive_Rest
    View :: BnbValidator_TimestampView top `<dl>` shows validator, observed time/source, voting power, stake, status, and jailed flag. Details show archive evidence.
    Notes :: Validator power/status are historical observations and should not be flattened onto BnbValidator.

  Entity BridgeRoute :: fromChainId+toChainId+fromToken+toToken+fromAmount+fromAddress+slippage+toAddress ; fromChainId! p:num, toChainId! p:num, fromToken! p:str, toToken! p:str, fromAmount! p:bigint, fromAddress! p:evmAddress, slippage! p:num, toAddress! p:evmAddress, $fromNetwork! $:EvmNetwork, $toNetwork! $:EvmNetwork, toAmount! p:bigint, toAmountMin! p:bigint, estimatedCostUsd! p:num, estimatedDurationSeconds! p:num, tags! p:enum[], $$steps+ $:BridgeRouteStep
    Sources :: Lifi_Rest
    View :: BridgeRouteView title/value shows LI.FI quote and from-chain -> to-chain ids; top `<dl>` shows from/to EvmNetworkView refs and, when expanded, token addresses, from account, slippage, request amount, resolved from/to amounts, minimum received, estimated cost, and ETA. Expanded content mounts BridgeRouteStepsView for $$steps.
    Notes :: Live executable quote request keyed by selector inputs, not a persisted bridge transaction, protocol deployment, settlement lifecycle, destination receipt, refund, or bridge health row. `tags` stays quote-local; BEST/CHEAPEST/FASTEST comparison labels require a source that returns multiple alternatives for the same request.

  Entity BridgeRouteStep :: $route+index ; $route! $:BridgeRoute, index! p:num, stepType? p:str, tool? p:str, $fromNetwork? $:EvmNetwork, $toNetwork? $:EvmNetwork, $fromToken? $:EvmCoinInstance, $toToken? $:EvmCoinInstance, railId? p:enum, settlementModel? p:enum, verificationModel? p:enum, assetOutcome? p:enum
    Sources :: Lifi_Rest
    View :: BridgeRouteStepView title/value shows step index or tool label; top `<dl>` shows step type, tool, from/to EvmNetworkView refs, and, when expanded, rail, settlement model, verification model, asset outcome, and optional from/to EvmCoinInstanceView refs. BridgeRouteStepsView lists steps under BridgeRouteView.
    Notes :: Ordered quote leg from the provider's step/includedSteps payload. `tool` is a LI.FI tool key or toolDetails key; network/token refs exist only when action chain ids and token addresses map cleanly. railId, settlementModel, verificationModel, and assetOutcome are catalog classifications by tool key, not proof that a submitted transaction settled through that mechanism.

  Entity BridgeTransaction :: $account+$sourceTx+createdAt ; $account! $:EvmAccount, $sourceTx! $:EvmTransaction, createdAt! p:num
    Sources :: Local_Internal
    View :: BridgeTransactionView title/value shows source transaction hash; top `<dl>` shows origin EvmNetworkView, origin EvmTransactionView, recorded timestamp, and, when expanded, initiator EvmNetworkAccountView. BridgeTransactionsView lists product-local bridge transaction records.
    Notes :: Product-local record for an account plus origin-chain EVM transaction observed during a bridge flow. It is not a canonical bridge transfer, destination transaction, finality proof, refund, or settlement outcome; those need separate sourceable lifecycle rows before appearing in this schema.

  Entity CardanoAddress :: $network+address ; $network! $:CardanoNetwork, address! p:str, addressKind? p:enum, paymentCredential? p:str, stakeCredential? p:str, $stakeCredential? $:CardanoStakeCredential, $$utxos* $:CardanoTxOutput, $$timestamps* $:CardanoAddress_Timestamp
    Sources :: Blockfrost_Rest, Koios_Rest, CardanoDbSync_Postgres, Ogmios_JsonRpc
    View :: CardanoAddressView top `<dl>` shows address, address kind, payment credential, stake credential, stake credential ref, latest lovelace/asset/UTXO snapshot, and timestamp count. Details tabs: UTXOs -> CardanoTxOutputsView; Snapshots -> CardanoAddress_TimestampsView; Transactions -> CardanoTransactionsView when indexed; Stake credential -> CardanoStakeCredentialView.
    Notes :: Payment and stake credentials are derivable from address bytes. Use credentials for grouping/staking relationships, but keep address as the selector. Address balances and UTXO counts are node/indexer observations and belong on CardanoAddress_Timestamp or UTXO list rows, not address identity.

  Entity CardanoAddress_Timestamp :: $address+timestampMs+source ; $address! $:CardanoAddress, timestampMs! p:num, source! p:str, blockSlot? p:bigint, blockHash? p:hex, lovelaceBalance? p:bigint, nativeAssetCount? p:num, utxoCount? p:num, transactionCount? p:num
    Sources :: Blockfrost_Rest, Koios_Rest, CardanoDbSync_Postgres, Ogmios_JsonRpc
    View :: CardanoAddress_TimestampView top `<dl>` shows address, observation time, source, block slot/hash, lovelace balance, native asset count, UTXO count, and transaction count. Details tabs: Address -> CardanoAddressView; UTXO set -> CardanoTxOutputsView for the same observation when sourceable; Transactions -> CardanoTransactionsView; Source evidence -> indexer/node query context.
    Notes :: Address-level balance/count projection over the eUTXO set. It is source/head dependent; do not use it as wallet ownership proof or replace explicit CardanoTxOutput rows.

  Entity CardanoBlock :: $network+slot | $network+hash ; $network! $:CardanoNetwork, slot? p:bigint, hash? p:hex, blockNo? p:bigint, epoch? p:num, era? p:enum, issuerVkey? p:hex, $$transactions* $:CardanoTransaction
    Sources :: CardanoNode_LocalStateQuery, Ogmios_JsonRpc, CardanoDbSync_Postgres, Blockfrost_Rest, Koios_Rest, Cardanoscan_Rest
    View :: CardanoBlockView top `<dl>` shows slot, block number, hash, epoch, era, and issuer VRF/key. Details tabs: Transactions -> CardanoTransactionsView; Navigation -> previous/next block links when sourceable.
    Notes :: Slot is a stable chain coordinate, while block number can be absent for some historical/source views. Keep both slot and hash selectors.

  Entity CardanoNativeAsset :: $network+policyId+assetName ; $network! $:CardanoNetwork, policyId! p:hex, assetName! p:hex, fingerprint? p:str, $$timestamps* $:CardanoNativeAsset_Timestamp
    Sources :: Blockfrost_Rest, Koios_Rest, CardanoDbSync_Postgres, Cardanoscan_Rest
    View :: CardanoNativeAssetView top `<dl>` shows policy id, asset name, fingerprint, latest supply/holder snapshot, and metadata summary. Details tabs: Snapshots -> CardanoNativeAsset_TimestampsView; UTXOs -> CardanoTxOutputsView containing the asset; Metadata -> CIP-25/CIP-68/source metadata.
    Notes :: Cardano asset identity is policy id plus asset name. Fingerprint is a display/interoperability identifier, not the canonical selector.

  Entity CardanoNativeAsset_Timestamp :: $asset+timestampMs+source ; $asset! $:CardanoNativeAsset, timestampMs! p:num, source! p:str, supply? p:bigint, transactionCount? p:num, metadata? p:json, holderCount? p:num
    Sources :: Blockfrost_Rest, Koios_Rest, CardanoDbSync_Postgres, Cardanoscan_Rest
    View :: CardanoNativeAsset_TimestampView top `<dl>` shows asset, observation time, source, supply, transaction count, holder count, and metadata snapshot hash/summary. Details tabs: Asset -> CardanoNativeAssetView; Metadata -> CIP-25/CIP-68/source payload; Source evidence -> Blockfrost/Koios/db-sync query context.
    Notes :: Cardano native asset supply changes through mint/burn under the policy, and metadata can be CIP-25/CIP-68/source-dependent. Keep supply, holders, transaction count, and metadata snapshots here instead of mutating CardanoNativeAsset identity or using a generic AssetInstance_Timestamp row.

  Entity CardanoNetwork :: $network ; $network! $:Network, era? p:enum, $$blocks* $:CardanoBlock, $$transactions* $:CardanoTransaction, $$addresses* $:CardanoAddress, $$stakeCredentials* $:CardanoStakeCredential, $$stakePools* $:CardanoStakePool, $$assets* $:CardanoNativeAsset, $$protocolParameterEpochs* $:CardanoProtocolParameters_Epoch, $$timestamps* $:CardanoNetwork_Timestamp
    Sources :: CardanoNode_LocalStateQuery, Ogmios_JsonRpc, CardanoDbSync_Postgres, Blockfrost_Rest, Koios_Rest, Cardanoscan_Rest, Constants_Internal
    View :: CardanoNetworkView top `<dl>` shows linked Network, current era, latest slot/block/epoch snapshot, sync progress, and native ADA asset. Details use `CollapsibleTabs`: Blocks -> CardanoBlocksView; Transactions -> CardanoTransactionsView; Addresses -> CardanoAddressesView; Stake credentials -> CardanoStakeCredentialsView; Stake pools -> CardanoStakePoolsView; Native assets -> CardanoNativeAssetsView; Protocol parameters -> CardanoProtocolParameters_EpochsView; Network snapshots -> CardanoNetwork_TimestampsView.
    Notes :: Cardano is extended-UTXO with epochs, slots, stake pools, native assets, and Plutus script witnesses. Do not reuse Bitcoin UTXO rows for Cardano tx inputs/outputs because Cardano outputs carry multi-assets, datum/script refs, and stake credentials.

  Entity CardanoNetwork_Timestamp :: $network+timestampMs+source ; $network! $:CardanoNetwork, timestampMs! p:num, source! p:str, latestSlot? p:bigint, latestBlockNo? p:bigint, epoch? p:num, syncProgress? p:num
    Sources :: CardanoNode_LocalStateQuery, Ogmios_JsonRpc, Blockfrost_Rest, Koios_Rest
    View :: CardanoNetwork_TimestampView top `<dl>` shows latest slot, block number, epoch, sync progress, source, and observation time; CardanoNetworkView shows latest/history.
    Notes :: Tip and sync progress are endpoint observations and can differ between node/indexer sources.

  Entity CardanoProtocolParameters_Epoch :: $network+epoch+source ; $network! $:CardanoNetwork, epoch! p:num, source! p:str, minFeeA? p:bigint, minFeeB? p:bigint, maxBlockBodySize? p:num, maxTxSize? p:num, maxBlockHeaderSize? p:num, keyDeposit? p:bigint, poolDeposit? p:bigint, maxEpoch? p:num, nOpt? p:num, rho? p:str, tau? p:str, decentralisation? p:str, protocolMajor? p:num, protocolMinor? p:num, minPoolCost? p:bigint, coinsPerUtxoByte? p:bigint, costModels? p:json, executionPrices? p:json, maxTxExUnits? p:json, maxBlockExUnits? p:json, maxValueSize? p:num, collateralPercentage? p:num, maxCollateralInputs? p:num
    Sources :: CardanoNode_LocalStateQuery, Ogmios_JsonRpc, CardanoDbSync_Postgres, Blockfrost_Rest, Koios_Rest
    View :: CardanoProtocolParameters_EpochView top `<dl>` shows network, epoch, source, protocol version, min fee coefficients, max block/transaction sizes, key/pool deposits, min pool cost, coins per UTXO byte, collateral settings, and Plutus execution limits. Details tabs: Cost models -> decoded costModels by language; Execution prices -> executionPrices/maxTxExUnits/maxBlockExUnits; Deposits & rewards -> key/pool deposits, nOpt, rho, tau; Network -> CardanoNetworkView.
    Notes :: Protocol parameters are epoch-bounded ledger state used for transaction validation and fee/script execution limits. Keep them separate from CardanoNetwork identity and from tip snapshots because different sources can expose current, proposed, or historical epoch parameter sets with different freshness.

  Entity CardanoScriptWitness :: $transaction+witnessIndex ; $transaction! $:CardanoTransaction, witnessIndex! p:num, scriptKind! p:enum, language? p:enum, scriptHash? p:hex, datum? p:json, redeemer? p:json, executionUnits? p:json
    Sources :: Ogmios_JsonRpc, CardanoDbSync_Postgres, Blockfrost_Rest, Koios_Rest
    View :: CardanoScriptWitnessView top `<dl>` shows witness index, script kind/language, script hash, execution units, and parent transaction. Details tabs: Datum -> datum JSON/hash; Redeemer -> redeemer JSON/ex-units; Script -> script bytes/source when sourceable.
    Notes :: Script witnesses are transaction-scoped evidence. Reusable script identity should be added as a separate script row only when sourceable by hash across transactions.

  Entity CardanoStakeCredential :: $network+credential ; $network! $:CardanoNetwork, credential! p:str, credentialKind? p:enum, rewardAddress? p:str, registered? p:bool, $activePool? $:CardanoStakePool, $$delegationEpochs* $:CardanoStakeDelegation_Epoch, $$addresses* $:CardanoAddress
    Sources :: CardanoNode_LocalStateQuery, Ogmios_JsonRpc, CardanoDbSync_Postgres, Blockfrost_Rest, Koios_Rest, Cardanoscan_Rest
    View :: CardanoStakeCredentialView top `<dl>` shows network, credential, credential kind, reward address, registered flag, active pool, delegation epoch count, and address count. Details tabs: Delegation history -> CardanoStakeDelegation_EpochsView; Addresses -> CardanoAddressesView sharing the credential; Active pool -> CardanoStakePoolView; Rewards -> epoch reward fields when sourced.
    Notes :: Stake credential identity is not the same as a payment address. Registration, active delegation, rewards, and withdrawals are ledger/indexer state over epochs and should be represented through CardanoStakeDelegation_Epoch rows or transaction certificates when modeled.

  Entity CardanoStakeDelegation_Epoch :: $stakeCredential+epoch+source ; $stakeCredential! $:CardanoStakeCredential, epoch! p:num, source! p:str, $stakePool? $:CardanoStakePool, activeStake? p:bigint, rewardAmount? p:bigint, withdrawalAmount? p:bigint, registered? p:bool, deregistered? p:bool
    Sources :: CardanoNode_LocalStateQuery, Ogmios_JsonRpc, CardanoDbSync_Postgres, Blockfrost_Rest, Koios_Rest, Cardanoscan_Rest
    View :: CardanoStakeDelegation_EpochView top `<dl>` shows stake credential, epoch, source, stake pool, active stake, reward amount, withdrawal amount, registered flag, and deregistered flag. Details tabs: Stake credential -> CardanoStakeCredentialView; Pool -> CardanoStakePoolView; Epoch state -> active stake/reward/withdrawal fields; Source evidence -> ledger/indexer epoch query context. CardanoStakeDelegation_EpochsView lists rows by epoch and groups source conflicts.
    Notes :: Epoch-bounded delegation/reward state. Do not flatten active pool, rewards, withdrawals, or registration lifecycle into CardanoStakeCredential identity; certificates live on CardanoTransaction/CardanoScriptWitness-adjacent rows when modeled.

  Entity CardanoStakePool :: $network+poolId ; $network! $:CardanoNetwork, poolId! p:str, vrfKeyHash? p:hex, pledge? p:bigint, margin? p:num, $$timestamps* $:CardanoStakePool_Timestamp
    Sources :: Blockfrost_Rest, Koios_Rest, CardanoDbSync_Postgres, Cardanoscan_Rest
    View :: CardanoStakePoolView top `<dl>` shows pool id, VRF key hash, pledge, margin, and latest stake/delegator snapshot. Details tabs: Snapshots -> CardanoStakePool_TimestampsView; Metadata -> pool metadata when sourceable; Blocks -> CardanoBlocksView when produced-block indexing exists.
    Notes :: Pool pledge/margin and metadata can change through pool update certificates. Live stake/reward/delegator counts belong in timestamp rows.

  Entity CardanoStakePool_Timestamp :: $pool+timestampMs+source ; $pool! $:CardanoStakePool, timestampMs! p:num, source! p:str, liveStake? p:bigint, activeStake? p:bigint, delegatorCount? p:num, blockCount? p:num, saturation? p:num, retired? p:bool
    Sources :: Blockfrost_Rest, Koios_Rest, CardanoDbSync_Postgres, Cardanoscan_Rest
    View :: CardanoStakePool_TimestampView top `<dl>` shows live/active stake, delegator count, block count, saturation, retired flag, source, and observation time; CardanoStakePoolView shows latest/history.
    Notes :: Pool performance and stake are epoch/snapshot facts, not stake pool identity.

  Entity CardanoTransaction :: $network+hash ; $network! $:CardanoNetwork, hash! p:hex, blockSlot? p:bigint, fee? p:bigint, deposit? p:bigint, sizeBytes? p:num, validityStartSlot? p:bigint, ttlSlot? p:bigint, metadata? p:json, $$inputs* $:CardanoTxInput, $$outputs* $:CardanoTxOutput, $$scripts* $:CardanoScriptWitness, $$assets* $:CardanoNativeAsset
    Sources :: CardanoNode_LocalStateQuery, Ogmios_JsonRpc, CardanoDbSync_Postgres, Blockfrost_Rest, Koios_Rest, Cardanoscan_Rest
    View :: CardanoTransactionView top `<dl>` shows hash, block slot, fee, deposit, size, and validity interval. Details tabs: Inputs -> CardanoTxInputsView; Outputs -> CardanoTxOutputsView; Script witnesses -> CardanoScriptWitnessesView; Native assets -> CardanoNativeAssetsView; Metadata -> structured transaction metadata/status.
    Notes :: Validity start/TTL are slot bounds, not wall-clock timestamps. Asset involvement should be derived from native asset bundles in inputs/outputs, not market token lists.

  Entity CardanoTxInput :: $transaction+inputIndex ; $transaction! $:CardanoTransaction, inputIndex! p:num, inputKind? p:enum, spentTxHash? p:hex, spentOutputIndex? p:num, $spentOutput? $:CardanoTxOutput, redeemerIndex? p:num
    Sources :: CardanoDbSync_Postgres, Blockfrost_Rest, Koios_Rest, Ogmios_JsonRpc
    View :: CardanoTxInputView top `<dl>` shows transaction, input index, input kind, spent transaction hash/output index, spent output link, and redeemer index. Details tabs: Spent output -> CardanoTxOutputView; Redeemer -> CardanoScriptWitnessView when linked; Transaction -> CardanoTransactionView.
    Notes :: Cardano inputs reference previous transaction outputs. `inputKind` distinguishes spending, collateral, reference, and collateral-return semantics when a source exposes them.

  Entity CardanoTxOutput :: $transaction+outputIndex ; $transaction! $:CardanoTransaction, outputIndex! p:num, address? p:str, $address? $:CardanoAddress, lovelace? p:bigint, datumHash? p:hex, inlineDatum? p:json, referenceScriptHash? p:hex, spentByTxHash? p:hex, spentByInputIndex? p:num, $$assets* $:CardanoTxOutputAsset
    Sources :: CardanoDbSync_Postgres, Blockfrost_Rest, Koios_Rest, Ogmios_JsonRpc
    View :: CardanoTxOutputView top `<dl>` shows output index, address, lovelace, datum hash/inline datum presence, reference script hash, spent transaction hash/input index, and asset count. Details tabs: Assets -> CardanoTxOutputAssetsView; Datum/script -> structured datum and reference script panels; Address -> CardanoAddressView; Spending transaction -> CardanoTransactionView when spentByTxHash resolves.
    Notes :: Inline datum and reference script are output state, not transaction metadata. Use CardanoTxOutputAsset rows instead of an opaque JSON bundle when asset amounts are sourceable. Spend linkage is indexer/head dependent, so keep it as evidence fields unless a spending input row is resolved.

  Entity CardanoTxOutputAsset :: $output+$asset ; $output! $:CardanoTxOutput, $asset! $:CardanoNativeAsset, quantity! p:bigint
    Sources :: CardanoDbSync_Postgres, Blockfrost_Rest, Koios_Rest
    View :: CardanoTxOutputAssetView top `<dl>` shows output, asset policy/name/fingerprint, and quantity. Details tabs: Output -> CardanoTxOutputView; Asset -> CardanoNativeAssetView; Transaction -> CardanoTransactionView through the parent output.
    Notes :: This is an output-local multi-asset amount. It is not a balance snapshot or asset identity row.

  Entity CashuKeyset :: $mint+keysetId ; $mint! $:CashuMint, keysetId! p:str, unit? p:str, active? p:bool, inputFeePpk? p:num, finalExpiryMs? p:num, keysByAmountJson? p:str
    Sources :: CashuMint_Rest
    View :: CashuKeysetView top `<dl>` shows mint, keyset id, unit, active state, input fee ppk, final expiry, and public key count. Details tabs: Mint -> CashuMintView; Keys -> amount-to-public-key JSON; Rotation -> active/final-expiry status and fee notes.
    Notes :: Keyset is the mint-published amount-key set from Cashu NUT-01/NUT-02. Active keysets sign new outputs; inactive keysets can still verify old proofs until expiry/source policy. Keep public keys as keyset source data, not separate amount-key entities, unless a view needs amount-level inspection or keyset-id verification.

  Entity CashuMeltQuote :: $mint+method+quoteId ; $mint! $:CashuMint, method! p:enum, quoteId! p:str, request! p:str, amount? p:bigint, unit? p:str, state? p:enum, expiryMs? p:num, feeReserve? p:bigint, paymentPreimage? p:str
    Sources :: CashuMint_Rest, Local_Internal
    View :: CashuMeltQuoteView top `<dl>` shows mint, method, quote id, request, amount, unit, state, expiry, fee reserve, and payment preimage status. Details tabs: Mint -> CashuMintView; Request -> BOLT11/BOLT12/onchain request text; State -> unpaid/pending/paid timeline; Proof inputs -> local proof summary only when Blockhead stores a wallet-local melt attempt.
    Notes :: NUT-05 melt quote state, not a public payment, Lightning invoice entity, or generic withdrawal. Quote ids are secret mint-issued handles used by `GET /v1/melt/quote/{method}/{quote_id}` and `POST /v1/melt/{method}`; store/display them only as local/source evidence. Proof inputs and async polling/subscription state belong in BlockheadCashuProof/BlockheadCashuWalletState when a connected wallet exposes them.

  Entity CashuMint :: mintUrl ; mintUrl! p:url, name? p:str, pubkey? p:str, version? p:str, description? p:str, descriptionLong? p:str, motd? p:str, iconUrl? p:url, tosUrl? p:url, timeMs? p:num, contactJson? p:str, urls* p:url, nutsJson? p:str, $$keysets* $:CashuKeyset, $$timestamps* $:CashuMint_Timestamp, $$mintQuotes* $:CashuMintQuote, $$meltQuotes* $:CashuMeltQuote
    Sources :: CashuMint_Rest
    View :: CashuMintView top `<dl>` shows mint URL plus the latest observed name, pubkey, version, short description, MOTD, icon, TOS, server time, and supported NUT count. Details tabs: Keysets -> CashuKeyset list; Latest info -> CashuMint_TimestampView; Info history -> CashuMint_Timestamp list; Mint quotes -> CashuMintQuote list from local/source lookups; Melt quotes -> CashuMeltQuote list from local/source lookups; Trust/source -> endpoint URL and source freshness.
    Notes :: Cashu mint identity is endpoint-scoped by `mintUrl`; operator metadata and capabilities can change, so durable observations belong in CashuMint_Timestamp while the parent row can expose latest convenience fields. Do not treat name/icon/contact as verified identity. Mint and melt quotes are sourceable only when the wallet has a quote id or creates one; quote ids are secret and should not become discovery lists. Wallet-local proofs, tokens, and balances belong under BlockheadCashu* rows.

  Entity CashuMint_Timestamp :: $mint+timestampMs+source ; $mint! $:CashuMint, timestampMs! p:num, source! p:enum, reachable? p:bool, name? p:str, pubkey? p:str, version? p:str, description? p:str, descriptionLong? p:str, motd? p:str, iconUrl? p:url, tosUrl? p:url, serverTimeMs? p:num, contactJson? p:str, urls* p:url, nutsJson? p:str, mintMethodsJson? p:str, meltMethodsJson? p:str, supportedNutNumbers* p:num
    Sources :: CashuMint_Rest
    View :: CashuMint_TimestampView top `<dl>` shows mint, observation time, source, reachability, server time, version, pubkey, and supported NUT count. Details tabs: Mint -> CashuMintView; Operator metadata -> name, descriptions, icon, TOS, contactJson, urls; Capabilities -> supportedNutNumbers, mintMethodsJson, meltMethodsJson, nutsJson; Source -> endpoint and fetch status.
    Notes :: Timestamped `/v1/info` observation for mutable mint metadata and NUT capability settings. Keep public keysets in CashuKeyset rows and keep wallet quote/proof state out of this row. Use it to compare operator metadata, enabled mint/melt methods, and support for optional NUTs such as check-state, DLEQ, websocket subscriptions, BOLT12, or on-chain methods over time.

  Entity CashuMintQuote :: $mint+method+quoteId ; $mint! $:CashuMint, method! p:enum, quoteId! p:str, request! p:str, unit? p:str, amount? p:bigint, state? p:enum, expiryMs? p:num
    Sources :: CashuMint_Rest, Local_Internal
    View :: CashuMintQuoteView top `<dl>` shows mint, method, quote id, payment request, unit, amount, state, and expiry. Details tabs: Mint -> CashuMintView; Payment request -> BOLT11/BOLT12/onchain request text; State -> unpaid/paid/issued status when sourced; Outputs -> local blinded-message summary only when Blockhead stores a wallet-local mint attempt.
    Notes :: NUT-04 mint quote state, not a deposit address, payment request catalog, or Lightning invoice entity. The quote id is a secret bearer-like value used by `GET /v1/mint/quote/{method}/{quote_id}` and `POST /v1/mint/{method}`; keep it local/source-scoped and never derive it from the payment request. Blind messages and signatures are protocol payloads for a wallet operation; persisted local outputs/proofs should be represented by BlockheadCashuProof or BlockheadCashuToken rows.

  Entity CctpAllowance :: apiHost ; apiHost! p:str, allowance! p:number|null, fetchedAt! p:num
    Sources :: Local_Internal
    View :: CctpAllowanceView top `<dl>` shows API host, allowance value or unavailable state, and fetched-at timestamp. Details tabs: Host -> source host metadata; Bridge diagnostics -> related CCTP fee/domain observations.
    Notes :: API-host observation state for Circle CCTP diagnostics, not a bridge route, transfer lifecycle, or token allowance between EVM accounts. Add a Circle CCTP source enum before modeling this as direct external API state.

  Entity CctpFee :: apiHost+fromDomain+toDomain ; apiHost! p:str, fromDomain! p:num, toDomain! p:num, rows! p:{finalityThreshold:number,minimumFee:number}[]
    Sources :: Local_Internal
    View :: CctpFeeView top `<dl>` shows API host, from domain, to domain, and fee-row count. Details tabs: Fee rows -> finality threshold/minimum fee table; Domains -> mapped networks only when a Circle domain registry row exists; Bridge diagnostics -> related CctpAllowance for the same host.
    Notes :: Fee rows are scoped to API host and CCTP source/destination domains. CCTP domains are protocol domain ids, not EVM chain ids; map them to networks only through an explicit Circle domain registry/source row.

  Entity ClaimTopicRequirement :: $profile+topicKey ; $profile! $:RegulatedAssetProfile, topicKey! p:str, claimTopic? p:bigint, requiredIssuerSelector? p:json, countryScope? p:str
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Sourcify_Rest, Dune_Rest, Allium_Rest
    View :: ClaimTopicRequirementView top `<dl>` shows regulated asset profile, topic key, claim topic, required issuer selector, and country scope. Details tabs: Profile -> RegulatedAssetProfileView; Trusted issuers -> TrustedIssuer list filtered by accepted claim topic; Source evidence -> registry call/event payload.
    Notes :: Child row for explicit ERC-3643/T-REX claim-topic requirements or comparable compliance-module config. Country or issuer scope belongs here only when registry/module state exposes it; otherwise keep it absent.

  Entity Coin :: coinId ; coinId! p:enum, symbol! p:str, name! p:str, decimals! p:num, $logo? $:MediaObject, $$timestamps+ $:Coin_Timestamp, $$coinInstances+ $:EvmCoinInstance, $$marketsWithCoinAsBase+ $:Market, $$marketsWithCoinAsQuote+ $:Market, $$bridgeCapabilities+ $:CoinBridgeCapability
    Sources :: Constants_Internal, Coingecko_Rest, Coingecko_OpenApi, CoinMarketCap_Rest, Coinpaprika_OpenApi, Defillama_OpenApi, TradingView_Rest, Blockscout_Rest, Lifi_Rest
    View :: CoinView title/value shows catalog coin id or name/symbol with logo; top `<dl>` shows latest Coin_Timestamp market cap rank, market cap, latest snapshot, and decimals. Details use CollapsibleTabs: Topology -> EvmCoinInstancesView, wrapped EvmCoinInstancesView filtered to bridge-wrapped representation, and CoinBridgeCapabilitiesView; Markets -> catalog USD market link, MarketsView as base, and MarketsView as quote.
    Notes :: Catalog coin identity is `coinId`, not marketCapRank, providerAssetId, ticker symbol, CAIP-19, or a bridge/provider label. Market rank/cap/supply fields belong on Coin_Timestamp, block-aligned fundamentals belong on Coin_EvmBlock only when explicitly materialized, CAIP-19 belongs on asset-instance or market/source observation rows, and bridge mechanics belong on CoinBridgeCapability.

  Entity Coin_EvmBlock :: $coin+$block ; $coin! $:Coin, $block! $:EvmBlock, price? p:num, marketCap? p:num, totalSupply? p:bigint
    Sources :: Local_Internal
    View :: Coin_EvmBlockView should show coin, EVM block, price, market cap, and total supply in a top `<dl>`; if surfaced in CoinView or EvmBlockView, list it as a block-scoped fundamentals observation with source attribution.
    Notes :: Block-coordinate observation row for fundamentals explicitly tied to an EVM block. Do not use it for latest market data, daily OHLC, or provider wall-clock snapshots; those belong to Coin_Timestamp or market timestamp rows unless a source aligns the value to this exact block.

  Entity Coin_Timestamp :: $coin+timestampMs ; $coin! $:Coin, timestampMs! p:num, marketCapRank? p:num, marketCapUsd? p:num, marketCap? p:bigint, change24hPercent? p:num, totalSupply? p:bigint, transport? p:str, providerAssetId? p:str
    Sources :: Coingecko_Rest, Blockscout_Rest, Local_Internal
    View :: Coin_TimestampView title/value shows market cap, 24h change, or coin id fallback; top `<dl>` shows market cap rank, market cap, 24h change, snapshot wall time, CoinView ref, and, when expanded, recorded total supply, transport, and provider asset id. CoinView surfaces the latest snapshot in its top `<dl>`.
    Notes :: Timestamped fundamentals snapshot keyed by the provider/source clock. marketCapRank and providerAssetId are source observations, not selectors or catalog membership; totalSupply here is a provider-clock snapshot, not a block-aligned supply proof.

  Entity CoinBridgeCapability :: $fromInstance+$toInstance+toolKey ; $fromInstance! $:EvmCoinInstance, $toInstance! $:EvmCoinInstance, toolKey! p:str, railId? p:enum, settlementModel? p:enum, verificationModel? p:enum, assetOutcome? p:enum
    Sources :: Constants_Internal, Lifi_Rest
    View :: CoinBridgeCapabilityView top `<dl>` shows from/to EvmCoinInstance refs, tool key, rail, settlement model, verification model, and asset outcome. CoinBridgeCapabilitiesView lists all capabilities under CoinView and split outbound/inbound capability tabs under EvmCoinInstanceView.
    Notes :: Capability row for a source/catalog-supported route between two EVM coin instances. It is not an executed bridge transfer, settlement proof, liquidity guarantee, quote, or route step; executable amounts and ordered steps belong on BridgeRoute and BridgeRouteStep.

  Entity ComplianceModule :: $profile+moduleKey ; $profile! $:RegulatedAssetProfile, moduleKey! p:str, moduleSelector! p:json, ruleKind? p:enum, config? p:json
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Sourcify_Rest, Solana_JsonRpc, Helius_Rest, Dune_Rest, Allium_Rest
    View :: ComplianceModuleView top `<dl>` shows regulated asset profile, module key, module selector, rule kind, and config summary. Details tabs: Profile -> RegulatedAssetProfileView; Restrictions -> TransferRestriction list derived from this module; Source evidence -> contract calls/events, verified ABI, or Token-2022 extension payload.
    Notes :: Concrete compliance module or token-extension rule config. EVM sources can expose ERC-3643/T-REX compliance contracts through calls/events plus verified ABIs; Solana sources can expose Token-2022 mint/account extension config. Store config only when the source makes it interpretable; opaque calldata belongs in lower-level contract interaction rows.

  Entity ConsensusMechanism :: consensusMechanismId ; consensusMechanismId! p:enum, label! p:str
    Sources :: Constants_Internal
    View :: ConsensusMechanismView top `<dl>` shows consensus mechanism id and label. Details tabs: Networks -> Network rows that explicitly reference the mechanism; Protocol notes -> network-specific finality and validator views when linked.
    Notes :: Catalog row for named consensus mechanisms, not proof of a network's live safety/finality state. Keep finality checkpoints, validator sets, client distribution, and fork/runtime observations on network-specific rows.

  Entity ContractInterfaceMember :: interfaceId+memberKey ; interfaceId! p:str, memberKey! p:str, memberKind! p:enum, name? p:str, canonicalSignature? p:str, selector? p:hex4, topic0? p:hex32, inputs? p:json, outputs? p:json, stateMutability? p:enum
    Sources :: Sourcify_Rest, Etherscan_Rest, Blockscout_Rest, Constants_Internal, Local_Internal
    View :: ContractInterfaceMemberView should show member kind, name, canonical signature, selector or topic0, inputs, outputs, and state mutability in a top `<dl>`; contract and protocol views should list these only when ABI entries are decomposed into stable member rows rather than inline JSON.
    Notes :: Future decomposition for ABI functions, events, errors, constructors, fallback, and receive members. Use it when interface entries need stable refs to EvmSelector, EvmTopic, or EvmError rows; otherwise keep raw ABI JSON on EvmContract or ENS resolver ABI surfaces. Canonical selector/topic derivation is pure from ABI signatures, while source membership comes from verified/source-provided ABI JSON or checked-in interface catalogs.

  Entity CosmosAccount :: $network+address ; $network! $:Network, address! p:str, accountNumber? p:bigint, sequence? p:bigint, balanceUatom? p:bigint
    Sources :: CosmosSdk_Rest
    View :: CosmosAccountView top `<dl>` shows network, address, balance when available, account number, and sequence. Details tabs: Network -> CosmosNetworkView; Messages -> CosmosMessage list when reached from transactions; Contracts/modules -> creator/admin/authority refs when linked by CosmosContract or CosmosModule.
    Notes :: Account number and sequence are account/auth state. Balances should move to denom-specific balance rows or timestamped observations if the bank module is modeled beyond the current single balanceUatom field.

  Entity CosmosBlock :: $network+height | $network+hash ; $network! $:Network, height! p:bigint, hash! p:str, proposerConsensusAddress? p:str, timestampMs? p:num, transactionCount? p:num, $$transactions* $:CosmosTransaction
    Sources :: CosmosSdk_Rest, CometBft_Rest
    View :: CosmosBlockView top `<dl>` shows network, height, hash, proposer consensus address, timestamp, and transaction count. Details tabs: Transactions -> CosmosTransaction list; Header -> proposer, time, hash; Network -> CosmosNetworkView. CosmosBlocksView lists blocks in CosmosNetworkView Execution.
    Notes :: Height and hash are both implemented selectors. proposerConsensusAddress is the CometBFT proposer identity and should not be treated as a CosmosValidator operator address unless a source resolves that mapping.

  Entity CosmosContract :: $network+address ; $network! $:Network, address! p:str, codeId? p:bigint, $creator? $:CosmosAccount, $admin? $:CosmosAccount
    Sources :: CosmosSdk_Rest
    View :: CosmosContractView top `<dl>` shows network, contract address, code id, creator, and admin. Details tabs: Creator -> CosmosAccountView; Admin -> CosmosAccountView; Messages -> CosmosMessage list when contract messages are resolved; Network -> CosmosNetworkView.
    Notes :: CosmWasm contract identity is the chain address. codeId, creator, and admin are contract metadata; storage/query surfaces should be modeled separately when real source payloads are wired.

  Entity CosmosDenom :: $network+denom ; $network! $:Network, denom! p:str, display? p:str, base? p:str, symbol? p:str
    Sources :: CosmosSdk_Rest, CosmosChainRegistry_Github
    View :: CosmosDenomView top `<dl>` shows network, denom, display, base, and symbol. Details tabs: Network -> CosmosNetworkView; Asset metadata -> AssetInstance/AssetClass link when chain-registry metadata resolves; Bank state -> future denom balance/supply rows.
    Notes :: denom is the native bank/IBC denomination selector. Do not replace it with market symbols or chain-registry display names; those are metadata over the denom.

  Entity CosmosGovernanceProposal :: $network+proposalId ; $network! $:Network, proposalId! p:str, title? p:str, status? p:str
    Sources :: CosmosSdk_Rest
    View :: CosmosGovernanceProposalView top `<dl>` shows title and status for the network-scoped proposal id. `CosmosGovernanceProposalsView` is the Governance tab list under `CosmosNetworkView` -> Consensus & Governance. If lifecycle/tally/votes are added, keep them as tabs on this entity: Messages, Deposits, Votes, Tally, Metadata.
    Notes :: This is on-chain Cosmos SDK x/gov, not a specification proposal and not an abstract `GovernanceProposalLifecycle`. Cosmos proposals are identified by chain-local proposalId, contain executable `sdk.Msg` payloads and metadata, and move through deposit/voting/final statuses; votes, deposits, tally, and parameter changes should become Cosmos-specific child rows or fields when source coverage exists.

  Entity CosmosMessage :: $transaction+messageIndex ; $transaction! $:CosmosTransaction, messageIndex! p:num, typeUrl! p:str, $signer? $:CosmosAccount, $contract? $:CosmosContract
    Sources :: CosmosSdk_Rest
    View :: CosmosMessageView top `<dl>` shows transaction, message index, type URL, signer, and contract. Details tabs: Transaction -> CosmosTransactionView; Signer -> CosmosAccountView; Contract -> CosmosContractView; Raw payload -> source message JSON when retained.
    Notes :: The selector is transaction + message index because one Cosmos transaction can carry multiple SDK messages. typeUrl is a dispatch key, not an entity type by itself.

  Entity CosmosModule :: $network+moduleName ; $network! $:Network, moduleName! p:str, $authority? $:CosmosAccount
    Sources :: CosmosSdk_Rest
    View :: CosmosModuleView top `<dl>` shows network, module name, and authority account. Details tabs: Authority -> CosmosAccountView; Network -> CosmosNetworkView; Module data -> future module-specific params/state rows.
    Notes :: Modules are sourceable when the chain exposes module accounts/authority. Avoid inventing module rows from UI tabs unless a chain endpoint names the module.

  Entity CosmosNetwork :: $network ; $network! $:Network, restEndpoints+ p:{url:url,transportType:enum,providerName:str}, $$timestamps* $:CosmosNetwork_Timestamp, $$blocks* $:CosmosBlock, $$validators* $:CosmosValidator, $$governanceProposals* $:CosmosGovernanceProposal
    Sources :: Constants_Internal, CosmosChainRegistry_Github, CosmosSdk_Rest, CometBft_Rest
    View :: CosmosNetworkView top `<dl>` shows parent network, latest head snapshot, environment, native asset count, and REST endpoint count. Details tabs: Execution -> Blocks, Network snapshots, Endpoints; Consensus & Governance -> Validators, Governance proposals; Assets -> Native coin; Resources -> Faucets and block explorers.
    Notes :: This row is the implemented Cosmos SDK network surface, not a generic Cosmos ecosystem bucket. IBC, CosmWasm, modules, denoms, accounts, and transactions stay as separately selectable entities or view sections when the resolver exposes them.

  Entity CosmosNetwork_Timestamp :: $network+timestampMs ; $network! $:Network, timestampMs! p:num, latestBlockHeight? p:bigint, latestBlockHash? p:str, latestBlockTimeMs? p:num, latestBlockTransactionCount? p:num, chainId? p:str, nodeNetwork? p:str, applicationName? p:str, applicationVersion? p:str, cosmosSdkVersion? p:str, isSyncing? p:bool, validatorCount? p:num, bondedValidatorCount? p:num, bondedTokens? p:bigint, notBondedTokens? p:bigint, governanceProposalCount? p:num
    Sources :: CosmosSdk_Rest, CometBft_Rest
    View :: CosmosNetwork_TimestampView top `<dl>` shows timestamp, latest block height/hash/time, latest block transaction count, chain id, node network, app name/version, Cosmos SDK version, sync state, validator counts, bonded/not-bonded tokens, and governance proposal count. Details tabs: Head -> latest block fields; App/node -> chain id, node network, app and SDK versions, sync; Staking -> validator counts and pool tokens; Governance -> proposal count. CosmosNetwork_TimestampsView lists snapshots under Execution.
    Notes :: This is the as-of network observation row for head state and app/node metadata. Do not duplicate latest height, sync state, validator counts, or bonded stake onto CosmosNetwork.

  Entity CosmosTransaction :: $network+txHash ; $network! $:Network, txHash! p:str, $block? $:CosmosBlock, code? p:num, gasWanted? p:bigint, gasUsed? p:bigint, memo? p:str, $$messages* $:CosmosMessage
    Sources :: CosmosSdk_Rest, CometBft_Rest
    View :: CosmosTransactionView top `<dl>` shows network, transaction hash, block, code, gas wanted, gas used, memo, and message count. Details tabs: Messages -> CosmosMessage list; Block -> CosmosBlockView; Execution -> code and gas fields; Raw/auth info -> signer-info/signature payload when modeled.
    Notes :: Keep transaction-level execution status and gas here. SDK message semantics belong on CosmosMessage or future typed message rows; signer signatures/auth info are not implemented schema yet.

  Entity CosmosValidator :: $network+operatorAddress ; $network! $:Network, operatorAddress! p:str, consensusPubkey? p:str, moniker? p:str, jailed? p:bool, status? p:str, tokens? p:bigint
    Sources :: CosmosSdk_Rest, CometBft_Rest
    View :: CosmosValidatorView top `<dl>` shows network, operator address, consensus pubkey, moniker, jailed state, status, and tokens. Details tabs: Network -> CosmosNetworkView; Consensus identity -> consensus pubkey and proposer mapping when source-backed; Stake/status -> jailed/status/tokens. CosmosValidatorsView lists validators under Consensus & Governance.
    Notes :: operatorAddress is the staking validator selector. consensusPubkey/proposer consensus address mappings are separate consensus identities and should not be conflated without a resolver-backed mapping.

  Entity CronosNetworkProfile :: $network ; $network! $:Network, $evmNetwork? $:EvmNetwork, $cosmosNetwork? $:CosmosNetwork, chainKind! p:enum, consensusKind? p:enum, bech32Prefix? p:str, evmChainId? p:bigint, cosmosChainId? p:str, $$ibcChannels* $:IbcChannel, $$timestamps* $:Network_Timestamp
    Sources :: CosmosSdk_Rest, CometBft_Rest, CosmosChainRegistry_Github, CronosExplorer_Rest
    View :: CronosNetworkProfileView top `<dl>` shows linked base Network, linked EVM network, linked Cosmos network, chain kind, consensus kind, EVM chain id, Cosmos chain id, and bech32 prefix. Tabs: EVM compatibility, Cosmos SDK head, IBC channels, validators through CosmosNetworkView, timestamp history.
    Notes :: Cronos is an Ethermint/Cosmos-SDK style network with EVM execution plus IBC/Cosmos consensus context. This profile supplements existing Network/EvmNetwork/CosmosNetwork rows and should not duplicate blocks, transactions, validators, or accounts already owned by those rows.

  Entity Currency :: iso4217 ; iso4217! p:enum, name! p:str, symbol? p:str, minorUnitExponent! p:num, $$timestamps+ $:Currency_Timestamp, $$marketsWithCurrencyAsBase+ $:Market, $$marketsWithCurrencyAsQuote+ $:Market
    Sources :: Constants_Internal, Coingecko_Rest, Coingecko_OpenApi, CoinMarketCap_Rest, Coinpaprika_OpenApi, Defillama_OpenApi, Defillama_Rest, Blockscout_Rest, TradingView_Rest
    View :: CurrencyView top `<dl>` shows ISO code, name, symbol, minor unit exponent, and latest catalog snapshot value. Details tabs: Catalog snapshot -> Currency_TimestampView; Markets as base -> Market list; Markets as quote -> Market list.
    Notes :: Catalog fiat/currency row. `marketCap` on Currency_Timestamp is the current catalog's FX turnover-weight proxy; live FX rates, central bank money supply, and token market caps are different rows.

  Entity Currency_Timestamp :: $currency+timestampMs ; $currency! $:Currency, timestampMs! p:num, marketCap? p:bigint
    Sources :: Constants_Internal
    View :: Currency_TimestampView top `<dl>` shows currency, timestamp, and FX turnover-weight proxy value. Details tabs: Currency -> CurrencyView; Snapshot -> catalog snapshot wall time and value.
    Notes :: Static catalog observation. Do not treat this as a live quote stream; if FX rates are added later they should use source-clocked timestamp rows with explicit base/quote market selectors.

  Entity DenomTrace :: $network+denom ; $network! $:Network, denom! p:str, baseDenom? p:str, path? p:str, sourcePort? p:str, sourceChannel? p:str, destinationPort? p:str, destinationChannel? p:str, $sourceIbcChannel? $:IbcChannel, $destinationIbcChannel? $:IbcChannel, $assetInstance? $:AssetInstance
    Sources :: CosmosSdk_Rest, CosmosChainRegistry_Github, Mintscan_Rest, BigDipper_Rest
    View :: DenomTraceView top `<dl>` shows network, denom, base denom, path, source port/channel, destination port/channel, source/destination IBC channel refs, and linked asset instance. Details tabs: Asset metadata -> AssetInstanceView; IBC channels -> IbcChannelView refs; Network -> CosmosNetworkView.
    Notes :: Cosmos IBC denom identity row. Denom trace identity is path plus base denom on a network; symbol/name/market metadata should resolve through the linked asset instance, not overwrite the trace. Cosmos SDK x/ibc-transfer exposes denom traces, chain-registry can map known IBC paths, and explorers/indexers may mirror path/base-denom data with freshness and coverage caveats.

  Entity DogecoinAuxPowMerkleBranch :: $auxPow+branchKind ; $auxPow! $:DogecoinBlockAuxPow, branchKind! p:str, branchHashes* p:str, index? p:num
    Sources :: DogecoinCore_JsonRpc
    View :: DogecoinAuxPowMerkleBranchView top `<dl>` shows AuxPoW ref, branch kind, branch hash count, and index. Details tabs: Hashes -> ordered branch hash list; AuxPoW -> DogecoinBlockAuxPowView.
    Notes :: AuxPoW merkle branches are evidence under one Dogecoin block's merged-mining payload. branchKind separates coinbase and chain branches; do not model branch rows as independent block identities.

  Entity DogecoinAuxPowParentBlockHeader :: $auxPow ; $auxPow! $:DogecoinBlockAuxPow, hash? p:str, merkleRoot? p:str, nonce? p:bigint
    Sources :: DogecoinCore_JsonRpc
    View :: DogecoinAuxPowParentBlockHeaderView top `<dl>` shows AuxPoW ref, parent header hash, merkle root, and nonce. Details tabs: AuxPoW -> DogecoinBlockAuxPowView; Header evidence -> parent hash, merkle root, nonce.
    Notes :: Parent header fields are merged-mining proof evidence for the Dogecoin block. They should not create a generic parent-chain block row unless a concrete parent-chain source and selector are available.

  Entity DogecoinBlockAuxPow :: $block ; $block! $:UtxoBlock, $parentBlockHeader? $:DogecoinAuxPowParentBlockHeader, $coinbaseBranch? $:DogecoinAuxPowMerkleBranch, $chainBranch? $:DogecoinAuxPowMerkleBranch
    Sources :: DogecoinCore_JsonRpc
    View :: DogecoinBlockAuxPowView top `<dl>` shows Dogecoin block, parent block header ref, coinbase branch ref, and chain branch ref. Details tabs: Block -> UtxoBlockView; Parent header -> DogecoinAuxPowParentBlockHeaderView; Merkle branches -> coinbase and chain DogecoinAuxPowMerkleBranchView.
    Notes :: AuxPoW identity is the Dogecoin UtxoBlock that carries the merged-mining payload. Keep AuxPoW proof structure as Dogecoin-specific child evidence instead of duplicating UtxoBlock or ConsensusMechanism rows.

  Entity Eip7702Authorization :: $transaction+authorizationIndex ; $transaction! $:EvmTransaction, authorizationIndex! p:num, chainId! p:bigint, delegationAddress! p:evmAddress, authority? p:evmAddress, nonce! p:bigint, yParity! p:num, r! p:hex32, s! p:hex32, $authorityAccount? $:EvmNetworkAccount, $delegationContract? $:EvmContract, $verification? $:VerificationResult
    Sources :: Voltaire_JsonRpc, Erigon_JsonRpc, Reth_JsonRpc, Etherscan_Rest, Blockscout_Rest, Allium_Rest
    View :: Eip7702AuthorizationView top `<dl>` shows transaction, authorization index, chain id, authority, delegation address, nonce, yParity/r/s, authority account, delegation contract, and verification result. Details tabs: Transaction -> EvmTransactionView; Authority -> EvmNetworkAccountView; Delegation contract -> EvmContractView; Signature evidence -> raw tuple and VerificationResultView.
    Notes :: EIP-7702 authorization rows come from type-4 SetCode transaction authorization lists. JSON-RPC clients can expose the typed transaction payload when the chain supports the envelope, while explorers/indexers can mirror tuple indexes only if they preserve raw authorization order. The tuple authorizes code delegation for the recovered authority account; the transaction sender pays for it, and failed execution does not automatically roll back processed delegation indicators.

  Entity ElementsAsset :: $network+assetId ; $network! $:ElementsNetwork, assetId! p:str, name? p:str, ticker? p:str, precision? p:num, entityDomain? p:str, contractJson? p:str, issuedAmount? p:bigint, burnedAmount? p:bigint, hasBlindedIssuances? p:bool, reissuanceTokenCount? p:num, $$issuances* $:ElementsIssuance
    Sources :: Esplora_Rest
    View :: ElementsAssetView top `<dl>` shows asset id, ticker/name, precision, entity domain, issued amount, burned amount, blinded issuance flag, and reissuance token count. Details tabs: Network -> ElementsNetworkView; Issuances -> ElementsIssuance list; Registry contract -> contractJson/source metadata.
    Notes :: Elements asset identity is the network-scoped asset id. Registry name/ticker/domain and issued/burned totals are source metadata from Liquid Esplora and should not replace the selector or imply market identity.

  Entity ElementsIssuance :: $transaction+inputIndex ; $transaction! $:UtxoTransaction, inputIndex! p:num, $asset? $:ElementsAsset, $reissuanceTokenAsset? $:ElementsAsset, assetEntropy? p:str, assetBlindingNonce? p:str, issuedAmount? p:bigint, tokenAmount? p:bigint, isReissuance? p:bool
    Sources :: Esplora_Rest
    View :: ElementsIssuanceView top `<dl>` shows transaction input, asset, reissuance token asset, issued amount, token amount, reissuance flag, entropy, and blinding nonce. Details tabs: Transaction -> UtxoTransactionView; Asset -> ElementsAssetView; Reissuance token -> ElementsAssetView.
    Notes :: Issuance identity is the UTXO transaction input carrying an Elements issuance or reissuance. Keep confidential-asset issuance data here rather than on UtxoInput unless the row is explicitly linked.

  Entity ElementsNetwork :: $network ; $network! $:Network, $settlementNetwork? $:UtxoNetwork, federationName? p:str, blockTimeSeconds? p:num, $nativeAsset? $:ElementsAsset, confidentialTransactionsDefault? p:bool, $$assets* $:ElementsAsset
    Sources :: Constants_Internal, Esplora_Rest
    View :: ElementsNetworkView top `<dl>` shows linked Network, settlement UtxoNetwork, federation name, block time, native asset, confidential-transactions default, and asset count. Details tabs: Assets -> ElementsAsset list; Issuances -> ElementsIssuance list when scoped from transactions; Pegs -> ElementsPeg list when linked; Settlement -> UtxoNetworkView.
    Notes :: ElementsNetwork is the Liquid/Elements overlay network surface, not a replacement for shared UtxoNetwork blocks, transactions, inputs, and outputs. Keep confidential asset and peg extensions as Elements rows linked back to UTXO primitives.

  Entity ElementsPeg :: $network+pegTransactionId+direction ; $network! $:ElementsNetwork, pegTransactionId! p:str, direction! p:enum, $bitcoinTransaction? $:UtxoTransaction, $elementsTransaction? $:UtxoTransaction, amountSats? p:bigint, claimScript? p:str, pakProof? p:str, status? p:str
    Sources :: Esplora_Rest
    View :: ElementsPegView top `<dl>` shows network, direction, peg transaction id, Bitcoin transaction, Elements transaction, amount, status, claim script, and PAK proof. Details tabs: Bitcoin side -> UtxoTransactionView; Elements side -> UtxoTransactionView; Proof -> claim script and PAK proof evidence.
    Notes :: Peg identity is Liquid network plus peg transaction id plus direction. Peg rows describe cross-chain transfer evidence, not a bridge route quote, wallet request, federation member identity, or settlement guarantee beyond the sourced proof/status fields.

  Entity EnsName :: name ; name! p:str, normalizedName? p:str, node? p:hex32, labelName? p:str, labelhash? p:hex32, $resolvedActor? $:EvmAccount, $resolverContract? $:EvmContract, $ownerActor? $:EvmAccount, $parent? $:EnsName, $$subdomains* $:EnsName, subdomainCount? p:num, textRecords? p:json, contentHash? p:str, resolverAbi? p:json, coinAddresses? p:json, resolverTextKeys* p:str, resolverCoinTypes* p:str, ttl? p:bigint, isMigrated? p:bool, createdAt? p:bigint, expiryDate? p:bigint, subgraphId? p:str, $$records* $:EnsRecord, $$reverseRecords* $:EnsReverseRecord
    Sources :: Voltaire_JsonRpc, TheGraph_Graphql, EnsMetadataService_Rest
    View :: EnsView top `<dl>` shows name, normalized name, node, label name/hash, resolved address, resolver contract, owner, parent, subdomain count, content hash, migration state, created/expiry dates, and latest reverse-record status. Details tabs: Profile -> textRecords and rendered profile links; Resolver -> EnsResolverView with resolver contract, ABI, contenthash, multicoin addresses, text keys, and coin types; Records -> EnsRecord list grouped by addr/text/contenthash/ABI/multicoin; Registration -> owner, TTL, migration, created/expiry/subgraph id; Subdomains -> EnsName list; Reverse records -> EnsReverseRecord list; Linked accounts -> EvmAccount/EvmNetworkAccount refs.
    Notes :: ENS name identity is the ENSIP-15-normalized name and derived namehash node; raw input spelling and provider search aliases must not become separate name identities. Voltaire JSON-RPC reads live registry/resolver calls (`owner`, `resolver`, `addr`, `text`, `contenthash`, `ABI`, multicoin `addr`) against Ethereum, while The Graph indexes registration, resolver event keys, parent/subdomain edges, and expiry/migration metadata that can lag live state. Inline resolver fields match the current implementation; EnsRecord/EnsRecord_Timestamp are the normalized future evidence layer for mutable resolver values.

  Entity EnsProtocol :: scope ; scope! p:'EnsProtocol', protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str
    Sources :: Constants_Internal, EnsContracts_Github, Ensips_Github
    View :: EnsProtocolView top `<dl>` shows scope, protocol name, registry label, topology, home URL, docs URL, canonical registry contract, and source coverage. Details tabs: Browse -> EnsBrowseView/EnsSearchView; Proposals -> ENSIP SpecificationProposal list; Contracts -> registry/resolver/reverse registrar/name wrapper refs when cataloged; Names -> selected EnsName examples or search results.
    Notes :: Singleton protocol hub for browsing ENS. It is not the registry contract, a name, or an ownership record; keep actual name state on EnsName and resolver observations on EnsRecord.

  Entity EnsRecord :: $name+recordKey ; $name! $:EnsName, recordKey! p:str, recordKind! p:enum, coinType? p:num, $$timestamps* $:EnsRecord_Timestamp
    Sources :: Voltaire_JsonRpc, TheGraph_Graphql, EnsMetadataService_Rest
    View :: EnsRecordView top `<dl>` shows name, record key, record kind, coin type, latest value, latest block/source, and timestamp count. Details tabs: History -> EnsRecord_Timestamp list; Name -> EnsView; Resolver evidence -> resolver selector/call context; Display -> typed rendering for addr/text/contenthash/ABI/multicoin records.
    Notes :: Normalized resolver-record row for mutable ENS resolver state. `recordKey` should encode the resolver method and argument, such as `addr`, `text:avatar`, `contenthash`, `abi:json`, or `coin:60`; `recordKind` drives display and decoding. Voltaire can read live resolver values, while The Graph event history is useful for discovered text keys, coin types, and change events; missing indexed events must not be modeled as absence of the live resolver value.

  Entity EnsRecord_Timestamp :: $record+timestampMs+source ; $record! $:EnsRecord, timestampMs! p:num, source! p:str, value? p:str, resolverSelector? p:json, blockNumber? p:bigint
    Sources :: Voltaire_JsonRpc, TheGraph_Graphql
    View :: EnsRecord_TimestampView top `<dl>` shows record, observation time, source, value, resolver selector, block number, and decoded display value. Details tabs: Record -> EnsRecordView; Name -> EnsView; Raw call/event -> resolver calldata, event id, or subgraph cursor when available.
    Notes :: Timestamp identifies observation freshness for a mutable resolver value, not the ENS name's stable identity. Resolver selector and block/index context are evidence because resolver methods differ by record kind and source clocks differ between live RPC calls and indexed events.

  Entity EnsReverseRecord :: $account+$name ; $account! $:Account, $name! $:EnsName, $$timestamps* $:EnsReverseRecord_Timestamp
    Sources :: Voltaire_JsonRpc, TheGraph_Graphql
    View :: EnsReverseRecordView top `<dl>` shows account, claimed primary name, latest verified status, latest source, and timestamp count. Details tabs: Verification history -> EnsReverseRecord_Timestamp list; Account -> AccountView/EvmAccountView; Name -> EnsView; Resolver evidence -> reverse node and forward-resolution check.
    Notes :: Reverse lookup is an identity claim from `{address}.addr.reverse`, not proof of key control unless reverse lookup and forward resolution agree under configured resolver rules. Model the account/name relationship separately from name ownership and registration, and do not treat stale reverse names as verified primary names.

  Entity EnsReverseRecord_Timestamp :: $reverseRecord+timestampMs+source ; $reverseRecord! $:EnsReverseRecord, timestampMs! p:num, source! p:str, verified? p:bool, resolverSelector? p:json
    Sources :: Voltaire_JsonRpc, TheGraph_Graphql
    View :: EnsReverseRecord_TimestampView top `<dl>` shows reverse record, observation time, source, verified flag, reverse resolver selector, forward resolver selector, and check result. Details tabs: Reverse record -> EnsReverseRecordView; Account -> AccountView; Name -> EnsView; Raw evidence -> resolver calls and block/source context.
    Notes :: `verified` means one observation passed the configured reverse-then-forward check at that time. It does not imply permanent ownership, future validity, or control of the target account.

  Entity EnsSearch :: query ; query! p:str, $$ensNames* $:EnsName
    Sources :: TheGraph_Graphql
    View :: EnsSearchView top `<dl>` shows query, result count, source, and pagination/limit state. Details tabs: Results -> EnsName list; Source evidence -> The Graph search/filter query and freshness; Browse -> EnsBrowseView context.
    Notes :: Query text is a request selector for a source-backed browse result, not a stable ENS protocol object or alias claim.

  Entity Erc4337AccountFactory :: $network+address ; $network! $:EvmNetwork, address! p:evmAddress, userOperationsCount? p:num, $contract! $:EvmContract
    Sources :: Blockscout_Rest
    View :: Erc4337AccountFactoryView top `<dl>` shows address title/value, Blockscout-indexed user operation count, and factory contract via EvmContractView; no details tabs today. Created-account lists require factory-scoped pagination before becoming a field.
    Notes :: The factory row identifies the deployment contract used by account creation paths. ERC-4337 factory/initCode semantics explain the role, while Blockscout account-abstraction endpoints fulfill the row. Do not infer a complete created-account list unless a source exposes factory-scoped pagination.

  Entity Erc4337Bundler :: $network+address ; $network! $:EvmNetwork, address! p:evmAddress, userOperationsCount? p:num, $contract? $:EvmContract
    Sources :: Blockscout_Rest
    View :: Erc4337BundlerView top `<dl>` shows address title/value, Blockscout-indexed user operation count, and operator as EvmAccountView using the same address; no details tabs today. Network-level Erc4337BundlersView is a Blockscout top-list surface, not a complete bundler registry.
    Notes :: Bundlers are infrastructure/operator addresses that accept UserOperations, simulate validity, and submit EntryPoint.handleOps transactions. Keep $contract optional and do not infer a contract row unless source evidence shows code or a contract role. Hosted leaderboard/list endpoints are source coverage, not a complete bundler registry.

  Entity Erc4337Paymaster :: $network+address ; $network! $:EvmNetwork, address! p:evmAddress, userOperationsCount? p:num, $contract! $:EvmContract
    Sources :: Blockscout_Rest
    View :: Erc4337PaymasterView top `<dl>` shows address title/value, Blockscout-indexed user operation count, and paymaster contract via EvmContractView; no details tabs today. Sponsor type appears on EvmUserOperationView, not as a durable paymaster field.
    Notes :: Paymaster identity is a contract address used by user operations through paymaster/paymasterAndData semantics. sponsorType belongs to the operation/indexer classification because the same paymaster can sponsor different flows.

  Entity Erc4337SmartAccount :: $network+address ; $network! $:EvmNetwork, address! p:evmAddress, userOperationsCount? p:num, $contract! $:EvmContract, $factory? $:Erc4337AccountFactory
    Sources :: Blockscout_Rest
    View :: Erc4337SmartAccountView top `<dl>` shows address title/value, Blockscout-indexed user operation count, factory via Erc4337AccountFactoryView, and account contract via EvmContractView; no details tabs today. Account-scoped operation history should be added only when a source exposes account-scoped pagination.
    Notes :: This is an ERC-4337 sender/account role over an EVM contract/account address, not a replacement for EvmAccount or EvmContract. userOperationsCount is Blockscout-indexed activity and should not be treated as EntryPoint protocol state.

  Entity EthereumBeaconFinality_Timestamp :: $network+timestampMs ; $network! $:EvmNetwork, timestampMs! p:num, currentJustifiedCheckpointEpoch! p:num, currentJustifiedCheckpointRoot! p:hex, previousJustifiedCheckpointEpoch! p:num, previousJustifiedCheckpointRoot! p:hex, finalizedCheckpointEpoch! p:num, finalizedCheckpointRoot! p:hex
    Sources :: Beacon_Rest
    View :: EthereumBeaconFinality_TimestampView title/value shows the finalized BeaconEpoch; top `<dl>` shows as-of timestamp, current justified BeaconEpoch/root, finalized BeaconEpoch/root, and previous justified BeaconEpoch/root. EthereumBeaconFinality_TimestampsView lists recent snapshots inside EvmNetworkView -> Consensus & Block Production -> Finality.
    Notes :: Beacon finality is a head-state observation from a consensus REST endpoint. Checkpoint roots are consensus block roots, not execution block hashes; keep finalized/current/previous checkpoints on this timestamp row rather than copying them onto EvmNetwork identity.

  Entity EthereumConsensusUpgrade :: $network+upgradeId ; $network! $:EvmNetwork, upgradeId! p:str, name! p:str, slug! p:str, activationBlock? p:num, activationTimestampMs? p:num, activationEpoch? p:num, previousForkVersion? p:str, currentForkVersion? p:str, protocol? p:enum, linkEthereumOrg? p:url, linkConsensusDocs? p:url, linkForkcast? p:url, $$proposals* $:SpecificationProposal
    Sources :: Constants_Internal, Beacon_Rest, EthereumConsensusSpecs_Github, EthereumEips_Github, EthForks_Rest
    View :: EthereumConsensusUpgradeView top `<dl>` shows network, name, slug, protocol, activation block/timestamp/epoch, previous/current fork versions, and links. Details tabs: Proposals -> SpecificationProposal list; Fork versions -> Beacon REST evidence; Network upgrade -> EthereumNetworkUpgradeView when linked; Docs -> consensus-spec and ethereum.org links.
    Notes :: Consensus upgrade rows describe Beacon-chain fork identity and activation metadata for one EVM network. Beacon REST can source fork versions and activation-era state on live networks; constants and spec repositories carry catalog links and proposal references. Do not duplicate execution-layer fork hashes here.

  Entity EthereumExecutionUpgrade :: $network+upgradeId ; $network! $:EvmNetwork, upgradeId! p:str, name! p:str, slug! p:str, activationBlock? p:num, activationTimestampMs? p:num, activationEpoch? p:num, protocol? p:enum, layer? p:enum, forkHash? p:str, linkEthereumOrg? p:url, linkExecutionDocs? p:url, linkForkcast? p:url, executionSpecsPinnedMarkdownFilename? p:str, executionSpecsMainnetUpgradeMarkdown? p:str, $$proposals* $:SpecificationProposal
    Sources :: Constants_Internal, EthereumExecutionSpecs_Github, EthereumEips_Github, EthForks_Rest, Voltaire_JsonRpc
    View :: EthereumExecutionUpgradeView top `<dl>` shows network, name, slug, protocol, layer, activation block/timestamp/epoch, fork hash, and links. Details tabs: Proposals -> SpecificationProposal list; Execution spec -> pinned markdown/body; Network upgrade -> EthereumNetworkUpgradeView when linked; Activation evidence -> JSON-RPC/fork catalog evidence.
    Notes :: Execution upgrade rows describe execution-layer fork identity, activation boundaries, fork hash, and spec markdown for one EVM network. Fork catalogs and constants can seed historical upgrades; JSON-RPC can verify chain/network/fork behavior only where clients expose enough fork context. Keep consensus fork versions on EthereumConsensusUpgrade.

  Entity EthereumNetworkUpgrade :: $network+upgradeId ; $network! $:EvmNetwork, upgradeId! p:str, name! p:str, slug! p:str, activationBlock? p:num, activationTimestampMs? p:num, activationEpoch? p:num, $networkExecutionUpgrade! $:EthereumExecutionUpgrade, $networkConsensusUpgrade? $:EthereumConsensusUpgrade, $$proposals* $:SpecificationProposal
    Sources :: Constants_Internal, EthereumExecutionSpecs_Github, EthereumConsensusSpecs_Github, EthereumEips_Github, Beacon_Rest, EthForks_Rest
    View :: EthereumNetworkUpgradeView top `<dl>` shows network, name, slug, activation block/timestamp/epoch, execution upgrade, and optional consensus upgrade. Details tabs: Execution -> EthereumExecutionUpgradeView; Consensus -> EthereumConsensusUpgradeView; Proposals -> SpecificationProposal list; Network -> EvmNetworkView.
    Notes :: Network upgrade rows join the execution and consensus upgrade surfaces for the same named network event. They are navigation/composition rows, not a third source of fork fields; derive detailed execution and consensus facts from the linked upgrade rows.

  Entity EvmAbi :: abiHash ; abiHash! p:hex32, json! p:json, source? p:str, $$members* $:ContractInterfaceMember, $$functions* $:EvmSelector, $$errors* $:EvmError, $$topics* $:EvmTopic
    Sources :: Sourcify_Rest, Etherscan_Rest, Blockscout_Rest, Local_Internal
    View :: EvmAbiView currently renders inline ABI entries for EvmContractView and ENS resolver ABI records: entry count plus list entries showing type, name/signature-ish parameter summary, and state mutability. If promoted to an entity, EvmAbiView should add a top `<dl>` for abiHash and source, then tabs for ContractInterfaceMember rows and derived EvmSelector, EvmError, and EvmTopic refs.
    Notes :: `src/schema/EvmAbi.ts` is an ArkType ABI value shape, not a registered EntityType. Keep this mock row only as a future content-addressed ABI object if ABI reuse/deduplication becomes important; current contract and ENS views consume ABI JSON inline. Selector/topic derivation is pure from ABI signatures, while ABI membership comes from verified/source-provided JSON or local checked-in catalogs.

  Entity EvmAccount :: address | address+interopAddress ; address! p:evmAddress, interopAddress! p:str, $primaryName? $:EnsName, $icon? $:Media, $$ensNamesOwned* $:EnsName
    Sources :: Voltaire_JsonRpc, TheGraph_Graphql
    View :: EvmAccountView icon shows ENS avatar or generated blockie; value shows ENS primary name or truncated address. Top `<dl>` is intentionally sparse for global address identity. Details use CollapsibleTabs: Identity -> ENS names owned; Balances -> BalancesView slices over selected EvmNetworkAccount rows by chain plus flattened EvmNetworkActorCoinBalance rows when available; Activity -> per-chain EvmNetworkAccountView, EvmTransactionsView, EvmTokenTransfersView, and EvmInternalTransfersView.
    Notes :: Global EVM address identity. It must not imply a wallet, human, protocol, contract, signing authority, or per-chain state by itself. Per-chain balances, activity, contract status, and transaction lists belong on EvmNetworkAccount or EvmContract; wallet-exposed authority belongs on BlockheadWalletAccount/BlockheadWalletConnection.

  Entity EvmActorCoinAllowance :: $actor+$contract+$spender+interopAddress ; $actor! $:EvmAccount, $contract! $:EvmContract, $actorCoin! $:EvmNetworkActorCoinBalance, $spender! $:EvmAccount, interopAddress! p:str, allowance! p:bigint, lastChecked! p:num, $spenderContract? $:EvmContract
    Sources :: Voltaire_JsonRpc
    View :: EvmActorCoinAllowanceView(summary allowance amount, owner EvmNetworkAccountView, spender address with optional spender-contract link, asset EvmContractView, allowance value, last-checked timestamp, overview empty/unresolved state)
    Notes :: Implemented scalar eth_call allowance(owner, spender) read for one explicit owner/token/spender triple. interopAddress currently duplicates the normalized spender key in the selector; do not add account-level allowance lists or approval history until a source indexes Approval events or exposes allowance discovery.

  Entity EvmBlob :: $network+txHash+blobIndex ; $network! $:EvmNetwork, txHash! p:hex32, blobIndex! p:num, versionedHash! p:hex32, $transaction! $:EvmTransaction, $block! $:EvmBlock, kzgCommitment? p:str, blobDataStorageReferences? p:json
    Sources :: Voltaire_JsonRpc, Blobscan_Rest
    View :: EvmBlobView top `<dl>` shows blobIndex, Blobscan kzgCommitment, blobDataStorageReferences, and transaction link when expanded. Details use `CollapsibleTabs`: Blob primer explains EIP-4844 semantics; Route renders route child content. `EvmBlobsView` is the Blobs tab in `EvmNetworkView` -> Data Availability.
    Notes :: Blob selector is network + transaction hash + blob index. This is the concrete EIP-4844 sidecar row for EVM networks: versionedHash is the execution-visible blob commitment identifier, while KZG commitment and storage references are Blobscan indexer enrichment. Do not merge this with contract storage, calldata, IPFS, 0G data roots, or a generic DA commitment model.

  Entity EvmBlock :: $network+blockNumber | $network+hash ; $network! $:EvmNetwork, blockNumber! p:bigint, hash! p:hex32, parentHash? p:hex32, $parent? $:EvmBlock, timestamp? p:num, $miner? $:EvmAccount, gasUsed? p:bigint, gasLimit? p:bigint, baseFeePerGas? p:bigint, blobGasUsed? p:bigint, excessBlobGas? p:bigint, transactionCount? p:num, $$transactions* $:EvmTransaction
    Sources :: Voltaire_JsonRpc, Blockscout_Rest, ZeroGChain_JsonRpc
    View :: EvmBlockView(summary block number/hash, transaction count, timestamp, gas/base fee/blob gas, parent block, miner/validator account, chain tab, transactions tab)
    Notes :: EVM blocks are sourced from execution RPC block lookups and explorer block-detail/list endpoints; ZeroGChain_JsonRpc mirrors the EVM-compatible 0G execution block shape. The implemented schema also carries `number` as a block-number alias. Keep EIP-1559 baseFeePerGas and EIP-4844 blob gas header fields on the block because they describe fee-market context, while per-transaction effective gas lives on EvmTransaction.

  Entity EvmCalldata :: hex ; hex! p:hex
    Sources :: Local_Internal, Voltaire_JsonRpc, Blockscout_Rest, Etherscan_Rest
    View :: EvmCalldataView(summary raw hex, contract call data length in bytes, raw call/input data when open)
    Notes :: Raw calldata is the byte payload used by transaction inputs, trace call inputs, and locally composed wallet calls. Keep selector links, decoded arguments, and interface-member refs out of this row unless ABI/source context is modeled explicitly; raw bytes alone do not prove call intent.

  Entity EvmCoinInstance :: $network+type | $network+type+$contract ; $network! $:EvmNetwork, type! p:enum, $contract? $:EvmContract, coinId! p:enum, name? p:str, symbol! p:str, decimals! p:num, $icon? $:MediaObject, caip19? p:str, representation? p:enum, $canonicalInstance? $:EvmCoinInstance, $$marketsWithInstanceAsBase+ $:Market, $$marketsWithInstanceAsQuote+ $:Market, $$outboundBridgeCapabilities+ $:CoinBridgeCapability, $$inboundBridgeCapabilities+ $:CoinBridgeCapability
    Sources :: Constants_Internal, Allium_Rest, Blockscout_Rest, Etherscan_Rest, Coingecko_Rest, Lifi_Rest
    View :: EvmCoinInstanceView(summary icon and symbol/name fallback, chain, native/token contract kind, name, symbol, decimals, CAIP-19, representation, canonical deployment, Bridging tabs for outbound/inbound CoinBridgeCapabilitiesView)
    Notes :: Implemented EVM deployment of a catalog Coin. Native currency and ERC-20 selectors differ. Constants cover native deployments, indexed balance/transfer sources can surface token metadata, Coingecko maps coin deployment/canonical representation, and LiFi backs bridge capability lists. Markets-with-instance lists are declared but not fully indexed.

  Entity EvmContract :: $network+address ; $network! $:EvmNetwork, address! p:evmAddress, precompileName? p:str, $deployer? $:EvmAccount, $creationTransaction? $:EvmTransaction, $implementation? $:EvmContract, codeHash? p:hex32, code? p:hex, abi? p:json, storageSlotReads* p:{slot:hex,value:hex}, $verification? $:EvmContractVerification
    Sources :: Constants_Internal, Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Sourcify_Rest
    View :: EvmContractView top `<dl>` shows chain id, precompile address when applicable, deployer, creation transaction, implementation contract, inline ABI via EvmAbiView, bytecode hash, and truncated runtime bytecode. It currently does not mount a dedicated verification/source tab; title fallback reads precompile name, Sourcify compilation fullyQualifiedName/name, then account address.
    Notes :: Precompile names are catalog facts; runtime bytecode and storage reads are chain state; deployer, creation transaction, implementation, ABI, and verification are explorer/source-enriched facts that can disagree across providers. Keep ABI JSON and storageSlotReads inline for the current view, while richer interface-member, token-standard, storage-history, opcode, and trace models need their own sourceable rows.

  Entity EvmContractCompilation :: $contract ; $contract! $:EvmContract, language? p:str, compiler? p:str, compilerVersion? p:str, name? p:str, fullyQualifiedName? p:str, compilerSettingsJson? p:str, storageLayoutJson? p:str
    Sources :: Sourcify_Rest
    View :: EvmContractCompilationView top `<dl>` shows language, compiler, compiler version, fully qualified name, truncated compiler settings JSON, and truncated storage layout JSON; title/value fall back from fullyQualifiedName to name to language.
    Notes :: This row represents one verification-backed compiler invocation for a contract, including language, compiler identity, compiler settings, storage layout, and fully qualified contract name. It is not a receipt-derived execution fact and is not yet keyed as a reusable global compilation artifact.

  Entity EvmContractSourceBundle :: $contract ; $contract! $:EvmContract, files! p:record<str,str>
    Sources :: Sourcify_Rest
    View :: EvmContractSourceBundleView top `<dl>` shows first source filename/file count, then a Source files section where each path expands to source text preview. It is mounted from EvmContractVerificationView Details, not directly from EvmContractView today.
    Notes :: This is the human-readable source file map that matched the contract verification, keyed by source path. Language, compiler, settings, and storage layout belong on EvmContractCompilation; a bundle hash selector only becomes necessary if multiple reusable source bundles are modeled independently.

  Entity EvmContractVerification :: $contract ; $contract! $:EvmContract, match? p:str, creationMatch? p:str, runtimeMatch? p:str, verifiedAtMs? p:num, matchId? p:str, $compilation? $:EvmContractCompilation, $sourceBundle? $:EvmContractSourceBundle
    Sources :: Sourcify_Rest
    View :: EvmContractVerificationView top `<dl>` shows match, creation match, runtime match, verified timestamp, and match id; Details sections mount EvmContractCompilationView and EvmContractSourceBundleView. The value label falls back to "Verified source" when no match string is present.
    Notes :: This is an off-chain attestation that published source and compilation metadata match creation/runtime bytecode; the chain stores bytecode and logs, not the verification claim. $compilation and $sourceBundle point to contract-scoped rows in the same verification family; source/provider keys become necessary only when multiple concurrent verification providers per contract are represented.

  Entity EvmError :: hex ; hex! p:hex4, signatures* p:str
    Sources :: Openchain_Rest
    View :: EvmErrorView(summary first candidate signature or selector hex, selector hex, candidate signatures list, empty state when no catalog match)
    Notes :: Error selectors share the 4-byte selector space with functions but appear in revert payloads. Openchain_Rest returns candidate signatures, with error-specific filtering in the resolver/view path. Keep them as a separate view/entity family so UI copy and evidence stay tied to failure output. Revert payload decoding and verified contract ABI context are future enrichment, not current field fulfillment.

  Entity EvmInternalTransfer :: $network+txHash+internalIndex ; $network! $:EvmNetwork, txHash! p:hex32, internalIndex! p:num, $from? $:EvmAccount, $to? $:EvmAccount, value! p:bigint, callType! p:enum, success? p:bool, $createdContract? $:EvmContract when callType=Create|Create2
    Sources :: Blockscout_Rest, Etherscan_Rest
    View :: EvmInternalTransferView title/value shows internal index; top `<dl>` shows parent transaction link derived from selector txHash, internal index, call type label, success, and created EvmContractView for create/create2 calls. EvmInternalTransfersView lists rows under EvmTransactionView, EvmNetworkAccountView, and EvmAccountView activity slices.
    Notes :: Internal transfers are value-moving calls derived from explorer internals or trace-derived indexes, not signed transactions. The schema does not store `$transaction`; views derive transaction navigation from `$network` and txHash. Full call-tree topology belongs on EvmTransaction.traceRoot or normalized EvmTrace rows, while this row stays a transaction-scoped value movement.

  Entity EvmLog :: $network+txHash+logIndex ; $network! $:EvmNetwork, txHash! p:hex32, logIndex! p:num, $transaction? $:EvmTransaction, $block? $:EvmBlock, topics! p:hex32[], data? p:hex, blockNumber? p:bigint, blockHash? p:hex, transactionIndex? p:num, removed? p:bool, $emitter? $:EvmContract, $$tokenTransfers* $:EvmTokenTransfer
    Sources :: Voltaire_JsonRpc, Blockscout_Rest, Etherscan_Rest
    View :: EvmLogView(summary receipt log index plus topic0 EvmTopicView when topics[0] exists, transaction link, emitter contract, topics list with topic links, data, token transfers via EvmTokenTransfersView, ABI decode section using topic0 catalog signatures and emitter ABI from Sourcify/Etherscan when open)
    Notes :: Receipt logs are emitted by EVM LOG opcodes and keyed by transaction hash plus log index. Topic0 is derived in the view from `topics[0]`, not a stored `$topic0` field. ABI decode is contextual, best-effort, and view-only: decoded params are not stored EvmLog fields, and catalog-signature decode is not authoritative without emitter ABI/source context. Token-transfer children are indexed interpretations of known Transfer/TransferSingle/TransferBatch conventions.

  Entity EvmNetwork :: caip2 ; slug? p:str, name? p:str, caip2! p:{namespace:'eip155',reference:str}, namespace! p:'Evm', environment? p:enum, $icon? $:MediaObject, $nativeCoin? $:Coin, $nativeCoinInstance? $:EvmCoinInstance, executionEndpoints+ p:{url:url,serviceProvider:enum,transportType:enum}, consensusEndpoints+ p:{restBaseUrl:url,consensusProtocol:enum}, $$rpcUrls* $:Url, $$blockExplorerUrls* $:Url, $$faucetUrls* $:Url, $$nativeAssets* $:AssetInstance, $$testnets* $:Network, $parent? $:Network, $mainnet? $:Network, $$siblingShardNetworks* $:EvmNetwork, shortName? p:str, registryStatus? p:str, peeringId? p:num, slip44? p:num, $$upgrades* $:EthereumNetworkUpgrade, $$executionUpgrades* $:EthereumExecutionUpgrade, $$consensusUpgrades* $:EthereumConsensusUpgrade, consensusProtocol? p:enum, consensusSpecsConfigYaml? p:str, goEthereumParamsConfigGo? p:str, hasBlobParameterExecutionUpgrade? p:bool, $$bridges* $:EvmNetworkBridge, $rollup? $:EvmRollup, $$settledRollups* $:EvmRollup, $$timestamps+ $:EvmNetwork_Timestamp, $$blocks* $:EvmBlock, $$transactions* $:EvmTransaction, $$contracts* $:EvmContract, $$precompiles* $:EvmContract, $$blobs* $:EvmBlob, $$gasFeeBlocks+ $:EvmNetwork_GasFee_Block, $$gasEstimateTimestamps+ $:EvmNetwork_GasEstimate_Timestamp, $$txpoolTimestamps+ $:EvmNetwork_Txpool_Timestamp, $$erc20TokenTransfers* $:EvmTokenTransfer, $$nftTokenTransfers* $:EvmTokenTransfer, $$erc4337SmartAccounts* $:Erc4337SmartAccount, $$erc4337Bundlers* $:Erc4337Bundler, $$erc4337Paymasters* $:Erc4337Paymaster, $$erc4337AccountFactories* $:Erc4337AccountFactory, $$userOperations* $:EvmUserOperation, $$beaconFinalityTimestamps* $:EthereumBeaconFinality_Timestamp, $$beaconEpochs* $:BeaconEpoch, $$beaconSlots* $:BeaconSlot, $$beaconCommittees* $:BeaconCommittee, $$beaconSyncCommittees* $:BeaconSyncCommittee, $$beaconAttestations* $:BeaconAttestation, $$beaconWithdrawals* $:BeaconWithdrawal, $$beaconSlashings* $:BeaconSlashing, $$beaconValidators* $:BeaconValidator, $$mevRelays* $:MevRelay, $$mevBuilders* $:MevBuilder, $$mevProposerPayloadDelivered* $:MevRelay_ProposerPayloadDelivered
    Sources :: Constants_Internal, Chainlist_Rest, EthereumLists_Rest, Superchain_Github, Lifi_Rest, L2Beat_Rest, EthereumSpecs_Github, Voltaire_JsonRpc, Blockscout_Rest, Etherscan_Rest, Beacon_Rest, MevRelay_Rest
    View :: EvmNetworkView(summary current upgrade, head block, consensus slot/finality, gas/txpool, environment, native coin/asset, parent/mainnet/rollup hints; Execution tabs: Upgrades, Blocks, Transactions, Mempool, Fee market, Endpoints; Consensus & Block Production tabs: Upgrades, Finality, Committees, Sync committees, Attestations, Withdrawals, Slashings, Validators, Epochs, Slots, Relays, Builders, MEV-Boost, Endpoints; Data Availability tabs: Blobs; Contracts & Accounts tabs: Precompiles, Verified contracts, Smart accounts, Bundlers, Paymasters, User operations, Factories; Assets tabs: Native coin, Bridges, ERC-20 transfers, NFT transfers; Resources tabs: Faucets, Block explorers; Topology tabs: Upgrades, Parent, Rollup, Shards, Testnets, Mainnet, Layers, Settled rollups). Rollup and settled-rollup tabs should show EvmRollup compatibility cards only; architecture detail belongs in ScalingDeploymentView when implemented.
    Notes :: EvmNetwork identity is CAIP-2 eip155 network identity plus registry/catalog metadata, endpoints, topology refs, and browseable child lists. Live head, gas, txpool, finality, MEV, transaction, block, blob, contract, token-transfer, and account-abstraction data stay in child rows or timestamp/block rows. L2Beat and registry mappings can attach rollup compatibility refs, but settlement/data-availability/sequencer/proof architecture belongs on ScalingDeployment rather than on the network header.

  Entity EvmNetwork_GasEstimate_Timestamp :: $network+timestampMs ; $network! $:EvmNetwork, timestampMs! p:num, slowGwei? p:num, averageGwei? p:num, fastGwei? p:num, transport? p:str
    Sources :: Blockscout_Rest, Etherscan_Rest
    View :: EvmNetwork_GasEstimate_TimestampView(summary slow/average/fast gwei, observation timestamp, transport/source methodology)
    Notes :: Gas oracle tiers are source-methodology observations. Blockscout stats gas_prices and Etherscan gasoracle clocks should stay on timestamp rows rather than EvmNetwork identity.

  Entity EvmNetwork_GasFee_Block :: $network+blockNumber ; $network! $:EvmNetwork, blockNumber! p:bigint, baseFeePerGas? p:bigint, legacyGasPrice? p:bigint, maxPriorityFeePerGas? p:bigint, gasUsedRatio? p:num, priorityFeeRewardAt50thPercentile? p:bigint, baseFeePerBlobGas? p:bigint, blobGasUsedRatio? p:num
    Sources :: Voltaire_JsonRpc
    View :: EvmNetwork_GasFee_BlockView(summary base fee/gas price, block number, gas used ratio, priority fee percentile, blob base fee, blob gas used ratio)
    Notes :: Block-scoped fee data comes from execution JSON-RPC methods such as eth_feeHistory, eth_gasPrice, and eth_maxPriorityFeePerGas. EIP-1559 and EIP-4844 explain fee mechanics but are not resolver sources.

  Entity EvmNetwork_Timestamp :: $network+timestampMs ; $network! $:EvmNetwork, timestampMs! p:num, blockHeight! p:bigint
    Sources :: Voltaire_JsonRpc
    View :: EvmNetwork_TimestampView(summary chain/head height, observation time, source freshness)
    Notes :: Head height is an execution RPC observation sampled at timestampMs. Keep it off EvmNetwork identity because different RPC endpoints can lag or disagree briefly.

  Entity EvmNetwork_Txpool_Timestamp :: $network+timestampMs ; $network! $:EvmNetwork, timestampMs! p:num, pendingCount! p:num, queuedCount! p:num
    Sources :: Voltaire_JsonRpc
    View :: EvmNetwork_Txpool_TimestampView(summary pending/queued counts, observation timestamp, unsupported-source empty state)
    Notes :: txpool_status is client-local mempool state. Pending and queued counts are endpoint observations, not consensus data and not network identity.

  Entity EvmNetworkAccount :: $network+$actor ; $network! $:EvmNetwork, $actor! $:EvmAccount, transactionCount? p:bigint, firstTransactionAt? p:num, lastTransactionAt? p:num, tokenTransferCount? p:num, isContract? p:bool, nftCount? p:num, $$transactions* $:EvmTransaction, $$tokenTransfers* $:EvmTokenTransfer, $$internalTransfers* $:EvmInternalTransfer, $$ownedCoins* $:EvmNetworkActorCoinBalance, $$erc20TokenAllowances* $:EvmActorCoinAllowance, contractPositions* p:json
    Sources :: Blockscout_Rest, Etherscan_Rest, Allium_Rest, Voltaire_JsonRpc
    View :: EvmNetworkAccountView(icon/name: actor ENS/blockie plus network icon; summary: address on network, transaction/token/NFT counts, first/last activity, contract link when isContract; sections: Balances tabs for Tokens and Positions, Activity tabs for Transactions, Token transfers, Internal transfers)
    Notes :: This is the chain-scoped state of one EVM address. Activity counts and contract detection are indexer/provider observations, while allowance rows are scalar only when owner/token/spender are known because historical Approval lists are not wired as a complete account facet. EIP-7702 delegation authorizations are not implemented as an account-level child list today; they belong to SetCode transaction authorization tuples or future delegation-state observations.

  Entity EvmNetworkActorCoinBalance :: $actor+$network | $actor+$contract ; $actor! $:EvmAccount, $network! $:EvmNetwork, $contract? $:EvmContract, $coinInstance! $:EvmCoinInstance, symbol! p:str, decimals! p:num, balance! p:bigint, usdValue? p:num
    Sources :: Allium_Rest, Voltaire_JsonRpc
    View :: EvmNetworkActorCoinBalanceView(summary formatted balance/symbol, account link, native asset or token contract, balance, USD value, decimals, overview empty state)
    Notes :: Implemented balance row for one EVM actor and one native or token coin instance. Allium provides indexed current wallet balances and token metadata; execution RPC can support explicit eth_getBalance or ERC-20 balanceOf selector checks when wired. Historical balances use separate EvmNetworkActorCoinBalance_EvmBlock selectors; do not put a block-balance list on this row until a resolver exposes that relationship.

  Entity EvmNetworkActorCoinBalance_EvmBlock :: $actorCoin+$block ; $actorCoin! $:EvmNetworkActorCoinBalance, $block! $:EvmBlock, balance! p:bigint, usdValue? p:num
    Sources :: Allium_Rest, Voltaire_JsonRpc
    View :: nested balance-history subview under EvmNetworkActorCoinBalanceView with block link, balance at block, and USD value when sourced
    Notes :: Implemented historical balance selector for an actor-coin row at a concrete EVM block. Allium can provide historical balance snapshots; archive execution RPC can support eth_getBalance or ERC-20 balanceOf at block when wired. Treat USD value as an indexer valuation snapshot, not an on-chain field.

  Entity EvmNetworkBridge :: $fromNetwork+$toNetwork+url ; $fromNetwork! $:EvmNetwork, $toNetwork! $:EvmNetwork, url! p:url, relationshipType? p:str
    Sources :: Chainlist_Rest
    View :: EvmNetworkBridgeView(summary source/target networks, bridge URL, registry relationship type; EvmNetworkBridgesView list under EvmNetworkView Assets > Bridges)
    Notes :: Registry bridge URL metadata is a navigation/link relationship, not proof of a canonical bridge protocol deployment. Canonical bridge architecture belongs on bridge/deployment-specific rows when source-backed.

  Entity EvmNft :: $contract+tokenId ; $contract! $:EvmContract, tokenId! p:str, standard! p:enum, format! p:enum, tokenUri? p:url, name? p:str, description? p:str, image? p:url, agentRegistry? p:str, agentId? p:str, agentUri? p:url, contactEndpoint? p:url, $agentWallet? $:EvmAccount, x402Support? p:bool, active? p:bool, supportedTrust? p:str[], registrationTypeIri? p:str, fetchedAt? p:num
    Sources :: Eip8004Scan_Rest
    View :: Eip8004RegistrationView top `<dl>` shows contract, token id, standard, format, token URI, name, description, image, fetched time, registry, agent id/URI, contact endpoint, agent wallet, x402 support, active flag, supported trust, and registration type IRI; Eip8004RegistrationsView lists agent-registration NFTs.
    Notes :: EVM contract+tokenId is the selector. The current concrete use is EIP-8004 agent-registration metadata, where conditional agent fields are valid only when format is Eip8004Registration. Keep generic collection/token modeling in NftCollection/NftToken and use this row when EVM standard/format-specific fields are needed.

  Entity EvmProtocol :: scope ; scope! p:'EvmProtocol', protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str, $$evmTopics+ $:EvmTopic, $$evmSelectors+ $:EvmSelector, $$evmErrors+ $:EvmError
    Sources :: Constants_Internal, Local_Internal, Openchain_Rest
    View :: EvmProtocolView(summary EVM registry/protocol metadata, counts for topics/selectors/errors, home/docs/topology; Details tabs: Topics, Selectors, Errors)
    Notes :: Singleton protocol hub and browse surface for ABI hash catalogs. It is not an EVM network, execution environment, contract deployment, or source of canonical transaction state.

  Entity EvmRollup :: $network+projectId ; $network! $:EvmNetwork, projectId! p:str, $settlementNetwork? $:EvmNetwork, name? p:str, slug? p:str, type? p:str, category? p:str, hostChain? p:str, isArchived? p:bool, isUpcoming? p:bool, isUnderReview? p:bool
    Sources :: L2Beat_Rest
    View :: EvmRollupView top `<dl>` shows L2Beat name, type, category, host chain, settlement network, and under-review flag. EvmNetworkView Topology tabs use $rollup and $$settledRollups from L2Beat for compatibility placement and empty states. Do not add DA, sequencer, bridge, verifier, forced-inclusion, or challenge sections here; those belong to ScalingDeployment once config-backed rows exist.
    Notes :: Compatibility projection over L2Beat project ids, not canonical rollup architecture. Keep `projectId`, `type`, `category`, `hostChain`, and status flags source-scoped to L2Beat. Do not treat them as Network identity, bridge deployment, DA evidence, sequencer truth, forced-inclusion support, fraud/validity proof configuration, or canonical "layer" ontology. `EvmRollup` does not currently expose `$scalingDeployment` in src/schema.

  Entity EvmSelector :: hex ; hex! p:hex4, signatures* p:str
    Sources :: Openchain_Rest
    View :: EvmSelectorView(summary first candidate signature or selector hex, selector hex, candidate signatures list, empty state when no catalog match)
    Notes :: Implemented schema stores possible signatures, not one canonical match. Selector catalogs are ambiguous; verified contract ABI or interface context is needed before presenting a decode as authoritative.

  Entity EvmStorageRead_Timestamp :: $contract+slot+timestampMs+source ; $contract! $:EvmContract, slot! p:hex32, timestampMs! p:num, source! p:str, value? p:hex32, blockNumber? p:bigint
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest
    View :: EvmStorageRead_TimestampView top `<dl>` shows contract, slot, value, block number, source, and observation timestamp. Details tabs: Contract -> EvmContractView; Storage layout -> EvmContractCompilationView when verified compilation metadata labels the slot.
    Notes :: Storage values are execution-state observations from eth_getStorageAt-style transports, scoped by contract, slot, source, and observation time, with blockNumber carrying the returned/read coordinate when available. Sourcify storageLayoutJson can explain slot meaning through EvmContractCompilation, but it does not fulfill storage values.

  Entity EvmTokenTransfer :: $network+txHash+logIndex+transferIndex ; $network! $:EvmNetwork, txHash! p:hex32, logIndex! p:num, transferIndex! p:num, standard! p:enum, $from? $:EvmAccount, $to? $:EvmAccount, $tokenContract? $:EvmContract, $coinInstance? $:EvmCoinInstance, amount! p:bigint, tokenId? p:bigint when standard=ERC-721|ERC-1155, tokenSymbol? p:str, tokenName? p:str, tokenDecimals? p:num
    Sources :: Blockscout_Rest, Etherscan_Rest
    View :: EvmTokenTransferView(summary log index and transfer index, parent transaction link from selector txHash, standard label, amount, token id for ERC-721/ERC-1155, from/to EvmNetworkAccountView, token contract, coin instance, token metadata)
    Notes :: Token transfers are indexed interpretations of ERC-20/721/1155 Transfer, TransferSingle, and TransferBatch log conventions. transferIndex disambiguates ERC-1155 batch items and indexer-expanded transfers under one log. The implemented schema does not store `$transaction` or `$log`; views derive navigation from `$network`, txHash, and logIndex. Metadata fields are source conveniences; token identity should resolve through `$tokenContract`/`$coinInstance` when available.

  Entity EvmTopic :: hex ; hex! p:hex32, signatures* p:str
    Sources :: Openchain_Rest
    View :: EvmTopicView(summary first candidate signature or topic hex, topic hash, candidate signatures list, empty state when no catalog match)
    Notes :: Implemented schema stores candidate `signatures` as a list from Openchain_Rest plus its 4byte.directory fallback. A 32-byte topic is log vocabulary; do not merge it with 4-byte calldata/error selectors even when both derive from ABI signatures. Verified contract ABIs are contextual decode evidence, not current field fulfillment on this row.

  Entity EvmTrace :: $transaction+traceAddress ; $transaction! $:EvmTransaction, traceAddress! p:str, index! p:num, type? p:enum, from? p:evmAddress, to? p:evmAddress, value? p:hex, gas? p:bigint, gasUsed? p:bigint, input? p:hex, output? p:hex, error? p:str, $$children* $:EvmTrace
    Sources :: Voltaire_JsonRpc
    View :: EvmTraceView should mirror EvmTraceContentView inside EvmTraceTreeView: summary call type/index/error, top `<dl>` for from/to accounts, value, gas, gas used, input selector candidates, raw input/output, and recursive child calls from $$children. EvmTransactionView Trace tab currently renders EvmTraceTreeView from the inline traceRoot JSON, not EvmTrace entity rows.
    Notes :: Normalized trace rows would be derived from debug_traceTransaction callTracer trees, preserving child index order as traceAddress path segments. Blockscout_Rest and Etherscan_Rest internal transaction APIs are lower-fidelity transfer/index mirrors and should fulfill EvmInternalTransfer unless a full call-tree endpoint is wired. `traceAddress` should be a stable path like `0` or `0.2.1`; `index` is only sibling order.

  Entity EvmTransaction :: $network+txHash ; $network! $:EvmNetwork, txHash! p:hex32, envelopeType! p:enum, kind! p:enum, $from! $:EvmAccount, $to? $:EvmAccount, value! p:bigint, nonce? p:num, transactionIndex? p:num, gas? p:bigint, gasPrice? p:bigint, gasUsed? p:bigint, cumulativeGasUsed? p:bigint, effectiveGasPrice? p:bigint, maxFeePerGas? p:bigint when envelopeType=FeeMarket|Blob|SetCode, maxPriorityFeePerGas? p:bigint when envelopeType=FeeMarket|Blob|SetCode, maxFeePerBlobGas? p:bigint when envelopeType=Blob, blobGasUsed? p:bigint when envelopeType=Blob, input? p:hex, r? p:hex, s? p:hex, v? p:str, executionStatus? p:enum, $block? $:EvmBlock, $contract? $:EvmContract, $$blobs* $:EvmBlob when envelopeType=Blob, $$logs* $:EvmLog, $$internalTransfers* $:EvmInternalTransfer, $$tokenTransfers* $:EvmTokenTransfer, $$userOperations* $:EvmUserOperation, traceRoot? p:json, traceUnavailable? p:bool
    Sources :: Voltaire_JsonRpc, ZeroGChain_JsonRpc, Blockscout_Rest, Etherscan_Rest
    View :: EvmTransactionView top `<dl>` shows kind/value/status/gas/block/from/to/contract/nonce/envelope/fees/input/signature/blob gas. Details use `CollapsibleTabs`: Movements -> EvmAssetMovementsView, Call -> EvmTransactionInputDecode, Events -> EvmLogsView, Trace -> EvmTraceTreeView when traceRoot exists or unavailable/empty messages, Blobs -> EvmBlobsView, User operations -> EvmUserOperationsView.
    Notes :: Signed execution-layer transaction keyed by network and tx hash. RPC sources provide transaction/receipt data, blob fields, and call traces when debug_traceTransaction-style support is available; explorer sources provide indexed receipts, logs, token transfers, internal transfers, and account-abstraction children. Keep `$from`, `$to`, and `executionStatus` as schema vocabulary; raw `from`, `to`, and `status` are source payload names. Trace data is currently inline `traceRoot` plus `traceUnavailable`; normalized EvmTrace rows remain the call-tree projection. EIP-7702 authorization rows are modeled separately, but EvmTransaction does not expose `$$authorizationList`.

  Entity EvmUserOperation :: $network+hash ; $network! $:EvmNetwork, hash! p:hex32, $bundledTransaction? $:EvmTransaction, $sender? $:Erc4337SmartAccount, $block? $:EvmBlock, timestampMs? p:num, successful? p:bool, fee? p:str, nonce? p:bigint, callGasLimit? p:bigint, verificationGasLimit? p:bigint, preVerificationGas? p:bigint, maxFeePerGas? p:bigint, maxPriorityFeePerGas? p:bigint, gas? p:bigint, gasUsed? p:bigint, gasPrice? p:bigint, entryPointVersion? p:str, $entryPoint? $:EvmContract, initCode? p:hex, callData? p:hex, sponsorType? p:str, paymasterAndData? p:hex, signature? p:hex, $paymaster? $:Erc4337Paymaster, $bundler? $:Erc4337Bundler
    Sources :: Blockscout_Rest
    View :: EvmUserOperationView top `<dl>` shows hash, success, bundled block via EvmBlockView, fee, nonce, and on expansion EntryPoint version, EntryPoint as EvmContractView, and sponsor type. Details currently stack related cards for bundled EvmTransactionView, sender Erc4337SmartAccountView, paymaster Erc4337PaymasterView, bundler Erc4337BundlerView, then gas/fee numeric fields and initCode/callData/paymasterAndData/signature; there are no tabbed subviews yet.
    Notes :: UserOperation is the ERC-4337 pseudo-transaction/intention object indexed by hash, distinct from the bundled EvmTransaction that includes it on-chain. EntryPoint is an EvmContract ref. ValidationData, deposits, stakes, aggregators, alt-mempool admission, simulation errors, ERC-7562 reputation, and paymaster postOp state need dedicated contract state or timestamped observation rows before they belong here.

  Entity ExecutionEnvironment :: executionEnvironmentId ; executionEnvironmentId! p:enum, label! p:str
    Sources :: Constants_Internal
    View :: ExecutionEnvironmentView should show execution environment id and label in a top `<dl>`; network views can link or inline this compact label where execution environment is a related field.
    Notes :: Catalog row for execution environment labels. It is not a network, VM runtime observation, client implementation, or protocol version history.

  Entity FarcasterCast :: hash | fid+hash | username+hashPrefix | clientUrl ; fid! p:num, hash! p:hex, username! p:str, hashPrefix! p:hex, clientUrl! p:url, $author! $:FarcasterUser, text! p:str, $parentCast? $:FarcasterCast, parentUrl? p:url, timestamp! p:num, mentions? p:num[], $$embeds* $:FarcasterCastEmbed, $$timestamps* $:FarcasterCast_Timestamp, threadHash? p:hex, $channel? $:FarcasterChannel, $postedViaApp? $:FarcasterUser, mentionedProfileFids? p:num[], mentionedChannelIds? p:str[]
    Sources :: Farcaster_Rest, Neynar_Rest, Snapchain_Rest
    View :: FarcasterCastView top `<dl>` shows fid, hash, username/hash-prefix or client URL selector context, author, text, timestamp, parent cast, parent URL, thread hash, channel, posted-via app, mentions, mentioned profiles/channels, embeds, and latest like/recast/reply snapshot. Details tabs: Parent/thread -> FarcasterCastView refs; Embeds -> FarcasterCastEmbed list; Author -> FarcasterUserView; Channel -> FarcasterChannelView; Metric snapshots -> FarcasterCast_TimestampsView.
    Notes :: `fid+hash` is the durable protocol identity for a cast. `hash`, `username+hashPrefix`, and `clientUrl` exist because different routes/indexers expose weaker lookup handles; they should resolve into fid+hash fields rather than become canonical social object identity. Raw Snapchain/Neynar protocol message payloads are resolver evidence for this row, not implemented child entities today.

  Entity FarcasterCast_Timestamp :: $cast+timestampMs ; $cast! $:FarcasterCast, timestampMs! p:num, likeCount? p:num, recastCount? p:num, replyCount? p:num
    Sources :: Neynar_Rest, Snapchain_Rest
    View :: FarcasterCast_TimestampView top `<dl>` shows cast, observation time, likes, recasts, and replies. FarcasterCastView shows latest counters and history through FarcasterCast_TimestampsView.
    Notes :: Engagement counters are observations. Do not fold them into `FarcasterCast`, and keep recasts distinct from source-specific repost/reblog terminology in other protocols.

  Entity FarcasterCastEmbed :: $cast+index ; $cast! $:FarcasterCast, index! p:num, url? p:url, $embeddedCast? $:FarcasterCast, title? p:str, description? p:str, $icon? $:Media, quotedPreviewText? p:str
    Sources :: Farcaster_Rest, Neynar_Rest, Snapchain_Rest
    View :: FarcasterCastEmbedView top `<dl>` shows parent cast, embed index, URL, embedded cast, title, description, icon, and quoted preview text. Details tabs: Embedded cast -> FarcasterCastView; URL/media -> UrlView or Media view when refs are resolved.
    Notes :: The selector is the parent cast plus embed index. Preserve order because Farcaster clients render embeds in payload order and quote/URL semantics differ.

  Entity FarcasterChannel :: id ; id! p:str, name! p:str, url? p:url, description? p:str, $icon? $:Media, $headerImage? $:Media, $lead? $:FarcasterUser, $moderator? $:FarcasterUser, $$moderators* $:FarcasterUser, createdAt? p:num, $$timestamps* $:FarcasterChannel_Timestamp, pinnedCastHash? p:str, publicCasting? p:bool, externalLinkTitle? p:str, externalLinkUrl? p:url, followedAt? p:num, $$casts* $:FarcasterCast
    Sources :: Farcaster_Rest, Neynar_Rest, Snapchain_Rest
    View :: FarcasterChannelView top `<dl>` shows id, name, URL, description, icon, header image, lead, moderator, created time, pinned cast hash, public-casting policy, external link, followed time, and latest follower/member snapshot. Details tabs: Casts -> FarcasterCastsView; Moderators -> FarcasterUsersView; Metric snapshots -> FarcasterChannel_TimestampsView.
    Notes :: The selector field is `id`, not `channelId`. `createdAt` and `followedAt` are lifecycle timestamps on the channel/user-follow context; follower/member counters belong on `FarcasterChannel_Timestamp`.

  Entity FarcasterChannel_Timestamp :: $channel+timestampMs ; $channel! $:FarcasterChannel, timestampMs! p:num, followerCount? p:num, memberCount? p:num
    Sources :: Farcaster_Rest
    View :: FarcasterChannel_TimestampView top `<dl>` shows channel, observation time, follower count, and member count. FarcasterChannelView shows latest counters and history through FarcasterChannel_TimestampsView.
    Notes :: Channel counters are observation rows. Keep them separate from channel profile fields and moderation fields so a channel page can compare current and historical membership metrics.

  Entity FarcasterFeed :: variant | variant+fid | variant+channelId | variant+viewerFid ; variant! p:enum, fid? p:num, channelId? p:str, viewerFid? p:num, label! p:str, $$entries+ $:FarcasterCast
    Sources :: Farcaster_Rest, Neynar_Rest, Snapchain_Rest
    View :: FarcasterFeedView top `<dl>` shows variant, fid, channel id, viewer fid, label, and entry count. Details tabs: Casts -> FarcasterCastsView.
    Notes :: Implemented feed request row. Feed entries are source/indexer snapshots and may be empty or policy-filtered; feed selectors are browse scopes, not protocol-native objects.

  Entity FarcasterNetwork :: scope ; scope! p:'FarcasterNetwork', protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str, $$feeds+ $:FarcasterFeed, $$users+ $:FarcasterUser, $$channels+ $:FarcasterChannel
    Sources :: Constants_Internal, Farcaster_Rest, Neynar_Rest, Snapchain_Rest
    View :: FarcasterNetworkView top `<dl>` shows protocol name, registry label, topology, home URL, docs URL, feed count, user count, channel count, and source coverage. Details tabs: Feeds -> FarcasterFeedsView; Users -> FarcasterUsersView; Channels -> FarcasterChannelsView.
    Notes :: Implemented singleton social protocol hub. It is a browse/source aggregation surface, not a Farcaster hub, signer registry, custody state, or global feed archive.

  Entity FarcasterUser :: fid ; fid! p:num, username? p:str, displayName? p:str, $icon? $:Media, bio? p:str, url? p:url, $primaryEvmAccount? $:EvmAccount, $$verifiedAddresses* $:FarcasterVerifiedAddress, $$timestamps* $:FarcasterUser_Timestamp, $$casts* $:FarcasterCast
    Sources :: Farcaster_Rest, Neynar_Rest, Snapchain_Rest
    View :: FarcasterUserView top `<dl>` shows fid, username, display name, icon, bio, URL, primary EVM account, verified addresses, and latest follower/following snapshot. Details tabs: Casts -> FarcasterCastsView; Verified addresses -> FarcasterVerifiedAddress rows; Metric snapshots -> FarcasterUser_TimestampsView.
    Notes :: `fid` is the stable user selector; username/displayName/bio/url/icon are mutable profile fields. Custody/signers/storage are protocol concepts but not implemented on this entity today; do not imply them through `FarcasterUser` until corresponding schema/resolvers exist. Verified addresses are explicit `FarcasterVerifiedAddress` rows and are not generic account-control proof outside Farcaster's attestation model.

  Entity FarcasterUser_Timestamp :: $user+timestampMs ; $user! $:FarcasterUser, timestampMs! p:num, followerCount? p:num, followingCount? p:num
    Sources :: Neynar_Rest, Snapchain_Rest
    View :: FarcasterUser_TimestampView top `<dl>` shows user, observation time, follower count, and following count. FarcasterUserView shows latest counters and history through FarcasterUser_TimestampsView.
    Notes :: Profile counters are timestamped observations, not fields on `FarcasterUser`. Keep one row per user/timestamp even when multiple sources can provide the same counter names.

  Entity FarcasterVerifiedAddress :: fid+protocol+address ; fid! p:num, protocol! p:enum, address! p:str, $user! $:FarcasterUser, $evmAccount? $:EvmAccount, $solanaAccount? $:SolanaAccount
    Sources :: Farcaster_Rest, Neynar_Rest, Snapchain_Rest
    View :: FarcasterVerifiedAddressView top `<dl>` shows fid, protocol, address, user, EVM account, and Solana account. Details tabs: User -> FarcasterUserView; Account -> EvmAccountView or SolanaAccountView when refs are resolved.
    Notes :: This row represents a Farcaster verified address claim for a specific FID/protocol/address tuple. It should not be generalized into wallet ownership without preserving Farcaster as the attestation source. Ethereum addresses resolve to EvmAccount refs and Solana addresses resolve to Solana mainnet account refs when the resolver can normalize them.

  Entity FedimintFederation :: federationId ; federationId! p:str, name? p:str, inviteCode? p:str, guardianCount? p:num, guardianThreshold? p:num, clientConfigJson? p:str, moduleConfigJson? p:str, metaJson? p:str, consensusVersion? p:str, $$timestamps* $:FedimintFederation_Timestamp, $$gateways* $:FedimintGateway
    Sources :: FedimintClient_Rpc, FedimintGatewayd_Rest
    View :: FedimintFederationView top `<dl>` shows federation id, name, invite-code status, guardian count, guardian threshold, consensus version, module count, and gateway count. Details tabs: Config -> clientConfigJson and guardian/module config summaries; Modules -> mint, wallet, Lightning, and meta module config facets; Gateways -> FedimintGateway list; Observations -> FedimintFederation_Timestamp list; Local clients -> BlockheadFedimintClientState list only when connected local clients exist.
    Notes :: Fedimint is federation-scoped ecash, on-chain wallet, Lightning, and meta-module configuration, not the same model as a single Cashu mint. `federationId` is derived from federation config and invite-code preview, so config/module fields are real sourceable identity-adjacent data. Do not infer deposits, balances, Nostr votes, guardian health, or gateway liquidity from federation identity/config alone; model mutable health/source status on FedimintFederation_Timestamp and wallet-private balances under BlockheadFedimintClientState.

  Entity FedimintFederation_Timestamp :: $federation+timestampMs+source ; $federation! $:FedimintFederation, timestampMs! p:num, source! p:enum, reachable? p:bool, health? p:enum, peerStatusJson? p:str, gatewayCount? p:num, clientConfigHash? p:hex, moduleConfigHash? p:hex, metaJson? p:str
    Sources :: FedimintClient_Rpc, FedimintGatewayd_Rest
    View :: FedimintFederation_TimestampView top `<dl>` shows federation, observation time, source, reachability, health, gateway count, config hash, and module config hash. Details tabs: Federation -> FedimintFederationView; Peers -> peerStatusJson; Meta -> metaJson; Source -> connected client/gateway endpoint, errors, and freshness.
    Notes :: Timestamped observation of mutable federation reachability, source health, meta-module values, and source-specific config hashes. Keep durable federation identity/config on FedimintFederation when the full client config is known; use this row for changing client/gateway observations and source conflicts.

  Entity FedimintGateway :: gatewayId ; gatewayId! p:str, apiUrl? p:url, nodePubkey? p:str, lightningAlias? p:str, routingFeesJson? p:str, version? p:str, $$federations* $:FedimintFederation, $$timestamps* $:FedimintGateway_Timestamp
    Sources :: FedimintGatewayd_Rest
    View :: FedimintGatewayView top `<dl>` shows gateway id, API URL, node pubkey, Lightning alias, version, routing-fee summary, connected federation count, and latest liquidity/health status. Details tabs: Federations -> FedimintFederation list; Observations -> FedimintGateway_Timestamp list; Lightning -> node pubkey, alias, channels, and fee settings when source-backed; Management -> admin-only config fields only in trusted local contexts.
    Notes :: Fedimint Lightning gateway identity is independent from a federation: one gateway can connect to multiple federations and route payments through Lightning. Model it as a gatewayd-backed service row, not as a federation field, Lightning node entity replacement, or wallet balance. Admin-only gateway mnemonic/config/balance surfaces remain local/trusted data and should be redacted or moved under Blockhead-prefixed state if exposed by a connected gateway.

  Entity FedimintGateway_Timestamp :: $gateway+timestampMs+source ; $gateway! $:FedimintGateway, timestampMs! p:num, source! p:enum, reachable? p:bool, online? p:bool, federationsCount? p:num, lightningBalanceMsat? p:bigint, ecashBalanceMsat? p:bigint, onchainBalanceSats? p:bigint, channelsJson? p:str, paymentSummaryJson? p:str
    Sources :: FedimintGatewayd_Rest
    View :: FedimintGateway_TimestampView top `<dl>` shows gateway, observation time, source, reachability, online state, federation count, Lightning balance, ecash balance, and on-chain balance. Details tabs: Gateway -> FedimintGatewayView; Federations -> federation ids/status known to the gateway; Channels -> channelsJson; Payments -> paymentSummaryJson; Source -> endpoint and freshness.
    Notes :: Timestamped gatewayd REST observation for mutable gateway health, liquidity, channels, and payment summary. These values are service-local operational state, not federation consensus data; expose them through trusted gateway sources and avoid copying them onto FedimintFederation except as aggregated observation counts.

  Entity FilecoinActor :: $network+address ; $network! $:Network, address! p:str, actorCodeCid? p:str, nonce? p:bigint, balanceAttoFil? p:bigint, $$timestamps* $:FilecoinActor_Timestamp
    Sources :: Lotus_JsonRpc, Filfox_Rest
    View :: FilecoinActorView top `<dl>` shows network, address, latest actor code CID, latest nonce, latest balance in attoFIL, and latest observation time. Details tabs: State observations -> FilecoinActor_Timestamp list; Messages -> FilecoinMessage list when scoped by source context; Miner -> FilecoinMinerView when the address is a miner actor; Network -> FilecoinNetworkView.
    Notes :: Filecoin actors are chain-state accounts/program actors, not wallet authority. Address is the stable selector; actor code CID, nonce, and balance are tipset-bounded state observations from StateGetActor/indexer address payloads. Parent fields can expose latest convenience values, but history/source conflicts belong on FilecoinActor_Timestamp.

  Entity FilecoinActor_Timestamp :: $actor+timestampMs+source ; $actor! $:FilecoinActor, timestampMs! p:num, source! p:enum, height? p:bigint, tipsetKey? p:str, $tipset? $:FilecoinTipset, actorCodeCid? p:str, nonce? p:bigint, balanceAttoFil? p:bigint, stateRootCid? p:str
    Sources :: Lotus_JsonRpc, Filfox_Rest
    View :: FilecoinActor_TimestampView top `<dl>` shows actor, observation time, source, height, tipset key, actor code CID, nonce, balance, and state root CID. Details tabs: Actor -> FilecoinActorView; Tipset -> FilecoinTipsetView when resolved; Source -> StateGetActor/address payload and freshness.
    Notes :: Tipset-bounded actor state observation. Use this row for balances, nonces, actor code changes, source conflicts, and historical lookups; do not model Filecoin account balances as stable identity fields or wallet-local authority.

  Entity FilecoinBlock :: $network+cid ; $network! $:Network, cid! p:str, $tipset? $:FilecoinTipset, $miner? $:FilecoinMiner, ticketVrFProof? p:str, winCount? p:num, $$messages* $:FilecoinMessage
    Sources :: Lotus_JsonRpc, Filfox_Rest
    View :: FilecoinBlockView top `<dl>` shows network, CID, tipset, miner, ticket VRF proof, and win count. Details tabs: Messages -> FilecoinMessage list; Tipset -> FilecoinTipsetView; Miner -> FilecoinMinerView; Network -> FilecoinNetworkView.
    Notes :: Blocks are members of tipsets under Expected Consensus. Keep the block CID as identity and keep block lists under tipsets/network views; do not collapse Filecoin into a single-block-per-height chain model.

  Entity FilecoinMessage :: $network+cid ; $network! $:Network, cid! p:str, $from? $:FilecoinActor, $to? $:FilecoinActor, method? p:num, nonce? p:bigint, valueAttoFil? p:bigint, gasLimit? p:bigint, gasFeeCapAttoFil? p:bigint, gasPremiumAttoFil? p:bigint, paramsCid? p:str, $$receipts* $:FilecoinMessageReceipt
    Sources :: Lotus_JsonRpc, Filfox_Rest
    View :: FilecoinMessageView top `<dl>` shows network, CID, from actor, to actor, method number, nonce, value in attoFIL, gas limit, fee cap, premium, and receipt count. Details tabs: From -> FilecoinActorView; To -> FilecoinActorView; Receipts -> FilecoinMessageReceipt list; Blocks/tipsets -> FilecoinBlock/FilecoinTipset refs when source context provides inclusion; Params -> paramsCid/raw params preview when source-backed.
    Notes :: Message CID identifies the signed message content. Execution result is not part of message identity because replacement messages and receipts are tipset/execution-context facts; keep exit code, gas used, return data, and execution tipset on FilecoinMessageReceipt.

  Entity FilecoinMessageReceipt :: $message+tipsetKey ; $message! $:FilecoinMessage, tipsetKey! p:str, $tipset? $:FilecoinTipset, height? p:bigint, blockCid? p:str, exitCode? p:num, returnData? p:str, gasUsed? p:bigint, replacedMessageCid? p:str
    Sources :: Lotus_JsonRpc, Filfox_Rest
    View :: FilecoinMessageReceiptView top `<dl>` shows message, execution tipset key, height, block CID, exit code, gas used, return-data status, and replaced message CID. Details tabs: Message -> FilecoinMessageView; Tipset -> FilecoinTipsetView; Execution -> exit code, return data, gas used, replacement note; Source -> StateSearchMsg, ChainGetParentReceipts, or indexer payload evidence.
    Notes :: Execution receipt for a Filecoin message in a concrete tipset context. Lotus StateSearchMsg can return the replacing message if one landed on chain, so preserve both `$message` and `replacedMessageCid` rather than mutating FilecoinMessage identity. Do not put receipt fields on FilecoinBlock or FilecoinMessage headers.

  Entity FilecoinMiner :: $network+minerAddress ; $network! $:Network, minerAddress! p:str, $owner? $:FilecoinActor, $worker? $:FilecoinActor, peerId? p:str, qualityAdjustedPower? p:bigint, $$timestamps* $:FilecoinMiner_Timestamp, $$sectors* $:FilecoinSector
    Sources :: Lotus_JsonRpc, Filfox_Rest
    View :: FilecoinMinerView top `<dl>` shows network, miner address, latest owner actor, latest worker actor, latest peer id, latest quality-adjusted power, sector count, and latest observation time. Details tabs: State observations -> FilecoinMiner_Timestamp list; Sectors -> FilecoinSector list; Owner -> FilecoinActorView; Worker -> FilecoinActorView; Produced blocks -> FilecoinBlock list when source context provides block membership. FilecoinMinersView lists latest head miners under FilecoinNetworkView.
    Notes :: Miner identity is the miner actor address. Owner/worker, peer id, power, sector counts, deadlines, and sector lists are mutable chain/indexer observations from StateMinerInfo/StateMinerPower/sector APIs; parent fields can expose latest convenience values, but historical state belongs on FilecoinMiner_Timestamp and sector lifecycle rows.

  Entity FilecoinMiner_Timestamp :: $miner+timestampMs+source ; $miner! $:FilecoinMiner, timestampMs! p:num, source! p:enum, height? p:bigint, tipsetKey? p:str, $tipset? $:FilecoinTipset, $owner? $:FilecoinActor, $worker? $:FilecoinActor, peerId? p:str, rawBytePower? p:bigint, qualityAdjustedPower? p:bigint, networkRawBytePower? p:bigint, networkQualityAdjustedPower? p:bigint, liveSectorCount? p:num, faultySectorCount? p:num
    Sources :: Lotus_JsonRpc, Filfox_Rest
    View :: FilecoinMiner_TimestampView top `<dl>` shows miner, observation time, source, height, owner, worker, peer id, raw power, quality-adjusted power, network power, live sector count, and faulty sector count. Details tabs: Miner -> FilecoinMinerView; Tipset -> FilecoinTipsetView when resolved; Power -> miner and network power comparison; Sectors -> sector count/fault summaries; Source -> StateMinerInfo, StateMinerPower, and indexer payload evidence.
    Notes :: Tipset-bounded miner state observation. Use it for power, owner/worker changes, peer id, and sector-count snapshots; do not treat current power or owner as immutable miner identity, and do not use latest-head producer lists as a complete miner registry.

  Entity FilecoinNetwork :: $network ; $network! $:Network, rpcEndpoints+ p:{url:url,transportType:enum,providerName:str}, $$timestamps* $:FilecoinNetwork_Timestamp, $$tipsets* $:FilecoinTipset
    Sources :: Constants_Internal, Lotus_JsonRpc, Filfox_Rest
    View :: FilecoinNetworkView top `<dl>` shows head tipset, environment, native asset count, RPC endpoint availability, latest network version, and latest power summary. Details tabs: Execution -> FilecoinTipsetsView and FilecoinNetwork_TimestampsView; Consensus & Storage Power -> head miners from latest snapshot plus FilecoinMiner_Timestamp facets when scoped; Assets -> native coin; Resources -> faucets, block explorers, and source endpoints.
    Notes :: FilecoinNetwork is the Filecoin-specific facet over the parent Network. Tipsets and network timestamps are direct browse facets; blocks, messages, actors, miners, sectors, receipts, and state observations are reached through selectors or bounded tipset/snapshot context rather than declared as complete network child lists.

  Entity FilecoinNetwork_Timestamp :: $network+timestampMs ; $network! $:Network, timestampMs! p:num, headHeight? p:bigint, headTipsetKey? p:str, headBlockCount? p:num, headTimestampMs? p:num, $headTipset? $:FilecoinTipset, $$headMiners* $:FilecoinMiner, networkVersion? p:num, lotusVersion? p:str, lotusAgent? p:str, blockDelaySeconds? p:num, totalRawBytePower? p:bigint, totalQualityAdjustedPower? p:bigint
    Sources :: Lotus_JsonRpc
    View :: FilecoinNetwork_TimestampView top `<dl>` shows observation time, head height, head tipset key, head block count, head timestamp, head tipset, head miners, network version, Lotus version/agent, block delay, total raw byte power, and total quality-adjusted power. FilecoinNetwork_TimestampsView lists latest/history under FilecoinNetworkView.
    Notes :: Head, node/software version, block delay, and power values are bounded Lotus observations. Keep them timestamped; do not copy total power or current head facts onto FilecoinNetwork identity.

  Entity FilecoinSector :: $miner+sectorNumber ; $miner! $:FilecoinMiner, sectorNumber! p:bigint, sealedCid? p:str, activationEpoch? p:bigint, expirationEpoch? p:bigint
    Sources :: Lotus_JsonRpc
    View :: FilecoinSectorView top `<dl>` shows miner, sector number, sealed CID, activation epoch, and expiration epoch. Details tabs: Miner -> FilecoinMinerView; Proof/deal state -> sector proof, deadline, partition, allocation, or deal rows only when a source provides concrete selectors and fields.
    Notes :: Sector number is miner-scoped identity. Sector lifecycle fields are epoch-bounded chain state from miner sector APIs. Avoid creating generic storage-deal or proof entities unless a source provides concrete deal/proof/deadline selectors and fields.

  Entity FilecoinTipset :: $network+height+tipsetKey ; $network! $:Network, height! p:bigint, tipsetKey! p:str, $parent? $:FilecoinTipset, parentWeight? p:bigint, timestampMs? p:num, $$blocks* $:FilecoinBlock, $$messageReceipts* $:FilecoinMessageReceipt
    Sources :: Lotus_JsonRpc, Filfox_Rest
    View :: FilecoinTipsetView top `<dl>` shows network, height, tipset key, parent, parent weight, timestamp, block count, and receipt count. Details tabs: Blocks -> FilecoinBlock list; Message receipts -> FilecoinMessageReceipt list when sourced from parent receipts/search context; Parent -> FilecoinTipsetView; Network -> FilecoinNetworkView. FilecoinTipsetsView lists Expected Consensus tipsets under network block routes.
    Notes :: Tipset is the Filecoin chain coordinate: one height can contain multiple block CIDs. The selector includes tipsetKey so competing/forked tipsets at the same height remain distinguishable. Message inclusion and execution receipts are tipset-context facts; avoid flattening Filecoin into one canonical block per height or putting receipt fields on blocks.

  Entity GitBlob :: objectId+objectFormat ; objectId! p:hex, objectFormat! p:enum, $object! $:GitObject, mime? p:str, byteSize? p:bigint, textSample? p:str, $$paths* $:GitTreeEntry
    Sources :: Local_Internal
    View :: GitBlobView top `<dl>` shows object id, object format, object link, byte size, MIME, and text sample when safe. Details tabs: Paths -> GitTreeEntry list; Object -> GitObjectView; Content preview -> local byte preview when available.
    Notes :: Blob identity is content-addressed bytes, not filename or path. Filenames, modes, symlinks, submodules, and directory placement belong to GitTreeEntry rows.

  Entity GitCommit :: objectId+objectFormat ; objectId! p:hex, objectFormat! p:enum, $object! $:GitObject, treeObjectId! p:hex, parentObjectIds* p:hex, authorName? p:str, authorEmail? p:str, authorTimestampMs? p:num, committerName? p:str, committerEmail? p:str, committerTimestampMs? p:num, message? p:str, $$signatures* $:GitSignature
    Sources :: Local_Internal
    View :: GitCommitView top `<dl>` shows object id, object format, title/message first line, author/committer idents, authored/committed timestamps, root tree object id, and parent count. Details tabs: Parents -> GitCommit list; Tree -> GitTreeView for treeObjectId; Signatures -> GitSignature list; Object -> GitObjectView.
    Notes :: Commit fields come from immutable commit object bytes. Author/committer names and emails are commit metadata, not proof of account ownership; commit-graph acceleration is an index, not canonical commit content.

  Entity GitFetchObservation :: $repository+remoteName+timestampMs+source ; $repository! $:GitRepository, remoteName! p:str, timestampMs! p:num, source! p:str, protocolVersion? p:str, advertisedRefs? p:num, wantedObjects? p:num, receivedObjects? p:num, packfileHash? p:hex, status! p:enum, error? p:str
    Sources :: Local_Internal
    View :: GitFetchObservationView top `<dl>` shows repository, remote name, source, timestamp, status, protocol version, advertised ref count, wanted object count, received object count, packfile hash, and error. Details tabs: Repository -> GitRepositoryView; Remote -> GitRemoteView; Packfile -> GitPackfileView when captured; Raw exchange -> protocol request/response summary.
    Notes :: Retrieval observation for one fetch or mirror sync attempt. Protocol counts and packfile hash are freshness/availability evidence and should not be copied onto GitRepository identity.

  Entity GitForgeIssue :: $forgeMirror+issueNumber ; $forgeMirror! $:GitForgeMirror, issueNumber! p:num, title? p:str, state! p:enum, authorSelector? p:json, labels* p:str, createdAt? p:num, updatedAt? p:num, closedAt? p:num
    Sources :: Local_Internal
    View :: GitForgeIssueView top `<dl>` shows forge mirror, issue number, title, state, author selector, labels, created/updated/closed timestamps. Details tabs: Forge mirror -> GitForgeMirrorView; Timeline -> issue comments/events when modeled; References -> linked commits/PRs when parsed from source payloads.
    Notes :: Forge issue metadata is host-managed collaboration state scoped to a mirror, not Git object content. Add a concrete forge source enum before building remote API resolvers.

  Entity GitForgeMirror :: forgeHost+owner+repositoryName ; forgeHost! p:str, owner! p:str, repositoryName! p:str, $gitRepository? $:GitRepository, defaultBranch? p:str, visibility? p:enum, cloneUrls* p:url, htmlUrl? p:url, providerRepositoryId? p:str, source! p:enum
    Sources :: Local_Internal
    View :: GitForgeMirrorView top `<dl>` shows host, owner, repository name, provider repository id, visibility, default branch, clone URLs, HTML URL, source, and linked GitRepository. Details tabs: Repository -> GitRepositoryView; Pull requests -> GitForgePullRequest list; Issues -> GitForgeIssue list; Releases -> GitForgeRelease list.
    Notes :: Forge owner/name is a host record and can move or rename independently of Git objects. Link `$gitRepository` only when clone/fetch/object evidence ties the mirror to a repository.

  Entity GitForgePullRequest :: $forgeMirror+pullRequestNumber ; $forgeMirror! $:GitForgeMirror, pullRequestNumber! p:num, title? p:str, state! p:enum, authorSelector? p:json, baseRef? p:str, headRef? p:str, headObjectId? p:hex, createdAt? p:num, updatedAt? p:num, mergedAt? p:num
    Sources :: Local_Internal
    View :: GitForgePullRequestView top `<dl>` shows forge mirror, number, title, state, author selector, base ref, head ref, head object id, created/updated/merged timestamps. Details tabs: Forge mirror -> GitForgeMirrorView; Head commit -> GitCommitView when resolved; Base/head refs -> GitRef views; Activity -> reviews/comments/checks when modeled.
    Notes :: Pull requests/merge requests are forge workflow records. Head refs and merge state can move or disappear; keep them separate from immutable Git commits and refs.

  Entity GitForgeRelease :: $forgeMirror+releaseTagName ; $forgeMirror! $:GitForgeMirror, releaseTagName! p:str, name? p:str, targetObjectId? p:hex, authorSelector? p:json, draft? p:bool, prerelease? p:bool, createdAt? p:num, publishedAt? p:num
    Sources :: Local_Internal
    View :: GitForgeReleaseView top `<dl>` shows forge mirror, release tag name, name, target object id, author selector, draft/prerelease flags, created timestamp, and published timestamp. Details tabs: Forge mirror -> GitForgeMirrorView; Tag/ref -> GitTag or GitRef when resolved; Assets -> downloadable release assets when modeled.
    Notes :: Forge release is a host publication record. GitTag remains the signed annotated object, and GitRef/GitRefObservation holds the mutable tag ref.

  Entity GitLooseObject :: objectId+objectFormat+byteSource ; objectId! p:hex, objectFormat! p:enum, byteSource! p:str, path? p:str, compressedSizeBytes? p:bigint, observedAtMs? p:num, $object? $:GitObject
    Sources :: Local_Internal
    View :: GitLooseObjectView top `<dl>` shows object id, object format, byte source, path, compressed size, observed timestamp, and object link. Details tabs: Object -> GitObjectView; Verification -> GitObjectByteVerification list; Storage evidence -> local clone/object-directory context.
    Notes :: Loose object rows are storage observations under a byte source. They should not duplicate parsed GitObject body fields or define canonical object identity.

  Entity GitObject :: objectId+objectFormat ; objectId! p:hex, objectFormat! p:enum, objectKind! p:enum, sizeBytes? p:bigint, $repository? $:GitRepository
    Sources :: Local_Internal
    View :: GitObjectView top `<dl>` shows object id, object format, object kind, size, and repository context. Details tabs: Typed body -> GitCommit/GitTree/GitBlob/GitTag subview by kind; Storage -> GitLooseObject and GitPackedObject lists; Verification -> GitObjectVerificationRun list; Repository -> GitRepositoryView.
    Notes :: Immutable Git object identity is content-addressed by object bytes and hash algorithm. `$repository` is contextual availability because the same object id can appear in many repositories.

  Entity GitObjectByteVerification :: objectId+objectFormat+byteSource+timestampMs ; objectId! p:hex, objectFormat! p:enum, byteSource! p:str, timestampMs! p:num, headerBytesHash? p:hex, payloadBytesHash? p:hex, computedObjectId? p:hex, canonicalEncoding? p:bool, status! p:enum, error? p:str
    Sources :: Local_Internal
    View :: GitObjectByteVerificationView top `<dl>` shows object id, object format, byte source, timestamp, status, computed object id, canonical encoding flag, header bytes hash, payload bytes hash, and error. Details tabs: Object -> GitObjectView; Byte source -> GitLooseObject/GitPackedObject context when available.
    Notes :: Byte verification recomputes identity from `type size\\0payload` semantics. Keep failed verification separate from storage observations so bad bytes do not mutate GitObject.

  Entity GitObjectVerificationRun :: objectId+objectFormat+verifier+timestampMs ; objectId! p:hex, objectFormat! p:enum, verifier! p:str, timestampMs! p:num, objectKind? p:enum, computedObjectId? p:hex, headerHash? p:hex, contentHash? p:hex, status! p:enum, error? p:str
    Sources :: Local_Internal
    View :: GitObjectVerificationRunView top `<dl>` shows object id, object format, verifier, timestamp, status, object kind, computed object id, header hash, content hash, and error. Details tabs: Object -> GitObjectView; Diagnostics -> verifier-specific raw output.
    Notes :: Verification success proves byte/object-id consistency, not provenance, authorship, or repository membership.

  Entity GitPackedObject :: packHash+objectId+objectFormat ; packHash! p:hex, objectId! p:hex, objectFormat! p:enum, offset? p:bigint, deltaBaseObjectId? p:hex, storedKind? p:enum, $packfile! $:GitPackfile, $object? $:GitObject
    Sources :: Local_Internal
    View :: GitPackedObjectView top `<dl>` shows pack hash, object id, object format, stored kind, offset, delta base object id, packfile, and parsed object. Details tabs: Packfile -> GitPackfileView; Object -> GitObjectView; Verification -> GitObjectByteVerification list for this packed byte source.
    Notes :: Packed-object rows are pack storage observations. Delta base and offset belong here because repacking can change them without changing GitObject identity.

  Entity GitPackfile :: packHash ; packHash! p:hex, objectFormat! p:enum, objectCount? p:num, packSizeBytes? p:bigint, indexHash? p:hex, $repository? $:GitRepository
    Sources :: Local_Internal
    View :: GitPackfileView top `<dl>` shows pack hash, object format, object count, pack size, index hash, and repository context. Details tabs: Objects -> GitPackedObject list; Repository -> GitRepositoryView; Fetches -> GitFetchObservation rows that captured the pack.
    Notes :: Packfile identity is the pack artifact, not the repository or the individual object identities. Repacking can replace this row without changing any GitObject rows.

  Entity GitRef :: $repository+refName ; $repository! $:GitRepository, refName! p:str, refKind! p:enum, targetObjectId? p:hex, symbolicTarget? p:str, $$observations* $:GitRefObservation_Timestamp
    Sources :: Local_Internal
    View :: GitRefView top `<dl>` shows repository, ref name, ref kind, latest target object id, symbolic target, and latest observation time. Details tabs: Observations -> GitRefObservation_Timestamp history; Target -> GitObject/GitCommit/GitTag when resolved; Repository -> GitRepositoryView.
    Notes :: Ref names are mutable repository-local pointers. Latest target fields are convenient display state; timestamped observations hold freshness, source conflicts, and drift.

  Entity GitRefObservation_Timestamp :: $ref+timestampMs+source ; $ref! $:GitRef, timestampMs! p:num, source! p:str, targetObjectId? p:hex, peeledObjectId? p:hex, advertised? p:bool, protection? p:json
    Sources :: Local_Internal
    View :: GitRefObservation_TimestampView top `<dl>` shows ref, timestamp, source, target object id, peeled object id, advertised flag, and protection JSON. Details tabs: Ref -> GitRefView; Target -> GitObjectView; Protection -> host-specific branch/tag protection details when captured.
    Notes :: Ref observations are source/time snapshots from local scans, remote advertisement, or forge mirrors. Protection is host metadata, not a Git protocol property.

  Entity GitRefUpdate :: $repository+refName+oldObjectId+newObjectId ; $repository! $:GitRepository, refName! p:str, oldObjectId? p:hex, newObjectId! p:hex, updateKind! p:enum, actorSelector? p:json, timestampMs? p:num, $signature? $:GitSignature, source? p:enum
    Sources :: Local_Internal
    View :: GitRefUpdateView top `<dl>` shows repository, ref name, old object id, new object id, update kind, actor selector, timestamp, signature, and source. Details tabs: Ref -> GitRefView; Old target -> GitObjectView; New target -> GitObjectView; Evidence -> signature/audit/reflog payload.
    Notes :: Ref update is an observed movement claim, not current ref state. Actor selectors are source-specific and should not be treated as verified identity without signature or host evidence.

  Entity GitRemote :: $repository+remoteName ; $repository! $:GitRepository, remoteName! p:str, url! p:url, transportKind! p:enum, hostKind? p:enum, source? p:enum
    Sources :: Local_Internal
    View :: GitRemoteView top `<dl>` shows repository, remote name, URL, transport kind, host kind, and source. Details tabs: Fetches -> GitFetchObservation list; Forge mirror -> GitForgeMirror when URL resolves to one; Repository -> GitRepositoryView.
    Notes :: Remote configuration is repository-local. Keep it separate from forge mirror metadata because multiple remotes can point at the same host repo and one forge mirror can be reached through multiple transports.

  Entity GitRepository :: repositoryId | canonicalRemoteUrl ; repositoryId? p:str, canonicalRemoteUrl? p:url, defaultRefName? p:str, objectFormat! p:enum, $$refs* $:GitRef, $$objects* $:GitObject, $$remotes* $:GitRemote, $$fetches* $:GitFetchObservation
    Sources :: Local_Internal
    View :: GitRepositoryView top `<dl>` shows repository id, canonical remote URL, object format, default ref, remote count, object count, ref count, and latest fetch status. Details tabs: Refs -> GitRef list grouped by heads/tags/symbolic refs; Objects -> GitObject list grouped by commit/tree/blob/tag; Remotes -> GitRemote list; Fetches -> GitFetchObservation history; Forge mirrors -> GitForgeMirror list.
    Notes :: Repository identity is a local/catalog selector over object database context, not a forge owner/name. Forge issues, releases, pull requests, and host repository metadata stay in forge child rows.

  Entity GitSignature :: signatureId ; signatureId! p:str, subjectObjectId! p:hex, signatureKind! p:enum, signerSelector? p:json, payloadHash? p:hex, signature? p:str, verificationStatus! p:enum, verifiedAtMs? p:num, $verification? $:VerificationResult
    Sources :: Local_Internal
    View :: GitSignatureView top `<dl>` shows signature id, subject object id, signature kind, signer selector, payload hash, verification status, verified timestamp, and verification result. Details tabs: Subject -> GitObject/GitCommit/GitTag/RadicleSignedRef context; Raw signature -> redacted signature text; Verification -> VerificationResultView.
    Notes :: Signature validity is separate from trust and human identity binding. Signer selectors can describe GPG, SSH, Sigstore, Radicle, or forge account claims but do not by themselves prove ownership.

  Entity GitTag :: objectId+objectFormat ; objectId! p:hex, objectFormat! p:enum, $object! $:GitObject, targetObjectId! p:hex, targetKind? p:enum, tagName? p:str, taggerSelector? p:json, taggerTimestampMs? p:num, message? p:str, $$signatures* $:GitSignature
    Sources :: Local_Internal
    View :: GitTagView top `<dl>` shows object id, object format, target object id, target kind, tag name, tagger selector, tagger timestamp, and message. Details tabs: Target -> GitObjectView; Signatures -> GitSignature list; Object -> GitObjectView for the tag object; Ref observations -> GitRefObservation_Timestamp rows for matching tag refs.
    Notes :: This is the annotated tag object. Lightweight tags are refs and should appear as GitRef/GitRefObservation_Timestamp without inventing a GitTag object.

  Entity GitTree :: objectId+objectFormat ; objectId! p:hex, objectFormat! p:enum, $object! $:GitObject, $$entries* $:GitTreeEntry
    Sources :: Local_Internal
    View :: GitTreeView top `<dl>` shows object id, object format, object link, and entry count. Details tabs: Entries -> GitTreeEntry list grouped by file/tree/symlink/submodule modes; Object -> GitObjectView; Commits -> GitCommit list whose root tree matches when available.
    Notes :: Tree object identity remains objectId+objectFormat. Path-bearing child metadata belongs on GitTreeEntry; do not copy path lists onto GitObject.

  Entity GitTreeEntry :: $tree+path ; $tree! $:GitTree, path! p:str, mode! p:str, objectId! p:hex, objectKind! p:enum, $object? $:GitObject
    Sources :: Local_Internal
    View :: GitTreeEntryView top `<dl>` shows tree, path, mode, object id, object kind, and object link. Details tabs: Parent tree -> GitTreeView; Target object -> GitObjectView; Blob/tree/tag/commit body -> typed subview when resolved.
    Notes :: Selector is parent tree plus path because the same object can appear under many names and modes across trees. Mode distinguishes files, executables, symlinks, trees, and gitlink/submodule entries.

  Entity GitTreePathResolution :: $repository+commitObjectId+path ; $repository! $:GitRepository, commitObjectId! p:hex, path! p:str, treeObjectIds* p:hex, blobObjectId? p:hex, submoduleCommitId? p:hex, status! p:enum
    Sources :: Local_Internal
    View :: GitTreePathResolutionView top `<dl>` shows repository, commit object id, path, status, terminal blob object id, submodule commit id, and traversed tree object ids. Details tabs: Repository -> GitRepositoryView; Commit -> GitCommitView; Traversal -> GitTree list; Terminal object -> GitBlob/GitCommit view when resolved.
    Notes :: Derived navigation result through a commit root tree. It is not a new Git object and should be recomputed when repository object availability changes.

  Entity HederaAccount :: $network+accountId ; $network! $:HederaNetwork, accountId! p:str, alias? p:str, evmAddress? p:evmAddress, key? p:json, receiverSigRequired? p:bool, memo? p:str, $$tokens* $:HederaTokenAssociation, $$nfts* $:HederaNft, $$transactions* $:HederaTransaction, $$timestamps* $:HederaAccount_Timestamp
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc, Hashscan_Rest, DragonGlass_Rest
    View :: HederaAccountView top `<dl>` shows account id, alias, EVM address, receiver signature requirement, memo, latest balance, staking state, and deleted flag. Tabs: transactions, HTS token associations, NFTs, allowances, rewards, balance/state history.
    Notes :: accountId is canonical shard.realm.num identity. alias and evmAddress are important interop fields but should not replace accountId as the Hedera selector.

  Entity HederaAccount_Timestamp :: $account+timestampMs+source ; $account! $:HederaAccount, timestampMs! p:num, source! p:str, balanceTinybar? p:bigint, deleted? p:bool, autoRenewPeriodSeconds? p:num, expiryTimestamp? p:str, stakedNodeId? p:num, stakedAccountId? p:str, declineReward? p:bool, pendingRewardTinybar? p:bigint
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc, Hashscan_Rest, DragonGlass_Rest
    View :: HederaAccount_TimestampView top `<dl>` shows observed time/source, balance, deleted flag, staking target, pending reward, and auto-renew/expiry. Details show source freshness and raw account payload.
    Notes :: Account balance and staking/deletion state are mutable; do not flatten them onto HederaAccount.

  Entity HederaBlock :: $network+blockNumber | $network+blockHash ; $network! $:HederaNetwork, blockNumber? p:bigint, blockHash? p:hex, consensusStartTimestamp? p:str, consensusEndTimestamp? p:str, gasUsed? p:bigint, recordFileName? p:str, transactionCount? p:num, $$transactions* $:HederaTransaction
    Sources :: HederaMirrorNode_Rest, Hashscan_Rest, DragonGlass_Rest
    View :: HederaBlockView top `<dl>` shows network, block number, block hash, consensus start/end, gas used, record file, and transaction count. Tabs: transactions, record-file metadata, source evidence.
    Notes :: Mirror Node exposes block ranges as historical grouping around consensus timestamps. The block is sourceable and useful, but consensus timestamp remains the canonical transaction ordering coordinate.

  Entity HederaContract :: $network+contractId ; $network! $:HederaNetwork, contractId! p:str, evmAddress? p:evmAddress, accountId? p:str, runtimeBytecodeHash? p:hex, createdTimestamp? p:str, deleted? p:bool, $$results* $:HederaContractResult, $$logs* $:HederaContractLog, $$state* $:HederaContractState_Timestamp
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc, Hashscan_Rest, DragonGlass_Rest
    View :: HederaContractView top `<dl>` shows contract id, EVM address, linked account id, bytecode hash, created timestamp, and deleted flag. Tabs: call results, actions, logs, state history, verification metadata, related transactions.
    Notes :: Hedera contracts are EVM-compatible, but contractId remains the Hedera-native selector. evmAddress is an interop field for Ethereum-style tooling and routes.

  Entity HederaContractAction :: $result+callDepth+callIndex ; $result! $:HederaContractResult, callDepth! p:num, callIndex! p:num, callType? p:enum, fromAddress? p:evmAddress, toAddress? p:evmAddress, gas? p:bigint, gasUsed? p:bigint, valueTinybar? p:bigint, input? p:hex, output? p:hex, error? p:str
    Sources :: HederaMirrorNode_Rest
    View :: HederaContractActionView top `<dl>` shows result, call depth/index, call type, from/to, gas, value, and error. Details show input/output payloads.
    Notes :: Contract actions are call-trace rows exposed by Mirror Node, not independent transactions.

  Entity HederaContractLog :: $result+logIndex | $contract+consensusTimestamp+logIndex ; $result? $:HederaContractResult, $contract? $:HederaContract, consensusTimestamp? p:str, logIndex! p:num, address? p:evmAddress, bloom? p:hex, data? p:hex, topics* p:hex
    Sources :: HederaMirrorNode_Rest
    View :: HederaContractLogView top `<dl>` shows contract/result, consensus timestamp, log index, address, and topic count. Details show topics, data, and bloom.
    Notes :: Logs are EVM-compatible contract output rows scoped by result or contract+timestamp+index.

  Entity HederaContractResult :: $transaction ; $transaction! $:HederaTransaction, $contract? $:HederaContract, contractId? p:str, evmAddress? p:evmAddress, ethereumHash? p:hex, functionParameters? p:hex, gasLimit? p:bigint, gasUsed? p:bigint, amountTinybar? p:bigint, status? p:enum, errorMessage? p:str, bloom? p:hex, $$actions* $:HederaContractAction, $$logs* $:HederaContractLog
    Sources :: HederaMirrorNode_Rest
    View :: HederaContractResultView top `<dl>` shows transaction, contract, status, gas used/limit, amount, Ethereum hash, and error. Tabs: actions, logs, function parameters, bloom, source evidence.
    Notes :: Contract result is the EVM execution result for a Hedera transaction. It should not be merged into HederaTransaction because many non-contract transaction types have no EVM result.

  Entity HederaContractState_Timestamp :: $contract+slot+timestampMs+source ; $contract! $:HederaContract, slot! p:hex, timestampMs! p:num, source! p:str, value? p:hex
    Sources :: HederaMirrorNode_Rest
    View :: HederaContractState_TimestampView top `<dl>` shows contract, slot, observed time/source, and value. Details show raw state payload.
    Notes :: Contract storage is mutable; model state as slot observations rather than stable contract fields.

  Entity HederaHbarTransfer :: $transaction+accountId+transferIndex ; $transaction! $:HederaTransaction, accountId! p:str, transferIndex! p:num, amountTinybar! p:bigint, isApproval? p:bool, $account? $:HederaAccount
    Sources :: HederaMirrorNode_Rest
    View :: HederaHbarTransferView top `<dl>` shows transaction, account, amount, approval flag, and direction. Details show payer/source evidence.
    Notes :: HBAR transfers are transaction effects. They are not account balance snapshots.

  Entity HederaNetwork :: $network ; $network! $:Network, shard? p:num, realm? p:num, $$blocks* $:HederaBlock, $$transactions* $:HederaTransaction, $$accounts* $:HederaAccount, $$tokens* $:HederaToken, $$nfts* $:HederaNft, $$contracts* $:HederaContract, $$topics* $:HederaTopic, $$schedules* $:HederaSchedule, $$timestamps* $:HederaNetwork_Timestamp
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc, Hashscan_Rest, DragonGlass_Rest
    View :: HederaNetworkView top `<dl>` shows linked base Network, shard, realm, latest consensus timestamp, latest block number, and mirror-node lag. Tabs: blocks, transactions, accounts, HTS tokens, NFTs, contracts, consensus topics, schedules, timestamp history.
    Notes :: Hedera exposes mirror-node history keyed by consensus ordering. Keep shard/realm metadata on the network row and mutable network head/count observations on HederaNetwork_Timestamp.

  Entity HederaNetwork_Timestamp :: $network+timestampMs+source ; $network! $:HederaNetwork, timestampMs! p:num, source! p:str, latestConsensusTimestamp? p:str, latestBlockNumber? p:bigint, latestTransactionCount? p:num, accountCount? p:num, tokenCount? p:num, topicCount? p:num, contractCount? p:num, mirrorNodeLagMs? p:num
    Sources :: HederaMirrorNode_Rest, Hashscan_Rest, DragonGlass_Rest
    View :: HederaNetwork_TimestampView top `<dl>` shows observed time, source, latest consensus timestamp, latest block number, mirror-node lag, and aggregate counts. Details show source freshness and status payload.
    Notes :: Keep mirror-node head and aggregate count observations here so HederaNetwork remains stable identity.

  Entity HederaNft :: $token+serialNumber ; $token! $:HederaToken, serialNumber! p:bigint, metadata? p:str, createdTimestamp? p:str, deleted? p:bool, $owner? $:HederaAccount, $$transactions* $:HederaTransaction
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc, Hashscan_Rest, DragonGlass_Rest
    View :: HederaNftView top `<dl>` shows token, serial number, owner, created timestamp, deleted flag, and metadata summary. Tabs: transfer history, metadata, allowances, source evidence.
    Notes :: HTS NFTs are token id + serial number. Ownership is current mutable state; transfer history should come from HederaTokenTransfer rows.

  Entity HederaSchedule :: $network+scheduleId ; $network! $:HederaNetwork, scheduleId! p:str, creatorAccountId? p:str, payerAccountId? p:str, transactionBody? p:json, executedTimestamp? p:str, deleted? p:bool, expirationTime? p:str, waitForExpiry? p:bool, $$signatures* $:HederaScheduleSignature
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc, Hashscan_Rest, DragonGlass_Rest
    View :: HederaScheduleView top `<dl>` shows schedule id, creator, payer, executed timestamp, deleted flag, expiration, and wait-for-expiry. Tabs: scheduled transaction body, signatures, execution transaction, source evidence.
    Notes :: Scheduled transactions have their own Hedera-native schedule id and lifecycle. They should link to executed transactions when present rather than becoming transaction metadata only.

  Entity HederaScheduleSignature :: $schedule+publicKeyPrefix ; $schedule! $:HederaSchedule, publicKeyPrefix! p:str, consensusTimestamp? p:str, signature? p:hex, $account? $:HederaAccount
    Sources :: HederaMirrorNode_Rest
    View :: HederaScheduleSignatureView top `<dl>` shows schedule, public-key prefix, consensus timestamp, account, and signature presence. Details show raw signature evidence.
    Notes :: Schedule signatures are accumulated authorization state for a schedule, not standalone account credentials.

  Entity HederaToken :: $network+tokenId ; $network! $:HederaNetwork, tokenId! p:str, tokenType! p:enum, supplyType? p:enum, symbol? p:str, name? p:str, decimals? p:num, treasuryAccount? p:str, supplyKey? p:json, adminKey? p:json, freezeKey? p:json, wipeKey? p:json, kycKey? p:json, pauseKey? p:json, feeScheduleKey? p:json, $$associations* $:HederaTokenAssociation, $$nfts* $:HederaNft, $$timestamps* $:HederaToken_Timestamp
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc, Hashscan_Rest, DragonGlass_Rest
    View :: HederaTokenView top `<dl>` shows token id, name, symbol, token type, supply type, decimals, treasury, and latest supply/paused/deleted state. Tabs: control keys, custom fees, account associations, NFTs for non-fungible tokens, supply/state history, related transfers.
    Notes :: HTS token identity is tokenId. Supply and holder balances are mutable observations; token keys and treasury are protocol governance controls that should stay prominent in the view.

  Entity HederaToken_Timestamp :: $token+timestampMs+source ; $token! $:HederaToken, timestampMs! p:num, source! p:str, totalSupply? p:bigint, maxSupply? p:bigint, treasuryAccount? p:str, deleted? p:bool, paused? p:bool, customFees? p:json, expiryTimestamp? p:str
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc, Hashscan_Rest, DragonGlass_Rest
    View :: HederaToken_TimestampView top `<dl>` shows token, observed time/source, total supply, max supply, treasury, deleted flag, paused flag, custom fee summary, and expiry. Details show raw token-state payload.
    Notes :: Planned HTS token-state observation row. Token supply/admin state is separate from per-account balance/KYC/freeze, which remains HederaTokenAssociation_Timestamp.

  Entity HederaTokenAssociation :: $account+$token ; $account! $:HederaAccount, $token! $:HederaToken, associationStatus? p:enum, $$timestamps* $:HederaTokenAssociation_Timestamp
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc
    View :: HederaTokenAssociationView top `<dl>` shows account, token, association status, latest balance, KYC status, and freeze status. Tabs: relationship-state history, related token transfers, NFT holdings.
    Notes :: Association is its own entity because HTS requires account-token relationship state beyond a fungible balance.

  Entity HederaTokenAssociation_Timestamp :: $association+timestampMs+source ; $association! $:HederaTokenAssociation, timestampMs! p:num, source! p:str, balance? p:bigint, kycStatus? p:enum, freezeStatus? p:enum
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc
    View :: HederaTokenAssociation_TimestampView top `<dl>` shows association, observed time/source, balance, KYC status, and freeze status. Details show source evidence.
    Notes :: This row captures the mutable relationship state between an account and an HTS token, including compliance gates that do not belong on the token itself.

  Entity HederaTokenTransfer :: $transaction+tokenId+accountId+transferIndex ; $transaction! $:HederaTransaction, tokenId! p:str, accountId! p:str, transferIndex! p:num, amount? p:bigint, serialNumber? p:bigint, isApproval? p:bool, $token? $:HederaToken, $account? $:HederaAccount, $nft? $:HederaNft
    Sources :: HederaMirrorNode_Rest
    View :: HederaTokenTransferView top `<dl>` shows transaction, token, account, amount or NFT serial, approval flag, and direction. Details show source payload.
    Notes :: Fungible token and NFT transfer effects share transaction ordering but differ by amount vs serial number.

  Entity HederaTopic :: $network+topicId ; $network! $:HederaNetwork, topicId! p:str, memo? p:str, adminKey? p:json, submitKey? p:json, autoRenewAccountId? p:str, autoRenewPeriodSeconds? p:num, feeScheduleKey? p:json, feeExemptKeys* p:json, customFees? p:json, $$messages* $:HederaTopicMessage
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc, Hashscan_Rest, DragonGlass_Rest
    View :: HederaTopicView top `<dl>` shows topic id, memo, admin key presence, submit key presence, auto-renew account/period, fee schedule key, and custom fee summary. Tabs: message stream, running hash checkpoints, fee exemptions, submitters/payers, source evidence.
    Notes :: Consensus topics are append-only message streams. The child message sequence number is the natural in-topic ordering selector.

  Entity HederaTopicMessage :: $topic+sequenceNumber ; $topic! $:HederaTopic, sequenceNumber! p:bigint, consensusTimestamp? p:str, runningHash? p:hex, payerAccount? p:str, message? p:str, chunkInfo? p:json
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc
    View :: HederaTopicMessageView top `<dl>` shows topic, sequence number, consensus timestamp, payer account, running hash, and message size. Tabs: decoded/base64 message body, chunk metadata, transaction linkage, source evidence.
    Notes :: Sequence number is the topic-local ordering key. consensusTimestamp lets the same message participate in the global Hedera transaction/order view.

  Entity HederaTransaction :: $network+consensusTimestamp | $network+transactionId+nonce ; $network! $:HederaNetwork, consensusTimestamp? p:str, transactionId? p:str, nonce? p:num, transactionType! p:enum, payerAccount? p:str, result? p:enum, chargedTxFeeTinybar? p:bigint, validStartTimestamp? p:str, nodeAccountId? p:str, scheduled? p:bool, $block? $:HederaBlock, $schedule? $:HederaSchedule, $$hbarTransfers* $:HederaHbarTransfer, $$tokenTransfers* $:HederaTokenTransfer, $$contractResults* $:HederaContractResult
    Sources :: HederaMirrorNode_Rest, HederaSdk_Grpc, Hashscan_Rest, DragonGlass_Rest
    View :: HederaTransactionView top `<dl>` shows type, result, consensus timestamp, transaction id, nonce, payer, node account, fee, and scheduled flag. Tabs: HBAR transfers, token transfers, contract results/actions/logs, schedule linkage, duplicate/child records, source evidence.
    Notes :: consensusTimestamp is the final ordering coordinate. transactionId is payer + valid start and is user-facing, but duplicate/child transaction cases need room for nonce or child rows in a later pass.

  Entity HyperliquidAccount :: $network+address ; $network! $:Network, address! p:str, accountRole? p:str, $masterAccount? $:HyperliquidAccount, $agentAccount? $:HyperliquidAccount
    Sources :: Hyperliquid_Rest, Hyperliquid_JsonRpc
    View :: HyperliquidAccountView top `<dl>` shows network, address, account role, master account, and agent account. Details tabs: Master -> HyperliquidAccountView; Agent -> HyperliquidAccountView; Transactions -> HyperliquidTransaction list when source context provides HyperEVM activity.
    Notes :: Hyperliquid account rows are address-scoped public account/role facts, not wallet authority. Role links from `userRole` describe HyperCore account relationships; transaction refs come from HyperEVM execution and should not imply exchange balances without a separate state row.

  Entity HyperliquidBlock :: $network+height | $network+hash ; $network! $:Network, height! p:bigint, hash! p:str, timestampMs? p:num, $$transactions* $:HyperliquidTransaction
    Sources :: Hyperliquid_JsonRpc
    View :: HyperliquidBlockView top `<dl>` shows network, height, hash, timestamp, and transaction count. Details tabs: Transactions -> HyperliquidTransaction list; Network -> HyperliquidNetworkView. HyperliquidBlocksView lists HyperEVM blocks under network block routes.
    Notes :: This is the HyperEVM execution block, not a HyperCore orderbook or validator-state batch. Height and hash are alternate selectors so source disagreement and hash-addressed lookups can remain explicit.

  Entity HyperliquidNetwork :: $network ; $network! $:Network, rpcEndpoints+ p:{url:url,transportType:enum,providerName:str}, restEndpoints+ p:{url:url,transportType:enum,providerName:str}, $$timestamps* $:HyperliquidNetwork_Timestamp, $$blocks* $:HyperliquidBlock, $$transactions* $:HyperliquidTransaction, $$validators* $:HyperliquidValidator, $$spotAssets* $:HyperliquidSpotAsset, $$perpMarkets* $:HyperliquidPerpMarket
    Sources :: Constants_Internal, Hyperliquid_JsonRpc, Hyperliquid_Rest
    View :: HyperliquidNetworkView top `<dl>` shows head HyperEVM block, environment, stack, and endpoint availability. Details tabs: Execution -> Blocks, Transactions, Network snapshots, Validators, Endpoints; Assets -> Native coin, Perp markets, Spot assets; Resources -> Faucets, Block explorers.
    Notes :: HyperliquidNetwork is a composed network facet: HyperEVM execution data comes from JSON-RPC, while HyperCore markets, spot assets, validators, and aggregate snapshots come from the info API. Do not treat HyperCore assets as EVM token contracts without a separate mapped token/deployment row.

  Entity HyperliquidNetwork_Timestamp :: $network+timestampMs ; $network! $:Network, timestampMs! p:num, perpMarketCount? p:num, spotAssetCount? p:num, spotPairCount? p:num, validatorCount? p:num, activeValidatorCount? p:num, jailedValidatorCount? p:num, totalStake? p:bigint
    Sources :: Hyperliquid_Rest
    View :: HyperliquidNetwork_TimestampView top `<dl>` shows observation time, perp market count, spot asset count, spot pair count, validator count, active validator count, jailed validator count, and total stake. HyperliquidNetwork_TimestampsView lists latest/history under HyperliquidNetworkView.
    Notes :: Market counts, validator counts, active/jailed state, and total stake are aggregate REST observations. Keep them timestamped and do not copy them onto HyperliquidNetwork identity.

  Entity HyperliquidPerpMarket :: $network+coin ; $network! $:Network, coin! p:str, maxLeverage? p:num, onlyIsolated? p:bool
    Sources :: Hyperliquid_Rest
    View :: HyperliquidPerpMarketView top `<dl>` shows network, coin, max leverage, and isolated-only flag. Details tabs: Network -> HyperliquidNetworkView; Related market -> MarketView only when a separate market selector maps this coin to a venue pair.
    Notes :: Perp markets are HyperCore exchange markets keyed by the source coin symbol. They are not EVM contracts and should not become generic Market rows unless a source maps them to stable venue/base/quote selectors.

  Entity HyperliquidSpotAsset :: $network+assetId ; $network! $:Network, assetId! p:num, name! p:str, szDecimals? p:num, weiDecimals? p:num, tokenId? p:str
    Sources :: Hyperliquid_Rest
    View :: HyperliquidSpotAssetView top `<dl>` shows network, asset id, name, size decimals, wei decimals, and token id. Details tabs: Network -> HyperliquidNetworkView; Markets -> MarketView list only when spot universe pairs are modeled with stable market selectors.
    Notes :: Spot asset id is the HyperCore asset index. `tokenId` is source metadata, not by itself an EVM contract selector; spot-pair metadata should not imply a generic Market without a mapped venue market row.

  Entity HyperliquidTransaction :: $network+txHash ; $network! $:Network, txHash! p:str, $block? $:HyperliquidBlock, $account? $:HyperliquidAccount, actionType? p:str, status? p:str
    Sources :: Hyperliquid_JsonRpc
    View :: HyperliquidTransactionView top `<dl>` shows network, tx hash, block, account, action type, and status. Details tabs: Block -> HyperliquidBlockView; Account -> HyperliquidAccountView; Raw execution payload -> future decoded HyperEVM transaction fields when modeled.
    Notes :: Transaction rows are HyperEVM execution transactions selected by hash. `actionType` is a source-derived label when available, not a generic exchange-event taxonomy and not enough to infer HyperCore order/fill state.

  Entity HyperliquidValidator :: $network+validator ; $network! $:Network, validator! p:str, name? p:str, $signer? $:HyperliquidAccount, commission? p:str, recentBlockCount? p:num, isActive? p:bool, stake? p:bigint, isJailed? p:bool
    Sources :: Hyperliquid_Rest
    View :: HyperliquidValidatorView top `<dl>` shows network, validator, name, signer account, commission, recent block count, active state, stake, and jailed state. Details tabs: Signer -> HyperliquidAccountView; Network -> HyperliquidNetworkView; Produced blocks -> HyperliquidBlock list when source context provides validator/block linkage.
    Notes :: Validator rows model HyperBFT validator identity and current summary fields. Commission, recent blocks, active/jailed state, and stake are mutable observations; keep historical comparisons on timestamp rows if needed.

  Entity IbcChannel :: $network+portId+channelId ; $network! $:Network, portId! p:str, channelId! p:str, $connection? $:IbcConnection, counterpartyChainId? p:str, counterpartyPortId? p:str, counterpartyChannelId? p:str, state? p:enum, ordering? p:enum, version? p:str, $counterpartyNetwork? $:Network, $$packets* $:IbcPacket
    Sources :: CosmosSdk_Rest, CosmosChainRegistry_Github, Mintscan_Rest, CronosExplorer_Rest
    View :: IbcChannelView top `<dl>` shows network, port id, channel id, state, ordering, version, connection, and counterparty ids. Tabs: packet flow, connection/client, counterparty network/channel, source evidence.
    Notes :: The stable selector is local network + port + channel. Counterparty labels are source claims unless they resolve to a concrete Network row.

  Entity IbcConnection :: $network+connectionId ; $network! $:Network, connectionId! p:str, clientId? p:str, counterpartyClientId? p:str, counterpartyConnectionId? p:str, state? p:enum, delayPeriodNs? p:bigint, $$channels* $:IbcChannel
    Sources :: CosmosSdk_Rest, CosmosChainRegistry_Github, Mintscan_Rest, CronosExplorer_Rest
    View :: IbcConnectionView top `<dl>` shows network, connection id, client id, counterparty client/connection, state, and delay period. Tabs: channels, counterparty metadata, source evidence.
    Notes :: IBC connection identity is local to a chain. Counterparty ids are protocol fields; human chain names are registry/indexer claims unless they resolve to Network rows.

  Entity IbcPacket :: $channel+sequence+direction ; $channel! $:IbcChannel, sequence! p:bigint, direction! p:enum, sourcePort? p:str, sourceChannel? p:str, destinationPort? p:str, destinationChannel? p:str, timeoutHeight? p:json, timeoutTimestampNs? p:bigint, dataHash? p:hex, commitmentHash? p:hex, status? p:enum, sendTxHash? p:hex, receiveTxHash? p:hex, acknowledgeTxHash? p:hex, timeoutTxHash? p:hex
    Sources :: CosmosSdk_Rest, Mintscan_Rest, CronosExplorer_Rest
    View :: IbcPacketView top `<dl>` shows channel, sequence, direction, status, source/destination port/channel, timeout, and data/commitment hashes. Tabs: send/receive/ack/timeout transactions, payload evidence, counterparty context.
    Notes :: Packet sequence is channel-local. Packet lifecycle is observed through SDK state and indexer transaction events; do not model explorer transfer rows as packet identity.

  Entity IcpCanister :: $network+canisterId ; $network! $:IcpNetwork, canisterId! p:str, $subnet? $:IcpSubnet, canisterKind? p:enum, candidInterfaceHash? p:hex, $$methods* $:IcpCanisterMethod, $$certifiedStates* $:IcpCertifiedState, $$requestStatuses* $:IcpRequestStatus, $$timestamps* $:IcpCanister_Timestamp
    Sources :: IcHttpsApi, IcManagementCanister, IcRegistryCanister, IcrcLedgerCanister, IcDashboard_Rest
    View :: IcpCanisterView top `<dl>` shows canister id, subnet, canister kind, latest module hash, latest status, cycles balance, and controller count. Tabs: methods, certified states, request statuses, lifecycle/state history, ledger blocks when ledger canister, source evidence.
    Notes :: Canister id is the stable selector. Module hash, controllers, cycles, subnet placement, status, memory, and freezing threshold are mutable canister-state observations.

  Entity IcpCanister_Timestamp :: $canister+timestampMs+source ; $canister! $:IcpCanister, timestampMs! p:num, source! p:str, status? p:enum, moduleHash? p:hex, controllers* p:str, cyclesBalance? p:bigint, memorySizeBytes? p:bigint, freezingThresholdSeconds? p:bigint, idleCyclesBurnedPerDay? p:bigint, canisterVersion? p:bigint, reservedCycles? p:bigint, subnetId? p:str
    Sources :: IcManagementCanister, IcHttpsApi, IcDashboard_Rest
    View :: IcpCanister_TimestampView top `<dl>` shows canister, observed time/source, status, module hash, cycles balance, memory size, canister version, and subnet id. Details show controllers, freezing threshold, burn rate, reserved cycles, and raw status.
    Notes :: This is the canister status/settings snapshot from management-canister or dashboard-derived data.

  Entity IcpCanisterMethod :: $canister+methodName+methodKind ; $canister! $:IcpCanister, methodName! p:str, methodKind! p:enum, candidSignature? p:str, certifiedResponseSupported? p:bool
    Sources :: IcHttpsApi, CandidInterface, IcDashboard_Rest
    View :: IcpCanisterMethodView top `<dl>` shows canister, method name, method kind, Candid signature, and certification support. Details show source/interface evidence.
    Notes :: Methods are callable canister interface surface. Calls and request statuses are separate rows because method metadata is not execution history.

  Entity IcpCertifiedState :: $canister+certificateHash+pathHash ; $canister! $:IcpCanister, certificateHash! p:hex, pathHash! p:hex, treeHash? p:hex, certifiedAtMs? p:num, subnetSignature? p:hex, witness? p:json, value? p:json, verificationStatus? p:enum
    Sources :: IcHttpsApi, IcAgentCertificateVerifier, CertifiedHttpGateway
    View :: IcpCertifiedStateView top `<dl>` shows canister, certificate hash, path hash, tree hash, certified time, and verification status. Tabs: decoded value, witness path, subnet/root-key signature chain, raw certificate.
    Notes :: This is the evidence row for certified canister data. It should preserve proof hashes and decoded value separately so UI can explain what was certified.

  Entity IcpLedgerBlock :: $ledger+blockIndex ; $ledger! $:IcpLedgerCanister, blockIndex! p:bigint, blockHash? p:hex, parentHash? p:hex, timestampNs? p:bigint, transactionCount? p:num, archiveCanisterId? p:str, $$transactions* $:IcpLedgerTransaction
    Sources :: IcrcLedgerCanister, IcRosettaApi, IcDashboard_Rest
    View :: IcpLedgerBlockView top `<dl>` shows ledger, block index, block hash, parent hash, timestamp, archive canister, and transaction count. Tabs: transactions, Rosetta operations, raw/source evidence.
    Notes :: Block index is ledger-local. ICP subnet consensus blocks are not exposed through this ledger row.

  Entity IcpLedgerCanister :: $canister ; $canister! $:IcpCanister, ledgerStandard! p:enum, symbol? p:str, name? p:str, decimals? p:num, fee? p:bigint, archiveCanisterIds* p:str, $$blocks* $:IcpLedgerBlock, $$transactions* $:IcpLedgerTransaction
    Sources :: IcrcLedgerCanister, IcRosettaApi, IcDashboard_Rest
    View :: IcpLedgerCanisterView top `<dl>` shows canister, standard, symbol, name, decimals, fee, and archive count. Tabs: blocks, transactions, archive canisters, methods, source evidence.
    Notes :: Ledger canisters are canisters with ICRC/ICP ledger interfaces. Do not model ledger blocks as network-global blocks.

  Entity IcpLedgerTransaction :: $block+transactionIndex ; $block! $:IcpLedgerBlock, transactionIndex! p:num, transactionHash? p:hex, operationKind? p:enum, fromAccount? p:str, toAccount? p:str, spenderAccount? p:str, amount? p:bigint, fee? p:bigint, memo? p:bigint, createdAtTimeNs? p:bigint, $ledger? $:IcpLedgerCanister
    Sources :: IcrcLedgerCanister, IcRosettaApi, IcDashboard_Rest
    View :: IcpLedgerTransactionView top `<dl>` shows operation kind, ledger, block, transaction hash, amount, fee, from/to/spender, memo, and created-at time. Tabs: Rosetta operations, raw ledger payload, related account history.
    Notes :: Ledger transactions cover transfer, mint, burn, approve, and transfer-from style operations. Canister ingress/update messages need IcpRequestStatus, not this row.

  Entity IcpNetwork :: $network ; $network! $:Network, $$subnets* $:IcpSubnet, $$canisters* $:IcpCanister, $$ledgerCanisters* $:IcpLedgerCanister, $$requestStatuses* $:IcpRequestStatus, $$timestamps* $:IcpNetwork_Timestamp
    Sources :: IcHttpsApi, IcManagementCanister, IcRegistryCanister, IcNnsGovernanceCanister, IcRosettaApi, IcrcLedgerCanister, IcDashboard_Rest
    View :: IcpNetworkView top `<dl>` shows linked base Network, latest registry version, subnet count, canister count, and root-key/certification summary. Tabs: subnets, canisters, ledger canisters, request statuses, certified-state proofs, timestamp history.
    Notes :: ICP is organized around subnets and canisters, not a single global account ledger. Keep registry/head observations on IcpNetwork_Timestamp and route canister state through canister/subnet-specific views.

  Entity IcpNetwork_Timestamp :: $network+timestampMs+source ; $network! $:IcpNetwork, timestampMs! p:num, source! p:str, registryVersion? p:bigint, subnetCount? p:num, canisterCount? p:num, boundaryNodeCount? p:num, rootKeyHash? p:hex
    Sources :: IcRegistryCanister, IcManagementCanister, IcDashboard_Rest, IcHttpsApi
    View :: IcpNetwork_TimestampView top `<dl>` shows observed time/source, registry version, subnet count, canister count, boundary node count, and root-key hash. Details show source freshness and raw registry/status payload.
    Notes :: Aggregate ICP counts and registry heads are observations, not network identity.

  Entity IcpRequestStatus :: $network+requestId ; $network! $:IcpNetwork, requestId! p:hex, $canister? $:IcpCanister, methodName? p:str, requestKind? p:enum, callerPrincipal? p:str, ingressExpiryNs? p:bigint, status? p:enum, replyHash? p:hex, rejectCode? p:num, rejectMessage? p:str, certifiedAtMs? p:num
    Sources :: IcHttpsApi, IcAgentCertificateVerifier
    View :: IcpRequestStatusView top `<dl>` shows request id, canister, method, request kind, caller, status, certified time, and reject/reply summary. Tabs: request metadata, certified status proof, reply/reject payload, source evidence.
    Notes :: Request status is the sourceable execution result for ingress/update calls through the HTTPS interface. Query calls are not consensus-certified unless tied to certified data.

  Entity IcpSubnet :: $network+subnetId ; $network! $:IcpNetwork, subnetId! p:str, subnetKind? p:enum, publicKey? p:hex, $$canisterRanges* $:IcpSubnetCanisterRange_Timestamp, $$canisters* $:IcpCanister, $$timestamps* $:IcpSubnet_Timestamp
    Sources :: IcRegistryCanister, IcManagementCanister, IcDashboard_Rest
    View :: IcpSubnetView top `<dl>` shows subnet id, subnet kind, public key, latest replica version, node count, and canister count. Tabs: canister ranges, hosted canisters, node/replica observations, certified-state evidence, timestamp history.
    Notes :: Subnet membership and replica version are registry-governed state. The row identifies the subnet; membership and health counts should be timestamped when sourced as observations.

  Entity IcpSubnet_Timestamp :: $subnet+timestampMs+source ; $subnet! $:IcpSubnet, timestampMs! p:num, source! p:str, nodeCount? p:num, canisterCount? p:num, replicaVersion? p:str, stateRootHash? p:hex, certifiedHeight? p:bigint
    Sources :: IcRegistryCanister, IcManagementCanister, IcDashboard_Rest, IcHttpsApi
    View :: IcpSubnet_TimestampView top `<dl>` shows subnet, observed time/source, node count, canister count, replica version, certified height, and state root hash. Details show source freshness and raw registry/status payload.
    Notes :: Subnet membership and replica rollout are mutable; keep the stable subnet id separate from observed composition.

  Entity IcpSubnetCanisterRange_Timestamp :: $subnet+rangeStart+rangeEnd+registryVersion ; $subnet! $:IcpSubnet, rangeStart! p:str, rangeEnd! p:str, registryVersion! p:bigint, timestampMs? p:num
    Sources :: IcRegistryCanister, IcHttpsApi
    View :: IcpSubnetCanisterRange_TimestampView top `<dl>` shows subnet, range start/end, registry version, and observed time. Details show registry/source payload.
    Notes :: Canister placement is derived from registry canister ranges and can change; model ranges as registry-versioned observations.

  Entity IpfsProtocol :: scope ; scope! p:'IpfsProtocol', protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str
    Sources :: Constants_Internal
    View :: IpfsProtocolView top `<dl>` shows protocol name, registry label, topology, home URL, docs URL, and gateway/catalog coverage. Details tabs: Browse -> IpfsBrowseView; Resources -> IpfsResource examples when linked.
    Notes :: Singleton protocol hub and browse entry point. It is not a content resource, CID, IPNS name, gateway, or retrieval observation.

  Entity IpfsResource :: namespace+target+contentPath ; namespace! p:enum, target! p:str, contentPath! p:str, canonicalUri! p:url, gatewayOrigin! p:url, gatewayUrl! p:url, fileName? p:str, extension? p:str, contentType? p:str, contentLength? p:num, displayType! p:enum, isContentTypeInferred! p:bool, text? p:str, cidVersion? p:num, cidMultibase? p:str, cidMulticodecCode? p:num, cidMultihashCode? p:num, cidMultihashDigestHex? p:hex, isCidSubdomainSafe? p:bool, $media? $:Media
    Sources :: Ipfs_Rest
    View :: IpfsResourceView top `<dl>` shows canonical URI, gateway origin/url, content type/length, file name/extension, display type, and inferred-content-type status. Details tabs: Address -> namespace, target, and content path; CID -> IpfsCidAlternateEncodings for CID encodings and subdomain safety; Preview -> text/media/binary content based on displayType.
    Notes :: IPFS resources are selected by namespace plus target plus content path. `ipfs` CID targets are content-addressed, while `ipns` targets are mutable names; gateway metadata and MIME inference are retrieval observations from the configured IPFS REST gateway source.

  Entity IssuerAction :: issuerActionId ; issuerActionId! p:str, actionKind! p:enum, $assetInstance! $:AssetInstance, targetSelector? p:json, amount? p:bigint, $issuerPower? $:IssuerPower
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Sourcify_Rest, Solana_JsonRpc, Helius_Rest, HederaMirrorNode_Rest, TronGrid_Rest, TronScan_Rest, Dune_Rest, Allium_Rest
    View :: IssuerActionView top `<dl>` shows action kind, asset instance, target selector, amount, and linked issuer power. Details tabs: Asset -> AssetInstanceView; Issuer power -> IssuerPowerView; Evidence -> transaction, event/log, instruction, or mirror-node action payload when modeled.
    Notes :: Source-backed administrative action such as mint, burn, freeze, unfreeze, forced transfer, pause, unpause, role grant/revoke, or registry update. Do not use this for broad issuer capabilities without a transaction, event, instruction, or signed source proof.

  Entity IssuerPower :: issuerPowerId ; issuerPowerId! p:str, $assetInstance! $:AssetInstance, powerKind! p:enum, actorSelector? p:json, scope? p:json, source? p:enum
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Sourcify_Rest, Solana_JsonRpc, Helius_Rest, HederaMirrorNode_Rest, TronGrid_Rest, TronScan_Rest, Dune_Rest, Allium_Rest
    View :: IssuerPowerView top `<dl>` shows asset instance, power kind, actor selector, scope, and source. Details tabs: Asset -> AssetInstanceView; Actions -> IssuerAction list; Evidence -> role/member state, role events, owner/agent calls, mint authority, token keys, or verified ABI context.
    Notes :: Authority observation for owner, agent, pauser, minter, freezer, supply, wipe, KYC, role-admin, permanent delegate, or comparable token-control powers. Prefer current contract/mint/token state when enumerable; otherwise derive from role events and verified ABIs with source-specific caveats. Do not treat verified source code alone as current permission state.

  Entity KaspaAcceptedTransaction :: $acceptingBlock+$transaction ; $acceptingBlock! $:KaspaBlock, $transaction! $:KaspaTransaction, acceptedIndex? p:num, acceptingBlockHash! p:hex, transactionId! p:hex, removedByVirtualChainChange? p:bool
    Sources :: KaspaNode_Wrpc, KaspaNode_Grpc
    View :: KaspaAcceptedTransactionView top `<dl>` shows accepting block, transaction, accepted index, and rollback flag. Details show virtual-chain event/checkpoint source evidence.
    Notes :: Accepted transactions are the durable ingestion unit from virtual-chain APIs. Rollbacks near active tips are represented by virtual-chain change observations, not by deleting the transaction entity.

  Entity KaspaAddress :: $network+address ; $network! $:KaspaNetwork, address! p:str, $$transactions* $:KaspaTransaction, $$timestamps* $:KaspaAddress_Timestamp
    Sources :: KaspaNode_Wrpc, KaspaNode_Grpc, KaspaRest_Rest, KaspaExplorer_Rest
    View :: KaspaAddressView top `<dl>` shows address, latest balance, UTXO count, transaction count, and source freshness. Tabs: transactions, UTXO/balance snapshots, related outputs, source evidence.
    Notes :: Address balance is derived from UTXOs and indexer head state. Keep address identity separate from timestamped balance/UTXO observations.

  Entity KaspaAddress_Timestamp :: $address+timestampMs+source ; $address! $:KaspaAddress, timestampMs! p:num, source! p:str, balanceSompi? p:bigint, utxoCount? p:num, transactionCount? p:num
    Sources :: KaspaNode_Wrpc, KaspaNode_Grpc, KaspaRest_Rest, KaspaExplorer_Rest
    View :: KaspaAddress_TimestampView top `<dl>` shows address, observed time/source, balance in sompi, UTXO count, and transaction count. Details show source freshness and raw balance/UTXO payload.
    Notes :: Address balance should be treated as an indexer observation because the chain model is UTXO-based.

  Entity KaspaBlock :: $network+blockHash ; $network! $:KaspaNetwork, blockHash! p:hex, version? p:num, timestampMs? p:num, blueScore? p:bigint, daaScore? p:bigint, bits? p:num, nonce? p:bigint, hashMerkleRoot? p:hex, acceptedIdMerkleRoot? p:hex, utxoCommitment? p:hex, selectedParentHash? p:hex, parentHashes* p:hex, mergeSetBlues* p:hex, mergeSetReds* p:hex, $$acceptedTransactions* $:KaspaAcceptedTransaction
    Sources :: KaspaNode_Wrpc, KaspaNode_Grpc, KaspaRest_Rest, KaspaExplorer_Rest
    View :: KaspaBlockView top `<dl>` shows block hash, timestamp, blue score, DAA score, selected parent, parent count, accepted transaction count, and UTXO commitment. Tabs: parents, merge-set blues, merge-set reds, accepted transactions, header roots, DAG context.
    Notes :: Preserve mergeSetBlues and mergeSetReds because they are the blockDAG-specific context users need; do not collapse this into a parent-only block view.

  Entity KaspaNetwork :: $network ; $network! $:Network, $$blocks* $:KaspaBlock, $$transactions* $:KaspaTransaction, $$acceptedTransactions* $:KaspaAcceptedTransaction, $$addresses* $:KaspaAddress, $$timestamps* $:KaspaNetwork_Timestamp, $$virtualChainTimestamps* $:KaspaVirtualChain_Timestamp
    Sources :: KaspaNode_Wrpc, KaspaNode_Grpc, KaspaRest_Rest, KaspaExplorer_Rest
    View :: KaspaNetworkView top `<dl>` shows linked base Network, latest virtual selected parent, pruning point, virtual DAA score, virtual blue score, and indexed transaction count. Tabs: blockDAG blocks, accepted transactions, transactions, addresses, virtual-chain history, network timestamp history.
    Notes :: Kaspa is a blockDAG, not a linear longest-chain model. Network observations should track blue score/DAA score/head context on KaspaNetwork_Timestamp.

  Entity KaspaNetwork_Timestamp :: $network+timestampMs+source ; $network! $:KaspaNetwork, timestampMs! p:num, source! p:str, virtualDaaScore? p:bigint, virtualBlueScore? p:bigint, virtualSelectedParentHash? p:hex, pruningPointHash? p:hex, sinkCount? p:num, blockCount? p:num, transactionCount? p:num, difficulty? p:num, hasUtxoIndex? p:bool, serverVersion? p:str
    Sources :: KaspaNode_Wrpc, KaspaNode_Grpc, KaspaRest_Rest, KaspaExplorer_Rest
    View :: KaspaNetwork_TimestampView top `<dl>` shows observed time/source, virtual DAA score, virtual blue score, selected parent, pruning point, sink count, UTXO-index availability, and server version. Details show block/transaction counts and difficulty.
    Notes :: These are as-of DAG head and indexer stats; the network row should not carry mutable head scores.

  Entity KaspaTransaction :: $network+transactionId ; $network! $:KaspaNetwork, transactionId! p:hex, version? p:num, lockTime? p:bigint, subnetworkId? p:hex, gas? p:bigint, payloadHash? p:hex, payloadLength? p:num, mass? p:bigint, blockHashes* p:hex, $$inputs* $:UtxoInput, $$outputs* $:UtxoOutput, $$acceptances* $:KaspaAcceptedTransaction
    Sources :: KaspaNode_Wrpc, KaspaNode_Grpc, KaspaRest_Rest, KaspaExplorer_Rest
    View :: KaspaTransactionView top `<dl>` shows transaction id, version, subnetwork id, mass, payload length, accepted status, and accepting block count. Tabs: UTXO inputs, UTXO outputs, accepting blocks, payload, source evidence.
    Notes :: A transaction can appear in DAG blocks before becoming accepted by the virtual selected parent chain. Keep acceptance as explicit KaspaAcceptedTransaction rows instead of treating every block hash as final inclusion.

  Entity KaspaVirtualChain_Timestamp :: $network+startHash+timestampMs+source ; $network! $:KaspaNetwork, startHash! p:hex, timestampMs! p:num, source! p:str, minConfirmationCount? p:num, addedChainBlockHashes* p:hex, removedChainBlockHashes* p:hex, acceptedTransactionCount? p:num, nextCheckpointHash? p:hex
    Sources :: KaspaNode_Wrpc, KaspaNode_Grpc
    View :: KaspaVirtualChain_TimestampView top `<dl>` shows network, start hash, observed time/source, confirmation buffer, added/removed block counts, accepted transaction count, and next checkpoint. Tabs: added blocks, removed blocks, accepted transactions, rollback effects.
    Notes :: This row captures virtual selected parent chain movement for ingestion. It is an observation stream, not a stable chain entity.

  Entity LensAccount :: address | localName | legacyProfileId ; address! p:evmAddress, legacyProfileId! p:str, localName! p:str, displayName? p:str, bio? p:str, createdAt? p:num, $$timestamps* $:LensAccount_Timestamp, $icon? $:Media, $$posts* $:LensPost
    Sources :: Lens_Graphql
    View :: LensAccountView top `<dl>` shows address, local name, legacy profile id, display name, bio, created time, icon, and latest follower/following snapshot. Details tabs: Posts -> LensPostsView; Metric snapshots -> LensAccount_TimestampsView.
    Notes :: Lens account identity is not just a display handle. Keep `address`, `localName`, and `legacyProfileId` distinct and let the resolver equate them when Lens data proves the mapping. Follower/following counts belong on `LensAccount_Timestamp`.

  Entity LensAccount_Timestamp :: $account+timestampMs ; $account! $:LensAccount, timestampMs! p:num, followerCount? p:num, followingCount? p:num
    Sources :: Lens_Graphql
    View :: LensAccount_TimestampView top `<dl>` shows account, observation time, follower count, and following count. LensAccountView shows latest counters and history through LensAccount_TimestampsView.
    Notes :: Lens profile counters are observation rows. Do not persist them on `LensAccount` because indexer state can change independently from the account identity/profile fields.

  Entity LensNetwork :: scope ; scope! p:'LensNetwork', protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str, $$lensAccounts+ $:LensAccount, $$lensPosts+ $:LensPost
    Sources :: Constants_Internal, Lens_Graphql
    View :: LensNetworkView top `<dl>` shows protocol name, registry label, topology, home URL, docs URL, account count, post count, and source coverage. Details tabs: Accounts -> LensAccountsView; Posts -> LensPostsView.
    Notes :: Implemented singleton social protocol hub. It is not a Lens account, profile ownership claim, or full protocol archive; account/post rows hold the sourceable domain state.

  Entity LensPost :: id ; id! p:str, $author? $:LensAccount, text? p:str, timestamp? p:num, isEdited? p:bool, isDeleted? p:bool, $$timestamps* $:LensPost_Timestamp, $commentOn? $:LensPost, $quoteOf? $:LensPost, $repostOf? $:LensPost, $root? $:LensPost, $$comments* $:LensPost
    Sources :: Lens_Graphql
    View :: LensPostView top `<dl>` shows id, text, timestamp, edit/delete state, author, comment/quote/repost/root refs, and latest comment/repost/quote/bookmark/collect/reaction snapshot. Details tabs: Text -> full post text; Author -> LensAccountView; Comments -> LensCommentsView; References -> comment/quote/repost/root LensPostView refs; Metric snapshots -> LensPost_TimestampsView.
    Notes :: Lens post graph edges are explicit fields (`$commentOn`, `$quoteOf`, `$repostOf`, `$root`) rather than one generic relation. Keep post counters on `LensPost_Timestamp`, and do not add `$socialObject` until the cross-protocol projection is implemented.

  Entity LensPost_Timestamp :: $post+timestampMs ; $post! $:LensPost, timestampMs! p:num, commentCount? p:num, repostCount? p:num, quoteCount? p:num, bookmarkCount? p:num, collectCount? p:num, reactionCount? p:num
    Sources :: Lens_Graphql
    View :: LensPost_TimestampView top `<dl>` shows post, observation time, comment count, repost count, quote count, bookmark count, collect count, and reaction count. LensPostView shows latest counters and history through LensPost_TimestampsView.
    Notes :: Lens engagement metrics are source/time observations. Preserve Lens-specific counter names because they do not map one-to-one to Farcaster, X, or generic social metrics.

  Entity Leverage :: $network+id ; $network! $:EvmNetwork, id! p:str, $pool! $:LiquidityPool, $owner! $:EvmAccount, tickLower! p:num, tickUpper! p:num, liquidity! p:bigint, token0Owed! p:bigint, token1Owed! p:bigint, tokenId? p:bigint, origin? p:str, createdAtTimestamp? p:num
    Sources :: Local_Internal
    View :: LeverageView top `<dl>` shows position id, network derived from pool, pool, owner, tick lower, tick upper, liquidity, token0 owed, token1 owed, token id, origin, and created timestamp. Details tabs: Pool -> LiquidityPoolView; Owner -> EvmNetworkAccountView; Range/accounting -> ticks, liquidity, owed token amounts; Compatibility warning -> not CEX margin, borrow APR, liquidation, or Dexscreener pool leverage.
    Notes :: Compatibility-debt row for concentrated-liquidity LP position accounting with the same field shape as LiquidityPosition. Do not expand it into generic leverage/margin ontology without a real lending/perps source and separate selectors.

  Entity LightningChannel :: $network+channelId ; $network! $:Network, channelId! p:str, shortChannelId? p:str, status? p:enum, $node0? $:LightningNode, $node1? $:LightningNode, capacitySats? p:bigint, localBalanceSats? p:bigint, remoteBalanceSats? p:bigint, unsettledBalanceSats? p:bigint, fundingTransactionId? p:str, fundingOutputIndex? p:num, closingTransactionId? p:str, closingFeeSats? p:bigint, closingReason? p:str, openedAtMs? p:num, closedAtMs? p:num, updatedAtMs? p:num, feeRatePpm? p:num, active? p:bool, private? p:bool, initiator? p:bool, $$htlcs* $:LightningHtlc
    Sources :: LightningMempoolSpace_Rest, Amboss_Graphql, LightningLnd_Rest
    View :: LightningChannelView top `<dl>` shows network, channel id, short channel id, status, capacity, node0, node1, local/remote/unsettled balances, fee rate, active/private/initiator flags. Details tabs: Nodes -> node0 and node1 LightningNodeView; Funding -> funding transaction id/output index and opening time; Closing -> closing transaction, fee, reason, closed time; HTLCs -> LightningHtlc list from local node state; Network -> LightningNetworkView. LightningChannelsView lists channels under LightningNetworkView.
    Notes :: Public graph sources expose announced channels, endpoints, capacity, policy/fee hints, and open/closed-ish status. LND exposes local/private state, balances, active/private/initiator flags, and in-flight HTLCs. Keep local-only channel state source-scoped; do not treat missing public graph data as proof a private channel does not exist.

  Entity LightningHtlc :: $channel+htlcIndex ; $channel! $:LightningChannel, htlcIndex! p:num, direction? p:enum, amountMsat? p:bigint, expiryHeight? p:bigint, hashLock? p:str, state? p:str
    Sources :: LightningLnd_Rest
    View :: LightningHtlcView top `<dl>` shows channel, HTLC index, direction, amount msat, expiry height, hash lock, and state. Details tabs: Channel -> LightningChannelView; Timing -> expiry height and local state; Payment hash -> hash lock display.
    Notes :: HTLCs are local channel state, not public graph entities. Public graph indexers should not invent these rows. The selector is channel plus local index because LND exposes in-flight HTLCs as entries within one channel view.

  Entity LightningInvoice :: $network+paymentHash ; $network! $:Network, paymentHash! p:str, paymentRequest? p:str, memo? p:str, valueMsat? p:bigint, amountPaidMsat? p:bigint, createdAtMs? p:num, settledAtMs? p:num, state? p:enum, expirySeconds? p:num, private? p:bool, addIndex? p:bigint, settleIndex? p:bigint
    Sources :: LightningLnd_Rest
    View :: LightningInvoiceView top `<dl>` shows network, payment hash, memo, state, value msat, amount paid msat, created time, settled time, expiry seconds, private flag, add index, settle index, and payment request. Details tabs: Payment request -> full BOLT11 string; Settlement -> amount paid, settled time, settle index; Network -> LightningNetworkView. LightningInvoicesView lists invoices under LightningNetworkView local payments.
    Notes :: Invoice is local node/accounting state from LND, keyed here by payment hash. Do not model invoices as public network graph entities. BOLT11 parsing can later add route hints/features as fields or child facets if a source exposes them consistently.

  Entity LightningNetwork :: $network ; $network! $:Network, name! p:str, $settlementNetwork! $:Network, $$timestamps+ $:LightningNetwork_Timestamp, $$nodes+ $:LightningNode, $$channels+ $:LightningChannel, $$invoices* $:LightningInvoice, $$payments* $:LightningPayment
    Sources :: Constants_Internal, LightningMempoolSpace_Rest, Amboss_Graphql, LightningLnd_Rest
    View :: LightningNetworkView top `<dl>` shows name, settlement network, and latest snapshot. Details tabs: Graph -> Nodes, Channels, Local payments with LightningInvoicesView and LightningPaymentsView; Assets -> settlement asset from the underlying Network native asset list; Resources -> faucets and block explorers. HTLCs are reached through LightningChannelView.
    Notes :: LightningNetwork is a payment-channel network projection over a settlement Network, not a base-layer chain. Separate public graph data from local node state: public sources provide graph nodes/channels/snapshots, while LND provides local invoices, payments, private channels, and HTLCs.

  Entity LightningNetwork_Timestamp :: $lightningNetwork+timestampMs ; $lightningNetwork! $:LightningNetwork, timestampMs! p:num, nodeCount? p:num, channelCount? p:num, totalCapacitySats? p:bigint, torNodeCount? p:num, clearnetNodeCount? p:num, unannouncedNodeCount? p:num, averageCapacitySats? p:bigint, medianCapacitySats? p:bigint, averageFeeRatePpm? p:num, medianFeeRatePpm? p:num
    Sources :: LightningMempoolSpace_Rest, Amboss_Graphql, LightningLnd_Rest
    View :: LightningNetwork_TimestampView top `<dl>` shows lightning network, timestamp, node count, channel count, total capacity, Tor/clearnet/unannounced counts, average/median capacity, and average/median fee rate. Details tabs: Graph size -> node/channel counts; Capacity -> total/average/median capacity; Connectivity -> Tor/clearnet/unannounced counts; Fees -> average/median fee rate.
    Notes :: Timestamp row is for observed graph metrics. Do not put volatile graph counts or capacity aggregates on LightningNetwork. Public graph indexers and a local LND node can see different graph subsets, so source/freshness should remain visible.

  Entity LightningNode :: $network+publicKey ; $network! $:Network, publicKey! p:str, alias? p:str, color? p:str, capacitySats? p:bigint, channelCount? p:num, firstSeenMs? p:num, updatedAtMs? p:num, countryCode? p:str, city? p:str, networkAddresses+ p:str, $$channels+ $:LightningChannel
    Sources :: LightningMempoolSpace_Rest, Amboss_Graphql, LightningLnd_Rest
    View :: LightningNodeView top `<dl>` shows network, public key, alias, color, capacity, channel count, first seen, updated time, country, city, and network addresses. Details tabs: Channels -> LightningChannel list; Location -> country/city and source labels; Addresses -> advertised network addresses; Network -> LightningNetworkView. LightningNodesView lists nodes under LightningNetworkView.
    Notes :: Node identity is the secp256k1 public key. Alias, color, location, addresses, capacity, and channel count are mutable/source-observed graph fields. Do not treat alias or geography as selectors, and keep local LND visibility distinct from public graph indexer coverage.

  Entity LightningPayment :: $network+paymentHash ; $network! $:Network, paymentHash! p:str, paymentRequest? p:str, valueMsat? p:bigint, feeMsat? p:bigint, createdAtMs? p:num, status? p:enum, failureReason? p:str, preimage? p:str, paymentIndex? p:bigint
    Sources :: LightningLnd_Rest
    View :: LightningPaymentView top `<dl>` shows network, payment hash, status, value msat, fee msat, created time, failure reason, preimage, payment index, and payment request. Details tabs: Payment request -> full BOLT11 string when present; Result -> status, failure reason, preimage, fee; Network -> LightningNetworkView. LightningPaymentsView lists payments under LightningNetworkView local payments.
    Notes :: Payment is local node send/accounting state from LND, not a public graph object. Payment hash can overlap with invoices, but invoice and payment lifecycles are distinct local records; link them in views only when the same payment hash is resolved from both selectors.

  Entity LiquidityPool :: $network+id ; $network! $:EvmNetwork, id! p:str, $baseToken? $:EvmContract, $quoteToken? $:EvmContract, fee? p:num, tickSpacing? p:num, $hooks? $:EvmContract, v4PoolId? p:hex, $$timestamps+ $:LiquidityPool_Timestamp, $$blocks+ $:LiquidityPool_Block, baseTokenSymbol? p:str, quoteTokenSymbol? p:str, baseTokenDecimals? p:num, quoteTokenDecimals? p:num, pairCreatedAtMs? p:num, dexscreenerLabels* p:str, dexId? p:str, dexscreenerPairUrl? p:url
    Sources :: Dexscreener_OpenApi, Voltaire_JsonRpc
    View :: LiquidityPoolView top `<dl>` shows pool id, base/quote token contracts, token symbols, pair created time, labels, DEX id, Dexscreener URL, and expanded-only on-chain curve fields such as fee, tick spacing, hooks, v4 pool id, and token decimals. Details tabs: Observations -> LiquidityPool_TimestampsView; Block state -> LiquidityPool_Block list; Base token -> EvmContractView; Quote token -> EvmContractView.
    Notes :: Dexscreener provides pair discovery/feed metadata and latest observations, not exhaustive pool discovery or canonical AMM state. Fee tier, tick spacing, hooks, v4 pool id, decimals, and block-level curve state require execution RPC or a pool-specific indexer.

  Entity LiquidityPool_Block :: $liquidityPool+blockNumber ; $liquidityPool! $:LiquidityPool, blockNumber! p:bigint, $parentLiquidityPool! $:LiquidityPool, sqrtPriceX96? p:bigint, liquidity? p:bigint, tick? p:num, observationIndex? p:num, observationCardinality? p:num, observationCardinalityNext? p:num, feeProtocol? p:num, unlocked? p:bool
    Sources :: Voltaire_JsonRpc
    View :: LiquidityPool_BlockView top `<dl>` shows pool, block number, parent pool, sqrt price, in-range liquidity, tick, observation index/cardinality/cardinality next, fee protocol, and unlocked state. Details tabs: Parent pool -> LiquidityPoolView; On-chain curve state -> slot0/liquidity values; Block context -> EvmBlockView when the network block is resolved.
    Notes :: Block-bounded on-chain AMM state row. Do not backfill these fields from Dexscreener latest-pair statistics; absence means the pool ABI/mapping or archive block read is not wired.

  Entity LiquidityPool_Timestamp :: $liquidityPool+timestampMs+feedKey ; $liquidityPool! $:LiquidityPool, timestampMs! p:num, feedKey! p:str, $parentLiquidityPool! $:LiquidityPool, priceUsd? p:str, priceNative? p:str, liquidityUsd? p:num, volumeUsd24h? p:num, priceChangePercent24h? p:num, transactionBuys24h? p:num, transactionSells24h? p:num, marketCapUsd? p:num, fdvUsd? p:num, transport? p:str
    Sources :: Dexscreener_OpenApi
    View :: LiquidityPool_TimestampView top `<dl>` shows observed timestamp, parent pool, price USD/native, liquidity USD, 24h volume, 24h price change, 24h buys/sells, market cap, FDV, feed key, and transport. Details tabs: Parent pool -> LiquidityPoolView; Price/liquidity -> price and TVL fields; Activity -> volume and transaction counts; Feed context -> feedKey/transport/source metadata.
    Notes :: Timestamped pair-indexer observation. Price, liquidity, volume, changes, buy/sell counts, market cap, and FDV are provider observation fields, not protocol state or candle bars.

  Entity LiquidityPosition :: $network+id ; $network! $:EvmNetwork, id! p:str, $pool! $:LiquidityPool, $owner! $:EvmAccount, tickLower! p:num, tickUpper! p:num, liquidity! p:bigint, token0Owed! p:bigint, token1Owed! p:bigint, tokenId? p:bigint, origin? p:str, createdAtTimestamp? p:num
    Sources :: Voltaire_JsonRpc, TheGraph_Graphql, Local_Internal
    View :: LiquidityPositionView top `<dl>` shows position id, network, pool, owner account, tick lower, tick upper, liquidity, token0 owed, token1 owed, token id, origin, and created timestamp. Details tabs: Pool -> LiquidityPoolView; Owner -> EvmNetworkAccountView; Range/accounting -> ticks, liquidity, owed token amounts; Network -> EvmNetworkView.
    Notes :: Concentrated-liquidity LP position state. Dexscreener pool rows do not populate position-scoped state; position resolvers require execution RPC, a protocol subgraph/indexer, or local wallet/account state.

  Entity LitecoinMwebBlock :: $block ; $block! $:UtxoBlock, hogExTransactionId? p:str, kernelRoot? p:str, $$transactions* $:LitecoinMwebTransaction
    Sources :: LitecoinCore_JsonRpc
    View :: LitecoinMwebBlockView top `<dl>` shows parent UTXO block, HogEx transaction id, and kernel root. Details tabs: Parent block -> UtxoBlockView; Transactions -> LitecoinMwebTransaction list; Peg flows -> peg-in/peg-out rows through transactions.
    Notes :: Stable selector is the Litecoin UtxoBlock carrying an MWEB extension block. MWEB extension-block fields stay separate from transparent UTXO block fields; do not infer private amounts or ownership from public MWEB commitments.

  Entity LitecoinMwebOutput :: $transaction+outputIndex ; $transaction! $:LitecoinMwebTransaction, outputIndex! p:num, commitment? p:str, senderPubkey? p:str
    Sources :: LitecoinCore_JsonRpc
    View :: LitecoinMwebOutputView top `<dl>` shows transaction, output index, commitment, and sender pubkey. Details tabs: Transaction -> LitecoinMwebTransactionView; Commitment -> public output commitment fields; Local wallet match -> Blockhead wallet state when a connected wallet can identify ownership.
    Notes :: Public MWEB output row scoped by transaction plus output index. Commitment and sender pubkey are public MWEB data; note value, recipient, memo-like wallet context, and spendability require local wallet state.

  Entity LitecoinMwebPegIn :: $transaction+pegInIndex ; $transaction! $:LitecoinMwebTransaction, pegInIndex! p:num, $transparentOutput? $:UtxoOutput, amountLitoshis? p:bigint
    Sources :: LitecoinCore_JsonRpc
    View :: LitecoinMwebPegInView top `<dl>` shows transaction, peg-in index, transparent output, and amount in litoshis. Details tabs: Transaction -> LitecoinMwebTransactionView; Transparent output -> UtxoOutputView; Amount -> peg-in accounting context.
    Notes :: Peg-in bridges transparent Litecoin value into the MWEB extension block. Keep it linked to UtxoOutput rather than modeling a separate asset bridge.

  Entity LitecoinMwebPegOut :: $transaction+pegOutIndex ; $transaction! $:LitecoinMwebTransaction, pegOutIndex! p:num, $transparentOutput? $:UtxoOutput, amountLitoshis? p:bigint
    Sources :: LitecoinCore_JsonRpc
    View :: LitecoinMwebPegOutView top `<dl>` shows transaction, peg-out index, transparent output, and amount in litoshis. Details tabs: Transaction -> LitecoinMwebTransactionView; Transparent output -> UtxoOutputView; Amount -> peg-out accounting context.
    Notes :: Peg-out bridges MWEB value back to transparent Litecoin outputs. Treat transparent output linkage as the public spend target; wallet ownership still belongs to account/output wallet state.

  Entity LitecoinMwebTransaction :: $mwebBlock+transactionIndex ; $mwebBlock! $:LitecoinMwebBlock, transactionIndex! p:num, kernelOffset? p:str, $$outputs* $:LitecoinMwebOutput, $$pegIns* $:LitecoinMwebPegIn, $$pegOuts* $:LitecoinMwebPegOut
    Sources :: LitecoinCore_JsonRpc
    View :: LitecoinMwebTransactionView top `<dl>` shows MWEB block, transaction index, and kernel offset. Details tabs: Outputs -> LitecoinMwebOutput list; Peg-ins -> LitecoinMwebPegIn list; Peg-outs -> LitecoinMwebPegOut list; Block -> LitecoinMwebBlockView.
    Notes :: MWEB transaction identity is extension block plus transaction index. Public rows expose commitments and peg flows, while private note-level ownership/state needs Blockhead-prefixed connected-wallet rows.

  Entity LogosAccount :: $network+accountAddress ; $network! $:Network, accountAddress! p:str, $zone? $:LogosZone
    Sources :: Local_Internal
    View :: LogosAccountView top `<dl>` shows network, account address, and zone when known. Details tabs: Zone -> LogosZoneView; Transactions -> LogosTransaction list when a source exists; Network -> LogosNetworkView/NetworkView.
    Notes :: Registered schema/view row without a Logos account source enum today. Do not infer Logos accounts from generic Substrate accounts, docs pages, or UI addresses without a Logos node/indexer source.

  Entity LogosTransaction :: $network+transactionHash ; $network! $:Network, transactionHash! p:str, $account? $:LogosAccount, $zone? $:LogosZone, transactionKind? p:str
    Sources :: Local_Internal
    View :: LogosTransactionView top `<dl>` shows network, transaction hash, account, zone, and transaction kind. Details tabs: Account -> LogosAccountView; Zone -> LogosZoneView; Network -> LogosNetworkView/NetworkView; Raw transaction -> source payload when a node/indexer exists.
    Notes :: Registered schema/view row without a Logos transaction source enum today. Keep it separate from Substrate/Polkadot extrinsics unless a Logos source defines transaction hashes and zone semantics explicitly.

  Entity LogosZone :: $network+zoneId ; $network! $:Network, zoneId! p:str, zoneKind? p:str
    Sources :: LogosDocs_Rest
    View :: LogosZoneView top `<dl>` shows network, zone id, and zone kind. Details tabs: Accounts -> LogosAccount list when source-backed; Transactions -> LogosTransaction list when source-backed; Network -> LogosNetworkView/NetworkView.
    Notes :: Docs-backed Logos stack component row for currently documented testnet components such as DVCI, Logos Chain, Network Gatekeeper, and W3bI. Do not treat docs-only components as account or transaction sources.

  Entity MagnetLink :: magnetUri ; magnetUri! p:str, infoHash? p:hex, displayName? p:str, exactLength? p:bigint, trackers* p:url, webSeeds* p:url, acceptableSources* p:url, $torrent? $:BitTorrentMetainfo
    Sources :: Local_Internal
    View :: MagnetLinkView top `<dl>` shows magnet URI, info hash, display name, exact length, tracker count, web seed count, acceptable source count, and linked torrent. Details tabs: Parameters -> grouped `xt`/`dn`/`xl`/`tr`/`ws`/`as` values; Trackers -> BitTorrentTracker list for `tr`; Torrent -> BitTorrentMetainfoView when resolved.
    Notes :: Parsed magnet URI. `xt=urn:btih`/`btmh` provides the exact BitTorrent topic hash, while `dn`, `xl`, `tr`, `ws`, and `as` are discovery/display hints. Link `$torrent` only when metadata resolution or a local catalog confirms a matching BitTorrentMetainfo row.

  Entity MagnetResolutionObservation :: magnetUri+timestampMs+source ; magnetUri! p:str, timestampMs! p:num, source! p:str, resolvedInfoHash? p:hex, resolvedMetainfoHash? p:hex, trackerCount? p:num, webSeedCount? p:num, status! p:enum, error? p:str
    Sources :: Local_Internal
    View :: MagnetResolutionObservationView top `<dl>` shows magnet URI, source, timestamp, status, resolved info hash, resolved metainfo hash, tracker count, web seed count, and error. Details tabs: Magnet -> MagnetLinkView; Torrent -> BitTorrentMetainfoView when resolved; Evidence -> parser/DHT/metadata-exchange/web-seed payload when retained.
    Notes :: Local resolution attempt for a magnet URI through parser, DHT metadata exchange, tracker/bootstrap source, web seed, or local catalog. Resolution is an observation and can be incomplete even when the magnet URI is syntactically valid.

  Entity Market :: $base+$quote+$marketVenue+marketKind ; $base! p:marketAsset, $quote! p:marketAsset, $marketVenue! p:{marketVenueId:enum}, marketKind! p:enum, $baseCoin? $:Coin, $$marketPrices+ $:MarketPrice, $$marketTimeIntervalTimestamps+ $:Market_TimeInterval_Timestamp, $$derivativeTimestamps+ $:Market_Derivative_Timestamp, $$oracleFeeds+ $:OracleFeed
    Sources :: Constants_Internal, Coingecko_Rest, Coingecko_OpenApi, CoinMarketCap_Rest, Coinpaprika_OpenApi, Voltaire_JsonRpc
    View :: MarketView title shows venue/base-quote/kind; top `<dl>` shows kind, venue via MarketVenueView, latest derivative observation for non-spot markets, base asset, and quote asset. Details sections: Spot -> MarketPricesView; OHLC -> MarketOhlcHub; Derivative observations -> Market_Derivative_TimestampsView for non-spot markets.
    Notes :: Market identity is the curated base asset, quote asset, venue, and market kind selector; `MarketAsset` is a primitive union over Coin, CoinInstance, and Currency, not its own entity. Provider pair ids, feed ids, search results, market ranks, and quote/OHLC freshness belong on MarketPrice, Market_Timestamp, Market_TimeInterval_Timestamp, Market_Derivative_Timestamp, or OracleFeed rows unless they are explicitly curated into the selector.

  Entity Market_Derivative_Timestamp :: $market+timestampMs+feedKey ; $market! $:Market, timestampMs! p:num, feedKey! p:str, $parentMarket! $:Market, fundingRate? p:num, openInterestUsd? p:bigint, indexBasisPercent? p:num, markPrice? p:bigint, indexPrice? p:bigint, expiredAtMs? p:num, lastTradedAtMs? p:num, providerAssetId? p:str, transport? p:str
    Sources :: Coingecko_OpenApi, CoinMarketCap_Rest, Coinpaprika_OpenApi, TradingView_Rest
    View :: Market_Derivative_TimestampView top `<dl>` shows market, observed time, feed key, parent market, funding rate, open interest USD, index basis, mark price, index price, expiry, last traded time, provider asset id, and transport. MarketView shows the latest derivative observation near the top for non-spot markets and a derivative observations section for history.
    Notes :: Derivative observation row for mapped provider exchange/ticker feeds. `providerAssetId` and `transport` identify the source instrument/feed, while funding, open interest, mark/index price, expiry, and last traded time are source observations. Do not invent a separate derivative contract/instrument entity until a source provides stable instrument identity beyond provider feed ids.

  Entity Market_TimeInterval_Timestamp :: $market+timeInterval+timestampMs ; $market! $:Market, timeInterval! p:{unit:enum,value:num}, timestampMs! p:num, $parentMarket! $:Market, open? p:bigint, high? p:bigint, low? p:bigint, close? p:bigint, volume? p:bigint, quoteVolume? p:bigint, tradeCount? p:num, vwap? p:bigint
    Sources :: Constants_Internal, Coingecko_Rest, Coingecko_OpenApi, Coinpaprika_OpenApi, CoinMarketCap_Rest
    View :: Market_TimeInterval_TimestampView top `<dl>` shows market, parent market, interval, interval start, open, high, low, close, volume, quote volume, trade count, and VWAP. MarketOhlcHub and Market_TimeInterval_TimestampsView own chart/history organization by interval.
    Notes :: OHLC/candle observation. `timestampMs` is the interval start used by the provider/catalog mapping. Coingecko, Coinpaprika, and CoinMarketCap expose OHLC/OHLCV fields; DefiLlama close-price charts are not modeled as OHLC candles because they do not fulfill open/high/low semantics.

  Entity Market_Timestamp :: $market+timestampMs+feedKey ; $market! $:Market, timestampMs! p:num, feedKey! p:str, price! p:bigint, transport? p:str, providerAssetId? p:str, marketCap? p:bigint, volume24h? p:bigint, caip19? p:str
    Sources :: Blockscout_Rest, Coingecko_Rest, Coingecko_OpenApi, CoinMarketCap_Rest, Coinpaprika_OpenApi, Defillama_OpenApi, Defillama_Rest, TradingView_Rest
    View :: Market_TimestampView top `<dl>` shows market, quote time, feed key, price, market cap, 24h volume, CAIP-19, transport, and provider asset id. Lists should show feedKey/source context so conflicting provider prices remain comparable rather than merged.
    Notes :: As-of market observation. `feedKey` pins provider/feed identity, `timestampMs` must match the source clock, price is scaled quote value, and marketCap/volume24h/caip19/providerAssetId are optional source-observation fields. Do not copy latest price, market cap, or 24h volume onto Coin, Currency, AssetInstance, or Market.

  Entity MarketPrice :: $market ; $market! $:Market, $parentMarket! $:Market, $$quotes+ $:Market_Timestamp
    Sources :: Constants_Internal, Coingecko_Rest, Coingecko_OpenApi, CoinMarketCap_Rest, Coinpaprika_OpenApi, Defillama_OpenApi, Defillama_Rest, Blockscout_Rest, TradingView_Rest
    View :: MarketPriceView top `<dl>` shows market, parent market, latest quote when available, and quote count. Details tabs: Quotes -> Market_TimestampsView grouped by feedKey/source clock; Parent market -> MarketView.
    Notes :: Quote stream wrapper for one canonical market. Sources establish quote-stream availability for the catalog market and emit Market_Timestamp selectors; `$parentMarket` points back to the canonical catalog market, not a provider-specific pair object. Keep quote values in Market_Timestamp so multiple providers and clocks can coexist without mutating the Market header row.

  Entity MarketVenue :: marketVenueId ; marketVenueId! p:enum, label! p:str, $$markets+ $:Market
    Sources :: Constants_Internal, Coingecko_OpenApi, Coinpaprika_OpenApi, TradingView_Rest
    View :: MarketVenueView top `<dl>` shows venue id and label. Details tabs: Markets -> MarketsView; Source mappings -> provider exchange ids when exposed by source metadata.
    Notes :: Catalog venue row. Provider exchange ids can map to this enum, but unmapped provider-specific venues should stay feed/source details until promoted into the venue catalog.

  Entity Media :: url ; url! p:url, type! p:enum, transport! p:enum, hash? p:hex, $original? $:MediaObject, $thumbnail? $:MediaObject, $low? $:MediaObject, $medium? $:MediaObject, $high? $:MediaObject
    Sources :: Constants_Internal, Chainlist_Rest, EthereumLists_Rest, Lifi_Rest, MetadataVision_Rest, Ipfs_Rest, Swarm_Rest, Coingecko_Rest, CoinMarketCap_Rest, Coinpaprika_OpenApi, CosmosChainRegistry_Github, Defillama_OpenApi, TrustWalletAssets_Github, Voltaire_JsonRpc, Atproto_Xrpc, Atproto_BskySocial_Xrpc, Farcaster_Rest, Fedi_Rest, Lens_Graphql, Mastodon_Rest, Neynar_Rest, NostrBand_Rest, Piped_Rest, Reddit_Rest, Reddit_PublicJson, Snapchain_Rest, X_Rest, X_FxEmbed_Rest, Youtube_Rest
    View :: MediaView top `<dl>` shows URL, type, transport, hash, and available rendition refs. Sections: Preview -> render image/video/audio/model/other from type and URL; Renditions -> original/thumbnail/low/medium/high MediaObjectView subviews; Embedding context -> parent entity owns profile/post/token/page semantics, not this row.
    Notes :: URL-selected wrapper for displayable media referenced by catalog icons, social icons, banners, post attachments, URL previews, token metadata, IPFS, and Swarm fetches. Keep semantic attachment context on the parent row; Media identity is the media URL, not the post/profile/token/page that embeds it.

  Entity MediaObject :: url ; url! p:url, width? p:num, height? p:num, mimeType? p:str, size? p:num
    Sources :: MetadataVision_Rest, Ipfs_Rest, Swarm_Rest
    View :: MediaObjectView top `<dl>` shows URL, MIME type, dimensions, and size. Sections: Preview -> direct rendition render when MIME/type permits; Used by Media -> parent Media rows that point at this concrete rendition; Raw object -> response/header metadata when a source exposes it.
    Notes :: Concrete media object/rendition row for a dereferenceable URL. Width, height, MIME type, and size are object facts, while alt text, attachment role, attribution, and source-specific safety/classification claims belong on the embedding entity unless a source exposes stable object-level facts.

  Entity MevBuilder :: $network+builderPubkey ; $network! $:EvmNetwork, builderPubkey! p:str, deliveredPayloadCount? p:num
    Sources :: MevRelay_Rest, Relayooor_Rest, Metrika_Rest
    View :: MevBuilderView(summary builder pubkey, delivered payload count); EvmNetworkView lists builders under MEV-Boost
    Notes :: Implemented builder row keyed by builder public key on a network. Counts are source-window observations from relay queries, not global builder market share or validator-level attribution.

  Entity MevRelay :: $network+host ; $network! $:EvmNetwork, host! p:str, url! p:str
    Sources :: Constants_Internal
    View :: MevRelayView(summary relay host, URL); EvmNetworkView lists relays under Consensus & Block Production / MEV-Boost
    Notes :: Implemented relay catalog row. Relay identity is host scoped to an EVM network; relay liveness, censorship, bid stats, and policy claims should be separate timestamped/source rows if modeled.

  Entity MevRelay_ProposerPayloadDelivered :: $network+relayHost+slot+blockHash ; $network! $:EvmNetwork, relayHost! p:str, slot! p:num, blockHash! p:hex, builderPubkey? p:str, value? p:bigint, blockNumber? p:bigint, $executionBlock? $:EvmBlock
    Sources :: MevRelay_Rest, Relayooor_Rest
    View :: MevRelay_ProposerPayloadDeliveredView(summary slot, bid value, builder pubkey, Block tab linking execution block when available); EvmNetworkView lists proposer payloads delivered under MEV-Boost
    Notes :: Implemented delivered payload row. It represents relay-published MEV-Boost delivery metadata, not a private bundle, mempool orderflow item, validator duty, or full block profitability record.

  Entity MoneroBlock :: $network+height | $network+height+hash ; $network! $:Network, height! p:bigint, hash! p:str, $parent? $:MoneroBlock, timestampMs? p:num, majorVersion? p:num, minorVersion? p:num, nonce? p:num, difficulty? p:bigint, wideDifficulty? p:bigint, cumulativeDifficulty? p:bigint, wideCumulativeDifficulty? p:bigint, weightBytes? p:num, longTermWeightBytes? p:num, rewardAtomicUnits? p:bigint, minerTxHash? p:str, powHash? p:str, orphan? p:bool, $$transactions* $:MoneroTransaction
    Sources :: MoneroDaemonRpc_JsonRpc, ThreeXpl_Rest
    View :: MoneroBlockView top `<dl>` shows network, height, hash, parent, timestamp, version, difficulty, weight, reward, miner transaction hash, orphan state, and transaction count. Details tabs: Header -> parent, nonce, difficulty/cumulative difficulty, weight/long-term weight, timestamp; Miner transaction -> minerTxHash/reward fields; Transactions -> MoneroTransaction list; Network -> MoneroNetworkView. MoneroBlocksView lists blocks under MoneroNetworkView.
    Notes :: Public daemon-visible block row. It exposes block/header and transaction membership, not wallet ownership, recipient data, or transfer interpretation. Wallet-local scan state belongs in BlockheadMoneroWalletState and related BlockheadMonero* rows.

  Entity MoneroKeyImage :: $transaction+inputIndex+keyImage ; $transaction! $:MoneroTransaction, inputIndex! p:num, keyImage! p:str, $ring? $:MoneroRing
    Sources :: MoneroDaemonRpc_JsonRpc
    View :: MoneroKeyImageView top `<dl>` shows transaction, input index, key image, and ring status. Details tabs: Ring -> MoneroRingView; Transaction -> MoneroTransactionView; Wallet interpretation -> BlockheadMoneroTransferState only when a connected wallet links this key image.
    Notes :: Key image is public spend-linkage data for one input. It prevents double spends but does not reveal the true ring member owner. Wallet-local imported/exported key-image state belongs under BlockheadMoneroWalletState or BlockheadMoneroTransferState.

  Entity MoneroNetwork :: $network ; $network! $:Network, rpcEndpoints+ p:{url:url,transportType:enum,providerName:str}, $$timestamps* $:MoneroNetwork_Timestamp, $$blocks* $:MoneroBlock
    Sources :: Constants_Internal, MoneroDaemonRpc_JsonRpc
    View :: MoneroNetworkView top `<dl>` shows parent network, latest head snapshot, environment, native asset count, and RPC endpoint count. Details tabs: Monero -> Blocks, Network snapshots, Endpoints; Assets -> native coin; Resources -> faucets and block explorers; Local wallets -> BlockheadMoneroWalletState list when local wallet state exists.
    Notes :: Shared public Monero network projection. Blocks and daemon snapshots are public node state; transactions, stealth outputs, key images, rings, and ring members are reached through blocks/transactions, not direct network child lists. Private balances/subaddresses/transfers are Blockhead-prefixed wallet state.

  Entity MoneroNetwork_Timestamp :: $network+timestampMs ; $network! $:Network, timestampMs! p:num, height? p:bigint, targetHeight? p:bigint, topBlockHash? p:str, difficulty? p:bigint, wideDifficulty? p:bigint, cumulativeDifficulty? p:bigint, wideCumulativeDifficulty? p:bigint, blockSizeLimit? p:num, blockSizeMedian? p:num, blockWeightLimit? p:num, blockWeightMedian? p:num, databaseSize? p:num, freeSpace? p:num, greyPeerlistSize? p:num, whitePeerlistSize? p:num, incomingConnections? p:num, outgoingConnections? p:num, txCount? p:bigint, txPoolSize? p:num, altBlocksCount? p:num, targetSeconds? p:num, rpcConnections? p:num, mainnet? p:bool, nettype? p:str, offline? p:bool, synchronized? p:bool, wasBootstrapEverUsed? p:bool, version? p:str, status? p:str
    Sources :: MoneroDaemonRpc_JsonRpc
    View :: MoneroNetwork_TimestampView top `<dl>` shows timestamp, height, target height, top block hash, sync status, txpool size, peer counts, difficulty, version, and status. Details tabs: Head -> height/hash/target; Difficulty -> difficulty and cumulative difficulty fields; Blocks -> block size/weight limits and medians; Peers/mempool -> grey/white peer counts, connections, txpool size, tx count; Daemon -> nettype, mainnet, offline/synchronized/bootstrap/version/status. MoneroNetwork_TimestampsView lists snapshot history.
    Notes :: Timestamped public daemon observation. Do not put daemon height, txpool, peer counts, or sync status on MoneroNetwork itself. Different public nodes can disagree by freshness and trust, so keep source/time visible.

  Entity MoneroRing :: $keyImage ; $keyImage! $:MoneroKeyImage, $$members* $:MoneroRingMember
    Sources :: MoneroDaemonRpc_JsonRpc
    View :: MoneroRingView top `<dl>` shows key image and member count. Details tabs: Key image -> MoneroKeyImageView; Members -> MoneroRingMember list; Transaction -> parent MoneroTransactionView through key image.
    Notes :: Ring is the decoy set for one key image. It is not a list of spend owners and should not be used for attribution without wallet-local evidence.

  Entity MoneroRingMember :: $ring+memberIndex ; $ring! $:MoneroRing, memberIndex! p:num, globalOutputIndex? p:bigint, txHash? p:str, outputIndex? p:num, $stealthOutput? $:MoneroStealthOutput, publicKey? p:str, commitment? p:str, height? p:bigint, unlocked? p:bool
    Sources :: MoneroDaemonRpc_JsonRpc
    View :: MoneroRingMemberView top `<dl>` shows ring, member index, global output index, transaction hash, output index, public key, commitment, height, and unlocked state. Details tabs: Ring -> MoneroRingView; Output -> MoneroStealthOutputView when tx/output is known; Decoy context -> global output index and get_outs/source payload; Wallet interpretation -> BlockheadMoneroOutputState only when a connected wallet identifies ownership.
    Notes :: Ring member is a public decoy reference by global output index. Daemon get_outs/output-distribution surfaces can provide output key/commitment/height context, but that does not identify the real spend or owner. Link to BlockheadMoneroOutputState only from wallet-local evidence, not from ring membership alone.

  Entity MoneroStealthOutput :: $transaction+outputIndex ; $transaction! $:MoneroTransaction, outputIndex! p:num, publicKey? p:str, commitment? p:str
    Sources :: MoneroDaemonRpc_JsonRpc
    View :: MoneroStealthOutputView top `<dl>` shows transaction, output index, one-time public key, and commitment. Details tabs: Transaction -> MoneroTransactionView; Output data -> public key and RingCT commitment; Wallet match -> BlockheadMoneroTransferState only when local wallet scanning identifies ownership.
    Notes :: Public stealth output data does not reveal recipient addresses, amounts, or balances. Owned-output interpretation is connected-wallet state and belongs under BlockheadMonero* rows.

  Entity MoneroTransaction :: $network+txHash ; $network! $:Network, txHash! p:str, $block? $:MoneroBlock, version? p:num, unlockTime? p:bigint, feeAtomicUnits? p:bigint, $$keyImages* $:MoneroKeyImage, $$stealthOutputs* $:MoneroStealthOutput
    Sources :: MoneroDaemonRpc_JsonRpc, ThreeXpl_Rest
    View :: MoneroTransactionView top `<dl>` shows network, transaction hash, block, version, unlock time, fee, key-image count, and stealth-output count. Details tabs: Key images -> MoneroKeyImage list; Stealth outputs -> MoneroStealthOutput list; Block -> MoneroBlockView; Local wallet interpretation -> BlockheadMoneroTransferState when a connected wallet maps this transaction.
    Notes :: Public daemon-visible transaction structure. It intentionally does not model sender, recipient, account balance, payment id interpretation, or owned output status; those require connected wallet state and belong under BlockheadMoneroTransferState.

  Entity MoveFunction :: $module+functionName ; $module! $:MoveModule, functionName! p:str, visibility? p:enum, isEntry? p:bool, typeParameters* p:json, parameters* p:str, returnTypes* p:str
    Sources :: Sui_JsonRpc, Sui_Graphql, AptosFullnode_Rest, AptosIndexer_Graphql
    View :: MoveFunctionView top `<dl>` shows module, function name, visibility, entry flag, type parameters, parameters, and returns.

  Entity MoveModule :: $network+address+moduleName ; $network! $:Network, address! p:str, moduleName! p:str, bytecode? p:hex, abi? p:json, source? p:str, $$functions* $:MoveFunction, $$structs* $:MoveStruct
    Sources :: Sui_JsonRpc, Sui_Graphql, AptosFullnode_Rest, AptosIndexer_Graphql
    View :: MoveModuleView top `<dl>` shows network, address/package id, module name, bytecode/source availability. Details tabs: Functions -> MoveFunctionsView; Structs -> MoveStructsView; ABI/source -> structured payloads.
    Notes :: This is a Move bytecode/module artifact shared by Sui and Aptos, but the containing address means package object id on Sui and account address on Aptos.

  Entity MoveStruct :: $module+structName ; $module! $:MoveModule, structName! p:str, abilities* p:str, typeParameters* p:json, fields* p:{name:str,type:str}
    Sources :: Sui_JsonRpc, Sui_Graphql, AptosFullnode_Rest, AptosIndexer_Graphql
    View :: MoveStructView top `<dl>` shows module, struct name, abilities, type parameters, and fields.

  Entity NearAccessKey :: $account+publicKey ; $account! $:NearAccount, publicKey! p:str, nonce? p:bigint, permission? p:str, $$timestamps* $:NearAccessKey_Timestamp
    Sources :: NearRpc_JsonRpc
    View :: NearAccessKeyView top `<dl>` shows account, public key, latest nonce, latest permission, and latest observation time. Details tabs: Account -> NearAccountView; State observations -> NearAccessKey_Timestamp list; Permission -> full-access or function-call permission payload; Transactions -> NearTransaction list scoped by signer/public key when indexed.
    Notes :: Access keys are NEAR account authorization state, not wallet identity. Nonce and permission are block-bounded state from view_access_key or access-key changes; parent fields can expose latest convenience values, but historical key state/source conflicts belong on NearAccessKey_Timestamp.

  Entity NearAccessKey_Timestamp :: $accessKey+timestampMs+source ; $accessKey! $:NearAccessKey, timestampMs! p:num, source! p:enum, blockHeight? p:bigint, blockHash? p:str, nonce? p:bigint, permission? p:str, allowanceYoctoNear? p:bigint, receiverId? p:str, methodNames* p:str
    Sources :: NearRpc_JsonRpc
    View :: NearAccessKey_TimestampView top `<dl>` shows access key, observation time, source, block height/hash, nonce, permission, allowance, receiver id, and method count. Details tabs: Access key -> NearAccessKeyView; Function-call scope -> receiver id, method names, allowance; Block -> NearBlockView when block hash/height resolves; Source -> view_access_key/access_key_changes payload and freshness.
    Notes :: Block-bounded access-key state observation. Use it for nonce progression, permission changes, and function-call allowance/scope; do not treat the public key row as proof of a wallet session or long-lived account ownership beyond NEAR account authorization state.

  Entity NearAccount :: $network+accountId ; $network! $:Network, accountId! p:str, amountYoctoNear? p:bigint, lockedYoctoNear? p:bigint, storageUsageBytes? p:bigint, codeHash? p:str, $contract? $:NearContract, $$timestamps* $:NearAccount_Timestamp, $$accessKeys* $:NearAccessKey
    Sources :: NearRpc_JsonRpc, NearBlocks_Rest
    View :: NearAccountView top `<dl>` shows account id, latest balance, locked balance, storage usage, code hash, contract link, access-key count, and latest observation time. Details tabs: State observations -> NearAccount_Timestamp list; Access keys -> NearAccessKey list; Contract -> NearContractView when code is deployed; Transactions/receipts -> NearTransaction/NearReceipt lists when indexed; Source evidence -> RPC/indexer payload freshness.
    Notes :: NEAR account identity is `accountId` scoped to a network. Balance, locked amount, storage usage, and code hash are block-bounded account state from view_account/account changes or indexer account payloads; parent fields can expose latest convenience values, but history/source conflicts belong on NearAccount_Timestamp.

  Entity NearAccount_Timestamp :: $account+timestampMs+source ; $account! $:NearAccount, timestampMs! p:num, source! p:enum, blockHeight? p:bigint, blockHash? p:str, amountYoctoNear? p:bigint, lockedYoctoNear? p:bigint, storageUsageBytes? p:bigint, codeHash? p:str, deleted? p:bool
    Sources :: NearRpc_JsonRpc, NearBlocks_Rest
    View :: NearAccount_TimestampView top `<dl>` shows account, observation time, source, block height/hash, balance, locked balance, storage usage, code hash, and deleted state. Details tabs: Account -> NearAccountView; Block -> NearBlockView when block selector resolves; Contract -> NearContractView when code hash is non-empty; Source -> view_account/account_changes/indexer payload and freshness.
    Notes :: Block-bounded account state observation. Use it for balance/storage/code hash changes and account deletion evidence; do not put account balances only on the stable NearAccount row when historical or source-conflict behavior matters.

  Entity NearAction :: $transaction+actionIndex ; $transaction! $:NearTransaction, actionIndex! p:num, actionKind! p:str, methodName? p:str, depositYoctoNear? p:bigint
    Sources :: NearRpc_JsonRpc, NearBlocks_Rest
    View :: NearActionView top `<dl>` shows transaction, action index, action kind, method name, deposit, and receiver context. Details tabs: Transaction -> NearTransactionView; Payload -> action-specific transfer/stake/key/deploy/function-call fields when source-backed; Effects -> NearExecutionOutcome rows produced by the transaction status payload.
    Notes :: The action selector is transaction + action index because actions are ordered inside a transaction body. actionKind dispatches create-account, deploy-contract, function-call, transfer, stake, key, delete, and delegate variants.

  Entity NearBlock :: $network+height | $network+height+hash ; $network! $:Network, height! p:bigint, hash! p:str, $parent? $:NearBlock, epochId? p:str, timestampMs? p:num, $$chunks* $:NearChunk
    Sources :: NearRpc_JsonRpc, NearBlocks_Rest
    View :: NearBlockView top `<dl>` shows height, hash, parent, epoch id, timestamp, and chunk count. Tabs: chunks, parent/chain context, source evidence.
    Notes :: NEAR blocks collect chunk headers across shards. Height is the ergonomic selector; hash disambiguates and supports explorer/indexer lookups.

  Entity NearChunk :: $network+chunkHash ; $network! $:Network, chunkHash! p:str, $block? $:NearBlock, shardId? p:bigint, gasUsed? p:bigint, $$transactions* $:NearTransaction
    Sources :: NearRpc_JsonRpc
    View :: NearChunkView top `<dl>` shows chunk hash, block, shard id, gas used, and transaction count. Tabs: transactions, shard/block context, raw chunk evidence.
    Notes :: Chunks are Nightshade shard execution units. They group transactions by shard under a block and should not be collapsed into the block row.

  Entity NearContract :: $network+accountId ; $network! $:Network, accountId! p:str, codeHash? p:str, codeSizeBytes? p:num, $$timestamps* $:NearContract_Timestamp
    Sources :: NearRpc_JsonRpc
    View :: NearContractView top `<dl>` shows account id, latest code hash, latest code size, and latest observation time. Details tabs: Code observations -> NearContract_Timestamp list; Account -> NearAccountView; Deployments -> NearAction rows with deploy-contract actions when indexed; Source evidence -> view_code/contract_code_changes payload freshness.
    Notes :: NEAR contracts are deployed to accounts, so contract identity is the network/account id, not a separate address. Code hash and code size are block-bounded code observations from view_code or contract-code changes; parent fields can expose latest convenience values, but code history belongs on NearContract_Timestamp.

  Entity NearContract_Timestamp :: $contract+timestampMs+source ; $contract! $:NearContract, timestampMs! p:num, source! p:enum, blockHeight? p:bigint, blockHash? p:str, codeHash? p:str, codeSizeBytes? p:num, codeBase64? p:str, deployerTransactionHash? p:str
    Sources :: NearRpc_JsonRpc, NearBlocks_Rest
    View :: NearContract_TimestampView top `<dl>` shows contract, observation time, source, block height/hash, code hash, code size, code byte availability, and deployer transaction hash. Details tabs: Contract -> NearContractView; Account -> NearAccountView through the contract account id; Deployment -> NearTransaction/NearAction when indexed; Code bytes -> redacted or downloadable base64 payload when source-backed.
    Notes :: Block-bounded contract-code observation. Use this for code deployments, hash/size changes, and source conflicts; do not model NEAR contract code as immutable global bytecode unless a separate code artifact selector is introduced.

  Entity NearExecutionOutcome :: $transaction+outcomeId ; $transaction! $:NearTransaction, outcomeId! p:str, status? p:str, gasBurnt? p:bigint, $$receipts* $:NearReceipt
    Sources :: NearRpc_JsonRpc, NearBlocks_Rest
    View :: NearExecutionOutcomeView top `<dl>` shows transaction, outcome id, status, gas burnt, and spawned receipt count. Tabs: spawned receipts, status payload, gas/profile evidence.
    Notes :: Outcomes can correspond to the original transaction outcome or receipt outcomes returned by tx/status. Keep outcomeId under the parent transaction selector so the resolver can search the full status payload deterministically.

  Entity NearNetwork :: slug ; slug! p:'near', name? p:str, namespace? p:str, environment! p:enum, rpcEndpoints+ p:{url:url,transportType:enum,providerName:str}, $$timestamps* $:NearNetwork_Timestamp, $$blocks* $:NearBlock, $$validators* $:NearValidator
    Sources :: Constants_Internal, NearRpc_JsonRpc
    View :: NearNetworkView top `<dl>` shows slug, name, environment, head block, native asset count, epoch, protocol version, validator counts, and gas price. Tabs: blocks, network snapshots, validators, endpoints, native assets, faucets, block explorers.
    Notes :: Implemented NEAR network root. Keep live head, epoch, validator counts, protocol version, sync state, and gas price on NearNetwork_Timestamp rather than the stable network row.

  Entity NearNetwork_Timestamp :: $network+timestampMs ; $network! $:NearNetwork, timestampMs! p:num, headHeight? p:bigint, headHash? p:str, epochId? p:str, epochHeight? p:bigint, epochStartHeight? p:bigint, chunkCount? p:num, gasPriceYoctoNear? p:bigint, currentValidatorCount? p:num, nextValidatorCount? p:num, currentProposalCount? p:num, protocolVersion? p:num, latestProtocolVersion? p:num, nodeVersion? p:str, syncing? p:bool
    Sources :: NearRpc_JsonRpc
    View :: NearNetwork_TimestampView top `<dl>` shows observed time, head height/hash, epoch, gas price, validator counts, protocol versions, node version, and syncing. Details show chunk/proposal counts and source freshness.
    Notes :: This is the as-of NEAR status/gas/validator snapshot from JSON-RPC status, gas price, and validators calls.

  Entity NearReceipt :: $network+receiptId ; $network! $:Network, receiptId! p:str, $predecessor? $:NearAccount, $receiver? $:NearAccount
    Sources :: NearRpc_JsonRpc
    View :: NearReceiptView top `<dl>` shows receipt id, predecessor account, receiver account, and linked outcome when available. Details tabs: Predecessor -> NearAccountView; Receiver -> NearAccountView; Execution outcome -> NearExecutionOutcomeView; Spawned receipts -> NearReceipt list when available from tx/status.
    Notes :: Receipts are asynchronous execution artifacts, not account identity or transaction identity. The implemented row keeps predecessor/receiver refs; receipt-local action details should be explicit fields only when tx/status or receipt lookup sources return them directly.

  Entity NearTransaction :: $network+hash | $network+hash+signerAccountId ; $network! $:Network, hash! p:str, signerAccountId! p:str, $signer? $:NearAccount, $receiver? $:NearAccount, nonce? p:bigint, $$actions* $:NearAction, $$executionOutcomes* $:NearExecutionOutcome
    Sources :: NearRpc_JsonRpc, NearBlocks_Rest
    View :: NearTransactionView top `<dl>` shows hash, signer, receiver, nonce, action count, outcome count, and status when available. Tabs: actions, execution outcomes, receipts spawned by outcomes, chunk/block context, source evidence.
    Notes :: NEAR RPC transaction status lookup needs signerAccountId, so hash-only selection is identity-compatible but not enough for this resolver. Keep signer/receiver as NearAccount refs and execution effects under outcomes rather than flattening receipts onto the transaction row.

  Entity NearValidator :: $network+accountId ; $network! $:Network, accountId! p:str, publicKey? p:str, stakeYoctoNear? p:bigint, isSlashed? p:bool, expectedBlocks? p:num, producedBlocks? p:num, expectedChunks? p:num, producedChunks? p:num
    Sources :: NearRpc_JsonRpc
    View :: NearValidatorView top `<dl>` shows validator account, public key, latest stake, slashed flag, expected/produced blocks, and expected/produced chunks. Details tabs: Account -> NearAccountView; Validator set -> current/next/proposal grouping from NearNetwork_Timestamp; Performance -> expected/produced block and chunk counters; Source evidence -> validators payload freshness.
    Notes :: Validator identity is the validator account on a NEAR network. Stake and expected/produced block/chunk metrics are validator-set snapshot values from the validators RPC; if per-epoch history or source conflicts matter, add a bounded NearValidator_Epoch or NearValidator_Timestamp row rather than treating latest performance as immutable identity.

  Entity Network :: caip2 | slug ; caip2? p:{namespace:str,reference:str}, slug! p:str, name! p:str, namespace! p:enum, environment! p:enum, $icon? $:MediaObject, $$nativeAssets* $:AssetInstance, $$blockExplorerUrls* $:Url, $$faucetUrls* $:Url, $$timestamps* $:Network_Timestamp
    Sources :: Constants_Internal, Chainlist_Rest, EthereumLists_Rest, Superchain_Github, L2Beat_Rest, Lifi_Rest, TrustWalletAssets_Github, CosmosChainRegistry_Github
    View :: NetworkView dispatches by namespace to EvmNetworkView, UtxoNetworkView, SolanaNetworkView, CosmosNetworkView, FilecoinNetworkView, PolkadotNetworkView, MoneroNetworkView, NearNetworkView, TronNetworkView, HyperliquidNetworkView, BittensorNetworkView, LightningNetworkView, ZeroGNetworkView, LogosNetworkView, or QuilibriumNetworkView. Fallback top `<dl>` shows CAIP-2 and environment; concrete network-specific sections live in native network views.
    Notes :: Network is the cross-protocol catalog identity row. Do not put head height, gas, mempool, account balances, bridge routes, or rollup execution facts here; those belong to native network rows, timestamp rows, or deployment/bridge entities.

  Entity Network_Timestamp :: $network+timestampMs+source ; $network! $:Network, timestampMs! p:num, source! p:str, latestHeight? p:bigint, txCount? p:num, health? p:enum
    Sources :: Voltaire_JsonRpc, Beacon_Rest, BitcoinCore_JsonRpc, MempoolSpace_Rest, CosmosSdk_Rest, CometBft_Rest, Solana_JsonRpc, Lotus_JsonRpc, SubstrateSidecar_Rest, MoneroDaemonRpc_JsonRpc, NearRpc_JsonRpc, TronGrid_Rest, Hyperliquid_JsonRpc, Bittensor_JsonRpc, LightningMempoolSpace_Rest, ZeroGChain_JsonRpc, QuilibriumNodeRpc_Grpc
    View :: Network_TimestampView top `<dl>` shows network, timestamp, source, latest height, transaction count, and health. Use only for generic source-health snapshots; native timestamp views remain authoritative when protocol-specific fields exist.
    Notes :: This is a narrow fallback observation row. Prefer native rows such as EvmNetwork_Timestamp, UtxoNetwork_Timestamp, CosmosNetwork_Timestamp, NearNetwork_Timestamp, or SolanaNetwork_Timestamp when a protocol exposes richer status semantics.

  Entity NetworkEndpointObservation_Timestamp :: $network+endpointUrl+endpointKind+timestampMs+source ; $network! $:Network, endpointUrl! p:url, endpointKind! p:enum, timestampMs! p:num, source! p:str, corsEnabled? p:bool, proxyAllowed? p:bool, health? p:enum, latencyMs? p:num, error? p:str
    Sources :: Constants_Internal, Chainlist_Rest, EthereumLists_Rest, CosmosChainRegistry_Github, Superchain_Github, Voltaire_JsonRpc, Beacon_Rest, Solana_JsonRpc, CosmosSdk_Rest, CometBft_Rest, Lotus_JsonRpc, TronGrid_Rest, NearRpc_JsonRpc
    View :: NetworkEndpointObservation_TimestampView top `<dl>` shows network, endpoint URL, endpoint kind, source, timestamp, CORS/proxy policy, health, latency, and error. Details group observations by endpoint kind and source freshness.
    Notes :: Endpoint observations are source/runtime checks for URL reachability and browser fetch policy. They are not source definitions, saved user endpoints, or network identity.

  Entity NetworkIdentifier :: $network+scheme ; $network! $:Network, scheme! p:str, value! p:str, namespace? p:str, canonicalValue? p:str, source? p:enum
    Sources :: Constants_Internal, CaipNamespaces_Github, Chainlist_Rest, EthereumLists_Rest, Superchain_Github, CosmosChainRegistry_Github, L2Beat_Rest
    View :: NetworkIdentifierView top `<dl>` shows network, scheme, value, namespace, canonical value, and source. Details group alternate registry identifiers and aliases by source.
    Notes :: Identifier rows preserve source-specific names and registry keys without turning aliases into independent Network rows. Use selectors on Network for canonical CAIP-2 or slug addressing; use this row for secondary schemes. `source` is a Source enum claim, not a ref to a source-definition entity.

  Entity NetworkStack :: networkStackId ; networkStackId! p:enum, label! p:str
    Sources :: Constants_Internal
    View :: NetworkStackView title shows the stack label from Constants_Internal; parent Network views may embed this as a compact stack badge/link.
    Notes :: NetworkStack is a checked-in catalog row for shared implementation/protocol-family stacks such as Ethereum, Cosmos SDK + CometBFT, Polkadot SDK, Cashu, or 0G. Treat it as a navigation and comparison handle, not as a protocol state object, ecosystem label, source category, or replacement for concrete Network rows.

  Entity NetworkUpgrade :: $network+upgradeId ; $network! $:Network, upgradeId! p:str, name! p:str, status? p:str, $$specificationProposals* $:SpecificationProposal
    Sources :: Constants_Internal, BitcoinBips_Github, BitcoinCashChips_Gitlab, Caips_Github, CosmosAdrs_Github, DogecoinDips_Github, Ensips_Github, EthereumEips_Github, FilecoinFips_Github, LitecoinLips_Github, NearNeps_Github, PolkadotRfcs_Github, SolanaSimds_Github, ZcashZips_Github
    View :: NetworkUpgradeView top `<dl>` shows network, upgrade id, name, and status. Details tabs: Specification proposals -> SpecificationProposal list; Network -> NetworkView; Domain-specific upgrade -> EthereumNetworkUpgradeView or other stack-specific upgrade views when linked.
    Notes :: Generic network upgrade row for non-Ethereum or cross-stack catalog surfaces. Prefer stack-specific upgrade rows when activation/fork/version semantics need protocol-specific fields; use this row for navigation and proposal grouping.

  Entity NftCollection :: $assetInstance ; $assetInstance! $:AssetInstance, name? p:str, symbol? p:str, $$tokens* $:NftToken, $$royalties* $:RoyaltyRight
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Reservoir_Rest, OpenSea_Rest, MetadataVision_Rest, Ipfs_Rest, Swarm_Rest
    View :: NftCollectionView top `<dl>` shows asset instance, name, symbol, token count, and royalty count. Details tabs: Tokens -> NftTokensView; Asset instance -> AssetInstanceView; Royalty rules -> RoyaltyRightsView; Metadata -> TokenMetadataDocumentsView for collection-level documents.
    Notes :: Collection facade over a concrete AssetInstance or EvmContract collection. Prefer AssetObject for object-level identity and EvmNft for EVM contract+tokenId specifics; use NftCollection only when a source exposes collection-level identity and list facets distinct from a generic asset instance.

  Entity NftToken :: $collection+tokenKey ; $collection! $:NftCollection, tokenKey! p:str, tokenId? p:bigint, owner? p:json, amount? p:bigint, $metadata? $:TokenMetadataDocument, $$usageRights* $:UsageRight
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Reservoir_Rest, OpenSea_Rest, MetadataVision_Rest, Solana_JsonRpc, Helius_Rest, Ipfs_Rest, Swarm_Rest
    View :: NftTokenView top `<dl>` shows collection, token key, token id, current owner selector, amount, metadata link, and active usage-right count. Details tabs: Collection -> NftCollectionView; Metadata -> TokenMetadataDocumentView; Usage rights -> UsageRightsView; EVM token -> EvmNftView when contract+tokenId is available; Ownership evidence -> transfer/indexer/source fields.
    Notes :: Cross-ecosystem token/object facade. Do not duplicate AssetObject or EvmNft fields here unless the source needs a collection-scoped token surface; ownership and ERC-1155 balances are observations and should become timestamped/account-scoped rows when history or per-owner amount matters.

  Entity NostrArticle :: kind+pubkey+identifier ; pubkey! p:hex32, identifier! p:str, kind! p:num, title? p:str, summary? p:str, imageUrl? p:url, content? p:str, publishedAt? p:num, tags? p:str[][], $author? $:NostrProfile
    Sources :: NostrBand_Rest, Primal_Rest
    View :: NostrArticleView top `<dl>` shows coordinate kind/pubkey/identifier, title, author, publishedAt, image URL, and tag count. Details tabs: Content -> rendered content/summary; Author -> NostrProfileView; Raw event -> tags and source payload fields. NostrArticlesView lists hub/profile articles.
    Notes :: Addressable articles are selected by coordinate, not event id, because replaceable/addressable Nostr events can supersede earlier event ids for the same author/kind/identifier. Treat title/summary/image as event payload fields, not canonical article registry data.

  Entity NostrNetwork :: scope ; scope! p:str, protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str, $$nostrProfiles* $:NostrProfile, $$nostrNotes* $:NostrNote, $$nostrRelays* $:NostrRelay, $$nostrReposts* $:NostrRepost, $$nostrArticles* $:NostrArticle
    Sources :: Constants_Internal, NostrBand_Rest, Primal_Rest
    View :: NostrView top `<dl>` shows protocol name, registry label, topology, home URL, and docs URL. Details tabs: Profiles -> NostrProfilesView; Notes -> NostrNotesView; Relays -> NostrRelaysView; Reposts -> NostrRepostsView; Articles -> NostrArticlesView.
    Notes :: This is the app's Nostr hub row, not a protocol ontology or direct relay subscription. Keep relay topology and seed/list entry points here; concrete event-derived entities remain selected by pubkey, event id, or addressable coordinate, while relay metadata/activity belongs on NostrRelay and NostrRelay_Timestamp.

  Entity NostrNote :: eventId ; eventId! p:hex32, kind! p:num, pubkey! p:hex32, content? p:str, createdAt? p:num, tags? p:str[][], $author? $:NostrProfile, replyToEventId? p:hex32, rootEventId? p:hex32, $replyToNote? $:NostrNote, $$replies* $:NostrNote, $$reactions* $:NostrReaction
    Sources :: Constants_Internal, NostrBand_Rest, Primal_Rest, NostrRelay_WebSocket
    View :: NostrNoteView top `<dl>` shows event id, kind, author pubkey/profile, createdAt, direct reply event id, root event id, reply-to note, reply count, and reaction count. Details tabs: Note text -> content; Reply thread -> NostrNotesView; Reactions -> NostrReactionsView; Author -> NostrProfileView; Raw event -> kind/pubkey/tags/signature/source relays.
    Notes :: There is no separate implemented `NostrEvent` entity. `eventId` is the signed event hash from the NIP-01 serialized event, `tags` preserve raw protocol payload, and reply/root edges are NIP-10 tag/indexer interpretations; derive them without pretending Nostr threads are always trees. Direct relay reads use WebSocket REQ filters, while NostrBand/Primal are indexer projections with their own coverage.

  Entity NostrProfile :: pubkey ; pubkey! p:hex32, displayName? p:str, about? p:str, nip05? p:str, lud16? p:str, lud06? p:str, website? p:url, metadataUpdatedAt? p:num, $icon? $:Media, $banner? $:Media, $$notes* $:NostrNote, $$articles* $:NostrArticle, $$reposts* $:NostrRepost
    Sources :: Constants_Internal, NostrBand_Rest, Primal_Rest
    View :: NostrProfileView top `<dl>` shows pubkey, display name, NIP-05, banner, website, lightning address/URI, and metadataUpdatedAt when open. Content shows about text. Details tabs: Notes -> NostrNotesView; Articles -> NostrArticlesView; Reposts -> NostrRepostsView.
    Notes :: The canonical selector is a lowercase 64-hex secp256k1 public key. `displayName`, NIP-05, website, and lightning address fields are metadata claims from replaceable kind-0 content, not stable identity selectors.

  Entity NostrReaction :: eventId ; eventId! p:hex32, kind! p:num, pubkey! p:hex32, createdAt? p:num, tags? p:str[][], $author? $:NostrProfile, $targetNote? $:NostrNote, $targetArticle? $:NostrArticle, content? p:str
    Sources :: NostrBand_Rest, Primal_Rest
    View :: NostrReactionView top `<dl>` shows event id, kind, author, createdAt, reaction content, target note, and target article. Details tabs: Target -> NostrNoteView or NostrArticleView; Author -> NostrProfileView; Raw event -> pubkey/tags.
    Notes :: Reaction `content` is protocol payload (`+`, `-`, emoji, or app-specific text), not a normalized like boolean. Keep target note/article refs optional because indexers may expose reactions before the target object is resolved.

  Entity NostrRelay :: relayUrl ; relayUrl! p:url, name? p:str, description? p:str, software? p:str, version? p:str, supportedNipCount? p:num, isPaid? p:bool, limit? p:num, $$timestamps* $:NostrRelay_Timestamp
    Sources :: Constants_Internal, NostrBand_Rest, NostrRelay_Nip11_Http
    View :: NostrRelayView top `<dl>` shows relay URL, name, software, version, supported NIP count, paid flag, limit, and latest relay snapshot. Details tabs: Metadata -> description/capabilities; Snapshots -> NostrRelay_TimestampsView; Source evidence -> seed, NIP-11 HTTP document, and NostrBand relay-list payload; Network -> NostrView.
    Notes :: Relay URL is normalized as the selector. NIP-11 metadata, supported NIPs, limitations, payment requirements, and activity/ranking metrics are relay/source observations that can change; keep current display fields as latest convenience values and preserve history in NostrRelay_Timestamp. NostrBand relay rankings are indexer/discovery data, not proof that a live WebSocket subscription currently succeeds.

  Entity NostrRelay_Timestamp :: $relay+timestampMs+source ; $relay! $:NostrRelay, timestampMs! p:num, source! p:str, name? p:str, description? p:str, software? p:str, version? p:str, supportedNips? p:num[], limitation? p:json, fees? p:json, paymentsUrl? p:url, termsOfServiceUrl? p:url, iconUrl? p:url, bannerUrl? p:url, pubkey? p:hex32, isPaid? p:bool, activeUsers? p:num, eventsPerDay? p:num, rank? p:num, reachable? p:bool, error? p:str
    Sources :: NostrRelay_Nip11_Http, NostrBand_Rest, Primal_Rest
    View :: NostrRelay_TimestampView top `<dl>` shows relay, observation time, source, software/version, supported NIP count, paid/restricted flags, active users, events per day, rank, reachability, and error. Details tabs: NIP-11 document -> metadata/limitations/fees; Indexer metrics -> active users/events/rank; Relay -> NostrRelayView; Raw evidence -> JSON document or indexer payload.
    Notes :: Relay metadata and activity are observation-time facts, not relay identity. NIP-11 exposes HTTP metadata on the relay endpoint, while NostrBand/Primal expose indexed relay lists and metrics; these sources can disagree and should not be collapsed into durable relay fields without timestamp/source context.

  Entity NostrRepost :: eventId ; eventId! p:hex32, kind! p:num, pubkey! p:hex32, createdAt? p:num, tags? p:str[][], repostedEventId? p:hex32, $author? $:NostrProfile, $repostedNote? $:NostrNote, $repostedArticle? $:NostrArticle
    Sources :: NostrBand_Rest, Primal_Rest
    View :: NostrRepostView top `<dl>` shows event id, kind, author, createdAt, reposted event id, reposted note, and reposted article. Details tabs: Reposted target -> NostrNoteView or NostrArticleView; Author -> NostrProfileView; Raw event -> pubkey/tags.
    Notes :: Keep reposts as their own event-derived entity. A repost event has its own event id, author, and timestamp, separate from the target note/article it references.

  Entity OracleFeed :: $network+address ; $network! $:EvmNetwork, address! p:evmAddress, $market? $:Market, label? p:str, decimals? p:num, description? p:str, $$rounds+ $:OracleFeed_Round
    Sources :: Constants_Internal, Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest
    View :: OracleFeedView top `<dl>` shows network, feed address, mapped market, label, decimals, description, and latest round id when available. Details tabs: Rounds -> OracleFeed_RoundsView; Market mapping -> MarketView; Contract -> EvmContractView for the feed address; Source evidence -> catalog/API/indexer claims.
    Notes :: EVM oracle feed contract row, currently shaped around Chainlink AggregatorV3-style feeds. `$market` is a curated/catalog mapping from feed address to app market selector; do not infer canonical market identity from the on-chain feed description alone. Keep non-EVM oracle programs, pull oracles, and cross-chain report networks separate unless their stable selectors and round semantics match this contract primitive.

  Entity OracleFeed_Round :: $oracleFeed+roundId ; $oracleFeed! $:OracleFeed, roundId! p:bigint, $parentOracleFeed! $:OracleFeed, answer? p:bigint, startedAtMs? p:num, updatedAtMs? p:num, answeredInRound? p:bigint, $network? $:EvmNetwork, blockNumber? p:bigint, transactionHash? p:hex, logIndex? p:num
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest
    View :: OracleFeed_RoundView top `<dl>` shows oracle feed, round id, answer, startedAtMs, updatedAtMs, answeredInRound, and network. Details tabs: Feed -> OracleFeedView; On-chain provenance -> block number, transaction hash, and log index when indexed; Market context -> parent feed market mapping.
    Notes :: Round identity is feed plus roundId. `answer`, start/update timestamps, and answeredInRound come from contract reads; blockNumber, transactionHash, and logIndex require event/indexer provenance and must stay optional because round read methods do not return log coordinates.

  Entity PayjoinDirectory :: directoryUrl ; directoryUrl! p:url, ohttpGatewayUrl? p:url, ohttpKeyConfig? p:str, maxPayloadBytes? p:num
    Sources :: PayjoinDirectory_Rest
    View :: PayjoinDirectoryView top `<dl>` shows directory URL, OHTTP gateway URL, OHTTP key config presence/length, and max payload bytes when available. Details tabs: OHTTP gateway -> gateway URL and key config bytes/base64 preview; Limits -> max payload bytes and fetch status; Source evidence -> REST response/error metadata.
    Notes :: Source-backed Payjoin coordination endpoint row. The directory URL is the stable selector; the gateway URL is derived from the directory origin and the OHTTP key config is fetched from the gateway. This is not a Bitcoin transaction, receiver identity, wallet, payment proof, or reusable OHTTP service abstraction; actual PSBT negotiation and submitted UTXO transactions belong on payment/session/action rows only when their selectors and source lifecycle are modeled.

  Entity Payout :: payoutId ; payoutId! p:str, $assetInstance! $:AssetInstance, $assetClass? $:AssetClass, snapshotCoordinate? p:str, paymentAsset? p:json, amount? p:bigint, claimStatus? p:enum
    Sources :: Constants_Internal, Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Local_Internal
    View :: PayoutView top `<dl>` shows payout id, asset instance, asset class, snapshot coordinate, payment asset, amount, and claim status. Details tabs: Asset -> AssetInstanceView/AssetClassView; Claim evidence -> contract call or indexer event fields; Recipient state -> account-specific claim status when modeled; Source evidence -> source, block, transaction, or registry coordinates.
    Notes :: Planned distribution/claim row. `payoutId` must be a source-backed distributor, campaign, merkle-root, or registry id, not a UI label. Snapshot coordinate must name the source snapshot block/round/record; market yield estimates, generic APY labels, and unsourced reward categories do not belong here.

  Entity PolkadotAccount :: $network+accountId ; $network! $:Network, accountId! p:str, nonce? p:bigint, freeBalancePlancks? p:bigint, reservedBalancePlancks? p:bigint, frozenBalancePlancks? p:bigint, $$timestamps* $:PolkadotAccount_Timestamp
    Sources :: Polkadot_JsonRpc, SubstrateSidecar_Rest, Subscan_Rest, ThreeXpl_Rest
    View :: PolkadotAccountView top `<dl>` shows network, account id, latest nonce, latest free/reserved/frozen balances, and timestamp count. Details tabs: Balance history -> PolkadotAccount_TimestampsView; Extrinsics -> signed PolkadotExtrinsicsView when indexed; Assets -> AssetBalancesView when account asset rows are modeled; Source evidence -> node/indexer account payload fields.
    Notes :: Network-scoped Substrate account identity. `api.query.system.account(accountId)` exposes nonce plus balance data, Sidecar exposes balance-info, and indexers expose account and transfer history. Keep mutable balance/nonce observations on PolkadotAccount_Timestamp; parent fields are latest convenience only.

  Entity PolkadotAccount_Timestamp :: $account+timestampMs+source ; $account! $:PolkadotAccount, timestampMs! p:num, source! p:enum, blockNumber? p:bigint, blockHash? p:str, nonce? p:bigint, freeBalancePlancks? p:bigint, reservedBalancePlancks? p:bigint, frozenBalancePlancks? p:bigint, miscFrozenPlancks? p:bigint, feeFrozenPlancks? p:bigint, consumers? p:num, providers? p:num, sufficients? p:num
    Sources :: Polkadot_JsonRpc, SubstrateSidecar_Rest, Subscan_Rest, ThreeXpl_Rest
    View :: PolkadotAccount_TimestampView top `<dl>` shows account, timestamp, source, block number/hash, nonce, free/reserved/frozen balances, legacy misc/fee frozen fields, and provider/consumer/sufficient refcounts. Details tabs: Account -> PolkadotAccountView; Block -> PolkadotBlockView when block coordinates are present; Balance breakdown -> account data fields; Source evidence -> raw RPC/indexer coordinates. PolkadotAccount_TimestampsView lists rows by timestamp/source and groups by block when available.
    Notes :: As-of account state row for public chain/indexer observations. Use node state queries or indexer account-history endpoints here; do not put wallet-local address book labels, injected extension permissions, signing keys, or connected-wallet metadata here.

  Entity PolkadotBlock :: $network+blockNumber | $network+blockNumber+hash ; $network! $:Network, blockNumber! p:bigint, hash! p:str, $parent? $:PolkadotBlock, stateRoot? p:str, extrinsicsRoot? p:str, $$extrinsics* $:PolkadotExtrinsic, $$events* $:PolkadotEvent
    Sources :: Polkadot_JsonRpc, SubstrateSidecar_Rest, Subscan_Rest, ThreeXpl_Rest
    View :: PolkadotBlockView top `<dl>` shows network, block number, hash, parent, state root, extrinsics root, extrinsic count, and event count. Details tabs: Extrinsics -> PolkadotExtrinsicsView; Events -> PolkadotEventsView; Parent -> PolkadotBlockView; Source evidence -> RPC/indexer block payload fields. PolkadotBlocksView lists blocks under PolkadotNetworkView.
    Notes :: Block/extrinsic/event structure is shared Substrate architecture, but the current repo models it under Polkadot-prefixed rows. Do not duplicate these rows for another Substrate chain unless selectors or source semantics diverge.

  Entity PolkadotEvent :: $block+eventIndex ; $block! $:PolkadotBlock, eventIndex! p:num, $extrinsic? $:PolkadotExtrinsic, $pallet? $:PolkadotPallet, eventName! p:str
    Sources :: SubstrateSidecar_Rest
    View :: PolkadotEventView top `<dl>` shows block, event index, pallet, event name, and linked extrinsic when present. Details tabs: Extrinsic -> PolkadotExtrinsicView; Pallet -> PolkadotPalletView; Block context -> PolkadotBlockView.
    Notes :: Event index is block-local. The optional extrinsic ref distinguishes initialization/finalization events from events emitted while applying an extrinsic.

  Entity PolkadotExtrinsic :: $block+extrinsicIndex ; $block! $:PolkadotBlock, extrinsicIndex! p:num, hash? p:str, $signer? $:PolkadotAccount, $pallet? $:PolkadotPallet, callName? p:str, success? p:bool
    Sources :: SubstrateSidecar_Rest, Subscan_Rest
    View :: PolkadotExtrinsicView top `<dl>` shows block, extrinsic index, hash, signer, pallet, call name, and success. Details tabs: Signer -> PolkadotAccountView; Pallet/call -> PolkadotPalletView and call metadata; Events -> PolkadotEventsView filtered by extrinsic; Block context -> PolkadotBlockView.
    Notes :: Extrinsic identity is block plus extrinsic index. Hash is useful evidence but not enough for all source lookups without block context.

  Entity PolkadotNetwork :: $network ; $network! $:Network, rpcEndpoints+ p:{url:url,transportType:enum,providerName:str}, $$timestamps* $:PolkadotNetwork_Timestamp, $$blocks* $:PolkadotBlock, $$validators* $:PolkadotValidator
    Sources :: Constants_Internal, Polkadot_JsonRpc, SubstrateSidecar_Rest
    View :: PolkadotNetworkView top `<dl>` shows head block, environment, and native asset count. Details tabs: Blocks -> PolkadotBlocksView; Runtime snapshots -> PolkadotNetwork_TimestampsView; Validators -> PolkadotValidatorsView; Endpoints -> NetworkTransportEndpointsView; Native coin -> AssetInstancesView; Resources -> UrlsView for faucets and block explorers.
    Notes :: Network root holds endpoint and list facets only. Extrinsics, events, accounts, and pallets are real rows reached through blocks, extrinsics, account selectors, or runtime metadata, not direct network child lists.

  Entity PolkadotNetwork_Timestamp :: $network+timestampMs ; $network! $:Network, timestampMs! p:num, finalizedBlockNumber? p:bigint, finalizedBlockHash? p:str, finalizedExtrinsicCount? p:num, runtimeSpecName? p:str, runtimeSpecVersion? p:num, transactionVersion? p:num, stateVersion? p:num, peerCount? p:num, isSyncing? p:bool, shouldHavePeers? p:bool, eraIndex? p:bigint, sessionIndex? p:bigint, activeValidatorCount? p:num
    Sources :: Polkadot_JsonRpc
    View :: PolkadotNetwork_TimestampView top `<dl>` shows network, timestamp, finalized block number/hash, finalized extrinsic count, runtime spec name/version, transaction version, state version, peer count, sync state, era/session indexes, and active validator count. Details tabs: Finalized block -> PolkadotBlockView; Runtime -> version fields; Health -> peers and sync state; Staking/session -> era, session, and active validator fields. PolkadotNetwork_TimestampsView lists runtime/head/health snapshots.
    Notes :: Timestamp row is the as-of finalized-head/runtime/health/staking-session observation. Keep pallet call/storage/event metadata on PolkadotPallet or dedicated metadata rows, not on this network snapshot.

  Entity PolkadotPallet :: $network+palletName ; $network! $:Network, palletName! p:str, index? p:num
    Sources :: SubstrateSidecar_Rest
    View :: PolkadotPalletView top `<dl>` shows network, pallet name, and pallet index. Details tabs: Extrinsics -> PolkadotExtrinsicsView by pallet when indexed; Events -> PolkadotEventsView by pallet when indexed; Runtime metadata -> source metadata fields.
    Notes :: Pallet identity is runtime-scoped by network and pallet name. Do not model the whole runtime metadata blob as an entity unless call/storage/event metadata gets stable selectors and views.

  Entity PolkadotReferendum :: $network+referendumId ; $network! $:Network, referendumId! p:str, track? p:str, status? p:str, submittedAtBlockNumber? p:bigint, decidedAtBlockNumber? p:bigint
    Sources :: Polkadot_JsonRpc, SubstrateSidecar_Rest, Subscan_Rest
    View :: PolkadotReferendumView top `<dl>` shows network, referendum id, track, status, submitted block, and decided block. Details tabs: Lifecycle -> preparation/deciding/confirmation/enactment fields; Tally -> aye/nay/support fields from runtime/indexer payloads; Votes/deposits -> vote and deposit child rows once selectors are modeled; Preimage/call -> linked preimage or call metadata; Discussions -> source-attributed forum/indexer links only when selectors exist.
    Notes :: The selector is network plus referendumId because referendum indexes are chain-local. OpenGov referenda, tracks, preimages, deposits, tallies, delegation, and votes are sourceable through runtime storage and Subscan governance endpoints, but only referendum identity belongs in this row until child selectors are specified. Track configuration is Polkadot runtime data, not a generic cross-chain `GovernanceTrack`.

  Entity PolkadotValidator :: $network+stashAccountId ; $network! $:Network, stashAccountId! p:str, $controller? $:PolkadotAccount, commissionPerBillion? p:num, totalStakePlancks? p:bigint, $$eras* $:PolkadotValidator_Era
    Sources :: Polkadot_JsonRpc, SubstrateSidecar_Rest, Subscan_Rest
    View :: PolkadotValidatorView top `<dl>` shows network, stash account id, latest controller account, latest commission per billion, latest total stake, and era count. Details tabs: Controller -> PolkadotAccountView; Era history -> PolkadotValidator_ErasView; Network set -> PolkadotValidatorsView context; Nominators/exposure -> era-bounded exposure rows when modeled.
    Notes :: Validator selector uses stash account id because stash identity is stable for staking exposure. Controller, commission, exposure, rewards, and active status are era/session state; parent fields are latest convenience only.

  Entity PolkadotValidator_Era :: $validator+eraIndex+source ; $validator! $:PolkadotValidator, eraIndex! p:bigint, source! p:enum, $controller? $:PolkadotAccount, commissionPerBillion? p:num, totalStakePlancks? p:bigint, ownStakePlancks? p:bigint, nominatorStakePlancks? p:bigint, nominatorCount? p:num, rewardPoints? p:num, active? p:bool, slashed? p:bool
    Sources :: Polkadot_JsonRpc, SubstrateSidecar_Rest, Subscan_Rest
    View :: PolkadotValidator_EraView top `<dl>` shows validator, era index, source, controller, commission, total/own/nominator stake, nominator count, reward points, active status, and slashed status. Details tabs: Validator -> PolkadotValidatorView; Controller -> PolkadotAccountView; Exposure -> nominators and stake breakdown; Rewards/slashes -> era reward and slash evidence. PolkadotValidator_ErasView lists era rows newest first and groups by source.
    Notes :: Era-bounded staking exposure row. Substrate staking data changes by active era/session; do not collapse historical exposure, reward points, or slash state into the validator parent.

  Entity QuilibriumAccount :: $network+accountAddress ; $network! $:Network, accountAddress! p:str, accountKind? p:str
    Sources :: QuilibriumNodeRpc_Grpc
    View :: QuilibriumAccountView title/value shows account address; top `<dl>` shows account address and account kind when sourced.
    Notes :: Account address is network-scoped. accountKind is currently a node-RPC-derived classification, not proof of balance, signing authority, or account lifecycle. Keep wallet-local authority, viewing keys, or connected-node account state under Blockhead-prefixed rows if added later.

  Entity QuilibriumFrame :: $network+frameNumber+shardKey ; $network! $:Network, frameNumber! p:bigint, shardKey! p:str, frameHash? p:str, $shard? $:QuilibriumShard, $prover? $:QuilibriumProver
    Sources :: QuilibriumNodeRpc_Grpc
    View :: QuilibriumFrameView title/value shows shard key and frame number; top `<dl>` shows frame number, shard key, frame hash, shard via QuilibriumShardView, and prover via QuilibriumProverView when sourced.
    Notes :: Frame identity is network + frame number + shard key. Keep frames separate from generic block rows because Quilibrium frames/shards do not map to EVM, Substrate, or UTXO block semantics. Current node RPC coverage can derive `$shard` from shardKey; frameHash and prover require richer frame payloads.

  Entity QuilibriumNetwork :: slug ; slug! p:'quilibrium', name! p:str, namespace! p:enum, environment! p:enum, $icon? $:MediaObject, $$nativeAssets* $:AssetInstance, $$blockExplorerUrls* $:Url, $$faucetUrls* $:Url, docsEndpoints+ p:{url:url,transportType:enum,providerName:str}, nodeInterfaces+ p:{label:str,port:num,transportType:enum}, protocolFacts+ p:{label:str,value:str}, serviceLayers+ p:{label:str,description:str}, $protocolDocument? $:SpecificationProposal, $masterShard? $:QuilibriumShard
    Sources :: Constants_Internal, QuilibriumDocs_Rest, QuilibriumNodeRpc_Grpc
    View :: QuilibriumNetworkView is mounted from NetworkView for the Quilibrium network; top `<dl>` shows environment and master shard via QuilibriumShardView. Details tabs: Protocol -> protocol document and protocol facts; Services -> service layer descriptions; Node interfaces -> ports/transports; Consensus -> mapped consensus mechanisms; Assets -> native assets; Resources -> faucets and block explorers.
    Notes :: QuilibriumNetwork is the family hub for checked-in network metadata, docs-derived protocol facts, and live node RPC refs such as the master shard. Docs endpoints can inform protocol/navigation fields, but full frame, shard, prover, account, and pending-transaction indexing should come from node RPC or indexer payloads rather than docs prose.

  Entity QuilibriumPendingTransaction :: $network+transactionHash ; $network! $:Network, transactionHash! p:str, $account? $:QuilibriumAccount, transactionType? p:str
    Sources :: QuilibriumNodeRpc_Grpc
    View :: QuilibriumPendingTransactionView title/value shows transaction hash; top `<dl>` shows transaction hash, transaction type, and account via QuilibriumAccountView when sourced.
    Notes :: Pending transaction identity is network + transaction hash. This is mempool/pending-state surface, not a finalized frame row or generic transaction history. Current node RPC coverage labels the row as pending; account refs require richer pending-transaction payloads.

  Entity QuilibriumProver :: $network+proverPeerId ; $network! $:Network, proverPeerId! p:str, publicKey? p:str, version? p:str
    Sources :: QuilibriumNodeRpc_Grpc
    View :: QuilibriumProverView title/value shows prover peer id; top `<dl>` shows prover peer id, public key, and version when sourced.
    Notes :: Prover identity should come from peer/network payloads, not docs, marketing names, or validator leaderboard labels. publicKey and version are stable fields only when node RPC or inventory payloads expose them for the prover peer id.

  Entity QuilibriumShard :: $network+shardKey ; $network! $:Network, shardKey! p:str, shardKind? p:str, $applicationAccount? $:QuilibriumAccount
    Sources :: QuilibriumNodeRpc_Grpc
    View :: QuilibriumShardView title/value shows shard key; top `<dl>` shows shard key, shard kind, and application account via QuilibriumAccountView when sourced.
    Notes :: Shard key is the selector. Do not model service layers as shards; service layers are static protocol facts on QuilibriumNetwork unless node RPC exposes real shard/application-account state. Current node RPC coverage labels the master shard; applicationAccount requires richer shard payloads.

  Entity RadicleCollaborationEvent :: $repository+eventId ; $repository! $:RadicleRepository, eventId! p:str, eventKind! p:enum, authorDid? p:str, subjectSelector! p:json, payloadHash? p:hex, payloadObjectId? p:hex, timestampMs? p:num, $gitCommit? $:GitCommit, $payloadObject? $:GitObject, verificationStatus! p:enum
    Sources :: Local_Internal
    View :: RadicleCollaborationEventView top `<dl>` shows repository, event id, event kind, author DID, subject selector, timestamp, verification status, payload hash/object id, linked Git commit, and payload object. Details tabs: Repository -> RadicleRepositoryView; Subject -> issue/patch/comment subview by selector; Payload -> GitObjectView/GitCommitView; Timeline -> sibling events for the same subject.
    Notes :: Normalized Radicle collaboration event for issue/patch/comment/update timelines. Use only when an event stream view needs history; do not duplicate current issue/patch scalar state here.

  Entity RadicleDelegate :: $repository+did ; $repository! $:RadicleRepository, did! p:str, role? p:enum, validFromRevision? p:str, validToRevision? p:str
    Sources :: Local_Internal
    View :: RadicleDelegateView top `<dl>` shows repository, DID, role, valid-from revision, and valid-to revision. Details tabs: Repository -> RadicleRepositoryView; Identity revisions -> RadicleIdentityRevision list where the delegate appears; Signatures -> GitSignature list for signed identity/ref material.
    Notes :: Delegate membership is derived from repository identity revisions. Delegate status grants signing authority for repository identity/refs only under accepted Radicle identity rules; it is not a general social identity claim.

  Entity RadicleDiscussionComment :: discussionSelector+commentId ; discussionSelector! p:json, commentId! p:str, authorDid? p:str, body? p:str, bodyObjectId? p:hex, createdAt? p:num, updatedAt? p:num, replyToCommentId? p:str, $payloadObject? $:GitObject
    Sources :: Local_Internal
    View :: RadicleDiscussionCommentView top `<dl>` shows discussion selector, comment id, author DID, created/updated timestamps, reply target, body, body object id, and payload object. Details tabs: Parent discussion -> RadicleIssue/RadiclePatch by selector; Replies -> RadicleDiscussionComment list; Payload -> GitObjectView when body is object-backed.
    Notes :: Comment row for Radicle issue/patch discussion state. Keep comments scoped to their collaboration object parent rather than modeling them as global social posts.

  Entity RadicleIdentityDocument :: rid+revision ; rid! p:str, revision! p:str, documentHash! p:hex, payload? p:json, $$signatures* $:GitSignature, $$verifications* $:VerificationResult, $repository? $:RadicleRepository
    Sources :: Local_Internal
    View :: RadicleIdentityDocumentView top `<dl>` shows RID, revision, document hash, repository, and payload summary. Details tabs: Payload -> name/description/default branch/visibility/delegates JSON; Signatures -> GitSignature list; Verifications -> VerificationResult list; Repository -> RadicleRepositoryView.
    Notes :: Revision-scoped signed repository identity material. Payload fields can change across revisions; delegate threshold verification belongs in signatures/verifications, not on the repository row.

  Entity RadicleIdentityRevision :: rid+revision ; rid! p:str, revision! p:str, previousRevision? p:str, documentHash! p:hex, delegateDids* p:str, threshold? p:num, signedByDids* p:str, verificationStatus! p:enum
    Sources :: Local_Internal
    View :: RadicleIdentityRevisionView top `<dl>` shows RID, revision, previous revision, document hash, threshold, verification status, delegate DIDs, and signer DIDs. Details tabs: Document -> RadicleIdentityDocumentView; Delegates -> RadicleDelegate list; Previous revision -> RadicleIdentityRevisionView; Verification -> signatures/results.
    Notes :: Identity revision graph row. These revisions are not Git branch tips; use them to explain why a repository identity update is accepted or rejected.

  Entity RadicleIssue :: $repository+issueId ; $repository! $:RadicleRepository, issueId! p:str, title? p:str, authorDid? p:str, state! p:enum, createdAt? p:num, updatedAt? p:num, payloadObjectId? p:hex, $payloadObject? $:GitObject, $$comments* $:RadicleDiscussionComment
    Sources :: Local_Internal
    View :: RadicleIssueView top `<dl>` shows repository, issue id, title, state, author DID, created/updated timestamps, payload object id, and payload object. Details tabs: Comments -> RadicleDiscussionComment list; Events -> RadicleCollaborationEvent list; Payload -> GitObjectView; Repository -> RadicleRepositoryView.
    Notes :: Repository-scoped Radicle collaboration object for issues. COB state is local-first and replicated, not forge-host issue state.

  Entity RadicleNode :: nodeId ; nodeId! p:str, did? p:str, alias? p:str, publicKey? p:str, $$peers* $:RadiclePeer, $$seeds* $:RadicleSeedObservation_Timestamp
    Sources :: Local_Internal
    View :: RadicleNodeView top `<dl>` shows node id, DID, alias, public key, latest inventory status, and latest peer status. Details tabs: Peers -> RadiclePeer list; Seeds -> RadicleSeedObservation_Timestamp list; Inventory -> RadicleNodeInventoryObservation history; Sync sessions -> RadicleSyncSession list for this local/remote node.
    Notes :: Node ID is the transport/public-key identity; alias is mutable display metadata. Local node status and peer inventory are connected-node state, not repository authority.

  Entity RadicleNodeInventoryObservation :: $node+timestampMs+source ; $node! $:RadicleNode, timestampMs! p:num, source! p:str, repositoryCount? p:num, connectedPeerCount? p:num, routingTableSize? p:num, advertisedRids* p:str, status! p:enum
    Sources :: Local_Internal
    View :: RadicleNodeInventoryObservationView top `<dl>` shows node, timestamp, source, status, repository count, connected peer count, routing table size, and advertised RIDs. Details tabs: Node -> RadicleNodeView; Advertised repositories -> RadicleRepository/RadicleSeedObservation list when resolved; Raw inventory -> local node payload.
    Notes :: Timestamped node inventory/gossip observation. Advertised RIDs are claims from one observation, not a durable repository list or authority proof.

  Entity RadicleObjectVerificationRun :: rid+nodeId+refName+targetObjectId+verifier+timestampMs ; rid! p:str, nodeId! p:str, refName! p:str, targetObjectId! p:hex, verifier! p:str, timestampMs! p:num, signatureStatus! p:enum, objectAvailable? p:bool, delegateThresholdMet? p:bool, status! p:enum, error? p:str
    Sources :: Local_Internal
    View :: RadicleObjectVerificationRunView top `<dl>` shows RID, node id, ref name, target object id, verifier, timestamp, signature status, object availability, delegate threshold result, final status, and error. Details tabs: Signed ref -> RadicleSignedRefView; Target object -> GitObjectView; Repository -> RadicleRepositoryView; Raw verification -> verifier diagnostics.
    Notes :: Verification evidence combining signed-ref validation and Git object availability. Do not overwrite RadicleSignedRef or GitObject with transient verification failures.

  Entity RadiclePatch :: $repository+patchId ; $repository! $:RadicleRepository, patchId! p:str, authorDid? p:str, targetRef? p:str, headObjectId? p:hex, baseObjectId? p:hex, state! p:enum, createdAt? p:num, updatedAt? p:num, $headCommit? $:GitCommit, $baseCommit? $:GitCommit, $$comments* $:RadicleDiscussionComment
    Sources :: Local_Internal
    View :: RadiclePatchView top `<dl>` shows repository, patch id, state, author DID, target ref, head object id, base object id, created/updated timestamps, head commit, and base commit. Details tabs: Commits -> head/base GitCommit views; Comments -> RadicleDiscussionComment list; Events -> RadicleCollaborationEvent list; Repository -> RadicleRepositoryView.
    Notes :: Repository-scoped Radicle patch COB. Do not model patches as forge pull requests; they are local-first collaboration state layered over Git commits.

  Entity RadiclePeer :: $node+peerNodeId ; $node! $:RadicleNode, peerNodeId! p:str, connectionKind? p:enum, addresses* p:str, lastSeenMs? p:num, $remoteNode? $:RadicleNode
    Sources :: Local_Internal
    View :: RadiclePeerView top `<dl>` shows local node, peer node id, connection kind, addresses, last seen timestamp, and linked remote node. Details tabs: Local node -> RadicleNodeView; Remote node -> RadicleNodeView; Shared repositories -> RadicleSeedObservation_Timestamp list when inventory links both nodes.
    Notes :: Peer presence is reachability evidence, not repository seeding proof. Addresses and last-seen values are local-node observations.

  Entity RadicleRepository :: rid ; rid! p:str, $gitRepository! $:GitRepository, name? p:str, description? p:str, visibility! p:enum, defaultBranch? p:str, $$delegates* $:RadicleDelegate, $$signedRefs* $:RadicleSignedRef, $$issues* $:RadicleIssue, $$patches* $:RadiclePatch
    Sources :: Local_Internal
    View :: RadicleRepositoryView top `<dl>` shows RID, linked Git repository, name, description, visibility, default branch, delegate count, and latest signed-ref status. Details tabs: Identity -> RadicleIdentityDocument/RadicleIdentityRevision/RadicleDelegate lists; Signed refs -> RadicleSignedRef list by node/ref; Collaboration -> issues/patches/comments/events; Replication -> seed observations and sync sessions; Git storage -> GitRepositoryView.
    Notes :: RID is the stable Radicle repository selector, not name or default branch. `$gitRepository` links to object storage/fetch evidence, not a forge clone URL.

  Entity RadicleSeedObservation_Timestamp :: $repository+nodeId+timestampMs+source ; $repository! $:RadicleRepository, nodeId! p:str, timestampMs! p:num, source! p:str, advertised? p:bool, reachable? p:bool, refCount? p:num, objectCount? p:num
    Sources :: Local_Internal
    View :: RadicleSeedObservation_TimestampView top `<dl>` shows repository, node id, timestamp, source, advertised flag, reachable flag, ref count, and object count. Details tabs: Repository -> RadicleRepositoryView; Node -> RadicleNodeView; Fetch evidence -> GitFetchObservation/RadicleSyncSession rows when linked.
    Notes :: Node seeding/advertisement is availability at observation time, not permanent hosting. Reachability, ref count, and object count can differ by source.

  Entity RadicleSignedRef :: $repository+nodeId+refName ; $repository! $:RadicleRepository, nodeId! p:str, refName! p:str, targetObjectId! p:hex, signature? p:str, status! p:enum, verificationStatus! p:enum, observedAtMs? p:num, $gitRef? $:GitRef, $refObservation? $:GitRefObservation_Timestamp
    Sources :: Local_Internal
    View :: RadicleSignedRefView top `<dl>` shows repository, node id, ref name, target object id, status, verification status, observed timestamp, Git ref, and Git ref observation. Details tabs: Proof -> signature and delegate authorization details; Target -> GitObject/GitCommitView; Git ref -> GitRef/GitRefObservation views; Verification -> RadicleObjectVerificationRun history.
    Notes :: Signed refs bridge Radicle authorization semantics into generic Git ref views. A valid signed ref proves node/delegate authorization for that ref, not that every target object is locally available.

  Entity RadicleSyncSession :: sessionId ; sessionId! p:str, $localNode! $:RadicleNode, remoteNodeId! p:str, rid? p:str, startedAt! p:num, completedAt? p:num, requestedRefs* p:str, receivedObjects? p:num, status! p:enum, error? p:str
    Sources :: Local_Internal
    View :: RadicleSyncSessionView top `<dl>` shows session id, local node, remote node id, RID, started/completed timestamps, requested refs, received object count, status, and error. Details tabs: Local node -> RadicleNodeView; Remote node -> RadicleNodeView when resolved; Repository -> RadicleRepositoryView when RID resolves; Fetch artifacts -> GitFetchObservation/GitPackfile rows when captured.
    Notes :: Replication telemetry for one sync attempt. It is not repository identity and should remain local connected-node state unless a concrete Radicle source enum is added.

  Entity RedditComment :: fullname ; fullname! p:str, body? p:str, author? p:str, $$timestamps* $:RedditComment_Timestamp, createdAt? p:num, depth? p:num, $link? $:RedditLink, $parentComment? $:RedditComment, $$replies* $:RedditComment
    Sources :: Constants_Internal, Reddit_Rest, Reddit_PublicJson
    View :: RedditCommentView top `<dl>` shows fullname, body, author, created time, depth, parent comment, link, and latest score snapshot. Details tabs: Replies -> RedditCommentsView; Parent -> RedditCommentView; Submission -> RedditLinkView; Metric snapshots -> RedditComment_TimestampsView.
    Notes :: `fullname` is the stable Reddit comment thing id (`t1_...`). Depth and replies are traversal data from a specific comment-tree response, not identity; the resolver rebuilds direct replies from the article forest and pagination limits can hide deeper branches. `author` is a payload string, not a modeled account.

  Entity RedditComment_Timestamp :: $comment+timestampMs ; $comment! $:RedditComment, timestampMs! p:num, score? p:num
    Sources :: Reddit_Rest, Reddit_PublicJson
    View :: RedditComment_TimestampView top `<dl>` shows comment, observation time, and score. RedditCommentView shows latest score and history through RedditComment_TimestampsView.
    Notes :: Comment score is mutable observation data. Keep it separate from body/author/createdAt so a comment can retain stable identity while ranking changes.

  Entity RedditLink :: fullname ; fullname! p:str, title? p:str, selftext? p:str, url? p:str, permalink? p:str, author? p:str, $$timestamps* $:RedditLink_Timestamp, createdAt? p:num, $subreddit? $:RedditSubreddit, $$comments* $:RedditComment
    Sources :: Constants_Internal, Reddit_Rest, Reddit_PublicJson
    View :: RedditLinkView top `<dl>` shows fullname, title, selftext, URL, permalink, author, created time, subreddit, and latest score/comment-count snapshot. Details tabs: Comments -> RedditCommentsView; Subreddit -> RedditSubredditView; Metric snapshots -> RedditLink_TimestampsView.
    Notes :: `fullname` is the stable Reddit thing id (`t3_...`). `url` may be outbound content, media, or a Reddit target; keep `permalink` distinct for canonical reddit.com navigation. `author` is a string from the submission payload, not a modeled account entity.

  Entity RedditLink_Timestamp :: $link+timestampMs ; $link! $:RedditLink, timestampMs! p:num, score? p:num, commentCount? p:num
    Sources :: Reddit_Rest, Reddit_PublicJson
    View :: RedditLink_TimestampView top `<dl>` shows link, observation time, score, and comment count. RedditLinkView shows latest counters and history through RedditLink_TimestampsView.
    Notes :: Score and comment count are changing ranking/thread observations, not submission identity. Keep them timestamped even when they are fetched alongside the link body.

  Entity RedditNetwork :: scope ; scope! p:str, protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str, $$redditSubreddits* $:RedditSubreddit, $$redditLinks* $:RedditLink
    Sources :: Constants_Internal, Reddit_Rest, Reddit_PublicJson
    View :: RedditView top `<dl>` shows protocol name, registry label, topology, home URL, docs URL, and source coverage. Details tabs: Subreddits -> RedditSubredditsView; Links -> RedditLinksView.
    Notes :: This is the app hub for configured Reddit transports. It is not a user/profile model; subreddit, submission, and comment rows keep Reddit name/fullname selectors rather than introducing account entities until a real user/profile source is modeled.

  Entity RedditSubreddit :: name ; name! p:str, title? p:str, publicDescription? p:str, $$timestamps* $:RedditSubreddit_Timestamp, createdAt? p:num, over18? p:bool, $icon? $:Media, $$links* $:RedditLink
    Sources :: Constants_Internal, Reddit_Rest, Reddit_PublicJson
    View :: RedditSubredditView top `<dl>` shows name, title, public description, created time, over-18 flag, icon, and latest subscriber/active-user snapshot. Details tabs: Links -> RedditLinksView; Metric snapshots -> RedditSubreddit_TimestampsView.
    Notes :: `name` is the canonical subreddit id without `/r/` and should be lowercased when derived from listing payloads. Title, description, icon, createdAt, and over18 are community metadata; subscriber and active-user counts stay on timestamp rows because they are live observations and can differ between OAuth REST and public JSON freshness.

  Entity RedditSubreddit_Timestamp :: $subreddit+timestampMs ; $subreddit! $:RedditSubreddit, timestampMs! p:num, subscriberCount? p:num, activeUserCount? p:num
    Sources :: Reddit_Rest, Reddit_PublicJson
    View :: RedditSubreddit_TimestampView top `<dl>` shows subreddit, observation time, subscriber count, and active-user count. RedditSubredditView shows latest counters and history through RedditSubreddit_TimestampsView.
    Notes :: Subreddit counters are source/time observations, not subreddit metadata. Keep timestampMs as the observation key produced by the resolver until an upstream stats clock exists.

  Entity RegulatedAssetProfile :: $assetInstance ; $assetInstance! $:AssetInstance, standard! p:enum, $identityRegistry? $:EvmContract, $compliance? $:EvmContract, $trustedIssuersRegistry? $:EvmContract, $claimTopicsRegistry? $:EvmContract, paused? p:bool, $$issuerPowers* $:IssuerPower, $$claimRequirements* $:ClaimTopicRequirement, $$trustedIssuers* $:TrustedIssuer, $$complianceModules* $:ComplianceModule, $$restrictions* $:TransferRestriction
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Sourcify_Rest, Solana_JsonRpc, Helius_Rest, HederaMirrorNode_Rest, TronGrid_Rest, TronScan_Rest, Dune_Rest, Allium_Rest
    View :: RegulatedAssetProfileView top `<dl>` shows asset instance, standard, identity registry, compliance contract, trusted issuers registry, claim topics registry, and paused state. Details tabs: Claim requirements -> ClaimTopicRequirement list; Trusted issuers -> TrustedIssuer list; Compliance modules -> ComplianceModule list; Issuer powers -> IssuerPower list; Restrictions -> TransferRestriction list.
    Notes :: Compliance/control profile over one real asset instance. Keep registry/compliance contracts as explicit source-backed links; do not promote normal ERC-20 metadata, token-list tags, legal marketing labels, or explorer categories into a regulated profile.

  Entity RoyaltyRight :: royaltyId ; royaltyId! p:str, $collection? $:NftCollection, $token? $:NftToken, receiverSelector! p:json, basisPoints? p:num, calculationKind! p:enum, salePriceDenominationPolicy? p:enum, source? p:enum
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Sourcify_Rest, Reservoir_Rest, OpenSea_Rest, MetadataVision_Rest, Ipfs_Rest, Swarm_Rest
    View :: RoyaltyRightView top `<dl>` shows royalty id, collection, token, receiver selector, basis points, calculation kind, sale-price denomination policy, and source. Details tabs: Collection/token -> NftCollectionView or NftTokenView; Receiver -> Account/EvmAccount view when resolved; Source evidence -> contract call, registry, or metadata payload.
    Notes :: Royalty rule or claim anchored to a collection or token. ERC-2981 `royaltyInfo(tokenId, salePrice)` is advisory payment information and does not prove payment enforcement; marketplace and metadata royalties are source claims with their own clocks and policies. Do not infer enforceable royalties from display metadata alone.

  Entity RssFeed :: feedUrl ; feedUrl! p:url, title? p:str, description? p:str, link? p:url, siteUrl? p:url, language? p:str, lastBuildDate? p:num, imageUrl? p:url, $$items* $:RssItem
    Sources :: Constants_Internal, Rss_Rest, Rss2Json_Rest
    View :: RssFeedView top `<dl>` shows feed URL, title, description, link, site URL, language, last build date, and image URL. Details tabs: Items -> RssItemsView; Record -> feed metadata/source fields.
    Notes :: The selector is normalized `feedUrl`, not the route's `feedKey` encoding. `link` and `siteUrl` are publisher-declared metadata; the feed URL remains the fetch identity. `lastBuildDate` is feed-declared freshness, not proof that every item is new or complete.

  Entity RssItem :: feedUrl+guid ; feedUrl! p:url, guid! p:str, title? p:str, link? p:url, description? p:str, content? p:str, author? p:str, publishedAt? p:num, updatedAt? p:num, categories? p:str[], enclosureUrl? p:url, commentsUrl? p:url, $feed? $:RssFeed
    Sources :: Rss_Rest, Rss2Json_Rest
    View :: RssItemView top `<dl>` shows feed URL, GUID, title, link, author, published time, updated time, categories, enclosure URL, comments URL, and feed ref. Details tabs: Content -> description/content rendered as syndication HTML; Feed -> RssFeedView.
    Notes :: `guid` is scoped to normalized `feedUrl`; it is not globally stable across feeds and may be derived when feeds omit an explicit GUID. `link`, `enclosureUrl`, and `commentsUrl` are item metadata, not selectors or content identity. Enclosures are linked media pointers, not embedded media bytes.

  Entity RssNetwork :: scope ; scope! p:str, protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str, $$rssFeeds* $:RssFeed, $$rssItems* $:RssItem
    Sources :: Constants_Internal, Rss_Rest, Rss2Json_Rest
    View :: RssView top `<dl>` shows protocol name, registry label, topology, home URL, docs URL, and source coverage. Details tabs: Feeds -> RssFeedsView; Items -> RssItemsView.
    Notes :: This is an RSS/Atom hub for configured feeds, not a social-network account model or global feed search engine. Feed/item rows keep URL/GUID identity rather than being folded into a generic cross-protocol content facade; source order and item caps are resolver concerns, not ontology.

  Entity ScalingDeployment :: scalingDeploymentId | $network+source+sourceProjectId ; scalingDeploymentId? p:str, $network! $:Network, source! p:enum, sourceProjectId? p:str, architectureKind? p:enum, stack? p:enum, $settlementNetwork? $:Network, dataAvailabilityKind? p:enum, $dataAvailabilityNetwork? $:Network, dataAvailabilitySelector? p:json, chainConfigUrl? p:url, derivationSpecUrl? p:url, publicRpcUrl? p:url, sequencerRpcUrl? p:url, batchInboxAddress? p:evmAddress, batchInboxSelector? p:json, outputOracleSelector? p:json, bridgeSelector? p:json, forcedInclusionSelector? p:json, proofVerifierSelector? p:json, challengeGameSelector? p:json, genesisSelector? p:json, rolesSelector? p:json, $$settlementContracts* $:EvmContract
    Sources :: Superchain_Github, L2Beat_Rest, Voltaire_JsonRpc, Blobscan_Rest, ZeroGStorageScan_Rest, ZeroGStorageNode_JsonRpc
    View :: future ScalingDeploymentView top `<dl>` should show network, architecture kind, stack, settlement network, DA kind/network, source/sourceProjectId, config/spec URLs, public/sequencer RPCs, and compact selector chips for batch inbox, output oracle, bridge, forced inclusion, verifier, challenge game, genesis, and roles. Details should use `CollapsibleTabs`: Settlement contracts -> EvmContractsView, Sequencing -> RPC and sequencer/batcher selectors, Data availability -> EvmBlobsView or ZeroGDataBlobsView only when concrete evidence rows are linked, Proofs & challenges -> verifier/challenge selectors, Source claims -> source/project/config URLs.
    Notes :: Future rollup/validium/optimium/L3 architecture row, not implemented schema today. Its selector must be source-backed because different registries expose different project/config identifiers; do not merge deployments by marketing name, category, L2Beat slug, Chainlist parent, or explorer tab. Current Superchain_Github and L2Beat_Rest coverage mostly projects EvmNetwork/EvmRollup topology; richer OP Stack config TOML, Arbitrum Nitro, ZKsync Era, Starknet, Scroll, Linea, and Polygon CDK deployment sources need real Source enum rows before they can fulfill this entity. Keep DA, derivation, proof, and forced-inclusion facts as typed selectors, URLs, EvmContract refs, and links to concrete rows such as EvmBlob or ZeroGDataBlob until generic DA/proof rows are source-backed.

  Entity SolanaAccount :: $network+pubkey ; $network! $:Network, pubkey! p:str, $ownerProgram? $:SolanaProgram, lamports? p:bigint, rentEpoch? p:bigint, executable? p:bool, dataEncoding? p:str
    Sources :: Solana_JsonRpc, Helius_Rest, ThreeXpl_Rest
    View :: SolanaAccountView top `<dl>` shows network, pubkey, owner program, lamports, executable flag, rent epoch, and data encoding. Details tabs: Owner program -> SolanaProgramView; Transactions/instructions -> SolanaInstruction references when reached from transactions; Network -> SolanaNetworkView.
    Notes :: Solana accounts are storage/executable accounts, not wallet identity by default. Token accounts, stake accounts, and program-specific account layouts should become typed rows only when parsed source data is available.

  Entity SolanaBlock :: $network+slot | $network+blockHash ; $network! $:Network, slot! p:bigint, blockHeight? p:bigint, blockHash! p:str, previousBlockHash? p:str, $parent? $:SolanaBlock, parentSlot? p:bigint, timestampMs? p:num, transactionCount? p:num, $$transactions* $:SolanaTransaction
    Sources :: Solana_JsonRpc, ThreeXpl_Rest
    View :: SolanaBlockView top `<dl>` shows network, slot, block height, block hash, previous block hash, parent slot/block, timestamp, and transaction count. Details tabs: Transactions -> SolanaTransaction list; Parent -> SolanaBlockView; Network -> SolanaNetworkView. SolanaBlocksView lists blocks in SolanaNetworkView Execution.
    Notes :: Slot is the native consensus coordinate; block height is optional and not the primary selector. Keep recent block scans bounded by source limits and do not treat missing historical blocks as absence.

  Entity SolanaInstruction :: $transaction+instructionKind+instructionIndex | $transaction+instructionKind+instructionIndex+innerInstructionIndex ; $transaction! $:SolanaTransaction, instructionKind! p:enum, instructionIndex! p:num, innerInstructionIndex? p:num, $program? $:SolanaProgram, parsedType? p:str, data? p:str, stackHeight? p:num, $$accounts* $:SolanaAccount
    Sources :: Solana_JsonRpc, Helius_Rest, ThreeXpl_Rest
    View :: SolanaInstructionView top `<dl>` shows transaction, instruction kind, instruction index, inner instruction index, program, parsed type, stack height, and account count. Details tabs: Program -> SolanaProgramView; Accounts -> SolanaAccount list; Transaction -> SolanaTransactionView; Raw instruction -> data/base64/parsed payload.
    Notes :: Selector separates top-level and inner instructions because Solana transactions can include both. Do not add instruction-account join rows unless signer/writable/source metadata is modeled; direct account refs are enough for current views.

  Entity SolanaNetwork :: caip2 ; caip2! p:{namespace:'solana',reference:str}, $network? $:Network, environment! p:enum, rpcEndpoints+ p:{url:url,transportType:enum,providerName:str}, $$timestamps* $:SolanaNetwork_Timestamp, $$blocks* $:SolanaBlock, $$transactions* $:SolanaTransaction, $$accounts* $:SolanaAccount, $$validators* $:SolanaValidator
    Sources :: Constants_Internal, Solana_JsonRpc, Helius_Rest, ThreeXpl_Rest
    View :: SolanaNetworkView top `<dl>` shows CAIP-2, parent network, environment, latest head snapshot, endpoint count, recent account count, and native asset count. Details tabs: Execution -> Blocks, Transactions, Accounts, Network snapshots, Endpoints; Consensus & Block Production -> Validators; Assets -> Native coin; Resources -> Faucets and block explorers.
    Notes :: Programs, token mints, and instructions are real entities, but they hang from accounts, transactions, and token mint/account selectors rather than a direct complete network child list.

  Entity SolanaNetwork_Timestamp :: $network+timestampMs ; $network! $:SolanaNetwork, timestampMs! p:num, absoluteSlot? p:bigint, blockHeight? p:bigint, epoch? p:num, slotIndex? p:num, slotsInEpoch? p:num, transactionCount? p:bigint, currentValidatorCount? p:num, delinquentValidatorCount? p:num, totalActivatedStakeLamports? p:bigint, solanaCoreVersion? p:str, featureSet? p:num, health? p:str
    Sources :: Solana_JsonRpc
    View :: SolanaNetwork_TimestampView top `<dl>` shows timestamp, absolute slot, block height, epoch, slot index, slots in epoch, transaction count, validator counts, activated stake, core version, feature set, and health. Details tabs: Slot/epoch -> slot and epoch progress; Validators/stake -> current/delinquent counts and activated stake; Node/version -> health, core version, feature set. SolanaNetwork_TimestampsView lists network snapshots under Execution.
    Notes :: Timestamped observed cluster state. Do not duplicate slot, validator count, stake, version, or health on SolanaNetwork; keep them source/time scoped.

  Entity SolanaProgram :: $network+programId ; $network! $:Network, programId! p:str, name? p:str, $programAccount? $:SolanaAccount, $upgradeAuthority? $:SolanaAccount
    Sources :: Solana_JsonRpc, Helius_Rest, ThreeXpl_Rest
    View :: SolanaProgramView top `<dl>` shows network, program id, name, program account, and upgrade authority. Details tabs: Program account -> SolanaAccountView; Upgrade authority -> SolanaAccountView; Instructions -> SolanaInstruction list when reached from transactions.
    Notes :: Program identity is the executable program id. Labels and upgrade authority are optional source-backed metadata, not selectors; parsed program-specific accounts should become separate typed rows only when needed.

  Entity SolanaTokenMint :: $network+mintAddress ; $network! $:Network, mintAddress! p:str, supply? p:bigint, decimals? p:num, $mintAuthority? $:SolanaAccount, $freezeAuthority? $:SolanaAccount
    Sources :: Solana_JsonRpc, Helius_Rest, ThreeXpl_Rest
    View :: SolanaTokenMintView top `<dl>` shows network, mint address, supply, decimals, mint authority, and freeze authority. Details tabs: Authorities -> mint and freeze SolanaAccountView; Network -> SolanaNetworkView; Metadata -> future SPL/Metaplex metadata row when source-backed.
    Notes :: Token mint identity is the mint account. Do not model a generic network token list from market/indexer convenience data; reach mint rows from mint/account selectors or parsed token-account state.

  Entity SolanaTransaction :: $network+signature ; $network! $:Network, signature! p:str, $block? $:SolanaBlock, $feePayer? $:SolanaAccount, slot? p:bigint, feeLamports? p:bigint, computeUnitsConsumed? p:bigint, status? p:str, $$instructions* $:SolanaInstruction
    Sources :: Solana_JsonRpc, Helius_Rest, ThreeXpl_Rest
    View :: SolanaTransactionView top `<dl>` shows network, signature, block, slot, fee payer, fee lamports, compute units consumed, status, and instruction count. Details tabs: Instructions -> SolanaInstruction list grouped by top-level/inner kind; Block -> SolanaBlockView; Fee payer -> SolanaAccountView; Raw message -> account keys/address lookup table data when modeled.
    Notes :: Signature is the transaction selector. Keep account-key metadata and address lookup table details as transaction/message source payload until promoted into source-backed account/key lookup rows.

  Entity SolanaValidator :: $network+votePubkey ; $network! $:Network, votePubkey! p:str, nodePubkey? p:str, activatedStakeLamports? p:bigint, commission? p:num, delinquent? p:bool
    Sources :: Solana_JsonRpc
    View :: SolanaValidatorView top `<dl>` shows network, vote pubkey, node pubkey, activated stake, commission, and delinquent state. Details tabs: Network -> SolanaNetworkView; Vote account -> SolanaAccountView when resolved; Stake/status -> activated stake, commission, delinquency. SolanaValidatorsView lists validators under Consensus & Block Production.
    Notes :: votePubkey is the validator vote-account selector; nodePubkey is the gossip/identity key. Do not conflate validator identity with stake account, withdraw authority, or operator label without source-backed rows.

  Entity SorobanContract :: $network+contractId ; $network! $:StellarNetwork, contractId! p:str, wasmHash? p:hex, $$storageEntries* $:SorobanContractStorageEntry, $$transactions* $:StellarTransaction
    Sources :: StellarRpc_JsonRpc, StellarExpert_Rest
    View :: SorobanContractView top `<dl>` shows contract id, wasm hash, latest storage entry count, and network. Details tabs: Storage -> SorobanContractStorageEntriesView; Transactions -> StellarTransactionsView; Code -> contract code/wasm hash details.
    Notes :: Soroban contract id and wasm hash are distinct: code can be reused across contracts, while storage keys are contract-instance state.

  Entity SorobanContractStorageEntry :: $contract+keyHash ; $contract! $:SorobanContract, keyHash! p:hex, key? p:json, value? p:json, durability? p:enum, lastModifiedLedger? p:bigint, liveUntilLedger? p:bigint
    Sources :: StellarRpc_JsonRpc, StellarExpert_Rest
    View :: SorobanContractStorageEntryView top `<dl>` shows contract, key hash/key, durability, last modified ledger, live-until ledger, and value payload.
    Notes :: Soroban storage entries are ledger entries keyed by contract and storage key. Values are latest ledger state unless a ledger-version-pinned source is used.

  Entity SpecificationProposal :: realm+category+number ; realm! p:enum, category! p:enum, number! p:num, documentCategory? p:str, documentTitle? p:str, documentStatus? p:str, documentBody? p:str
    Sources :: BitcoinBips_Github, BitcoinCashChips_Gitlab, Caips_Github, CosmosAdrs_Github, DogecoinDips_Github, Ensips_Github, EthereumEips_Github, FilecoinFips_Github, HyperliquidDocs_Rest, LitecoinLips_Github, NearNeps_Github, PolkadotRfcs_Github, QuilibriumDocs_Rest, SolanaSimds_Github, ZcashZips_Github
    View :: SpecificationProposalView top `<dl>` shows realm, category, number, document category, title, and status. Details tabs: Document -> rendered Markdown/body; Kind -> SpecificationProposalKindView; Realm -> SpecificationRealmView; Referencing upgrades -> NetworkUpgrade/EthereumNetworkUpgrade lists when linked.
    Notes :: Specification proposal rows are source-backed technical documents, not governance vote records. Each source parser should map repository/category front matter into normalized category/title/status/body fields while preserving realm/category/number as the stable selector.

  Entity SpecificationProposalKind :: realm+category ; realm! p:enum, category! p:enum, label! p:str, labelPlural! p:str, slug! p:str, $specificationRealm! $:SpecificationRealm, $$proposals* $:SpecificationProposal
    Sources :: Constants_Internal, BitcoinBips_Github, BitcoinCashChips_Gitlab, Caips_Github, CosmosAdrs_Github, DogecoinDips_Github, Ensips_Github, EthereumEips_Github, FilecoinFips_Github, HyperliquidDocs_Rest, LitecoinLips_Github, NearNeps_Github, PolkadotRfcs_Github, QuilibriumDocs_Rest, SolanaSimds_Github, ZcashZips_Github
    View :: SpecificationProposalKindView top `<dl>` shows realm, category, label, plural label, slug, and parent realm. Details tabs: Proposals -> SpecificationProposal list filtered by realm/category; Realm -> SpecificationRealmView.
    Notes :: Proposal-kind rows normalize category labels and browsing groups for source-backed proposal documents. Constants own labels/slugs; proposal source catalogs populate the proposal list under each kind.

  Entity SpecificationRealm :: realm ; realm! p:enum, label! p:str, labelPlural? p:str, slug! p:str, $$proposalKinds* $:SpecificationProposalKind, $$proposals* $:SpecificationProposal
    Sources :: Constants_Internal, BitcoinBips_Github, BitcoinCashChips_Gitlab, Caips_Github, CosmosAdrs_Github, DogecoinDips_Github, Ensips_Github, EthereumEips_Github, FilecoinFips_Github, HyperliquidDocs_Rest, LitecoinLips_Github, NearNeps_Github, PolkadotRfcs_Github, QuilibriumDocs_Rest, SolanaSimds_Github, ZcashZips_Github
    View :: SpecificationRealmView top `<dl>` shows realm, label, plural label, and slug. Details tabs: Kinds -> SpecificationProposalKind list; Proposals -> SpecificationProposal list grouped by kind.
    Notes :: Realm rows define top-level specification-document namespaces such as Ethereum, Bitcoin, Cosmos, Solana, and CAIP. They are browsing/catalog rows; source repositories provide proposal documents and constants provide labels/slugs.

  Entity StateChannel :: id ; id! p:str, $network! $:EvmNetwork, $participant0! $:EvmAccount, $participant1! $:EvmAccount, $asset! $:EvmCoinInstance, totalDeposited! p:bigint, balance0! p:bigint, balance1! p:bigint, turnNum! p:num, status! p:enum, $room? $:BlockheadRoom, createdAt! p:num, updatedAt! p:num, $$transfers+ $:StateChannelTransfer, $$states+ $:StateChannelState, $$deposits+ $:StateChannelDeposit
    Sources :: Local_Internal
    View :: StateChannelView top `<dl>` shows channel id or participant pair, network, participants as EvmNetworkAccountView/EvmAccountView, asset, total deposited, balances, turn number, status, linked room, and created/updated timestamps. Details tabs: Transfers -> StateChannelTransfer list; States -> StateChannelState list; Deposits -> StateChannelDeposit list; Room -> BlockheadRoomView when linked.
    Notes :: Local Nitro-style bilateral payment channel state. It is not a generic bridge, AMM pool, chat room, mempool entry, or public channel registry; on-chain settlement and disputes should link through explicit EVM transaction/contract rows when modeled.

  Entity StateChannelDeposit :: id ; id! p:str, $channel! $:StateChannel, $network! $:EvmNetwork, $account! $:EvmAccount, availableBalance! p:bigint, lockedBalance! p:bigint, lastUpdated! p:num
    Sources :: Local_Internal
    View :: StateChannelDepositView top `<dl>` shows deposit id, channel, network, account, available balance, locked balance, and last updated time. Details tabs: Channel -> StateChannelView; Account -> EvmAccountView/EvmNetworkAccountView; Collateral -> available and locked balance fields.
    Notes :: Local per-account collateral slice for a state channel. It is not an ERC-20 allowance, wallet balance, bridge escrow, or proof that a settlement transaction has finalized.

  Entity StateChannelState :: id ; id! p:str, $channel! $:StateChannel, intent! p:num, version! p:num, stateData! p:hex, allocations! p:{destination:evmAddress,token:evmAddress,amount:bigint}[], signatures! p:hex[], isFinal! p:bool, timestamp! p:num
    Sources :: Local_Internal
    View :: StateChannelStateView top `<dl>` shows state id, channel, intent, version, final flag, timestamp, allocation count, signature count, and state data hash/hex. Details tabs: Channel -> StateChannelView; Allocations -> destination/token/amount table; Signatures -> co-signature list.
    Notes :: Local signed channel snapshot with allocation vector and co-signatures for an off-chain update. It is not a public block-state root, transaction receipt, or final settlement unless linked to an explicit on-chain adjudication row.

  Entity StateChannelTransfer :: id ; id! p:str, $channel! $:StateChannel, $from! $:EvmAccount, $to! $:EvmAccount, amount! p:bigint, turnNum! p:num, timestamp! p:num, status! p:enum
    Sources :: Local_Internal
    View :: StateChannelTransferView top `<dl>` shows transfer id, channel, from account, to account, amount, turn number, timestamp, and status. Details tabs: Channel -> StateChannelView; Participants -> from/to EvmAccountView; Turn -> linked StateChannelState when modeled.
    Notes :: Local directed transfer within a channel turn. It is not an on-chain token transfer, bridge transfer, or payment receipt until settlement/submission rows link it to public ledger evidence.

  Entity StellarAccount :: $network+accountId ; $network! $:StellarNetwork, accountId! p:str, $$trustlines* $:StellarTrustline, $$transactions* $:StellarTransaction, $$timestamps* $:StellarAccount_Timestamp
    Sources :: StellarHorizon_Rest, StellarRpc_JsonRpc, StellarExpert_Rest
    View :: StellarAccountView top `<dl>` shows account id, latest sequence, native balance, subentry count, signer count, and thresholds. Details tabs: Trustlines -> StellarTrustlinesView; Transactions -> StellarTransactionsView; Account snapshots -> StellarAccount_TimestampsView; Signers/thresholds -> structured snapshot fields.
    Notes :: Sequence, balances, signers, and thresholds are ledger-state observations. Stable identity is the account id on a network.

  Entity StellarAccount_Timestamp :: $account+timestampMs+source ; $account! $:StellarAccount, timestampMs! p:num, source! p:str, ledgerSequence? p:bigint, sequence? p:str, nativeBalance? p:str, subentryCount? p:num, thresholds? p:json, signerCount? p:num
    Sources :: StellarHorizon_Rest, StellarRpc_JsonRpc, StellarExpert_Rest
    View :: StellarAccount_TimestampView top `<dl>` shows native balance, sequence, ledger sequence, subentry count, signer count, thresholds, source, and observation time; StellarAccountView shows latest/history.
    Notes :: Use strings for balances and sequence because Horizon exposes decimal balances and large sequence numbers as strings.

  Entity StellarAsset :: $network+assetCode+issuer | $network+nativeAsset ; $network! $:StellarNetwork, assetCode? p:str, issuer? p:str, nativeAsset? p:bool, $issuerAccount? $:StellarAccount, $$trustlines* $:StellarTrustline
    Sources :: StellarHorizon_Rest, StellarExpert_Rest, StellarToml_Rest, Constants_Internal
    View :: StellarAssetView top `<dl>` shows native/code/issuer, issuer account, and asset metadata. Details tabs: Trustlines -> StellarTrustlinesView; Metadata -> TOML/explorer metadata when available.
    Notes :: Native XLM is selector `$network+nativeAsset`; issued assets are code+issuer. Do not use asset code alone as identity.

  Entity StellarLedger :: $network+sequence ; $network! $:StellarNetwork, sequence! p:bigint, hash? p:hex, closeTimeMs? p:num, protocolVersion? p:num, transactionCount? p:num, operationCount? p:num, successfulTransactionCount? p:num, failedTransactionCount? p:num, $$transactions* $:StellarTransaction, $$operations* $:StellarOperation
    Sources :: StellarHorizon_Rest, StellarRpc_JsonRpc, StellarExpert_Rest
    View :: StellarLedgerView top `<dl>` shows sequence, hash, close time, protocol version, transaction counts, and operation count. Details tabs: Transactions -> StellarTransactionsView; Operations -> StellarOperationsView.
    Notes :: Ledger sequence is the canonical ledger coordinate. Use hash for verification and linking, not as the only selector.

  Entity StellarNetwork :: $network ; $network! $:Network, passphrase? p:str, $$ledgers* $:StellarLedger, $$transactions* $:StellarTransaction, $$operations* $:StellarOperation, $$accounts* $:StellarAccount, $$assets* $:StellarAsset, $$contracts* $:SorobanContract, $$timestamps* $:StellarNetwork_Timestamp
    Sources :: StellarHorizon_Rest, StellarRpc_JsonRpc, StellarExpert_Rest, Constants_Internal
    View :: StellarNetworkView top `<dl>` shows linked Network, network passphrase, latest ledger/protocol snapshot, base fee/reserve, and native XLM asset. Details use `CollapsibleTabs`: Ledgers -> StellarLedgersView; Transactions -> StellarTransactionsView; Operations -> StellarOperationsView; Accounts -> StellarAccountsView; Assets -> StellarAssetsView; Soroban contracts -> SorobanContractsView; Network snapshots -> StellarNetwork_TimestampsView.
    Notes :: Stellar separates transaction envelopes, operation bodies, account trustlines, and Soroban contract state. Preserve those native layers instead of collapsing to generic transfers.

  Entity StellarNetwork_Timestamp :: $network+timestampMs+source ; $network! $:StellarNetwork, timestampMs! p:num, source! p:str, latestLedger? p:bigint, protocolVersion? p:num, baseFee? p:bigint, baseReserve? p:bigint
    Sources :: StellarHorizon_Rest, StellarRpc_JsonRpc, StellarExpert_Rest
    View :: StellarNetwork_TimestampView top `<dl>` shows latest ledger, protocol version, base fee, base reserve, source, and observation time; StellarNetworkView shows latest/history.
    Notes :: Fee and reserve parameters can change by protocol/network state, so keep them as snapshots.

  Entity StellarOperation :: $transaction+operationIndex ; $transaction! $:StellarTransaction, operationIndex! p:num, operationType! p:enum, sourceAccount? p:str, body? p:json, resultCode? p:str
    Sources :: StellarHorizon_Rest, StellarRpc_JsonRpc, StellarExpert_Rest
    View :: StellarOperationView top `<dl>` shows operation index/type, source account, result code, and parent transaction. Details show operation body by type.
    Notes :: Operation index is scoped to the transaction. Keep `body` as typed JSON until specific payment/path-payment/manage-offer/create-account rows are justified.

  Entity StellarTransaction :: $network+hash ; $network! $:StellarNetwork, hash! p:hex, ledgerSequence? p:bigint, sourceAccount? p:str, feeCharged? p:bigint, maxFee? p:bigint, memo? p:json, successful? p:bool, resultCode? p:str, envelopeXdr? p:str, resultXdr? p:str, metaXdr? p:str, $$operations* $:StellarOperation
    Sources :: StellarHorizon_Rest, StellarRpc_JsonRpc, StellarExpert_Rest
    View :: StellarTransactionView top `<dl>` shows hash, success/result code, source account, ledger, fee charged/max fee, and memo. Details tabs: Operations -> StellarOperationsView; XDR/result -> envelope/result/meta inspectors.
    Notes :: Transaction success/failure is envelope-level. Operation effects require per-operation rows and result metadata.

  Entity StellarTrustline :: $account+$asset ; $account! $:StellarAccount, $asset! $:StellarAsset, $$timestamps* $:StellarTrustline_Timestamp
    Sources :: StellarHorizon_Rest, StellarRpc_JsonRpc, StellarExpert_Rest
    View :: StellarTrustlineView top `<dl>` shows account, asset, latest balance/limit/liabilities/auth flags. Details tabs: Snapshots -> StellarTrustline_TimestampsView.
    Notes :: Stellar issued-asset balances exist through trustlines. Authorization and clawback flags are mutable ledger state.

  Entity StellarTrustline_Timestamp :: $trustline+timestampMs+source ; $trustline! $:StellarTrustline, timestampMs! p:num, source! p:str, ledgerSequence? p:bigint, balance? p:str, limit? p:str, buyingLiabilities? p:str, sellingLiabilities? p:str, authorized? p:bool, authorizedToMaintainLiabilities? p:bool, clawbackEnabled? p:bool
    Sources :: StellarHorizon_Rest, StellarRpc_JsonRpc, StellarExpert_Rest
    View :: StellarTrustline_TimestampView top `<dl>` shows balance, limit, liabilities, authorization/clawback flags, ledger sequence, source, and observation time; StellarTrustlineView shows latest/history.
    Notes :: Liabilities and authorization state are trustline state, not StellarAsset identity.

  Entity SuiAccount :: $network+address ; $network! $:SuiNetwork, address! p:str, $$objects* $:SuiObject, $$transactions* $:SuiTransaction
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiAccountView top `<dl>` shows address and network. Details tabs: Owned objects -> SuiObjectsView; Transactions -> SuiTransactionsView.
    Notes :: Sui accounts own objects; they do not own Aptos-style account resources.

  Entity SuiBalanceChange :: $transaction+changeIndex ; $transaction! $:SuiTransaction, changeIndex! p:num, ownerSelector? p:json, coinType? p:str, amountDelta! p:bigint
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiBalanceChangeView top `<dl>` shows owner, coin type, amount delta, and parent transaction.
    Notes :: Coin type is a Move type tag or source asset selector candidate; do not invent a generic Asset ref until a concrete asset-instance mapping exists.

  Entity SuiCheckpoint :: $network+sequence | $network+digest ; $network! $:SuiNetwork, sequence? p:bigint, digest? p:str, epoch? p:bigint, timestampMs? p:num, previousDigest? p:str, $$transactions* $:SuiTransaction
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiCheckpointView top `<dl>` shows sequence, digest, epoch, timestamp, previous digest; Details tabs: Transactions -> SuiTransactionsView.
    Notes :: Checkpoint sequence and digest are Sui coordinates. Aptos ledger versions and block heights do not belong in this row.

  Entity SuiDynamicFieldEdge :: $parentObject+fieldNameHash+childObjectId ; $parentObject! $:SuiObject, fieldNameHash! p:str, childObjectId! p:str, fieldName? p:json, fieldType? p:str, childObjectType? p:str
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiDynamicFieldEdgeView top `<dl>` shows parent object, field name hash/value/type, child object id, and child object type.
    Notes :: Dynamic object fields are edges to independently addressable child objects, not embedded account resources.

  Entity SuiEvent :: $network+transactionDigest+eventIndex ; $network! $:SuiNetwork, transactionDigest! p:str, eventIndex! p:num, eventType! p:str, packageId? p:str, moduleName? p:str, sender? p:str, value? p:json
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiEventView top `<dl>` shows event type, package/module, sender, transaction digest, event index, and value payload.

  Entity SuiNetwork :: $network ; $network! $:Network, $$timestamps* $:SuiNetwork_Timestamp, $$checkpoints* $:SuiCheckpoint, $$transactions* $:SuiTransaction, $$accounts* $:SuiAccount, $$objects* $:SuiObject, $$packages* $:SuiPackage
    Sources :: Sui_JsonRpc, Sui_Graphql, Constants_Internal
    View :: SuiNetworkView top `<dl>` shows linked Network, latest checkpoint/epoch/protocol version snapshot, and execution environment. Details use `CollapsibleTabs`: Checkpoints -> SuiCheckpointsView; Transactions -> SuiTransactionsView; Accounts -> SuiAccountsView; Objects -> SuiObjectsView; Packages -> SuiPackagesView; Network snapshots -> SuiNetwork_TimestampsView.
    Notes :: Sui is an object-centric Move chain. Do not model it through a generic Move account-resource root; objects, object references, checkpoints, transaction blocks, and packages are independent Sui entities.

  Entity SuiNetwork_Timestamp :: $network+timestampMs+source ; $network! $:SuiNetwork, timestampMs! p:num, source! p:enum, latestCheckpointSequence? p:bigint, latestCheckpointDigest? p:str, epoch? p:bigint, protocolVersion? p:bigint, totalTransactionCount? p:bigint
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiNetwork_TimestampView top `<dl>` shows observed time/source, latest checkpoint sequence/digest, epoch, protocol version, and transaction count; SuiNetworkView shows latest snapshot plus history.
    Notes :: These are source-time observations. Epoch and protocol version are latest network facts at the observed checkpoint, not stable fields on SuiNetwork.

  Entity SuiObject :: $network+objectId | $network+objectId+version+digest ; $network! $:SuiNetwork, objectId! p:str, version? p:bigint, digest? p:str, ownerSelector? p:json, objectType? p:str, storageRebate? p:bigint, previousTransaction? p:str, contents? p:json, $$versions* $:SuiObjectVersion, $$dynamicFields* $:SuiDynamicFieldEdge
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiObjectView top `<dl>` shows object id, type, owner, version, digest, previous transaction, and storage rebate. Details tabs: Versions -> SuiObjectVersionsView; Dynamic fields -> SuiDynamicFieldEdgesView; Contents -> structured JSON when fetched.
    Notes :: Current object identity is objectId; version+digest is an authenticated historical object reference. Owner and contents can change across versions, so versioned views should prefer SuiObjectVersion.

  Entity SuiObjectChange :: $transaction+changeIndex ; $transaction! $:SuiTransaction, changeIndex! p:num, changeKind! p:enum, objectId? p:str, objectType? p:str, ownerSelector? p:json, version? p:bigint, digest? p:str
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiObjectChangeView top `<dl>` shows change kind, object id/type, owner, version, digest, and parent transaction.

  Entity SuiObjectVersion :: $network+objectId+version+digest ; $network! $:SuiNetwork, objectId! p:str, version! p:bigint, digest! p:str, ownerSelector? p:json, objectType? p:str, previousTransaction? p:str, storageRebate? p:bigint, contents? p:json
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiObjectVersionView top `<dl>` shows object id, version, digest, owner, type, previous transaction, storage rebate, and contents.
    Notes :: This is the stable Sui object reference triple used by transactions and historical object reads.

  Entity SuiPackage :: $network+packageId ; $network! $:SuiNetwork, packageId! p:str, version? p:bigint, digest? p:str, upgradePolicy? p:enum, $$modules* $:MoveModule, $$upgrades* $:SuiPackageUpgrade
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiPackageView top `<dl>` shows package id, version, digest, and upgrade policy. Details tabs: Modules -> MoveModulesView; Upgrades -> SuiPackageUpgradesView.
    Notes :: A Sui package is an immutable package object at a published version. Upgrades create new package versions/ids and should not mutate old package identity.

  Entity SuiPackageUpgrade :: $package+version ; $package! $:SuiPackage, version! p:bigint, previousPackageId? p:str, upgradeCapSelector? p:json, policy? p:enum, digest? p:str, timestampMs? p:num
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiPackageUpgradeView top `<dl>` shows package/version, previous package id, policy, digest, timestamp, and upgrade capability selector.

  Entity SuiProgrammableTransactionCommand :: $transaction+commandIndex ; $transaction! $:SuiTransaction, commandIndex! p:num, commandKind! p:enum, packageId? p:str, moduleName? p:str, functionName? p:str, typeArguments* p:str, arguments? p:json
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiProgrammableTransactionCommandView top `<dl>` shows command index/kind, package/module/function, type arguments, and arguments.

  Entity SuiTransaction :: $network+digest ; $network! $:SuiNetwork, digest! p:str, transactionKind? p:enum, sender? p:str, gasBudget? p:bigint, gasPrice? p:bigint, status? p:enum, checkpointSequence? p:bigint, timestampMs? p:num, $$commands* $:SuiProgrammableTransactionCommand, $$objectChanges* $:SuiObjectChange, $$balanceChanges* $:SuiBalanceChange, $$events* $:SuiEvent
    Sources :: Sui_JsonRpc, Sui_Graphql
    View :: SuiTransactionView top `<dl>` shows digest, kind, sender, status, checkpoint, timestamp, gas budget/price. Details tabs: Commands -> SuiProgrammableTransactionCommandsView; Object changes -> SuiObjectChangesView; Balance changes -> SuiBalanceChangesView; Events -> SuiEventsView.
    Notes :: This is Sui's transaction block digest, not an Aptos transaction hash/version and not an EVM transaction.

  Entity SwapQuote :: id ; id! p:str, $network! $:EvmNetwork, $tokenIn! $:EvmCoinInstance, $tokenOut! $:EvmCoinInstance, amountIn! p:bigint, amountOut! p:bigint, priceImpact! p:num, route! p:{poolId:str,tokenIn:evmAddress,tokenOut:evmAddress,fee:num}[], gasEstimate! p:bigint, timestamp! p:num
    Sources :: Local_Internal
    View :: SwapQuoteView top `<dl>` shows network, token in/out, amount in/out, price impact, gas estimate, timestamp/freshness, and route hop count. Details tabs: Route -> poolId/token/fee hop table; Tokens -> EvmCoinInstanceView for input/output; Session intent -> BlockheadSwapIntent when linked; Execution -> approval, calldata, simulation, submission, and outcome rows when modeled.
    Notes :: Request-time local/provider quote artifact keyed by quote id. It is not a market, price feed, liquidity pool, approval, executable calldata, transaction, or bridge route; route pool ids are source route details and should not imply canonical LiquidityPool refs until a source returns stable pool selectors.

  Entity SwarmProtocol :: scope ; scope! p:'SwarmProtocol', protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str
    Sources :: Constants_Internal
    View :: SwarmProtocolView top `<dl>` shows protocol name, registry label, topology, home URL, docs URL, and Bee gateway/catalog coverage. Details tabs: Browse -> SwarmBrowseView; Resources -> SwarmResource examples when linked.
    Notes :: Singleton protocol hub and browse entry point. It is not a Swarm chunk, postage batch, retrieval attempt, or content identity row.

  Entity SwarmResource :: reference+contentPath ; reference! p:str, contentPath! p:str, canonicalUri! p:url, gatewayOrigin! p:url, gatewayUrl! p:url, fileName? p:str, extension? p:str, contentType? p:str, contentLength? p:num, displayType! p:enum, isContentTypeInferred! p:bool, text? p:str, $media? $:Media
    Sources :: Swarm_Rest
    View :: SwarmResourceView top `<dl>` shows content type, canonical BZZ URI, gateway origin/url, content length, file name, extension, display type, and inferred-content-type status. Details tabs: Browse -> SwarmBrowseForm for alternate reference/path lookup; Metadata -> reference, content path, gateway, and response metadata; Preview -> fetched text/media/binary content.
    Notes :: Swarm resources are selected by Bee-compatible BZZ reference plus optional manifest path. Keep BZZ references distinct from IPFS CIDs and ordinary URLs; gateway metadata and MIME inference are retrieval observations from the configured Swarm REST gateway source.

  Entity TezosAccount :: $network+address ; $network! $:TezosNetwork, address! p:str, accountKind! p:enum, publicKey? p:hex, $$operations* $:TezosOperation, $$timestamps* $:TezosAccount_Timestamp
    Sources :: TezosNode_Rpc, Tzkt_Rest, BetterCallDev_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosAccountView top `<dl>` shows address, account kind, public key/revealed state, latest balance, counter, and delegate. Tabs: operations, delegation/baker linkage, token/contract relationships, timestamp history.
    Notes :: accountKind distinguishes implicit accounts, originated contracts, and baker/delegate identities. Mutable balance/delegation/counter belongs on TezosAccount_Timestamp.

  Entity TezosAccount_Timestamp :: $account+level+source ; $account! $:TezosAccount, level! p:bigint, source! p:str, timestampMs? p:num, balanceMutez? p:bigint, counter? p:bigint, delegate? p:str, isRevealed? p:bool, publicKey? p:hex
    Sources :: TezosNode_Rpc, Tzkt_Rest, BetterCallDev_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosAccount_TimestampView top `<dl>` shows account, level, source, balance, counter, delegate, revealed status, and public key. Details show source payload.
    Notes :: Account balance, counter, and delegation are mutable state. Keep only address/kind on the stable account row.

  Entity TezosBaker :: $network+address ; $network! $:TezosNetwork, address! p:str, consensusKey? p:str, $account? $:TezosAccount, $$cycleTimestamps* $:TezosBaker_Cycle_Timestamp, $$timestamps* $:TezosBaker_Timestamp
    Sources :: TezosNode_Rpc, Tzkt_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosBakerView top `<dl>` shows baker address, consensus key, latest staking balance, voting power, and active status. Tabs: cycle snapshots, produced blocks, missed/endorsing stats, delegators, timestamp history.
    Notes :: Baker state is delegate/account state with consensus-specific fields. Keep balances, staking power, and performance metrics on TezosBaker_Timestamp.

  Entity TezosBaker_Cycle_Timestamp :: $baker+cycle+source ; $baker! $:TezosBaker, cycle! p:bigint, source! p:str, snapshotLevel? p:bigint, stakingBalanceMutez? p:bigint, delegatedBalanceMutez? p:bigint, expectedBlocks? p:num, producedBlocks? p:num, missedBlocks? p:num, expectedEndorsements? p:num, missedEndorsements? p:num, rewardsMutez? p:bigint, feesMutez? p:bigint
    Sources :: Tzkt_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosBaker_Cycle_TimestampView top `<dl>` shows baker, cycle, source, snapshot level, staking balance, produced/missed blocks, endorsements, rewards, and fees. Details show rights/performance payload.
    Notes :: Cycle performance is a period observation keyed by baker and cycle, not stable baker identity.

  Entity TezosBaker_Timestamp :: $baker+level+source ; $baker! $:TezosBaker, level! p:bigint, source! p:str, timestampMs? p:num, stakingBalanceMutez? p:bigint, delegatedBalanceMutez? p:bigint, ownDelegatedBalanceMutez? p:bigint, votingPower? p:bigint, active? p:bool
    Sources :: TezosNode_Rpc, Tzkt_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosBaker_TimestampView top `<dl>` shows baker, level, source, staking balance, delegated balance, voting power, and active status. Details show source payload.
    Notes :: Baker performance and stake change by cycle/head. Timestamp them rather than making TezosBaker a live metrics row.

  Entity TezosBigMap :: $contract+bigMapId ; $contract! $:TezosContract, bigMapId! p:bigint, path? p:str, keyType? p:json, valueType? p:json, active? p:bool
    Sources :: TezosNode_Rpc, Tzkt_Rest, BetterCallDev_Rest, TezosDappetizer_Postgres
    View :: TezosBigMapView top `<dl>` shows contract, big-map id, path, active status, key type, and value type. Tabs: key history, latest keys, operation diffs, source evidence.
    Notes :: Big maps have independent ids and sparse key state. Do not bury them inside contract storage JSON only.

  Entity TezosBigMapDiff :: $operation+bigMapId+keyHash ; $operation! $:TezosOperation, bigMapId! p:bigint, keyHash! p:hex, action! p:enum, key? p:json, value? p:json, $bigMap? $:TezosBigMap
    Sources :: TezosNode_Rpc, Tzkt_Rest, BetterCallDev_Rest, TezosDappetizer_Postgres
    View :: TezosBigMapDiffView top `<dl>` shows operation, big-map id, key hash, action, and linked big map. Details show decoded key/value and raw diff payload.
    Notes :: Big-map diffs are operation effects and the source of key-value history.

  Entity TezosBlock :: $network+level | $network+hash ; $network! $:TezosNetwork, level? p:bigint, hash? p:hex, timestampMs? p:num, protocolHash? p:hex, predecessorHash? p:hex, bakerAddress? p:str, round? p:num, cycle? p:bigint, payloadHash? p:hex, operationsHash? p:hex, fitness? p:json, $$operationGroups* $:TezosOperationGroup, $$operations* $:TezosOperation
    Sources :: TezosNode_Rpc, Tzkt_Rest, BetterCallDev_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosBlockView top `<dl>` shows level, hash, timestamp, protocol, baker, round, cycle, predecessor, and operation count. Tabs: operation groups, operations by validation pass/kind, header roots/fitness, predecessor/successor context.
    Notes :: Level is the ergonomic selector, but hash remains a valid identity path. Operations need contentIndex because one operation hash can contain multiple contents.

  Entity TezosContract :: $network+address ; $network! $:TezosNetwork, address! p:str, scriptHash? p:hex, codeHash? p:hex, storageType? p:json, parameterType? p:json, $account? $:TezosAccount, $script? $:TezosMichelsonScript, $$entrypoints* $:TezosEntrypoint, $$bigMaps* $:TezosBigMap, $$operations* $:TezosOperation, $$timestamps* $:TezosContract_Timestamp
    Sources :: TezosNode_Rpc, Tzkt_Rest, BetterCallDev_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosContractView top `<dl>` shows contract address, script hash, code hash, script ref, latest balance, latest storage hash, and entrypoint count. Details tabs: Script -> TezosMichelsonScriptView; Entrypoints -> TezosEntrypointsView; Parameter/storage types -> decoded Michelson types; Big maps -> TezosBigMapsView; Operations -> TezosOperationsView; Storage history -> TezosContract_TimestampsView; Source evidence -> node/indexer payloads.
    Notes :: Originated contracts share the account address selector but need contract-specific script, parameter, and storage views. Reusable code identity belongs on TezosMichelsonScript; mutable storage remains on TezosContract_Timestamp.

  Entity TezosContract_Timestamp :: $contract+level+source ; $contract! $:TezosContract, level! p:bigint, source! p:str, timestampMs? p:num, balanceMutez? p:bigint, storageHash? p:hex, storage? p:json, delegate? p:str
    Sources :: TezosNode_Rpc, Tzkt_Rest, BetterCallDev_Rest, TezosDappetizer_Postgres
    View :: TezosContract_TimestampView top `<dl>` shows contract, level, source, balance, storage hash, and delegate. Details show decoded storage and source payload.
    Notes :: Contract storage is mutable by level. Keep storage snapshots separate from TezosContract identity.

  Entity TezosCycle :: $network+cycle ; $network! $:TezosNetwork, cycle! p:bigint, firstLevel? p:bigint, lastLevel? p:bigint, snapshotLevel? p:bigint, randomSeed? p:hex, $$bakerTimestamps* $:TezosBaker_Cycle_Timestamp
    Sources :: TezosNode_Rpc, Tzkt_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosCycleView top `<dl>` shows cycle, first/last level, snapshot level, random seed presence, and baker count. Tabs: bakers, rights, blocks, rewards/statistics, source evidence.
    Notes :: Cycles are protocol periods for rights/rewards. They are real modelable periods, not chart buckets.

  Entity TezosEntrypoint :: $contract+entrypointName ; $contract! $:TezosContract, entrypointName! p:str, parameterType? p:json, annotations* p:str
    Sources :: TezosNode_Rpc, Tzkt_Rest, BetterCallDev_Rest
    View :: TezosEntrypointView top `<dl>` shows contract, entrypoint name, annotation count, and parameter type summary. Details show decoded Michelson parameter type.
    Notes :: Entrypoints are contract interface surface, not execution history.

  Entity TezosInternalOperation :: $parentOperation+internalIndex ; $parentOperation! $:TezosOperation, internalIndex! p:num, operationKind! p:enum, sourceAddress? p:str, destinationAddress? p:str, amountMutez? p:bigint, nonce? p:num, parameters? p:json, resultStatus? p:enum, consumedGas? p:bigint
    Sources :: TezosNode_Rpc, Tzkt_Rest, BetterCallDev_Rest, TezosDappetizer_Postgres
    View :: TezosInternalOperationView top `<dl>` shows parent operation, internal index, kind, source, destination, amount, nonce, status, and consumed gas. Details show parameters/result evidence.
    Notes :: Internal operations are effects emitted during contract execution, not signed operation groups.

  Entity TezosMichelsonScript :: $network+scriptHash ; $network! $:TezosNetwork, scriptHash! p:hex, codeHash? p:hex, parameterType? p:json, storageType? p:json, code? p:json, micheline? p:json, michelson? p:str, tzip16MetadataUri? p:str, $$contracts* $:TezosContract, $$entrypoints* $:TezosEntrypoint
    Sources :: TezosNode_Rpc, Tzkt_Rest, BetterCallDev_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosMichelsonScriptView top `<dl>` shows network, script hash, code hash, parameter/storage type availability, TZIP-16 metadata URI, contract count, and entrypoint count. Details tabs: Contracts -> TezosContractsView using the script; Entrypoints -> TezosEntrypointsView; Code -> Micheline/Michelson code; Types -> parameter and storage type trees; Metadata -> TZIP-16 metadata source evidence.
    Notes :: Reusable Michelson script identity keyed by script hash/code evidence, not a contract label or explorer tag. Multiple contracts can share code; mutable storage remains on TezosContract_Timestamp and big-map rows.

  Entity TezosNetwork :: $network ; $network! $:Network, $$blocks* $:TezosBlock, $$operationGroups* $:TezosOperationGroup, $$operations* $:TezosOperation, $$accounts* $:TezosAccount, $$contracts* $:TezosContract, $$bakers* $:TezosBaker, $$cycles* $:TezosCycle, $$timestamps* $:TezosNetwork_Timestamp
    Sources :: TezosNode_Rpc, Tzkt_Rest, BetterCallDev_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosNetworkView top `<dl>` shows linked base Network, latest level, protocol hash, cycle, total supply, and indexer lag. Tabs: blocks, operation groups, operations, accounts, contracts, bakers, cycles, timestamp history.
    Notes :: Tezos protocol upgrades affect operation semantics and contract interpretation. Keep latest level/protocol observations on TezosNetwork_Timestamp.

  Entity TezosNetwork_Timestamp :: $network+timestampMs+source ; $network! $:TezosNetwork, timestampMs! p:num, source! p:str, latestLevel? p:bigint, protocolHash? p:hex, cycle? p:bigint, totalSupplyMutez? p:bigint, activeBakerCount? p:num, indexerLagBlocks? p:num
    Sources :: TezosNode_Rpc, Tzkt_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosNetwork_TimestampView top `<dl>` shows observed time/source, latest level, protocol hash, cycle, total supply, active baker count, and indexer lag. Details show source freshness.
    Notes :: Protocol hash and cycle are as-of network observations used to interpret operation and baking state.

  Entity TezosOperation :: $operationGroup+contentIndex ; $operationGroup! $:TezosOperationGroup, contentIndex! p:num, operationKind! p:enum, sourceAddress? p:str, destinationAddress? p:str, delegateAddress? p:str, contractAddress? p:str, counter? p:bigint, feeMutez? p:bigint, gasLimit? p:bigint, storageLimit? p:bigint, amountMutez? p:bigint, parameters? p:json, status? p:enum, consumedGas? p:bigint, storageSize? p:bigint, paidStorageSizeDiff? p:bigint, originatedContractAddresses* p:str, $block? $:TezosBlock, $$internalOperations* $:TezosInternalOperation, $$bigMapDiffs* $:TezosBigMapDiff
    Sources :: TezosNode_Rpc, Tzkt_Rest, BetterCallDev_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosOperationView top `<dl>` shows operation kind, operation hash/content index, status, source, destination/delegate/contract, counter, fee, and amount. Tabs: gas/storage/result, parameters, internal operations, big-map diffs, originated contracts, source evidence.
    Notes :: contentIndex is required to address manager-operation contents inside a single operation hash. Do not flatten operation groups into one row.

  Entity TezosOperationGroup :: $network+operationHash ; $network! $:TezosNetwork, operationHash! p:hex, $block? $:TezosBlock, branch? p:hex, signature? p:hex, validationPass? p:num, operationCount? p:num, $$operations* $:TezosOperation
    Sources :: TezosNode_Rpc, Tzkt_Rest, TezosDappetizer_Postgres, Conseil_Postgres
    View :: TezosOperationGroupView top `<dl>` shows operation hash, block, branch, signature presence, validation pass, and operation count. Tabs: operation contents, raw payload, source evidence.
    Notes :: Operation hash identifies the signed operation group. Individual contents still need TezosOperation rows because a group can contain multiple manager operations.

  Entity TokenMetadataDocument :: $assetInstance+metadataKey+timestampMs ; $assetInstance! $:AssetInstance, metadataKey! p:str, timestampMs! p:num, uri? p:url, contentHash? p:str, name? p:str, symbol? p:str, description? p:str, attributes? p:json, mutable? p:bool, metadataStandard? p:str, $object? $:AssetObject, $media? $:MediaObject, source? p:enum
    Sources :: Constants_Internal, Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Reservoir_Rest, OpenSea_Rest, Solana_JsonRpc, Helius_Rest, MetadataVision_Rest, Ipfs_Rest, Swarm_Rest, Lens_Graphql
    View :: TokenMetadataDocumentView top `<dl>` shows asset instance, object, metadata key, timestamp, URI, content hash, metadata standard, mutable flag, source, and media. Details tabs: Fields -> name/symbol/description/attributes; Media -> MediaObjectView; Object -> AssetObjectView; Raw document -> JSON/source payload; History -> sibling metadata observations.
    Notes :: Timestamped metadata observation. Metadata URI/content can be mutable, gateway-dependent, source-normalized, or token-list supplied, so identity stays asset/object selector plus metadata key and observation timestamp. Token-list rows and marketplace collection metadata are metadata claims, not asset identity.

  Entity TokenProgramExtension_Timestamp :: $assetInstance+extensionKind+extensionScope+timestampMs+source ; $assetInstance! $:AssetInstance, extensionKind! p:enum, extensionScope! p:enum, timestampMs! p:num, source! p:str, config? p:json, authoritySelector? p:json, ledgerCoordinateKind? p:enum, ledgerCoordinateValue? p:bigint
    Sources :: Solana_JsonRpc, Helius_Rest, MetaplexDAS_Rest, HederaMirrorNode_Rest, TronGrid_Rest, TronScan_Rest, Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Sourcify_Rest
    View :: TokenProgramExtension_TimestampView top `<dl>` shows asset instance, extension kind, scope, observation time, source, authority selector, ledger coordinate, and config summary. Details tabs: Asset -> AssetInstanceView; Config -> decoded extension config; Authority -> Account/EvmAccount/SolanaAccount when resolved; Source evidence -> raw mint/account/contract/metadata payload.
    Notes :: Timestamped observation for native token-program or contract-interface extensions whose configuration can change. Use this for SPL Token-2022 mint/account extensions, Metaplex metadata pointer/state, HTS token key/status fields when represented as extension config, and EVM interface/extension evidence when a source can prove support. Token-list labels and marketplace categories are metadata claims, not extension state.

  Entity TonAccount :: $network+address ; $network! $:TonNetwork, address! p:str, workchain? p:num, addressHash? p:hex, $$transactions* $:TonTransaction, $$messages* $:TonMessage, $$timestamps* $:TonAccount_Timestamp
    Sources :: TonLiteServer, Tonlib_JsonRpc, TonCenter_V2_Rest, TonCenter_V3_Rest, TonApi_Rest
    View :: TonAccountView top `<dl>` shows address, workchain, latest balance, latest status, last transaction lt, and contract/interface summary. Tabs: transactions, messages, contract, timestamp history, raw account-state evidence.
    Notes :: Account state may be nonexist, uninit, active, or frozen. Balance, code/data hashes, frozen state hashes, and last transaction pointers are timestamped account-state observations.

  Entity TonAccount_Timestamp :: $account+timestampMs+source ; $account! $:TonAccount, timestampMs! p:num, source! p:str, balanceNano? p:bigint, status? p:enum, codeHash? p:hex, dataHash? p:hex, stateHash? p:hex, frozenHash? p:hex, lastTransactionLt? p:bigint, lastTransactionHash? p:hex
    Sources :: TonLiteServer, Tonlib_JsonRpc, TonCenter_V2_Rest, TonCenter_V3_Rest, TonApi_Rest
    View :: TonAccount_TimestampView top `<dl>` shows observed time, source, balance, status, last transaction lt/hash, code hash, data hash, and state hash. Details show frozen-state hash and raw account-state evidence.
    Notes :: This is the account state snapshot row. It carries mutable balance and state hashes while TonAccount remains address identity.

  Entity TonBlock :: $network+workchain+shardPrefix+seqno | $network+rootHash+fileHash ; $network! $:TonNetwork, workchain! p:num, shardPrefix! p:str, seqno! p:bigint, rootHash? p:hex, fileHash? p:hex, genUtimeMs? p:num, startLt? p:bigint, endLt? p:bigint, minRefMcSeqno? p:bigint, $$transactions* $:TonTransaction, $$messages* $:TonMessage
    Sources :: TonLiteServer, Tonlib_JsonRpc, TonCenter_V2_Rest, TonCenter_V3_Rest, TonApi_Rest
    View :: TonBlockView top `<dl>` shows workchain, shard prefix, seqno, root hash, file hash, generated time, and logical-time range. Tabs: transactions, messages, neighboring shard/masterchain refs, raw proof/cell evidence.
    Notes :: The operational block selector is workchain + shard prefix + seqno. Root/file hashes are evidence and alternate lookup keys, not a replacement for shard coordinates.

  Entity TonContract :: $account ; $account! $:TonAccount, interfaceKind? p:enum, walletVersion? p:str, codeHash? p:hex, verifiedSourceUrl? p:url, verifiedAtMs? p:num, $$getMethods* $:TonContractGetMethod
    Sources :: TonApi_Rest, TonCenter_V3_Rest, TonVerifier_Rest, Tonviewer_Rest
    View :: TonContractView top `<dl>` shows account, interface kind, wallet version, latest code hash, verification status, and verified source URL. Tabs: linked account state, get methods, source verification, related messages, related transactions.
    Notes :: Contract identity is the account. Interface kind and wallet version are detected claims; code/data changes stay on TonAccount_Timestamp unless source verification proves a stable source relation.

  Entity TonContractGetMethod :: $contract+methodName ; $contract! $:TonContract, methodName! p:str, methodId? p:num, inputSchema? p:json, outputSchema? p:json, lastObservedExitCode? p:num
    Sources :: TonCenter_V2_Rest, TonCenter_V3_Rest, TonApi_Rest, TonVerifier_Rest
    View :: TonContractGetMethodView top `<dl>` shows contract, method name/id, last exit code, and schema availability. Details show input/output schema and latest invocation evidence.
    Notes :: Get methods are callable contract surface metadata, not transactions. Actual method results should be timestamped observations if modeled later.

  Entity TonMessage :: $network+messageHash | $sourceTransaction+outIndex ; $network! $:TonNetwork, messageHash? p:hex, $sourceTransaction? $:TonTransaction, outIndex? p:num, messageKind! p:enum, sourceAddress? p:str, destinationAddress? p:str, valueNano? p:bigint, createdLt? p:bigint, ihrDisabled? p:bool, bounce? p:bool, bounced? p:bool, opcode? p:num, bodyHash? p:hex, stateInitHash? p:hex, cell? p:json, $trace? $:TonTrace, $destinationTransaction? $:TonTransaction
    Sources :: TonLiteServer, Tonlib_JsonRpc, TonCenter_V2_Rest, TonCenter_V3_Rest, TonApi_Rest
    View :: TonMessageView top `<dl>` shows kind, source, destination, value, created lt, opcode, bounce flags, and hash. Tabs: body/cell, state init, source transaction, destination transaction, trace, proof evidence.
    Notes :: Internal, external-in, and external-out messages are first-class execution edges. Outbound external messages can behave like logs, but they remain messages rather than EVM-log entities.

  Entity TonNetwork :: $network ; $network! $:Network, $$workchains* $:TonWorkchain, $$blocks* $:TonBlock, $$transactions* $:TonTransaction, $$accounts* $:TonAccount, $$contracts* $:TonContract, $$messages* $:TonMessage, $$traces* $:TonTrace, $$timestamps* $:TonNetwork_Timestamp
    Sources :: TonCenter_V2_Rest, TonCenter_V3_Rest, TonApi_Rest, TonLiteServer, Tonlib_JsonRpc, Constants_Internal
    View :: TonNetworkView top `<dl>` shows linked base Network, masterchain workchain, latest observed masterchain seqno, latest shard count, and latest validator count. Tabs: workchains/shards, blocks, accounts, contracts, messages, traces, timestamp history.
    Notes :: TON is message-driven and dynamically sharded. The network row is stable identity only; mutable masterchain height, shard topology, validator counts, health, and indexer lag are TonNetwork_Timestamp observations.

  Entity TonNetwork_Timestamp :: $network+timestampMs+source ; $network! $:TonNetwork, timestampMs! p:num, source! p:str, masterchainSeqno? p:bigint, shardCount? p:num, validatorCount? p:num, latestBlockUtimeMs? p:num, indexerLagMs? p:num, health? p:enum
    Sources :: TonLiteServer, Tonlib_JsonRpc, TonCenter_V2_Rest, TonCenter_V3_Rest, TonApi_Rest
    View :: TonNetwork_TimestampView top `<dl>` shows observed time, source, masterchain seqno, shard count, validator count, indexer lag, and health. Details show source freshness and raw status payload.
    Notes :: Use this for as-of network observations. Do not put latest masterchain seqno, shard counts, or validator counts on TonNetwork.

  Entity TonShard_Timestamp :: $workchain+shardPrefix+seqno+source ; $workchain! $:TonWorkchain, shardPrefix! p:str, seqno! p:bigint, source! p:str, timestampMs? p:num, startLt? p:bigint, endLt? p:bigint, minRefMcSeqno? p:bigint, rootHash? p:hex, fileHash? p:hex
    Sources :: TonLiteServer, Tonlib_JsonRpc, TonCenter_V3_Rest, TonApi_Rest
    View :: TonShard_TimestampView top `<dl>` shows workchain, shard prefix, seqno, source, root hash, file hash, and logical-time range. Details show masterchain reference and raw block id evidence.
    Notes :: Shard topology changes by split/merge. Keep shard membership as a timestamped/block-scoped observation, not a stable child of TonNetwork.

  Entity TonTrace :: $network+traceId | $rootMessage ; $network! $:TonNetwork, traceId? p:str, $rootMessage? $:TonMessage, rootTransactionSelector? p:json, startedAtMs? p:num, status? p:enum, $$transactions* $:TonTransaction, $$messages* $:TonMessage
    Sources :: TonApi_Rest, TonCenter_V3_Rest, Tonviewer_Rest
    View :: TonTraceView top `<dl>` shows network, trace id/root message, start time, status, transaction count, and message count. Tabs: transaction DAG, message edges, root event, failures, source evidence.
    Notes :: A trace is a partially ordered message/transaction graph. It is real when an indexer or explorer exposes it, but it should not replace account-local transaction identity.

  Entity TonTransaction :: $account+lt | $account+lt+hash ; $account! $:TonAccount, lt! p:bigint, hash? p:hex, nowMs? p:num, origStatus? p:enum, endStatus? p:enum, transactionKind? p:enum, outMessageCount? p:num, totalFeesNano? p:bigint, previousTransactionHash? p:hex, previousTransactionLt? p:bigint, $block? $:TonBlock, $trace? $:TonTrace, $inMessage? $:TonMessage, $$outMessages* $:TonMessage, $$phases* $:TonTransactionPhase
    Sources :: TonLiteServer, Tonlib_JsonRpc, TonCenter_V2_Rest, TonCenter_V3_Rest, TonApi_Rest
    View :: TonTransactionView top `<dl>` shows account, lt, hash, time, original/end status, transaction kind, total fees, and block. Tabs: inbound message, outbound messages, execution phases, trace, previous transaction, raw cell/proof evidence.
    Notes :: TON transactions are account-local state transitions ordered by logical time. Account + lt is the domain selector; hash is evidence and indexer lookup data when available.

  Entity TonTransactionPhase :: $transaction+phaseKind ; $transaction! $:TonTransaction, phaseKind! p:enum, success? p:bool, exitCode? p:num, gasUsed? p:bigint, gasFeesNano? p:bigint, storageFeesNano? p:bigint, actionResultCode? p:num, skippedReason? p:enum, rawPhase? p:json
    Sources :: TonLiteServer, Tonlib_JsonRpc, TonCenter_V3_Rest, TonApi_Rest
    View :: TonTransactionPhaseView top `<dl>` shows transaction, phase kind, success, exit/action code, gas, and fees. Details show raw phase payload.
    Notes :: Compute, storage, credit, action, bounce, and aborted/skipped details are transaction phases, not separate protocol events.

  Entity TonWorkchain :: $network+workchain ; $network! $:TonNetwork, workchain! p:num, label? p:str, addressFormat? p:str, transactionFormat? p:str, virtualMachine? p:enum, $$shards* $:TonShard_Timestamp, $$blocks* $:TonBlock
    Sources :: TonLiteServer, Tonlib_JsonRpc, TonCenter_V3_Rest, TonApi_Rest
    View :: TonWorkchainView top `<dl>` shows network, workchain id, label, address format, transaction format, and VM. Tabs: shard history, blocks, accounts, messages.
    Notes :: Workchains are protocol identity, not an ecosystem label. Workchain -1 is the masterchain; workchain 0 is the common basechain, but both use the same entity shape.

  Entity TransferRestriction :: $assetInstance+restrictionKey+source ; $assetInstance! $:AssetInstance, restrictionKey! p:str, source! p:str, restrictionKind! p:enum, $profile? $:RegulatedAssetProfile, $account? $:Account, amount? p:bigint, message? p:str, ruleSelector? p:json, validFromMs? p:num, validToMs? p:num
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Sourcify_Rest, Solana_JsonRpc, Helius_Rest, Dune_Rest, Allium_Rest
    View :: TransferRestrictionView top `<dl>` shows asset instance, restriction key, source, restriction kind, profile, account, amount, message, rule selector, and validity window. Details tabs: Profile -> RegulatedAssetProfileView; Account -> AccountView when scoped; Evidence -> restriction check, transfer-hook account set, module config, or event payload.
    Notes :: Rule/evidence row anchored to one asset instance and source. Use it for ERC-1404 restriction codes/messages, ERC-3643 canTransfer/isVerified outcomes or module state, Token-2022 transfer-hook/non-transferable/pausable extension evidence, and explicit issuer registry restrictions. Broad risk labels, blacklist categories, and generic subject selectors remain source claims or profile notes unless a restriction check returns concrete rule state.

  Entity TronAccount :: $network+address ; $network! $:Network, address! p:str, name? p:str, balanceSun? p:bigint, createdTimestampMs? p:num, latestOperationTimestampMs? p:num, totalTransactionCount? p:num, bandwidthRemaining? p:bigint, energyRemaining? p:bigint, isContract? p:bool, $contract? $:TronContract, $$timestamps* $:TronAccount_Timestamp, $$tokens* $:TronToken, $$transactions* $:TronTransaction
    Sources :: TronScan_Rest, TronGrid_Rest, TronFullNode_Rest, TronSolidityNode_Rest
    View :: TronAccountView top `<dl>` shows network, address, name, latest balance in sun, creation/latest operation timestamps, transaction count, bandwidth/energy remaining, contract flag, contract ref, and latest observation time. Details tabs: State observations -> TronAccount_Timestamp list; Tokens -> TronToken list; Transactions -> TronTransaction list; Contract -> TronContractView when `isContract`; Network -> TronNetworkView.
    Notes :: TRON account rows are address-scoped public chain/indexer state, not wallet authority. Balances, resource limits/usage, latest operation time, and transaction counts are mutable observations from account/resource/indexer payloads; parent fields can expose latest convenience values, but history/source conflicts belong on TronAccount_Timestamp.

  Entity TronAccount_Timestamp :: $account+timestampMs+source ; $account! $:TronAccount, timestampMs! p:num, source! p:enum, blockHeight? p:bigint, balanceSun? p:bigint, createdTimestampMs? p:num, latestOperationTimestampMs? p:num, totalTransactionCount? p:num, freeNetUsed? p:bigint, freeNetLimit? p:bigint, netUsed? p:bigint, netLimit? p:bigint, energyUsed? p:bigint, energyLimit? p:bigint, tronPowerUsed? p:bigint, tronPowerLimit? p:bigint, isContract? p:bool
    Sources :: TronScan_Rest, TronGrid_Rest, TronFullNode_Rest, TronSolidityNode_Rest
    View :: TronAccount_TimestampView top `<dl>` shows account, observation time, source, block height, balance, transaction count, bandwidth usage/limit, energy usage/limit, TRON Power usage/limit, and contract flag. Details tabs: Account -> TronAccountView; Resources -> bandwidth, energy, TRON Power, and TRC-10 asset bandwidth maps when source-backed; Contract -> TronContractView when contract flag/ref exists; Source -> getaccount/getaccountresource/indexer payload freshness.
    Notes :: Bounded account/resource observation. TRON bandwidth, Energy, TRON Power, and balances change with transactions, staking, voting, and resource consumption; do not treat remaining resource fields as stable account identity.

  Entity TronBlock :: $network+height | $network+height+hash ; $network! $:Network, height! p:bigint, hash! p:str, $parent? $:TronBlock, parentHash? p:str, timestampMs? p:num, $witness? $:TronWitness, txTrieRoot? p:str, version? p:num, transactionCount? p:num, $$transactions* $:TronTransaction
    Sources :: TronScan_Rest, TronGrid_Rest, TronFullNode_Rest, TronSolidityNode_Rest
    View :: TronBlockView top `<dl>` shows network, height, hash, parent hash/ref, timestamp, witness, txTrieRoot, version, and transaction count. Details tabs: Transactions -> TronTransaction list; Parent -> TronBlockView; Witness -> TronWitnessView; Network -> TronNetworkView. TronBlocksView lists network-scoped blocks.
    Notes :: Height is the main chain coordinate and hash disambiguates source disagreement. Block transaction lists are node/indexer facets; do not model explorer pagination pages or "latest blocks" as entities.

  Entity TronContract :: $network+address ; $network! $:Network, address! p:str, $account? $:TronAccount, name? p:str, compiler? p:str, verifyStatus? p:str, isProxy? p:bool, $implementation? $:TronContract, $creator? $:TronAccount, $creationTransaction? $:TronTransaction, $$tokens* $:TronToken
    Sources :: TronScan_Rest
    View :: TronContractView top `<dl>` shows network, address, name, compiler, verification status, proxy state, account ref, implementation, creator, and creation transaction. Details tabs: Tokens -> TronToken list; Account -> TronAccountView; Implementation -> TronContractView; Creator -> TronAccountView; Creation transaction -> TronTransactionView.
    Notes :: Contract identity is the TVM account address on one network. Verification status, compiler, proxy detection, and token links are explorer/indexer claims; source-code bundles or ABI members should be modeled separately if added.

  Entity TronNetwork :: $network ; $network! $:Network, restEndpoints+ p:{url:url,transportType:enum,providerName:str}, $$timestamps* $:TronNetwork_Timestamp, $$blocks* $:TronBlock, $$witnesses* $:TronWitness
    Sources :: Constants_Internal, TronGrid_Rest
    View :: TronNetworkView top `<dl>` shows head block, environment, native asset count, and REST endpoint availability. Details tabs: TRON -> Blocks, Network snapshots, Witnesses, Endpoints; Assets -> Native coin; Resources -> Faucets, Block explorers.
    Notes :: Network identity is the parent Network ref plus TRON-specific source facets. Accounts, contracts, tokens, and transfers are real entities reached by their selectors or related rows, not network child lists unless a source exposes a bounded browse facet with count/pagination semantics.

  Entity TronNetwork_Timestamp :: $network+timestampMs ; $network! $:Network, timestampMs! p:num, latestBlockHeight? p:bigint, latestBlockHash? p:str, latestBlockTimeMs? p:num, latestBlockTransactionCount? p:num, witnessCount? p:num, activeWitnessCount? p:num, nodeBlockHeight? p:bigint, solidityBlockHeight? p:bigint, currentPeerCount? p:num, maintenanceIntervalMs? p:num, transactionFeeSun? p:bigint, createAccountFeeSun? p:bigint
    Sources :: TronGrid_Rest
    View :: TronNetwork_TimestampView top `<dl>` shows observation time, latest block height/hash/time/transaction count, witness and active witness counts, node and solidity heights, peer count, maintenance interval, transaction fee, and create-account fee. TronNetwork_TimestampsView lists latest/history under TronNetworkView snapshots.
    Notes :: Head, witness, peer, maintenance, and fee values are bounded source observations. Keep them off TronNetwork identity and avoid interpreting a TronGrid snapshot as global finality proof.

  Entity TronToken :: $network+tokenId ; $network! $:Network, tokenId! p:str, standard? p:enum, name? p:str, symbol? p:str, decimals? p:num, totalSupply? p:bigint, $owner? $:TronAccount, $contract? $:TronContract, createdTimestampMs? p:num, holderCount? p:num, $$timestamps* $:TronToken_Timestamp
    Sources :: TronScan_Rest
    View :: TronTokenView top `<dl>` shows network, token id, standard, name, symbol, decimals, latest total supply, owner, contract, creation timestamp, holder count, and latest observation time. Details tabs: Token observations -> TronToken_Timestamp list; Contract -> TronContractView when contract-backed; Owner -> TronAccountView; Transfers -> TronTokenTransfer list when scoped by transaction/account source context.
    Notes :: Token id is standard-dependent: contract address for TRC-20/721/1155-style tokens and TRC-10 id for TRC-10. Name/symbol/decimals are token metadata claims, while supply and holder count are mutable indexer/contract observations that belong on TronToken_Timestamp when comparing history or sources.

  Entity TronToken_Timestamp :: $token+timestampMs+source ; $token! $:TronToken, timestampMs! p:num, source! p:enum, blockHeight? p:bigint, totalSupply? p:bigint, holderCount? p:num, transferCount? p:num, contractVerified? p:bool
    Sources :: TronScan_Rest, TronGrid_Rest
    View :: TronToken_TimestampView top `<dl>` shows token, observation time, source, block height, total supply, holder count, transfer count, and contract verification flag. Details tabs: Token -> TronTokenView; Contract -> TronContractView when contract-backed; Source -> token overview/indexer payload freshness.
    Notes :: Timestamped token metric observation for mutable supply/count/indexer fields. Do not use holder count, transfer count, or explorer rankings as token identity.

  Entity TronTokenTransfer :: $network+transactionId+transferIndex ; $network! $:Network, transactionId! p:str, transferIndex! p:num, $transaction? $:TronTransaction, $token? $:TronToken, standard? p:enum, $from? $:TronAccount, $to? $:TronAccount, amount? p:bigint, timestampMs? p:num
    Sources :: TronScan_Rest, TronGrid_Rest
    View :: TronTokenTransferView top `<dl>` shows network, transaction id, transfer index, token, standard, from account, to account, amount, timestamp, and transaction ref. Details tabs: Transaction -> TronTransactionView; Token -> TronTokenView; From -> TronAccountView; To -> TronAccountView.
    Notes :: Transfer index is source/order context inside one transaction. Keep token transfer rows as indexed event projections; they do not replace the raw TronTransaction payload or prove complete account history unless the source facet states pagination coverage.

  Entity TronTransaction :: $network+transactionId ; $network! $:Network, transactionId! p:str, $block? $:TronBlock, blockHeight? p:bigint, timestampMs? p:num, expirationTimestampMs? p:num, contractType? p:str, result? p:str, feeSun? p:bigint, $owner? $:TronAccount, $to? $:TronAccount, $contract? $:TronContract, amountSun? p:bigint, assetName? p:str, rawDataHex? p:str, signatures* p:str, $receipt? $:TronTransactionReceipt, $$tokenTransfers* $:TronTokenTransfer
    Sources :: TronScan_Rest, TronGrid_Rest, TronFullNode_Rest, TronSolidityNode_Rest
    View :: TronTransactionView top `<dl>` shows network, transaction id, block ref/height, timestamp, expiration, contract type, result, fee, owner, recipient, contract, amount, asset name, raw data hash/hex summary, signature count, and receipt status. Details tabs: Receipt -> TronTransactionReceiptView; Token transfers -> TronTokenTransfer list; Block -> TronBlockView; Owner -> TronAccountView; Recipient -> TronAccountView; Contract -> TronContractView; Raw/signatures -> rawDataHex and signatures.
    Notes :: Transaction id is the stable selector for the signed TVM/chain transaction. Explorer fields and node raw payload fields are complementary; execution receipt, resource usage, logs, and internal transactions come from transaction-info sources and belong on TronTransactionReceipt or receipt children rather than the signed transaction identity.

  Entity TronTransactionReceipt :: $transaction ; $transaction! $:TronTransaction, feeSun? p:bigint, result? p:enum, resMessageHex? p:str, contractAddress? p:str, energyUsage? p:bigint, originEnergyUsage? p:bigint, energyUsageTotal? p:bigint, energyFeeSun? p:bigint, energyPenaltyTotal? p:bigint, netUsage? p:bigint, netFeeSun? p:bigint, logCount? p:num, internalTransactionCount? p:num, contractResultHex* p:str
    Sources :: TronScan_Rest, TronGrid_Rest, TronFullNode_Rest, TronSolidityNode_Rest
    View :: TronTransactionReceiptView top `<dl>` shows transaction, result, fee, contract address, energy usage, total energy, energy fee, net usage, net fee, log count, internal transaction count, and result-message status. Details tabs: Transaction -> TronTransactionView; Resource usage -> energy/net/fee fields; Logs -> event log summaries when decoded rows exist; Internal transactions -> internal transfer/call summaries when modeled; Contract result -> contractResultHex/resMessageHex payloads.
    Notes :: Execution receipt/resource row from gettransactioninfobyid and indexer transaction detail surfaces. Keep TVM event logs and internal transactions as receipt children if modeled; do not flatten resource usage or logs onto TronTransaction identity.

  Entity TronWitness :: $network+address ; $network! $:Network, address! p:str, url? p:url, voteCount? p:bigint, totalProduced? p:bigint, totalMissed? p:bigint, latestBlockHeight? p:bigint, latestSlotNumber? p:bigint, active? p:bool, $$timestamps* $:TronWitness_Timestamp
    Sources :: TronGrid_Rest
    View :: TronWitnessView top `<dl>` shows network, address, URL, latest vote count, produced/missed totals, latest block height, latest slot number, active state, and latest observation time. Details tabs: Witness observations -> TronWitness_Timestamp list; Produced blocks -> TronBlock list when source supports witness filtering; Network -> TronNetworkView. TronWitnessesView lists witnesses inside TronNetworkView.
    Notes :: Witness rows model TRON DPoS witness identity at an address. Vote count, production/miss totals, latest block/slot, and active state are mutable listwitnesses observations, so parent fields are latest convenience values and history belongs on TronWitness_Timestamp.

  Entity TronWitness_Timestamp :: $witness+timestampMs+source ; $witness! $:TronWitness, timestampMs! p:num, source! p:enum, voteCount? p:bigint, totalProduced? p:bigint, totalMissed? p:bigint, latestBlockHeight? p:bigint, latestSlotNumber? p:bigint, active? p:bool
    Sources :: TronGrid_Rest, TronFullNode_Rest, TronSolidityNode_Rest
    View :: TronWitness_TimestampView top `<dl>` shows witness, observation time, source, vote count, total produced, total missed, latest block height, latest slot number, and active state. Details tabs: Witness -> TronWitnessView; Network -> TronNetworkView; Source -> listwitnesses payload freshness.
    Notes :: Timestamped witness-set observation. Use it for mutable vote and production metrics; do not use latest vote counts as witness identity or governance history by themselves.

  Entity TrustedIssuer :: $profile+issuerKey ; $profile! $:RegulatedAssetProfile, issuerKey! p:str, issuerSelector! p:json, claimTopics* p:str
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Sourcify_Rest, Dune_Rest, Allium_Rest
    View :: TrustedIssuerView top `<dl>` shows regulated asset profile, issuer key, issuer selector, and accepted claim topics. Details tabs: Profile -> RegulatedAssetProfileView; Claim topics -> ClaimTopicRequirement list; Evidence -> registry call/event payload.
    Notes :: Child row for issuer authority in ERC-3643/T-REX trusted issuer registries or comparable issuer allow-list modules. This is not an issuer reputation score. The issuer selector should resolve to an account, contract, DID, or identity row once source evidence supports that identity.

  Entity Url :: url ; url! p:url, catalogName? p:str, catalogStandard? p:str, catalogIcon? p:url, openGraphTitle? p:str, openGraphDescription? p:str, publisher? p:str, $siteIcon? $:Media, $openGraphImage? $:Media
    Sources :: Constants_Internal, Chainlist_Rest, EthereumLists_Rest, Lifi_Rest, MetadataVision_Rest
    View :: UrlView top `<dl>` shows URL, publisher, catalog standard, and external link. Sections: Preview -> title, description, site icon, Open Graph image via MediaView; Catalog -> catalogName/catalogStandard/catalogIcon and source-specific registry context; Preview history -> UrlPreview_Timestamp list when retained. UrlsView renders lists and may disable enrichment for plain URL lists.
    Notes :: Ordinary URL identity row for catalog links and web-page previews. Keep URLs distinct from IPFS/Swarm content roots, contracts, event logs, and social posts. Open Graph values are mutable page-provided or extractor-provided display metadata, not proof of page ownership or stable content identity.

  Entity UrlPreview_Timestamp :: $url+timestampMs+source ; $url! $:Url, timestampMs! p:num, source! p:str, title? p:str, description? p:str, siteName? p:str, $image? $:MediaObject, previewStatus? p:enum
    Sources :: MetadataVision_Rest
    View :: UrlPreview_TimestampView top `<dl>` shows URL, timestamp, source, status, title, site name, and description. Sections: Image -> MediaObjectView for the preview image; History context -> sibling observations for the same Url sorted newest first; Raw preview -> extracted Open Graph/card payload when exposed.
    Notes :: Timestamped observation for mutable URL preview metadata. Use when preview freshness, conflicts between extractors, failed fetches, or historical changes matter; the stable Url row can still hold the latest convenient display fields.

  Entity UsageRight :: usageRightId ; usageRightId! p:str, $token! $:NftToken, $user? $:Account, userSelector? p:json, expiresAt? p:num, rightKind! p:enum
    Sources :: Voltaire_JsonRpc, Etherscan_Rest, Blockscout_Rest, Sourcify_Rest, Reservoir_Rest, OpenSea_Rest, Lens_Graphql, Local_Internal
    View :: UsageRightView top `<dl>` shows usage-right id, token, user/account selector, expiry, and right kind. Details tabs: Token -> NftTokenView; User -> Account/EvmAccount view when resolved; Source evidence -> contract call, event, license, or local entitlement record.
    Notes :: Rights/license row anchored to one NFT token and an explicit user/account selector for rental, delegation, media license, or local entitlement records. ERC-4907 user/expires state belongs here when source-backed. Do not use it for inferred viewer access, generic ownership, or app-local authorization unless the local record is the source.

  Entity UtxoAddress :: $network+address ; $network! $:Network, address! p:str, balanceSats? p:bigint, transactionCount? p:num, unspentOutputCount? p:num, totalReceivedSats? p:bigint, totalSpentSats? p:bigint
    Sources :: MempoolSpace_Rest, Blockchair_Rest, Esplora_Rest
    View :: UtxoAddressView top `<dl>` shows network, address, balance, transaction count, unspent output count, total received, and total spent. Details tabs: Outputs -> UtxoOutput list when source exposes spendable outputs; Transactions -> UtxoTransaction list when source exposes address history; Network -> NetworkView/UtxoNetworkView.
    Notes :: Address is a script/address-index projection over outputs, not an account model. Keep balances as source snapshots and avoid using address rows for wallet identity, ownership, or cross-chain account equivalence. Source support differs sharply: mempool.space exposes Bitcoin address stats/history, Esplora-style APIs can expose address UTXOs/transactions, and some node RPCs do not have an address index.

  Entity UtxoBlock :: $network+height | $network+height+hash ; $network! $:Network, height! p:bigint, hash! p:str, $parent? $:UtxoBlock, timestampMs? p:num, merkleRoot? p:str, nonce? p:num, difficulty? p:num, sizeBytes? p:num, weightUnits? p:num, transactionCount? p:num, $$transactions* $:UtxoTransaction
    Sources :: BitcoinCore_JsonRpc, LitecoinCore_JsonRpc, DogecoinCore_JsonRpc, BitcoinCashNode_JsonRpc, Zcashd_JsonRpc, MempoolSpace_Rest, Blockchair_Rest, Esplora_Rest
    View :: UtxoBlockView top `<dl>` shows network, height, hash, parent, timestamp, transaction count, size, and weight. Details tabs: Header -> merkle root, nonce, difficulty, size/weight; Transactions -> UtxoTransaction list; Parent -> parent UtxoBlockView; Network -> UtxoNetworkView. UtxoBlocksView lists recent blocks under UtxoNetworkView.
    Notes :: Shared Bitcoin-like block primitive for Bitcoin, Litecoin, Dogecoin, Bitcoin Cash, Zcash transparent chain, and Elements-style chains. Keep consensus-family extensions as fields only when they are common enough or hang chain-specific rows from the block/transaction layer; do not fork duplicate block entities per UTXO chain just because an explorer labels them differently.

  Entity UtxoInput :: $transaction+inputIndex ; $transaction! $:UtxoTransaction, inputIndex! p:num, $spentOutput? $:UtxoOutput, coinbaseScript? p:str, scriptSigAsm? p:str, sequence? p:num, witness* p:str
    Sources :: BitcoinCore_JsonRpc, LitecoinCore_JsonRpc, DogecoinCore_JsonRpc, BitcoinCashNode_JsonRpc, Zcashd_JsonRpc, MempoolSpace_Rest, Blockchair_Rest, Esplora_Rest
    View :: UtxoInputView top `<dl>` shows transaction, input index, spent output, coinbase/scriptSig summary, sequence, and witness count. Details tabs: Spent output -> UtxoOutputView when present; Script -> coinbase script, scriptSig asm, witness stack; Transaction -> parent UtxoTransactionView.
    Notes :: Coinbase inputs intentionally have no spent output. Witness is stack data, not an address or account field. Keep script interpretation as display/source payload until there is a real script/descriptor entity with stable selectors and resolver demand.

  Entity UtxoNetwork :: $network ; $network! $:Network, $$timestamps* $:UtxoNetwork_Timestamp, $$blocks* $:UtxoBlock, $$transactions* $:UtxoTransaction
    Sources :: Constants_Internal, BitcoinCore_JsonRpc, LitecoinCore_JsonRpc, DogecoinCore_JsonRpc, BitcoinCashNode_JsonRpc, Zcashd_JsonRpc, MempoolSpace_Rest, Blockchair_Rest, Esplora_Rest
    View :: UtxoNetworkView top `<dl>` shows network, best block, suggested fee, mempool transaction count, native asset, and chain family. Details tabs: Blocks -> UtxoBlocksView; Transactions -> UtxoTransactionsView; Mempool & fees -> UtxoNetwork_TimestampsView; Assets -> native coin plus Elements/CashToken facets when present; Resources -> explorers, faucets, RPC endpoints.
    Notes :: This is the shared projection for UTXO-family chains. Keep addresses reachable from output/address selectors rather than as a direct complete child list. Zcash transparent data, BCH CashTokens, and Elements confidential asset fields should extend transactions/outputs with refs, not create parallel base transaction models.

  Entity UtxoNetwork_Timestamp :: $network+timestampMs ; $network! $:Network, timestampMs! p:num, bestBlockHeight? p:bigint, bestBlockHash? p:str, bestBlockTimeMs? p:num, blockCount? p:bigint, transactionCount? p:bigint, blocks24h? p:num, transactions24h? p:num, mempoolTransactionCount? p:num, mempoolSizeBytes? p:bigint, mempoolTps? p:num, averageTransactionFee24hSats? p:bigint, medianTransactionFee24hSats? p:bigint, suggestedTransactionFeePerByteSats? p:num, blockchainSizeBytes? p:bigint
    Sources :: BitcoinCore_JsonRpc, LitecoinCore_JsonRpc, DogecoinCore_JsonRpc, BitcoinCashNode_JsonRpc, Zcashd_JsonRpc, MempoolSpace_Rest, Blockchair_Rest, Esplora_Rest
    View :: UtxoNetwork_TimestampView top `<dl>` shows timestamp, best block height/hash, mempool transaction count, mempool size, and suggested fee. Details tabs: Head -> best block time/hash; Chain totals -> block count, transaction count, chain size; Recent activity -> 24h block/transaction counts; Mempool -> count, bytes, TPS, suggested fee; Fee summary -> average/median 24h fees. UtxoNetwork_TimestampsView lists snapshots under the Mempool & fees tab.
    Notes :: Timestamp row is for observed network state, mempool, fee, and chain-total snapshots. Do not put volatile mempool counts or suggested fees on UtxoNetwork. Blockchair and mempool.space disagree in methodology and freshness, so keep provider conflicts visible through source evidence and timestamp/feed selection rather than overwriting as canonical truth.

  Entity UtxoOutput :: $transaction+outputIndex ; $transaction! $:UtxoTransaction, outputIndex! p:num, valueSats? p:bigint, scriptPubKeyAsm? p:str, scriptPubKeyHex? p:str, scriptPubKeyType? p:str, $address? $:UtxoAddress, $elementsAsset? $:ElementsAsset, assetCommitment? p:str, valueCommitment? p:str, nonceCommitment? p:str, surjectionProof? p:str, rangeProof? p:str, isConfidential? p:bool, isSpent? p:bool, $bitcoinCashCashTokenFungibleAmount? $:BitcoinCashCashTokenFungibleAmount, $bitcoinCashCashTokenNft? $:BitcoinCashCashTokenNft
    Sources :: BitcoinCore_JsonRpc, LitecoinCore_JsonRpc, DogecoinCore_JsonRpc, BitcoinCashNode_JsonRpc, Zcashd_JsonRpc, MempoolSpace_Rest, Blockchair_Rest, Esplora_Rest
    View :: UtxoOutputView top `<dl>` shows transaction, output index, value, address, script pubkey type, spent state, and chain-specific asset/token indicators. Details tabs: Script -> script pubkey asm/hex/type; Address -> UtxoAddressView; Elements -> ElementsAssetView, asset/value/nonce commitments, surjection proof, range proof, confidential flag; CashTokens -> fungible amount and NFT views; Transaction -> parent UtxoTransactionView.
    Notes :: Output is the shared place for spendable value, script locking data, and UTXO-family asset extensions. Elements/Liquid commitments and BCH CashTokens are output-attached facets. Spent state is source-indexed and time-sensitive; historical spend linkage can later become a timestamped observation or explicit spending-input relation if UI needs provenance over time.

  Entity UtxoTransaction :: $network+txId ; $network! $:Network, txId! p:str, $block? $:UtxoBlock, version? p:num, lockTime? p:num, sizeBytes? p:num, virtualSizeBytes? p:num, weightUnits? p:num, feeSats? p:bigint, isCoinbase? p:bool, $$inputs* $:UtxoInput, $$outputs* $:UtxoOutput, $$zcashShieldedActions* $:ZcashShieldedAction
    Sources :: BitcoinCore_JsonRpc, LitecoinCore_JsonRpc, DogecoinCore_JsonRpc, BitcoinCashNode_JsonRpc, Zcashd_JsonRpc, MempoolSpace_Rest, Blockchair_Rest, Esplora_Rest
    View :: UtxoTransactionView top `<dl>` shows network, tx id, block, version, fee, size/vsize/weight, lock time, and coinbase flag. Details tabs: Inputs -> UtxoInput list; Outputs -> UtxoOutput list; Block -> UtxoBlockView when confirmed; Shielded actions -> ZcashShieldedAction list when present; Raw/source -> source payload fields useful for debugging resolver conflicts.
    Notes :: Generic UTXO transaction should stay broad enough for Bitcoin-like transparent transactions while letting chain-specific facets attach through child rows. Mempool membership is not a separate transaction identity; expose it via UtxoNetwork_Timestamp/mempool lists unless a future source provides durable mempool-entry observations with timestamps.

  Entity Vault :: $network+id ; $network! $:EvmNetwork, id! p:str
    Sources :: Constants_Internal
    View :: VaultView top `<dl>` shows network and truncated vault id. Details tabs: Network -> EvmNetworkView; Positions -> linked vault positions when modeled; Strategy/assets -> concrete asset or protocol rows only when a source exposes them.
    Notes :: Registered vault identity row with no populated vault catalog today. Keep it for actual vault-like asset containers, not DEX pairs, generic accounts, strategy labels, or route tabs.

  Entity VerificationResult :: verificationId ; verificationId! p:str, verificationKind! p:enum, verifier! p:str, status! p:enum, timestampMs! p:num, subjectEntityType? p:str, subjectSelectorHash? p:str, subjectSelector? p:json, evidenceUrl? p:url, $specificationProposal? $:SpecificationProposal
    Sources :: Local_Internal
    View :: VerificationResultView top `<dl>` shows verification kind, status, verifier, subject entity type, selector hash, evidence URL, specification proposal, and verification time. Details tabs: Subject -> subject selector JSON; Evidence -> local verifier output or evidence URL; Specification -> SpecificationProposalView when linked.
    Notes :: Local verifier-run artifact for cases where a check has its own lifecycle and evidence. Ordinary source labels, API claims, incident facts, catalog assertions, and contract source verification already modeled by EvmContractSourceBundle should stay on their domain rows.

  Entity XmtpConversation :: id ; id! p:str, peerInboxId? p:str, topic? p:str, createdAtMs? p:num, consentState? p:enum
    Sources :: Local_Internal
    View :: XmtpConversationView top `<dl>` shows topic or peer inbox or id, consent state, peer inbox id, topic, and created timestamp. Details tabs: Network -> XmtpNetworkView; Messages -> XmtpMessage list when a live/local message source exists; Participants -> inbox identities/installations when modeled.
    Notes :: Local conversation stub, not a transcript or live XMTP thread. Keep inboxes, epochs, messages, sender identities, encryption state, and delivery status as separate rows only after a concrete XMTP client/source exposes them.

  Entity XmtpNetwork :: scope ; scope! p:str, protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str, $$xmtpConversations* $:XmtpConversation
    Sources :: Constants_Internal, Local_Internal
    View :: XmtpView top `<dl>` shows protocol metadata, registry label, topology, home/docs URLs, and local conversation count. Details tabs: Conversations -> XmtpConversationsView; Demo accounts -> generic EVM actor examples; Source coverage -> constants and local catalog state.
    Notes :: Current XMTP support is a local catalog/demo surface, not a live XMTP client. Demo accounts are generic local EVM actors and must not be interpreted as XMTP inbox IDs, identities, installations, or delivery participants.

  Entity XNetwork :: scope ; scope! p:"XNetwork", protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str, $$xUsers* $:XUser, $$xPosts* $:XPost
    Sources :: Constants_Internal, X_Rest, X_FxEmbed_Rest
    View :: XView top `<dl>` shows profile/post counts, protocol name, registry label, topology, home URL, docs URL, and source coverage. Details tabs: Profiles -> XUsersView; Recent posts -> XPostsView; Examples -> stable user/post route links as seed navigation only.
    Notes :: This is the public X/Twitter network hub, not a generic social abstraction. API entitlement, search windows, and rate limits are source behavior; the schema rows stay stable public profile/post shapes keyed by X ids and handles.

  Entity XPost :: id ; id! p:str, $author? $:XUser, text? p:str, createdAt? p:num, conversationId? p:str, $replyToPost? $:XPost, $quotedPost? $:XPost, postUrl? p:url, $$media* $:Media, $$timestamps* $:XPost_Timestamp
    Sources :: Constants_Internal, X_Rest, X_FxEmbed_Rest
    View :: XPostView top `<dl>` shows post id, text, created time, author, conversation id, reply/quote refs, post URL, media attachments, and latest like/repost/reply/quote snapshot. Details tabs: Thread refs -> reply/quote/conversation facets; Author -> XUserView; Media -> media list; Metric snapshots -> XPost_TimestampsView.
    Notes :: `id` is the stable X post id. Text, createdAt, author, reply/quote refs, and conversationId are post payload facts; engagement counters are timestamp rows. Conversation id is a thread grouping field, not a separate entity until conversation/source pagination has independent lifecycle and a real view.

  Entity XPost_Timestamp :: $post+timestampMs ; $post! $:XPost, timestampMs! p:num, likeCount? p:num, retweetCount? p:num, replyCount? p:num, quoteCount? p:num
    Sources :: X_Rest, X_FxEmbed_Rest
    View :: XPost_TimestampView top `<dl>` shows post, observation time, likes, reposts, replies, and quotes. XPostView shows latest counters and history through XPost_TimestampsView.
    Notes :: Engagement counters are mutable observations of a post at a source clock, not fields on `XPost` itself. Keep repost naming mapped to retweetCount for schema stability while views can label it “Reposts.”

  Entity XrplAccount :: $network+account ; $network! $:XrplNetwork, account! p:str, $$ledgerEntries* $:XrplLedgerEntry, $$transactions* $:XrplTransaction, $$trustlines* $:XrplTrustline, $$timestamps* $:XrplAccount_Timestamp
    Sources :: Xrpl_Rippled, XrplClio_Rest, XrpScan_Rest, Bithomp_Rest
    View :: XrplAccountView top `<dl>` shows classic address and latest XRP balance/owner count/sequence snapshot. Details tabs: Ledger entries -> XrplLedgerEntriesView; Transactions -> XrplTransactionsView; Trust lines -> XrplTrustlinesView; Account snapshots -> XrplAccount_TimestampsView.
    Notes :: XRP balance and owner reserve are ledger-state snapshots, so they belong in XrplAccount_Timestamp rather than the stable account identity row.

  Entity XrplAccount_Timestamp :: $account+timestampMs+source ; $account! $:XrplAccount, timestampMs! p:num, source! p:str, ledgerIndex? p:bigint, balanceDrops? p:bigint, ownerCount? p:num, sequence? p:num, flags? p:json
    Sources :: Xrpl_Rippled, XrplClio_Rest, XrpScan_Rest, Bithomp_Rest
    View :: XrplAccount_TimestampView top `<dl>` shows account balance, owner count, sequence, flags, ledger index, source, and observation time; XrplAccountView shows latest/history.
    Notes :: XRP balance, sequence, flags, and owner count change with ledger state and must not live on XrplAccount identity.

  Entity XrplAmendment :: $network+amendmentId ; $network! $:XrplNetwork, amendmentId! p:hex, name? p:str, status! p:enum, enabledAtLedger? p:bigint
    Sources :: Xrpl_Rippled, XrplClio_Rest
    View :: XrplAmendmentView top `<dl>` shows amendment id, name, status, enabled ledger, and docs link. Details show voting/support evidence only when a source exposes validator support.
    Notes :: Amendments are protocol feature gates. Status is network/source scoped because proposed/enabled/vetoed states depend on validator voting and ledger activation.

  Entity XrplAmm :: $network+ammAccount ; $network! $:XrplNetwork, ammAccount! p:str, assetCurrency! p:str, assetIssuer? p:str, asset2Currency! p:str, asset2Issuer? p:str, tradingFee? p:num, lpTokenCurrency? p:str, $ledgerEntry? $:XrplLedgerEntry, $$timestamps* $:XrplAmm_Timestamp
    Sources :: Xrpl_Rippled, XrplClio_Rest, XrpScan_Rest, Bithomp_Rest
    View :: XrplAmmView top `<dl>` shows AMM account, asset pair, trading fee, LP token currency, ledger-entry ref, and latest reserve snapshot. Details tabs: Snapshots -> XrplAmm_TimestampsView; Ledger entry -> XrplLedgerEntryView; Transactions -> XrplTransactionsView for AMMCreate/AMMDeposit/AMMWithdraw/AMMVote/AMMBid; Trust lines -> XrplTrustlinesView for LP token holders when indexed.
    Notes :: XRPL AMM identity is the special AMM AccountRoot / AMM ledger object for an asset pair. Reserves, auction slot, LP supply, and vote-derived fee state are ledger observations and belong on XrplAmm_Timestamp.

  Entity XrplAmm_Timestamp :: $amm+timestampMs+source ; $amm! $:XrplAmm, timestampMs! p:num, source! p:str, ledgerIndex? p:bigint, assetAmount? p:str, asset2Amount? p:str, lpTokenBalance? p:str, tradingFee? p:num, auctionSlot? p:json, voteSlots? p:json
    Sources :: Xrpl_Rippled, XrplClio_Rest, XrpScan_Rest, Bithomp_Rest
    View :: XrplAmm_TimestampView top `<dl>` shows AMM, observation time, source, ledger index, asset reserves, LP token balance, trading fee, auction slot, and vote slot summary. Details tabs: AMM -> XrplAmmView; Ledger -> XrplLedgerView; Auction/votes -> decoded auctionSlot and voteSlots; Source evidence -> amm_info/indexer payload.
    Notes :: AMM reserves and fee/auction/vote state are ledger-indexed observations. Keep amounts as strings because XRP drops and issued-currency decimal values use different XRPL amount encodings.

  Entity XrplLedger :: $network+ledgerIndex | $network+ledgerHash ; $network! $:XrplNetwork, ledgerIndex? p:bigint, ledgerHash? p:hex, closeTimeMs? p:num, validated? p:bool, totalCoinsDrops? p:bigint, parentHash? p:hex, accountHash? p:hex, transactionHash? p:hex, $$transactions* $:XrplTransaction, $$ledgerEntries* $:XrplLedgerEntry
    Sources :: Xrpl_Rippled, XrplClio_Rest, XrpScan_Rest, Bithomp_Rest
    View :: XrplLedgerView top `<dl>` shows ledger index/hash, validation state, close time, parent hash, total XRP drops, account hash, and transaction hash. Details tabs: Transactions -> XrplTransactionsView; Ledger entries -> XrplLedgerEntriesView.
    Notes :: Use ledger index or hash selectors because XRPL supports both. `totalCoins` is XRP drops in ledger metadata, not issued asset supply.

  Entity XrplLedgerEntry :: $network+ledgerIndex+entryHash | $network+ledgerHash+entryHash ; $network! $:XrplNetwork, ledgerIndex? p:bigint, ledgerHash? p:hex, entryHash! p:hex, entryType! p:enum, account? p:str, previousTransactionHash? p:hex, previousTransactionLedgerIndex? p:bigint, fields? p:json
    Sources :: Xrpl_Rippled, XrplClio_Rest, XrpScan_Rest, Bithomp_Rest
    View :: XrplLedgerEntryView top `<dl>` shows entry type, entry hash, ledger coordinate, account, previous transaction hash/index, and changed-by transaction links. Details show raw fields and type-specific rendered panels when implemented.
    Notes :: Ledger entries are keyed by XRPL ledger object ids/hashes, not by source array position. AccountRoot, RippleState, Offer, Escrow, PayChannel, Check, NFT pages, and other native object types should stay in `fields` until a type-specific row has stable selectors and a view; AMM objects can link to XrplAmm when the AMM account or asset pair is resolved.

  Entity XrplNetwork :: $network ; $network! $:Network, $$ledgers* $:XrplLedger, $$transactions* $:XrplTransaction, $$accounts* $:XrplAccount, $$ledgerEntries* $:XrplLedgerEntry, $$amendments* $:XrplAmendment, $$amms* $:XrplAmm, $$timestamps* $:XrplNetwork_Timestamp
    Sources :: Xrpl_Rippled, XrplClio_Rest, XrpScan_Rest, Bithomp_Rest, Constants_Internal
    View :: XrplNetworkView top `<dl>` shows linked Network, latest validated ledger/range snapshot, load factor, peer count, and native XRP asset. Details use `CollapsibleTabs`: Ledgers -> XrplLedgersView; Transactions -> XrplTransactionsView; Accounts -> XrplAccountsView; Ledger entries -> XrplLedgerEntriesView; Amendments -> XrplAmendmentsView; AMMs -> XrplAmmsView; Network snapshots -> XrplNetwork_TimestampsView.
    Notes :: XRPL is ledger-state/account-line based, not UTXO or EVM account/state. Keep issued-currency trust lines and ledger objects explicit instead of flattening them into generic balances.

  Entity XrplNetwork_Timestamp :: $network+timestampMs+source ; $network! $:XrplNetwork, timestampMs! p:num, source! p:str, validatedLedgerIndex? p:bigint, completeLedgers? p:str, loadFactor? p:num, peerCount? p:num
    Sources :: Xrpl_Rippled, XrplClio_Rest, XrpScan_Rest
    View :: XrplNetwork_TimestampView top `<dl>` shows validated ledger, complete ledger range, load factor, peer count, source, and observation time; XrplNetworkView shows latest/history.
    Notes :: Node health and validated range are endpoint observations, not network identity.

  Entity XrplTransaction :: $network+hash ; $network! $:XrplNetwork, hash! p:hex, transactionType! p:enum, account! p:str, sequence? p:num, ledgerIndex? p:bigint, fee? p:bigint, status? p:enum, meta? p:json, $$affectedEntries* $:XrplLedgerEntry
    Sources :: Xrpl_Rippled, XrplClio_Rest, XrpScan_Rest, Bithomp_Rest
    View :: XrplTransactionView top `<dl>` shows hash, transaction type, account, sequence, ledger index, fee drops, and result/status. Details tabs: Affected ledger entries -> XrplLedgerEntriesView from metadata `AffectedNodes`; Metadata -> raw metadata/result inspector.
    Notes :: Transaction `meta` is essential for delivered amount and ledger object changes. Do not infer balance changes from transaction type alone.

  Entity XrplTrustline :: $network+account+currency+issuer ; $network! $:XrplNetwork, account! p:str, currency! p:str, issuer! p:str, $account? $:XrplAccount, $issuerAccount? $:XrplAccount, $$timestamps* $:XrplTrustline_Timestamp
    Sources :: Xrpl_Rippled, XrplClio_Rest, XrpScan_Rest, Bithomp_Rest
    View :: XrplTrustlineView top `<dl>` shows account, currency, issuer, latest balance/limit flags, and account/issuer links. Details tabs: Snapshots -> XrplTrustline_TimestampsView; Ledger entry -> XrplLedgerEntryView when the RippleState object id is known.
    Notes :: Issued currencies are represented by bilateral RippleState trust lines. Balance and limits are mutable ledger state, so they belong in timestamp rows.

  Entity XrplTrustline_Timestamp :: $trustline+timestampMs+source ; $trustline! $:XrplTrustline, timestampMs! p:num, source! p:str, ledgerIndex? p:bigint, balance? p:str, limit? p:str, limitPeer? p:str, noRipple? p:bool, noRipplePeer? p:bool, authorized? p:bool, peerAuthorized? p:bool
    Sources :: Xrpl_Rippled, XrplClio_Rest, XrpScan_Rest, Bithomp_Rest
    View :: XrplTrustline_TimestampView top `<dl>` shows balance, limits, no-ripple/authorization flags, ledger index, source, and observation time; XrplTrustlineView shows latest/history.
    Notes :: Use strings for issued currency amounts because XRPL decimal precision and currency code formats are protocol-specific.

  Entity XUser :: id | username ; id! p:str, username! p:str, name? p:str, description? p:str, verified? p:bool, createdAt? p:num, location? p:str, websiteUrl? p:url, $icon? $:Media, $profileBanner? $:Media, $$timestamps* $:XUser_Timestamp, $$posts* $:XPost
    Sources :: X_Rest, X_FxEmbed_Rest
    View :: XUserView top `<dl>` shows id, username, name, description, verified state, created date, location, website URL, icon, profile banner, and latest follower/following/post/listed snapshot. Details tabs: Profile -> full mutable profile fields and media; Posts -> XPostsView; Metric snapshots -> XUser_TimestampsView.
    Notes :: User id and username are separate selectors because both can address the same profile, but id is the stronger stable identity when the source returns it. Handles, names, bios, locations, website URLs, icons, and banners are mutable profile metadata; follower/following/tweet/listed counts stay timestamped.

  Entity XUser_Timestamp :: $user+timestampMs ; $user! $:XUser, timestampMs! p:num, followerCount? p:num, followingCount? p:num, tweetCount? p:num, listedCount? p:num
    Sources :: X_Rest, X_FxEmbed_Rest
    View :: XUser_TimestampView top `<dl>` shows user, observation time, followers, following, posts, and listed count. XUserView shows latest counters and history through XUser_TimestampsView.
    Notes :: These are observed mutable counters. Do not fold them into `XUser`, rank users by them as ontology, or assume X_Rest and FxEmbed snapshots share an exact clock.

  Entity YouTubeChannel :: channelId ; channelId! p:str, title? p:str, description? p:str, $$timestamps* $:YouTubeChannel_Timestamp, publishedAt? p:str, publishedAtMs? p:num, customUrl? p:str, $icon? $:Media, $$videos* $:YouTubeVideo, $$playlists* $:YouTubePlaylist
    Sources :: Youtube_Rest, Piped_Rest
    View :: YouTubeChannelView top `<dl>` shows channel id, title, description, custom URL, published date, icon, and latest subscriber/video/view snapshot. Details tabs: Videos -> YouTubeVideosView; Playlists -> YouTubePlaylistsView; Metric snapshots -> YouTubeChannel_TimestampsView.
    Notes :: `channelId` is the stable opaque channel selector. Custom URLs and @handle-style strings are mutable aliases/metadata, not selectors unless a resolver explicitly normalizes them to channel ids. Uploads, liked videos, trending appearances, and search results are discovery/list facets, not channel identity.

  Entity YouTubeChannel_Timestamp :: $channel+timestampMs ; $channel! $:YouTubeChannel, timestampMs! p:num, subscriberCount? p:num, videoCount? p:num, viewCount? p:num
    Sources :: Youtube_Rest, Piped_Rest
    View :: YouTubeChannel_TimestampView top `<dl>` shows channel, observation time, subscriber count, public video count, and aggregate view count. YouTubeChannelView shows latest counters and history through YouTubeChannel_TimestampsView.
    Notes :: Channel counters are source/time observations. Subscriber counts may be rounded or hidden and source freshness can differ, so keep counters off `YouTubeChannel`.

  Entity YouTubeComment :: videoId+commentId ; videoId! p:str, commentId! p:str, text? p:str, authorDisplayName? p:str, authorChannelId? p:str, $author? $:YouTubeChannel, $$timestamps* $:YouTubeComment_Timestamp, publishedAt? p:str, publishedAtMs? p:num, $video? $:YouTubeVideo, $parentComment? $:YouTubeComment, $$replies* $:YouTubeComment
    Sources :: Youtube_Rest, Piped_Rest
    View :: YouTubeCommentView top `<dl>` shows video id, comment id, text, author display name/channel, published date, video ref, parent comment ref, and latest like/reply snapshot. Details tabs: Replies -> YouTubeCommentsView; Author -> YouTubeChannelView; Video -> YouTubeVideoView; Metric snapshots -> YouTubeComment_TimestampsView.
    Notes :: Comment ids are video-scoped in the selector because comment APIs and embedded clients address them through a video/thread context. Author display name is mutable source text; `$author` is only set when a channel id is resolved. Reply count is an observation and does not prove all replies were paginated.

  Entity YouTubeComment_Timestamp :: $comment+timestampMs ; $comment! $:YouTubeComment, timestampMs! p:num, likeCount? p:num, replyCount? p:num
    Sources :: Youtube_Rest, Piped_Rest
    View :: YouTubeComment_TimestampView top `<dl>` shows comment, observation time, like count, and reply count. YouTubeCommentView shows latest counters and history through YouTubeComment_TimestampsView.
    Notes :: Comment counters are source/time observations. Keep reply count separate from actual `$$replies` rows, which depend on resolver pagination and source support.

  Entity YouTubeNetwork :: scope ; scope! p:str, protocolName! p:str, homeUrl! p:url, docsUrl? p:url, registryLabel! p:str, topology! p:str, $$youtubeChannels* $:YouTubeChannel, $$youtubeVideos* $:YouTubeVideo, $$youtubePlaylists* $:YouTubePlaylist
    Sources :: Constants_Internal, Youtube_Rest, Piped_Rest
    View :: YouTubeView top `<dl>` shows protocol name, registry label, topology, home/docs URLs, and source coverage. Details tabs: Channels -> YouTubeChannelsView; Videos -> YouTubeVideosView; Playlists -> YouTubePlaylistsView.
    Notes :: This is the configured YouTube/Piped network hub, not a generic video platform ontology. Trending, search, curated seeds, and upload playlists are list scopes for videos/channels/playlists and should not become entity types.

  Entity YouTubePlaylist :: playlistId ; playlistId! p:str, title? p:str, description? p:str, $$timestamps* $:YouTubePlaylist_Timestamp, publishedAt? p:str, publishedAtMs? p:num, $channel? $:YouTubeChannel, $$videos* $:YouTubeVideo
    Sources :: Youtube_Rest, Piped_Rest
    View :: YouTubePlaylistView top `<dl>` shows playlist id, title, description, channel, published date, and latest item-count snapshot. Details tabs: Videos -> YouTubeVideosView; Channel -> YouTubeChannelView; Metric snapshots -> YouTubePlaylist_TimestampsView.
    Notes :: Playlist ids are opaque YouTube identifiers such as `PL...` or upload playlist ids. Treat the playlist as a curation/list entity, not a video or channel alias. Piped backs playlist detail and channel-scoped playlists, but not the network playlist carousel.

  Entity YouTubePlaylist_Timestamp :: $playlist+timestampMs ; $playlist! $:YouTubePlaylist, timestampMs! p:num, itemCount? p:num
    Sources :: Youtube_Rest, Piped_Rest
    View :: YouTubePlaylist_TimestampView top `<dl>` shows playlist, observation time, and item count. YouTubePlaylistView shows latest count and history through YouTubePlaylist_TimestampsView.
    Notes :: Playlist item count is mutable curation state. Keep it timestamped rather than storing it on the playlist identity row.

  Entity YouTubeVideo :: videoId ; videoId! p:str, title? p:str, description? p:str, publishedAt? p:str, publishedAtMs? p:num, durationSeconds? p:num, $$timestamps* $:YouTubeVideo_Timestamp, categoryId? p:str, liveBroadcastContent? p:enum, tags? p:str[], $author? $:YouTubeChannel, thumbnailUrl? p:url, $$comments* $:YouTubeComment
    Sources :: Youtube_Rest, Piped_Rest
    View :: YouTubeVideoView top `<dl>` shows video id, title, description, published date, duration, category id, live-broadcast state, tags, thumbnail, author channel, and latest view/like/comment snapshot. Details tabs: Comments -> YouTubeCommentsView; Author -> YouTubeChannelView; Metric snapshots -> YouTubeVideo_TimestampsView.
    Notes :: `videoId` is the stable watch key. Publication date, live-broadcast state, tags, thumbnail, and description are mutable source metadata; counters belong on timestamp rows. Playlist membership is list context and should not be stored as video identity.

  Entity YouTubeVideo_Timestamp :: $video+timestampMs ; $video! $:YouTubeVideo, timestampMs! p:num, viewCount? p:num, likeCount? p:num, commentCount? p:num
    Sources :: Youtube_Rest, Piped_Rest
    View :: YouTubeVideo_TimestampView top `<dl>` shows video, observation time, view count, like count, and comment count. YouTubeVideoView shows latest counters and history through YouTubeVideo_TimestampsView.
    Notes :: Video counters are observations and may be hidden, rounded, delayed, or unavailable by source. Do not persist them on `YouTubeVideo`, and do not infer counter support from source support for video metadata.

  Entity ZcashShieldedAction :: $transaction+pool+actionKind+actionIndex ; $transaction! $:UtxoTransaction, pool! p:enum, actionKind! p:enum, actionIndex! p:num, $pool? $:ZcashShieldedPool, nullifier? p:str, noteCommitment? p:str, valueCommitment? p:str
    Sources :: Zcashd_JsonRpc, Zebra_JsonRpc
    View :: ZcashShieldedActionView top `<dl>` shows transaction, pool, action kind, action index, pool ref, nullifier, note commitment, and value commitment. Details tabs: Transaction -> UtxoTransactionView; Pool -> ZcashShieldedPoolView; Public action data -> nullifier/note/value commitments; Local note match -> BlockheadZcashNoteState when wallet scanning links the action.
    Notes :: Public shielded-action projection from Sapling spends/outputs and Orchard actions. Nullifiers, note commitments, and value commitments are consensus-visible, but note value, memo, recipient, and ownership require viewing keys and belong in BlockheadZcashNoteState.

  Entity ZcashShieldedPool :: $network+pool ; $network! $:Network, pool! p:enum, activationNetworkUpgrade? p:str, noteProtocol? p:str
    Sources :: Zcashd_JsonRpc, Zebra_JsonRpc, Constants_Internal
    View :: ZcashShieldedPoolView top `<dl>` shows network, pool kind, activation network upgrade, and note protocol. Details tabs: Actions -> ZcashShieldedAction list when scoped by transaction/search; Local notes -> BlockheadZcashNoteState list when a local wallet maps owned notes; Network -> NetworkView/UtxoNetworkView.
    Notes :: Public Zcash shielded pool identity for Sapling and Orchard. Keep transparent UTXO state on Utxo* rows, consensus-visible shielded commitments on ZcashShieldedAction, and private wallet-scanned notes/viewing keys on BlockheadZcash* rows.

  Entity ZeroGConsensusNetwork :: $network+consensusNetworkId ; $network! $:Network, consensusNetworkId! p:str, sharedStakingStatusSource? p:str, $$daQuorums* $:ZeroGDaQuorum, $$storageProofs* $:ZeroGStorageProof
    Sources :: ZeroGChainScan_Rest
    View :: ZeroGConsensusNetworkView top `<dl>` shows network, consensus network id, and shared staking status source. Details tabs: DA quorums -> ZeroGDaQuorum list; Storage proofs -> ZeroGStorageProof list; Network -> ZeroGNetworkView.
    Notes :: Consensus-network identity is the 0G consensus/storage coordination scope behind the configured network, not a generic DA category. Keep connected-node proof material in BlockheadZeroGStorageProof.

  Entity ZeroGDaNode :: $network+nodeId ; $network! $:Network, nodeId! p:str, $quorum? $:ZeroGDaQuorum, $operator? $:EvmAccount, endpoint? p:str
    Sources :: ZeroGChainScan_Rest, ZeroGStorageNode_JsonRpc
    View :: ZeroGDaNodeView top `<dl>` shows network, node id, quorum, operator, and endpoint. Details tabs: Quorum -> ZeroGDaQuorumView; Operator -> EvmAccountView; Network -> ZeroGNetworkView.
    Notes :: DA node ids are protocol/source-exposed node identifiers. Endpoint and operator fields are source observations and should not be used as permanent ownership or reachability claims without timestamped node health rows.

  Entity ZeroGDaQuorum :: $network+quorumId ; $network! $:Network, quorumId! p:str, $consensusNetwork? $:ZeroGConsensusNetwork, selectionMethod? p:str, $$daNodes* $:ZeroGDaNode
    Sources :: ZeroGChainScan_Rest, ZeroGStorageNode_JsonRpc
    View :: ZeroGDaQuorumView top `<dl>` shows network, quorum id, consensus network, and selection method. Details tabs: DA nodes -> ZeroGDaNode list; Consensus -> ZeroGConsensusNetworkView; Network -> ZeroGNetworkView.
    Notes :: Quorum identity comes from 0G DA/consensus payloads. Keep it as a concrete source-backed quorum, not a general-purpose "data availability committee" ontology shared with unrelated DA systems.

  Entity ZeroGDataBlob :: $network+dataRoot ; $network! $:Network, dataRoot! p:str, $consensusNetwork? $:ZeroGConsensusNetwork, $daQuorum? $:ZeroGDaQuorum, sizeBytes? p:bigint, erasureCodingScheme? p:str, aggregatedSignature? p:str, $$chunks* $:ZeroGDataChunk, $storageLogEntry? $:ZeroGStorageLogEntry
    Sources :: ZeroGStorageScan_Rest, ZeroGChainScan_Rest, ZeroGStorageNode_JsonRpc
    View :: ZeroGDataBlobView top `<dl>` shows sizeBytes, erasureCodingScheme, aggregatedSignature, consensus network, DA quorum, and storage log entry when present. `ZeroGDataBlobsView` is the Data blobs tab in `ZeroGNetworkView` -> Data & Storage; detail tabs should keep Chunks -> `ZeroGDataChunksView` and Storage/proof links where available.
    Notes :: This is the concrete 0G DA/storage payload row keyed by dataRoot. Storage scan can source data root, size, storage log entry, and list membership; chain scan can map consensus/DA context when exposed. Connected-node file inventory and raw proof detail belong on BlockheadZeroG* rows. Keep it separate from EIP-4844 `EvmBlob`: 0G blobs carry storage/DA network semantics and chunk/proof links, while EVM blobs are execution-side EIP-4844 sidecars keyed by transaction hash and blob index.

  Entity ZeroGDataChunk :: $dataBlob+chunkIndex ; $dataBlob! $:ZeroGDataBlob, chunkIndex! p:num, $storageNode? $:ZeroGStorageNode, chunkRoot? p:str, sizeBytes? p:num
    Sources :: ZeroGStorageNode_JsonRpc, ZeroGStorageScan_Rest
    View :: ZeroGDataChunkView top `<dl>` shows data blob, chunk index, chunk root, size, and storage node. Details tabs: Data blob -> ZeroGDataBlobView; Storage node -> ZeroGStorageNodeView; Local availability -> BlockheadZeroGStoredChunk when a connected node exposes ownership/storage state.
    Notes :: Chunk rows are concrete payload segments under a 0G data root. Public storage scan may only expose aggregate blob/log rows; connected-node file presence and local proof material belong on BlockheadZeroGStoredChunk and BlockheadZeroGStorageProof.

  Entity ZeroGKvEntry :: $network+namespace+key ; $network! $:Network, namespace! p:str, key! p:str, $logEntry? $:ZeroGStorageLogEntry, $owner? $:EvmAccount, valueHash? p:str
    Sources :: ZeroGStorageScan_Rest, ZeroGStorageNode_JsonRpc
    View :: ZeroGKvEntryView top `<dl>` shows network, namespace, key, value hash, owner, and storage log entry. Details tabs: Storage log -> ZeroGStorageLogEntryView; Owner -> EvmAccountView; Network -> ZeroGNetworkView.
    Notes :: KV entries are namespaced storage records when a source exposes them. Store valueHash rather than mutable/raw values unless a connected node explicitly returns local value material.

  Entity ZeroGNetwork :: slug ; slug! p:'0g', name! p:str, namespace! p:enum, environment! p:enum, chainId! p:num, rpcEndpoints+ p:{url:url,transportType:enum,providerName:str}, explorerEndpoints+ p:{url:url,transportType:enum,providerName:str}, storageEndpoints+ p:{url:url,transportType:enum,providerName:str}, $executionNetwork? $:EvmNetwork, $consensusNetwork? $:ZeroGConsensusNetwork, $$timestamps* $:ZeroGNetwork_Timestamp, $$blocks* $:EvmBlock, $$storageNodes* $:ZeroGStorageNode, $$dataBlobs* $:ZeroGDataBlob
    Sources :: Constants_Internal, ZeroGChain_JsonRpc, ZeroGChainScan_Rest, ZeroGStorageScan_Rest
    View :: ZeroGNetworkView top `<dl>` shows name, environment, native assets, execution network, consensus network, and latest execution/storage snapshot. Details tabs: Execution -> Blocks, Network snapshots, Consensus, Endpoints; Data & Storage -> Data blobs, Storage nodes.
    Notes :: 0G is modeled as a composed network hub with EVM execution, consensus/storage coordination, storage scan data, and storage-node RPC facets. Execution blocks remain EvmBlock rows because the chain is EVM-compatible; storage blobs/chunks/proofs stay in ZeroG rows.

  Entity ZeroGNetwork_Timestamp :: $network+timestampMs ; $network! $:ZeroGNetwork, timestampMs! p:num, headBlockNumber? p:bigint, headBlockHash? p:str, headTimestampMs? p:num, transactionCount? p:num, gasUsed? p:bigint, gasLimit? p:bigint, baseFeePerGas? p:bigint, storageLogSyncHeight? p:num, storageLayer1LogSyncHeight? p:num, storageTransactionCount? p:num, latestDataRoot? p:str, latestDataSizeBytes? p:bigint, latestStorageTxHash? p:str, storageMinerCount? p:num, latestStorageMiner? p:str, storageFeeTotal? p:str, storageRewardTotal? p:str, storageTotalWinCount? p:num, expiredFileCount? p:num, prunedFileCount? p:num
    Sources :: ZeroGChain_JsonRpc, ZeroGStorageScan_Rest
    View :: ZeroGNetwork_TimestampView top `<dl>` shows observation time, head block, head hash/time, transaction count, gas used/limit/base fee, storage sync heights, storage transaction count, latest data root/size/tx, miner count/latest miner, fee/reward totals, win count, expired files, and pruned files. ZeroGNetwork_TimestampsView lists latest/history under ZeroGNetworkView snapshots.
    Notes :: Execution head and storage summary fields are bounded observations from separate sources. Do not copy them onto ZeroGNetwork identity or assume the execution RPC clock and storage scan freshness are synchronized.

  Entity ZeroGServiceProvider :: $network+providerId ; $network! $:Network, providerId! p:str, serviceKind? p:str, $operator? $:EvmAccount, verificationMethod? p:str, $$requests* $:ZeroGServiceRequest
    Sources :: ZeroGStorageScan_Rest, ZeroGStorageNode_JsonRpc
    View :: ZeroGServiceProviderView top `<dl>` shows network, provider id, service kind, operator, and verification method. Details tabs: Requests -> ZeroGServiceRequest list; Operator -> EvmAccountView; Network -> ZeroGNetworkView.
    Notes :: Service providers are concrete 0G serving/storage participants only when a registry, indexer, or connected node exposes them. Do not model generic AI/service marketplace roles without source-backed provider ids.

  Entity ZeroGServiceRequest :: $serviceProvider+requestId ; $serviceProvider! $:ZeroGServiceProvider, requestId! p:str, $requester? $:EvmAccount, requestHash? p:str, responseHash? p:str, $settlementTrace? $:ZeroGSettlementTrace
    Sources :: ZeroGStorageScan_Rest, ZeroGStorageNode_JsonRpc, ZeroGChain_JsonRpc
    View :: ZeroGServiceRequestView top `<dl>` shows service provider, request id, requester, request hash, response hash, and settlement trace. Details tabs: Provider -> ZeroGServiceProviderView; Settlement -> ZeroGSettlementTraceView; Requester -> EvmAccountView.
    Notes :: Request and response hashes are service-layer records, not inline payloads. Settlement linkage can use execution-chain transactions, but the service request selector remains provider-scoped.

  Entity ZeroGSettlementTrace :: $serviceRequest+traceId ; $serviceRequest! $:ZeroGServiceRequest, traceId! p:str, settlementTransactionHash? p:str, acknowledgementSignature? p:str, rewardAmount? p:bigint
    Sources :: ZeroGChain_JsonRpc, ZeroGStorageScan_Rest, ZeroGStorageNode_JsonRpc
    View :: ZeroGSettlementTraceView top `<dl>` shows service request, trace id, settlement transaction hash, acknowledgement signature, and reward amount. Details tabs: Service request -> ZeroGServiceRequestView; Settlement transaction -> EvmTransactionView when hash resolves on the 0G execution network.
    Notes :: Settlement traces bind a service request to execution-chain payment/acknowledgement evidence. They should not replace EvmTransaction rows or be treated as proof that off-chain response bytes are available.

  Entity ZeroGStorageLogEntry :: $network+logEntryId ; $network! $:Network, logEntryId! p:str, $dataBlob? $:ZeroGDataBlob, $consensusNetwork? $:ZeroGConsensusNetwork, sequenceNumber? p:bigint, commitment? p:str
    Sources :: ZeroGStorageScan_Rest, ZeroGChain_JsonRpc
    View :: ZeroGStorageLogEntryView top `<dl>` shows network, log entry id, sequence number, commitment, data blob, and consensus network. Details tabs: Data blob -> ZeroGDataBlobView; Consensus -> ZeroGConsensusNetworkView; Network -> ZeroGNetworkView.
    Notes :: Storage log entries are storage-layer commitments or transaction/log sequence rows. Keep them separate from EVM logs unless an execution transaction explicitly links to the storage event.

  Entity ZeroGStorageNode :: $network+nodeId ; $network! $:Network, nodeId! p:evmAddress, $operator? $:EvmAccount, endpoint? p:str, balance? p:str, totalReward? p:str, winCount? p:num, miningAttempts? p:num, $$storedChunks* $:ZeroGDataChunk, $$proofs* $:ZeroGStorageProof
    Sources :: ZeroGStorageScan_Rest
    View :: ZeroGStorageNodeView top `<dl>` shows network, node id, operator, endpoint, balance, total reward, win count, and mining attempts. Details tabs: Stored chunks -> ZeroGDataChunk list; Proofs -> ZeroGStorageProof list; Operator -> EvmAccountView; Network -> ZeroGNetworkView; Local node state -> BlockheadZeroGStorageNodeState when connected.
    Notes :: Public storage scan can expose miner/account economics and advertised endpoint data. Node-local file inventory, private endpoint configuration, storage path, and proof availability are connected-node state under BlockheadZeroGStorageNodeState.

  Entity ZeroGStorageProof :: $storageNode+proofId ; $storageNode! $:ZeroGStorageNode, proofId! p:str, $dataBlob? $:ZeroGDataBlob, $consensusNetwork? $:ZeroGConsensusNetwork, proofKind? p:str, verifiedAtBlock? p:bigint
    Sources :: ZeroGStorageScan_Rest
    View :: ZeroGStorageProofView top `<dl>` shows storage node, proof id, proof kind, verified block, data blob, and consensus network. Details tabs: Storage node -> ZeroGStorageNodeView; Data blob -> ZeroGDataBlobView; Consensus -> ZeroGConsensusNetworkView; Local proof material -> BlockheadZeroGStorageProof when a connected node exposes raw bytes/status.
    Notes :: Public proof commitment or explorer-visible verification summary. Raw proof bytes, local verification status, and connected-node errors belong on BlockheadZeroGStorageProof.

```
