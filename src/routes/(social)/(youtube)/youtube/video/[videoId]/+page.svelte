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
	import YoutubeVideoView from '$/views/YoutubeVideoView.svelte'
</script>


<svelte:head>
	<title>YouTube video • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeVideoView
		href={
			resolve('/(social)/(youtube)/youtube/video/[videoId]', {
				videoId: params.videoId,
			})
		}
		selection={
			select(EntityType.YoutubeVideo, data.selector, {
				fields: {
					title: true,
					publishedAtMs: true,
					description: true,
					$author: true,
				},
			})
		}
	/>
</Page>
