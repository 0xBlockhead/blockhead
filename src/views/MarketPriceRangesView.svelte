<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { formatMarketTimeIntervalLabel, MarketAssetKind } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'OHLC ranges',
		open = $bindable(true),
		limit = 400,
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			limit?: number
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MarketPriceRange>
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

	const rangesParentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				...(
					open ?
						[
							Source.Coingecko_Rest,
							Source.Defillama_OpenApi,
							Source.Coinpaprika_OpenApi,
							Source.CoinMarketCap_Rest,
						]
					:
						[]
				),
			],
			...(open && {
				[fieldName]: {
					$: [
						Source.Coingecko_Rest,
						Source.Defillama_OpenApi,
						Source.Coinpaprika_OpenApi,
						Source.CoinMarketCap_Rest,
					],
					$limit: limit,
				},
			}),
		},
	)

	const ranges = derive(
		rangesParentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.MarketPriceRange>[] = (
				merged[fieldName] ?? []
			)
			return (
				rows
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
	import MarketPriceRangeView from '$/views/MarketPriceRangeView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.MarketPriceRange}
	getKey={(row) => stringify(
		row.value[EntityMetaKey.Id],
	)}
	getSortValue={(row) => (
		`${(
			row.value[EntityMetaKey.Id].$market.$base.kind === MarketAssetKind.Coin ?
				row.value[EntityMetaKey.Id].$market.$base.$coin.coinId
			:
				''
		)} ${formatMarketTimeIntervalLabel(row.value[EntityMetaKey.Id].timeInterval)}`
	)}
	placeholderKeys={new SvelteSet<string | number>()}
	resource={ranges}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
					<p>
						OHLC ranges aggregate trades or mids into open/high/low/close buckets for a configured interval on a specific base/quote/venue tuple.
					</p>
					<p>
						Candlesticks roll spot or trade prints into open/high/low/close for each interval; they are not level-two order books.
					</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No OHLC ranges yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			<MarketPriceRangeView
				entityId={props.item.value[EntityMetaKey.Id]}
				href={(
					props.item.value[EntityMetaKey.Id].$market.$base.kind !== MarketAssetKind.Coin ?
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
