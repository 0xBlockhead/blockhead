<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
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
	{@const collectionSelection = select(EntityType.YoutubeVideo, {
		videoId: decodeURIComponent(params.videoId),
	}).$$comments}

	<YoutubeCommentsView
		href={
			resolve(
				'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/comments',
				{
					videoId: params.videoId,
				}
			)
		}
		title='Video comments'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='comments'
	/>
</Page>
