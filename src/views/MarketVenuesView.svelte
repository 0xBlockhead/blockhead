<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		title = 'Market venues',
		open = $bindable(true),
		collapsible = true,
		entityFieldReference,
				...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MarketVenue>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ sources: [
						Source.Constants_Internal,
					], fields: { [entityFieldReference.fieldName]: {
						fields: {
							label: true,
						},
					},
				} }),
			)}
			{@const marketVenues = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.MarketVenue>[] => (
					parent.fields[entityFieldReference.fieldName]?.values ?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				{...EntitiesListProps}
				entityType={EntityType.MarketVenue}
				getKey={(marketVenue) => marketVenue[EntityMetaKey.Selector].marketVenueId}
				getSortValue={(marketVenue) => (
					marketVenue.label ?? marketVenue[EntityMetaKey.Selector].marketVenueId
				)}
				resource={marketVenues}
				{title}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No market venues in this context yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<MarketVenueView
						selector={item[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
