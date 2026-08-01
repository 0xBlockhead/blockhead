<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType._Global>, 'prefetched'> = $props()

	const viewDomId = $derived('-global-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import NetworkStacksView from '$/views/NetworkStacksView.svelte'
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
	import CoinsView from '$/views/CoinsView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
	import MarketVenuesView from '$/views/MarketVenuesView.svelte'
	import CurrenciesView from '$/views/CurrenciesView.svelte'
	import LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'
	import EvmNetworkActorCoinBalancesView from '$/views/EvmNetworkActorCoinBalancesView.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
	import SpecificationRealmsView from '$/views/SpecificationRealmsView.svelte'
	import SpecificationProposalKindsView from '$/views/SpecificationProposalKindsView.svelte'
	import EvmAccountsView from '$/views/EvmAccountsView.svelte'
	import XmtpConversationsView from '$/views/XmtpConversationsView.svelte'
	import BlockheadRoomsView from '$/views/BlockheadRoomsView.svelte'
	import BlockheadRoomPeersView from '$/views/BlockheadRoomPeersView.svelte'
	import BlockheadStateChannelsView from '$/views/BlockheadStateChannelsView.svelte'
	import BlockheadWalletsView from '$/views/BlockheadWalletsView.svelte'
	import BlockheadWalletConnectionsView from '$/views/BlockheadWalletConnectionsView.svelte'
	import BlockheadAccountsView from '$/views/BlockheadAccountsView.svelte'
	import BlockheadWalletTransportSessionsView from '$/views/BlockheadWalletTransportSessionsView.svelte'
	import BlockheadWalletRequestsView from '$/views/BlockheadWalletRequestsView.svelte'
	import BlockheadWalletCapabilityGrantsView from '$/views/BlockheadWalletCapabilityGrantsView.svelte'
	import BlockheadWalletAuthenticationsView from '$/views/BlockheadWalletAuthenticationsView.svelte'
	import BlockheadSourcesView from '$/views/BlockheadSourcesView.svelte'
	import BlockheadSessionsView from '$/views/BlockheadSessionsView.svelte'
	import BlockheadWorkspacesView from '$/views/BlockheadWorkspacesView.svelte'
	import BlockheadPanelTreesView from '$/views/BlockheadPanelTreesView.svelte'
	import BlockheadLocalMediaIngestsView from '$/views/BlockheadLocalMediaIngestsView.svelte'
	import BlockheadSharedAddressesView from '$/views/BlockheadSharedAddressesView.svelte'
	import BlockheadFarcasterAccountConnectionsView from '$/views/BlockheadFarcasterAccountConnectionsView.svelte'
	import BlockheadAgentConversationsView from '$/views/BlockheadAgentConversationsView.svelte'
	import BlockheadAlgorandParticipationKeysView from '$/views/BlockheadAlgorandParticipationKeysView.svelte'
	import GlobalAiModelCatalogsView from '$/views/_GlobalAiModelCatalogsView.svelte'
	import GlobalAiArtifactCatalogsView from '$/views/_GlobalAiArtifactCatalogsView.svelte'
	import GlobalAgentNetworksView from '$/views/_GlobalAgentNetworksView.svelte'
	import GlobalEvmAbiCatalogsView from '$/views/_GlobalEvmAbiCatalogsView.svelte'
	import BlockheadBridgeTransactionsView from '$/views/BlockheadBridgeTransactionsView.svelte'
	import BridgeTransfersView from '$/views/BridgeTransfersView.svelte'
	import EvmNftsView from '$/views/EvmNftsView.svelte'
	import BlockheadZeroGStorageNodeStatesView from '$/views/BlockheadZeroGStorageNodeStatesView.svelte'
	import BlockheadZeroGStoredChunksView from '$/views/BlockheadZeroGStoredChunksView.svelte'
	import BlockheadZeroGStorageProofsView from '$/views/BlockheadZeroGStorageProofsView.svelte'
</script>


<EntityView
	entityType={EntityType._Global}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					{selection.entitySelector.scope}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-global-networks'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'global-networks-all',
						label: 'Networks',
					},
					{
						id: 'global-network-stacks',
						label: 'Network stacks',
					},
					{
						id: 'global-evm-networks',
						label: 'EVM networks',
					},
					{
						id: 'global-network-upgrades',
						label: 'Network upgrades',
					},
				]
			}
			data-card
			class='network-view-collapsible-networks'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Networks</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionGlobalNetworksAll({ id, label })}
				<NetworksView
					selection={selection.$$networks}
					href={
						selection.entitySelector.scope === '$$networks' ?
							resolve('/(explore)/networks')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No networks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalNetworkStacks({ id, label })}
				<NetworkStacksView
					selection={selection.$$networkStacks}
					href={
						selection.entitySelector.scope === '$$networkStacks' ?
							resolve('/(explore)/network-stacks')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No network stacks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalEvmNetworks({ id, label })}
				<NetworksView
					selection={selection.$$evmNetworks}
					collapsible={false}
					title={label}
					emptyText='No EVM networks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalNetworkUpgrades({ id, label })}
				<EthereumNetworkUpgradesView
					selection={selection.$$networkUpgrades}
					href={
						selection.entitySelector.scope === '$$networkUpgrades' ?
							resolve('/upgrades')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No network upgrades.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-global-assets-markets'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'global-coins',
						label: 'Coins',
					},
					{
						id: 'global-markets',
						label: 'Markets',
					},
					{
						id: 'global-market-venues',
						label: 'Market venues',
					},
					{
						id: 'global-currencies',
						label: 'Currencies',
					},
					{
						id: 'global-liquidity-pools',
						label: 'Liquidity pools',
					},
					{
						id: 'global-actor-coins',
						label: 'Actor coins',
					},
				]
			}
			data-card
			class='network-view-collapsible-assets'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Assets and markets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionGlobalCoins({ id, label })}
				<CoinsView
					selection={selection.$$coins}
					href={
						selection.entitySelector.scope === '$$coins' ?
							resolve('/(assets)/coins')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No coins.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalMarkets({ id, label })}
				<MarketsView
					selection={selection.$$markets}
					href={
						selection.entitySelector.scope === '$$markets' ?
							resolve('/(assets)/markets')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No markets.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalMarketVenues({ id, label })}
				<MarketVenuesView
					selection={selection.$$marketVenues}
					href={
						selection.entitySelector.scope === '$$marketVenues' ?
							resolve('/(assets)/market-venues')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No market venues.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalCurrencies({ id, label })}
				<CurrenciesView
					selection={selection.$$currencies}
					href={
						selection.entitySelector.scope === '$$currencies' ?
							resolve('/(assets)/(currencies)/currencies')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No currencies.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalLiquidityPools({ id, label })}
				<LiquidityPoolsView
					selection={selection.$$liquidityPools}
					href={
						selection.entitySelector.scope === '$$liquidityPools' ?
							resolve('/(assets)/pools')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No liquidity pools.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalActorCoins({ id, label })}
				<EvmNetworkActorCoinBalancesView
					selection={selection.$$actorCoins}
					collapsible={false}
					title={label}
					emptyText='No actor coin balances.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-global-market-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'global-market-prices',
						label: 'Market prices',
					},
					{
						id: 'global-market-ohlc',
						label: 'OHLC',
					},
				]
			}
			data-card
			class='network-view-collapsible-market-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Market observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionGlobalMarketPrices({ id, label })}
				<MarketPricesView
					selection={selection.$$marketPrices}
					href={
						selection.entitySelector.scope === '$$marketPrices' ?
							resolve('/(assets)/coins/prices')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No market prices.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalMarketOhlc({ id, label })}
				<Market_TimeInterval_TimestampsView
					selection={selection.$$marketTimeIntervalTimestamps}
					href={
						selection.entitySelector.scope === '$$marketTimeIntervalTimestamps' ?
							resolve('/(assets)/coins/candles')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No OHLC observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-global-proposals'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'global-proposals-list',
						label: 'Proposals',
					},
					{
						id: 'global-specification-realms',
						label: 'Realms',
					},
					{
						id: 'global-proposal-kinds',
						label: 'Proposal kinds',
					},
				]
			}
			data-card
			class='network-view-collapsible-proposals'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Specifications</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionGlobalProposalsList({ id, label })}
				<SpecificationProposalsView
					selection={selection.$$proposals}
					collapsible={false}
					title={label}
					emptyText='No proposals.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalSpecificationRealms({ id, label })}
				<SpecificationRealmsView
					selection={selection.$$specificationRealms}
					href={
						selection.entitySelector.scope === '$$specificationRealms' ?
							resolve('/(proposals)/proposals')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No specification realms.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalProposalKinds({ id, label })}
				<SpecificationProposalKindsView
					selection={selection.$$proposalKinds}
					collapsible={false}
					title={label}
					emptyText='No proposal kinds.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-global-actors-comms'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'global-actors',
						label: 'Actors',
					},
					{
						id: 'global-xmtp',
						label: 'XMTP conversations',
					},
					{
						id: 'global-rooms',
						label: 'Rooms',
					},
					{
						id: 'global-room-peers',
						label: 'Room peers',
					},
					{
						id: 'global-state-channels',
						label: 'State channels',
					},
				]
			}
			data-card
			class='network-view-collapsible-actors'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Actors and messaging</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionGlobalActors({ id, label })}
				<EvmAccountsView
					selection={selection.$$actors}
					href={
						selection.entitySelector.scope === '$$actors' ?
							resolve('/(social)/(xmtp)/xmtp/(xmtpNetwork)/accounts')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No actors.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalXmtp({ id, label })}
				<XmtpConversationsView
					selection={selection.$$xmtpConversations}
					collapsible={false}
					title={label}
					emptyText='No XMTP conversations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalRooms({ id, label })}
				<BlockheadRoomsView
					selection={selection.$$blockheadRooms}
					href={
						selection.entitySelector.scope === '$$blockheadRooms' ?
							resolve('/~/multiplayer/rooms')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No rooms.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalRoomPeers({ id, label })}
				<BlockheadRoomPeersView
					selection={selection.$$blockheadRoomPeers}
					href={
						selection.entitySelector.scope === '$$blockheadRoomPeers' ?
							resolve('/~/multiplayer/contacts')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No room peers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalStateChannels({ id, label })}
				<BlockheadStateChannelsView
					selection={selection.$$blockheadStateChannels}
					href={
						selection.entitySelector.scope === '$$blockheadStateChannels' ?
							resolve('/channels')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No state channels.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-global-wallets'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'global-wallets-list',
						label: 'Wallets',
					},
					{
						id: 'global-wallet-connections',
						label: 'Connections',
					},
					{
						id: 'global-accounts',
						label: 'Accounts',
					},
					{
						id: 'global-wallet-transport',
						label: 'Transport sessions',
					},
					{
						id: 'global-wallet-requests',
						label: 'Requests',
					},
					{
						id: 'global-wallet-grants',
						label: 'Capability grants',
					},
					{
						id: 'global-wallet-auth',
						label: 'Authentications',
					},
				]
			}
			data-card
			class='network-view-collapsible-wallets'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Wallets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionGlobalWalletsList({ id, label })}
				<BlockheadWalletsView
					selection={selection.$$blockheadWallets}
					collapsible={false}
					title={label}
					emptyText='No wallets.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalWalletConnections({ id, label })}
				<BlockheadWalletConnectionsView
					selection={selection.$$blockheadWalletConnections}
					href={
						selection.entitySelector.scope === '$$blockheadWalletConnections' ?
							resolve('/~/accounts/connections')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No wallet connections.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalAccounts({ id, label })}
				<BlockheadAccountsView
					selection={selection.$$blockheadAccounts}
					href={
						selection.entitySelector.scope === '$$blockheadAccounts' ?
							resolve('/~/accounts')
						:
							undefined
					}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalWalletTransport({ id, label })}
				<BlockheadWalletTransportSessionsView
					selection={selection.$$blockheadWalletTransportSessions}
					collapsible={false}
					title={label}
					emptyText='No wallet transport sessions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalWalletRequests({ id, label })}
				<BlockheadWalletRequestsView
					selection={selection.$$blockheadWalletRequests}
					collapsible={false}
					title={label}
					emptyText='No wallet requests.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalWalletGrants({ id, label })}
				<BlockheadWalletCapabilityGrantsView
					selection={selection.$$blockheadWalletCapabilityGrants}
					collapsible={false}
					title={label}
					emptyText='No capability grants.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalWalletAuth({ id, label })}
				<BlockheadWalletAuthenticationsView
					selection={selection.$$blockheadWalletAuthentications}
					collapsible={false}
					title={label}
					emptyText='No wallet authentications.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-global-local-state'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'global-sources',
						label: 'Sources',
					},
					{
						id: 'global-sessions',
						label: 'Sessions',
					},
					{
						id: 'global-workspaces',
						label: 'Workspaces',
					},
					{
						id: 'global-panel-trees',
						label: 'Panel trees',
					},
					{
						id: 'global-media-ingests',
						label: 'Media ingests',
					},
					{
						id: 'global-shared-addresses',
						label: 'Shared addresses',
					},
					{
						id: 'global-farcaster-connections',
						label: 'Farcaster connections',
					},
					{
						id: 'global-agent-conversations',
						label: 'Agent conversations',
					},
					{
						id: 'global-algorand-keys',
						label: 'Algorand participation keys',
					},
				]
			}
			data-card
			class='network-view-collapsible-local-state'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Local Blockhead state</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionGlobalSources({ id, label })}
				<BlockheadSourcesView
					selection={selection.$$blockheadSources}
					href={
						selection.entitySelector.scope === '$$blockheadSources' ?
							resolve('/~/manage/sources')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No sources.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalSessions({ id, label })}
				<BlockheadSessionsView
					selection={selection.$$blockheadSessions}
					href={
						selection.entitySelector.scope === '$$blockheadSessions' ?
							resolve('/~/sessions')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No sessions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalWorkspaces({ id, label })}
				<BlockheadWorkspacesView
					selection={selection.$$blockheadWorkspaces}
					collapsible={false}
					title={label}
					emptyText='No workspaces.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalPanelTrees({ id, label })}
				<BlockheadPanelTreesView
					selection={selection.$$blockheadPanelTrees}
					href={
						selection.entitySelector.scope === '$$blockheadPanelTrees' ?
							resolve('/~/dashboards')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No panel trees.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalMediaIngests({ id, label })}
				<BlockheadLocalMediaIngestsView
					selection={selection.$$blockheadLocalMediaIngests}
					collapsible={false}
					title={label}
					emptyText='No media ingests.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalSharedAddresses({ id, label })}
				<BlockheadSharedAddressesView
					selection={selection.$$blockheadSharedAddresses}
					collapsible={false}
					title={label}
					emptyText='No shared addresses.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalFarcasterConnections({ id, label })}
				<BlockheadFarcasterAccountConnectionsView
					selection={selection.$$blockheadFarcasterAccountConnections}
					href={
						selection.entitySelector.scope === '$$blockheadFarcasterAccountConnections' ?
							resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/accounts')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No Farcaster connections.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalAgentConversations({ id, label })}
				<BlockheadAgentConversationsView
					selection={selection.$$blockheadAgentConversations}
					href={
						selection.entitySelector.scope === '$$blockheadAgentConversations' ?
							true ?
								resolve('/~/agents')
							:
								true ?
									resolve('/~/agents/conversations')
								:
									undefined
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No agent conversations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalAlgorandKeys({ id, label })}
				<BlockheadAlgorandParticipationKeysView
					selection={selection.$$blockheadAlgorandParticipationKeys}
					collapsible={false}
					title={label}
					emptyText='No Algorand participation keys.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-global-catalogs'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'global-ai-model-catalogs',
						label: 'AI model catalogs',
					},
					{
						id: 'global-ai-artifact-catalogs',
						label: 'AI artifact catalogs',
					},
					{
						id: 'global-agent-networks',
						label: 'Agent networks',
					},
					{
						id: 'global-evm-abi-catalogs',
						label: 'EVM ABI catalogs',
					},
				]
			}
			data-card
			class='network-view-collapsible-catalogs'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Catalogs</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionGlobalAiModelCatalogs({ id, label })}
				<GlobalAiModelCatalogsView
					selection={selection.$$aiModelCatalogs}
					collapsible={false}
					title={label}
					emptyText='No AI model catalogs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalAiArtifactCatalogs({ id, label })}
				<GlobalAiArtifactCatalogsView
					selection={selection.$$aiArtifactCatalogs}
					collapsible={false}
					title={label}
					emptyText='No AI artifact catalogs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalAgentNetworks({ id, label })}
				<GlobalAgentNetworksView
					selection={selection.$$agentNetworks}
					collapsible={false}
					title={label}
					emptyText='No agent networks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalEvmAbiCatalogs({ id, label })}
				<GlobalEvmAbiCatalogsView
					selection={selection.$$evmAbiCatalogs}
					collapsible={false}
					title={label}
					emptyText='No EVM ABI catalogs.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-global-bridges-services'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'global-bridge-transactions',
						label: 'Bridge transactions',
					},
					{
						id: 'global-bridge-transfers',
						label: 'Bridge transfers',
					},
					{
						id: 'global-eip8004',
						label: 'EIP-8004 services',
					},
				]
			}
			data-card
			class='network-view-collapsible-bridges'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Bridges and services</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionGlobalBridgeTransactions({ id, label })}
				<BlockheadBridgeTransactionsView
					selection={selection.$$bridgeTransactions}
					collapsible={false}
					title={label}
					emptyText='No bridge transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalBridgeTransfers({ id, label })}
				<BridgeTransfersView
					selection={selection.$$bridgeTransfers}
					collapsible={false}
					title={label}
					emptyText='No bridge transfers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalEip8004({ id, label })}
				<EvmNftsView
					selection={selection.$$eip8004Services}
					href={
						selection.entitySelector.scope === '$$eip8004Services' ?
							resolve('/services/agents')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No EIP-8004 services.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-global-zerog'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'global-zerog-nodes',
						label: 'Storage node states',
					},
					{
						id: 'global-zerog-chunks',
						label: 'Stored chunks',
					},
					{
						id: 'global-zerog-proofs',
						label: 'Storage proofs',
					},
				]
			}
			data-card
			class='network-view-collapsible-zerog'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>0G storage</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionGlobalZerogNodes({ id, label })}
				<BlockheadZeroGStorageNodeStatesView
					selection={selection.$$blockheadZeroGStorageNodeStates}
					collapsible={false}
					title={label}
					emptyText='No 0G storage node states.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalZerogChunks({ id, label })}
				<BlockheadZeroGStoredChunksView
					selection={selection.$$blockheadZeroGStoredChunks}
					collapsible={false}
					title={label}
					emptyText='No stored chunks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGlobalZerogProofs({ id, label })}
				<BlockheadZeroGStorageProofsView
					selection={selection.$$blockheadZeroGStorageProofs}
					collapsible={false}
					title={label}
					emptyText='No storage proofs.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
