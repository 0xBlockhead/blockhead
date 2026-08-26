<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
</script>


<svelte:head>
	<title>Popular YouTube videos (bounded provider chart) • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalYoutubeNetwork, {
		scope: '_GlobalYoutubeNetwork',
	})
		.$$observedVideos({
			sources: [
				Source.Constants_Internal,
			],
		})}

	<YoutubeVideosView
		href={resolve('/(social)/(youtube)/youtube/(globalYoutubeNetwork)/videos')}
		title='Popular YouTube videos (bounded provider chart)'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-videos'
	/>
</Page>
