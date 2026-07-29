<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.RssFeed_Timestamp, {
		$feed: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$feed: data.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			reachable: true,
			observedItemCount: true,
			fetchWindowKind: true,
			error: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RssFeed_TimestampView from '$/views/RssFeed_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'RSS feed observation'} • RSS feed observation • Blockhead</title>
</svelte:head>


<Page>
	<RssFeed_TimestampView
		selection={pageSelection}
	/>
</Page>
