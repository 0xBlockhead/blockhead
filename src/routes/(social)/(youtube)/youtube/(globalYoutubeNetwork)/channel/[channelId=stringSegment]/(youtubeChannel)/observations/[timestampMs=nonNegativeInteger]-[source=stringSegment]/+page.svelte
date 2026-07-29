<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
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
	<title>{[String(pageSelection.entitySelector.timestampMs), pageSelection.entitySelector.source].filter(Boolean).join(' ') || 'YouTube channel observation'} • YouTube channel observation • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeChannel_TimestampView
		selection={pageSelection}
	/>
</Page>
