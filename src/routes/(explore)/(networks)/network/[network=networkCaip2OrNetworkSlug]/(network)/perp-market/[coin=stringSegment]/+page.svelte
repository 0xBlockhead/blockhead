<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidPerpMarketView from '$/views/HyperliquidPerpMarketView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidPerpMarket, {
				$network: data.selector,
				coin: params.coin,
			}, {
				sources: [
					Source.Hyperliquid,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.coin || 'hyperliquid perp market')} • hyperliquid perp market • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid perp market'} • hyperliquid perp market • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidPerpMarket, {
				$network: data.selector,
				coin: params.coin,
			}, {
				sources: [
					Source.Hyperliquid,
				],
			})}

	<HyperliquidPerpMarketView
		selection={pageSelection}
	/>
	{/if}
</Page>
