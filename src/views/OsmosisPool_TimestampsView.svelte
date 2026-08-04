<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Spot prices',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.OsmosisPool_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OsmosisPool_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				baseAssetDenom: true,
				quoteAssetDenom: true,
				spotPrice: true,
			},
		})
	}
>
	{#snippet Item({ item: osmosisPoolTimestamp })}
		{@const osmosisPoolTimestampSelector = osmosisPoolTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.OsmosisPool_Timestamp}
			entitySelector={osmosisPoolTimestampSelector}
		>
			{#snippet Title()}
				{[osmosisPoolTimestampSelector.baseAssetDenom, osmosisPoolTimestampSelector.quoteAssetDenom].filter(Boolean).join(' ') || 'Osmosis pool timestamp'}
			{/snippet}

			{#snippet Value()}
				{osmosisPoolTimestamp.spotPrice}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
