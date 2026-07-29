<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HyperliquidNetwork> = $props()

	const titleFallback = 'hyperliquid network'
	const viewDomId = $derived('hyperliquid-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HyperliquidNetwork_TimestampsView from '$/views/HyperliquidNetwork_TimestampsView.svelte'
	import HyperliquidBlocksView from '$/views/HyperliquidBlocksView.svelte'
	import HyperliquidTransactionsView from '$/views/HyperliquidTransactionsView.svelte'
	import HyperliquidValidatorsView from '$/views/HyperliquidValidatorsView.svelte'
	import HyperliquidSpotAssetsView from '$/views/HyperliquidSpotAssetsView.svelte'
	import HyperliquidSpotPairsView from '$/views/HyperliquidSpotPairsView.svelte'
	import HyperliquidPerpMarketsView from '$/views/HyperliquidPerpMarketsView.svelte'
	import HyperliquidVaultsView from '$/views/HyperliquidVaultsView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		{titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-hyperliquid-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hyperliquid-chain-observations',
						label: 'Observations',
					},
					{
						id: 'hyperliquid-chain-blocks',
						label: 'Blocks',
					},
					{
						id: 'hyperliquid-chain-transactions',
						label: 'Transactions',
					},
				]
			}
			data-card
			class='network-view-collapsible-chain-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Chain activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHyperliquidChainObservations({ id, label, open })}
				<HyperliquidNetwork_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Hyperliquid network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidChainBlocks({ id, label, open })}
				<HyperliquidBlocksView
					selection={selection.$$blocks}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Hyperliquid blocks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidChainTransactions({ id, label, open })}
				<HyperliquidTransactionsView
					selection={selection.$$transactions}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Hyperliquid transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-hyperliquid-validators'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hyperliquid-validator-list',
						label: 'Validators',
					},
				]
			}
			data-card
			class='network-view-collapsible-validators'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Validators</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHyperliquidValidatorList({ id, label, open })}
				<HyperliquidValidatorsView
					selection={selection.$$validators}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Hyperliquid validators.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-hyperliquid-markets'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hyperliquid-spot-assets',
						label: 'Spot assets',
					},
					{
						id: 'hyperliquid-spot-pairs',
						label: 'Spot pairs',
					},
					{
						id: 'hyperliquid-perp-markets',
						label: 'Perp markets',
					},
					{
						id: 'hyperliquid-vaults',
						label: 'Vaults',
					},
				]
			}
			data-card
			class='network-view-collapsible-markets'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Markets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHyperliquidSpotAssets({ id, label, open })}
				<HyperliquidSpotAssetsView
					selection={selection.$$spotAssets}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Hyperliquid spot assets.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidSpotPairs({ id, label, open })}
				<HyperliquidSpotPairsView
					selection={selection.$$spotPairs}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Hyperliquid spot pairs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidPerpMarkets({ id, label, open })}
				<HyperliquidPerpMarketsView
					selection={selection.$$perpMarkets}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Hyperliquid perp markets.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidVaults({ id, label, open })}
				<HyperliquidVaultsView
					selection={selection.$$vaults}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Hyperliquid vaults.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
