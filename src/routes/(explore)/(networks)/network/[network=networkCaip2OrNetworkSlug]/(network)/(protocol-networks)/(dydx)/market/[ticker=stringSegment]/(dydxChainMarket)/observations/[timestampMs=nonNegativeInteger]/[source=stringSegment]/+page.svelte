<!-- Generated from APP.ts. -->

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

	const pageSelection = $derived(select(EntityType.DydxChainMarket_Timestamp, {
		$market: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import DydxChainMarket_TimestampView from '$/views/DydxChainMarket_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'dydx chain market timestamp')} • dydx chain market timestamp • Blockhead</title>
</svelte:head>


<Page>
	<DydxChainMarket_TimestampView
		selection={pageSelection}
	/>
</Page>
