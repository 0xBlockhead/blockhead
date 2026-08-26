<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HyperliquidPerpMarket, {
		$network: data.selector,
		coin: params.coin,
	}, {
		sources: [
			Source.Hyperliquid,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidPerpMarketView from '$/views/HyperliquidPerpMarketView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.coin || 'hyperliquid perp market')} • hyperliquid perp market • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid perp market'} • hyperliquid perp market • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HyperliquidPerpMarketView
		selection={pageSelection}
	/>
	{/if}
</Page>
