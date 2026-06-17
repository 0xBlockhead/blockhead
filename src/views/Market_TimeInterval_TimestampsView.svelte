<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const market = subscribe(
				entityFieldReference.entityType,
				entityFieldReference.selector,
				{
					fields: {
						[entityFieldReference.fieldName]: {
							sources: [...marketOhlcCandleSources],
							limit,
						},
					},
				},
			)}
			{@const points = derive(
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
									|| (
										timeInterval != null
										&& (
											marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.unit !== timeInterval.unit
											|| marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.value !== timeInterval.value
										)
									)
								)
									return false

								seenSelectorKeys.add(selectorKey)
								return true
							})
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Market_TimeInterval_Timestamp}
				getKey={(marketTimeIntervalTimestamp) => stringify(marketTimeIntervalTimestamp.value[EntityMetaKey.Selector])}
				getSortValue={(marketTimeIntervalTimestamp) => -marketTimeIntervalTimestamp.value[EntityMetaKey.Selector].timestampMs}
				placeholderKeys={new SvelteSet<string>()}
				open={true}
				resource={points}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No OHLC candles yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const row = item.value}
					<Market_TimeInterval_TimestampView
						selector={row[EntityMetaKey.Selector]}
						id={stringify(row[EntityMetaKey.Selector])}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
