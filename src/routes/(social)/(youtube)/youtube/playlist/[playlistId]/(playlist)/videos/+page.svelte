<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


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
		entityFieldReference={{
			entityType: EntityType.YouTubePlaylist,
			entityId: {
				playlistId: decodeURIComponent(params.playlistId),
			},
			fieldName: '$$videos',
		}}
		id="youtube-playlist-videos"
		title="Playlist videos"
	/>
</Page>
