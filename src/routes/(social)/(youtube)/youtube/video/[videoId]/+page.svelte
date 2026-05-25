<script lang="ts">
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
	/>
</Page>
