<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { marketOhlcCandleSources, type MarketTimeInterval } from '$/constants/Market.ts'
	import {
		dedupeCandleEntitiesById,
		marketTimeIntervalsEqual,
	} from '$/lib/marketOhlcCandles.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'OHLC',
		open = $bindable(true),
		collapsible = true,
		limit = 4096,
		timeInterval,
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			limit?: number
			timeInterval?: MarketTimeInterval
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.Market_TimeInterval_Timestamp
			>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import Market_TimeInterval_TimestampView from '$/views/Market_TimeInterval_TimestampView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	{collapsible}
	entityType={EntityType.Market_TimeInterval_Timestamp}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Candle rows sit on interval boundaries: open, high, low, close for each bucket start.
		</p>
		<p>
			They differ from tick-level spot quotes, which are timestamped prints rather than rolled OHLC.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No OHLC candles yet.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const market = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
						...marketOhlcCandleSources,
					],
					[fieldName]: {
						$limit: limit,
					},
				},
			)}
			{@const points = derive(
				market,
				(market) => {
					const rows: Entity<typeof schema, EntityType.Market_TimeInterval_Timestamp>[] = (
						market[fieldName] ?? []
					)
					return (
						(
							timeInterval == null ?
								dedupeCandleEntitiesById(rows)
							:	dedupeCandleEntitiesById(rows).filter((row) => (
								marketTimeIntervalsEqual(
									row[EntityMetaKey.Id].timeInterval,
									timeInterval,
								)
							))
						)
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
				getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
				getSortValue={(row) => -row.value[EntityMetaKey.Id].timestampMs}
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

				{#snippet Item(props)}
					{#if props.item}
						{@const row = props.item.value}
						<Market_TimeInterval_TimestampView
							entityId={row[EntityMetaKey.Id]}
							href={resolve('/(assets)/(markets)/market/[marketKey]', {
								marketKey: encodeURIComponent(stringify(row[EntityMetaKey.Id].$market)),
							})}
							id={stringify(row[EntityMetaKey.Id])}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
