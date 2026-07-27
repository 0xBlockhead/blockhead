<!-- Generated from APP.ts. Do not edit by hand. -->

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
		...EntitiesListProps
	}: EntityListViewProps<
		EntityType.Market_TimeInterval_Timestamp,
		{
			timeInterval?: RegisteredEntitySelector<EntityType.Market_TimeInterval_Timestamp>['timeInterval']
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
		Candles load from every declared OHLC provider on the parent market row (Coingecko, Coinpaprika, CoinMarketCap, …).
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
				Source.Coingecko_OpenApi,
				Source.Coinpaprika_OpenApi,
				Source.CoinMarketCap_Rest,
			],
			fields: {
				timeInterval: true,
				close: true,
				timestampMs: true,
			},
			limit: 4096,
		})
	}
	getResourceItems={(marketTimeIntervalTimestamps) => marketTimeIntervalTimestamps.values.filter((marketTimeIntervalTimestamp) => (timeInterval == null || (marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.unit === timeInterval.unit && marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.value === timeInterval.value)))}
	{placeholderText}
>
	{#snippet Item({ item: marketTimeIntervalTimestamp })}
		{@const marketTimeIntervalTimestampSelector = marketTimeIntervalTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Market_TimeInterval_Timestamp}
			entitySelector={marketTimeIntervalTimestampSelector}
			href={
				resolve(
					'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]',
					{
						marketVenue: String(marketTimeIntervalTimestampSelector.$market.$marketVenue.marketVenueId),
						baseKind: String(marketAssetRouteLabelByKind[String(marketTimeIntervalTimestampSelector.$market.$base.kind)]),
						base: String(marketTimeIntervalTimestampSelector.$market.$base.assetKey),
						quoteKind: String(marketAssetRouteLabelByKind[String(marketTimeIntervalTimestampSelector.$market.$quote.kind)]),
						quote: String(marketTimeIntervalTimestampSelector.$market.$quote.assetKey),
						marketKind: String(marketTimeIntervalTimestampSelector.$market.marketKind),
						timeIntervalUnit: String(marketTimeIntervalTimestampSelector.timeInterval.unit),
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
				{String(marketTimeIntervalTimestamp.close ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(marketTimeIntervalTimestampSelector.timestampMs)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
