<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	const entityId = $derived(
		{ videoId: decodeURIComponent(params.videoId) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeVideoView from '$/views/YouTubeVideoView.svelte'
</script>


<Page>
	<YouTubeVideoView
		{entityId}
		href={resolve(
			'/(social)/(youtube)/youtube/video/[videoId]',
			{ videoId: encodeURIComponent(entityId.videoId) },
		)}
	/>
</Page>
