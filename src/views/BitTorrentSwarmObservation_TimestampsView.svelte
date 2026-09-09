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
	}: EntityListViewProps<EntityType.BitTorrentSwarmObservation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentSwarmObservation_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				peerCount: true,
				seedCount: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: bitTorrentSwarmObservationTimestamp })}
		{@const bitTorrentSwarmObservationTimestampSelector = bitTorrentSwarmObservationTimestamp[EntityMetaKey.Selector]}
		{@const torrent = bitTorrentSwarmObservationTimestampSelector.$torrent}
		<EntityView
			entityType={EntityType.BitTorrentSwarmObservation_Timestamp}
			entitySelector={bitTorrentSwarmObservationTimestampSelector}
			href={
				resolve(
					'/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						infoHash: torrent.infoHash,
						hashVersion: torrent.hashVersion,
						timestampMs: String(bitTorrentSwarmObservationTimestampSelector.timestampMs),
						source: bitTorrentSwarmObservationTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{bitTorrentSwarmObservationTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(bitTorrentSwarmObservationTimestamp.peerCount ?? ''), String(bitTorrentSwarmObservationTimestamp.seedCount ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitTorrentSwarmObservationTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
