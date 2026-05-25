<script lang="ts">
	// State
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
	/>
</Page>
