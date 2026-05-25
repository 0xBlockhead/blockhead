<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()


	// (Derived)
	const entityId = $derived(
		{ videoId: decodeURIComponent(params.videoId) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeCommentsView from '$/views/YouTubeCommentsView.svelte'
</script>


<Page>
	<YouTubeCommentsView
		href={resolve(
			'/(social)/(youtube)/youtube/video/[videoId]/(video)/comments',
			{ videoId: encodeURIComponent(entityId.videoId) },
		)}
		entityFieldReference={{
			entityType: EntityType.YouTubeVideo,
			entityId,
			fieldName: '$$comments',
		}}
		id="youtube-video-comments"
	/>
</Page>
