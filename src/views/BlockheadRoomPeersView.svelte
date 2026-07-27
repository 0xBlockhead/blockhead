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
	}: EntityListViewProps<EntityType.BlockheadRoomPeer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRoomPeer}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Local_Internal,
			],
			fields: {
				displayName: true,
				isConnected: true,
				peerId: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadRoomPeer })}
		{@const blockheadRoomPeerSelector = blockheadRoomPeer[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadRoomPeer}
			entitySelector={blockheadRoomPeerSelector}
			href={
				resolve(
					'/~/multiplayer/contact/[contactId=stringSegment]',
					{
						contactId: String(blockheadRoomPeerSelector.id),
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadRoomPeer.displayName ?? '') || blockheadRoomPeer.peerId || 'contact'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadRoomPeer.isConnected)}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
