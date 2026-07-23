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
			selection: RegisteredEntityProxyResource<EntityType.MarketPrice>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.MarketPrice>
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
	const marketPrice = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'Market price'
	const viewDomId = $derived('market-price-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	href={
		href ?? (
			selection.entitySelector != null && '$market' in selection.entitySelector
			&& selection.entitySelector.$market != null && 'marketKind' in selection.entitySelector.$market
			&& selection.entitySelector.$market.marketKind != null
			&& selection.entitySelector.$market != null && '$base' in selection.entitySelector.$market
			&& selection.entitySelector.$market.$base != null && 'assetKey' in selection.entitySelector.$market.$base
			&& selection.entitySelector.$market.$base.assetKey != null
			&& selection.entitySelector.$market != null && '$quote' in selection.entitySelector.$market
			&& selection.entitySelector.$market.$quote != null && 'assetKey' in selection.entitySelector.$market.$quote
			&& selection.entitySelector.$market.$quote.assetKey != null
			&& selection.entitySelector.$market != null && '$marketVenue' in selection.entitySelector.$market
			&& selection.entitySelector.$market.$marketVenue != null && 'marketVenueId' in selection.entitySelector.$market.$marketVenue
			&& selection.entitySelector.$market.$marketVenue.marketVenueId != null
			&& selection.entitySelector != null && '$base' in selection.entitySelector
			&& selection.entitySelector.$base != null && 'kind' in selection.entitySelector.$base
			&& selection.entitySelector.$base.kind != null
			&& selection.entitySelector != null && '$quote' in selection.entitySelector
			&& selection.entitySelector.$quote != null && 'kind' in selection.entitySelector.$quote
			&& selection.entitySelector.$quote.kind != null ?
				resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/price', {
			marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
			base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
			quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
			marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
			baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$base.kind)] ?? ''),
			quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$quote.kind)] ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={marketPrice}>
			{#snippet children(entity)}
				<MarketView
					selection={select(EntityType.Market, selection.entitySelector.$market)}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={marketPrice}>
			{#snippet children(entity)}
				<MarketView
					selection={select(EntityType.Market, selection.entitySelector.$market)}
					href=""
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
							selection
								.$$quotes({
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
										(
											marketTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in marketTimestamp[EntityMetaKey.Selector]
											&& marketTimestamp[EntityMetaKey.Selector].timestampMs != null
											&& marketTimestamp[EntityMetaKey.Selector] != null && 'feedKey' in marketTimestamp[EntityMetaKey.Selector]
											&& marketTimestamp[EntityMetaKey.Selector].feedKey != null
											&& marketTimestamp[EntityMetaKey.Selector] != null && '$market' in marketTimestamp[EntityMetaKey.Selector]
											&& marketTimestamp[EntityMetaKey.Selector].$market != null && 'marketKind' in marketTimestamp[EntityMetaKey.Selector].$market
											&& marketTimestamp[EntityMetaKey.Selector].$market.marketKind != null
											&& marketTimestamp[EntityMetaKey.Selector].$market != null && '$base' in marketTimestamp[EntityMetaKey.Selector].$market
											&& marketTimestamp[EntityMetaKey.Selector].$market.$base != null && 'assetKey' in marketTimestamp[EntityMetaKey.Selector].$market.$base
											&& marketTimestamp[EntityMetaKey.Selector].$market.$base.assetKey != null
											&& marketTimestamp[EntityMetaKey.Selector].$market != null && '$quote' in marketTimestamp[EntityMetaKey.Selector].$market
											&& marketTimestamp[EntityMetaKey.Selector].$market.$quote != null && 'assetKey' in marketTimestamp[EntityMetaKey.Selector].$market.$quote
											&& marketTimestamp[EntityMetaKey.Selector].$market.$quote.assetKey != null
											&& marketTimestamp[EntityMetaKey.Selector].$market != null && '$marketVenue' in marketTimestamp[EntityMetaKey.Selector].$market
											&& marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue != null && 'marketVenueId' in marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue
											&& marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue.marketVenueId != null
											&& marketTimestamp[EntityMetaKey.Selector] != null && '$base' in marketTimestamp[EntityMetaKey.Selector]
											&& marketTimestamp[EntityMetaKey.Selector].$base != null && 'kind' in marketTimestamp[EntityMetaKey.Selector].$base
											&& marketTimestamp[EntityMetaKey.Selector].$base.kind != null
											&& marketTimestamp[EntityMetaKey.Selector] != null && '$quote' in marketTimestamp[EntityMetaKey.Selector]
											&& marketTimestamp[EntityMetaKey.Selector].$quote != null && 'kind' in marketTimestamp[EntityMetaKey.Selector].$quote
											&& marketTimestamp[EntityMetaKey.Selector].$quote.kind != null ?
												resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
											timestampMs: String(marketTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
											feedKey: encodeURIComponent(String(marketTimestamp[EntityMetaKey.Selector].feedKey ?? '')),
											marketKind: String(marketTimestamp[EntityMetaKey.Selector].$market.marketKind ?? ''),
											base: String(marketTimestamp[EntityMetaKey.Selector].$market.$base.assetKey ?? ''),
											quote: String(marketTimestamp[EntityMetaKey.Selector].$market.$quote.assetKey ?? ''),
											marketVenue: String(marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(marketTimestamp[EntityMetaKey.Selector].$base.kind)] ?? ''),
											quoteKind: String(marketAssetRouteLabelByKind[String(marketTimestamp[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										})
										:
												undefined
										)
									}
									prefetched={{ ...marketTimestampSelector, ...marketTimestamp }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No latest quote available.</p>
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
						selection={select(EntityType.Market, selection.entitySelector.$market)}
						href={
							(
								selection.entitySelector.$market != null && 'marketKind' in selection.entitySelector.$market
								&& selection.entitySelector.$market.marketKind != null
								&& selection.entitySelector.$market != null && '$base' in selection.entitySelector.$market
								&& selection.entitySelector.$market.$base != null && 'assetKey' in selection.entitySelector.$market.$base
								&& selection.entitySelector.$market.$base.assetKey != null
								&& selection.entitySelector.$market != null && '$quote' in selection.entitySelector.$market
								&& selection.entitySelector.$market.$quote != null && 'assetKey' in selection.entitySelector.$market.$quote
								&& selection.entitySelector.$market.$quote.assetKey != null
								&& selection.entitySelector.$market != null && '$marketVenue' in selection.entitySelector.$market
								&& selection.entitySelector.$market.$marketVenue != null && 'marketVenueId' in selection.entitySelector.$market.$marketVenue
								&& selection.entitySelector.$market.$marketVenue.marketVenueId != null
								&& selection.entitySelector.$market.$base != null && 'kind' in selection.entitySelector.$market.$base
								&& selection.entitySelector.$market.$base.kind != null
								&& selection.entitySelector.$market.$quote != null && 'kind' in selection.entitySelector.$market.$quote
								&& selection.entitySelector.$market.$quote.kind != null ?
									resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
								marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
								base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
								quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
								marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)] ?? ''),
								quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)] ?? ''),
							})
							:
									undefined
							)
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
							selection
								.$parentMarket({
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
										(
											market[EntityMetaKey.Selector] != null && 'marketKind' in market[EntityMetaKey.Selector]
											&& market[EntityMetaKey.Selector].marketKind != null
											&& market[EntityMetaKey.Selector] != null && '$base' in market[EntityMetaKey.Selector]
											&& market[EntityMetaKey.Selector].$base != null && 'assetKey' in market[EntityMetaKey.Selector].$base
											&& market[EntityMetaKey.Selector].$base.assetKey != null
											&& market[EntityMetaKey.Selector] != null && '$quote' in market[EntityMetaKey.Selector]
											&& market[EntityMetaKey.Selector].$quote != null && 'assetKey' in market[EntityMetaKey.Selector].$quote
											&& market[EntityMetaKey.Selector].$quote.assetKey != null
											&& market[EntityMetaKey.Selector] != null && '$marketVenue' in market[EntityMetaKey.Selector]
											&& market[EntityMetaKey.Selector].$marketVenue != null && 'marketVenueId' in market[EntityMetaKey.Selector].$marketVenue
											&& market[EntityMetaKey.Selector].$marketVenue.marketVenueId != null
											&& market[EntityMetaKey.Selector].$base != null && 'kind' in market[EntityMetaKey.Selector].$base
											&& market[EntityMetaKey.Selector].$base.kind != null
											&& market[EntityMetaKey.Selector].$quote != null && 'kind' in market[EntityMetaKey.Selector].$quote
											&& market[EntityMetaKey.Selector].$quote.kind != null ?
												resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
											base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
											quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										})
										:
												undefined
										)
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
				{@const marketPriceMarketTimestampsViewQuotesResource = selection
		.$$quotes({
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
		})}
				<ResourceBoundary
					resource={marketPriceMarketTimestampsViewQuotesResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<Market_TimestampsView
							selection={marketPriceMarketTimestampsViewQuotesResource}
							countResource={marketPriceMarketTimestampsViewQuotesResource.count}
							title='Quote history'
							id='Market_TimestampsView-quotes'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
