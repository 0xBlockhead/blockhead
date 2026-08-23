<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


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
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HyperliquidMarket_TimeInterval_Timestamp, {
					$network: data.selector.$network,
					marketKey: params.marketKey,
					timeInterval: {
						value: Number(params.intervalValue),
						unit: params.intervalUnit,
					},
					timestampMs: Number(params.timestampMs),
				}))}
			<title>{data?.title ?? 'hyperliquid market time interval timestamp'} • hyperliquid market time interval timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hyperliquid market time interval timestamp'} • hyperliquid market time interval timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HyperliquidMarket_TimeInterval_Timestamp, {
					$network: data.selector.$network,
					marketKey: params.marketKey,
					timeInterval: {
						value: Number(params.intervalValue),
						unit: params.intervalUnit,
					},
					timestampMs: Number(params.timestampMs),
				}))}

		<HyperliquidMarket_TimeInterval_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
