<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AlgorandAsset_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandAsset_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandAssetTimestamp })}
		<EntityView
			entityType={EntityType.AlgorandAsset_Timestamp}
			entitySelector={algorandAssetTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				algorand asset timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
