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
		selector={{ playlistId: decodeURIComponent(params.playlistId) }}
	/>
</Page>
