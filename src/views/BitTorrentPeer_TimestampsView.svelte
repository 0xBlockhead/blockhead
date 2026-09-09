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
	}: EntityListViewProps<EntityType.BitTorrentPeer_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentPeer_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				peerId: true,
				client: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: bitTorrentPeerTimestamp })}
		{@const bitTorrentPeerTimestampSelector = bitTorrentPeerTimestamp[EntityMetaKey.Selector]}
		{@const torrent = bitTorrentPeerTimestampSelector.$torrent}
		<EntityView
			entityType={EntityType.BitTorrentPeer_Timestamp}
			entitySelector={bitTorrentPeerTimestampSelector}
			href={
				resolve(
					'/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/peer/[peerId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						infoHash: torrent.infoHash,
						hashVersion: torrent.hashVersion,
						peerId: bitTorrentPeerTimestampSelector.peerId,
						timestampMs: String(bitTorrentPeerTimestampSelector.timestampMs),
						source: bitTorrentPeerTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{bitTorrentPeerTimestampSelector.peerId || 'bit torrent peer timestamp'}
			{/snippet}

			{#snippet Value()}
				{bitTorrentPeerTimestamp.client ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitTorrentPeerTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
