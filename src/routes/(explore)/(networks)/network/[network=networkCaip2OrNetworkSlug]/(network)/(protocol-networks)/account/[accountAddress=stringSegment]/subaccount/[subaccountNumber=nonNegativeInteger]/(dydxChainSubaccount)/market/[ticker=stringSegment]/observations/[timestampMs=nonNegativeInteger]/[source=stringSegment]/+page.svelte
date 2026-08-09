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

	const pageSelection = $derived(select(EntityType.DydxChainPerpetualPosition_Timestamp, {
		$subaccount: data.selector,
		$market: {
			$network: data.selector.$network,
			ticker: params.ticker,
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import DydxChainPerpetualPosition_TimestampView from '$/views/DydxChainPerpetualPosition_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'dydx chain perpetual position timestamp')} • dydx chain perpetual position timestamp • Blockhead</title>
</svelte:head>


<Page>
	<DydxChainPerpetualPosition_TimestampView
		selection={pageSelection}
	/>
</Page>
