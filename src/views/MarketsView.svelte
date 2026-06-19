<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { MarketKind } from '$/constants/Market.ts'
	import type { MarketVenueId } from '$/constants/MarketVenue.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	// Context
	// State
	let {
		title = 'Markets',
		open = $bindable(true),
		collapsible = true,
		selection,
		filterMarketVenueId,
		filterMarketKind,
				...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Market>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary
				resource={selection({
						limit: 8192,
					})}
				placeholderText="Loading markets…"
			>
				{#snippet children(markets)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.Market}
						getKey={(row) => stringify(row.entitySelector)}
						getSortValue={(row) => stringify(row.entitySelector)}
						open={true}
						items={Object.values(
							Object.groupBy(
								markets.entities,
								(market) => stringify(market.entitySelector),
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
									|| market.entitySelector.$marketVenue.marketVenueId === filterMarketVenueId
								)
								&& (
									filterMarketKind == null
									|| market.entitySelector.marketKind === filterMarketKind
								)
							))}
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
								selection={select(EntityType.Market, item.entitySelector)}
								id={stringify(item.entitySelector)}
								layout={EntityLayout.Title}
								open={false}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
