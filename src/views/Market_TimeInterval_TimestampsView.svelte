<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { RegisteredEntitySelector } from '$/schema/index.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title = 'OHLC',
		placeholderText = 'Loading OHLC candles...',
		open = $bindable(true),
		timeInterval,
		limit = 4096,
		...EntitiesListProps
	}: EntityListViewProps<
		EntityType.Market_TimeInterval_Timestamp,
		{
			timeInterval?: RegisteredEntitySelector<EntityType.Market_TimeInterval_Timestamp>['timeInterval']
			limit?: number
		}
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Candles sit on interval boundaries: open, high, low, close for each bucket start.
	</p>

	<p>
		Candles load from schema defaultSources on the parent market row (Coingecko, Coinpaprika, CoinMarketCap).
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Market_TimeInterval_Timestamp}
	{title}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Coingecko_Rest,
				Source.Coinpaprika_Rest,
				Source.CoinMarketCap_Rest,
			],
			fields: {
				timeInterval: true,
				close: true,
				timestampMs: true,
			},
			limit,
		})
	}
	getResourceItems={
		(marketTimeIntervalTimestamps) => marketTimeIntervalTimestamps.values.filter(
			(marketTimeIntervalTimestamp) => (
				timeInterval == null
				|| (
					marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.unit === timeInterval.unit
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.value === timeInterval.value
				)
			)
		)
	}
	{placeholderText}
>
	{#snippet Item({ item: marketTimeIntervalTimestamp })}
		{@const marketTimeIntervalTimestampSelector = marketTimeIntervalTimestamp[EntityMetaKey.Selector]}
		{@const market = marketTimeIntervalTimestampSelector.$market}
		<EntityView
			entityType={EntityType.Market_TimeInterval_Timestamp}
			entitySelector={marketTimeIntervalTimestampSelector}
			href={
				resolve(
					'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]',
					{
						marketVenue: market.$marketVenue.marketVenueId,
						baseKind: marketAssetRouteLabelByKind[market.$base.kind],
						base: market.$base.assetKey,
						quoteKind: marketAssetRouteLabelByKind[market.$quote.kind],
						quote: market.$quote.assetKey,
						marketKind: market.marketKind,
						timeIntervalUnit: marketTimeIntervalTimestampSelector.timeInterval.unit,
						timeIntervalValue: String(marketTimeIntervalTimestampSelector.timeInterval.value),
						timestampMs: String(marketTimeIntervalTimestampSelector.timestampMs),
					}
				)
			}
		>
			{#snippet Title()}
				{`${marketTimeIntervalTimestampSelector.timeInterval.value}${marketTimeIntervalTimestampSelector.timeInterval.unit}` || 'OHLC candle'}
			{/snippet}

			{#snippet Value()}
				{marketTimeIntervalTimestamp.close ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{marketTimeIntervalTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
