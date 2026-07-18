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

	const pageSelection = $derived(select(EntityType.YoutubeComment_Timestamp, {
		$comment: {
			videoId: decodeURIComponent(params.videoId),
			commentId: decodeURIComponent(params.commentId),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$comment: {
				videoId: decodeURIComponent(params.videoId),
				commentId: decodeURIComponent(params.commentId),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.timestampMs) ?? ''), String((pageSelection.entitySelector.source) ?? '')].filter(Boolean).join(' ') || 'YouTube comment observation' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).source) ?? '')].filter(Boolean).join(' ') || 'YouTube comment observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeComment_TimestampView from '$/views/YoutubeComment_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • YouTube comment observation • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeComment_TimestampView
		href={
			resolve('/youtube/comment/[videoId=stringSegment]/[commentId=stringSegment]/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', {
				videoId: params.videoId,
				commentId: params.commentId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
