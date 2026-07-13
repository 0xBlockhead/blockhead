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
			Source.Constants_Internal,
		],
		fields: {
			title: true,
			publishedAtMs: true,
			description: true,
			$author: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.title) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.videoId) ?? '')].filter(Boolean).join(' ') || 'YouTube video' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).title) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).videoId) ?? '')].filter(Boolean).join(' ') || 'YouTube video')))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeVideoView from '$/views/YoutubeVideoView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • YouTube video • Blockhead</title>
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
