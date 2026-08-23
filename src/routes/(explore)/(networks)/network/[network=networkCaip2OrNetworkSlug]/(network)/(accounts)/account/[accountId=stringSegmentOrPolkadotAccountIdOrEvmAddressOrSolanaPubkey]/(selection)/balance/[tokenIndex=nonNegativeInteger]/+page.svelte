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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HyperliquidBalance, {
		$account: data.selector,
		tokenIndex: Number(params.tokenIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidBalanceView from '$/views/HyperliquidBalanceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hyperliquid balance'} • hyperliquid balance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid balance'} • hyperliquid balance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HyperliquidBalanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
