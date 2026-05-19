<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { coinById } from '$/constants/Coin.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'Quotes',
		open = $bindable(true),
		limit = 400,
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			limit?: number
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MarketPrice>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const fieldName = entityFieldReference.fieldName

	const marketsParentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				...(
					open ?
						[
							Source.Coingecko_Rest,
							Source.CoinMarketCap_Rest,
							Source.Coinpaprika_OpenApi,
							Source.Defillama_OpenApi,
							Source.TradingView_Rest,
						]
					:
						[]
				),
			],
			...(open && {
				[fieldName]: {
					$limit: limit,
				},
			}),
		},
	)

	const prices = derive(
		marketsParentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.MarketPrice>[] = (
				merged[fieldName] ?? []
			)
			return (
				Object.values(
					Object.groupBy(
						rows,
						(priceRow) => priceRow[EntityMetaKey.IdKey],
					),
				)
					.flatMap((group) => (
						group == null ?
							[]
						:
							[group[0]]
					))
					.toSorted((a, b) => (
						a[EntityMetaKey.IdKey].localeCompare(b[EntityMetaKey.IdKey])
					))
					.map((value) => ({
						value,
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import Tooltip from '$/components/Tooltip.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
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
	resource={prices}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
					<p>
						These rows are single snapshots or index readings for a market (price, clock, identifiers).
					</p>
					<p>
						Interval OHLC candles are separate entities tied to the same market with a time bucket.
					</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No point-in-time quotes yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			<MarketPriceView
				entityId={props.item.value[EntityMetaKey.Id]}
				href={(
					props.item.value[EntityMetaKey.Id].$market.$base.kind !== MarketAssetKind.Coin ?
						undefined
					: coinById[props.item.value[EntityMetaKey.Id].$market.$base.$coin.coinId] == null ?
						undefined
					:	resolve(
							'/(assets)/(coins)/coin/[coinId]',
							{ coinId: props.item.value[EntityMetaKey.Id].$market.$base.$coin.coinId },
						)
				)}
				id={stringify(props.item.value[EntityMetaKey.Id])}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
