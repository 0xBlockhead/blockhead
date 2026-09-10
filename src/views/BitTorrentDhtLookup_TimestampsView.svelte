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
	}: EntityListViewProps<EntityType.BitTorrentDhtLookup_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentDhtLookup_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$torrent: {
					fields: {
						name: true,
					},
				},
				peerCount: true,
				status: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: bitTorrentDhtLookupTimestamp })}
		{@const bitTorrentDhtLookupTimestampSelector = bitTorrentDhtLookupTimestamp[EntityMetaKey.Selector]}
		{@const torrent = bitTorrentDhtLookupTimestampSelector.$torrent}
		<EntityView
			entityType={EntityType.BitTorrentDhtLookup_Timestamp}
			entitySelector={bitTorrentDhtLookupTimestampSelector}
			href={
				resolve(
					'/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/dht-lookup/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						infoHash: torrent.infoHash,
						hashVersion: torrent.hashVersion,
						timestampMs: String(bitTorrentDhtLookupTimestampSelector.timestampMs),
						source: bitTorrentDhtLookupTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{(bitTorrentDhtLookupTimestamp.$torrent.name ?? '') || bitTorrentDhtLookupTimestampSelector.$torrent.infoHash || 'bit torrent metainfo'}
			{/snippet}

			{#snippet Value()}
				{[String(bitTorrentDhtLookupTimestamp.peerCount ?? ''), (bitTorrentDhtLookupTimestamp.status ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitTorrentDhtLookupTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
