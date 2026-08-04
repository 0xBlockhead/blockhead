<script lang="ts">
	// Types/constants
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { MarketTimeInterval } from '$/constants/Market.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'

	type MarketTimeIntervalTimestampPoint = (
		& SubscribeEntityReferenceResult<typeof schema, EntityType.Market_TimeInterval_Timestamp>
		& {
			entitySelector: {
				timestampMs: number
				timeInterval: MarketTimeInterval
			}
			open: bigint | number
			high: bigint | number
			low: bigint | number
			close: bigint | number
		}
	)


	// State
	let {
		title = 'OHLC',
		resource,
		timeInterval,
		limit = 4096,
		sources = [
			Source.Coingecko_Rest,
			Source.Coinpaprika_Rest,
			Source.CoinMarketCap_Rest,
		],
		priceDecimals = 8,
		stepInlineSize = '0.875rem',
		height = '22rem',
	}: {
		title?: string
		resource: EntityProxyEntitiesResource<typeof schema, EntityType.Market_TimeInterval_Timestamp>
		timeInterval: MarketTimeInterval
		limit?: number
		sources?: readonly Source[]
		priceDecimals?: number
		stepInlineSize?: string
		height?: string
	} = $props()


	// Functions
	const isCompleteOhlcPoint = (
		point: SubscribeEntityReferenceResult<typeof schema, EntityType.Market_TimeInterval_Timestamp>
	): point is MarketTimeIntervalTimestampPoint => (
		point.open != null
		&& point.high != null
		&& point.low != null
		&& point.close != null
		&& 'timestampMs' in point.entitySelector
		&& 'timeInterval' in point.entitySelector
	)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketTimeIntervalTimestampChartCanvas from '$/views/charts/Market_TimeInterval_TimestampChartCanvas.svelte'
</script>


<ResourceBoundary
	resource={resource({
		sources: [...sources],
		fields: {
			open: true,
			high: true,
			low: true,
			close: true,
			timeInterval: true,
			timestampMs: true,
		},
		limit,
	})}
	placeholderText="Loading OHLC candles…"
>
	{#snippet children(marketTimeIntervalTimestamps)}
		{@const points = Object.values(
			Object.groupBy(
				marketTimeIntervalTimestamps.values
					.filter(isCompleteOhlcPoint)
					.filter((point) => (
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
			<p data-text="muted" data-section-state="resolved-empty">
				No OHLC candles for this interval.
			</p>
		{/if}
	{/snippet}
</ResourceBoundary>
