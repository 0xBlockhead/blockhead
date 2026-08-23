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
	import Market_TimeInterval_TimestampView from '$/views/Market_TimeInterval_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.Market_TimeInterval_Timestamp, {
				$market: data.selector,
				timeInterval: {
					unit: params.timeIntervalUnit,
					value: Number(params.timeIntervalValue),
				},
				timestampMs: Number(params.timestampMs),
			})}
		<title>{data?.title ?? (`${pageSelection.entitySelector.timeInterval.value}${pageSelection.entitySelector.timeInterval.unit}` || 'OHLC candle')} • OHLC candle • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'OHLC candle'} • OHLC candle • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.Market_TimeInterval_Timestamp, {
				$market: data.selector,
				timeInterval: {
					unit: params.timeIntervalUnit,
					value: Number(params.timeIntervalValue),
				},
				timestampMs: Number(params.timestampMs),
			})}

	<Market_TimeInterval_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
