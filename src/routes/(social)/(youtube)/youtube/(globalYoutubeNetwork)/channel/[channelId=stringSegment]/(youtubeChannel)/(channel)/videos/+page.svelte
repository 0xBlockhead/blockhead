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
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
</script>


<svelte:head>
	<title>Channel videos • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeVideosView
		href={
			resolve('/youtube/channel/[channelId=stringSegment]/videos', {
				channelId: params.channelId,
			})
		}
		title='Channel videos'
		selection={
			select(EntityType.YoutubeChannel, {
				channelId: decodeURIComponent(params.channelId),
			}).$$videos({
				sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				],
			})
		}
		id='videos'
	/>
</Page>
