<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.BlockheadBitTorrentClientState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadBitTorrentClientState}
	bind:open
	resource={
		selection({
			fields: {
				clientName: true,
				peerId: true,
				clientId: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadBitTorrentClientState })}
		{@const blockheadBitTorrentClientStateSelector = blockheadBitTorrentClientState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadBitTorrentClientState}
			entitySelector={blockheadBitTorrentClientStateSelector}
			href={
				resolve(
					'/~/bittorrent/client-state/[clientId=stringSegment]',
					{
						clientId: blockheadBitTorrentClientStateSelector.clientId,
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadBitTorrentClientState.clientName ?? '') || blockheadBitTorrentClientStateSelector.clientId || 'blockhead bit torrent client state'}
			{/snippet}

			{#snippet Value()}
				{blockheadBitTorrentClientState.peerId ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
