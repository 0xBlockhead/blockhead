<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { MarketTimeInterval } from '$/constants/Market.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		title = 'OHLC',
		resource,
		timeInterval,
		limit = 4096,
		priceDecimals = 8,
		stepInlineSize = '0.875rem',
		height = '22rem',
	}: {
		title?: string
		resource: EntityProxyEntitiesResource<typeof schema, EntityType.Market_TimeInterval_Timestamp>
		timeInterval: MarketTimeInterval
		limit?: number
		priceDecimals?: number
		stepInlineSize?: string
		height?: string
	} = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketTimeIntervalTimestampChartCanvas from '$/views/charts/Market_TimeInterval_TimestampChartCanvas.svelte'
</script>


<ResourceBoundary
	resource={resource({
			sources: [
				Source.Coingecko_Rest,
				Source.Coingecko_OpenApi,
				Source.Coinpaprika_OpenApi,
				Source.CoinMarketCap_Rest,
			],
			limit,
		})}
	placeholderText="Loading OHLC candles…"
>
	{#snippet children(marketTimeIntervalTimestamps)}
		{@const points = Object.values(
			Object.groupBy(
				marketTimeIntervalTimestamps.values.filter((point) => (
					point.entitySelector.timeInterval.unit === timeInterval.unit
					&& point.entitySelector.timeInterval.value === timeInterval.value
				)),
				(point) => `${point.entitySelector.timestampMs}:${point.entitySelector.timeInterval.unit}:${point.entitySelector.timeInterval.value}`,
			),
		)
			.flatMap((group) => group == null ? [] : [group[0]])
			.toSorted((left, right) => left.entitySelector.timestampMs - right.entitySelector.timestampMs)}
		{#if points.length}
			<MarketTimeIntervalTimestampChartCanvas
				{points}
				{priceDecimals}
				{stepInlineSize}
				{height}
				{title}
			/>
		{:else}
			<p data-text="muted">
				No OHLC candles for this interval yet.
			</p>
		{/if}
	{/snippet}
</ResourceBoundary>
