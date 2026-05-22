<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubePlaylistsView from '$/views/YouTubePlaylistsView.svelte'
</script>


<Page>
	<YouTubePlaylistsView
		entityFieldReference={{
			entityType: EntityType.YouTubeNetwork,
			entityId: { scope: 'YouTubeNetwork' },
			fieldName: '$$youtubePlaylists',
		}}
		href={resolve('/youtube/playlists')}
		id="youtube-playlists"
	/>
</Page>
