<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HyperliquidOrder_Timestamp, {
		$order: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidOrder_TimestampView from '$/views/HyperliquidOrder_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hyperliquid order timestamp'} • hyperliquid order timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid order timestamp'} • hyperliquid order timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HyperliquidOrder_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
