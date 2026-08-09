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

	const pageSelection = $derived(select(EntityType.DydxChainSubaccount_Timestamp, {
		$subaccount: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import DydxChainSubaccount_TimestampView from '$/views/DydxChainSubaccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'dydx chain subaccount timestamp')} • dydx chain subaccount timestamp • Blockhead</title>
</svelte:head>


<Page>
	<DydxChainSubaccount_TimestampView
		selection={pageSelection}
	/>
</Page>
