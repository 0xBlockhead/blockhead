<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubePlaylistView from '$/views/YouTubePlaylistView.svelte'
</script>


<Page>
	<YouTubePlaylistView
		entityId={{ playlistId: decodeURIComponent(params.playlistId) }}
	/>
</Page>
