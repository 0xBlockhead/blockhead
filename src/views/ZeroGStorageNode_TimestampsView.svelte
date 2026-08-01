<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.ZeroGStorageNode_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGStorageNode_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$storageNode: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGStorageNodeTimestamp })}
		{@const zeroGStorageNodeTimestampSelector = zeroGStorageNodeTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGStorageNode_Timestamp}
			entitySelector={zeroGStorageNodeTimestampSelector}
		>
			{#snippet Title()}
				zero g storage node
			{/snippet}

			{#snippet Value()}
				{zeroGStorageNodeTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
