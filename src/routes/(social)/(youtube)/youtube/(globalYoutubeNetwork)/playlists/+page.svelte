<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubePlaylistsView from '$/views/YoutubePlaylistsView.svelte'
</script>


<svelte:head>
	<title>YouTube playlists • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalYoutubeNetwork, {
		scope: '_GlobalYoutubeNetwork',
	}).$$observedPlaylists}

	<YoutubePlaylistsView
		href={resolve('/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlists')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-playlists'
	/>
</Page>
