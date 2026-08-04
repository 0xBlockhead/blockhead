<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Pool assets',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.OsmosisPoolAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OsmosisPoolAsset}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				denom: true,
				amount: true,
				weight: true,
			},
		})
	}
>
	{#snippet Item({ item: osmosisPoolAsset })}
		{@const osmosisPoolAssetSelector = osmosisPoolAsset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.OsmosisPoolAsset}
			entitySelector={osmosisPoolAssetSelector}
		>
			{#snippet Title()}
				{osmosisPoolAssetSelector.denom || 'Osmosis pool asset'}
			{/snippet}

			{#snippet Value()}
				{[osmosisPoolAsset.amount, (osmosisPoolAsset.weight ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
