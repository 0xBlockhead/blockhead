<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const videoId = $derived(
		page.params.videoId ?? '',
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import YouTubeVideoView from '$/views/YouTubeVideoView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(youtube)/youtube/video/[videoId]', {
		videoId: encodeURIComponent(videoId),
	})}
	id={videoId}
>
	{#snippet Summary({ open: _open })}
		<YouTubeVideoView
			entityId={{ videoId: decodeURIComponent(videoId) }}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
