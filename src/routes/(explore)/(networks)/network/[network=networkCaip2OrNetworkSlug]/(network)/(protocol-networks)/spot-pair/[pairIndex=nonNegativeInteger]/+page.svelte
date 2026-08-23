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
	import HyperliquidSpotPairView from '$/views/HyperliquidSpotPairView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HyperliquidSpotPair, {
					$network: data.selector.$network,
					pairIndex: Number(params.pairIndex),
				}))}
			<title>{data?.title ?? 'hyperliquid spot pair'} • hyperliquid spot pair • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hyperliquid spot pair'} • hyperliquid spot pair • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HyperliquidSpotPair, {
					$network: data.selector.$network,
					pairIndex: Number(params.pairIndex),
				}))}

		<HyperliquidSpotPairView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
