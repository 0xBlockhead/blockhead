<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'Spot stream',
		open = $bindable(true),
		collapsible = true,
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Market_Timestamp>
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
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	{collapsible}
	entityType={EntityType.Market_Timestamp}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row is a timestamped spot or index observation for the quoted base/against pair.
		</p>
		<p>
			OHLC interval candles use separate entities with an explicit time bucket.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No spot quotes yet.
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
						Source.Blockscout_Rest,
						Source.Coingecko_Rest,
						Source.Coingecko_OpenApi,
						Source.CoinMarketCap_Rest,
						Source.Coinpaprika_OpenApi,
						Source.Defillama_OpenApi,
						Source.TradingView_Rest,
					],
					[fieldName]: {
						$: [
							Source.Blockscout_Rest,
							Source.Coingecko_Rest,
							Source.Coingecko_OpenApi,
							Source.CoinMarketCap_Rest,
							Source.Coinpaprika_OpenApi,
							Source.Defillama_OpenApi,
							Source.TradingView_Rest,
						],
						$limit: 2048,
					},
				},
			)}
			{@const quotes = derive(
				market,
				(market) => {
					const rows: Entity<typeof schema, EntityType.Market_Timestamp>[] = market[fieldName] ?? []
					return (
						rows
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				{...entitiesListRest}
				entityType={EntityType.Market_Timestamp}
				getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
				getSortValue={(row) => String(row.value[EntityMetaKey.Id].timestampMs)}
				placeholderKeys={new SvelteSet<string>()}
				resource={quotes}
				{title}
				open={true}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No spot quotes yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						{@const row = props.item.value}
						<Market_TimestampView
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
