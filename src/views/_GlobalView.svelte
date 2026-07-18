<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType._Global>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType._Global>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const global = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('global')
	const viewDomId = $derived('-global-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
	import BlockheadWalletAccountsView from '$/views/BlockheadWalletAccountsView.svelte'
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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={global}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Root catalog and navigation scope for top-level networks, assets, markets, proposals, and local Blockhead state.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									scope: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const scope = resolvedEntity.scope}
							{#if scope !== undefined && scope !== null}
								{String((scope) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
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

				{#snippet SectionGlobalNetworksAll({ id, label, open })}
					<NetworksView
						selection={selection.$$networks}
						href={resolve('/networks')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No networks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalNetworkStacks({ id, label, open })}
					<NetworkStacksView
						selection={selection.$$networkStacks}
						href={resolve('/network-stacks')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No network stacks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalEvmNetworks({ id, label, open })}
					<NetworksView
						selection={selection.$$evmNetworks}
						href={resolve('/networks')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No EVM networks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalNetworkUpgrades({ id, label, open })}
					<EthereumNetworkUpgradesView
						selection={selection.$$networkUpgrades}
						href={resolve('/upgrades')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No network upgrades.'
						open={open}
						title={label}
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

				{#snippet SectionGlobalCoins({ id, label, open })}
					<CoinsView
						selection={selection.$$coins}
						href={resolve('/coins')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No coins.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalMarkets({ id, label, open })}
					<MarketsView
						selection={
							selection.$$markets({
								sources: [
									Source.Constants_Internal,
								],
							})
						}
						href={resolve('/markets')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No markets.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalMarketVenues({ id, label, open })}
					<MarketVenuesView
						selection={selection.$$marketVenues}
						href={resolve('/market-venues')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No market venues.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalCurrencies({ id, label, open })}
					<CurrenciesView
						selection={selection.$$currencies}
						href={resolve('/currencies')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No currencies.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalLiquidityPools({ id, label, open })}
					<LiquidityPoolsView
						selection={selection.$$liquidityPools}
						href={resolve('/pools')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No liquidity pools.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalActorCoins({ id, label, open })}
					<EvmNetworkActorCoinBalancesView
						selection={selection.$$actorCoins}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No actor coin balances.'
						open={open}
						title={label}
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

				{#snippet SectionGlobalMarketPrices({ id, label, open })}
					<MarketPricesView
						selection={selection.$$marketPrices}
						href={resolve('/coins/prices')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No market prices.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalMarketOhlc({ id, label, open })}
					<Market_TimeInterval_TimestampsView
						selection={selection.$$marketTimeIntervalTimestamps}
						href={resolve('/coins/candles')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No OHLC observations.'
						open={open}
						title={label}
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

				{#snippet SectionGlobalProposalsList({ id, label, open })}
					<SpecificationProposalsView
						selection={selection.$$proposals}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No proposals.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalSpecificationRealms({ id, label, open })}
					<SpecificationRealmsView
						selection={selection.$$specificationRealms}
						href={resolve('/proposals')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No specification realms.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalProposalKinds({ id, label, open })}
					<SpecificationProposalKindsView
						selection={selection.$$proposalKinds}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No proposal kinds.'
						open={open}
						title={label}
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

				{#snippet SectionGlobalActors({ id, label, open })}
					<EvmAccountsView
						selection={selection.$$actors}
						href={resolve('/~/accounts/watched-accounts')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No actors.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalXmtp({ id, label, open })}
					<XmtpConversationsView
						selection={selection.$$xmtpConversations}
						href={resolve('/xmtp/conversations')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No XMTP conversations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalRooms({ id, label, open })}
					<BlockheadRoomsView
						selection={selection.$$blockheadRooms}
						href={resolve('/~/multiplayer/rooms')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No rooms.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalRoomPeers({ id, label, open })}
					<BlockheadRoomPeersView
						selection={selection.$$blockheadRoomPeers}
						href={resolve('/~/multiplayer/contacts')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No room peers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalStateChannels({ id, label, open })}
					<BlockheadStateChannelsView
						selection={selection.$$blockheadStateChannels}
						href={resolve('/channels')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No state channels.'
						open={open}
						title={label}
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
							id: 'global-wallet-accounts',
							label: 'Wallet accounts',
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

				{#snippet SectionGlobalWalletsList({ id, label, open })}
					<BlockheadWalletsView
						selection={selection.$$blockheadWallets}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No wallets.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalWalletConnections({ id, label, open })}
					<BlockheadWalletConnectionsView
						selection={selection.$$blockheadWalletConnections}
						href={resolve('/~/accounts/connections')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No wallet connections.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalWalletAccounts({ id, label, open })}
					<BlockheadWalletAccountsView
						selection={selection.$$blockheadWalletAccounts}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No wallet accounts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalWalletTransport({ id, label, open })}
					<BlockheadWalletTransportSessionsView
						selection={selection.$$blockheadWalletTransportSessions}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No wallet transport sessions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalWalletRequests({ id, label, open })}
					<BlockheadWalletRequestsView
						selection={selection.$$blockheadWalletRequests}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No wallet requests.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalWalletGrants({ id, label, open })}
					<BlockheadWalletCapabilityGrantsView
						selection={selection.$$blockheadWalletCapabilityGrants}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No capability grants.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalWalletAuth({ id, label, open })}
					<BlockheadWalletAuthenticationsView
						selection={selection.$$blockheadWalletAuthentications}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No wallet authentications.'
						open={open}
						title={label}
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

				{#snippet SectionGlobalSources({ id, label, open })}
					<BlockheadSourcesView
						selection={selection.$$blockheadSources}
						href={resolve('/~/manage/sources')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No sources.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalSessions({ id, label, open })}
					<BlockheadSessionsView
						selection={selection.$$blockheadSessions}
						href={resolve('/~/sessions')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No sessions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalWorkspaces({ id, label, open })}
					<BlockheadWorkspacesView
						selection={selection.$$blockheadWorkspaces}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No workspaces.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalPanelTrees({ id, label, open })}
					<BlockheadPanelTreesView
						selection={selection.$$blockheadPanelTrees}
						href={resolve('/~/dashboards')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No panel trees.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalMediaIngests({ id, label, open })}
					<BlockheadLocalMediaIngestsView
						selection={selection.$$blockheadLocalMediaIngests}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No media ingests.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalSharedAddresses({ id, label, open })}
					<BlockheadSharedAddressesView
						selection={selection.$$blockheadSharedAddresses}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No shared addresses.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalFarcasterConnections({ id, label, open })}
					<BlockheadFarcasterAccountConnectionsView
						selection={selection.$$blockheadFarcasterAccountConnections}
						href={resolve('/farcaster/accounts')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Farcaster connections.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalAgentConversations({ id, label, open })}
					<BlockheadAgentConversationsView
						selection={selection.$$blockheadAgentConversations}
						href={resolve('/~/agents')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No agent conversations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalAlgorandKeys({ id, label, open })}
					<BlockheadAlgorandParticipationKeysView
						selection={selection.$$blockheadAlgorandParticipationKeys}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Algorand participation keys.'
						open={open}
						title={label}
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

				{#snippet SectionGlobalAiModelCatalogs({ id, label, open })}
					<GlobalAiModelCatalogsView
						selection={selection.$$aiModelCatalogs}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No AI model catalogs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalAiArtifactCatalogs({ id, label, open })}
					<GlobalAiArtifactCatalogsView
						selection={selection.$$aiArtifactCatalogs}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No AI artifact catalogs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalAgentNetworks({ id, label, open })}
					<GlobalAgentNetworksView
						selection={selection.$$agentNetworks}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No agent networks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalEvmAbiCatalogs({ id, label, open })}
					<GlobalEvmAbiCatalogsView
						selection={selection.$$evmAbiCatalogs}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No EVM ABI catalogs.'
						open={open}
						title={label}
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

				{#snippet SectionGlobalBridgeTransactions({ id, label, open })}
					<BlockheadBridgeTransactionsView
						selection={selection.$$bridgeTransactions}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No bridge transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalBridgeTransfers({ id, label, open })}
					<BridgeTransfersView
						selection={selection.$$bridgeTransfers}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No bridge transfers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalEip8004({ id, label, open })}
					<EvmNftsView
						selection={selection.$$eip8004Services}
						href={resolve('/services/agents')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No EIP-8004 services.'
						open={open}
						title={label}
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

				{#snippet SectionGlobalZerogNodes({ id, label, open })}
					<BlockheadZeroGStorageNodeStatesView
						selection={selection.$$blockheadZeroGStorageNodeStates}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No 0G storage node states.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalZerogChunks({ id, label, open })}
					<BlockheadZeroGStoredChunksView
						selection={selection.$$blockheadZeroGStoredChunks}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No stored chunks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGlobalZerogProofs({ id, label, open })}
					<BlockheadZeroGStorageProofsView
						selection={selection.$$blockheadZeroGStorageProofs}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No storage proofs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
