<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


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
	<YoutubePlaylistsView
		href={
			resolve('/youtube/channel/[channelId=stringSegment]/playlists', {
				channelId: params.channelId,
			})
		}
		title='Channel playlists'
		selection={
			select(EntityType.YoutubeChannel, {
				channelId: decodeURIComponent(params.channelId),
			}).$$playlists({
				sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				],
				count: true,
			})
		}
		id='playlists'
	/>
</Page>
