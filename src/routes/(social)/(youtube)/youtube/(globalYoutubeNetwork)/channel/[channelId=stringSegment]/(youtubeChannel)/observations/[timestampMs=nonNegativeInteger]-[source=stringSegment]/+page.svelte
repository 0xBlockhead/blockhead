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

	const pageSelection = $derived(select(EntityType.YoutubeChannel_Timestamp, {
		$channel: {
			channelId: decodeURIComponent(params.channelId),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$channel: {
				channelId: decodeURIComponent(params.channelId),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeChannel_TimestampView from '$/views/YoutubeChannel_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
		$channel: {
			channelId: decodeURIComponent(params.channelId),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}.timestampMs) ?? ''), String(({
		$channel: {
			channelId: decodeURIComponent(params.channelId),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}.source) ?? '')].filter(Boolean).join(' ') || 'YouTube channel observation' : [String((({ ...{
		$channel: {
			channelId: decodeURIComponent(params.channelId),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).timestampMs) ?? ''), String((({ ...{
		$channel: {
			channelId: decodeURIComponent(params.channelId),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).source) ?? '')].filter(Boolean).join(' ') || 'YouTube channel observation')} • YouTube channel observation • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeChannel_TimestampView
		href={
			resolve('/youtube/channel/[channelId=stringSegment]/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', {
				channelId: params.channelId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
