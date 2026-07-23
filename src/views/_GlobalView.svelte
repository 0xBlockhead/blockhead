<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType._Global>
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
	const global = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'global'
	const viewDomId = $derived('-global-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={global}>
				{#snippet children(entity)}
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
				<CollapsibleTabs
					id={viewDomId + '-carousel-global-networks'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'global-networks-all',
								label: 'Networks',
								ownsSection: true,
							},
							{
								id: 'global-network-stacks',
								label: 'Network stacks',
								ownsSection: true,
							},
							{
								id: 'global-evm-networks',
								label: 'EVM networks',
								ownsSection: true,
							},
							{
								id: 'global-network-upgrades',
								label: 'Network upgrades',
								ownsSection: true,
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

					{#snippet MarkerGlobalNetworksAll(_context, Content)}
						{@const globalNetworksAllResource = selection.$$networks}
						<ResourceBoundary
							resource={globalNetworksAllResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalNetworksAll({ id, label, open, active })}
						{@const globalNetworksAllResource = selection.$$networks}
						<ResourceBoundary
							resource={globalNetworksAllResource}
						>
							{#snippet children(network)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<NetworksView
										selection={globalNetworksAllResource}
										href={resolve('/networks')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No networks.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalNetworkStacks(_context, Content)}
						{@const globalNetworksGlobalNetworkStacksResource = selection.$$networkStacks}
						<ResourceBoundary
							resource={globalNetworksGlobalNetworkStacksResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalNetworkStacks({ id, label, open, active })}
						{@const globalNetworksGlobalNetworkStacksResource = selection.$$networkStacks}
						<ResourceBoundary
							resource={globalNetworksGlobalNetworkStacksResource}
						>
							{#snippet children(networkStack)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<NetworkStacksView
										selection={globalNetworksGlobalNetworkStacksResource}
										href={resolve('/network-stacks')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No network stacks.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalEvmNetworks(_context, Content)}
						{@const globalNetworksGlobalEvmNetworksResource = selection.$$evmNetworks}
						<ResourceBoundary
							resource={globalNetworksGlobalEvmNetworksResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalEvmNetworks({ id, label, open, active })}
						{@const globalNetworksGlobalEvmNetworksResource = selection.$$evmNetworks}
						<ResourceBoundary
							resource={globalNetworksGlobalEvmNetworksResource}
						>
							{#snippet children(network)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<NetworksView
										selection={globalNetworksGlobalEvmNetworksResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No EVM networks.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalNetworkUpgrades(_context, Content)}
						{@const globalNetworksGlobalNetworkUpgradesResource = selection.$$networkUpgrades}
						<ResourceBoundary
							resource={globalNetworksGlobalNetworkUpgradesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalNetworkUpgrades({ id, label, open, active })}
						{@const globalNetworksGlobalNetworkUpgradesResource = selection.$$networkUpgrades}
						<ResourceBoundary
							resource={globalNetworksGlobalNetworkUpgradesResource}
						>
							{#snippet children(ethereumNetworkUpgrade)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<EthereumNetworkUpgradesView
										selection={globalNetworksGlobalNetworkUpgradesResource}
										href={resolve('/upgrades')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No network upgrades.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
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
								ownsSection: true,
							},
							{
								id: 'global-markets',
								label: 'Markets',
								ownsSection: true,
							},
							{
								id: 'global-market-venues',
								label: 'Market venues',
								ownsSection: true,
							},
							{
								id: 'global-currencies',
								label: 'Currencies',
								ownsSection: true,
							},
							{
								id: 'global-liquidity-pools',
								label: 'Liquidity pools',
								ownsSection: true,
							},
							{
								id: 'global-actor-coins',
								label: 'Actor coins',
								ownsSection: true,
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

					{#snippet MarkerGlobalCoins(_context, Content)}
						{@const globalAssetsMarketsGlobalCoinsResource = selection.$$coins}
						<ResourceBoundary
							resource={globalAssetsMarketsGlobalCoinsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalCoins({ id, label, open, active })}
						{@const globalAssetsMarketsGlobalCoinsResource = selection.$$coins}
						<ResourceBoundary
							resource={globalAssetsMarketsGlobalCoinsResource}
						>
							{#snippet children(coin)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<CoinsView
										selection={globalAssetsMarketsGlobalCoinsResource}
										href={resolve('/coins')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No coins.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalMarkets(_context, Content)}
						{@const globalAssetsMarketsGlobalMarketsResource = selection
		.$$markets({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={globalAssetsMarketsGlobalMarketsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalMarkets({ id, label, open, active })}
						{@const globalAssetsMarketsGlobalMarketsResource = selection
		.$$markets({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={globalAssetsMarketsGlobalMarketsResource}
						>
							{#snippet children(market)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<MarketsView
										selection={globalAssetsMarketsGlobalMarketsResource}
										href={resolve('/markets')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No markets.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalMarketVenues(_context, Content)}
						{@const globalAssetsMarketsGlobalMarketVenuesResource = selection.$$marketVenues}
						<ResourceBoundary
							resource={globalAssetsMarketsGlobalMarketVenuesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalMarketVenues({ id, label, open, active })}
						{@const globalAssetsMarketsGlobalMarketVenuesResource = selection.$$marketVenues}
						<ResourceBoundary
							resource={globalAssetsMarketsGlobalMarketVenuesResource}
						>
							{#snippet children(marketVenue)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<MarketVenuesView
										selection={globalAssetsMarketsGlobalMarketVenuesResource}
										href={resolve('/market-venues')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No market venues.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalCurrencies(_context, Content)}
						{@const globalAssetsMarketsGlobalCurrenciesResource = selection.$$currencies}
						<ResourceBoundary
							resource={globalAssetsMarketsGlobalCurrenciesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalCurrencies({ id, label, open, active })}
						{@const globalAssetsMarketsGlobalCurrenciesResource = selection.$$currencies}
						<ResourceBoundary
							resource={globalAssetsMarketsGlobalCurrenciesResource}
						>
							{#snippet children(currency)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<CurrenciesView
										selection={globalAssetsMarketsGlobalCurrenciesResource}
										href={resolve('/currencies')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No currencies.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalLiquidityPools(_context, Content)}
						{@const globalAssetsMarketsGlobalLiquidityPoolsResource = selection.$$liquidityPools}
						<ResourceBoundary
							resource={globalAssetsMarketsGlobalLiquidityPoolsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalLiquidityPools({ id, label, open, active })}
						{@const globalAssetsMarketsGlobalLiquidityPoolsResource = selection.$$liquidityPools}
						<ResourceBoundary
							resource={globalAssetsMarketsGlobalLiquidityPoolsResource}
						>
							{#snippet children(liquidityPool)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<LiquidityPoolsView
										selection={globalAssetsMarketsGlobalLiquidityPoolsResource}
										href={resolve('/pools')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No liquidity pools.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalActorCoins(_context, Content)}
						{@const globalAssetsMarketsGlobalActorCoinsResource = selection.$$actorCoins}
						<ResourceBoundary
							resource={globalAssetsMarketsGlobalActorCoinsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalActorCoins({ id, label, open, active })}
						{@const globalAssetsMarketsGlobalActorCoinsResource = selection.$$actorCoins}
						<ResourceBoundary
							resource={globalAssetsMarketsGlobalActorCoinsResource}
						>
							{#snippet children(evmNetworkActorCoinBalance)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<EvmNetworkActorCoinBalancesView
										selection={globalAssetsMarketsGlobalActorCoinsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No actor coin balances.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
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
								ownsSection: true,
							},
							{
								id: 'global-market-ohlc',
								label: 'OHLC',
								ownsSection: true,
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

					{#snippet MarkerGlobalMarketPrices(_context, Content)}
						{@const globalMarketObservationsGlobalMarketPricesResource = selection.$$marketPrices}
						<ResourceBoundary
							resource={globalMarketObservationsGlobalMarketPricesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalMarketPrices({ id, label, open, active })}
						{@const globalMarketObservationsGlobalMarketPricesResource = selection.$$marketPrices}
						<ResourceBoundary
							resource={globalMarketObservationsGlobalMarketPricesResource}
						>
							{#snippet children(marketPrice)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<MarketPricesView
										selection={globalMarketObservationsGlobalMarketPricesResource}
										href={resolve('/coins/prices')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No market prices.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalMarketOhlc(_context, Content)}
						{@const globalMarketObservationsGlobalMarketOhlcResource = selection.$$marketTimeIntervalTimestamps}
						<ResourceBoundary
							resource={globalMarketObservationsGlobalMarketOhlcResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalMarketOhlc({ id, label, open, active })}
						{@const globalMarketObservationsGlobalMarketOhlcResource = selection.$$marketTimeIntervalTimestamps}
						<ResourceBoundary
							resource={globalMarketObservationsGlobalMarketOhlcResource}
						>
							{#snippet children(marketTimeIntervalTimestamp)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<Market_TimeInterval_TimestampsView
										selection={globalMarketObservationsGlobalMarketOhlcResource}
										href={resolve('/coins/candles')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No OHLC observations.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
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
								ownsSection: true,
							},
							{
								id: 'global-specification-realms',
								label: 'Realms',
								ownsSection: true,
							},
							{
								id: 'global-proposal-kinds',
								label: 'Proposal kinds',
								ownsSection: true,
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

					{#snippet MarkerGlobalProposalsList(_context, Content)}
						{@const globalProposalsListResource = selection
		.$$proposals({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={globalProposalsListResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalProposalsList({ id, label, open, active })}
						{@const globalProposalsListResource = selection
		.$$proposals({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={globalProposalsListResource}
						>
							{#snippet children(specificationProposal)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<SpecificationProposalsView
										selection={globalProposalsListResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No proposals.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalSpecificationRealms(_context, Content)}
						{@const globalProposalsGlobalSpecificationRealmsResource = selection
		.$$specificationRealms({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={globalProposalsGlobalSpecificationRealmsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalSpecificationRealms({ id, label, open, active })}
						{@const globalProposalsGlobalSpecificationRealmsResource = selection
		.$$specificationRealms({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={globalProposalsGlobalSpecificationRealmsResource}
						>
							{#snippet children(specificationRealm)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<SpecificationRealmsView
										selection={globalProposalsGlobalSpecificationRealmsResource}
										href={resolve('/proposals')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No specification realms.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalProposalKinds(_context, Content)}
						{@const globalProposalsGlobalProposalKindsResource = selection
		.$$proposalKinds({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={globalProposalsGlobalProposalKindsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalProposalKinds({ id, label, open, active })}
						{@const globalProposalsGlobalProposalKindsResource = selection
		.$$proposalKinds({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={globalProposalsGlobalProposalKindsResource}
						>
							{#snippet children(specificationProposalKind)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<SpecificationProposalKindsView
										selection={globalProposalsGlobalProposalKindsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No proposal kinds.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
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
								ownsSection: true,
							},
							{
								id: 'global-xmtp',
								label: 'XMTP conversations',
								ownsSection: true,
							},
							{
								id: 'global-rooms',
								label: 'Rooms',
								ownsSection: true,
							},
							{
								id: 'global-room-peers',
								label: 'Room peers',
								ownsSection: true,
							},
							{
								id: 'global-state-channels',
								label: 'State channels',
								ownsSection: true,
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

					{#snippet MarkerGlobalActors(_context, Content)}
						{@const globalActorsCommsGlobalActorsResource = selection.$$actors}
						<ResourceBoundary
							resource={globalActorsCommsGlobalActorsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalActors({ id, label, open, active })}
						{@const globalActorsCommsGlobalActorsResource = selection.$$actors}
						<ResourceBoundary
							resource={globalActorsCommsGlobalActorsResource}
						>
							{#snippet children(evmAccount)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<EvmAccountsView
										selection={globalActorsCommsGlobalActorsResource}
										href={resolve('/xmtp/accounts')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No actors.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalXmtp(_context, Content)}
						{@const globalActorsCommsGlobalXmtpResource = selection.$$xmtpConversations}
						<ResourceBoundary
							resource={globalActorsCommsGlobalXmtpResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalXmtp({ id, label, open, active })}
						{@const globalActorsCommsGlobalXmtpResource = selection.$$xmtpConversations}
						<ResourceBoundary
							resource={globalActorsCommsGlobalXmtpResource}
						>
							{#snippet children(xmtpConversation)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<XmtpConversationsView
										selection={globalActorsCommsGlobalXmtpResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No XMTP conversations.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalRooms(_context, Content)}
						{@const globalActorsCommsGlobalRoomsResource = selection.$$blockheadRooms}
						<ResourceBoundary
							resource={globalActorsCommsGlobalRoomsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalRooms({ id, label, open, active })}
						{@const globalActorsCommsGlobalRoomsResource = selection.$$blockheadRooms}
						<ResourceBoundary
							resource={globalActorsCommsGlobalRoomsResource}
						>
							{#snippet children(blockheadRoom)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadRoomsView
										selection={globalActorsCommsGlobalRoomsResource}
										href={resolve('/~/multiplayer/rooms')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No rooms.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalRoomPeers(_context, Content)}
						{@const globalActorsCommsGlobalRoomPeersResource = selection.$$blockheadRoomPeers}
						<ResourceBoundary
							resource={globalActorsCommsGlobalRoomPeersResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalRoomPeers({ id, label, open, active })}
						{@const globalActorsCommsGlobalRoomPeersResource = selection.$$blockheadRoomPeers}
						<ResourceBoundary
							resource={globalActorsCommsGlobalRoomPeersResource}
						>
							{#snippet children(blockheadRoomPeer)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadRoomPeersView
										selection={globalActorsCommsGlobalRoomPeersResource}
										href={resolve('/~/multiplayer/contacts')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No room peers.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalStateChannels(_context, Content)}
						{@const globalActorsCommsGlobalStateChannelsResource = selection.$$blockheadStateChannels}
						<ResourceBoundary
							resource={globalActorsCommsGlobalStateChannelsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalStateChannels({ id, label, open, active })}
						{@const globalActorsCommsGlobalStateChannelsResource = selection.$$blockheadStateChannels}
						<ResourceBoundary
							resource={globalActorsCommsGlobalStateChannelsResource}
						>
							{#snippet children(blockheadStateChannel)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadStateChannelsView
										selection={globalActorsCommsGlobalStateChannelsResource}
										href={resolve('/channels')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No state channels.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
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
								ownsSection: true,
							},
							{
								id: 'global-wallet-connections',
								label: 'Connections',
								ownsSection: true,
							},
							{
								id: 'global-accounts',
								label: 'Accounts',
								ownsSection: true,
							},
							{
								id: 'global-wallet-transport',
								label: 'Transport sessions',
								ownsSection: true,
							},
							{
								id: 'global-wallet-requests',
								label: 'Requests',
								ownsSection: true,
							},
							{
								id: 'global-wallet-grants',
								label: 'Capability grants',
								ownsSection: true,
							},
							{
								id: 'global-wallet-auth',
								label: 'Authentications',
								ownsSection: true,
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

					{#snippet MarkerGlobalWalletsList(_context, Content)}
						{@const globalWalletsListResource = selection.$$blockheadWallets}
						<ResourceBoundary
							resource={globalWalletsListResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalWalletsList({ id, label, open, active })}
						{@const globalWalletsListResource = selection.$$blockheadWallets}
						<ResourceBoundary
							resource={globalWalletsListResource}
						>
							{#snippet children(blockheadWallet)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadWalletsView
										selection={globalWalletsListResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No wallets.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalWalletConnections(_context, Content)}
						{@const globalWalletsGlobalWalletConnectionsResource = selection.$$blockheadWalletConnections}
						<ResourceBoundary
							resource={globalWalletsGlobalWalletConnectionsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalWalletConnections({ id, label, open, active })}
						{@const globalWalletsGlobalWalletConnectionsResource = selection.$$blockheadWalletConnections}
						<ResourceBoundary
							resource={globalWalletsGlobalWalletConnectionsResource}
						>
							{#snippet children(blockheadWalletConnection)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadWalletConnectionsView
										selection={globalWalletsGlobalWalletConnectionsResource}
										href={resolve('/~/accounts/connections')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No wallet connections.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalAccounts(_context, Content)}
						{@const globalWalletsGlobalAccountsResource = selection
		.$$blockheadAccounts({
			sources: [
				Source.Local_Internal,
			],
		})}
						<ResourceBoundary
							resource={globalWalletsGlobalAccountsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalAccounts({ id, label, open, active })}
						{@const globalWalletsGlobalAccountsResource = selection
		.$$blockheadAccounts({
			sources: [
				Source.Local_Internal,
			],
		})}
						<ResourceBoundary
							resource={globalWalletsGlobalAccountsResource}
						>
							{#snippet children(blockheadAccount)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadAccountsView
										selection={globalWalletsGlobalAccountsResource}
										href={resolve('/~/accounts')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalWalletTransport(_context, Content)}
						{@const globalWalletsGlobalWalletTransportResource = selection.$$blockheadWalletTransportSessions}
						<ResourceBoundary
							resource={globalWalletsGlobalWalletTransportResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalWalletTransport({ id, label, open, active })}
						{@const globalWalletsGlobalWalletTransportResource = selection.$$blockheadWalletTransportSessions}
						<ResourceBoundary
							resource={globalWalletsGlobalWalletTransportResource}
						>
							{#snippet children(blockheadWalletTransportSession)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadWalletTransportSessionsView
										selection={globalWalletsGlobalWalletTransportResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No wallet transport sessions.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalWalletRequests(_context, Content)}
						{@const globalWalletsGlobalWalletRequestsResource = selection.$$blockheadWalletRequests}
						<ResourceBoundary
							resource={globalWalletsGlobalWalletRequestsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalWalletRequests({ id, label, open, active })}
						{@const globalWalletsGlobalWalletRequestsResource = selection.$$blockheadWalletRequests}
						<ResourceBoundary
							resource={globalWalletsGlobalWalletRequestsResource}
						>
							{#snippet children(blockheadWalletRequest)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadWalletRequestsView
										selection={globalWalletsGlobalWalletRequestsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No wallet requests.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalWalletGrants(_context, Content)}
						{@const globalWalletsGlobalWalletGrantsResource = selection.$$blockheadWalletCapabilityGrants}
						<ResourceBoundary
							resource={globalWalletsGlobalWalletGrantsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalWalletGrants({ id, label, open, active })}
						{@const globalWalletsGlobalWalletGrantsResource = selection.$$blockheadWalletCapabilityGrants}
						<ResourceBoundary
							resource={globalWalletsGlobalWalletGrantsResource}
						>
							{#snippet children(blockheadWalletCapabilityGrant)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadWalletCapabilityGrantsView
										selection={globalWalletsGlobalWalletGrantsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No capability grants.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalWalletAuth(_context, Content)}
						{@const globalWalletsGlobalWalletAuthResource = selection.$$blockheadWalletAuthentications}
						<ResourceBoundary
							resource={globalWalletsGlobalWalletAuthResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalWalletAuth({ id, label, open, active })}
						{@const globalWalletsGlobalWalletAuthResource = selection.$$blockheadWalletAuthentications}
						<ResourceBoundary
							resource={globalWalletsGlobalWalletAuthResource}
						>
							{#snippet children(blockheadWalletAuthentication)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadWalletAuthenticationsView
										selection={globalWalletsGlobalWalletAuthResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No wallet authentications.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
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
								ownsSection: true,
							},
							{
								id: 'global-sessions',
								label: 'Sessions',
								ownsSection: true,
							},
							{
								id: 'global-workspaces',
								label: 'Workspaces',
								ownsSection: true,
							},
							{
								id: 'global-panel-trees',
								label: 'Panel trees',
								ownsSection: true,
							},
							{
								id: 'global-media-ingests',
								label: 'Media ingests',
								ownsSection: true,
							},
							{
								id: 'global-shared-addresses',
								label: 'Shared addresses',
								ownsSection: true,
							},
							{
								id: 'global-farcaster-connections',
								label: 'Farcaster connections',
								ownsSection: true,
							},
							{
								id: 'global-agent-conversations',
								label: 'Agent conversations',
								ownsSection: true,
							},
							{
								id: 'global-algorand-keys',
								label: 'Algorand participation keys',
								ownsSection: true,
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

					{#snippet MarkerGlobalSources(_context, Content)}
						{@const globalLocalStateGlobalSourcesResource = selection.$$blockheadSources}
						<ResourceBoundary
							resource={globalLocalStateGlobalSourcesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalSources({ id, label, open, active })}
						{@const globalLocalStateGlobalSourcesResource = selection.$$blockheadSources}
						<ResourceBoundary
							resource={globalLocalStateGlobalSourcesResource}
						>
							{#snippet children(blockheadSource)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadSourcesView
										selection={globalLocalStateGlobalSourcesResource}
										href={resolve('/~/manage/sources')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No sources.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalSessions(_context, Content)}
						{@const globalLocalStateGlobalSessionsResource = selection.$$blockheadSessions}
						<ResourceBoundary
							resource={globalLocalStateGlobalSessionsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalSessions({ id, label, open, active })}
						{@const globalLocalStateGlobalSessionsResource = selection.$$blockheadSessions}
						<ResourceBoundary
							resource={globalLocalStateGlobalSessionsResource}
						>
							{#snippet children(blockheadSession)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadSessionsView
										selection={globalLocalStateGlobalSessionsResource}
										href={resolve('/~/sessions')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No sessions.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalWorkspaces(_context, Content)}
						{@const globalLocalStateGlobalWorkspacesResource = selection.$$blockheadWorkspaces}
						<ResourceBoundary
							resource={globalLocalStateGlobalWorkspacesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalWorkspaces({ id, label, open, active })}
						{@const globalLocalStateGlobalWorkspacesResource = selection.$$blockheadWorkspaces}
						<ResourceBoundary
							resource={globalLocalStateGlobalWorkspacesResource}
						>
							{#snippet children(blockheadWorkspace)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadWorkspacesView
										selection={globalLocalStateGlobalWorkspacesResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No workspaces.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalPanelTrees(_context, Content)}
						{@const globalLocalStateGlobalPanelTreesResource = selection.$$blockheadPanelTrees}
						<ResourceBoundary
							resource={globalLocalStateGlobalPanelTreesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalPanelTrees({ id, label, open, active })}
						{@const globalLocalStateGlobalPanelTreesResource = selection.$$blockheadPanelTrees}
						<ResourceBoundary
							resource={globalLocalStateGlobalPanelTreesResource}
						>
							{#snippet children(blockheadPanelTree)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadPanelTreesView
										selection={globalLocalStateGlobalPanelTreesResource}
										href={resolve('/~/dashboards')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No panel trees.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalMediaIngests(_context, Content)}
						{@const globalLocalStateGlobalMediaIngestsResource = selection.$$blockheadLocalMediaIngests}
						<ResourceBoundary
							resource={globalLocalStateGlobalMediaIngestsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalMediaIngests({ id, label, open, active })}
						{@const globalLocalStateGlobalMediaIngestsResource = selection.$$blockheadLocalMediaIngests}
						<ResourceBoundary
							resource={globalLocalStateGlobalMediaIngestsResource}
						>
							{#snippet children(blockheadLocalMediaIngest)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadLocalMediaIngestsView
										selection={globalLocalStateGlobalMediaIngestsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No media ingests.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalSharedAddresses(_context, Content)}
						{@const globalLocalStateGlobalSharedAddressesResource = selection.$$blockheadSharedAddresses}
						<ResourceBoundary
							resource={globalLocalStateGlobalSharedAddressesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalSharedAddresses({ id, label, open, active })}
						{@const globalLocalStateGlobalSharedAddressesResource = selection.$$blockheadSharedAddresses}
						<ResourceBoundary
							resource={globalLocalStateGlobalSharedAddressesResource}
						>
							{#snippet children(blockheadSharedAddress)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadSharedAddressesView
										selection={globalLocalStateGlobalSharedAddressesResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No shared addresses.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalFarcasterConnections(_context, Content)}
						{@const globalLocalStateGlobalFarcasterConnectionsResource = selection.$$blockheadFarcasterAccountConnections}
						<ResourceBoundary
							resource={globalLocalStateGlobalFarcasterConnectionsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalFarcasterConnections({ id, label, open, active })}
						{@const globalLocalStateGlobalFarcasterConnectionsResource = selection.$$blockheadFarcasterAccountConnections}
						<ResourceBoundary
							resource={globalLocalStateGlobalFarcasterConnectionsResource}
						>
							{#snippet children(blockheadFarcasterAccountConnection)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadFarcasterAccountConnectionsView
										selection={globalLocalStateGlobalFarcasterConnectionsResource}
										href={resolve('/farcaster/accounts')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No Farcaster connections.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalAgentConversations(_context, Content)}
						{@const globalLocalStateGlobalAgentConversationsResource = selection.$$blockheadAgentConversations}
						<ResourceBoundary
							resource={globalLocalStateGlobalAgentConversationsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalAgentConversations({ id, label, open, active })}
						{@const globalLocalStateGlobalAgentConversationsResource = selection.$$blockheadAgentConversations}
						<ResourceBoundary
							resource={globalLocalStateGlobalAgentConversationsResource}
						>
							{#snippet children(blockheadAgentConversation)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadAgentConversationsView
										selection={globalLocalStateGlobalAgentConversationsResource}
										href={resolve('/~/agents')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No agent conversations.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalAlgorandKeys(_context, Content)}
						{@const globalLocalStateGlobalAlgorandKeysResource = selection.$$blockheadAlgorandParticipationKeys}
						<ResourceBoundary
							resource={globalLocalStateGlobalAlgorandKeysResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalAlgorandKeys({ id, label, open, active })}
						{@const globalLocalStateGlobalAlgorandKeysResource = selection.$$blockheadAlgorandParticipationKeys}
						<ResourceBoundary
							resource={globalLocalStateGlobalAlgorandKeysResource}
						>
							{#snippet children(blockheadAlgorandParticipationKey)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadAlgorandParticipationKeysView
										selection={globalLocalStateGlobalAlgorandKeysResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No Algorand participation keys.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
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
								ownsSection: true,
							},
							{
								id: 'global-ai-artifact-catalogs',
								label: 'AI artifact catalogs',
								ownsSection: true,
							},
							{
								id: 'global-agent-networks',
								label: 'Agent networks',
								ownsSection: true,
							},
							{
								id: 'global-evm-abi-catalogs',
								label: 'EVM ABI catalogs',
								ownsSection: true,
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

					{#snippet MarkerGlobalAiModelCatalogs(_context, Content)}
						{@const globalCatalogsGlobalAiModelCatalogsResource = selection.$$aiModelCatalogs}
						<ResourceBoundary
							resource={globalCatalogsGlobalAiModelCatalogsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalAiModelCatalogs({ id, label, open, active })}
						{@const globalCatalogsGlobalAiModelCatalogsResource = selection.$$aiModelCatalogs}
						<ResourceBoundary
							resource={globalCatalogsGlobalAiModelCatalogsResource}
						>
							{#snippet children(globalAiModelCatalog)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<GlobalAiModelCatalogsView
										selection={globalCatalogsGlobalAiModelCatalogsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No AI model catalogs.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalAiArtifactCatalogs(_context, Content)}
						{@const globalCatalogsGlobalAiArtifactCatalogsResource = selection.$$aiArtifactCatalogs}
						<ResourceBoundary
							resource={globalCatalogsGlobalAiArtifactCatalogsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalAiArtifactCatalogs({ id, label, open, active })}
						{@const globalCatalogsGlobalAiArtifactCatalogsResource = selection.$$aiArtifactCatalogs}
						<ResourceBoundary
							resource={globalCatalogsGlobalAiArtifactCatalogsResource}
						>
							{#snippet children(globalAiArtifactCatalog)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<GlobalAiArtifactCatalogsView
										selection={globalCatalogsGlobalAiArtifactCatalogsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No AI artifact catalogs.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalAgentNetworks(_context, Content)}
						{@const globalCatalogsGlobalAgentNetworksResource = selection.$$agentNetworks}
						<ResourceBoundary
							resource={globalCatalogsGlobalAgentNetworksResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalAgentNetworks({ id, label, open, active })}
						{@const globalCatalogsGlobalAgentNetworksResource = selection.$$agentNetworks}
						<ResourceBoundary
							resource={globalCatalogsGlobalAgentNetworksResource}
						>
							{#snippet children(globalAgentNetwork)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<GlobalAgentNetworksView
										selection={globalCatalogsGlobalAgentNetworksResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No agent networks.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalEvmAbiCatalogs(_context, Content)}
						{@const globalCatalogsGlobalEvmAbiCatalogsResource = selection.$$evmAbiCatalogs}
						<ResourceBoundary
							resource={globalCatalogsGlobalEvmAbiCatalogsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalEvmAbiCatalogs({ id, label, open, active })}
						{@const globalCatalogsGlobalEvmAbiCatalogsResource = selection.$$evmAbiCatalogs}
						<ResourceBoundary
							resource={globalCatalogsGlobalEvmAbiCatalogsResource}
						>
							{#snippet children(globalEvmAbiCatalog)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<GlobalEvmAbiCatalogsView
										selection={globalCatalogsGlobalEvmAbiCatalogsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No EVM ABI catalogs.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
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
								ownsSection: true,
							},
							{
								id: 'global-bridge-transfers',
								label: 'Bridge transfers',
								ownsSection: true,
							},
							{
								id: 'global-eip8004',
								label: 'EIP-8004 services',
								ownsSection: true,
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

					{#snippet MarkerGlobalBridgeTransactions(_context, Content)}
						{@const globalBridgesServicesGlobalBridgeTransactionsResource = selection.$$bridgeTransactions}
						<ResourceBoundary
							resource={globalBridgesServicesGlobalBridgeTransactionsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalBridgeTransactions({ id, label, open, active })}
						{@const globalBridgesServicesGlobalBridgeTransactionsResource = selection.$$bridgeTransactions}
						<ResourceBoundary
							resource={globalBridgesServicesGlobalBridgeTransactionsResource}
						>
							{#snippet children(blockheadBridgeTransaction)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadBridgeTransactionsView
										selection={globalBridgesServicesGlobalBridgeTransactionsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No bridge transactions.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalBridgeTransfers(_context, Content)}
						{@const globalBridgesServicesGlobalBridgeTransfersResource = selection.$$bridgeTransfers}
						<ResourceBoundary
							resource={globalBridgesServicesGlobalBridgeTransfersResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalBridgeTransfers({ id, label, open, active })}
						{@const globalBridgesServicesGlobalBridgeTransfersResource = selection.$$bridgeTransfers}
						<ResourceBoundary
							resource={globalBridgesServicesGlobalBridgeTransfersResource}
						>
							{#snippet children(bridgeTransfer)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BridgeTransfersView
										selection={globalBridgesServicesGlobalBridgeTransfersResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No bridge transfers.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalEip8004(_context, Content)}
						{@const globalBridgesServicesGlobalEip8004Resource = selection.$$eip8004Services}
						<ResourceBoundary
							resource={globalBridgesServicesGlobalEip8004Resource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalEip8004({ id, label, open, active })}
						{@const globalBridgesServicesGlobalEip8004Resource = selection.$$eip8004Services}
						<ResourceBoundary
							resource={globalBridgesServicesGlobalEip8004Resource}
						>
							{#snippet children(evmNft)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<EvmNftsView
										selection={globalBridgesServicesGlobalEip8004Resource}
										href={resolve('/services/agents')}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No EIP-8004 services.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
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
								ownsSection: true,
							},
							{
								id: 'global-zerog-chunks',
								label: 'Stored chunks',
								ownsSection: true,
							},
							{
								id: 'global-zerog-proofs',
								label: 'Storage proofs',
								ownsSection: true,
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

					{#snippet MarkerGlobalZerogNodes(_context, Content)}
						{@const globalZerogNodesResource = selection.$$blockheadZeroGStorageNodeStates}
						<ResourceBoundary
							resource={globalZerogNodesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalZerogNodes({ id, label, open, active })}
						{@const globalZerogNodesResource = selection.$$blockheadZeroGStorageNodeStates}
						<ResourceBoundary
							resource={globalZerogNodesResource}
						>
							{#snippet children(blockheadZeroGStorageNodeState)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadZeroGStorageNodeStatesView
										selection={globalZerogNodesResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No 0G storage node states.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalZerogChunks(_context, Content)}
						{@const globalZerogChunksResource = selection.$$blockheadZeroGStoredChunks}
						<ResourceBoundary
							resource={globalZerogChunksResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalZerogChunks({ id, label, open, active })}
						{@const globalZerogChunksResource = selection.$$blockheadZeroGStoredChunks}
						<ResourceBoundary
							resource={globalZerogChunksResource}
						>
							{#snippet children(blockheadZeroGStoredChunk)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadZeroGStoredChunksView
										selection={globalZerogChunksResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No stored chunks.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerGlobalZerogProofs(_context, Content)}
						{@const globalZerogProofsResource = selection.$$blockheadZeroGStorageProofs}
						<ResourceBoundary
							resource={globalZerogProofsResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionGlobalZerogProofs({ id, label, open, active })}
						{@const globalZerogProofsResource = selection.$$blockheadZeroGStorageProofs}
						<ResourceBoundary
							resource={globalZerogProofsResource}
						>
							{#snippet children(blockheadZeroGStorageProof)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<BlockheadZeroGStorageProofsView
										selection={globalZerogProofsResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										emptyText='No storage proofs.'
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>
	{/snippet}
</EntityView>
