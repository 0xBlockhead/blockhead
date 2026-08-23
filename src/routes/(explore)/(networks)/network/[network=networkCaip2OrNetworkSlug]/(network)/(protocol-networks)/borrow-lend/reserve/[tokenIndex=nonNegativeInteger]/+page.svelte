<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	import HyperliquidBorrowLendReserveView from '$/views/HyperliquidBorrowLendReserveView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HyperliquidBorrowLendReserve, {
					$network: data.selector.$network,
					tokenIndex: Number(params.tokenIndex),
				}, {
					sources: [
						Source.Hyperliquid,
					],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.tokenIndex) || 'hyperliquid borrow lend reserve')} • hyperliquid borrow lend reserve • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hyperliquid borrow lend reserve'} • hyperliquid borrow lend reserve • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HyperliquidBorrowLendReserve, {
					$network: data.selector.$network,
					tokenIndex: Number(params.tokenIndex),
				}, {
					sources: [
						Source.Hyperliquid,
					],
				}))}

		<HyperliquidBorrowLendReserveView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
