<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubePlaylistsView from '$/views/YoutubePlaylistsView.svelte'
</script>


<svelte:head>
	<title>YouTube playlists • Blockhead</title>
</svelte:head>


<Page>
	<YoutubePlaylistsView
		href={resolve('/youtube/playlists')}
		title='YouTube playlists'
		selection={
			select(EntityType._GlobalYoutubeNetwork, {
				scope: '_GlobalYoutubeNetwork',
			}).$$observedPlaylists({
				sources: [
					Source.Constants_Internal,
					Source.Youtube_Rest,
				],
				count: true,
			})
		}
		id='observed-playlists'
	/>
</Page>
