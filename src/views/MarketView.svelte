<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { marketAssetRouteLabelByKind, MarketKind, marketKindByMarketKind } from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
	import MarketAssetView from '$/views/MarketAssetView.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


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
			selection: EntityProxyResource<typeof schema, EntityType.Market>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Market>>
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
	const market = $derived(selection({}))
	const titleFallback = $derived('Market')
	const viewDomId = $derived('market-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
	import Market_Derivative_TimestampsView from '$/views/Market_Derivative_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.Market}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.marketKind !== undefined && pendingEntity.$base !== undefined && pendingEntity.$base.assetKey !== undefined && pendingEntity.$quote !== undefined && pendingEntity.$quote.assetKey !== undefined && pendingEntity.$marketVenue !== undefined && pendingEntity.$marketVenue.marketVenueId !== undefined && pendingEntity.$base.kind !== undefined && pendingEntity.$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
			marketKind: String(pendingEntity.marketKind ?? ''),
			base: String(pendingEntity.$base.assetKey ?? ''),
			quote: String(pendingEntity.$quote.assetKey ?? ''),
			marketVenue: String(pendingEntity.$marketVenue.marketVenueId ?? ''),
			baseKind: String(marketAssetRouteLabelByKind[String(pendingEntity.$base.kind)] ?? ''),
			quoteKind: String(marketAssetRouteLabelByKind[String(pendingEntity.$quote.kind)] ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.$marketVenue.marketVenueId}:{selection.entitySelector.$base.assetKey}-{selection.entitySelector.$quote.assetKey}
		{#if selection.entitySelector.marketKind !== MarketKind.Spot}
			{String(marketKindByMarketKind[String(selection.entitySelector.marketKind)].label)}
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<section data-column="gap-2">
			<dl data-column-item="center">
				<div>
					<dt>Kind</dt>
					<dd>
						{String(marketKindByMarketKind[String(selection.entitySelector.marketKind)].label)}
					</dd>
				</div>

				<div>
					<dt>Venue</dt>
					<dd>
						<MarketVenueView
							href={resolve('/market-venue/[marketVenueId=marketVenueId]', {
								marketVenueId: String(selection.entitySelector.$marketVenue.marketVenueId),
							})}
							selection={select(EntityType.MarketVenue, selection.entitySelector.$marketVenue)}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
							open={false}
						/>
					</dd>
				</div>

				{#if (
					contentOpen
					&& selection.entitySelector.marketKind !== MarketKind.Spot
				)}
					<div>
						<dt>Latest derivative observation</dt>
						<dd>
							<ResourceBoundary
								resource={selection.$$derivativeTimestamps({
									sources: [
										Source.Coingecko_OpenApi,
									],
									limit: 64,
								})}
							>
								{#snippet children(derivativeTimestamps)}
									{@const derivativeTimestamp = derivativeTimestamps.values.at(0)}
									{#if derivativeTimestamp != null}
										<Market_Derivative_TimestampView
											selection={select(EntityType.Market_Derivative_Timestamp, derivativeTimestamp[EntityMetaKey.Selector])}
											layout={EntityLayout.Value}
											showTypeAnnotation={false}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				<div>
					<dt>Base</dt>
					<dd>
						<MarketAssetView
							selection={select(EntityType.MarketAsset, selection.entitySelector.$base)}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
							open={false}
						/>
					</dd>
				</div>

				<div>
					<dt>Quote</dt>
					<dd>
						<MarketAssetView
							selection={select(EntityType.MarketAsset, selection.entitySelector.$quote)}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
							open={false}
						/>
					</dd>
				</div>
			</dl>
		</section>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-market-spot'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'market-prices',
							label: 'Spot',
						},
						{
							id: 'market-ohlc',
							label: 'Candles',
						},
					]
				}
				data-card
				class='network-view-collapsible-spot'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Spot</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionMarketPrices({ id, label, open })}
					{#if pendingEntity.marketKind !== undefined && pendingEntity.marketKind === 'Spot'}
					<MarketPricesView
						selection={
							selection.$$marketPrices({
								sources: [
									Source.Constants_Internal,
									Source.Coingecko_Rest,
									Source.Coingecko_OpenApi,
									Source.CoinMarketCap_Rest,
									Source.Coinpaprika_OpenApi,
									Source.Defillama_OpenApi,
									Source.Blockscout_Rest,
									Source.Defillama_Rest,
								],
								count: true,
							})
						}
						href={resolve('/coins/prices')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No spot market prices.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
					{:else if pendingEntity.marketKind === undefined}
						<ResourceBoundary
							resource={
								selection({
									fields: {
										marketKind: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{#if resolvedEntity.marketKind === 'Spot'}
									<MarketPricesView
										selection={
											selection.$$marketPrices({
												sources: [
													Source.Constants_Internal,
													Source.Coingecko_Rest,
													Source.Coingecko_OpenApi,
													Source.CoinMarketCap_Rest,
													Source.Coinpaprika_OpenApi,
													Source.Defillama_OpenApi,
													Source.Blockscout_Rest,
													Source.Defillama_Rest,
												],
												count: true,
											})
										}
										href={resolve('/coins/prices')}
										CollapsibleProps={{ canToggle: false }}
										emptyText='No spot market prices.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}

				{#snippet SectionMarketOhlc({ id, label, open })}
					{#if pendingEntity.marketKind !== undefined && pendingEntity.marketKind === 'Spot'}
					<Market_TimeInterval_TimestampsView
						selection={
							selection.$$marketTimeIntervalTimestamps({
								sources: [
									Source.Coingecko_Rest,
									Source.Coingecko_OpenApi,
									Source.Coinpaprika_OpenApi,
									Source.CoinMarketCap_Rest,
								],
								count: true,
							})
						}
						href={resolve('/coins/candles')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No OHLC candles.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
					{:else if pendingEntity.marketKind === undefined}
						<ResourceBoundary
							resource={
								selection({
									fields: {
										marketKind: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{#if resolvedEntity.marketKind === 'Spot'}
									<Market_TimeInterval_TimestampsView
										selection={
											selection.$$marketTimeIntervalTimestamps({
												sources: [
													Source.Coingecko_Rest,
													Source.Coingecko_OpenApi,
													Source.Coinpaprika_OpenApi,
													Source.CoinMarketCap_Rest,
												],
												count: true,
											})
										}
										href={resolve('/coins/candles')}
										CollapsibleProps={{ canToggle: false }}
										emptyText='No OHLC candles.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-market-derivatives'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'market-derivative-timestamps',
							label: 'Derivative observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-derivatives'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Derivative observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionMarketDerivativeTimestamps({ id, label, open })}
					{#if pendingEntity.marketKind !== undefined && pendingEntity.marketKind !== 'Spot'}
					<Market_Derivative_TimestampsView
						selection={
							selection.$$derivativeTimestamps({
								sources: [
									Source.Coingecko_OpenApi,
								],
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No derivative observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
					{:else if pendingEntity.marketKind === undefined}
						<ResourceBoundary
							resource={
								selection({
									fields: {
										marketKind: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{#if resolvedEntity.marketKind !== 'Spot'}
									<Market_Derivative_TimestampsView
										selection={
											selection.$$derivativeTimestamps({
												sources: [
													Source.Coingecko_OpenApi,
												],
												count: true,
											})
										}
										CollapsibleProps={{ canToggle: false }}
										emptyText='No derivative observations.'
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
