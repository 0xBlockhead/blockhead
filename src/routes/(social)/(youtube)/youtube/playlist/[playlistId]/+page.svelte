<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()

	const entityId = $derived(
		{ playlistId: decodeURIComponent(params.playlistId) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubePlaylistView from '$/views/YouTubePlaylistView.svelte'
</script>


<Page>
	<YouTubePlaylistView
		{entityId}
		href={resolve(
			'/(social)/(youtube)/youtube/playlist/[playlistId]',
			{ playlistId: encodeURIComponent(entityId.playlistId) },
		)}
	/>
</Page>
