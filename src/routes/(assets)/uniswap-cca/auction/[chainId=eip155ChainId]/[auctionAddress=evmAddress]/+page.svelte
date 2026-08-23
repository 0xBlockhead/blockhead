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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.UniswapCcaAuction, data.selector, {
		sources: [
			Source.UniswapContracts_Evm,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import UniswapCcaAuctionView from '$/views/UniswapCcaAuctionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.auctionAddress || 'Uniswap CCA auction')} • Uniswap CCA auction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Uniswap CCA auction'} • Uniswap CCA auction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<UniswapCcaAuctionView
		selection={pageSelection}
	/>
	{/if}
</Page>
