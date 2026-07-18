<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
	<YoutubeVideosView
		href={
			resolve('/youtube/playlist/[playlistId=stringSegment]/videos', {
				playlistId: params.playlistId,
			})
		}
		title='Playlist videos'
		selection={
			select(EntityType.YoutubePlaylist, {
				playlistId: decodeURIComponent(params.playlistId),
			}).$$videos({
				sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				],
				count: true,
			})
		}
		id='videos'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
