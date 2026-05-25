<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubePlaylistsView from '$/views/YouTubePlaylistsView.svelte'
</script>


<Page>
	<YouTubePlaylistsView
		href={resolve('/youtube/playlists')}
		entityFieldReference={{
			entityType: EntityType.YouTubeNetwork,
			entityId: { scope: 'YouTubeNetwork' },
			fieldName: '$$youtubePlaylists',
		}}
		id="youtube-playlists"
	/>
</Page>
