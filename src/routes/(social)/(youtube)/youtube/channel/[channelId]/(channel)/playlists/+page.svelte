<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


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
		entityFieldReference={{
			entityType: EntityType.YouTubeChannel,
			entityId: {
				channelId: decodeURIComponent(params.channelId),
			},
			fieldName: '$$playlists',
		}}
		id="youtube-channel-playlists"
	/>
</Page>
