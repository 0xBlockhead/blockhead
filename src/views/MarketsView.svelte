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
		title = 'Markets',
		open = $bindable(true),
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Market>
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

	const marketsParent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_Rest,
				Source.TradingView_Rest,
			],
			[fieldName]: {
				$limit: 8192,
			},
		},
	)

	const markets = derive(
		marketsParent,
		(merged) => (
			Object.values(
				Object.groupBy(
					(
						merged[fieldName as keyof typeof merged] as (
							Entity<typeof schema, EntityType.Market>
						)[]
					),
					(marketRow) => stringify(marketRow[EntityMetaKey.Id]),
				),
			)
				.flatMap((group) => (
					group == null ?
						[]
					:
						[group[0]]
				))
				.toSorted((first, second) => (
					stringify(first[EntityMetaKey.Id]).localeCompare(
						stringify(second[EntityMetaKey.Id]),
					)
				))
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntitiesList
	data-e2e="markets-entities-list"
	{...entitiesListRest}
	bind:open
	entityType={EntityType.Market}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => stringify(row[EntityMetaKey.Id])}
	placeholderKeys={new SvelteSet()}
	resource={markets}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No markets indexed yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.isPlaceholder === false}
			<MarketView
				entityId={props.item[EntityMetaKey.Id]}
				href={resolve(
					'/(assets)/coins/market/[marketKey]',
					{
						marketKey: encodeURIComponent(stringify(props.item[EntityMetaKey.Id])),
					},
				)}
				id={stringify(props.item[EntityMetaKey.Id])}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
