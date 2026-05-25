<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	const entityId = $derived(
		{ channelId: decodeURIComponent(params.channelId) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubePlaylistsView from '$/views/YouTubePlaylistsView.svelte'
</script>


<Page>
	<YouTubePlaylistsView
		href={resolve('/youtube/playlists')}
		entityFieldReference={{
			entityType: EntityType.YouTubeChannel,
			entityId,
			fieldName: '$$playlists',
		}}
		id="youtube-channel-playlists"
	/>
</Page>
