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


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidMarket_TimeInterval_TimestampView from '$/views/HyperliquidMarket_TimeInterval_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hyperliquid market time interval timestamp'} • hyperliquid market time interval timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidMarket_TimeInterval_TimestampView
		selection={
			select(EntityType.HyperliquidMarket_TimeInterval_Timestamp, {
				$network: data.selector,
				marketKey: params.marketKey,
				timeInterval: {
					value: params.intervalValue,
					unit: params.intervalUnit,
				},
				timestampMs: Number(params.timestampMs),
			})
		}
	/>
</Page>
