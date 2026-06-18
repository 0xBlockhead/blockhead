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

	const selector = $derived(
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
			{ videoId: encodeURIComponent(selector.videoId) },
		)}
		selection={select(
			EntityType.YouTubeVideo,
			selector
		).$$comments}
		id="youtube-video-comments"
	/>
</Page>
