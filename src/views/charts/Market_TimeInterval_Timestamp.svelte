<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { MarketTimeInterval } from '$/constants/Market.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import {
		Source,
		marketOhlcCandleSources,
	} from '$/sources/Source.ts'


	// State
	let {
		title = 'OHLC',
		entityFieldReference,
		timeInterval,
		limit = 4096,
		priceDecimals = 8,
		stepInlineSize = '0.875rem',
		height = '22rem',
	}: {
		title?: string
		entityFieldReference: EntityFieldReference<
			typeof schema,
			EntityType.Market_TimeInterval_Timestamp
		>
		timeInterval: MarketTimeInterval
		limit?: number
		priceDecimals?: number
		stepInlineSize?: string
		height?: string
	} = $props()

	import { proxy } from '$/routes/+layout.svelte'

	


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketTimeIntervalTimestampChartCanvas from '$/views/charts/Market_TimeInterval_TimestampChartCanvas.svelte'
</script>


<ResourceBoundary
	resource={proxy(
			entityFieldReference.entityType,
			entityFieldReference.selector,
			{
				sources: [
					Source.Constants_Internal,
					...marketOhlcCandleSources,
				],
			}
		).field(entityFieldReference.fieldName, {
			sources: [...marketOhlcCandleSources],
			limit,
		})}
	placeholderText="Loading OHLC candles…"
>
	{#snippet children(marketTimeIntervalTimestamps)}
		{@const points = Object.values(
			Object.groupBy(
				marketTimeIntervalTimestamps.entities.filter((point) => (
					point.entitySelector.timeInterval.unit === timeInterval.unit
					&& point.entitySelector.timeInterval.value === timeInterval.value
				)),
				(point) => `${point.entitySelector.timestampMs}:${point.entitySelector.timeInterval.unit}:${point.entitySelector.timeInterval.value}`,
			),
		)
			.flatMap((group) => group == null ? [] : [group[0]])
			.toSorted((left, right) => left.entitySelector.timestampMs - right.entitySelector.timestampMs)}
		{#if points.length}
			{@const chartMin = Math.min(
				...points.map((point) => (
					Number(point.current?.low ?? point.current?.close ?? point.current?.open ?? 0n) / (10 ** priceDecimals)
				)),
			)}
			{@const chartMax = Math.max(
				...points.map((point) => (
					Number(point.current?.high ?? point.current?.close ?? point.current?.open ?? 1n) / (10 ** priceDecimals)
				)),
			)}
			<MarketTimeIntervalTimestampChartCanvas
				max={chartMax}
				min={chartMin}
				points={points}
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
