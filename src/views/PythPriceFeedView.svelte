<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.PythPriceFeed> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.PythBenchmarks_Rest,
			Source.PythHermes_Rest,
			Source.Pyth_EvmContract,
			Source.Pyth_SolanaProgram,
		],
	}))
	const pythPriceFeed = $derived(viewSelection({
		fields: {
			symbol: true,
		},
	}))
	const titleFallback = $derived((prefetched.symbol ?? '') || selection.entitySelector.priceFeedId || 'Pyth price feed')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import PythPriceFeed_TimestampsView from '$/views/PythPriceFeed_TimestampsView.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.PythPriceFeed}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={pythPriceFeed}>
			{#snippet children(entity)}
				{(entity.symbol ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.channel || (prefetched.symbol ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$market}
		>
			{#snippet children(market)}
				{#if market != null}
					<span data-text="muted">
						<MarketView
							selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
							prefetched={market}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Price feed ID</dt>
				<dd>
					{selection.entitySelector.priceFeedId}
				</dd>
			</div>

			<div>
				<dt>Channel</dt>
				<dd>
					{selection.entitySelector.channel}
				</dd>
			</div>

			<ResourceBoundary
				resource={pythPriceFeed}
			>
				{#snippet children(entity)}
					{@const symbol = entity.symbol}
					{#if symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{symbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							assetClass: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetClass = entity.assetClass}
					{#if assetClass != null}
						<div>
							<dt>Asset class</dt>
							<dd>
								{assetClass}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							baseAsset: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const baseAsset = entity.baseAsset}
					{#if baseAsset != null}
						<div>
							<dt>Base asset</dt>
							<dd>
								{baseAsset}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							quoteAsset: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quoteAsset = entity.quoteAsset}
					{#if quoteAsset != null}
						<div>
							<dt>Quote asset</dt>
							<dd>
								{quoteAsset}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$market}
			>
				{#snippet children(market)}
					{#if market != null}
						<div>
							<dt>Market</dt>
							<dd>
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<PythPriceFeed_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
