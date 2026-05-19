<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { formatMarketIdLabel } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { marketCatalogFieldSources } from '$/constants/Market.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'Spot quote index',
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

	const market = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				...(
					open ?
						[...marketCatalogFieldSources]
					:
						[Source.Constants_Internal]
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
		market,
		(market) => {
			const rows: Entity<typeof schema, EntityType.MarketPrice>[] = (
				market[fieldName] ?? []
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

	{#snippet Item(props)}
		{#if props.item}
			<MarketPriceView
				entityId={props.item.value[EntityMetaKey.Id]}
				href={resolve(
					'/(assets)/(markets)/market/[marketKey]',
					{
						marketKey: encodeURIComponent(
							stringify(props.item.value[EntityMetaKey.Id].$market),
						),
					},
				)}
				id={stringify(props.item.value[EntityMetaKey.Id])}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
