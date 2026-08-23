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

	const pageSelection = $derived(select(EntityType.HyperliquidBorrowLendReserve, {
		$network: data.selector.$network,
		tokenIndex: Number(params.tokenIndex),
	}, {
		sources: [
			Source.Hyperliquid,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidBorrowLendReserveView from '$/views/HyperliquidBorrowLendReserveView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.tokenIndex) || 'hyperliquid borrow lend reserve')} • hyperliquid borrow lend reserve • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidBorrowLendReserveView
		selection={pageSelection}
	/>
</Page>
