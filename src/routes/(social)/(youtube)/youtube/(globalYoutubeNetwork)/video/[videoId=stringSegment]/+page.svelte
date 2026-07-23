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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.YoutubeVideo, data.selector, {
		sources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
			Source.Constants_Internal,
		],
		fields: {
			$thumbnail: true,
			title: true,
			$author: true,
			publishedAtMs: true,
			description: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeVideoView from '$/views/YoutubeVideoView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.videoId) ?? '')].filter(Boolean).join(' ') || 'YouTube video' : [String((({ ...data.selector, ...pageSelection.entity }).title) ?? '')].filter(Boolean).join(' ') || [String((({ ...data.selector, ...pageSelection.entity }).videoId) ?? '')].filter(Boolean).join(' ') || 'YouTube video'))} • YouTube video • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeVideoView
		href={
			resolve('/youtube/video/[videoId=stringSegment]', {
				videoId: params.videoId,
			})
		}
		selection={pageSelection}
	/>
</Page>
