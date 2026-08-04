<!-- Generated from APP.ts. -->

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

	const pageSelection = $derived(select(EntityType.YoutubeComment_Timestamp, {
		$comment: {
			videoId: decodeURIComponent(params.videoId),
			commentId: decodeURIComponent(params.commentId),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeComment_TimestampView from '$/views/YoutubeComment_TimestampView.svelte'
</script>


<svelte:head>
	<title>{[String(pageSelection.entitySelector.timestampMs), pageSelection.entitySelector.source].filter(Boolean).join(' ') || 'YouTube comment observation'} • YouTube comment observation • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeComment_TimestampView
		selection={pageSelection}
	/>
</Page>
