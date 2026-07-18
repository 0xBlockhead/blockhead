<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
</script>


<svelte:head>
	<title>Popular YouTube videos (bounded provider chart) • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeVideosView
		href={resolve('/youtube/videos')}
		title='Popular YouTube videos (bounded provider chart)'
		selection={
			select(EntityType._GlobalYoutubeNetwork, {
				scope: '_GlobalYoutubeNetwork',
			}).$$observedVideos({
				sources: [
					Source.Constants_Internal,
				],
				count: true,
			})
		}
		id='observed-videos'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
