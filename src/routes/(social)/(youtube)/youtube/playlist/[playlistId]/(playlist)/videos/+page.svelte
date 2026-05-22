<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	let {
		params,
	} = $props()

	const entityId = $derived(
		{ playlistId: decodeURIComponent(params.playlistId) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeVideosView from '$/views/YouTubeVideosView.svelte'
</script>


<Page>
	<YouTubeVideosView
		entityFieldReference={{
			entityType: EntityType.YouTubePlaylist,
			entityId,
			fieldName: '$$videos',
		}}
		href={resolve('/(social)/(youtube)/youtube/playlist/[playlistId]/(playlist)/videos', {
			playlistId: encodeURIComponent(entityId.playlistId),
		})}
		id="youtube-playlist-videos"
		title="Playlist videos"
	/>
</Page>
