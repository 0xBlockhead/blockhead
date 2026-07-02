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
	import YoutubeComment_TimestampView from '$/views/YoutubeComment_TimestampView.svelte'
</script>


<svelte:head>
	<title>YouTube comment observation • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeComment_TimestampView
		href={
			resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]', {
				videoId: params.videoId,
				commentId: params.commentId,
				timestampMs: params.timestampMs,
			})
		}
		selection={select(EntityType.YoutubeComment_Timestamp, data.selector)}
	/>
</Page>
