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


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeVideo_TimestampView from '$/views/YoutubeVideo_TimestampView.svelte'
</script>


<svelte:head>
	<title>{([String(pageSelection.entitySelector.timestampMs), pageSelection.entitySelector.source].filter(Boolean).join(' ') || 'YouTube video observation')} • YouTube video observation • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeVideo_TimestampView
		selection={pageSelection}
	/>
</Page>
