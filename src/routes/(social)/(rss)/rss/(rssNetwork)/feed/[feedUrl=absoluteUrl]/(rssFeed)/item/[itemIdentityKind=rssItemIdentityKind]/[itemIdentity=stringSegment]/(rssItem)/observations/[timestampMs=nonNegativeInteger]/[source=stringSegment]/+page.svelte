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

	const pageSelection = $derived(select(EntityType.RssItem_Timestamp, {
		$item: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$item: data.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			observed: true,
			reachable: true,
			fetchWindowKind: true,
			error: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RssItem_TimestampView from '$/views/RssItem_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'RSS item observation'} • RSS item observation • Blockhead</title>
</svelte:head>


<Page>
	<RssItem_TimestampView
		selection={pageSelection}
	/>
</Page>
