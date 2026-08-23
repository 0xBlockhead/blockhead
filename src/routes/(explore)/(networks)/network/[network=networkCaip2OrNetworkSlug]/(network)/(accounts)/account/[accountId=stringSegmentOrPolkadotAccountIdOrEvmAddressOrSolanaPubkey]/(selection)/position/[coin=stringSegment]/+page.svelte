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
	import HyperliquidPositionView from '$/views/HyperliquidPositionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidPosition, {
				$account: data.selector,
				coin: params.coin,
			})}
		<title>{data?.title ?? 'hyperliquid position'} • hyperliquid position • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid position'} • hyperliquid position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidPosition, {
				$account: data.selector,
				coin: params.coin,
			})}

	<HyperliquidPositionView
		selection={pageSelection}
	/>
	{/if}
</Page>
