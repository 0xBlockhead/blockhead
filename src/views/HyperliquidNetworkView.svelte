<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidNetwork>, 'prefetched'> = $props()

	const viewDomId = $derived('hyperliquid-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HyperliquidNetwork_TimestampsView from '$/views/HyperliquidNetwork_TimestampsView.svelte'
	import HyperliquidBlocksView from '$/views/HyperliquidBlocksView.svelte'
	import HyperliquidTransactionsView from '$/views/HyperliquidTransactionsView.svelte'
	import HyperliquidValidatorsView from '$/views/HyperliquidValidatorsView.svelte'
	import HyperliquidSpotAssetsView from '$/views/HyperliquidSpotAssetsView.svelte'
	import HyperliquidSpotPairsView from '$/views/HyperliquidSpotPairsView.svelte'
	import HyperliquidPerpMarketsView from '$/views/HyperliquidPerpMarketsView.svelte'
	import HyperliquidVaultsView from '$/views/HyperliquidVaultsView.svelte'
	import HyperliquidBorrowLendReservesView from '$/views/HyperliquidBorrowLendReservesView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'hyperliquid network'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		Hyperliquid
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
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

			{#snippet SectionHyperliquidChainObservations({ id, label })}
				<HyperliquidNetwork_TimestampsView
					selection={
						selection
						.$$timestamps({
							sources: [
								Source.Hyperliquid,
							],
							limit: 16,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidChainBlocks({ id, label })}
				<HyperliquidBlocksView
					selection={
						selection
						.$$blocks({
							sources: [
								Source.Hyperliquid,
							],
							limit: 16,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid blocks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidChainTransactions({ id, label })}
				<HyperliquidTransactionsView
					selection={
						selection
						.$$transactions({
							sources: [
								Source.Hyperliquid,
							],
							limit: 16,
						})
					}
					collapsible={false}
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

			{#snippet SectionHyperliquidValidatorList({ id, label })}
				<HyperliquidValidatorsView
					selection={
						selection
						.$$validators({
							sources: [
								Source.Hyperliquid,
							],
							limit: 16,
						})
					}
					collapsible={false}
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
					{
						id: 'hyperliquid-borrow-lend-reserves',
						label: 'Borrow/lend reserves',
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

			{#snippet SectionHyperliquidSpotAssets({ id, label })}
				<HyperliquidSpotAssetsView
					selection={
						selection
						.$$spotAssets({
							sources: [
								Source.Hyperliquid,
							],
							limit: 16,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid spot assets.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidSpotPairs({ id, label })}
				<HyperliquidSpotPairsView
					selection={
						selection
						.$$spotPairs({
							sources: [
								Source.Hyperliquid,
							],
							limit: 16,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid spot pairs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidPerpMarkets({ id, label })}
				<HyperliquidPerpMarketsView
					selection={
						selection
						.$$perpMarkets({
							sources: [
								Source.Hyperliquid,
							],
							limit: 16,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid perp markets.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidVaults({ id, label })}
				<HyperliquidVaultsView
					selection={
						selection
						.$$vaults({
							sources: [
								Source.Hyperliquid,
							],
							limit: 16,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid vaults.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHyperliquidBorrowLendReserves({ id, label })}
				<HyperliquidBorrowLendReservesView
					selection={
						selection
						.$$borrowLendReserves({
							sources: [
								Source.Hyperliquid,
							],
							limit: 16,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Hyperliquid borrow/lend reserves.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
