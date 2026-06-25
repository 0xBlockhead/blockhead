<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeVideosView from '$/views/YouTubeVideosView.svelte'
</script>


<Page>
	<YouTubeVideosView
		href={resolve('/youtube/videos')}
		selection={select(
			EntityType.YouTubePlaylist,
			{
				playlistId: decodeURIComponent(params.playlistId),
			}
		).$$videos}
		id="youtube-playlist-videos"
		title="Playlist videos"
	/>
</Page>
