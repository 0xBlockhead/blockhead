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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HyperliquidSpotPair, {
		$network: data.selector.$network,
		pairIndex: Number(params.pairIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidSpotPairView from '$/views/HyperliquidSpotPairView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hyperliquid spot pair'} • hyperliquid spot pair • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid spot pair'} • hyperliquid spot pair • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HyperliquidSpotPairView
		selection={pageSelection}
	/>
	{/if}
</Page>
