<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		title = 'Spot stream',
		open = $bindable(true),
		collapsible = true,
		entityFieldReference,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Market_Timestamp>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
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

	{#snippet body({ open: _bodyOpen })}
		{#if open}
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
					[entityFieldReference.fieldName]: {
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
					const rows: Entity<typeof schema, EntityType.Market_Timestamp>[] = market[entityFieldReference.fieldName] ?? []
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
				{...EntitiesListProps}
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

				{#snippet Item({ item })}
					{@const row = item.value}
					<Market_TimestampView
						entityId={row[EntityMetaKey.Id]}
						id={stringify(row[EntityMetaKey.Id])}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
