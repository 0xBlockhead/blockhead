<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubePlaylistsView from '$/views/YouTubePlaylistsView.svelte'
</script>


<Page>
	<YouTubePlaylistsView
		href={resolve('/youtube/playlists')}
		selection={select(
			EntityType.YouTubeChannel,
			{
				channelId: decodeURIComponent(params.channelId),
			}
		).$$playlists}
		id="youtube-channel-playlists"
	/>
</Page>
