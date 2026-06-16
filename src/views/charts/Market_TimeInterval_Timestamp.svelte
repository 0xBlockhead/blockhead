<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { MarketTimeInterval } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import {
		Source,
		marketOhlcCandleSources,
	} from '$/sources/Source.ts'
	import { stringify } from 'devalue'


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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { subscribe } from '$/routes/+layout.svelte'

	const market = subscribe(
		entityFieldReference.entityType,
		entityFieldReference.selector,
		{
			sources: [
				Source.Constants_Internal,
				...marketOhlcCandleSources,
			],
			fields: {
				[entityFieldReference.fieldName]: {
					sources: [...marketOhlcCandleSources],
					limit,
				},
			},
		},
	)

	const marketTimeIntervalTimestamps = derive(
		market,
		(market) => {
			const marketTimeIntervalTimestamps: readonly Entity<typeof schema, EntityType.Market_TimeInterval_Timestamp>[] = (
				market.fields[entityFieldReference.fieldName]?.values ?? []
			)
			const seenSelectorKeys = new Set<string>()
			return (
				marketTimeIntervalTimestamps
					.filter((marketTimeIntervalTimestamp) => {
						const selectorKey = stringify(marketTimeIntervalTimestamp[EntityMetaKey.Selector])
						if (
							seenSelectorKeys.has(selectorKey)
							|| marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.unit !== timeInterval.unit
							|| marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.value !== timeInterval.value
						)
							return false

						seenSelectorKeys.add(selectorKey)
						return true
					})
					.toSorted((left, right) => (
						left[EntityMetaKey.Selector].timestampMs < right[EntityMetaKey.Selector].timestampMs ?
							-1
						: left[EntityMetaKey.Selector].timestampMs > right[EntityMetaKey.Selector].timestampMs ?
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
