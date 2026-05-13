<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { formatMarketTimeIntervalLabel, MarketAssetKind } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'OHLC',
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const fieldName = entityFieldReference.fieldName

	const rangesParentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
			],
			[fieldName]: {
				$: [
					Source.Coingecko_Rest,
				],
				limit,
			},
		},
	)

	const ranges = derive(
		rangesParentEntity,
		(merged) => (
			(
				merged[fieldName as keyof typeof merged] as (Entity<typeof schema, EntityType.MarketPriceRange>)[]
			)
				.toSorted((a, b) => (
					a[EntityMetaKey.IdKey].localeCompare(b[EntityMetaKey.IdKey])
				))
				.map((value) => ({
					value,
				}))
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
	{#snippet Empty()}
		<p data-text="muted">
			No candle ranges in the index yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.isPlaceholder === false}
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
