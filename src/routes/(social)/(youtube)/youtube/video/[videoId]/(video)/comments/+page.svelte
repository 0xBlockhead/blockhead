<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Props
	let {
		params,
	} = $props()

	const entityId = $derived(
		{ videoId: decodeURIComponent(params.videoId) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeCommentsView from '$/views/YouTubeCommentsView.svelte'
</script>


<Page>
	<YouTubeCommentsView
		entityFieldReference={{
			entityType: EntityType.YouTubeVideo,
			entityId,
			fieldName: '$$comments',
		}}
		href={resolve('/(social)/(youtube)/youtube/video/[videoId]/(video)/comments', {
			videoId: encodeURIComponent(entityId.videoId),
		})}
		id="youtube-video-comments"
	/>
</Page>
