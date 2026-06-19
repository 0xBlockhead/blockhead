<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	// State
	let {
		title = 'Market venues',
		open = $bindable(true),
		collapsible = true,
		selection,
				...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.MarketVenue>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.MarketVenue}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Exchanges, DEX protocols, and index publishers that scope how market ids are formed and which feeds apply.
		</p>
		<p>
			Catalog markets reference a venue in their id (for example <code>Binance:ETH-USD</code>).
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No market venues in this context yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						label: true,
					},
				})} placeholderText="Loading market venues…">
				{#snippet children(marketVenues)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				{...EntitiesListProps}
				entityType={EntityType.MarketVenue}
				getKey={(marketVenue) => marketVenue.entitySelector.marketVenueId}
				getSortValue={(marketVenue) => marketVenue.entitySelector.marketVenueId}
				{title}
				open={true}
				items={marketVenues.entities}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No market venues in this context yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<MarketVenueView
						selection={select(EntityType.MarketVenue, item.entitySelector)}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
