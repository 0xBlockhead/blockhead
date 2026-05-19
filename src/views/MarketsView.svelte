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
	import { marketCatalogFieldSources } from '$/constants/Market.ts'
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

	const parent = useEntity(
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
					$limit: 8192,
				},
			}),
		},
	)

	const markets = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.Market>[] = parent[fieldName] ?? []
			return (
				Object.values(
					Object.groupBy(
						rows,
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
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntitiesList
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
	{#snippet TypeAnnotationTooltip()}
		<p>
			A market pairs a base asset with a quote so feeds can publish prices, volume, and related stats.
		</p>
		<p>
			Spot best bids/asks and index marks are point samples; OHLC ranges aggregate trades or mid-prices into interval buckets for charts.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No markets in this context yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			<MarketView
				entityId={props.item[EntityMetaKey.Id]}
				href={resolve(
					'/(assets)/(markets)/market/[marketKey]',
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
