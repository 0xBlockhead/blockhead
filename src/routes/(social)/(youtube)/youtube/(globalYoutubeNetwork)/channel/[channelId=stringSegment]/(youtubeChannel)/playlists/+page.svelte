<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import YoutubePlaylistsView from '$/views/YoutubePlaylistsView.svelte'
</script>


<svelte:head>
	<title>Channel playlists • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.YoutubeChannel, {
		channelId: decodeURIComponent(params.channelId),
	}).$$playlists}

	<YoutubePlaylistsView
		href={
			resolve(
				'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/playlists',
				{
					channelId: params.channelId,
				}
			)
		}
		title='Channel playlists'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='playlists'
	/>
</Page>
