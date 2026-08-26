<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
</script>


<svelte:head>
	<title>Recent channel videos (bounded, date ordered) • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.YoutubeChannel, {
		channelId: decodeURIComponent(params.channelId),
	}).$$videos}

	<YoutubeVideosView
		href={
			resolve(
				'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/videos',
				{
					channelId: params.channelId,
				}
			)
		}
		title='Recent channel videos (bounded, date ordered)'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='videos'
	/>
</Page>
