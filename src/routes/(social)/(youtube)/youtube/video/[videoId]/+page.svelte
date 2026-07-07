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
	import YoutubeVideoView from '$/views/YoutubeVideoView.svelte'
</script>


<Page>
	<YoutubeVideoView
		href={
			resolve('/(social)/(youtube)/youtube/video/[videoId]', {
				videoId: params.videoId,
			})
		}
		selection={
			select(EntityType.YoutubeVideo, {
				videoId: decodeURIComponent(params.videoId),
			}, {
				sources: [
					Source.Constants_Internal,
				],
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
