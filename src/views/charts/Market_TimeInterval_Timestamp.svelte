<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { MarketTimeInterval } from '$/constants/Market.ts'
	import { marketOhlcCandleSources } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
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


	// State
	import {
		dedupeCandleEntitiesById,
		marketTimeIntervalsEqual,
	} from '$/lib/marketOhlcCandles.ts'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const market = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				...marketOhlcCandleSources,
			],
			[entityFieldReference.fieldName]: {
				$: [...marketOhlcCandleSources],
				$limit: limit,
			},
		},
	)

	const marketTimeIntervalTimestamps = derive(
		market,
		(market) => {
			const rows: Entity<typeof schema, EntityType.Market_TimeInterval_Timestamp>[] = (
				market[entityFieldReference.fieldName] ?? []
			)
			return (
				dedupeCandleEntitiesById(rows)
					.filter((row) => (
						marketTimeIntervalsEqual(
							row[EntityMetaKey.Id].timeInterval,
							timeInterval,
						)
					))
					.toSorted((left, right) => (
						left[EntityMetaKey.Id].timestampMs < right[EntityMetaKey.Id].timestampMs ?
							-1
						: left[EntityMetaKey.Id].timestampMs > right[EntityMetaKey.Id].timestampMs ?
							1
						:
							0
					))
			)
		},
	)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketTimeIntervalTimestampChartCanvas from '$/views/charts/Market_TimeInterval_TimestampChartCanvas.svelte'
</script>


<ResourceBoundary
	resource={marketTimeIntervalTimestamps}
	placeholderText="Loading OHLC candles…"
>
	{#snippet children(marketTimeIntervalTimestamps)}
		{#if marketTimeIntervalTimestamps.length}
			{@const chartMin = Math.min(
				...marketTimeIntervalTimestamps.map((point) => (
					Number(point.low ?? point.close ?? point.open ?? 0n) / (10 ** priceDecimals)
				)),
			)}
			{@const chartMax = Math.max(
				...marketTimeIntervalTimestamps.map((point) => (
					Number(point.high ?? point.close ?? point.open ?? 1n) / (10 ** priceDecimals)
				)),
			)}
			<MarketTimeIntervalTimestampChartCanvas
				max={chartMax}
				min={chartMin}
				points={marketTimeIntervalTimestamps}
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
