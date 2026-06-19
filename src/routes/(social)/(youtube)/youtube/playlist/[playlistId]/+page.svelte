<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(EntityType.YouTubePlaylist, { playlistId: decodeURIComponent(params.playlistId) })}
	/>
</Page>
