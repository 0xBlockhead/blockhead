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
	import type { MarketKind } from '$/constants/Market.ts'
	import { marketCatalogFieldSources } from '$/constants/Market.ts'
	import type { MarketVenueId } from '$/constants/MarketVenue.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'Markets',
		open = $bindable(true),
		collapsible = true,
		entityFieldReference,
		filterMarketVenueId,
		filterMarketKind,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Market>
			filterMarketVenueId?: MarketVenueId
			filterMarketKind?: MarketKind
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
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	{collapsible}
	entityType={EntityType.Market}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			A market pairs a base asset with a quote so feeds can publish prices, volume, and related stats.
		</p>
		<p>
			Each row is a venue book with a kind: spot (CEX/DEX cash markets), perpetual (funding + open interest), or dated futures.
		</p>
		<p>
			Spot rows expose quote streams and OHLC where wired; perpetual and futures rows may include funding and open interest when a provider supplies them.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No markets in this context yet.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						...marketCatalogFieldSources,
					],
					[fieldName]: {
						$limit: 8192,
					},
				},
			)}
			{@const markets = derive(
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
							.filter((marketRow) => (
								(
									filterMarketVenueId == null
									|| marketRow[EntityMetaKey.Id].$marketVenue.marketVenueId === filterMarketVenueId
								)
								&& (
									filterMarketKind == null
									|| marketRow[EntityMetaKey.Id].marketKind === filterMarketKind
								)
							))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Market}
				getKey={(row) => stringify(row[EntityMetaKey.Id])}
				getSortValue={(row) => stringify(row[EntityMetaKey.Id])}
				placeholderKeys={new SvelteSet()}
				open={true}
				resource={markets}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
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
		{/if}
	{/snippet}
</EntitiesList>
