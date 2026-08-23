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
	import HyperliquidBorrowLendPositionView from '$/views/HyperliquidBorrowLendPositionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidBorrowLendPosition, {
				$account: data.selector,
				tokenIndex: Number(params.tokenIndex),
			}, {
				sources: [
					Source.Hyperliquid,
				],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.tokenIndex) || 'hyperliquid borrow lend position')} • hyperliquid borrow lend position • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid borrow lend position'} • hyperliquid borrow lend position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidBorrowLendPosition, {
				$account: data.selector,
				tokenIndex: Number(params.tokenIndex),
			}, {
				sources: [
					Source.Hyperliquid,
				],
			})}

	<HyperliquidBorrowLendPositionView
		selection={pageSelection}
	/>
	{/if}
</Page>
