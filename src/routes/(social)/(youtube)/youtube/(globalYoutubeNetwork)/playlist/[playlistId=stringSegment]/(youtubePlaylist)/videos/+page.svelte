<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
</script>


<svelte:head>
	<title>Playlist videos • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.YoutubePlaylist, {
		playlistId: decodeURIComponent(params.playlistId),
	}).$$videos}

	<YoutubeVideosView
		href={
			resolve(
				'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/videos',
				{
					playlistId: params.playlistId,
				}
			)
		}
		title='Playlist videos'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='videos'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
