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
	import HyperliquidBalanceView from '$/views/HyperliquidBalanceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HyperliquidBalance, {
					$account: data.selector,
					tokenIndex: Number(params.tokenIndex),
				}))}
			<title>{data?.title ?? 'hyperliquid balance'} • hyperliquid balance • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hyperliquid balance'} • hyperliquid balance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HyperliquidBalance, {
					$account: data.selector,
					tokenIndex: Number(params.tokenIndex),
				}))}

		<HyperliquidBalanceView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
