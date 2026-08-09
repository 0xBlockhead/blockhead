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
	}: EntityListViewProps<EntityType.YoutubePlaylist_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubePlaylist_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$playlist: true,
					timestampMs: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: youtubePlaylistTimestamp })}
		{@const youtubePlaylistTimestampSelector = youtubePlaylistTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.YoutubePlaylist_Timestamp}
			entitySelector={youtubePlaylistTimestampSelector}
			href={
				resolve(
					'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
					{
						playlistId: encodeURIComponent(youtubePlaylistTimestampSelector.$playlist.playlistId),
						timestampMs: String(youtubePlaylistTimestampSelector.timestampMs),
						source: youtubePlaylistTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(youtubePlaylistTimestamp.$playlist.title ?? '') || youtubePlaylistTimestampSelector.$playlist.playlistId || 'YouTube playlist', String(youtubePlaylistTimestampSelector.timestampMs), youtubePlaylistTimestampSelector.source].filter(Boolean).join(' ') || 'YouTube playlist observation'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
