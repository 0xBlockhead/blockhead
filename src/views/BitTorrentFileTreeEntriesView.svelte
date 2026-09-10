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
		id = 'BitTorrentFileTreeEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BitTorrentFileTreeEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentFileTreeEntry}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				path: true,
				entryKind: true,
			},
		})
	}
>
	{#snippet Item({ item: bitTorrentFileTreeEntry })}
		{@const bitTorrentFileTreeEntrySelector = bitTorrentFileTreeEntry[EntityMetaKey.Selector]}
		{@const torrent = bitTorrentFileTreeEntrySelector.$torrent}
		<EntityView
			entityType={EntityType.BitTorrentFileTreeEntry}
			entitySelector={bitTorrentFileTreeEntrySelector}
			href={
				resolve(
					'/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/tree/[path=stringSegment]',
					{
						infoHash: torrent.infoHash,
						hashVersion: torrent.hashVersion,
						path: bitTorrentFileTreeEntrySelector.path,
					}
				)
			}
		>
			{#snippet Title()}
				{bitTorrentFileTreeEntrySelector.path || 'bit torrent file tree entry'}
			{/snippet}

			{#snippet Value()}
				{bitTorrentFileTreeEntry.entryKind}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
