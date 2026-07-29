<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadRoom> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRoom}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Local_Internal,
			],
			fields: {
				name: true,
				createdAt: true,
				id: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadRoom })}
		{@const blockheadRoomSelector = blockheadRoom[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadRoom}
			entitySelector={blockheadRoomSelector}
			href={
				resolve(
					'/~/multiplayer/room/[roomId=stringSegment]',
					{
						roomId: blockheadRoomSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadRoom.name ?? '') || blockheadRoomSelector.id || 'room'}
			{/snippet}

			{#snippet Value()}
				{blockheadRoom.createdAt}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
