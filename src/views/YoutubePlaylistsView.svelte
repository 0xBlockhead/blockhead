<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.YoutubePlaylist> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubePlaylist}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				playlistId: true,
				$channel: true,
			},
		})
	}
>
	{#snippet Item({ item: youtubePlaylist })}
		{@const youtubePlaylistSelector = youtubePlaylist[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.YoutubePlaylist}
			entitySelector={youtubePlaylistSelector}
			href={
				resolve(
					'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]',
					{
						playlistId: encodeURIComponent(youtubePlaylistSelector.playlistId),
					}
				)
			}
		>
			{#snippet Title()}
				{[(youtubePlaylist.title ?? ''), youtubePlaylistSelector.playlistId].filter(Boolean).join(' ') || youtubePlaylistSelector.playlistId || 'YouTube playlist'}
			{/snippet}

			{#snippet Value()}
				{youtubePlaylist.$channel == null ? '' : (youtubePlaylist.$channel.title ?? '') || youtubePlaylist.$channel.channelId || 'YouTube channel'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
