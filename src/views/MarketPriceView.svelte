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
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.MarketPrice>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MarketPrice>>
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
	const marketPrice = $derived(selection({
		fields: {
			$parentMarket: true,
		},
	}))
	const titleFallback = $derived('Market price')
	const viewDomId = $derived('market-price-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Market_TimestampsView from '$/views/Market_TimestampsView.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketPrice}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={marketPrice}>
			{#snippet Pending()}
				<MarketView
					selection={select(EntityType.Market, selection.entitySelector.$market)}
					href={
						(selection.entitySelector.$market.marketKind !== undefined && selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.assetKey !== undefined && selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.assetKey !== undefined && selection.entitySelector.$market.$marketVenue !== undefined && selection.entitySelector.$market.$marketVenue.marketVenueId !== undefined && selection.entitySelector.$market.$base.kind !== undefined && selection.entitySelector.$market.$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
							marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
							base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
							quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
							marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
							baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)] ?? ''),
							quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)] ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<MarketView
					selection={select(EntityType.Market, selection.entitySelector.$market)}
					href={
						(selection.entitySelector.$market.marketKind !== undefined && selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.assetKey !== undefined && selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.assetKey !== undefined && selection.entitySelector.$market.$marketVenue !== undefined && selection.entitySelector.$market.$marketVenue.marketVenueId !== undefined && selection.entitySelector.$market.$base.kind !== undefined && selection.entitySelector.$market.$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
							marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
							base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
							quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
							marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
							baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)] ?? ''),
							quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)] ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={marketPrice}>
			{#snippet Pending()}
				<MarketView
					selection={select(EntityType.Market, selection.entitySelector.$market)}
					href={
						(selection.entitySelector.$market.marketKind !== undefined && selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.assetKey !== undefined && selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.assetKey !== undefined && selection.entitySelector.$market.$marketVenue !== undefined && selection.entitySelector.$market.$marketVenue.marketVenueId !== undefined && selection.entitySelector.$market.$base.kind !== undefined && selection.entitySelector.$market.$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
							marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
							base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
							quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
							marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
							baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)] ?? ''),
							quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)] ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<MarketView
					selection={select(EntityType.Market, selection.entitySelector.$market)}
					href={
						(selection.entitySelector.$market.marketKind !== undefined && selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.assetKey !== undefined && selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.assetKey !== undefined && selection.entitySelector.$market.$marketVenue !== undefined && selection.entitySelector.$market.$marketVenue.marketVenueId !== undefined && selection.entitySelector.$market.$base.kind !== undefined && selection.entitySelector.$market.$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
							marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
							base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
							quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
							marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
							baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)] ?? ''),
							quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)] ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Latest quote</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection.$$quotes({
								sources: [
									Source.Coingecko_Rest,
									Source.Coingecko_OpenApi,
									Source.CoinMarketCap_Rest,
									Source.Coinpaprika_OpenApi,
									Source.Defillama_OpenApi,
									Source.Blockscout_Rest,
									Source.Defillama_Rest,
								],
								limit: 1,
								orderBy: [
									[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
								],
							})
						}
					>
						{#snippet children(marketTimestamps)}
							{@const marketTimestamp = marketTimestamps.values[0]}
							{#if marketTimestamp != null}
								{@const marketTimestampSelector = marketTimestamp[EntityMetaKey.Selector]}
								<Market_TimestampView
									selection={
										select(EntityType.Market_Timestamp, marketTimestampSelector, {
											sources: [
												Source.Coingecko_Rest,
												Source.Coingecko_OpenApi,
												Source.CoinMarketCap_Rest,
												Source.Coinpaprika_OpenApi,
												Source.Defillama_OpenApi,
												Source.Blockscout_Rest,
												Source.Defillama_Rest,
											],
										})
									}
									href={
										(marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.marketKind !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base.assetKey !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote.assetKey !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue.marketVenueId !== undefined && marketTimestamp[EntityMetaKey.Selector].$base !== undefined && marketTimestamp[EntityMetaKey.Selector].$base.kind !== undefined && marketTimestamp[EntityMetaKey.Selector].$quote !== undefined && marketTimestamp[EntityMetaKey.Selector].$quote.kind !== undefined && marketTimestamp[EntityMetaKey.Selector].timestampMs !== undefined && marketTimestamp[EntityMetaKey.Selector].feedKey !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
											marketKind: String(marketTimestamp[EntityMetaKey.Selector].$market.marketKind ?? ''),
											base: String(marketTimestamp[EntityMetaKey.Selector].$market.$base.assetKey ?? ''),
											quote: String(marketTimestamp[EntityMetaKey.Selector].$market.$quote.assetKey ?? ''),
											marketVenue: String(marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(marketTimestamp[EntityMetaKey.Selector].$base.kind)] ?? ''),
											quoteKind: String(marketAssetRouteLabelByKind[String(marketTimestamp[EntityMetaKey.Selector].$quote.kind)] ?? ''),
											timestampMs: String(marketTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
											feedKey: String(marketTimestamp[EntityMetaKey.Selector].feedKey ?? ''),
										}) : undefined)
									}
									prefetched={{ ...marketTimestampSelector, ...marketTimestamp }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Market</dt>
				<dd>
					<MarketView
						selection={select(EntityType.Market, selection.entitySelector.$market, {})}
						href={
							(selection.entitySelector.$market.marketKind !== undefined && selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.assetKey !== undefined && selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.assetKey !== undefined && selection.entitySelector.$market.$marketVenue !== undefined && selection.entitySelector.$market.$marketVenue.marketVenueId !== undefined && selection.entitySelector.$market.$base.kind !== undefined && selection.entitySelector.$market.$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
								marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
								base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
								quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
								marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)] ?? ''),
								quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)] ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Parent Market</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection.$parentMarket({
								sources: [
									Source.Constants_Internal,
									Source.Coingecko_Rest,
									Source.Coingecko_OpenApi,
									Source.CoinMarketCap_Rest,
									Source.Coinpaprika_OpenApi,
									Source.Defillama_OpenApi,
									Source.Defillama_Rest,
								],
							})
						}
					>
						{#snippet children(market)}
							{#if market != null && market[EntityMetaKey.Selector] != null}
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(market[EntityMetaKey.Selector].marketKind !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.assetKey !== undefined && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.assetKey !== undefined && market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
											base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
											quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<Market_TimestampsView
				selection={
						selection.$$quotes({
							sources: [
								Source.Coingecko_Rest,
								Source.Coingecko_OpenApi,
								Source.CoinMarketCap_Rest,
								Source.Coinpaprika_OpenApi,
								Source.Defillama_OpenApi,
								Source.Blockscout_Rest,
								Source.Defillama_Rest,
							],
							limit: 64,
							count: true,
						})
					}
				title='Quote history'
				emptyText='No market quotes yet.'
				id='Market_TimestampsView-quotes'
			/>
		{/if}
	{/snippet}
</EntityView>
