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
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.timestampMs) ?? ''), String((pageSelection.entitySelector.source) ?? '')].filter(Boolean).join(' ') || 'YouTube channel observation' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).source) ?? '')].filter(Boolean).join(' ') || 'YouTube channel observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeChannel_TimestampView from '$/views/YoutubeChannel_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • YouTube channel observation • Blockhead</title>
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
