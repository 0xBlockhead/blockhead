<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeVideosView from '$/views/YouTubeVideosView.svelte'
</script>


<Page>
	<YouTubeVideosView
		href={resolve('/youtube/videos')}
		entityFieldReference={{
			entityType: EntityType.YouTubeNetwork,
			entityId: { scope: 'YouTubeNetwork' },
			fieldName: '$$youtubeVideos',
		}}
		id="youtube-videos"
		title="Popular videos"
	/>
</Page>
