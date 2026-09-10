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
	}: EntityListViewProps<EntityType.BlockheadBitTorrentTransfer_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadBitTorrentTransfer_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				$torrent: {
					fields: {
						name: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadBitTorrentTransferTimestamp })}
		{@const blockheadBitTorrentTransferTimestampSelector = blockheadBitTorrentTransferTimestamp[EntityMetaKey.Selector]}
		{@const torrent = blockheadBitTorrentTransferTimestampSelector.$torrent}
		<EntityView
			entityType={EntityType.BlockheadBitTorrentTransfer_Timestamp}
			entitySelector={blockheadBitTorrentTransferTimestampSelector}
			href={
				resolve(
					'/~/bittorrent/client-state/[clientId=stringSegment]/(blockheadBitTorrentClientState)/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/observations/[timestampMs=nonNegativeInteger]',
					{
						clientId: blockheadBitTorrentTransferTimestampSelector.$client.clientId,
						infoHash: torrent.infoHash,
						hashVersion: torrent.hashVersion,
						timestampMs: String(blockheadBitTorrentTransferTimestampSelector.timestampMs),
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadBitTorrentTransferTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadBitTorrentTransferTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(blockheadBitTorrentTransferTimestamp.$torrent.name ?? '') || blockheadBitTorrentTransferTimestampSelector.$torrent.infoHash || 'bit torrent metainfo'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
