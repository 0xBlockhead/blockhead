<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeVideosView from '$/views/YouTubeVideosView.svelte'
</script>


<Page>
	<YouTubeVideosView
		entityFieldReference={{
			entityType: EntityType.YouTubeNetwork,
			entityId: { scope: 'YouTubeNetwork' },
			fieldName: '$$youtubeVideos',
		}}
		href={resolve('/youtube/videos')}
		id="youtube-videos"
		title="Popular videos"
	/>
</Page>
