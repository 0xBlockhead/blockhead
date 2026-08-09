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

	const pageSelection = $derived(select(EntityType.DydxChainOrder_Timestamp, {
		$order: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import DydxChainOrder_TimestampView from '$/views/DydxChainOrder_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'dydx chain order timestamp')} • dydx chain order timestamp • Blockhead</title>
</svelte:head>


<Page>
	<DydxChainOrder_TimestampView
		selection={pageSelection}
	/>
</Page>
