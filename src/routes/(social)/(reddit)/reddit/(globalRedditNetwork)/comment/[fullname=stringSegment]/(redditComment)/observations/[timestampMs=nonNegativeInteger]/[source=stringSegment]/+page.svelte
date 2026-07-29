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

	const pageSelection = $derived(select(EntityType.RedditComment_Timestamp, {
		$comment: {
			fullname: decodeURIComponent(params.fullname),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$comment: {
				fullname: decodeURIComponent(params.fullname),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			score: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RedditComment_TimestampView from '$/views/RedditComment_TimestampView.svelte'
</script>


<svelte:head>
	<title>{String(pageSelection.entitySelector.timestampMs) || 'Reddit comment timestamp'} • Reddit comment timestamp • Blockhead</title>
</svelte:head>


<Page>
	<RedditComment_TimestampView
		selection={pageSelection}
	/>
</Page>
