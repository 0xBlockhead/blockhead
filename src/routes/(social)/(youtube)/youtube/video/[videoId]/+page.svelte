<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeVideoView from '$/views/YouTubeVideoView.svelte'
</script>


<Page>
	<YouTubeVideoView
		selector={{ videoId: decodeURIComponent(params.videoId) }}
	/>
</Page>
