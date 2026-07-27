<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.MarketPrice> = $props()

	const titleFallback = 'Market price'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Market_TimestampsView from '$/views/Market_TimestampsView.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketPrice}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price',
			{
				marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId),
				baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)]),
				base: String(selection.entitySelector.$market.$base.assetKey),
				quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)]),
				quote: String(selection.entitySelector.$market.$quote.assetKey),
				marketKind: String(selection.entitySelector.$market.marketKind),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<MarketView
			selection={select(EntityType.Market, selection.entitySelector.$market)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<MarketView
			selection={select(EntityType.Market, selection.entitySelector.$market)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
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
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Parent Market</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$parentMarket}
					>
						{#snippet children(market)}
							<MarketView
								selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
								prefetched={market}
								layout={EntityLayout.Value}
								open={false}
							/>
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
						id='quotes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
