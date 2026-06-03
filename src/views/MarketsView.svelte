<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { MarketKind } from '$/constants/Market.ts'
	import { marketCatalogFieldSources } from '$/constants/Market.ts'
	import type { MarketVenueId } from '$/constants/MarketVenue.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		title = 'Markets',
		open = $bindable(true),
		collapsible = true,
		entityFieldReference,
		filterMarketVenueId,
		filterMarketKind,
				...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Market>
			filterMarketVenueId?: MarketVenueId
			filterMarketKind?: MarketKind
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
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
			Spot markets expose quote streams and OHLC where wired; perpetual and futures markets may include funding and open interest when a provider supplies them.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No markets in this context yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						...marketCatalogFieldSources,
					],
					[entityFieldReference.fieldName]: {
						$limit: 8192,
					},
				},
			)}
			{@const markets = derive(
				parent,
				(parent) => {
					const markets: Entity<typeof schema, EntityType.Market>[] = parent[entityFieldReference.fieldName] ?? []
					return (
						Object.values(
							Object.groupBy(
								markets,
								(market) => stringify(market[EntityMetaKey.Id]),
							),
						)
							.flatMap((group) => (
								group == null ?
									[]
								:
									[group[0]]
							))
							.filter((market) => (
								(
									filterMarketVenueId == null
									|| market[EntityMetaKey.Id].$marketVenue.marketVenueId === filterMarketVenueId
								)
								&& (
									filterMarketKind == null
									|| market[EntityMetaKey.Id].marketKind === filterMarketKind
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

				{#snippet Item({ item })}
					<MarketView
						entityId={item[EntityMetaKey.Id]}
						id={stringify(item[EntityMetaKey.Id])}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
