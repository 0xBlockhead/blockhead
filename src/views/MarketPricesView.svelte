<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { MarketAssetKind, marketCatalogFieldSources } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Props
	let {
		title = 'Spot quote index',
		open = $bindable(true),
		collapsible = true,
		limit = 400,
		entityFieldReference,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			limit?: number
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MarketPrice>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.MarketPrice}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row is one spot or index reading for a market pair (price, quote clock, provider ids).
		</p>
		<p>
			Open the row for the market page, timestamped quote history, and OHLC ranges. Interval candles live on the OHLC index.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No spot or index quotes in this context yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const market = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						...marketCatalogFieldSources,
					],
					[entityFieldReference.fieldName]: {
						$limit: limit,
					},
				},
			)}
			{@const prices = derive(
				market,
				(market) => {
					const rows: Entity<typeof schema, EntityType.MarketPrice>[] = (
						market[entityFieldReference.fieldName] ?? []
					)
					return (
						Object.values(
							Object.groupBy(
								rows,
								(price) => price[EntityMetaKey.IdKey],
							),
						)
							.flatMap((group) => (
								group == null ?
									[]
								:
									[group[0]]
							))
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.MarketPrice}
				getKey={(row) => stringify(
					row.value[EntityMetaKey.Id],
				)}
				getSortValue={(row) => (
					row.value[EntityMetaKey.Id].$market.$base.kind === MarketAssetKind.Coin ?
						row.value[EntityMetaKey.Id].$market.$base.$coin.coinId
					:
						''
				)}
				placeholderKeys={new SvelteSet<string | number>()}
				open={true}
				resource={prices}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No spot or index quotes in this context yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<MarketPriceView
						entityId={item.value[EntityMetaKey.Id]}
						id={stringify(item.value[EntityMetaKey.Id])}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
