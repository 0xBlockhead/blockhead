<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeCommentsView from '$/views/YoutubeCommentsView.svelte'
</script>


<svelte:head>
	<title>Video comments • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeCommentsView
		href={
			resolve('/(social)/(youtube)/youtube/video/[videoId]/(video)/comments', {
				videoId: params.videoId,
			})
		}
		title='Video comments'
		selection={
			select(EntityType.YoutubeVideo, {
				videoId: decodeURIComponent(params.videoId),
			}).$$comments({
				sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				],
			})
		}
		id='comments'
	/>
</Page>
