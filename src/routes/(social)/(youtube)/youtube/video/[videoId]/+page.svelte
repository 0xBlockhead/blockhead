<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(EntityType.YouTubeVideo, { videoId: decodeURIComponent(params.videoId) })}
	/>
</Page>
