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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HyperliquidOrder, {
		$account: data.selector,
		oid: BigInt(params.oid),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidOrderView from '$/views/HyperliquidOrderView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hyperliquid order'} • hyperliquid order • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid order'} • hyperliquid order • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HyperliquidOrderView
		selection={pageSelection}
	/>
	{/if}
</Page>
