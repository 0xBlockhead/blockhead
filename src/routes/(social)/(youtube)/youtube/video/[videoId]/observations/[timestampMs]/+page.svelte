<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeVideo_TimestampView from '$/views/YoutubeVideo_TimestampView.svelte'
</script>


<svelte:head>
	<title>YouTube video observation • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeVideo_TimestampView
		href={
			resolve('/(social)/(youtube)/youtube/video/[videoId]/observations/[timestampMs]', {
				videoId: params.videoId,
				timestampMs: params.timestampMs,
			})
		}
		selection={select(EntityType.YoutubeVideo_Timestamp, data.selector)}
	/>
</Page>
