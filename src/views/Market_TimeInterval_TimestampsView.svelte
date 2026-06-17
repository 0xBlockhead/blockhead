<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { MarketTimeInterval } from '$/constants/Market.ts'
	import { marketOhlcCandleSources } from '$/sources/Source.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		title = 'OHLC',
		open = $bindable(true),
		collapsible = true,
		limit = 4096,
		timeInterval,
		entityFieldReference,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			limit?: number
			timeInterval?: MarketTimeInterval
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.Market_TimeInterval_Timestamp
			>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	import { proxy } from '$/routes/+layout.svelte'


	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Market_TimeInterval_TimestampView from '$/views/Market_TimeInterval_TimestampView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.Market_TimeInterval_Timestamp}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Candle marketTimeIntervalTimestamps sit on interval boundaries: open, high, low, close for each bucket start.
		</p>
		<p>
			Candles load from every configured OHLC provider on the parent market row (Coingecko, Coinpaprika, CoinMarketCap, …).
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No OHLC candles yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector,
					).field(entityFieldReference.fieldName, {
						sources: [...marketOhlcCandleSources],
						limit,
					})}
				placeholderText="Loading OHLC candles…"
			>
				{#snippet children(points)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.Market_TimeInterval_Timestamp}
						getKey={(marketTimeIntervalTimestamp) => stringify(marketTimeIntervalTimestamp.entitySelector)}
						getSortValue={(marketTimeIntervalTimestamp) => -marketTimeIntervalTimestamp.entitySelector.timestampMs}
						placeholderKeys={new SvelteSet<string>()}
						open={true}
						items={Object.values(
							Object.groupBy(
								points.entities.filter((point) => (
									timeInterval == null
									|| (
										point.entitySelector.timeInterval.unit === timeInterval.unit
										&& point.entitySelector.timeInterval.value === timeInterval.value
									)
								)),
								(point) => stringify(point.entitySelector),
							),
						)
							.flatMap((group) => group == null ? [] : [group[0]])}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No OHLC candles yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<Market_TimeInterval_TimestampView
								selector={item.entitySelector}
								id={stringify(item.entitySelector)}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
