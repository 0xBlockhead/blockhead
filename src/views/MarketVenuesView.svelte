<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.MarketVenue> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Exchanges, DEX protocols, and index publishers that scope how market ids are formed and which feeds apply.
	</p>

	<p>
		Catalog markets reference a venue in their id (for example <code>Binance:ETH-USD</code>).
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MarketVenue}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={
		selection({
			fields: {
				label: true,
				marketVenueId: true,
			},
		})
	}
>
	{#snippet Item({ item: marketVenue })}
		{@const marketVenueSelector = marketVenue[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MarketVenue}
			entitySelector={marketVenueSelector}
			href={
				resolve(
					'/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]',
					{
						marketVenueId: marketVenueSelector.marketVenueId,
					}
				)
			}
		>
			{#snippet Title()}
				{marketVenue.label || marketVenueSelector.marketVenueId || 'Market venue'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
