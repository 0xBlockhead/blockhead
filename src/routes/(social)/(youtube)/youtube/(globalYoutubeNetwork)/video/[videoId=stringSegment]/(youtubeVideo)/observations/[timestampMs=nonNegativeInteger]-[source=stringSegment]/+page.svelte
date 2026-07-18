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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.YoutubeVideo_Timestamp, {
		$video: {
			videoId: decodeURIComponent(params.videoId),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$video: {
				videoId: decodeURIComponent(params.videoId),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.timestampMs) ?? ''), String((pageSelection.entitySelector.source) ?? '')].filter(Boolean).join(' ') || 'YouTube video observation' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).source) ?? '')].filter(Boolean).join(' ') || 'YouTube video observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeVideo_TimestampView from '$/views/YoutubeVideo_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • YouTube video observation • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeVideo_TimestampView
		href={
			resolve('/youtube/video/[videoId=stringSegment]/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', {
				videoId: params.videoId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
